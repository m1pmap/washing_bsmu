document.addEventListener('DOMContentLoaded', () => {
  Telegram.WebApp.ready();

  function updateButtonTheme() {
    const theme = Telegram.WebApp.colorScheme;
    const html = document.documentElement;

    html.classList.toggle('tg-theme-dark', theme === 'dark');
    html.classList.toggle('tg-theme-light', theme === 'light');
  }

  updateButtonTheme();
  Telegram.WebApp.onEvent('themeChanged', updateButtonTheme);
});