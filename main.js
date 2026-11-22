// Controller: screens, input, the game loop and the leaderboard.
// Rules live in game-logic.js, drawing in renderer.js, look in themes.js,
// preferences in settings.js, audio in sound.js.
import { createGame, stepGame, queueTurn, MODES, SPEEDS } from './game-logic.js';
import { createRenderer } from './renderer.js';
import { THEMES, THEME_BY_ID, applyThemeCss } from './themes.js';
import { prefs, setPrefs } from './settings.js';
import { sound } from './sound.js';
import { submitScore, getTopScores } from '/star-sdk/v1/leaderboard.js';

const $ = (id) => document.getElementById(id);
const KEY_DIR = {
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
};
const SCREENS = ['menu', 'select', 'settings', 'pause', 'over'];
const OPTION_SETS = {
  mode: Object.values(MODES),
  theme: THEMES,
  speed: Object.values(SPEEDS),
};
const OPTION_TITLES = { mode: 'Game Mode', theme: 'Theme', speed: 'Speed' };

const canvas = $('board');
const renderer = createRenderer(canvas);
const boardWrap = $('board-wrap');

// phase: 'menu' | 'playing' | 'paused' | 'over'
// screen: the visible overlay name, or null while playing
let phase = 'menu';
let screen = 'menu';
let settingsReturn = 'menu';
let theme = THEME_BY_ID[prefs.theme] || THEMES[0];
let game = createGame({ mode: prefs.mode, speed: prefs.speed });
let acc = 0;
let lastTime = 0;
let best = 0;

// ---- Leaderboard (best score is shared, not localStorage) -------------------
function refreshBest() {
  getTopScores()
    .then((res) => {
      const top = res && res.scores && res.scores[0];
      const v = top ? (top.score ?? top.value) : null;
      if (typeof v === 'number' && v > best) best = v;
      updateHud();
    })
    .catch(() => {});
}

function saveScore(value) {
  best = Math.max(best, value);
  try {
    submitScore(value).catch(() => {});
  } catch (_) { /* leaderboard unavailable: keep the session best */ }
}

// ---- Screens ----------------------------------------------------------------
function showScreen(name) {
  screen = name;
  for (const k of SCREENS) $(`screen-${k}`).classList.toggle('hidden', k !== name);
  updateDpad();
}

function updateDpad() {
  $('dpad').classList.toggle('idle', phase !== 'playing');
}

function refreshMenu() {
  $('val-mode').textContent = (MODES[prefs.mode] || MODES.classic).name;
  $('val-theme').textContent = theme.name;
  $('val-speed').textContent = (SPEEDS[prefs.speed] || SPEEDS.normal).name;
}

function updateHud() {
  $('score').textContent = game.score;
  $('best').textContent = Math.max(best, game.score);
  $('run-info').textContent = `${MODES[game.mode].name} · ${game.speed.name}`;
  $('pause-score').textContent = game.score;
}

function applyTheme() {
  theme = THEME_BY_ID[prefs.theme] || THEMES[0];
  applyThemeCss(theme);
  refreshMenu();
}

function openSelect(kind) {
  $('select-title').textContent = OPTION_TITLES[kind];
  const list = $('select-list');
  list.innerHTML = '';
  for (const opt of OPTION_SETS[kind]) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pixel-btn ghost option' + (prefs[kind] === opt.id ? ' current' : '');
    const name = document.createElement('span');
    name.textContent = opt.name;
    const desc = document.createElement('span');
    desc.className = 'opt-desc';
    desc.textContent = opt.desc;
    btn.append(name, desc);
    if (kind === 'theme') {
      const sw = document.createElement('span');
      sw.className = 'swatch';
      sw.style.background = `linear-gradient(90deg, ${opt.board.a} 0 33%, ${opt.board.b} 33% 66%, ${opt.snake.body} 66%)`;
      btn.append(sw);
    }
    btn.addEventListener('click', () => {
      sound.sfx('click');
      setPrefs({ [kind]: opt.id });
      if (kind === 'theme') applyTheme();
      refreshMenu();
      showScreen('menu');
    });
    list.appendChild(btn);
  }
  showScreen('select');
}

