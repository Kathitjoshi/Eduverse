import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  char: string;
  rotation: number;
  rotSpeed: number;
  color: string;
  opacity: number;
  swayFactor: number;
  swaySpeed: number;
  swayOffset: number;
}

const CHARACTERS = [
  "∫", "π", "∑", "√", "λ", "e=mc²", "θ", "f(x)", "Δ", "[]", "{}", "y=mx+C", "⚛️", "🎓", "📖", "α", "β", "Ω", "log(n)", "O(1)"
];

const COLORS = [
  "rgba(200, 245, 106, 0.15)", // Lime
  "rgba(125, 217, 184, 0.15)", // Teal
  "rgba(184, 160, 240, 0.15)", // Purple
  "rgba(240, 196, 106, 0.12)", // Amber
  "rgba(240, 238, 232, 0.08)", // Soft white
];

export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const maxParticles = 45; // balanced density for performance and aesthetics

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      particles.push(createParticle(true));
    }

    function createParticle(randomY = false): Particle {
      const activeChar = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
      // Size proportional to characters vs formulas
      const baseSize = activeChar.length > 2 ? 11 : 16;
      const size = Math.random() * 8 + baseSize;

      return {
        x: Math.random() * canvas.width,
        y: randomY ? Math.random() * canvas.height : -30,
        size,
        speedY: Math.random() * 0.4 + 0.15,
        speedX: Math.random() * 0.1 - 0.05,
        char: activeChar,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() * 0.006 - 0.003) * (Math.random() > 0.5 ? 1 : -1),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: Math.random() * 0.7 + 0.3,
        swayFactor: Math.random() * 0.8 + 0.2,
        swaySpeed: Math.random() * 0.003 + 0.001,
        swayOffset: Math.random() * Math.PI * 2,
      };
    }

    const mouseHandler = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const mouseLeaveHandler = () => {
      mouseRef.current.active = false;
    };

    const touchHandler = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
        mouseRef.current.active = true;
      }
    };

    window.addEventListener("mousemove", mouseHandler, { passive: true });
    window.addEventListener("mouseleave", mouseLeaveHandler, { passive: true });
    window.addEventListener("touchstart", touchHandler, { passive: true });
    window.addEventListener("touchend", mouseLeaveHandler, { passive: true });

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        // Fall down
        p.y += p.speedY;
        
        // Sway back and forth using sine
        const sway = Math.sin(timestamp * p.swaySpeed + p.swayOffset) * p.swayFactor * 0.25;
        p.x += p.speedX + sway;
        p.rotation += p.rotSpeed;

        // Mouse interaction: push particles away gently if within radius
        if (mouseRef.current.active) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const limit = 160;

          if (distance < limit) {
            const force = (limit - distance) / limit;
            const angle = Math.atan2(dy, dx);
            // push vector
            p.x += Math.cos(angle) * force * 1.5;
            p.y += Math.sin(angle) * force * 1.5;
          }
        }

        // Wrap around bounds
        if (p.y > canvas.height + 40) {
          particles[idx] = createParticle(false);
        }
        if (p.x < -60) {
          p.x = canvas.width + 30;
        } else if (p.x > canvas.width + 60) {
          p.x = -30;
        }

        // Draw particle representation
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.font = `${p.size}px "JetBrains Mono", var(--font-mono), monospace`;
        ctx.fillStyle = p.color;
        // Global Composite Operation for beautiful subtle fusion
        ctx.globalCompositeOperation = "screen";
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", mouseHandler);
      window.removeEventListener("mouseleave", mouseLeaveHandler);
      window.removeEventListener("touchstart", touchHandler);
      window.removeEventListener("touchend", mouseLeaveHandler);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      id="bg-particles-canvas"
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-80"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
