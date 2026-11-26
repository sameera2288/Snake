import { APPEARANCE_KEY, COLOR_THEME_KEY, THEME_VALUES } from './themes.js';

function readStored(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

export function getInitialPreferences() {
  return {
    appearance: readStored(APPEARANCE_KEY, 'system'),
    colorTheme: readStored(COLOR_THEME_KEY, 'candy-pop'),
  };
}

export function saveAppearance(value) {
  localStorage.setItem(APPEARANCE_KEY, value);
}

export function saveColorTheme(value) {
  localStorage.setItem(COLOR_THEME_KEY, value);
}

export function resolvedAppearance(appearance) {
  if (appearance === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return appearance;
}

export function applyTheme(colorTheme, appearance) {
  const themeSet = THEME_VALUES[colorTheme] || THEME_VALUES['candy-pop'];
  const mode = resolvedAppearance(appearance);
  const values = themeSet[mode];
  const root = document.documentElement;
  root.dataset.theme = colorTheme;
  root.dataset.appearance = mode;
  root.style.colorScheme = mode;
  Object.entries(values).forEach(([name, value]) => root.style.setProperty(`--${name}`, value));
}