function setToggle(id, on) {
  const b = $(id);
  b.textContent = on ? 'On' : 'Off';
  b.setAttribute('aria-pressed', String(on));
  b.classList.toggle('off', !on);
}

function syncSettings() {
  setToggle('set-music', prefs.musicOn);
  setToggle('set-sfx', prefs.sfxOn);
  const m = Math.round(prefs.musicVol * 100);
  const s = Math.round(prefs.sfxVol * 100);
  $('vol-music').value = m;
  $('out-music').textContent = m;
  $('vol-sfx').value = s;
  $('out-sfx').textContent = s;
}

function openSettings(from) {
  settingsReturn = from;
  syncSettings();
  showScreen('settings');
}

// ---- Flow -----------------------------------------------------------------
function startGame() {
  if (phase === 'playing' || phase === 'paused') return;
  game = createGame({ mode: prefs.mode, speed: prefs.speed });
  phase = 'playing';
  acc = 0;
  lastTime = 0;
  sound.unlock();
  showScreen(null);
  updateHud();
}

function endGame() {
  phase = 'over';
  const won = game.won;
  sound.sfx(won ? 'success' : 'hurt');
  saveScore(game.score);
  $('over-title').textContent = won ? 'You Win!' : 'Game Over';
  $('final-score').textContent = game.score;
  $('final-best').textContent = best;
  updateHud();
  showScreen('over');
}

function togglePause() {
  if (phase === 'playing') {
    phase = 'paused';
    showScreen('pause');
  } else if (phase === 'paused') {
    phase = 'playing';
    lastTime = 0;
    showScreen(null);
  }
  $('btn-pause').textContent = phase === 'paused' ? 'Resume (P)' : 'Pause (P)';
}

function quitToMenu() {
  phase = 'menu';
  game = createGame({ mode: prefs.mode, speed: prefs.speed });
  $('btn-pause').textContent = 'Pause (P)';
  showScreen('menu');
  updateHud();
}

// ---- Input ----------------------------------------------------------------
function handleDirection(name) {
  if (phase === 'playing') {
    queueTurn(game, name);
  } else if (phase === 'menu' && screen === 'menu') {
    startGame();
    queueTurn(game, name);
  }
}

window.addEventListener('keydown', (e) => {
  const dir = KEY_DIR[e.code];
  if (dir) {
    if (phase === 'playing' || (phase === 'menu' && screen === 'menu')) {
      e.preventDefault();
      handleDirection(dir);
    }
    return;
  }
  if (e.code === 'KeyP' || e.code === 'Escape') {
    if (screen === 'settings') {
      e.preventDefault();
      showScreen(settingsReturn);
    } else if (screen === 'select') {
      e.preventDefault();
      showScreen('menu');
    } else if (phase === 'playing' || phase === 'paused') {
      e.preventDefault();
      togglePause();
    }
    return;
  }
  if (e.code === 'Space' || e.code === 'Enter') {
    // Let focused buttons keep their own Space/Enter behaviour.
    if (e.target && e.target.tagName === 'BUTTON') return;
    if ((phase === 'menu' && screen === 'menu') || (phase === 'over' && screen === 'over')) {
      e.preventDefault();
      startGame();
    } else if (e.code === 'Space' && (phase === 'playing' || phase === 'paused')) {
      e.preventDefault();
      togglePause();
    }
  }
});

