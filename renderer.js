// Canvas drawing: themed board, decorations, food and the cartoon snake.
// Reads game state only; never mutates it.
import { GRID, DIRS } from './game-logic.js';

export const CELL = 24;
export const BOARD_PX = GRID * CELL;

// 8x8 pixel-art apple (forest theme). R body, W highlight, D shade, G leaf, S stem.
const APPLE = [
  '....SS..',
  '.....GG.',
  '..RRRRR.',
  '.RRWRRRR',
  'RRWRRRRR',
  'RRRRRRRD',
  '.RRRRRDD',
  '..RRRDD.',
];
const APPLE_PALETTE = { R: '#e8262a', W: '#ffd0c8', D: '#8e1010', G: '#48c238', S: '#6b4a1e' };

// Deterministic pseudo-random in [0, 1) per cell, so decorations never flicker.
function hash(x, y, k = 0) {
  let h = Math.imul(x + 1, 374761393) ^ Math.imul(y + 1, 668265263) ^ Math.imul(k + 1, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function eachCell(fn) {
  for (let y = 0; y < GRID; y++) {
    for (let x = 0; x < GRID; x++) fn(x * CELL, y * CELL, x, y);
  }
}

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export function createRenderer(canvas) {
  canvas.width = BOARD_PX;
  canvas.height = BOARD_PX;
  const ctx = canvas.getContext('2d');
  return {
    draw(game, theme, t, now) {
      drawBoard(ctx, theme, now);
      if (game.food) drawFood(ctx, theme, game.food, now);
      if (game.snake.length) drawSnake(ctx, game, theme, t);
    },
  };
}

// ---- Board ----------------------------------------------------------------
function drawBoard(ctx, th, now) {
  const b = th.board;
  eachCell((px, py, x, y) => {
    ctx.fillStyle = (x + y) % 2 === 0 ? b.a : b.b;
    ctx.fillRect(px, py, CELL, CELL);
  });
  if (b.glow) {
    ctx.save();
    ctx.shadowColor = b.glow;
    ctx.shadowBlur = 8;
    drawGrid(ctx, b.glow, 0.7);
    ctx.restore();
  }
  drawGrid(ctx, b.line, 1);
  (DECOR[th.deco] || DECOR.forest)(ctx, th, now);
}

function drawGrid(ctx, color, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let i = 0; i <= GRID; i++) {
    const p = i * CELL + 0.5;
    ctx.moveTo(p, 0);
    ctx.lineTo(p, BOARD_PX);
    ctx.moveTo(0, p);
    ctx.lineTo(BOARD_PX, p);
  }
  ctx.stroke();
  ctx.restore();
}

const DECOR = {
  forest(ctx) {
    eachCell((px, py, x, y) => {
      const r = hash(x, y, 1);
      if (r < 0.09) grassTuft(ctx, px, py);
      else if (r < 0.12) flower(ctx, px, py);
      else if (r < 0.14) leaf(ctx, px, py);
    });
  },

  neon(ctx, th, now) {
    eachCell((px, py, x, y) => {
      const r = hash(x, y, 2);
      if (r > 0.07) return;
      const pulse = 0.5 + 0.5 * Math.sin(now / 350 + r * 90);
      ctx.save();
      ctx.globalAlpha = 0.35 + 0.65 * pulse;
      ctx.shadowColor = th.board.glow;
      ctx.shadowBlur = 8;
      circle(ctx, px + CELL / 2, py + CELL / 2, 2, th.board.glow);
      ctx.restore();
    });
  },

  pastel(ctx) {
    eachCell((px, py, x, y) => {
      const r = hash(x, y, 3);
      if (r < 0.1) {
        bubble(ctx, px + 5 + hash(x, y, 4) * 14, py + 5 + hash(x, y, 5) * 14, 2 + hash(x, y, 6) * 3);
      } else if (r < 0.15) {
        circle(ctx, px + CELL / 2, py + CELL / 2, 2, '#c9a7ff');
      }
    });
  },

  desert(ctx) {
    eachCell((px, py, x, y) => {
      const r = hash(x, y, 7);
      if (r < 0.08) {
        ctx.strokeStyle = '#fbe3ad';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(px + CELL * 0.45, py + CELL * 0.9, CELL * 0.45, Math.PI * 1.1, Math.PI * 1.9);
        ctx.stroke();
      } else if (r < 0.11) {
        cactus(ctx, px, py);
      } else if (r < 0.16) {
        ctx.fillStyle = '#c98a4b';
        ctx.beginPath();
        ctx.ellipse(px + 12, py + 15, 3.5, 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  },

  winter(ctx, th, now) {
    eachCell((px, py, x, y) => {
      if (hash(x, y, 8) < 0.1) {
        circle(ctx, px + 8 + hash(x, y, 9) * 8, py + 8 + hash(x, y, 10) * 8, 1.2, 'rgba(255,255,255,0.85)');
      }
    });
    // Falling snow: 36 flakes wrap around the board.
    for (let i = 0; i < 36; i++) {
      const sp = 0.5 + hash(i, 1, 11);
      const x = (hash(i, 2, 12) * BOARD_PX + now * 0.012 * sp + Math.sin(now / 900 + i) * 6 + BOARD_PX) % BOARD_PX;
      const y = (hash(i, 3, 13) * BOARD_PX + now * 0.03 * sp) % BOARD_PX;
      circle(ctx, x, y, 1.5 + hash(i, 4, 14) * 2, 'rgba(255,255,255,0.9)');
    }
  },

  candy(ctx) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = 10;
    ctx.beginPath();
    for (let k = -BOARD_PX; k <= BOARD_PX; k += 48) {
      ctx.moveTo(k, 0);
      ctx.lineTo(k + BOARD_PX, BOARD_PX);
    }
    ctx.stroke();
    ctx.restore();
    const cols = ['#ff4f8b', '#4fd3ff', '#ffe14f', '#7dff7a'];
    eachCell((px, py, x, y) => {
      if (hash(x, y, 15) >= 0.12) return;
      ctx.save();
      ctx.translate(px + 6 + hash(x, y, 16) * 12, py + 6 + hash(x, y, 17) * 12);
      ctx.rotate(hash(x, y, 18) * Math.PI);
      ctx.fillStyle = cols[Math.floor(hash(x, y, 19) * 4)];
      ctx.fillRect(-3, -1, 6, 2);
      ctx.restore();
    });
  },
};

function grassTuft(ctx, px, py) {
  ctx.save();
  ctx.strokeStyle = '#0f3d1f';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(px + 6, py + 17); ctx.quadraticCurveTo(px + 7, py + 11, px + 4, py + 8);
  ctx.moveTo(px + 10, py + 17); ctx.quadraticCurveTo(px + 11, py + 10, px + 14, py + 7);
  ctx.moveTo(px + 14, py + 17); ctx.quadraticCurveTo(px + 13, py + 12, px + 18, py + 11);
  ctx.stroke();
  ctx.restore();
}

function flower(ctx, px, py) {
  const x = px + 12, y = py + 12;
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    circle(ctx, x + Math.cos(a) * 3, y + Math.sin(a) * 3, 2, '#ff9ec7');
  }
  circle(ctx, x, y, 1.6, '#ffe066');
}

function leaf(ctx, px, py) {
  ctx.save();
  ctx.fillStyle = '#2f7a3a';
  ctx.beginPath();
  ctx.ellipse(px + 12, py + 12, 5, 2.5, -0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function bubble(ctx, x, y, r) {
  ctx.save();
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.strokeStyle = 'rgba(201,167,255,0.7)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function cactus(ctx, px, py) {
  ctx.fillStyle = '#4f8a3c';
  ctx.fillRect(px + 10, py + 6, 4, 14);
  ctx.fillRect(px + 6, py + 12, 4, 3);
  ctx.fillRect(px + 6, py + 8, 3, 7);
  ctx.fillRect(px + 14, py + 14, 4, 3);
  ctx.fillRect(px + 17, py + 10, 3, 7);
}

// ---- Food -----------------------------------------------------------------
function drawFood(ctx, th, food, now) {
  const cx = food.x * CELL + CELL / 2;
  const cy = food.y * CELL + CELL / 2 + Math.sin(now / 260) * 1.2;
  const draw = FOOD[th.food.kind] || FOOD.apple;
  draw(ctx, th, cx, cy);
}

const FOOD = {
  apple(ctx, th, cx, cy) {
    const x0 = cx - CELL / 2, y0 = cy - CELL / 2, p = CELL / 8;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const ch = APPLE[r][c];
        if (ch === '.') continue;
        ctx.fillStyle = APPLE_PALETTE[ch];
        ctx.fillRect(x0 + c * p, y0 + r * p, p, p);
      }
    }
  },

  orb(ctx, th, cx, cy) {
    const r = CELL * 0.34, color = th.food.color;
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = 14;
    const g = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 1, cx, cy, r);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(0.35, color);
    g.addColorStop(1, color);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  berry(ctx, th, cx, cy) {
    const r = CELL * 0.36;
    ctx.fillStyle = '#ff7fa0';
    ctx.beginPath();
    ctx.moveTo(cx, cy + r * 1.1);
    ctx.quadraticCurveTo(cx - r * 1.2, cy, cx - r * 0.7, cy - r * 0.7);
    ctx.quadraticCurveTo(cx, cy - r * 1.0, cx + r * 0.7, cy - r * 0.7);
    ctx.quadraticCurveTo(cx + r * 1.2, cy, cx, cy + r * 1.1);
    ctx.fill();
    ctx.fillStyle = '#6fd18a';
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.6);
    ctx.lineTo(cx - r * 0.9, cy - r * 0.8);
    ctx.lineTo(cx, cy - r * 0.2);
    ctx.lineTo(cx + r * 0.9, cy - r * 0.8);
    ctx.closePath();
    ctx.fill();
    for (const [sx, sy] of [[-0.4, 0], [0.4, 0], [0, 0.4], [-0.2, -0.2], [0.25, -0.15]]) {
      circle(ctx, cx + sx * r, cy + sy * r, 1.1, '#fff3c4');
    }
  },

  orange(ctx, th, cx, cy) {
    const r = CELL * 0.37;
    circle(ctx, cx, cy, r, '#ff9f1c');
    circle(ctx, cx - r * 0.35, cy - r * 0.35, r * 0.28, 'rgba(255,255,255,0.45)');
    ctx.save();
    ctx.fillStyle = '#4fae3a';
    ctx.beginPath();
    ctx.ellipse(cx + r * 0.35, cy - r * 0.9, 4, 2, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  ice(ctx, th, cx, cy) {
    const r = CELL * 0.4;
    ctx.save();
    ctx.fillStyle = '#8fe6ff';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r * 0.8, cy);
    ctx.lineTo(cx, cy + r);
    ctx.lineTo(cx - r * 0.8, cy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.moveTo(cx, cy - r * 0.6);
    ctx.lineTo(cx + r * 0.3, cy - r * 0.1);
    ctx.lineTo(cx - r * 0.3, cy - r * 0.1);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  },

  candy(ctx, th, cx, cy) {
    const r = CELL * 0.34;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx - 1.5, cy + r * 0.5, 3, r * 1.2);
    circle(ctx, cx, cy, r, '#ff3d7f');
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.55, 0, Math.PI * 1.6);
    ctx.stroke();
    ctx.restore();
  },
};

// ---- Snake ----------------------------------------------------------------
// Each segment slides from its previous cell to its new one, so movement is
// smooth between ticks. Segments that jump (board wrap) snap instead.
function segmentPositions(game, t) {
  const prev = game.prev;
  return game.snake.map((s, i) => {
    const p = prev && prev[i];
    let x = s.x, y = s.y;
    if (p && Math.abs(p.x - s.x) <= 1 && Math.abs(p.y - s.y) <= 1) {
      x = p.x + (s.x - p.x) * t;
      y = p.y + (s.y - p.y) * t;
    }
    return { x: x * CELL + CELL / 2, y: y * CELL + CELL / 2 };
  });
}

// Splits the body wherever it wraps across the board so no stroke crosses it.
function splitChunks(game, pts) {
  const chunks = [[pts[0]]];
  for (let i = 1; i < pts.length; i++) {
    const a = game.snake[i - 1], b = game.snake[i];
    if (Math.abs(a.x - b.x) > 1 || Math.abs(a.y - b.y) > 1) chunks.push([]);
    chunks[chunks.length - 1].push(pts[i]);
  }
  return chunks;
}

// Smooth rounded polyline: quadratic curves through segment midpoints.
function strokeSmooth(ctx, pts, width, color, dx = 0, dy = 0) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(pts[0].x + dx, pts[0].y + dy);
  if (pts.length === 1) ctx.lineTo(pts[0].x + dx + 0.01, pts[0].y + dy);
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2 + dx;
    const my = (pts[i].y + pts[i + 1].y) / 2 + dy;
    ctx.quadraticCurveTo(pts[i].x + dx, pts[i].y + dy, mx, my);
  }
  const last = pts[pts.length - 1];
  ctx.lineTo(last.x + dx, last.y + dy);
  ctx.stroke();
}

