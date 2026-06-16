/* ── IDSOL 2026 — Home Background Canvas ── */
(function () {
    'use strict';

    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let pulseWave = -200;

    class Node {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * (canvas.height * 2);
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 3 + 2;
            this.z = Math.random() * 0.8 + 0.2;
            this.baseAlpha = 0.3 + Math.random() * 0.4;
        }
        update() {
            this.x += this.vx * this.z;
            this.y += this.vy * this.z;
            if (this.x < 0) this.x += canvas.width;
            if (this.x > canvas.width) this.x -= canvas.width;
            const limit = canvas.height * 3;
            if (this.y < 0) this.y += limit;
            if (this.y > limit) this.y -= limit;
        }
        draw(scrollY) {
            const drawY = (this.y - scrollY * this.z) % (canvas.height * 2);
            if (drawY < -50 || drawY > canvas.height + 50) return;
            let alpha = this.baseAlpha;
            const dx = this.x - (canvas.width >> 1);
            const dy = drawY - (canvas.height >> 1);
            const dist = Math.hypot(dx, dy);
            if (Math.abs(dist - pulseWave) < 50) {
                alpha = 1; ctx.shadowBlur = 15; ctx.shadowColor = '#A5D7E8';
            } else { ctx.shadowBlur = 0; }
            ctx.beginPath();
            ctx.arc(this.x, drawY, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(165,215,232,${alpha})`;
            ctx.fill();
        }
    }

    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        nodes = [];
        const nodeCount = Math.min(160, Math.floor((canvas.width * canvas.height) / 11000));
        for (let i = 0; i < nodeCount; i++) nodes.push(new Node());
    }

    function drawBackground() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pulseWave += 4;
        if (pulseWave > canvas.width + 500) pulseWave = -200;
        const scrollY = window.scrollY;
        const hw = canvas.width >> 1;
        const hh = canvas.height >> 1;
        for (let i = 0; i < nodes.length; i++) {
            const n = nodes[i];
            n.update();
            const py = (n.y - scrollY * n.z) % (canvas.height * 2);
            if (py < -50 || py > canvas.height + 50) continue;
            n.draw(scrollY);
            for (let j = i + 1; j < nodes.length; j++) {
                const nj = nodes[j];
                const pnj = (nj.y - scrollY * nj.z) % (canvas.height * 2);
                if (pnj < -50 || pnj > canvas.height + 50) continue;
                const dist = Math.hypot(n.x - nj.x, py - pnj);
                if (dist >= 220) continue;
                const opacity = (1 - dist / 220) * 0.4;
                ctx.beginPath();
                ctx.moveTo(n.x, py);
                ctx.lineTo(nj.x, pnj);
                const midX = (n.x + nj.x) * 0.5;
                const midY = (py + pnj) * 0.5;
                const cDist = Math.hypot(midX - hw, midY - hh);
                if (Math.abs(cDist - pulseWave) < 100) {
                    ctx.strokeStyle = `rgba(165,215,232,${opacity * 2.5})`;
                    ctx.lineWidth = 2;
                } else {
                    ctx.strokeStyle = `rgba(165,215,232,${opacity})`;
                    ctx.lineWidth = 1;
                }
                ctx.stroke();
            }
        }
        requestAnimationFrame(drawBackground);
    }

    initCanvas();
    drawBackground();
    window.addEventListener('resize', initCanvas, { passive: true });
    setTimeout(() => canvas.classList.add('active'), 300);
})();
