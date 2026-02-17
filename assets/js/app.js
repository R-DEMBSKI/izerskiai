/**
 * Izerski.AI - Main Application Entry Point
 * Initializes all modules based on current page
 */

import { loadComponents } from './components.js';
import { initDarkMode } from './dark-mode.js';
import { initMobileMenu } from './mobile-menu.js';
import { initSearch } from './search.js';
import { initScrollAnimations } from './scroll-animations.js';
import { initReadingProgress } from './reading-progress.js';
import { initArticles } from './articles.js';
import { initMountainScene } from './mountain-scene.js';
import { initShareButtons } from './share.js';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Load shared components (header, footer)
    await loadComponents();

    // 2. Initialize core interactive features
    initDarkMode();
    initMobileMenu();
    initSearch();

    // 3. Page-specific initialization
    const page = document.body.dataset.page;

    if (page === 'home') {
        await initArticles({ mode: 'home', limit: 6 });
    } else if (page === 'section') {
        const section = document.body.dataset.section;
        await initArticles({ mode: 'section', section: section, perPage: 12 });
    } else if (page === 'article') {
        await initArticles({ mode: 'single' });
        initReadingProgress();
        initShareButtons();
    } else if (page === 'archive') {
        await initArticles({ mode: 'archive', perPage: 20 });
    }

    // 4. Scroll animations (all pages)
    initScrollAnimations();

    // 5. Initialize mountain scene animations (home page)
    if (page === 'home') {
        initMountainScene();
    }
});
