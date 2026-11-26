import './playbox.css';
import { GAMES } from './catalogue.js';
import { renderNavigation } from './navigation.js';
import { renderGameCard } from './game-card.js';
import { renderThemeStudio } from './theme-studio.js';
import { applyTheme, getInitialPreferences, saveAppearance, saveColorTheme } from './theme-manager.js';
import { FAVORITES_KEY, RECENTS_KEY, readList, writeList } from './storage.js';

const app = document.querySelector('#app');
let favorites = readList(FAVORITES_KEY);
let recents = readList(RECENTS_KEY);
let preferences = getInitialPreferences();
let activeCategory = 'All';

const cardsMarkup = (games) => games.map((game) => renderGameCard(game, favorites.includes(game.id))).join('');

function allGamesMarkup() {
  return GAMES.map((game) => renderGameCard(game, favorites.includes(game.id))).join('');
}

app.innerHTML = `
  ${renderNavigation()}
  <main>
    <section class="hero" id="home">
      <div class="hero-copy">
        <span class="eyebrow">Welcome to PLAYBOX</span>
        <h1>Ready, <span>Player?</span></h1>
        <p>Pick a game, find your favorite and turn a few spare minutes into a great high-score run.</p>
        <a class="hero-button" href="#games">Explore Games <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"></path></svg></a>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="hero-grid"></div>
        <div class="floating-game game-card-mini pink-card"><span>×</span><span>○</span></div>
        <div class="floating-game game-card-mini yellow-card"><b>2048</b></div>
        <div class="controller">
          <i class="dpad-horizontal"></i><i class="dpad-vertical"></i>
          <span class="controller-dot dot-one"></span><span class="controller-dot dot-two"></span>
        </div>
        <span class="spark spark-one">✦</span><span class="spark spark-two">◆</span><span class="spark spark-three">●</span>
      </div>
    </section>

    <section class="featured" aria-labelledby="featured-title">
      <div class="section-heading">
        <div><span class="eyebrow">Top picks</span><h2 id="featured-title">Featured Games</h2></div>
        <a href="#games" class="text-link">View all <span>→</span></a>
      </div>
      <div class="game-grid featured-grid">${cardsMarkup(GAMES.slice(0, 6))}</div>
    </section>

    <section class="catalogue" id="games" aria-labelledby="all-games-title">
      <div class="section-heading">
        <div><span class="eyebrow">Browse the box</span><h2 id="all-games-title">All Games</h2></div>
      </div>
      <div class="filter-bar">
        <div class="category-filters" aria-label="Filter games by category">
          ${['All', 'Arcade', 'Puzzle', 'Strategy', 'Casual'].map((category) => `<button type="button" class="${category === 'All' ? 'active' : ''}" data-category-filter="${category}" aria-pressed="${category === 'All'}">${category}</button>`).join('')}
        </div>
        <label class="catalogue-search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"></circle><path d="m16 16 4 4"></path></svg>
          <span class="sr-only">Search games</span>
          <input id="game-search" type="search" placeholder="Search games..." autocomplete="off" />
        </label>
      </div>
      <div class="game-grid" id="catalogue-grid">${allGamesMarkup()}</div>
      <div class="empty-state" id="catalogue-empty" hidden>
        <span>⌕</span><h3>No games found</h3><p>Try another name or category.</p>
      </div>
    </section>

    <section class="favorites-section" id="favorites" aria-labelledby="favorites-title">
      <div class="section-heading">
        <div><span class="eyebrow">Saved for later</span><h2 id="favorites-title">Favorites</h2></div>
      </div>
      <div class="game-grid" id="favorites-grid"></div>
      <div class="empty-state" id="favorites-empty"><span>♡</span><h3>No favorites yet</h3><p>Tap the heart on a game to save it here.</p></div>
    </section>

    <section class="recent-section" id="recent" aria-labelledby="recent-title">
      <div class="section-heading">
        <div><span class="eyebrow">Jump back in</span><h2 id="recent-title">Recently Played</h2></div>
      </div>
      <div class="game-grid" id="recent-grid"></div>
      <div class="empty-state" id="recent-empty"><span>↻</span><h3>Nothing played yet</h3><p>Your recently opened games will appear here.</p></div>
    </section>

    ${renderThemeStudio(preferences.appearance, preferences.colorTheme)}
  </main>
  <footer><a class="brand footer-brand" href="#home"><span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span><span></span></span><span>PLAYBOX</span></a><p>Pick a game. Play your way.</p></footer>
`;

applyTheme(preferences.colorTheme, preferences.appearance);

const appearanceSelect = document.querySelector('#appearance-select');
appearanceSelect.value = preferences.appearance;

function refreshFavorites() {
  const games = GAMES.filter((game) => favorites.includes(game.id));
  document.querySelector('#favorites-grid').innerHTML = cardsMarkup(games);
  document.querySelector('#favorites-empty').hidden = games.length > 0;
  document.querySelector('#favorites-grid').hidden = games.length === 0;
}