// Blur buttons after click so Space/Enter don't re-trigger them; play click SFX.
function bindButton(id, fn) {
  $(id).addEventListener('click', (e) => {
    e.currentTarget.blur();
    sound.sfx('click');
    fn();
  });
}
bindButton('btn-play', startGame);
bindButton('btn-mode', () => openSelect('mode'));
bindButton('btn-theme', () => openSelect('theme'));
bindButton('btn-speed', () => openSelect('speed'));
bindButton('btn-settings', () => openSettings('menu'));
bindButton('btn-select-back', () => showScreen('menu'));
bindButton('btn-restart', startGame);
bindButton('btn-over-menu', quitToMenu);
bindButton('btn-quit', quitToMenu);
bindButton('btn-resume', togglePause);
bindButton('btn-pause-settings', () => openSettings('pause'));
bindButton('btn-settings-back', () => showScreen(settingsReturn));
bindButton('btn-pause', () => {
  if (phase === 'playing' || phase === 'paused') togglePause();
});
bindButton('set-music', () => {
  setPrefs({ musicOn: !prefs.musicOn });
  syncSettings();
  sound.apply();
});
bindButton('set-sfx', () => {
  setPrefs({ sfxOn: !prefs.sfxOn });
  syncSettings();
});

function bindSlider(id, outId, key) {
  $(id).addEventListener('input', (e) => {
    const v = Number(e.target.value);
    setPrefs({ [key]: v / 100 });
    $(outId).textContent = v;
    sound.apply();
  });
}
bindSlider('vol-music', 'out-music', 'musicVol');
bindSlider('vol-sfx', 'out-sfx', 'sfxVol');
$('vol-sfx').addEventListener('change', () => sound.sfx('click'));

// On-screen directional pad (touch and mouse).
document.querySelectorAll('.dpad-btn').forEach((btn) => {
  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    btn.classList.add('pressed');
    handleDirection(btn.dataset.dir);
  });
  const release = () => btn.classList.remove('pressed');
  btn.addEventListener('pointerup', release);
  btn.addEventListener('pointerleave', release);
  btn.addEventListener('pointercancel', release);
});

// Swipe on the board.
let swipeStart = null;
canvas.addEventListener('pointerdown', (e) => {
  swipeStart = { x: e.clientX, y: e.clientY };
});
canvas.addEventListener('pointerup', (e) => {
  if (!swipeStart) return;
  const dx = e.clientX - swipeStart.x;
  const dy = e.clientY - swipeStart.y;
  swipeStart = null;
  if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
  if (Math.abs(dx) > Math.abs(dy)) handleDirection(dx > 0 ? 'right' : 'left');
  else handleDirection(dy > 0 ? 'down' : 'up');
});
canvas.addEventListener('pointercancel', () => { swipeStart = null; });

// Stop the page from scrolling while the player is steering.
document.addEventListener('touchmove', (e) => {
  if (phase === 'playing' && e.target.closest && e.target.closest('#board-wrap, #dpad')) {
    e.preventDefault();
  }
}, { passive: false });

// Audio starts only after the first real user gesture.
['pointerdown', 'keydown'].forEach((type) => {
  window.addEventListener(type, () => sound.unlock(), { once: true });
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden && phase === 'playing') togglePause();
});

// ---- Layout ---------------------------------------------------------------
function fitBoard() {
  const avail = Math.min(window.innerWidth - 40, window.innerHeight * 0.58, 480);
  const size = Math.max(240, Math.floor(avail));
  boardWrap.style.width = `${size + 12}px`;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
}
window.addEventListener('resize', fitBoard);

// ---- Main loop ------------------------------------------------------------
function frame(t) {
  const dt = lastTime ? Math.min(t - lastTime, 100) : 0;
  lastTime = t;
  if (phase === 'playing') {
    acc += dt;
    while (phase === 'playing' && acc >= game.tickMs) {
      acc -= game.tickMs;
      const ev = stepGame(game);
      if (ev === 'eat') {
        sound.sfx('pickup');
        updateHud();
      } else if (ev === 'die' || ev === 'win') {
        endGame();
      }
    }
  }
  const lerpT = phase === 'playing' ? Math.min(1, acc / game.tickMs) : 1;
  renderer.draw(game, theme, lerpT, t);
  requestAnimationFrame(frame);
}

// ---- Boot -----------------------------------------------------------------
applyTheme();
fitBoard();
updateHud();
showScreen('menu');
refreshBest();
requestAnimationFrame(frame);
