function illustration(game) {
  const icons = {
    snake: '<span class="mini-snake"><i></i><i></i><i></i><b></b></span>',
    grid: '<span class="grid-art"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>',
    tiles: '<span class="tile-art"><i>2</i><i>4</i><i>8</i><i>16</i></span>',
    blocks: '<span class="block-art"><i></i><i></i><i></i><i></i><i></i></span>',
    bricks: '<span class="brick-art"><i></i><i></i><i></i><i></i><i></i><i></i><b></b></span>',
    cards: '<span class="card-art"><i>★</i><i>◆</i><i>♥</i></span>',
  };
  return icons[game.icon] || icons.grid;
}

export function renderGameCard(game, favorite = false) {
  return `
    <article class="game-card" data-game-id="${game.id}" data-category="${game.category}">
      <div class="game-art accent-${game.accent}">
        ${illustration(game)}
        ${game.existing ? '<span class="existing-badge">Playable soon</span>' : '<span class="soon-badge">Coming soon</span>'}
      </div>
      <div class="game-card-body">
        <div class="game-card-heading">
          <div>
            <span class="game-category">${game.category}</span>
            <h3>${game.title}</h3>
          </div>
          <button class="favorite-btn ${favorite ? 'active' : ''}" type="button" data-favorite="${game.id}" aria-label="${favorite ? 'Remove' : 'Add'} ${game.title} ${favorite ? 'from' : 'to'} favorites" aria-pressed="${favorite}">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-4.35-9.2-8.3C.9 9.3 2.6 5.5 6.1 5.1c2.2-.2 4.1 1.1 5.9 3.2 1.8-2.1 3.7-3.4 5.9-3.2 3.5.4 5.2 4.2 3.3 7.6C18.9 16.65 12 21 12 21Z"></path></svg>
          </button>
        </div>
        <p>${game.description}</p>
        <button class="play-btn" type="button" data-play="${game.id}" ${game.existing ? '' : 'aria-disabled="true"'}>
          <span>${game.existing ? 'Preview Player' : 'Coming soon'}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"></path></svg>
        </button>
      </div>
    </article>
  `;
}
