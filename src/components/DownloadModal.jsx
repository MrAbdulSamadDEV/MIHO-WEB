import React, { useEffect } from 'react';
import { X, Download, ShieldCheck, ExternalLink, Cpu, Clock, AlertCircle } from 'lucide-react';

export default function DownloadModal({ isOpen, onClose }) {
  // Listen for Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const RELEASES_PAGE_URL = "https://github.com/MrAbdulSamadDEV/WINDOWS-AI-VOICE-AGENT/releases";

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
    >
      <div
        className="modal-window"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Metallic Border Accent */}
        <div style={{ height: '2px', width: '100%', background: 'linear-gradient(90deg, transparent, #888, transparent)', opacity: 0.6, flexShrink: 0 }} />

        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '10px', width: '100%' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '5px 10px', backgroundColor: '#141414', border: '1px solid #303030', fontSize: '11px', fontFamily: 'var(--font-body), Inter, sans-serif', fontWeight: 500, color: '#dddddd', minWidth: 0, flexShrink: 1 }}>
              <span style={{ width: '7px', height: '7px', backgroundColor: '#eab308', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>v1.0.0 Release · Publication Pending</span>
            </div>

            <button
              onClick={onClose}
              className="modal-close-btn"
              aria-label="Close modal"
            >
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          </div>

          <h3
            id="download-modal-title"
            style={{
              fontFamily: 'var(--font-heading), Space Grotesk, sans-serif',
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              lineHeight: 1.25,
              margin: '0 0 6px 0',
              wordBreak: 'break-word',
            }}
          >
            Get MIHO for Windows
          </h3>
          <p style={{ fontSize: '14px', color: '#a0a0a0', lineHeight: 1.6, margin: 0, fontFamily: 'var(--font-body), Inter, sans-serif' }}>
            Autonomous desktop intelligence and duplex voice engine powered by Google Gemini Live.
          </p>
        </div>

        {/* Modal Body with High Readability & Real Status Transparency */}
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Main Primary Download Card - Marked Honestly as Coming Soon */}
          <a
            href={RELEASES_PAGE_URL}
            target="_blank"
            rel="noreferrer"
            className="download-cta-card"
            title="Release binaries are pending upload to GitHub. Click to check official releases repository."
          >
            <div className="download-cta-left">
              <div className="download-cta-icon">
                <Download style={{ width: '20px', height: '20px' }} />
              </div>
              <div className="download-cta-text">
                <div className="download-cta-title">
                  MIHO Setup.exe (Windows Installer)
                </div>
                <div className="download-cta-sub">
                  Windows 10 / 11 (64-bit) · Release binary pending GitHub publication
                </div>
              </div>
            </div>
            <span className="download-cta-badge" style={{ backgroundColor: '#1a1a1a', color: '#ffffff', border: '1px solid #333333' }}>
              COMING SOON
            </span>
          </a>

          {/* Secondary Release Status */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', fontSize: '13px', fontFamily: 'var(--font-body), Inter, sans-serif' }}>
            <span style={{ color: '#888888', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu style={{ width: '15px', height: '15px', color: '#666666', flexShrink: 0 }} />
              <span>Portable Standalone (<code>MIHO.exe</code>) · Coming Soon</span>
            </span>
            <a
              href={RELEASES_PAGE_URL}
              target="_blank"
              rel="noreferrer"
              style={{ color: '#b0b0b0', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#b0b0b0'; }}
            >
              <span style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}>View GitHub Releases Repository</span>
              <ExternalLink style={{ width: '13px', height: '13px', color: '#888888', flexShrink: 0 }} />
            </a>
          </div>

          {/* Transparent Release Availability Disclosure */}
          <div style={{ padding: '10px 14px', backgroundColor: '#141208', border: '1px solid #332b12', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#d4b150', fontFamily: 'var(--font-body), Inter, sans-serif', borderRadius: 0 }}>
            <AlertCircle style={{ width: '15px', height: '15px', flexShrink: 0, color: '#eab308' }} />
            <span>Official binaries (<code>MIHO Setup.exe</code> and <code>MIHO.exe</code>) are not yet published to GitHub Releases. Direct download links will activate automatically upon repository release.</span>
          </div>

          {/* 2-Column Specs & Steps Grid on Desktop, 1-Column on Mobile */}
          <div className="modal-grid-2" style={{ gap: '16px', alignItems: 'stretch' }}>
            
            {/* Column 1: System Requirements & Security Specifications */}
            <div style={{ backgroundColor: '#111111', border: '1px solid #242424', padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '12px', borderRadius: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#ffffff', fontFamily: 'var(--font-heading), Space Grotesk, sans-serif' }}>
                <ShieldCheck style={{ width: '18px', height: '18px', color: '#10b981', flexShrink: 0 }} />
                <span>Zero-Administrator Architecture</span>
              </div>

              <p style={{ fontSize: '13px', color: '#b8b8b8', lineHeight: 1.7, margin: 0, fontFamily: 'var(--font-body), Inter, sans-serif' }}>
                MIHO runs entirely in standard user space under <code style={{ color: '#ffffff', padding: '2px 5px', backgroundColor: '#1a1a1a', border: '1px solid #333333', fontFamily: "'Cascadia Code', Consolas, monospace", fontSize: '11.5px' }}>%APPDATA%\MIHO</code>. It never requests administrator elevation, kernel drivers, or registry tampering.
              </p>

              <div style={{ paddingTop: '10px', borderTop: '1px solid #202020', display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
                <div>
                  <span style={{ color: '#888888', display: 'block', fontSize: '10.5px', fontFamily: 'var(--font-body), Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Operating System</span>
                  <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 500, fontFamily: 'var(--font-body), Inter, sans-serif' }}>Windows 10 / 11 (64-bit Native)</span>
                </div>
                <div>
                  <span style={{ color: '#888888', display: 'block', fontSize: '10.5px', fontFamily: 'var(--font-body), Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Credential Vault</span>
                  <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: 500, fontFamily: 'var(--font-body), Inter, sans-serif' }}>Windows DPAPI Local Encryption</span>
                </div>
              </div>
            </div>

            {/* Column 2: 3 Simple Setup Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-body), Inter, sans-serif', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#888888' }}>
                Setup Guide (Upon Release)
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                
                {/* Step 1 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', backgroundColor: '#0f0f0f', border: '1px solid #222222', borderRadius: 0 }}>
                  <span style={{ width: '20px', height: '20px', backgroundColor: '#1a1a1a', border: '1px solid #383838', fontSize: '10.5px', fontFamily: 'var(--font-body), Inter, sans-serif', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', borderRadius: 0 }}>
                    01
                  </span>
                  <div style={{ fontSize: '12.5px', color: '#cccccc', lineHeight: 1.6, fontFamily: 'var(--font-body), Inter, sans-serif' }}>
                    <strong style={{ color: '#ffffff', fontWeight: 600 }}>Run Installer: </strong>
                    Launch <code style={{ color: '#ffffff', padding: '1px 4px', backgroundColor: '#1a1a1a', border: '1px solid #333333', fontFamily: "'Cascadia Code', Consolas, monospace", fontSize: '11.5px' }}>MIHO Setup.exe</code>. Standard user launch with zero UAC elevation prompts.
                  </div>
                </div>

                {/* Step 2 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', backgroundColor: '#0f0f0f', border: '1px solid #222222', borderRadius: 0 }}>
                  <span style={{ width: '20px', height: '20px', backgroundColor: '#1a1a1a', border: '1px solid #383838', fontSize: '10.5px', fontFamily: 'var(--font-body), Inter, sans-serif', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', borderRadius: 0 }}>
                    02
                  </span>
                  <div style={{ fontSize: '12.5px', color: '#cccccc', lineHeight: 1.6, fontFamily: 'var(--font-body), Inter, sans-serif' }}>
                    <strong style={{ color: '#ffffff', fontWeight: 600 }}>Connect Gemini Key: </strong>
                    Enter your key from{' '}
                    <a
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#ffffff', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 600 }}
                    >
                      Google AI Studio
                    </a>. Encrypted locally via Windows DPAPI hardware vault.
                  </div>
                </div>

                {/* Step 3 */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', backgroundColor: '#0f0f0f', border: '1px solid #222222', borderRadius: 0 }}>
                  <span style={{ width: '20px', height: '20px', backgroundColor: '#1a1a1a', border: '1px solid #383838', fontSize: '10.5px', fontFamily: 'var(--font-body), Inter, sans-serif', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px', borderRadius: 0 }}>
                    03
                  </span>
                  <div style={{ fontSize: '12.5px', color: '#cccccc', lineHeight: 1.6, fontFamily: 'var(--font-body), Inter, sans-serif' }}>
                    <strong style={{ color: '#ffffff', fontWeight: 600 }}>Start Speaking: </strong>
                    Press <kbd style={{ padding: '2px 5px', backgroundColor: '#1e1e1e', border: '1px solid #444444', color: '#ffffff', fontFamily: "'Cascadia Code', Consolas, monospace", fontSize: '11px', borderRadius: 0 }}>Ctrl + Shift + Space</kbd> to begin duplex voice &amp; desktop control.
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="modal-footer" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '10px', fontSize: '12px', color: '#888888', fontFamily: 'var(--font-body), Inter, sans-serif' }}>
          <span>Created &amp; Developed by Abdul Samad · MIHO</span>
          <span style={{ fontSize: '11.5px', color: '#777777' }}>Press <kbd style={{ padding: '2px 5px', backgroundColor: '#181818', border: '1px solid #333333', color: '#cccccc', fontFamily: 'monospace', borderRadius: 0 }}>Esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
