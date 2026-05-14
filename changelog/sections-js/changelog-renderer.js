/**
 * LegendaryOS Changelog Renderer
 * Czyta window.LEGENDARY_RELEASES z changelog-data.js i renderuje stronę.
 */

(function () {
    'use strict';

    const STATUS_LABELS = {
        stable: { text: 'STABLE',  cls: 'badge-stable' },
        beta:   { text: 'BETA',    cls: 'badge-beta'   },
        alpha:  { text: 'ALPHA',   cls: 'badge-alpha'  },
    };

    const CATEGORY_ICONS = {
        'System':      '&#9670;',
 'Instalator':  '&#9632;',
 'Narzędzia':   '&#9650;',
 'Dokumentacja':'&#9642;',
 'Bezpieczeństwo': '&#9632;',
 'Poprawki':    '&#9679;',
    };

    function formatDate(iso) {
        const [y, m, d] = iso.split('-');
        const months = ['stycznia','lutego','marca','kwietnia','maja','czerwca',
 'lipca','sierpnia','września','października','listopada','grudnia'];
 return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
    }

    function buildRelease(rel) {
        const status = STATUS_LABELS[rel.status] || STATUS_LABELS.alpha;

        const changesHTML = rel.changes.map(cat => {
            const icon = CATEGORY_ICONS[cat.category] || '&#9642;';
            const items = cat.items.map(i => `<li>${i}</li>`).join('');
            return `
            <div class="cl-category">
            <h4 class="cl-cat-title"><span class="cl-cat-icon">${icon}</span>${cat.category}</h4>
            <ul class="cl-items">${items}</ul>
            </div>`;
        }).join('');

        const bugsHTML = rel.known_bugs && rel.known_bugs.length > 0
        ? `<div class="cl-bugs">
        <h4 class="cl-bugs-title">Znane błędy</h4>
        <ul class="cl-items">${rel.known_bugs.map(b => `<li>${b}</li>`).join('')}</ul>
        </div>`
        : `<div class="cl-bugs cl-bugs-empty">
        <span class="cl-no-bugs">Brak znanych błędów w tym wydaniu.</span>
        </div>`;

        return `
        <article class="cl-release" id="v${rel.version.replace(/\./g, '-')}">
        <div class="cl-release-header">
        <div class="cl-release-meta">
        <span class="cl-version">v${rel.version}</span>
        ${rel.codename ? `<span class="cl-codename">"${rel.codename}"</span>` : ''}
        <span class="cl-badge ${status.cls}">${status.text}</span>
        </div>
        <time class="cl-date" datetime="${rel.date}">${formatDate(rel.date)}</time>
        </div>
        <p class="cl-summary">${rel.summary}</p>
        <div class="cl-body">
        <div class="cl-changes">${changesHTML}</div>
        ${bugsHTML}
        </div>
        </article>`;
    }

    function buildSidebar(releases) {
        const items = releases.map(rel => {
            const status = STATUS_LABELS[rel.status] || STATUS_LABELS.alpha;
            return `<li>
            <a href="#v${rel.version.replace(/\./g, '-')}" class="cl-nav-link">
            <span class="cl-nav-version">v${rel.version}</span>
            <span class="cl-nav-badge ${status.cls}">${status.text}</span>
            </a>
            </li>`;
        }).join('');
        return `<ul class="cl-nav-list">${items}</ul>`;
    }

    function render() {
        const releases = window.LEGENDARY_RELEASES;
        if (!releases || !releases.length) return;

        const main = document.getElementById('cl-main');
        const sidebar = document.getElementById('cl-sidebar-nav');

        if (main) main.innerHTML = releases.map(buildRelease).join('');
        if (sidebar) sidebar.innerHTML = buildSidebar(releases);

        // Highlight active nav item on scroll
        const articles = main ? main.querySelectorAll('.cl-release') : [];
        const navLinks = sidebar ? sidebar.querySelectorAll('.cl-nav-link') : [];

        if (articles.length && navLinks.length) {
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        const target = sidebar.querySelector(`a[href="#${entry.target.id}"]`);
                        if (target) target.classList.add('active');
                    }
                });
            }, { threshold: 0.3 });
            articles.forEach(a => observer.observe(a));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }
})();
