import React, { useEffect, useRef, useState } from 'react';

interface StreamLine {
  x: number;
  y: number;
  length: number;
  speed: number;
  alpha: number;
}

const canAnimate = () => {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return (
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
    !window.matchMedia('(max-width: 1023px)').matches &&
    !connection?.saveData &&
    (navigator.hardwareConcurrency ?? 4) >= 4
  );
};

export const F1SpeedStream: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!canAnimate()) return;
    const idle = window.setTimeout(() => setEnabled(true), 1200);
    return () => window.clearTimeout(idle);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !ctx) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let lastFrame = 0;
    let running = !document.hidden;
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    resize();

    const lines: StreamLine[] = Array.from({ length: 20 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: 50 + Math.random() * 100,
      speed: 1.4 + Math.random() * 2.2,
      alpha: 0.05 + Math.random() * 0.12,
    }));
    const render = (time: number) => {
      if (!running) return;
      if (time - lastFrame < 1000 / 24) {
        animationFrame = requestAnimationFrame(render);
        return;
      }
      const delta = Math.min(50, time - lastFrame || 16) / 16;
      lastFrame = time;
      ctx.clearRect(0, 0, width, height);
      for (const line of lines) {
        const gradient = ctx.createLinearGradient(line.x, line.y, line.x + line.length, line.y);
        gradient.addColorStop(0, 'rgba(255,255,255,0)');
        gradient.addColorStop(1, `rgba(225,6,0,${line.alpha})`);
        ctx.beginPath();
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x + line.length, line.y);
        ctx.stroke();
        line.x += line.speed * delta;
        if (line.x > width + 30) {
          line.x = -line.length;
          line.y = Math.random() * height;
        }
      }
      animationFrame = requestAnimationFrame(render);
    };
    const onVisibilityChange = () => {
      running = !document.hidden;
      if (running) {
        lastFrame = performance.now();
        animationFrame = requestAnimationFrame(render);
      } else {
        cancelAnimationFrame(animationFrame);
      }
    };
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);
    animationFrame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [enabled]);

  return enabled ? <canvas ref={canvasRef} aria-hidden="true" className="fixed inset-0 pointer-events-none z-[1] opacity-35" /> : null;
};
