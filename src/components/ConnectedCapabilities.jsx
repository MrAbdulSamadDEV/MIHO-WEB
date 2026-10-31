import React, { useState } from 'react';

export default function ConnectedCapabilities() {
  const [selectedTag, setSelectedTag] = useState(null);

  const capabilities = [
    { glyph: '◌', name: 'Voice', desc: 'Duplex streaming audio with Gemini Live engine.' },
    { glyph: '▣', name: 'Desktop', desc: '50+ native Windows system commands in user space.' },
    { glyph: '⌘', name: 'Coding', desc: 'Vibe Coding studio for project creation & testing.' },
    { glyph: '▱', name: 'Files', desc: 'Fast semantic indexing and directory management.' },
    { glyph: '◎', name: 'Browser', desc: 'Structured web interaction in Chrome and Edge.' },
    { glyph: '◇', name: 'Memory', desc: 'Contextual project memory stored safely under %APPDATA%.' },
    { glyph: '✧', name: 'Creativity', desc: 'Generative drafting of architectures, specs, and mockups.' },
    { glyph: '↻', name: 'Automation', desc: 'User-controlled multi-step workflows with confirmation.' },
  ];

  return (
    <section className="section" id="capabilities">
      <div className="wrap">
        <div className="intro">
          <div className="eyebrow">06 / CONNECTED CAPABILITIES</div>
          <h2>
            ONE INTELLIGENCE.<br />
            MANY POSSIBILITIES.
          </h2>
          <p>
            A unified AI experience connecting voice, desktop tools, coding, files, browser interaction, and personal preferences.
          </p>
        </div>

        <div className="tags">
          {capabilities.map((cap) => (
            <div
              key={cap.name}
              onClick={() => setSelectedTag(selectedTag === cap.name ? null : cap.name)}
              className={`tag ${selectedTag === cap.name ? '!border-[#aaa] !bg-[#151515]' : ''}`}
            >
              <span className="text-xl text-[#aaa]">{cap.glyph}</span>
              <b>{cap.name}</b>
              {selectedTag === cap.name && (
                <span className="text-[11px] text-[#888] font-mono mt-2 block">
                  {cap.desc}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
