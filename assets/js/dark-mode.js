/**
 * Dark Mode Toggle
 * Persists preference in localStorage, respects system preference
 */

const STORAGE_KEY = 'izerski-theme';

export function initDarkMode() {
    const toggle = document.querySelector('.dark-mode-toggle');
    if (!toggle) return;

    // Sync toggle state with current theme
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    toggle.setAttribute('aria-checked', String(currentTheme === 'dark'));

    toggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const newTheme = isDark ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem(STORAGE_KEY, newTheme);
        toggle.setAttribute('aria-checked', String(!isDark));
    });

    // If no stored preference, respect system preference
    if (!localStorage.getItem(STORAGE_KEY)) {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
            toggle.setAttribute('aria-checked', 'true');
        }
    }
}
