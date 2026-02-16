/**
 * Search Module
 * Client-side search overlay with live results
 */

import { fetchArticleIndex, CATEGORY_NAMES, getAgentInfo, formatDate } from './articles.js';

let searchOverlay = null;
let searchInput = null;
let searchResults = null;
let debounceTimer = null;

export function initSearch() {
    const toggle = document.querySelector('.search-toggle');
    searchOverlay = document.getElementById('search-overlay');
    if (!toggle || !searchOverlay) return;

    // Build search UI
    searchOverlay.innerHTML = `
        <div class="search-container">
            <div class="search-input-wrapper">
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <circle cx="11" cy="11" r="8"/>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="search" class="search-input"
                       placeholder="Szukaj artykułów..."
                       aria-label="Wyszukaj artykuły"
                       autocomplete="off">
                <button class="search-close" aria-label="Zamknij wyszukiwanie">&times;</button>
            </div>
            <div class="search-results" role="listbox" aria-label="Wyniki wyszukiwania"></div>
            <div class="search-hint">Wpisz minimum 2 znaki aby wyszukać</div>
        </div>
    `;

    searchInput = searchOverlay.querySelector('.search-input');
    searchResults = searchOverlay.querySelector('.search-results');
    const closeBtn = searchOverlay.querySelector('.search-close');
    const hint = searchOverlay.querySelector('.search-hint');

    // Open
    toggle.addEventListener('click', () => {
        openSearch();
    });

    // Close
    closeBtn.addEventListener('click', closeSearch);

    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) closeSearch();
    });

    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to open search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (searchOverlay.classList.contains('is-open')) {
                closeSearch();
            } else {
                openSearch();
            }
        }
        // ESC to close
        if (e.key === 'Escape' && searchOverlay.classList.contains('is-open')) {
            closeSearch();
        }
    });

    // Search input
    searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        const query = searchInput.value.trim().toLowerCase();

        if (query.length < 2) {
            searchResults.innerHTML = '';
            hint.style.display = '';
            return;
        }

        hint.style.display = 'none';
        debounceTimer = setTimeout(() => performSearch(query), 250);
    });
}

function openSearch() {
    searchOverlay.classList.add('is-open');
    document.body.classList.add('search-open');
    searchInput.value = '';
    searchResults.innerHTML = '';
    searchOverlay.querySelector('.search-hint').style.display = '';
    setTimeout(() => searchInput.focus(), 100);
}

function closeSearch() {
    searchOverlay.classList.remove('is-open');
    document.body.classList.remove('search-open');
}

async function performSearch(query) {
    const articles = await fetchArticleIndex();
    const terms = query.split(/\s+/);

    const matches = articles.filter(article => {
        const searchText = `${article.title} ${article.excerpt} ${article.author} ${article.category}`.toLowerCase();
        return terms.every(term => searchText.includes(term));
    }).slice(0, 8);

    if (matches.length === 0) {
        searchResults.innerHTML = `<div class="search-empty">Brak wyników dla "${query}"</div>`;
        return;
    }

    searchResults.innerHTML = matches.map(article => {
        const agent = getAgentInfo(article.author);
        const categoryName = CATEGORY_NAMES[article.category] || article.category;
        return `
            <a href="artykul.html?slug=${article.slug}" class="search-result-item" role="option">
                <div class="search-result-category">${categoryName}</div>
                <div class="search-result-title">${article.title}</div>
                <div class="search-result-meta">${formatDate(article.date)} &bull; ${agent.avatar} ${agent.name}</div>
            </a>
        `;
    }).join('');
}
