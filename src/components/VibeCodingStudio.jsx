import React from 'react';

export default function VibeCodingStudio() {
  return (
    <section className="section" id="studio">
      <div className="wrap">
        <div className="intro">
          <div className="eyebrow">04 / VIBE CODING STUDIO</div>
          <h2>
            FROM IDEA TO<br />
            APPLICATION.
          </h2>
          <p>
            Describe what you want. MIHO can help create, edit, debug, and test software projects.
          </p>
        </div>

        <div className="split">
          {/* Left Code Editor Box */}
          <div className="code">
            <span style={{ color: '#777' }}>// An idea becomes a project</span>
            <br />
            <b>const</b> idea = "Build something useful";
            <br />
            <br />
            <b>await</b> miho.understand(idea);
            <br />
            <b>await</b> miho.create(&#123;
            <br />
            &nbsp;&nbsp;design: "minimal",
            <br />
            &nbsp;&nbsp;quality: "production-minded"
            <br />
            &#125;);
            <br />
            <br />
            <span style={{ color: '#777' }}>// Build · Edit · Debug · Test</span>
          </div>

          {/* Right Project Preview Box */}
          <div className="preview">
            <span className="eyebrow">PROJECT PREVIEW / CONCEPT</span>
            <strong className="my-4 block">
              Ideas become<br />
              experiences.
            </strong>
            <p className="mb-6">
              A clean canvas for turning a thought into something real in seconds.
            </p>
            <a href="#download" className="btn" style={{ width: 'max-content' }}>
              VIEW PROJECT ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