function refreshRecents() {
  const games = recents.map((id) => GAMES.find((game) => game.id === id)).filter(Boolean);
  document.querySelector('#recent-grid').innerHTML = cardsMarkup(games);
  document.querySelector('#recent-empty').hidden = games.length > 0;
  document.querySelector('#recent-grid').hidden = games.length === 0;
}

function filterGames() {
  const query = document.querySelector('#game-search').value.trim().toLowerCase();
  const matches = GAMES.filter((game) => {
    const categoryMatches = activeCategory === 'All' || game.category === activeCategory;
    return categoryMatches && (!query || game.title.toLowerCase().includes(query) || game.description.toLowerCase().includes(query));
  });
  document.querySelector('#catalogue-grid').innerHTML = cardsMarkup(matches);
  document.querySelector('#catalogue-grid').hidden = matches.length === 0;
  document.querySelector('#catalogue-empty').hidden = matches.length !== 0;
}

function setAppearance(appearance) {
  preferences.appearance = appearance;
  saveAppearance(appearance);
  applyTheme(preferences.colorTheme, appearance);
  appearanceSelect.value = appearance;
  document.querySelectorAll('[data-appearance]').forEach((button) => {
    const active = button.dataset.appearance === appearance;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

document.querySelectorAll('[data-category-filter]').forEach((button) => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.categoryFilter;
    document.querySelectorAll('[data-category-filter]').forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    filterGames();
  });
});

document.querySelector('#game-search').addEventListener('input', filterGames);

appearanceSelect.addEventListener('change', (event) => setAppearance(event.target.value));

document.querySelectorAll('[data-appearance]').forEach((button) => {
  button.addEventListener('click', () => setAppearance(button.dataset.appearance));
});

document.querySelectorAll('[data-color-theme]').forEach((button) => {
  button.addEventListener('click', () => {
    preferences.colorTheme = button.dataset.colorTheme;
    saveColorTheme(preferences.colorTheme);
    applyTheme(preferences.colorTheme, preferences.appearance);
    document.querySelectorAll('[data-color-theme]').forEach((choice) => {
      const active = choice === button;
      choice.classList.toggle('active', active);
      choice.setAttribute('aria-pressed', String(active));
    });
  });
});

document.querySelector('[data-action="reset-theme"]').addEventListener('click', () => {
  preferences = { appearance: 'system', colorTheme: 'candy-pop' };
  saveAppearance(preferences.appearance);
  saveColorTheme(preferences.colorTheme);
  applyTheme(preferences.colorTheme, preferences.appearance);
  appearanceSelect.value = preferences.appearance;
  document.querySelectorAll('[data-appearance]').forEach((button) => {
    const active = button.dataset.appearance === 'system';
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll('[data-color-theme]').forEach((button) => {
    const active = button.dataset.colorTheme === 'candy-pop';
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
});

app.addEventListener('click', (event) => {
  const favoriteButton = event.target.closest('[data-favorite]');
  if (favoriteButton) {
    const id = favoriteButton.dataset.favorite;
    favorites = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    writeList(FAVORITES_KEY, favorites);
    document.querySelectorAll(`[data-favorite="${id}"]`).forEach((button) => {
      const active = favorites.includes(id);
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
      const name = GAMES.find((game) => game.id === id)?.title || id;
      button.setAttribute('aria-label', `${active ? 'Remove' : 'Add'} ${name} ${active ? 'from' : 'to'} favorites`);
    });
    refreshFavorites();
    filterGames();
  }

  const playButton = event.target.closest('[data-play]');
  if (playButton) {
    const id = playButton.dataset.play;
    const game = GAMES.find((item) => item.id === id);
    if (!game.existing) return;
    recents = [id, ...recents.filter((item) => item !== id)].slice(0, 8);
    writeList(RECENTS_KEY, recents);
    refreshRecents();
    window.location.href = `/player.html?game=${encodeURIComponent(id)}`;
  }
});

document.querySelector('[data-action="search"]').addEventListener('click', () => {
  document.querySelector('#games').scrollIntoView({ behavior: 'smooth' });
  window.setTimeout(() => document.querySelector('#game-search').focus(), 350);
});

document.querySelector('[data-action="theme-studio"]').addEventListener('click', () => {
  document.querySelector('#theme-studio').scrollIntoView({ behavior: 'smooth' });
});

const navToggle = document.querySelector('.nav-toggle');
navToggle.addEventListener('click', () => {
  const open = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!open));
  document.querySelector('.main-nav').classList.toggle('open', !open);
});

document.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
    document.querySelector('.main-nav').classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
systemTheme.addEventListener?.('change', () => {
  if (preferences.appearance === 'system') applyTheme(preferences.colorTheme, 'system');
});

refreshFavorites();
refreshRecents();
