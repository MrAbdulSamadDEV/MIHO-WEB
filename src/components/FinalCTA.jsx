import React from 'react';

export default function FinalCTA({ onEnterWorld }) {
  return (
    <section className="ctaSection" id="download">
      <div className="wrap">
        <div className="eyebrow">THE MIHO EXPERIENCE</div>
        <h2>
          THE NEXT ERA<br />
          STARTS HERE.
        </h2>
        <p style={{ color: '#aaa', maxWidth: '440px', margin: '0 auto 28px' }}>
          One intelligence. Endless possibilities. Experience voice-first desktop autonomy designed for focus.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onEnterWorld}
            className="btn primary cursor-pointer"
          >
            ENTER THE WORLD OF MIHO ↗
          </button>
        </div>
        <div className="mt-8 text-[11px] font-mono text-[#777]">
          Native Windows installer • Zero setup friction • No admin rights needed
        </div>
      </div>
    </section>
  );
}
