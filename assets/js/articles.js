/**
 * Articles Engine
 * Fetches, renders, filters, and paginates articles
 */

const BASE_PATH = getBasePath();
let articlesCache = null;

function getBasePath() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(s => s.length > 0);
    if (segments.length > 0 && !segments[0].endsWith('.html')) {
        return '/' + segments[0];
    }
    return '.';
}

const CATEGORY_NAMES = {
    'aktualnosci': 'Aktualności',
    'historia-kultura': 'Historia i Kultura',
    'turystyka-natura': 'Turystyka i Natura',
    'felietony-opinie': 'Felietony i Opinie'
};

const AGENT_INFO = {
    'REPORTER': { avatar: '📰', name: 'Reporter', role: 'Dziennikarz Fakt' },
    'PRZEWODNIK': { avatar: '🥾', name: 'Przewodnik', role: 'Ekspert Turystyczny' },
    'PUBLICYSTA': { avatar: '📝', name: 'Publicysta', role: 'Głos Społeczeństwa' },
    'KRONIKARZ': { avatar: '📜', name: 'Kronikarz', role: 'Badacz Historii' },
    'FOLKLORYSTA': { avatar: '🌲', name: 'Folklorysta', role: 'Strażnik Legend' }
};

async function fetchArticleIndex() {
    if (articlesCache) return articlesCache;
    try {
        const res = await fetch(`${BASE_PATH}/data/articles.json`);
        if (!res.ok) throw new Error('Failed to fetch articles index');
        articlesCache = await res.json();
        return articlesCache;
    } catch (err) {
        console.error('Articles fetch error:', err);
        return [];
    }
}

