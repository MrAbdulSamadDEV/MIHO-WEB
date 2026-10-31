import React from 'react';

export default function Hero({ onExplore, onDiscover }) {
  return (
    <section className="hero" id="home">
      <div className="wrap heroGrid">
        <div>
          <div className="eyebrow">
            A NEW WAY TO INTERACT WITH YOUR DIGITAL WORLD
          </div>

          <h1>
            THE FUTURE<br />
            <span>HAS A VOICE.</span>
          </h1>

          <p>
            Meet MIHO. One intelligence. Endless possibilities. A voice-first AI companion designed to understand your world, work across your desktop, and help you create.
          </p>

          <div className="buttons">
            <a className="btn primary" href="#product" onClick={onExplore}>
              EXPLORE MIHO ↗
            </a>
            <a className="btn" href="#capabilities" onClick={onDiscover}>
              DISCOVER CAPABILITIES
            </a>
          </div>

          {/* Clean tech spec labels */}
          <div className="mt-8 flex items-center gap-4 text-[11px] font-mono text-[#888] flex-wrap">
            <span className="flex items-center gap-1.5 text-[#aaa]">
              <span className="w-1.5 h-1.5 bg-emerald-400" />
              Gemini Live Engine
            </span>
            <span>•</span>
            <span>Windows 10 / 11 Native</span>
            <span>•</span>
            <span>Zero-Admin Security</span>
          </div>
        </div>

        {/* Abstract Liquid Chrome Sculpture from HTML Prototype */}
        <div className="sculpture">
          <div className="ring" />
          <svg
            className="metal"
            viewBox="0 0 600 540"
            role="img"
            aria-label="Abstract liquid chrome sculpture"
          >
            <defs>
              <linearGradient id="c" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#fff" />
                <stop offset=".18" stopColor="#555" />
                <stop offset=".34" stopColor="#f7f7f7" />
                <stop offset=".52" stopColor="#555" />
                <stop offset=".7" stopColor="#eee" />
                <stop offset="1" stopColor="#333" />
              </linearGradient>
              <linearGradient id="s" x2="0" y2="1">
                <stop stopColor="#fff" stopOpacity=".5" />
                <stop offset="1" stopColor="#000" stopOpacity=".8" />
              </linearGradient>
            </defs>
            <path
              fill="url(#c)"
              d="M300 30C390 45 425 105 398 170c-18 44 52 48 99 83 66 49 38 119-34 137-57 14-65 55-113 96-56 48-110 13-104-42 5-46-50-37-104-57-72-27-67-96-7-126 51-25 78-47 53-96C158 104 216 42 300 30Z"
            />
            <path
              fill="url(#s)"
              d="M300 30C390 45 425 105 398 170c-18 44 52 48 99 83 66 49 38 119-34 137-57 14-65 55-113 96-56 48-110 13-104-42 5-46-50-37-104-57-72-27-67-96-7-126 51-25 78-47 53-96C158 104 216 42 300 30Z"
            />
            <path
              d="M285 70c-58 58-34 110 25 145s103 58 77 111-87 56-102 105"
              fill="none"
              stroke="#fff"
              strokeWidth="22"
              opacity=".7"
              strokeLinecap="round"
            />
            <path
              d="M215 105c55 40 99 35 143 3M105 300c80-40 128-5 143 40M365 450c20-55 62-80 120-94"
              fill="none"
              stroke="#fff"
              strokeWidth="8"
              opacity=".5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
