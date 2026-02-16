/**
 * Scroll Reveal Animations
 * Uses IntersectionObserver to add .revealed class on scroll
 */

export function initScrollAnimations() {
    // Respect user preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}
