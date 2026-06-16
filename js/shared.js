/* ================================================================
   IDSOL 2026 — Shared JS
   Injects footer, nodal background, Lucide icons
   ================================================================ */

(function () {
    'use strict';

    const path = window.location.pathname.split('/').pop() || 'index.html';
    const isHome = path === 'index.html' || path === '';

    /* ── Footer HTML ── */
    const footerHTML = `
<footer class="site-footer">
    <div class="site-footer__backdrop" aria-hidden="true"></div>
    <div class="footer-line"></div>
    <div class="footer-inner">
        <div class="footer-columns">
            <div class="footer-col">
                <h4>IDSOL: International Data Science Olympiad</h4>
                <div class="footer-icons">
                    <a href="https://2026.idsol.org" target="_blank" rel="noopener" title="IDSOL Website">
                        <i data-lucide="globe" style="width:24px;height:24px;"></i>
                    </a>
                    <a href="https://www.linkedin.com/company/idsol-org" target="_blank" rel="noopener" title="LinkedIn">
                        <i data-lucide="linkedin" style="width:24px;height:24px;"></i>
                    </a>
                    <a href="https://www.instagram.com/idsol_org/" target="_blank" rel="noopener" title="Instagram">
                        <i data-lucide="instagram" style="width:24px;height:24px;"></i>
                    </a>
                </div>
            </div>
            <div class="footer-col">
                <h4>KBI: Königsberger Bridges Institute</h4>
                <div class="footer-icons">
                    <a href="https://www.kb.institute/" target="_blank" rel="noopener" title="Website">
                        <i data-lucide="globe" style="width:24px;height:24px;"></i>
                    </a>
                    <a href="https://www.linkedin.com/company/kbi-eu/" target="_blank" rel="noopener" title="LinkedIn">
                        <i data-lucide="linkedin" style="width:24px;height:24px;"></i>
                    </a>
                    <a href="https://www.instagram.com/kbi.eu/" target="_blank" rel="noopener" title="Instagram">
                        <i data-lucide="instagram" style="width:24px;height:24px;"></i>
                    </a>
                </div>
            </div>
        </div>
        <p class="footer-copyright">© 2020–2026 International Data Science Olympiad (IDSOL Foundation). All Rights Reserved.</p>
    </div>
</footer>`;

    if (!isHome) {
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    /* ── Nodal background canvas (non-home pages; home uses pulse script in index.html) ── */
    const canvas = document.getElementById('bg-canvas');
    if (canvas && !isHome) {
    const ctx = canvas.getContext('2d');
    let nodes = [];

    class Node {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            const vh = canvas.height * 4;
            this.y = Math.pow(Math.random(), 0.6) * vh;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2.5 + 1.5;
            this.z = Math.random() * 1.2 + 0.2;
            this.baseAlpha = 0.25 + Math.random() * 0.35;
        }
        update() {
            this.x += this.vx * this.z;
            this.y += this.vy * this.z;
            const lim = canvas.height * 4;
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = lim;
            if (this.y > lim) this.y = 0;
        }
        draw(scrollY) {
            const dy = (this.y - scrollY * this.z) % (canvas.height * 2.5);
            if (dy < -100 || dy > canvas.height + 100) return;
            ctx.beginPath();
            ctx.arc(this.x, dy, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(156,233,255,${this.baseAlpha})`;
            ctx.fill();
        }
    }

    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        nodes = [];
        const count = Math.floor((canvas.width * canvas.height) / 7000);
        for (let i = 0; i < count; i++) nodes.push(new Node());
    }

    function drawCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const maxDist = 200;
        const pos = nodes.map(n => ({
            x: n.x,
            y: (n.y - scrollY * n.z) % (canvas.height * 2.5),
            z: n.z
        }));
        for (let i = 0; i < nodes.length; i++) {
            const pi = pos[i];
            if (pi.y < -100 || pi.y > canvas.height + 100) continue;
            for (let j = i + 1; j < nodes.length; j++) {
                const pj = pos[j];
                const dist = Math.hypot(pi.x - pj.x, pi.y - pj.y);
                if (dist < maxDist) {
                    ctx.strokeStyle = `rgba(156,233,255,${(1 - dist / maxDist) * 0.28})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(pi.x, pi.y);
                    ctx.lineTo(pj.x, pj.y);
                    ctx.stroke();
                }
            }
        }
        nodes.forEach(n => { n.update(); n.draw(scrollY); });
        requestAnimationFrame(drawCanvas);
    }

    initCanvas();
    drawCanvas();
    window.addEventListener('resize', initCanvas, { passive: true });
    setTimeout(() => canvas.classList.add('active'), 300);
    }

    /* ── Lucide icons (after footer injected) ── */
    if (window.lucide) lucide.createIcons();
    else window.addEventListener('load', () => { if (window.lucide) lucide.createIcons(); });
})();
