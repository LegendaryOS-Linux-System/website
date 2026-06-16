'use strict';

/* STAR FIELD */
(function initStars() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, stars = [];
    const STAR_COUNT = 180;
    const COLORS = ['#e040fb', '#7c4dff', '#40c4ff', '#aa00ff', '#ffffff'];

    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

    function createStar() {
        return {
            x: Math.random() * W,
 y: Math.random() * H,
 r: Math.random() * 1.5 + 0.3,
 color: COLORS[Math.floor(Math.random() * COLORS.length)],
 alpha: Math.random(),
 dAlpha: (Math.random() * 0.008 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
        };
    }

    function initStarField() { stars = Array.from({ length: STAR_COUNT }, createStar); }

    let animEnabled = true;
    let rafId = null;

    function draw() {
        if (!animEnabled) { ctx.clearRect(0, 0, W, H); return; }
        ctx.clearRect(0, 0, W, H);
        stars.forEach(s => {
            s.alpha += s.dAlpha;
            if (s.alpha <= 0 || s.alpha >= 1) s.dAlpha *= -1;
            ctx.save();
            ctx.globalAlpha = Math.max(0, Math.min(1, s.alpha)) * 0.7;
            ctx.fillStyle = s.color;
            ctx.shadowColor = s.color;
            ctx.shadowBlur = 4;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        rafId = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); initStarField(); });
    resize();
    initStarField();
    draw();

    // expose toggle
    window._starsToggle = function(enabled) {
        animEnabled = enabled;
        if (enabled) { if (!rafId) draw(); }
        else { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } ctx.clearRect(0, 0, W, H); }
    };
})();


/* SCROLL REVEAL */
(function initReveal() {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
                const delay = siblings.indexOf(entry.target) * 80;
                setTimeout(() => entry.target.classList.add('visible'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    elements.forEach(el => observer.observe(el));
})();


/* INSTALL TABS */
(function initTabs() {
    const tabMap = { iso: 'tab-iso', vm: 'tab-vm', upgrade: 'tab-upgrade', custom: 'tab-custom' };
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            const content = document.getElementById(tabMap[btn.dataset.tab]);
            if (content) content.classList.add('active');
        });
    });
})();


/* COPY BUTTONS */
(function initCopyButtons() {
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const block = btn.closest('.code-block');
            if (!block) return;
            const raw = block.innerText.replace(/^KOPIUJ\n?/, '').trim();
            navigator.clipboard.writeText(raw).then(() => {
                const original = btn.textContent;
                btn.textContent = 'SKOPIOWANO';
                btn.style.color = '#69ff47';
                btn.style.borderColor = '#69ff47';
                setTimeout(() => {
                    btn.textContent = original;
                    btn.style.color = '';
                    btn.style.borderColor = '';
                }, 2000);
            }).catch(() => {
                btn.textContent = 'BLAD';
                setTimeout(() => { btn.textContent = 'KOPIUJ'; }, 2000);
            });
        });
    });
})();


/* FAQ ACCORDION */
(function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
            if (!isOpen) item.classList.add('open');
        });
    });
})();


/* NAV ACTIVE HIGHLIGHT ON SCROLL */
(function initNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.style.color = '';
                    link.style.textShadow = '';
                    if (link.getAttribute('href') === '#' + id) {
                        link.style.color = 'var(--neon-pink)';
                        link.style.textShadow = '0 0 10px var(--neon-pink)';
                    }
                });
            }
        });
    }, { threshold: 0.4 });
    sections.forEach(s => observer.observe(s));
})();


/* NAV SHADOW ON SCROLL */
(function initNavScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        nav.style.boxShadow = window.scrollY > 40
        ? '0 4px 30px rgba(224,64,251,0.15)'
        : 'none';
    }, { passive: true });
})();


