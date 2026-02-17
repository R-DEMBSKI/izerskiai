/**
 * Share Buttons Module
 * Adds elegant share functionality to article pages
 */

export function initShareButtons() {
    // Wait for article to render
    const checkArticle = setInterval(() => {
        const articleFooter = document.querySelector('.article-footer');
        if (!articleFooter) return;
        clearInterval(checkArticle);

        const title = document.querySelector('.article-title')?.textContent || document.title;
        const url = window.location.href;
        const excerpt = document.querySelector('.article-body p')?.textContent?.slice(0, 140) || '';

        // Create share bar
        const shareBar = document.createElement('div');
        shareBar.className = 'share-bar animate-on-scroll';
        shareBar.innerHTML = `
            <div class="share-bar-label">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                </svg>
                <span>Udostepnij artykul</span>
            </div>
            <div class="share-buttons">
                <button class="share-btn share-btn--facebook" data-platform="facebook" aria-label="Udostepnij na Facebooku" title="Facebook">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                </button>
                <button class="share-btn share-btn--twitter" data-platform="twitter" aria-label="Udostepnij na X/Twitter" title="X / Twitter">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                <button class="share-btn share-btn--linkedin" data-platform="linkedin" aria-label="Udostepnij na LinkedIn" title="LinkedIn">
                    <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </button>
                <button class="share-btn share-btn--copy" data-platform="copy" aria-label="Kopiuj link" title="Kopiuj link">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                </button>
                <button class="share-btn share-btn--native" data-platform="native" aria-label="Wiecej opcji udostepniania" title="Wiecej opcji" style="${navigator.share ? '' : 'display:none'}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                </button>
            </div>
            <div class="share-toast" id="share-toast" aria-live="polite"></div>
        `;

        // Insert before agent card
        const agentCard = articleFooter.querySelector('.agent-card');
        if (agentCard) {
            articleFooter.insertBefore(shareBar, agentCard);
        } else {
            articleFooter.appendChild(shareBar);
        }

        // Click handlers
        shareBar.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const platform = btn.dataset.platform;
                const encodedUrl = encodeURIComponent(url);
                const encodedTitle = encodeURIComponent(title);
                const encodedExcerpt = encodeURIComponent(excerpt);

                switch (platform) {
                    case 'facebook':
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank', 'width=600,height=400');
                        break;
                    case 'twitter':
                        window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`, '_blank', 'width=600,height=400');
                        break;
                    case 'linkedin':
                        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedExcerpt}`, '_blank', 'width=600,height=400');
                        break;
                    case 'copy':
                        navigator.clipboard.writeText(url).then(() => {
                            showToast(shareBar, 'Link skopiowany!');
                            btn.classList.add('copied');
                            setTimeout(() => btn.classList.remove('copied'), 2000);
                        }).catch(() => {
                            // Fallback
                            const ta = document.createElement('textarea');
                            ta.value = url;
                            document.body.appendChild(ta);
                            ta.select();
                            document.execCommand('copy');
                            document.body.removeChild(ta);
                            showToast(shareBar, 'Link skopiowany!');
                        });
                        break;
                    case 'native':
                        if (navigator.share) {
                            navigator.share({ title, text: excerpt, url });
                        }
                        break;
                }

                // Ripple effect
                createRipple(btn, e);
            });
        });
    }, 100);
}

function showToast(shareBar, message) {
    const toast = shareBar.querySelector('.share-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2500);
}

function createRipple(button, event) {
    const ripple = document.createElement('span');
    ripple.className = 'share-ripple';
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
}
