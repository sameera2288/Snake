const STORAGE_KEY = 'snake-game-leaderboard';
const MAX_SCORES = 10;

function readScores() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  const scores = JSON.parse(stored);
  if (!Array.isArray(scores) || !scores.every((score) => Number.isFinite(score))) {
    throw new Error('Stored leaderboard data is invalid.');
  }
  return scores;
}

export async function getTopScores() {
  return { scores: readScores().map((score) => ({ score })) };
}

export async function submitScore(score) {
  if (!Number.isFinite(score)) throw new TypeError('Score must be a finite number.');

  const scores = [...readScores(), score]
    .sort((left, right) => right - left)
    .slice(0, MAX_SCORES);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  return { score };
}
