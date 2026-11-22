// Pure snake rules: no DOM, no audio. Renderer and main.js consume this state.

export const GRID = 20;
export const POINTS = 10;

export const DIRS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
export const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

// Classic wraps around the edges; Wall Challenge kills on any boundary touch.
export const MODES = {
  classic: { id: 'classic', name: 'Classic', desc: 'Pass through edges and reappear on the far side', wrap: true },
  wall: { id: 'wall', name: 'Wall Challenge', desc: 'Touch any boundary and the run ends', wrap: false },
};

// start/step/min are milliseconds per move. Each apple shortens the interval by `step`.
export const SPEEDS = {
  slow: { id: 'slow', name: 'Slow', desc: 'Relaxed pace to learn the board', start: 240, step: 3, min: 150 },
  normal: { id: 'normal', name: 'Normal', desc: 'Comfortable default', start: 190, step: 3.5, min: 100 },
  fast: { id: 'fast', name: 'Fast', desc: 'Quick reflexes needed', start: 140, step: 3.5, min: 75 },
  extreme: { id: 'extreme', name: 'Extreme', desc: 'Only for the brave', start: 95, step: 2.5, min: 55 },
};

const same = (a, b) => a.x === b.x && a.y === b.y;

export function tickFor(speed, eaten) {
  return Math.max(speed.min, speed.start - eaten * speed.step);
}

export function createGame({ mode = 'classic', speed = 'normal', rnd = Math.random } = {}) {
  const m = MODES[mode] || MODES.classic;
  const s = SPEEDS[speed] || SPEEDS.normal;
  const mid = Math.floor(GRID / 2);
  const g = {
    mode: m.id,
    wrap: m.wrap,
    speed: s,
    grid: GRID,
    snake: [{ x: mid, y: mid }, { x: mid - 1, y: mid }, { x: mid - 2, y: mid }],
    prev: null, // snake positions before the last move, used for smooth rendering
    dir: 'right',
    queue: [],
    food: null,
    score: 0,
    eaten: 0,
    tickMs: s.start,
    over: false,
    won: false,
  };
  g.food = spawnFood(g, rnd);
  return g;
}

export function spawnFood(g, rnd = Math.random) {
  const occupied = new Set(g.snake.map((s) => s.y * g.grid + s.x));
  const free = [];
  for (let i = 0; i < g.grid * g.grid; i++) {
    if (!occupied.has(i)) free.push(i);
  }
  if (free.length === 0) return null;
  const idx = free[Math.floor(rnd() * free.length)];
  return { x: idx % g.grid, y: Math.floor(idx / g.grid) };
}

// Queue up to two turns; never reverse into the snake's own neck.
export function queueTurn(g, name) {
  if (g.over) return;
  const last = g.queue.length ? g.queue[g.queue.length - 1] : g.dir;
  if (name === last || name === OPPOSITE[last]) return;
  if (g.queue.length >= 2) return;
  g.queue.push(name);
}

// Advances one tick. Returns 'move' | 'eat' | 'die' | 'win' | null (already over).
export function stepGame(g, rnd = Math.random) {
  if (g.over) return null;
  if (g.queue.length) g.dir = g.queue.shift();
  const d = DIRS[g.dir];
  let x = g.snake[0].x + d.x;
  let y = g.snake[0].y + d.y;
  if (g.wrap) {
    x = (x + g.grid) % g.grid;
    y = (y + g.grid) % g.grid;
  } else if (x < 0 || y < 0 || x >= g.grid || y >= g.grid) {
    return kill(g);
  }
  const head = { x, y };
  const eats = !!g.food && same(head, g.food);
  // The tail moves away this tick unless we grow, so it only blocks when growing.
  const body = eats ? g.snake : g.snake.slice(0, -1);
  if (body.some((s) => same(s, head))) return kill(g);

  g.prev = g.snake.map((s) => ({ x: s.x, y: s.y }));
  g.snake.unshift(head);
  if (!eats) {
    g.snake.pop();
    return 'move';
  }
  g.score += POINTS;
  g.eaten += 1;
  g.tickMs = tickFor(g.speed, g.eaten);
  g.food = spawnFood(g, rnd);
  if (!g.food) {
    g.over = true;
    g.won = true;
    return 'win';
  }
  return 'eat';
}

function kill(g) {
  g.over = true;
  return 'die';
}