function drawSnake(ctx, game, th, t) {
  const C = CELL;
  const W = C * 0.74;          // body width
  const O = C * 0.1;           // outline thickness
  const HR = C * 0.46;         // head radius (bigger than body)
  const s = th.snake;
  const pts = segmentPositions(game, t);
  const chunks = splitChunks(game, pts);
  const head = pts[0];
  const d = DIRS[game.dir];
  const px = -d.y, py = d.x;   // perpendicular to facing

  // 1. Outline pass (body + head)
  for (const ch of chunks) strokeSmooth(ctx, ch, W + O * 2, s.outline);
  circle(ctx, head.x, head.y, HR + O, s.outline);

  // 2. Body fill, then shading
  for (const ch of chunks) strokeSmooth(ctx, ch, W, s.body);
  ctx.save();
  ctx.globalAlpha = 0.22;
  for (const ch of chunks) strokeSmooth(ctx, ch, W * 0.45, s.outline, 0, C * 0.16);
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = 0.6;
  for (const ch of chunks) strokeSmooth(ctx, ch, W * 0.22, s.hi, -C * 0.1, -C * 0.13);
  ctx.restore();

  // 3. Head fill and highlight
  circle(ctx, head.x, head.y, HR, s.body);
  ctx.save();
  ctx.globalAlpha = 0.6;
  circle(ctx, head.x - HR * 0.3, head.y - HR * 0.35, HR * 0.28, s.hi);
  ctx.restore();

  // 4. Face: blush, then two eyes with pupils and sparkles
  ctx.save();
  ctx.globalAlpha = 0.55;
  for (const side of [-1, 1]) {
    circle(ctx, head.x + px * C * 0.3 * side, head.y + py * C * 0.3 * side, C * 0.1, s.blush);
  }
  ctx.restore();
  for (const side of [-1, 1]) {
    const ex = head.x + d.x * C * 0.12 + px * C * 0.17 * side;
    const ey = head.y + d.y * C * 0.12 + py * C * 0.17 * side;
    circle(ctx, ex, ey, C * 0.14, '#ffffff');
    const pxl = ex + d.x * C * 0.05, pyl = ey + d.y * C * 0.05;
    circle(ctx, pxl, pyl, C * 0.08, s.eye);
    circle(ctx, pxl - C * 0.03, pyl - C * 0.03, C * 0.03, '#ffffff');
  }
}
