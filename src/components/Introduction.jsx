import React from 'react';

export default function Introduction() {
  const pillars = [
    {
      num: '01 — UNDERSTAND',
      title: 'Understand',
      desc: 'Understand natural instructions and relevant context with sub-second voice comprehension.',
    },
    {
      num: '02 — CREATE',
      title: 'Create',
      desc: 'Turn ideas into websites, applications, tools, and digital projects via Vibe Coding.',
    },
    {
      num: '03 — EXECUTE',
      title: 'Execute',
      desc: 'Carry out supported tasks across the desktop with appropriate permissions and zero UAC prompts.',
    },
  ];

  return (
    <section className="section" id="about">
      <div className="wrap">
        <div className="intro">
          <div className="eyebrow">01 / THE IDEA</div>
          <h2>
            MORE THAN AN<br />
            AI ASSISTANT.
          </h2>
          <p>
            MIHO brings intelligence, voice, creativity, and desktop capabilities into one connected experience.
          </p>
        </div>

        <div className="grid3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="card">
              <small>{pillar.num}</small>
              <h3>{pillar.title}</h3>
              <p>{pillar.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
