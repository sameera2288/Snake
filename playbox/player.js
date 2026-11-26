import './playbox.css';

const app = document.querySelector('#player-app');
const params = new URLSearchParams(window.location.search);
const gameId = params.get('game') || '';

app.innerHTML = `
  <main class="player-page">
    <header class="player-header">
      <a class="player-back" href="/playbox.html#games">← Back to Arcade</a>
      <div class="player-title">
        <span>PLAYBOX player</span>
        <strong>${gameId ? gameId.replace(/-/g, ' ') : 'Game selected'}</strong>
      </div>
    </header>
    <section class="player-shell" aria-label="Game player">
      <div class="player-empty">
        <span class="player-empty-icon">▶</span>
        <h1>Game player ready</h1>
        <p>This space is reserved for the future iframe-based game integration.</p>
        <span class="coming-label">Coming soon</span>
      </div>
      <iframe
        class="game-frame"
        title="Selected game"
        src="about:blank"
        hidden
      ></iframe>
    </section>
  </main>
`;
