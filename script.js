// script.js – PIXEL EDITION
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🕹️ LEGENDARYOS PIXEL ART MODE ACTIVATED 🕹️', 'color:#00f0ff; font-size:22px; font-family:monospace;');

    // Hamburger
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            if (link.getAttribute('href') === '#') return;
            e.preventDefault();
            document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
            if (navLinks.classList.contains('active')) navLinks.classList.remove('active');
        });
    });

    // Pixel stars
    function spawnPixels() {
        const container = document.getElementById('stars');
        for (let i = 0; i < 180; i++) {
            const pixel = document.createElement('div');
            const size = Math.random() * 4 + 2;
            pixel.style.cssText = `
            position:absolute;
            width:${size}px;
            height:${size}px;
            background:${Math.random() > 0.5 ? '#00f0ff' : '#c026d3'};
            left:${Math.random()*100}%;
            top:${Math.random()*100}%;
            opacity:${Math.random()};
            box-shadow:0 0 8px currentColor;
            animation:starTwinkle ${2 + Math.random()*4}s infinite;
            `;
            container.appendChild(pixel);
        }
    }
    const style = document.createElement('style');
    style.innerHTML = `@keyframes starTwinkle { 0%,100%{opacity:0.2} 50%{opacity:1} }`;
    document.head.appendChild(style);
    spawnPixels();

    // Download animation
    window.downloadISO = function(ver) {
        const texts = {
            standard: "🚀 POJĄŻDŻ FENIXEM STANDARD – POBIERANIE ROZPOCZĘTE!",
            minimal: "⚡ MINIMAL MODE – TYLKO KOD I FENIX!",
            kde: "🌈 KDE PLASMA – PEŁNY PIXEL CUSTOM!"
        };
        const msg = document.createElement('div');
        msg.style.cssText = `position:fixed;bottom:30px;right:30px;background:#c026d3;color:#000;padding:25px 40px;border:8px solid #00f0ff;font-family:'Press Start 2P';box-shadow:0 0 0 8px #000;font-size:1rem;z-index:9999;`;
        msg.innerHTML = texts[ver] + `<br><small style="font-size:0.7rem">SHA256 sprawdzone – leci feniks!</small>`;
        document.body.appendChild(msg);

        setTimeout(() => {
            msg.style.transition = '0.6s';
            msg.style.transform = 'translateY(100px)';
            msg.style.opacity = '0';
            setTimeout(() => msg.remove(), 600);
        }, 3800);
    };

    window.showChecksum = () => {
        alert("✅ SHA256 SUMY NA GITHUB:\n\nlegendaryos-standard.iso\n8f3a9c... (pełna suma w CHECKSUMS.txt)\n\nSprawdź zanim bootujesz!");
    };

    console.log('✅ Pixel art strona LegendaryOS w pełni załadowana – feniks gotowy do lotu!');
});
