import React from 'react';

export default function AdaptiveInterface() {
  const modes = [
    {
      num: '01 / SIGNATURE',
      title: 'Liquid metal',
      desc: 'Expressive chrome visual centerpiece reflecting real-time conversational states and voice cadence.',
    },
    {
      num: '02 / FLOATING',
      title: 'Compact assistant',
      desc: 'Lightweight frosted glass HUD that floats above your workspace without distracting from focus.',
    },
    {
      num: '03 / FOCUSED',
      title: 'Minimal interface',
      desc: 'Whisper-quiet system tray companion that emerges only when summoned by hotkey or voice wake word.',
    },
  ];

  return (
    <section className="section">
      <div className="wrap">
        <div className="intro">
          <div className="eyebrow">05 / ADAPTIVE INTERFACE</div>
          <h2>
            AN INTERFACE THAT<br />
            ADAPTS TO YOU.
          </h2>
          <p>
            Explore a visual language that can shift between expressive, compact, and minimal ways of interacting.
          </p>
        </div>

        <div className="grid3">
          {modes.map((mode) => (
            <div key={mode.title} className="card">
              <small>{mode.num}</small>
              <h3>{mode.title}</h3>
              <p>{mode.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
