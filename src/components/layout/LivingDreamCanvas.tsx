'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LivingDreamCanvasProps {
  stage?: number; // 1: Scattered, 2: Connecting, 3: Structure, 4: Transition/Fade
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  z: number; // depth: 0.5 (far) to 1.8 (near)
  baseSize: number;
  size: number;
  color: string;
  shape: 'blob' | 'ring' | 'ribbon' | 'node' | 'particle';
  angle: number;
  spin: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export function LivingDreamCanvas({ stage = 1 }: LivingDreamCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, active: false, targetX: 0, targetY: 0 });
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let time = 0;

    const PALETTE = {
      indigo: '48, 38, 92',      // #30265C
      violet: '117, 101, 168',   // #7565A8
      lavender: '183, 169, 217', // #B7A9D9
      blue: '154, 169, 212',     // #9AA9D4
    };

    // Calculate dimensions
    const resizeCanvas = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      // Adjust for high DPI screens
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Re-initialize particles on resize to fit bounds
      initParticles();
    };

    const initParticles = () => {
      const isMobile = width < 768;
      const count = isMobile ? 18 : 45; // scale down particles on mobile to improve performance
      particles = [];

      const shapes: Particle['shape'][] = ['blob', 'ring', 'ribbon', 'node', 'particle'];

      for (let i = 0; i < count; i++) {
        const z = 0.5 + Math.random() * 1.3; // depth layers
        const shape = shapes[i % shapes.length];
        
        let baseSize = 4;
        if (shape === 'blob') baseSize = 15 + Math.random() * 25;
        else if (shape === 'ring') baseSize = 10 + Math.random() * 15;
        else if (shape === 'ribbon') baseSize = 12 + Math.random() * 10;
        else if (shape === 'node') baseSize = 3 + Math.random() * 3;
        
        // Colors mapped based on shape/depth
        let color = PALETTE.lavender;
        if (z > 1.4) color = PALETTE.indigo;
        else if (z < 0.8) color = PALETTE.blue;
        else if (Math.random() > 0.5) color = PALETTE.violet;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4 / z,
          vy: (Math.random() - 0.5) * 0.4 / z,
          z,
          baseSize,
          size: baseSize * z,
          color,
          shape,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.01,
          pulseSpeed: 0.01 + Math.random() * 0.01,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    // Tracking mouse movements relative to container
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;
      
      mouseRef.current.active = true;
      // Target position with ease-in interpolation
      mouseRef.current.targetX = rawX;
      mouseRef.current.targetY = rawY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    // Touch support for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (!canvas || e.touches.length === 0) return;
      const rect = canvas.getBoundingClientRect();
      const rawX = e.touches[0].clientX - rect.left;
      const rawY = e.touches[0].clientY - rect.top;
      
      mouseRef.current.active = true;
      mouseRef.current.targetX = rawX;
      mouseRef.current.targetY = rawY;
    };

    window.addEventListener('resize', resizeCanvas);
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('touchmove', handleTouchMove);
      container.addEventListener('touchend', handleMouseLeave);
    }

    // Initialize dimensions and items
    resizeCanvas();

    // Render loop
    let lastTime = performance.now();
    let frameCount = 0;

    const render = (timestamp: number) => {
      // Calculate FPS for performance monitoring
      frameCount++;
      if (timestamp > lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (timestamp - lastTime)));
        frameCount = 0;
        lastTime = timestamp;
      }

      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse coordinate tracking
      const mouse = mouseRef.current;
      const ease = 0.08;
      mouse.x += (mouse.targetX - mouse.x) * ease;
      mouse.y += (mouse.targetY - mouse.y) * ease;

      // 1. Determine Gather focal points for Loop (Gather vs Disperse)
      // Cycle: Gathering for 2.5 seconds, then Dispersing for 5.5 seconds (8s total cycle)
      const loopTime = (timestamp / 1000) % 8;
      const isGathering = stage === 1 && loopTime < 2.5;
      const gatherRatio = isGathering 
        ? Math.min(1, loopTime / 1.2) // fade-in interpolation
        : 0;

      // Focal points in the middle-right space
      const focalPoints = [
        { x: width * 0.55, y: height * 0.4 },
        { x: width * 0.75, y: height * 0.35 },
        { x: width * 0.65, y: height * 0.65 },
      ];

      // Connection threshold dynamically adjusts based on stage
      let connectionThreshold = 95;
      if (stage === 2) connectionThreshold = 140;
      else if (stage === 3) connectionThreshold = 105;
      else if (stage === 4) connectionThreshold = 40;

      // 2. Update Particles position
      particles.forEach((p, idx) => {
        // Base movement: drift
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.spin;

        // Interactive pulse scaling
        const pulse = 1 + Math.sin(time * p.pulseSpeed * 100 + p.pulsePhase) * 0.08;
        const currentSize = p.size * pulse;

        // Boundaries check (bounce back)
        if (p.x < -p.size) p.x = width + p.size;
        if (p.x > width + p.size) p.x = -p.size;
        if (p.y < -p.size) p.y = height + p.size;
        if (p.y > height + p.size) p.y = -p.size;

        // Cursor attraction influence
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 220) {
            // Spring force: closer particles move towards mouse, scaled by Z depth
            const force = (220 - dist) / 220 * 0.12 * p.z;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Parallax offset: shift based on mouse relative to center
        if (mouse.active) {
          const shiftX = (mouse.x - width / 2) * 0.03 * (p.z - 0.4);
          const shiftY = (mouse.y - height / 2) * 0.03 * (p.z - 0.4);
          p.x += shiftX * 0.15;
          p.y += shiftY * 0.15;
        }

        // Apply Loop-based Gathering (Stage 1)
        if (gatherRatio > 0) {
          const fp = focalPoints[idx % focalPoints.length];
          p.x += (fp.x - p.x) * 0.02 * gatherRatio;
          p.y += (fp.y - p.y) * 0.02 * gatherRatio;
        }

        // Apply Scroll Stage Math alignment
        if (stage === 2) {
          // Slow down velocities to show focused attention
          p.vx *= 0.95;
          p.vy *= 0.95;
        } else if (stage === 3) {
          // Align particles along a flowing golden helix pattern across the page
          const ratio = idx / particles.length;
          const targetX = width * 0.18 + ratio * width * 0.65;
          // Math wave formula
          const targetY = height / 2 + Math.sin(ratio * Math.PI * 3.5 + time * 0.4) * 85;
          
          p.x += (targetX - p.x) * 0.07;
          p.y += (targetY - p.y) * 0.07;
          p.vx = 0;
          p.vy = 0;
        } else if (stage === 4) {
          // Disperse/fall down and disappear as UI fades in
          p.y += (height + 50 - p.y) * 0.02;
          p.vx = 0;
          p.vy = 0;
        }

        // Draw Abstract shapes
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);

        // Alpha adjusts based on depth (Z)
        const baseAlpha = (p.z - 0.4) * 0.25;
        ctx.fillStyle = `rgba(${p.color}, ${baseAlpha})`;
        ctx.strokeStyle = `rgba(${p.color}, ${baseAlpha * 1.5})`;

        if (p.shape === 'blob') {
          // Organic translucent glowing blobs
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize);
          grad.addColorStop(0, `rgba(${p.color}, ${baseAlpha * 1.3})`);
          grad.addColorStop(0.5, `rgba(${p.color}, ${baseAlpha * 0.5})`);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
          ctx.fill();
        } 
        else if (p.shape === 'ring') {
          // Clean geometric thin rings
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, currentSize / 2, 0, Math.PI * 2);
          ctx.stroke();
        } 
        else if (p.shape === 'ribbon') {
          // Flowing strokes
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(-currentSize / 2, -currentSize / 4);
          ctx.quadraticCurveTo(0, currentSize / 2, currentSize / 2, -currentSize / 4);
          ctx.stroke();
        } 
        else if (p.shape === 'node') {
          // Solid pattern nodes
          ctx.beginPath();
          ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
          ctx.fill();
        } 
        else {
          // Very small dust particles
          ctx.beginPath();
          ctx.arc(0, 0, currentSize * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      // 3. Draw Connecting lines between close neighbors
      // We run a double-loop comparison (O(N^2), but N is small: <= 45, so it is highly performant).
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const pi = particles[i];
          const pj = particles[j];
          const dist = Math.hypot(pi.x - pj.x, pi.y - pj.y);

          if (dist < connectionThreshold) {
            // Line opacity scales inverse to distance
            const factor = (connectionThreshold - dist) / connectionThreshold;
            const lineAlpha = factor * 0.12 * Math.min(pi.z - 0.4, pj.z - 0.4);

            // Connect using soft lavender/violet shade
            ctx.strokeStyle = `rgba(${PALETTE.violet}, ${lineAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Run animation
    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleMouseLeave);
      }
    };
  }, [stage]);

  // Respect user preference for reduced motion
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  if (reducedMotion) {
    return (
      <div 
        ref={containerRef}
        className="absolute inset-0 z-0 bg-[#F8F6F2] dark:bg-[#0A0A09] opacity-30 flex items-center justify-center"
      >
        {/* Simplified static background for reduced-motion setting */}
        <div className="w-64 h-64 rounded-full bg-[#B7A9D9]/10 blur-3xl" />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 overflow-hidden w-full h-full pointer-events-auto"
      style={{ touchAction: 'none' }}
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block opacity-90 dark:opacity-70 transition-opacity duration-1000"
      />
    </div>
  );
}
