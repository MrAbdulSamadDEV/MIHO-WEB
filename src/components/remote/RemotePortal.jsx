import React, { useState, useEffect } from 'react';
import RemoteQRScanner from './RemoteQRScanner.jsx';
import RemoteDashboard from './RemoteDashboard.jsx';
import { Smartphone, Monitor, ArrowLeft, Shield } from 'lucide-react';

export default function RemotePortal({ onClose }) {
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem('miho_remote_auth');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isMobileDevice, setIsMobileDevice] = useState(true);

  // Check device viewport and enforce mobile exclusivity
  useEffect(() => {
    const checkDevice = () => {
      const isSmallScreen = window.innerWidth < 820;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobileDevice(isSmallScreen || hasTouch);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handlePairSuccess = (newSession) => {
    setSession(newSession);
  };

  const handleDisconnect = () => {
    try {
      localStorage.removeItem('miho_remote_auth');
    } catch {}
    setSession(null);
  };

  // If accessed from a desktop or laptop, enforce strict mobile-only notice
  if (!isMobileDevice) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl text-white">
        <div className="max-w-md w-full p-8 rounded-2xl bg-neutral-950 border border-white/15 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center mx-auto mb-4 text-cyan-400">
            <Smartphone className="w-8 h-8" />
          </div>
          <div className="eyebrow justify-center mb-2">MOBILE ONLY FEATURE</div>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-white mb-3">
            Mobile Remote Experience
          </h2>
          <p className="text-sm text-neutral-400 leading-relaxed mb-6">
            MIHO Remote Connection is designed exclusively for mobile phones. Open <strong className="text-white">miho.samad.vexr.dev</strong> on your smartphone to scan the PC pairing QR code.
          </p>
          <button
            onClick={onClose}
            className="btn-primary py-2.5 px-6 text-xs font-bold tracking-wider inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            RETURN TO LANDING PAGE
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black animate-in fade-in duration-200">
      {session ? (
        <RemoteDashboard session={session} onDisconnect={handleDisconnect} />
      ) : (
        <div className="min-h-screen py-10 px-4 flex flex-col justify-center">
          <RemoteQRScanner onPairSuccess={handlePairSuccess} onCancel={onClose} />
        </div>
      )}
    </div>
  );
}
