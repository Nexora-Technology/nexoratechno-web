'use client';

import { useEffect, useRef } from 'react';

interface Shape {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  rot: number;
  vrot: number;
  kind: number;
  hue: number;
}

function hexToRgba(hex: string, a: number): string {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r},${g},${b},${a})`;
}

export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let mouseX = -9999, mouseY = -9999;

    const shapes: Shape[] = [];

    function getTheme() {
      const root = document.documentElement;
      const dark = root.getAttribute('data-theme') === 'dark';
      const accent = getComputedStyle(root).getPropertyValue('--color-accent').trim() || '#DAB660';
      return { dark, accent, indigo: '#4F46E5', cyan: '#06B6D4' };
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas!.width = Math.floor(W * dpr);
      canvas!.height = Math.floor(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeShapes() {
      shapes.length = 0;
      const count = 5;
      for (let i = 0; i < count; i++) {
        shapes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 60 + Math.random() * 80,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.003,
          kind: i % 3,
          hue: i / count,
        });
      }
    }

    function drawShape(s: Shape, theme: ReturnType<typeof getTheme>) {
      if (!ctx) return;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);

      const grad = ctx.createLinearGradient(-s.r, -s.r, s.r, s.r);
      if (s.hue < 0.33) {
        grad.addColorStop(0, theme.indigo);
        grad.addColorStop(1, theme.cyan);
      } else if (s.hue < 0.66) {
        grad.addColorStop(0, theme.cyan);
        grad.addColorStop(1, theme.accent);
      } else {
        grad.addColorStop(0, theme.accent);
        grad.addColorStop(1, theme.indigo);
      }

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.25;
      ctx.globalAlpha = theme.dark ? 0.55 : 0.45;

      ctx.beginPath();
      if (s.kind === 0) {
        ctx.moveTo(0, -s.r);
        ctx.lineTo(s.r * 0.866, s.r * 0.5);
        ctx.lineTo(-s.r * 0.866, s.r * 0.5);
        ctx.closePath();
      } else if (s.kind === 1) {
        ctx.rect(-s.r * 0.7, -s.r * 0.7, s.r * 1.4, s.r * 1.4);
      } else {
        ctx.arc(0, 0, s.r * 0.85, 0, Math.PI * 2);
      }
      ctx.stroke();

      ctx.globalAlpha *= 0.6;
      ctx.beginPath();
      if (s.kind === 0) {
        ctx.moveTo(0, -s.r * 0.55);
        ctx.lineTo(s.r * 0.55 * 0.866, s.r * 0.55 * 0.5);
        ctx.lineTo(-s.r * 0.55 * 0.866, s.r * 0.55 * 0.5);
        ctx.closePath();
      } else if (s.kind === 1) {
        ctx.rect(-s.r * 0.4, -s.r * 0.4, s.r * 0.8, s.r * 0.8);
      } else {
        ctx.arc(0, 0, s.r * 0.5, 0, Math.PI * 2);
      }
      ctx.stroke();

      ctx.restore();
    }

    function drawGrid(theme: ReturnType<typeof getTheme>) {
      if (!ctx) return;
      const gridSize = 48;
      const cols = Math.ceil(W / gridSize) + 1;
      const rows = Math.ceil(H / gridSize) + 1;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gridSize;
          const y = j * gridSize;
          const dx = x - mouseX;
          const dy = y - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const near = Math.max(0, 1 - dist / 180);

          let radius = 0.9;
          let alpha = theme.dark ? 0.18 : 0.16;

          if (near > 0) {
            radius = 0.9 + near * 2.2;
            alpha = alpha + near * 0.6;
            ctx.fillStyle = hexToRgba(theme.accent, Math.min(1, alpha));
          } else {
            ctx.fillStyle = hexToRgba(theme.dark ? '#ffffff' : '#0a0a14', alpha);
          }

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function drawGlow(theme: ReturnType<typeof getTheme>) {
      if (!ctx) return;
      const cx = W * 0.72, cy = H * 0.35;
      const r = Math.max(W, H) * 0.55;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, hexToRgba(theme.accent, theme.dark ? 0.22 : 0.18));
      g.addColorStop(0.5, hexToRgba(theme.indigo, theme.dark ? 0.08 : 0.06));
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      const cx2 = W * 0.15, cy2 = H * 0.75;
      const r2 = Math.max(W, H) * 0.5;
      const g2 = ctx.createRadialGradient(cx2, cy2, 0, cx2, cy2, r2);
      g2.addColorStop(0, hexToRgba(theme.cyan, theme.dark ? 0.18 : 0.14));
      g2.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, W, H);
    }

    function tick() {
      if (!ctx) return;
      const theme = getTheme();
      ctx.clearRect(0, 0, W, H);

      drawGlow(theme);
      drawGrid(theme);

      for (const s of shapes) {
        s.x += s.vx;
        s.y += s.vy;
        s.rot += s.vrot;
        if (s.x < -s.r) s.x = W + s.r;
        if (s.x > W + s.r) s.x = -s.r;
        if (s.y < -s.r) s.y = H + s.r;
        if (s.y > H + s.r) s.y = -s.r;
        drawShape(s, theme);
      }

      requestAnimationFrame(tick);
    }

    function onResize() { resize(); makeShapes(); }
    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    }
    function onMouseLeave() { mouseX = mouseY = -9999; }

    resize();
    makeShapes();
    tick();

    window.addEventListener('resize', onResize);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
      }}
    />
  );
}