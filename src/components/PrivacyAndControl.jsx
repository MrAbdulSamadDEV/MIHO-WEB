import React from 'react';

export default function PrivacyAndControl({ onTriggerEmergencyStop }) {
  const cards = [
    {
      title: 'Permission controls',
      desc: 'Choose what MIHO is allowed to access and do. Runs strictly as standard unprivileged user.',
      action: null,
    },
    {
      title: 'Emergency Stop',
      desc: 'A clear way to stop active operations. Click to test the simulated Emergency Stop interrupt.',
      action: onTriggerEmergencyStop,
      isEmergency: true,
    },
    {
      title: 'Action history',
      desc: 'Understand what actions were requested and performed with local JSONL audit logs.',
      action: null,
    },
  ];

  return (
    <section className="section">
      <div className="wrap">
        <div className="intro">
          <div className="eyebrow">07 / PRIVACY & CONTROL</div>
          <h2>
            INTELLIGENCE.<br />
            UNDER YOUR CONTROL.
          </h2>
          <p>
            MIHO is designed around permissions, user control, and responsible automation.
          </p>
        </div>

        <div className="grid3">
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={card.action || undefined}
              className={`card ${card.isEmergency ? 'cursor-pointer hover:!border-red-500/50' : ''}`}
            >
              {card.isEmergency && (
                <small style={{ color: '#ef4444' }}>SIMULATION READY</small>
              )}
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
