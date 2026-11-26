import { APPEARANCES, COLOR_THEMES } from './themes.js';

export function renderThemeStudio(currentAppearance, currentTheme) {
  return `
    <section class="theme-studio" id="theme-studio" aria-labelledby="theme-studio-title">
      <div class="section-heading theme-heading">
        <div>
          <span class="eyebrow">Make it yours</span>
          <h2 id="theme-studio-title">Theme Studio</h2>
        </div>
        <button class="reset-theme" type="button" data-action="reset-theme">Reset to default</button>
      </div>
      <div class="studio-layout">
        <div class="studio-controls">
          <fieldset class="appearance-options">
            <legend>Appearance</legend>
            <div class="appearance-buttons">
              ${APPEARANCES.map((appearance) => `
                <button type="button" class="${currentAppearance === appearance ? 'active' : ''}" data-appearance="${appearance}" aria-pressed="${currentAppearance === appearance}">
                  <span class="mode-icon ${appearance}" aria-hidden="true"></span>${appearance[0].toUpperCase() + appearance.slice(1)}
                </button>
              `).join('')}
            </div>
          </fieldset>
          <fieldset class="theme-options">
            <legend>Color theme</legend>
            <div class="theme-grid">
              ${COLOR_THEMES.map((theme) => `
                <button type="button" class="theme-choice ${currentTheme === theme.id ? 'active' : ''}" data-color-theme="${theme.id}" aria-pressed="${currentTheme === theme.id}">
                  <span class="theme-preview" aria-hidden="true">
                    ${theme.colors.map((color) => `<i style="--preview:${color}"></i>`).join('')}
                  </span>
                  <span>${theme.name}</span>
                </button>
              `).join('')}
            </div>
          </fieldset>
        </div>
        <div class="theme-live-preview" aria-label="Live theme preview">
          <div class="preview-top">
            <span class="preview-logo">PLAYBOX</span>
            <span class="preview-dots"><i></i><i></i><i></i></span>
          </div>
          <div class="preview-content">
            <div>
              <span class="preview-label">YOUR NEXT GAME</span>
              <h3>Ready, Player?</h3>
              <div class="preview-button">Explore Games</div>
            </div>
            <div class="preview-tiles">
              <span class="preview-tile pink">♥</span>
              <span class="preview-tile yellow">★</span>
              <span class="preview-tile blue">◆</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
