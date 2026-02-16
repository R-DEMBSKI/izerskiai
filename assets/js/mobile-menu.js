/**
 * Mobile Menu (Hamburger)
 */

export function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');
    if (!toggle || !nav) return;

    function closeMenu() {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    }

    function openMenu() {
        nav.classList.add('is-open');
        toggle.classList.add('is-active');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.classList.add('menu-open');
    }

    toggle.addEventListener('click', () => {
        const isOpen = nav.classList.contains('is-open');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
            closeMenu();
            toggle.focus();
        }
    });

    // Close on nav link click
    nav.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            closeMenu();
        }
    });

    // Close on resize to desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && nav.classList.contains('is-open')) {
            closeMenu();
        }
    });
}