/* HERO TITLE GLITCH */
(function initGlitch() {
    const title = document.querySelector('.hero-title');
    if (!title) return;
    function glitch() {
        if (!window._glitchEnabled) return;
        title.style.textShadow = `
        ${(Math.random()*8-4).toFixed(1)}px 0 #e040fb,
 ${(Math.random()*-8+4).toFixed(1)}px 0 #40c4ff,
 0 0 20px #aa00ff
 `;
 setTimeout(() => {
     title.style.textShadow = '0 0 20px var(--neon-pink), 0 0 40px var(--neon-violet), 4px 4px 0 rgba(170,0,255,0.4)';
 }, 80);
    }
    window._glitchEnabled = true;
    function schedule() {
        const delay = 3000 + Math.random() * 6000;
        setTimeout(() => { glitch(); setTimeout(glitch, 100); schedule(); }, delay);
    }
    schedule();
})();


/* FEATURE CARD RADIAL HOVER */
(function initCardHover() {
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
            const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
            card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(124,77,255,0.08) 0%, var(--bg-card-hover) 60%)`;
        });
        card.addEventListener('mouseleave', () => { card.style.background = ''; });
    });
})();


/* TERMINAL RE-ANIMATE ON SCROLL INTO VIEW */
(function initTerminalReplay() {
    const terminal = document.querySelector('.terminal');
    if (!terminal) return;
    const lines = terminal.querySelectorAll('.t-line');
    let played = false;
    new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !played) {
            played = true;
            lines.forEach(l => { l.style.animation = 'none'; l.style.opacity = '0'; });
            void terminal.offsetWidth;
            lines.forEach(l => { l.style.animation = ''; });
        }
    }, { threshold: 0.5 }).observe(terminal);
})();


/* KEYBOARD: ? or / scrolls to FAQ */
document.addEventListener('keydown', e => {
    if ((e.key === '?' || e.key === '/') && document.activeElement.tagName !== 'INPUT') {
        e.preventDefault();
        const faq = document.querySelector('#faq');
        if (faq) faq.scrollIntoView({ behavior: 'smooth' });
    }
});


/* SETTINGS PANEL */
(function initSettings() {
    const btn = document.getElementById('settings-btn');
    const overlay = document.getElementById('settings-overlay');
    const closeBtn = document.getElementById('settings-close');
    const animToggle = document.getElementById('anim-toggle');
    const themeButtons = document.querySelectorAll('.theme-btn');

    if (!btn || !overlay) return;

    function openSettings() {
        overlay.classList.remove('settings-overlay-hidden');
        overlay.classList.add('settings-overlay-visible');
        document.body.style.overflow = 'hidden';
    }
    function closeSettings() {
        overlay.classList.remove('settings-overlay-visible');
        overlay.classList.add('settings-overlay-hidden');
        document.body.style.overflow = '';
    }

    btn.addEventListener('click', openSettings);
    closeBtn && closeBtn.addEventListener('click', closeSettings);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeSettings(); });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && overlay.classList.contains('settings-overlay-visible')) closeSettings();
    });

        // ── THEMES ──────────────────────────────────────────────────────────────
        const THEMES = {
            default: {
                '--neon-pink':   '#e040fb',
                '--neon-purple': '#aa00ff',
                '--neon-violet': '#7c4dff',
                '--neon-blue':   '#40c4ff',
            },
            cyan: {
                '--neon-pink':   '#00e5ff',
                '--neon-purple': '#0091ea',
                '--neon-violet': '#00b0ff',
                '--neon-blue':   '#80d8ff',
            },
            green: {
                '--neon-pink':   '#69ff47',
                '--neon-purple': '#00c853',
                '--neon-violet': '#1de9b6',
                '--neon-blue':   '#b9f6ca',
            },
            red: {
                '--neon-pink':   '#ff1744',
                '--neon-purple': '#ff6d00',
                '--neon-violet': '#ff4081',
                '--neon-blue':   '#ff6e40',
            },
        };

        function applyTheme(name) {
            const vars = THEMES[name] || THEMES.default;
            const root = document.documentElement;
            Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
            themeButtons.forEach(b => b.classList.toggle('active', b.dataset.theme === name));
            try { localStorage.setItem('los-theme', name); } catch(e) {}
        }

        themeButtons.forEach(tb => {
            tb.addEventListener('click', () => applyTheme(tb.dataset.theme));
        });

        // restore saved theme
        try {
            const saved = localStorage.getItem('los-theme');
            if (saved && THEMES[saved]) applyTheme(saved);
        } catch(e) {}

        // ── ANIMATION TOGGLE ────────────────────────────────────────────────────
        if (animToggle) {
            animToggle.addEventListener('change', () => {
                const enabled = animToggle.checked;
                window._glitchEnabled = enabled;
                if (window._starsToggle) window._starsToggle(enabled);
            });
        }

        // ── STAR DENSITY ────────────────────────────────────────────────────────
        const densitySlider = document.getElementById('star-density');
        const densityVal    = document.getElementById('star-density-val');
        if (densitySlider) {
            densitySlider.addEventListener('input', () => {
                const v = parseInt(densitySlider.value, 10);
                if (densityVal) densityVal.textContent = v;
                if (window._starsSetCount) window._starsSetCount(v);
            });
        }

        // ── SCANLINES ───────────────────────────────────────────────────────────
        const scanlinesToggle = document.getElementById('scanlines-toggle');
        const scanlinesEl     = document.getElementById('scanlines-overlay');
        if (scanlinesToggle && scanlinesEl) {
            scanlinesToggle.addEventListener('change', () => {
                scanlinesEl.style.display = scanlinesToggle.checked ? 'block' : 'none';
            });
        }

        // ── BACKDROP BLUR ───────────────────────────────────────────────────────
        const blurToggle = document.getElementById('blur-toggle');
        if (blurToggle) {
            const blurStyle = document.createElement('style');
            blurStyle.id = 'los-blur-override';
            blurToggle.addEventListener('change', () => {
                if (!blurToggle.checked) {
                    blurStyle.textContent = '.feature-card,.dl-card,.immutable-card,.faq-item,.install-note,.code-block{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;}';
                    document.head.appendChild(blurStyle);
                } else {
                    blurStyle.remove();
                }
            });
        }

        // ── FONT SIZE ───────────────────────────────────────────────────────────
        const fontBtns = document.querySelectorAll('.font-size-btn');
        const FONT_SIZES = { normal: '16px', large: '18px', xlarge: '21px' };
        fontBtns.forEach(fb => {
            fb.addEventListener('click', () => {
                const size = FONT_SIZES[fb.dataset.size] || '16px';
                document.documentElement.style.fontSize = size;
                fontBtns.forEach(b => {
                    b.style.borderColor = b === fb ? 'var(--neon-pink)' : 'var(--border-subtle)';
                    b.style.color       = b === fb ? 'var(--neon-pink)' : 'var(--text-muted)';
                    b.classList.toggle('active', b === fb);
                });
                try { localStorage.setItem('los-fontsize', fb.dataset.size); } catch(e) {}
            });
        });

        try {
            const savedFs = localStorage.getItem('los-fontsize');
            if (savedFs) {
                const btn = document.querySelector(`.font-size-btn[data-size="${savedFs}"]`);
                if (btn) btn.click();
            }
        } catch(e) {}

        // ── SCROLL TO TOP ───────────────────────────────────────────────────────
        const scrollTopBtn = document.getElementById('scroll-top-btn');
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', () => {
                closeSettings();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
})();


/* STAR COUNT CONTROL (extend star field) */
(function extendStars() {
    const canvas = document.getElementById('stars-canvas');
    if (!canvas) return;
    window._starsSetCount = function(count) {
        // rebuild star field via resize trick
        window.dispatchEvent(new Event('resize'));
        const ctx = canvas.getContext('2d');
        const W = canvas.width, H = canvas.height;
        const COLORS = ['#e040fb', '#7c4dff', '#40c4ff', '#aa00ff', '#ffffff'];
        const stars = Array.from({ length: count }, () => ({
            x: Math.random() * W,
                                                           y: Math.random() * H,
                                                           r: Math.random() * 1.5 + 0.3,
                                                           color: COLORS[Math.floor(Math.random() * COLORS.length)],
                                                           alpha: Math.random(),
                                                           dAlpha: (Math.random() * 0.008 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
        }));
        // patch internal stars array via closure — re-init by dispatching resize
        // The main star engine listens to resize, so we just trigger it
        window._pendingStarCount = count;
    };
})();
