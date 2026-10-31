import React from 'react';

export default function VoiceIntelligence() {
  // Generate the 49 harmonic audio waveform bars matching HTML prototype
  const bars = Array.from({ length: 49 }, (_, i) => {
    const h = 18 + Math.abs(Math.sin(i * 0.48) * 105);
    const d = (i * 0.025).toFixed(3);
    return { h: `${h}px`, d: `${d}s` };
  });

  return (
    <section className="section" id="technology">
      <div className="wrap split">
        {/* Left Wavebox Audio Visualizer */}
        <div className="wavebox">
          {bars.map((bar, i) => (
            <i
              key={i}
              style={{
                height: bar.h,
                animationDelay: bar.d,
              }}
            />
          ))}
        </div>

        {/* Right Copy */}
        <div className="copy">
          <div className="eyebrow">03 / VOICE INTELLIGENCE</div>
          <h2>
            JUST SPEAK.<br />
            MIHO UNDERSTANDS.
          </h2>
          <p>
            Natural voice interaction designed around your language, your preferences, and your workflow. Powered by Google Gemini Live WebSocket duplex audio streaming.
          </p>
          <div className="mt-6">
            <span className="eyebrow">VOICE EXPERIENCE — CONCEPT VISUAL</span>
          </div>
        </div>
      </div>
    </section>
  );
}
