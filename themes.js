// Theme registry. Add a theme by appending an entry; `deco` and `food.kind`
// must match a key in renderer.js (DECOR and FOOD tables).

export const THEMES = [
  {
    id: 'forest', name: 'Forest', desc: 'Leafy greens and woodland flowers', deco: 'forest',
    ui: {
      page1: '#24562f', page2: '#0b2415', panel: '#0f2e1b', frame: '#0a1d10', ink: '#e8ffd6',
      accent: '#9dff2a', accentDark: '#3d8a0c', title: '#9dff2a', sub: '#ff5a4a', gold: '#ffd84a',
      btnInk: '#0b2415', shadow: '#061208',
    },
    board: { a: '#17472b', b: '#1a5030', line: '#0c2c18' },
    snake: { body: '#9dff2a', outline: '#2f7a08', hi: '#e6ffb8', blush: '#ff9a8a', eye: '#0a2204' },
    food: { kind: 'apple' },
  },
  {
    id: 'neon', name: 'Neon', desc: 'Dark arcade grid with glowing lines', deco: 'neon',
    ui: {
      page1: '#2a1257', page2: '#05020c', panel: '#120a2a', frame: '#060412', ink: '#e6fbff',
      accent: '#2cf6ff', accentDark: '#0a7d8c', title: '#2cf6ff', sub: '#ff2fd6', gold: '#ffe14a',
      btnInk: '#05101f', shadow: '#020109',
    },
    board: { a: '#0d0a1f', b: '#120e2b', line: '#2a1f5c', glow: '#2cf6ff' },
    snake: { body: '#2cf6ff', outline: '#0a4a80', hi: '#dffcff', blush: '#ff2fd6', eye: '#05101f' },
    food: { kind: 'orb', color: '#ff2fd6' },
  },
  {
    id: 'pastel', name: 'Pastel', desc: 'Soft lavender, pink and cream', deco: 'pastel',
    ui: {
      page1: '#c79bd9', page2: '#6c4a82', panel: '#5e3f78', frame: '#f6dcef', ink: '#fff6fb',
      accent: '#f7b6d6', accentDark: '#b47aa6', title: '#ffe3f2', sub: '#c9f0ff', gold: '#fff3b0',
      btnInk: '#3d2352', shadow: '#3a2249',
    },
    board: { a: '#fff4e6', b: '#fde7f0', line: '#f5d0e4' },
    snake: { body: '#c9a7ff', outline: '#8f6cc9', hi: '#f3eaff', blush: '#ff9ec7', eye: '#3d2352' },
    food: { kind: 'berry' },
  },
  {
    id: 'desert', name: 'Desert', desc: 'Sandy dunes, cacti and warm sun', deco: 'desert',
    ui: {
      page1: '#f2a654', page2: '#7a3f14', panel: '#6b3418', frame: '#7a4a1e', ink: '#fff3dc',
      accent: '#ffd166', accentDark: '#b8651b', title: '#ffd166', sub: '#ffb070', gold: '#ffe08a',
      btnInk: '#4a2008', shadow: '#3d1d07',
    },
    board: { a: '#f4cf86', b: '#eab96a', line: '#d69a4c' },
    snake: { body: '#4cc38a', outline: '#17603f', hi: '#c9ffe0', blush: '#ff7a5c', eye: '#10261a' },
    food: { kind: 'orange' },
  },
  {
    id: 'winter', name: 'Winter', desc: 'Icy blues with falling snow', deco: 'winter',
    ui: {
      page1: '#3a6f9a', page2: '#0d2338', panel: '#14334f', frame: '#2b5d82', ink: '#f2fbff',
      accent: '#bfeaff', accentDark: '#4a8fbf', title: '#ffffff', sub: '#8fd8ff', gold: '#ffe9a0',
      btnInk: '#0d2338', shadow: '#081828',
    },
    board: { a: '#dff3ff', b: '#cbe9fa', line: '#a9d6f0' },
    snake: { body: '#3b6fe0', outline: '#1d3f8a', hi: '#b9d6ff', blush: '#ff9ec0', eye: '#0b1d3a' },
    food: { kind: 'ice' },
  },
  {
    id: 'candy', name: 'Candy', desc: 'Pink stripes and sprinkles', deco: 'candy',
    ui: {
      page1: '#ff8ac4', page2: '#7a1f58', panel: '#8a2a66', frame: '#c2308a', ink: '#fff5fb',
      accent: '#fff06a', accentDark: '#c9a100', title: '#fff06a', sub: '#7ff0ff', gold: '#fff06a',
      btnInk: '#5a0f3a', shadow: '#4a0c2e',
    },
    board: { a: '#ffd6ea', b: '#ffeaf6', line: '#ffb3d9' },
    snake: { body: '#6ff0b0', outline: '#1f9e6a', hi: '#e6fff3', blush: '#ff5fa2', eye: '#1b1030' },
    food: { kind: 'candy' },
  },
];

export const THEME_BY_ID = Object.fromEntries(THEMES.map((t) => [t.id, t]));

// Publishes a theme's UI colours as CSS variables used by style.css.
export function applyThemeCss(theme) {
  const s = document.documentElement.style;
  const u = theme.ui;
  const map = {
    '--page-1': u.page1, '--page-2': u.page2, '--panel': u.panel, '--frame': u.frame,
    '--ink': u.ink, '--accent': u.accent, '--accent-dark': u.accentDark, '--title': u.title,
    '--sub': u.sub, '--gold': u.gold, '--btn-ink': u.btnInk, '--shadow': u.shadow,
  };
  for (const [k, v] of Object.entries(map)) s.setProperty(k, v);
}
