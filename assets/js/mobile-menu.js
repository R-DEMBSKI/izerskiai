/**
 * Mobile Menu (Hamburger)
 * Creates a separate overlay div outside header to avoid stacking context issues
 */

export function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    // Create a separate overlay element OUTSIDE the header
    let overlay = document.querySelector('.mobile-nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'mobile-nav-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-label', 'Menu nawigacyjne');

        // Clone nav links into the overlay
        nav.querySelectorAll('a').forEach(link => {
            const clone = link.cloneNode(true);
            overlay.appendChild(clone);
        });

        // Insert overlay right after the header, as a sibling
        const header = document.getElementById('site-header');
        if (header && header.parentNode) {
            header.parentNode.insertBefore(overlay, header.nextSibling);
        } else {
            document.body.appendChild(overlay);
        }

        // Mark active link in overlay
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        overlay.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (currentPage === href ||
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    function closeMenu() {
        overlay.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    }

    function openMenu() {
        overlay.classList.add('is-open');
        toggle.classList.add('is-active');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
    }

    toggle.addEventListener('click', () => {
        if (overlay.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
            closeMenu();
            toggle.focus();
        }
    });

    // Close on nav link click
    overlay.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            closeMenu();
        }
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && overlay.classList.contains('is-open')) {
            closeMenu();
        }
    });
}