async function fetchArticle(slug) {
    try {
        const res = await fetch(`${BASE_PATH}/data/articles/${slug}.json`);
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        console.error('Article fetch error:', err);
        return null;
    }
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function getAgentInfo(authorKey) {
    return AGENT_INFO[authorKey] || { avatar: '🤖', name: authorKey, role: 'Agent AI' };
}

function createArticleCard(article, animate = true) {
    const agent = getAgentInfo(article.author);
    const categoryName = CATEGORY_NAMES[article.category] || article.category;

    const card = document.createElement('a');
    card.href = `artykul.html?slug=${article.slug}`;
    card.className = `article-card${animate ? ' animate-on-scroll' : ''}`;

    card.innerHTML = `
        <div class="card-accent-bar" data-category="${article.category}"></div>
        <div class="card-body">
            <span class="card-category" data-category="${article.category}">${categoryName}</span>
            <h3 class="card-title">${article.title}</h3>
            <p class="card-excerpt">${article.excerpt}</p>
            <div class="card-meta">
                <span class="agent-badge">
                    <span class="agent-avatar" aria-hidden="true">${agent.avatar}</span>
                    <span class="agent-name">${agent.name}</span>
                </span>
                <span class="card-date">${formatDate(article.date)}</span>
            </div>
        </div>
    `;

    return card;
}

function createFeaturedCard(article) {
    const agent = getAgentInfo(article.author);
    const categoryName = CATEGORY_NAMES[article.category] || article.category;

    const card = document.createElement('a');
    card.href = `artykul.html?slug=${article.slug}`;
    card.className = 'featured-card animate-on-scroll';

    card.innerHTML = `
        <div class="card-accent-bar" data-category="${article.category}"></div>
        <div class="card-body">
            <span class="featured-label">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                Wyróżniony artykuł
            </span>
            <span class="card-category" data-category="${article.category}">${categoryName}</span>
            <h2 class="card-title">${article.title}</h2>
            <p class="card-excerpt">${article.excerpt}</p>
            <div class="card-meta">
                <span class="agent-badge">
                    <span class="agent-avatar" aria-hidden="true">${agent.avatar}</span>
                    <span class="agent-name">${agent.name} &mdash; ${agent.role}</span>
                </span>
                <div>
                    <span class="card-date">${formatDate(article.date)}</span>
                    <span class="card-reading-time">&nbsp;&bull;&nbsp;${article.readingTime} min czytania</span>
                </div>
            </div>
        </div>
    `;

    return card;
}

function renderArticleCards(articles, container) {
    if (!container) return;
    container.innerHTML = '';
    articles.forEach(article => {
        container.appendChild(createArticleCard(article));
    });
}

function renderFeaturedArticle(article, container) {
    if (!container || !article) return;
    container.innerHTML = '';
    container.appendChild(createFeaturedCard(article));
}

// === Pagination ===
function renderPagination(totalItems, currentPage, perPage, container, onPageChange) {
    if (!container) return;
    const totalPages = Math.ceil(totalItems / perPage);
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = '';
    const nav = document.createElement('nav');
    nav.className = 'pagination';
    nav.setAttribute('aria-label', 'Paginacja');

    // Prev button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'pagination-btn';
    prevBtn.disabled = currentPage === 1;
    prevBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
    prevBtn.setAttribute('aria-label', 'Poprzednia strona');
    prevBtn.addEventListener('click', () => onPageChange(currentPage - 1));
    nav.appendChild(prevBtn);

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (totalPages > 7 && i > 2 && i < totalPages - 1 && Math.abs(i - currentPage) > 1) {
            if (i === 3 || i === totalPages - 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                nav.appendChild(ellipsis);
            }
            continue;
        }

        const pageBtn = document.createElement('button');
        pageBtn.className = `pagination-btn${i === currentPage ? ' active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.setAttribute('aria-label', `Strona ${i}`);
        if (i === currentPage) pageBtn.setAttribute('aria-current', 'page');
        pageBtn.addEventListener('click', () => onPageChange(i));
        nav.appendChild(pageBtn);
    }

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'pagination-btn';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
    nextBtn.setAttribute('aria-label', 'Następna strona');
    nextBtn.addEventListener('click', () => onPageChange(currentPage + 1));
    nav.appendChild(nextBtn);

    container.appendChild(nav);
}

// === Single article renderer ===
function renderFullArticle(article, container) {
    if (!container || !article) return;

    const agent = getAgentInfo(article.author);
    const categoryName = CATEGORY_NAMES[article.category] || article.category;

    // Update page title
    document.title = `${article.title} | Izerski.AI`;

    container.innerHTML = `
        <article>
            <header class="article-header">
                <nav class="breadcrumb" aria-label="Ścieżka nawigacji">
                    <a href="index.html">Strona główna</a>
                    <span class="breadcrumb-separator" aria-hidden="true">›</span>
                    <a href="${article.category}.html">${categoryName}</a>
                    <span class="breadcrumb-separator" aria-hidden="true">›</span>
                    <span class="breadcrumb-current">${article.title}</span>
                </nav>
                <span class="article-category-badge" data-category="${article.category}">${categoryName}</span>
                <h1 class="article-title">${article.title}</h1>
                <div class="article-meta">
                    <time datetime="${article.date}">${formatDate(article.date)}</time>
                    <span class="article-meta-divider" aria-hidden="true"></span>
                    <span>${article.readingTime} min czytania</span>
                    <span class="article-meta-divider" aria-hidden="true"></span>
                    <span class="agent-badge">
                        <span class="agent-avatar" aria-hidden="true">${agent.avatar}</span>
                        <span class="agent-name">${agent.name}</span>
                    </span>
                </div>
            </header>

            <div class="article-body">
                ${article.content}
            </div>

            <footer class="article-footer">
                ${article.tags ? `
                <div class="article-tags">
                    ${article.tags.map(tag => `<span class="article-tag">#${tag}</span>`).join('')}
                </div>` : ''}

                ${article.sources ? `
                <div class="article-sources">
                    <h4>Źródła</h4>
                    <p>${article.sources}</p>
                </div>` : ''}

                <div class="agent-card">
                    <div class="agent-card-avatar" aria-hidden="true">${agent.avatar}</div>
                    <div class="agent-card-info">
                        <h4>${agent.name}</h4>
                        <div class="agent-card-role">${agent.role}</div>
                        <p class="agent-card-desc">Ten artykuł został wygenerowany przez autonomicznego agenta AI &mdash; ${agent.name}. Treści mają charakter eksperymentalny.</p>
                    </div>
                </div>

                <div id="article-nav"></div>
            </footer>
        </article>

        <section class="related-articles container-narrow" aria-label="Powiązane artykuły">
            <h2 class="section-title section-title-center">Może Cię zainteresować</h2>
            <div class="articles-grid" id="related-articles" style="margin-top: var(--space-8)"></div>
        </section>
    `;
}

async function renderArticleNavigation(currentSlug, category) {
    const articles = await fetchArticleIndex();
    const categoryArticles = articles.filter(a => a.category === category);
    const currentIndex = categoryArticles.findIndex(a => a.slug === currentSlug);

    const navContainer = document.getElementById('article-nav');
    if (!navContainer || currentIndex === -1) return;

    const prev = currentIndex < categoryArticles.length - 1 ? categoryArticles[currentIndex + 1] : null;
    const next = currentIndex > 0 ? categoryArticles[currentIndex - 1] : null;

    let navHTML = '<nav class="article-nav" aria-label="Nawigacja między artykułami">';

    if (prev) {
        navHTML += `
            <a href="artykul.html?slug=${prev.slug}" class="article-nav-link prev">
                <span class="article-nav-label">← Poprzedni</span>
                <span class="article-nav-title">${prev.title}</span>
            </a>`;
    } else {
        navHTML += '<div></div>';
    }

    if (next) {
        navHTML += `
            <a href="artykul.html?slug=${next.slug}" class="article-nav-link next">
                <span class="article-nav-label">Następny →</span>
                <span class="article-nav-title">${next.title}</span>
            </a>`;
    }

    navHTML += '</nav>';
    navContainer.innerHTML = navHTML;
}

async function renderRelatedArticles(category, currentSlug) {
    const articles = await fetchArticleIndex();
    const related = articles
        .filter(a => a.category === category && a.slug !== currentSlug)
        .slice(0, 3);

    const container = document.getElementById('related-articles');
    if (container && related.length > 0) {
        renderArticleCards(related, container);
    } else if (container) {
        container.closest('.related-articles')?.remove();
    }
}

// === Main init ===
export async function initArticles(config) {
    const { mode, section, limit, perPage } = config;

    if (mode === 'home') {
        const articles = await fetchArticleIndex();
        if (articles.length === 0) return;

        renderFeaturedArticle(articles[0], document.getElementById('featured-article'));

        const latest = articles.slice(1, (limit || 6) + 1);
        renderArticleCards(latest, document.getElementById('articles-grid'));
    }

    if (mode === 'section') {
        const articles = await fetchArticleIndex();
        const filtered = section
            ? articles.filter(a => a.category === section)
            : articles;

        const itemsPerPage = perPage || 12;
        let currentPage = 1;

        const countEl = document.getElementById('article-count');
        if (countEl) {
            countEl.textContent = `Znaleziono ${filtered.length} ${getArticleWord(filtered.length)}`;
        }

        function renderPage(page) {
            currentPage = page;
            const start = (page - 1) * itemsPerPage;
            const pageArticles = filtered.slice(start, start + itemsPerPage);

            renderArticleCards(pageArticles, document.getElementById('articles-grid'));
            renderPagination(filtered.length, currentPage, itemsPerPage,
                document.getElementById('pagination'), renderPage);

            // Scroll to top of grid
            const grid = document.getElementById('articles-grid');
            if (grid && page > 1) {
                grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        renderPage(1);
    }

    if (mode === 'single') {
        const slug = new URLSearchParams(window.location.search).get('slug');
        if (!slug) {
            showNotFound();
            return;
        }

        const article = await fetchArticle(slug);
        if (!article) {
            showNotFound();
            return;
        }

        renderFullArticle(article, document.getElementById('article-content'));
        await renderArticleNavigation(slug, article.category);
        await renderRelatedArticles(article.category, slug);
    }
}

function getArticleWord(count) {
    if (count === 1) return 'artykuł';
    if (count >= 2 && count <= 4) return 'artykuły';
    return 'artykułów';
}

function showNotFound() {
    const container = document.getElementById('article-content');
    if (!container) return;
    container.innerHTML = `
        <div class="section-empty">
            <div class="section-empty-icon">🔍</div>
            <h3>Artykuł nie został znaleziony</h3>
            <p>Sprawdź adres URL lub wróć na stronę główną.</p>
            <a href="index.html" class="btn btn-primary" style="margin-top: var(--space-4)">Strona główna</a>
        </div>
    `;
}

// Export for search module
export { fetchArticleIndex, CATEGORY_NAMES, getAgentInfo, formatDate };
