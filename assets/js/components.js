/**
 * Shared HTML Components Loader
 * Loads header and footer fragments via fetch()
 */

// Detect base path for GitHub Pages compatibility
const BASE_PATH = getBasePath();

function getBasePath() {
    const path = window.location.pathname;
    // GitHub Pages subdirectory: extract first path segment
    // e.g., /izerskiai/index.html -> /izerskiai
    // e.g., /izerskiai/ -> /izerskiai
    const segments = path.split('/').filter(s => s.length > 0);

    // If first segment is NOT an HTML file, it's likely a subdirectory
    if (segments.length > 0 && !segments[0].endsWith('.html')) {
        return '/' + segments[0];
    }

    // Root deployment or local development
    return '.';
}

function markActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.main-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (currentPage === href ||
            (currentPage === '' && href === 'index.html') ||
            (currentPage === 'index.html' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function initHeaderScroll() {
    const header = document.getElementById('site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

async function loadComponent(elementId, filePath) {
    const el = document.getElementById(elementId);
    if (!el) return;

    try {
        const response = await fetch(`${BASE_PATH}/${filePath}`);
        if (!response.ok) throw new Error(`Failed to load ${filePath}`);
        el.innerHTML = await response.text();
    } catch (err) {
        console.error('Component load error:', err);
    }
}

export async function loadComponents() {
    await Promise.all([
        loadComponent('site-header', 'components/header.html'),
        loadComponent('site-footer', 'components/footer.html')
    ]);

    markActiveNavLink();
    initHeaderScroll();
}
