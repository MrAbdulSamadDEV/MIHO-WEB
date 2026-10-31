import React, { useState } from 'react';

export default function DesktopIntelligence() {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    { title: 'Desktop Control', subtitle: '50+ native Windows actions supported.' },
    { title: 'File Intelligence', subtitle: 'Semantic indexing & smart organization.' },
    { title: 'Browser Automation', subtitle: 'Safe, sandboxed Chrome and Edge control.' },
    { title: 'Screen Understanding', subtitle: 'Contextual multimodal UI perception.' },
  ];

  return (
    <section className="section" id="product">
      <div className="wrap split">
        {/* Left Copy */}
        <div className="copy">
          <div className="eyebrow">02 / DESKTOP INTELLIGENCE</div>
          <h2>
            YOUR WORLD.<br />
            YOUR COMMAND.
          </h2>
          <p>
            From managing files to interacting with your desktop, MIHO helps turn instructions into actions.
          </p>
          <div className="pt-4">
            <a className="btn" href="#capabilities">
              EXPLORE CAPABILITIES ↗
            </a>
          </div>
        </div>

        {/* Right Window UI Mockup */}
        <div className="window">
          <div className="bar">
            <span>● ● ●</span>
            <span style={{ float: 'right' }}>MIHO / DESKTOP CONCEPT</span>
          </div>

          <div className="desk">
            <aside className="side">
              {features.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`line cursor-pointer ${activeTab === i ? 'active' : ''}`}
                />
              ))}
            </aside>

            <div className="pane">
              <strong>Good to have you here.</strong>
              <p style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                What would you like to work on?
              </p>

              <div className="tile">
                <span className="font-mono text-[10px] text-[#777] block mb-1">
                  ACTIVE MODULE: {features[activeTab].title.toUpperCase()}
                </span>
                <div className="line" />
                <div className="line" style={{ width: '55%' }} />
                <span className="text-[10px] text-[#aaa] font-mono block mt-2">
                  {features[activeTab].subtitle}
                </span>
              </div>

              <div className="tile">
                <span className="font-mono text-[10px] text-[#777] block mb-1">
                  SECURITY STATUS
                </span>
                <span className="text-[10px] text-[#aaa] font-mono">
                  Standard User Profile • Zero Admin Rights Needed
                </span>
                <div className="line" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
