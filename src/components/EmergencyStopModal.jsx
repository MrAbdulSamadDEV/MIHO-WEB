import React, { useState, useEffect } from 'react';
import { AlertTriangle, Octagon, CheckCircle2, ShieldCheck, X } from 'lucide-react';

export default function EmergencyStopModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-lg bg-neutral-950 border border-red-500/40 p-6 sm:p-8 shadow-[0_0_80px_rgba(239,68,68,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white hover:bg-white/10 cursor-pointer"
          aria-label="Close Emergency Stop Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
            <Octagon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-red-400">
              Safety Simulation Demo
            </div>
            <h3 className="font-heading text-xl font-medium text-white">
              Emergency Stop Engaged
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
          In MIHO, pressing the Emergency Stop hotkey or button immediately triggers a kernel-safe sub-millisecond abort:
        </p>

        <div className="space-y-2.5 mb-6 text-xs font-mono">
          <div className="p-3 bg-red-950/30 border border-red-500/20 flex items-center justify-between text-red-200">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
              Active Gemini Live WebSocket
            </span>
            <span className="text-[10.5px] uppercase font-bold text-red-400">Severed</span>
          </div>

          <div className="p-3 bg-red-950/30 border border-red-500/20 flex items-center justify-between text-red-200">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-400 shrink-0" />
              Desktop Subprocesses &amp; Macros
            </span>
            <span className="text-[10.5px] uppercase font-bold text-red-400">Terminated</span>
          </div>

          <div className="p-3 bg-red-950/30 border border-red-500/20 flex items-center justify-between text-red-200">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              Filesystem &amp; Standard User Boundary
            </span>
            <span className="text-[10.5px] uppercase font-bold text-emerald-400">Uncompromised</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <span className="text-[11px] font-mono text-neutral-500">
            Latency to complete halt: &lt; 2ms
          </span>
          <button
            onClick={onClose}
            className="btn primary text-xs py-2 px-5 cursor-pointer"
          >
            DISMISS &amp; RESUME
          </button>
        </div>
      </div>
    </div>
  );
}
