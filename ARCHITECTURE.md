# Architecture

Files (all ES modules, no build):
- `index.html`: all screens as overlays inside `#board-wrap` (menu, select, settings, pause, over), HUD, d-pad.
- `style.css`: layout and components; colours come from CSS variables set by `themes.js`.
- `main.js`: controller. Owns `phase` (menu|playing|paused|over), `screen` (overlay name), the game object, input, the loop, and the leaderboard calls.
- `game-logic.js`: pure rules. `createGame`, `stepGame` (returns move|eat|die|win), `queueTurn`, `spawnFood`, `tickFor`. MODES (classic wraps, wall kills) and SPEEDS live here.
- `renderer.js`: canvas drawing. `createRenderer(canvas).draw(game, theme, t, now)`. Tables: `DECOR` (per-theme board decorations, keyed by `theme.deco`) and `FOOD` (keyed by `theme.food.kind`). Snake is drawn with smoothed polylines; `t` interpolates segments between ticks using `game.prev`.
- `themes.js`: `THEMES` array (add a theme by appending an entry with `deco` and `food.kind` that exist in renderer.js), `THEME_BY_ID`, `applyThemeCss`.
- `settings.js`: `prefs` object persisted to localStorage under one key; `setPrefs(patch)`.
- `sound.js`: Star audio wrapper. `sound.unlock()` on first gesture, `sound.apply()` after volume/toggle changes, `sound.sfx(name)`. Music is a synthesized square-wave loop (`MUSIC_DEF`).

Dependencies: main -> game-logic, renderer, themes, settings, sound, leaderboard SDK. renderer -> game-logic (GRID, DIRS). sound -> settings. themes has no imports.

Key state: `game = { snake[], prev[], dir, queue[], food, score, eaten, tickMs, speed, mode, wrap, over, won }`. `prefs = { theme, mode, speed, musicOn, sfxOn, musicVol, sfxVol }`.
