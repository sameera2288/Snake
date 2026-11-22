Snake Arcade (Snake – Snack Attack!): a retro snake game with a cute cartoon snake, six themes, two game modes (Classic wrap-around and Wall Challenge), four speeds, and a settings menu for music and effects.
Core: arrow/WASD or swipe/d-pad steering, one-turn buffer, no instant reversal, food never spawns on the snake. Snake eats apples/orbs/berries (theme-specific) to grow; speed ramps per apple (speed-specific floor).
Art: rounded smooth snake with outline, shading and eyes; per-theme board decorations (forest tufts, neon grid glow, pastel bubbles, desert cacti, winter snow, candy stripes).
Preferences (theme, mode, speed, music/sfx on-off and volumes) live in localStorage. Best score goes through the Star leaderboard (platform rule), not localStorage.
Journal:
- Upgrade to Snake Arcade: added settings, speed picker, cartoon snake, modes, themes, touch polish. Music is a synthesized chiptune loop via Star audio synth (Music generation is not on the free tier). Verified in browser: menu, pause, settings, mode/theme pickers, wall death, classic wrap, mobile layout.
- Initial build: canvas board, start/pause/game-over screens, Star audio SFX, Star leaderboard for best score (not localStorage, per platform rules).
