export const APPEARANCE_KEY = 'playbox:appearance';
export const COLOR_THEME_KEY = 'playbox:color-theme';

export const APPEARANCES = ['light', 'dark', 'system'];

export const COLOR_THEMES = [
  { id: 'candy-pop', name: 'Candy Pop', colors: ['#ff77b7', '#8d68ff', '#ffd84d'] },
  { id: 'minty-fresh', name: 'Minty Fresh', colors: ['#63dfa1', '#43af94', '#84d9ef'] },
  { id: 'lavender-dream', name: 'Lavender Dream', colors: ['#a991ff', '#d7afff', '#ffaad6'] },
  { id: 'peachy', name: 'Peachy', colors: ['#ffb38a', '#ff7f78', '#fff0d2'] },
  { id: 'ocean-splash', name: 'Ocean Splash', colors: ['#78caff', '#41c8c1', '#3478ff'] },
  { id: 'retro-arcade', name: 'Retro Arcade', colors: ['#ffbe55', '#ff6b45', '#4d88ff'] },
  { id: 'forest-quest', name: 'Forest Quest', colors: ['#91ad72', '#c1aa78', '#5d7b61'] },
  { id: 'bubblegum', name: 'Bubblegum', colors: ['#ff74ba', '#9b72ff', '#70dfee'] },
];

export const THEME_VALUES = {
  'candy-pop': {
    light: { accent: '#7357ff', accent2: '#ff70b7', accent3: '#ffd84d', bg: '#fbf8ff', surface: '#ffffff', surface2: '#f2edff', text: '#25213a', muted: '#716b86', border: '#e7e0f7' },
    dark: { accent: '#a18cff', accent2: '#ff82c4', accent3: '#ffdd69', bg: '#171321', surface: '#211d30', surface2: '#2d2740', text: '#f8f5ff', muted: '#c1bad3', border: '#403752' },
  },
  'minty-fresh': {
    light: { accent: '#159b78', accent2: '#72ddb2', accent3: '#77c9ed', bg: '#f4fbf8', surface: '#ffffff', surface2: '#eaf7f1', text: '#17372f', muted: '#60766f', border: '#cee8dc' },
    dark: { accent: '#70dfb4', accent2: '#51bba2', accent3: '#85d7ef', bg: '#10231f', surface: '#17302a', surface2: '#1d3d35', text: '#edfdf7', muted: '#b3cec4', border: '#31584d' },
  },
  'lavender-dream': {
    light: { accent: '#8168cf', accent2: '#bd8fdd', accent3: '#f09ec5', bg: '#faf7ff', surface: '#ffffff', surface2: '#f2ecfb', text: '#33284a', muted: '#746981', border: '#e4daef' },
    dark: { accent: '#b29af3', accent2: '#cf9ee9', accent3: '#f1a4cb', bg: '#1b1727', surface: '#292239', surface2: '#342a49', text: '#faf7ff', muted: '#c5bdd1', border: '#493e5d' },
  },
  'peachy': {
    light: { accent: '#d95d53', accent2: '#f79b75', accent3: '#efca74', bg: '#fff9f3', surface: '#ffffff', surface2: '#fff0e4', text: '#4b312b', muted: '#816860', border: '#efded0' },
    dark: { accent: '#ff9a86', accent2: '#f78a70', accent3: '#ffd78c', bg: '#281b18', surface: '#392724', surface2: '#48322d', text: '#fff7f1', muted: '#d3bbb3', border: '#60443d' },
  },
  'ocean-splash': {
    light: { accent: '#3478db', accent2: '#4ec0c7', accent3: '#78caff', bg: '#f4faff', surface: '#ffffff', surface2: '#eaf5ff', text: '#20344c', muted: '#62758a', border: '#cfe3f5' },
    dark: { accent: '#75baff', accent2: '#68d6ce', accent3: '#91cbff', bg: '#101e2d', surface: '#172a3d', surface2: '#20384e', text: '#f1f8ff', muted: '#b7cadc', border: '#35516b' },
  },
  'retro-arcade': {
    light: { accent: '#c74d2d', accent2: '#f09a3e', accent3: '#4d88ff', bg: '#fffaf0', surface: '#fffdf7', surface2: '#f7eddb', text: '#3a3026', muted: '#786958', border: '#e8dcc7' },
    dark: { accent: '#ff9a60', accent2: '#ffd06a', accent3: '#75a3ff', bg: '#241a18', surface: '#332421', surface2: '#42302b', text: '#fff8ed', muted: '#d2c1b2', border: '#61483d' },
  },
  'forest-quest': {
    light: { accent: '#667c51', accent2: '#91ad72', accent3: '#c1aa78', bg: '#f7f8f1', surface: '#ffffff', surface2: '#edf1e4', text: '#30372a', muted: '#6d7464', border: '#d8dfcb' },
    dark: { accent: '#aec78e', accent2: '#91ad72', accent3: '#d1b989', bg: '#1b2118', surface: '#263020', surface2: '#303d2c', text: '#f4f7ed', muted: '#c1cbb7', border: '#46533f' },
  },
  'bubblegum': {
    light: { accent: '#9b72ff', accent2: '#ff74ba', accent3: '#70dfee', bg: '#fff7fc', surface: '#ffffff', surface2: '#f8edff', text: '#422d4b', muted: '#7a687d', border: '#eadcf0' },
    dark: { accent: '#b99cff', accent2: '#ff91c9', accent3: '#82e5ee', bg: '#211724', surface: '#302236', surface2: '#3d2948', text: '#fff7fd', muted: '#ccbcd1', border: '#57405f' },
  },
};
