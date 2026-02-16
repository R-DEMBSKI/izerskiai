/**
 * Reading Progress Bar
 * Shows scroll progress on article pages
 */

export function initReadingProgress() {
    const bar = document.getElementById('reading-progress');
    const article = document.querySelector('.article-body');
    if (!bar || !article) return;

    function updateProgress() {
        const articleTop = article.offsetTop;
        const articleHeight = article.offsetHeight;
        const windowHeight = window.innerHeight;
        const scrolled = window.scrollY - articleTop + windowHeight * 0.3;
        const progress = Math.min(Math.max(scrolled / articleHeight, 0), 1);
        bar.style.width = `${progress * 100}%`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}
