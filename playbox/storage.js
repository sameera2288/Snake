export const FAVORITES_KEY = 'playbox:favorites';
export const RECENTS_KEY = 'playbox:recently-played';

export function readList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function writeList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
