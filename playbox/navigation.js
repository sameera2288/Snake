export function renderNavigation() {
  return `
    <header class="topbar">
      <a class="brand" href="/" aria-label="PLAYBOX home">
        <span class="brand-mark" aria-hidden="true"><span></span><span></span><span></span><span></span></span>
        <span>PLAYBOX</span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="main-navigation" aria-label="Open navigation">
        <span></span><span></span><span></span>
      </button>
      <nav id="main-navigation" class="main-nav" aria-label="Main navigation">
        <a class="nav-link active" href="#home" data-section="home">Home</a>
        <a class="nav-link" href="#games" data-section="games">All Games</a>
        <a class="nav-link" href="#favorites" data-section="favorites">Favorites</a>
        <a class="nav-link" href="#recent" data-section="recent">Recently Played</a>
      </nav>
      <div class="nav-actions">
        <button class="icon-btn" type="button" data-action="search" aria-label="Search games">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6"></circle><path d="m16 16 4 4"></path></svg>
        </button>
        <button class="studio-btn" type="button" data-action="theme-studio">Theme Studio</button>
        <label class="appearance-select">
          <span class="sr-only">Appearance</span>
          <select id="appearance-select" aria-label="Appearance">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </label>
      </div>
    </header>
  `;
}
