import React, { useRef, useState, useEffect } from 'react';

/**
 * LiquidMetalSculpture — 100% Original Pure SVG & CSS Liquid Chrome Sculpture
 * 
 * Engineered to reproduce the premium, futuristic, reflective liquid-metal visual identity:
 * - Multi-stop metallic linear and radial gradients (mirror chrome, silver, graphite, deep obsidian)
 * - Multi-layered organic fluid loops with 3D depth and specular highlights
 * - Interactive cursor-following specular sheen & subtle harmonic float
 * - Zero external bitmap dependencies (0 kB image payload, infinite resolution scalability)
 */
export default function LiquidMetalSculpture({ className = '', size = 'large' }) {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({ x, y });
    };

    const current = containerRef.current;
    if (current) {
      current.addEventListener('mousemove', handleMouseMove);
      current.addEventListener('mouseenter', () => setIsHovered(true));
      current.addEventListener('mouseleave', () => {
        setIsHovered(false);
        setMousePos({ x: 0, y: 0 });
      });
    }

    return () => {
      if (current) {
        current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  const tiltX = isHovered ? mousePos.y * -8 : 0;
  const tiltY = isHovered ? mousePos.x * 12 : 0;
  const highlightOffset = mousePos.x * 20;

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center justify-center select-none pointer-events-auto ${className}`}
      style={{
        perspective: '1200px',
      }}
    >
      {/* Ambient Chrome Backdrop Glow */}
      <div 
        className="absolute inset-0 bg-radial from-white/[0.08] via-white/[0.02] to-transparent rounded-full blur-3xl pointer-events-none transform -translate-y-4"
        style={{
          transform: `scale(${isHovered ? 1.08 : 1})`,
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* SVG Liquid Metal Sculpture Chassis */}
      <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto max-w-[720px] transition-transform duration-700 ease-out will-change-transform filter drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)]"
        style={{
          transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
        }}
      >
        <defs>
          {/* Specular Glow Filter */}
          <filter id="chromeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="16" stdDeviation="24" floodColor="#000000" floodOpacity="0.8" />
          </filter>

          {/* Primary Chrome Surface Gradient */}
          <linearGradient id="chromeFlowA" x1="10%" y1="15%" x2="90%" y2="85%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="12%" stopColor="#E2E8F0" />
            <stop offset="28%" stopColor="#94A3B8" />
            <stop offset="42%" stopColor="#1E293B" />
            <stop offset="55%" stopColor="#475569" />
            <stop offset="68%" stopColor="#CBD5E1" />
            <stop offset="82%" stopColor="#0F172A" />
            <stop offset="94%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          {/* Secondary Ribbon Gradient */}
          <linearGradient id="chromeFlowB" x1="85%" y1="20%" x2="15%" y2="80%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="18%" stopColor="#F8FAFC" />
            <stop offset="35%" stopColor="#64748B" />
            <stop offset="52%" stopColor="#020617" />
            <stop offset="68%" stopColor="#94A3B8" />
            <stop offset="85%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          {/* Core Loop Gradient */}
          <linearGradient id="chromeFlowC" x1="30%" y1="10%" x2="70%" y2="90%">
            <stop offset="0%" stopColor="#F1F5F9" />
            <stop offset="22%" stopColor="#64748B" />
            <stop offset="40%" stopColor="#0B0F19" />
            <stop offset="58%" stopColor="#E2E8F0" />
            <stop offset="75%" stopColor="#334155" />
            <stop offset="90%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>

          {/* High-Reflectance Rim Highlight */}
          <linearGradient id="rimGlint" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>

          {/* Dynamic Light Follower */}
          <radialGradient id="dynamicLight" cx={`${50 + highlightOffset}%`} cy="40%" r="45%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#94A3B8" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Ambient Dark Core Underlay (Shadow Depth) */}
        <path
          d="M 240 330 C 180 390 160 480 270 510 C 390 540 520 480 620 420 C 710 360 740 250 670 170 C 600 90 470 80 370 120 C 290 150 250 220 280 280 Z"
          fill="#05070B"
          opacity="0.95"
          filter="url(#softShadow)"
        />

        {/* Outer Torus Arch (Chrome Loop 1) */}
        <path
          d="M 280 180 C 370 90 530 80 650 140 C 740 190 770 300 710 390 C 660 460 550 510 440 500 C 330 490 220 440 170 370 C 130 310 150 240 220 200 C 290 160 380 180 430 240 C 470 290 450 360 380 390 C 320 410 260 380 250 330 C 240 280 290 230 350 230 C 410 230 460 280 440 340"
          fill="url(#chromeFlowA)"
          stroke="#475569"
          strokeWidth="1.5"
          filter="url(#softShadow)"
        />

        {/* Dynamic Specular Sheen Over Loop 1 */}
        <path
          d="M 280 180 C 370 90 530 80 650 140 C 740 190 770 300 710 390 C 660 460 550 510 440 500 C 330 490 220 440 170 370 C 130 310 150 240 220 200 C 290 160 380 180 430 240 C 470 290 450 360 380 390 C 320 410 260 380 250 330 C 240 280 290 230 350 230 C 410 230 460 280 440 340"
          fill="url(#dynamicLight)"
          opacity="0.8"
        />

        {/* Intertwining Liquid Ribbon (Loop 2 - Volumetric Chrome Fold) */}
        <path
          d="M 330 140 C 420 110 540 130 630 190 C 710 250 730 340 680 410 C 620 480 490 520 380 490 C 280 460 210 390 200 310 C 190 230 260 170 340 170 C 420 170 480 230 470 310 C 460 380 390 420 320 410 C 270 400 240 350 260 300 C 280 260 330 240 370 260 C 410 280 420 330 390 360"
          fill="url(#chromeFlowB)"
          stroke="#CBD5E1"
          strokeWidth="1"
          opacity="0.96"
        />

        {/* Central Abstract Knot & Liquid Cavity (Loop 3) */}
        <path
          d="M 390 220 C 450 180 540 190 600 240 C 650 280 660 350 620 400 C 580 440 500 460 430 440 C 360 420 320 370 330 310 C 340 260 390 230 440 240 C 480 250 510 290 490 330 C 470 360 430 370 400 350 C 380 330 390 300 410 290 Z"
          fill="url(#chromeFlowC)"
        />

        {/* Sharp Specular Rim Highlights (Liquid Reflections) */}
        <path
          d="M 310 160 C 410 95 560 95 660 160 C 730 210 750 290 710 360"
          stroke="url(#rimGlint)"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#chromeGlow)"
        />

        <path
          d="M 220 220 C 160 280 160 350 200 410 C 250 480 370 510 470 490"
          stroke="url(#rimGlint)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
          filter="url(#chromeGlow)"
        />

        <path
          d="M 360 240 C 430 240 470 280 450 340 C 430 380 370 400 320 380"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* Floating Specular Gleam Particles */}
        <circle cx="640" cy="180" r="3.5" fill="#FFFFFF" filter="url(#chromeGlow)" opacity="0.9" />
        <circle cx="210" cy="360" r="2.5" fill="#FFFFFF" filter="url(#chromeGlow)" opacity="0.8" />
        <circle cx="470" cy="300" r="2" fill="#FFFFFF" opacity="0.75" />
        <circle cx="580" cy="410" r="3" fill="#FFFFFF" filter="url(#chromeGlow)" opacity="0.85" />
      </svg>
    </div>
  );
}
