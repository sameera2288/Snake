// Player preferences, saved in localStorage as one record.
// High scores are NOT stored here: they go through the Star leaderboard.

const KEY = 'snake-arcade-prefs';

const DEFAULTS = {
  theme: 'forest',
  mode: 'classic',
  speed: 'normal',
  musicOn: true,
  sfxOn: true,
  musicVol: 0.5,
  sfxVol: 0.7,
};

const clamp01 = (v) => Math.max(0, Math.min(1, v));

function load() {
  const out = { ...DEFAULTS };
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {};
    for (const k of Object.keys(DEFAULTS)) {
      if (typeof saved[k] === typeof DEFAULTS[k]) out[k] = saved[k];
    }
  } catch (_) { /* corrupt or unavailable storage: use defaults */ }
  out.musicVol = clamp01(out.musicVol);
  out.sfxVol = clamp01(out.sfxVol);
  return out;
}

export const prefs = load();

export function setPrefs(patch) {
  Object.assign(prefs, patch);
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch (_) { /* storage full or blocked: keep the in-memory value */ }
}
