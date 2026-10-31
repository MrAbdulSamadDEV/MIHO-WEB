import React from 'react';

export default function ProductShowcase({ onExploreExperience }) {
  return (
    <section className="section" id="showcase">
      <div className="wrap">
        <div className="intro">
          <div className="eyebrow">08 / PRODUCT SHOWCASE</div>
          <h2>
            MEET YOUR NEW<br />
            DIGITAL COMPANION.
          </h2>
          <p>
            Explore the visual world of MIHO. These panels are design concepts, not claims of finished functionality.
          </p>
        </div>

        <div className="showcase">
          {/* Left Experience Preview Window */}
          <div className="window">
            <div className="bar">
              <span>● ● ●</span>
              <span style={{ float: 'right' }}>MIHO / EXPERIENCE PREVIEW</span>
            </div>
            <div className="pane">
              <span className="eyebrow">YOUR SPACE</span>
              <h3 style={{ fontSize: '35px', margin: '15px 0' }}>What shall we make?</h3>
              <div className="tile">
                <span className="text-[10px] font-mono text-[#777] block mb-1">VOICE INPUT</span>
                <span className="text-xs text-[#ccc] font-mono">"MIHO, index this directory and summarize requirements."</span>
                <div className="line" />
              </div>
              <div className="tile">
                <span className="text-[10px] font-mono text-[#777] block mb-1">PROJECT WORKSPACE</span>
                <span className="text-xs text-[#aaa] font-mono">3 actions dispatched • Zero privilege escalation</span>
                <div className="line" style={{ width: '55%' }} />
              </div>
            </div>
          </div>

          {/* Right Visual Language Card */}
          <div className="card flex flex-col justify-between">
            <div>
              <small>VISUAL LANGUAGE</small>
              <h3>Designed to feel different.</h3>
              <p>
                Quiet confidence. Clear purpose. No visual noise.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={onExploreExperience}
                className="btn primary cursor-pointer"
              >
                EXPLORE THE EXPERIENCE ↗
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
