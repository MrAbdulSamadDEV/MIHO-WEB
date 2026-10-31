import React, { useState, useEffect, useRef } from 'react';
import { Camera, QrCode, AlertCircle, RefreshCw, Key, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';

export default function RemoteQRScanner({ onPairSuccess, onCancel }) {
  const [scannerActive, setScannerActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [manualCode, setManualCode] = useState('');
  const [manualDeviceId, setManualDeviceId] = useState('');
  const [pairingStatus, setPairingStatus] = useState('IDLE'); // 'IDLE' | 'SCANNING' | 'WAITING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ERROR'
  const [statusMessage, setStatusMessage] = useState('');
  const [pendingRequestId, setPendingRequestId] = useState(null);

  const scannerRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // Auto-detect URL parameters if scanned with native phone camera
  useEffect(() => {
    const params = new URLSearchParams(window.location.search || window.location.hash.split('?')[1]);
    const token = params.get('token');
    const device = params.get('device');
    if (token && device) {
      handlePairWithToken(token, device);
    }
  }, []);

  // Cleanup scanner and polling on unmount
  useEffect(() => {
    return () => {
      stopScanner();
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const startScanner = async () => {
    setCameraError(null);
    setPairingStatus('SCANNING');
    setScannerActive(true);

    try {
      // Small timeout to ensure DOM container is ready
      setTimeout(async () => {
        try {
          const html5QrCode = new Html5Qrcode('qr-reader-container');
          scannerRef.current = html5QrCode;

          const config = { fps: 10, qrbox: { width: 250, height: 250 } };
          await html5QrCode.start(
            { facingMode: 'environment' },
            config,
            (decodedText) => {
              handleQrDecoded(decodedText);
            },
            () => {
              // Ignore frame decode failures
            }
          );
        } catch (err) {
          console.warn('Camera start error:', err);
          setCameraError('Camera access unavailable. Please grant permission or use manual code entry.');
          setScannerActive(false);
          setPairingStatus('IDLE');
        }
      }, 300);
    } catch (e) {
      setCameraError('Unable to initialize camera scanner.');
      setScannerActive(false);
      setPairingStatus('IDLE');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setScannerActive(false);
  };

  const handleQrDecoded = (decodedText) => {
    stopScanner();

    try {
      // Expecting URL e.g. https://miho.samad.vexr.dev/#remote?token=...&device=...
      let token = null;
      let device = null;

      if (decodedText.includes('token=') && decodedText.includes('device=')) {
        const queryPart = decodedText.split('?')[1] || '';
        const params = new URLSearchParams(queryPart);
        token = params.get('token');
        device = params.get('device');
      } else {
        // Direct JSON format fallback
        try {
          const parsed = JSON.parse(decodedText);
          token = parsed.token || parsed.pairingToken;
          device = parsed.device || parsed.deviceId;
        } catch {}
      }

      if (token && device) {
        handlePairWithToken(token, device);
      } else {
        setCameraError('Unrecognized QR code format. Please scan the QR code displayed in MIHO Windows app.');
        setPairingStatus('IDLE');
      }
    } catch (e) {
      setCameraError('Failed to parse QR code content.');
      setPairingStatus('IDLE');
    }
  };

  const handlePairWithToken = async (token, deviceId) => {
    setPairingStatus('WAITING_APPROVAL');
    setStatusMessage('Pairing request sent. Please approve on your Windows PC…');

    // Generate or retrieve persistent client device ID for this phone
    let clientDeviceId = localStorage.getItem('miho_client_device_id');
    if (!clientDeviceId) {
      clientDeviceId = 'mobile_' + Math.random().toString(36).substring(2, 12);
      localStorage.setItem('miho_client_device_id', clientDeviceId);
    }

    const clientName = `${navigator.userAgent.includes('Android') ? 'Android' : 'Mobile'} (${navigator.userAgent.includes('Chrome') ? 'Chrome' : 'Browser'})`;

    try {
      const res = await fetch('/api/remote/pairing/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pairingToken: token,
          clientDeviceId,
          clientName,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        setPairingStatus('ERROR');
        setStatusMessage(data.error || 'Pairing token invalid or expired.');
        return;
      }

      setPendingRequestId(data.requestId);
      startPollingApproval(data.requestId, clientDeviceId, deviceId);
    } catch (e) {
      setPairingStatus('ERROR');
      setStatusMessage('Network error communicating with MIHO Windows agent. Verify PC is online.');
    }
  };

  const startPollingApproval = (requestId, clientDeviceId, deviceId) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/remote/pairing/check-status/${requestId}?clientDeviceId=${clientDeviceId}`);
        const data = await res.json();

        if (data.status === 'approved' && data.deviceAuthToken) {
          clearInterval(pollIntervalRef.current);
          setPairingStatus('APPROVED');
          setStatusMessage('Approved! Authenticating remote session…');

          // Save authenticated session credentials locally
          const sessionData = {
            deviceId: data.deviceId || deviceId,
            deviceName: data.deviceName || 'MIHO Windows PC',
            deviceAuthToken: data.deviceAuthToken,
            clientDeviceId,
            pairedAt: new Date().toISOString(),
          };
          localStorage.setItem('miho_remote_auth', JSON.stringify(sessionData));

          setTimeout(() => {
            onPairSuccess(sessionData);
          }, 800);
        } else if (data.status === 'expired_or_rejected') {
          clearInterval(pollIntervalRef.current);
          setPairingStatus('REJECTED');
          setStatusMessage('Pairing request was rejected or expired on Windows.');
        }
      } catch (e) {
        // Continue polling until timeout
      }
    }, 1500);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualCode.trim() || !manualDeviceId.trim()) return;
    handlePairWithToken(manualCode.trim(), manualDeviceId.trim());
  };

  return (
    <div className="w-full max-w-md mx-auto p-5 rounded-2xl bg-neutral-950 border border-white/15 backdrop-blur-2xl text-white shadow-2xl">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="eyebrow justify-center mb-2">MIHO REMOTE CONNECT</div>
        <h2 className="font-heading text-2xl font-bold tracking-tight text-white">
          Pair with Windows PC
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Scan the QR code displayed in your MIHO desktop application.
        </p>
      </div>

      {/* State: WAITING_APPROVAL */}
      {pairingStatus === 'WAITING_APPROVAL' && (
        <div className="p-6 rounded-xl bg-neutral-900/80 border border-cyan-500/30 text-center flex flex-col items-center gap-4 my-4 animate-in fade-in">
          <div className="w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <div className="font-heading text-base font-semibold text-white">
              Waiting for Windows Owner Approval
            </div>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Check your computer screen and click <strong className="text-white">Approve Access</strong> on MIHO.
            </p>
          </div>
          <div className="text-[11px] font-mono text-neutral-500 flex items-center gap-1.5 mt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Single-use encrypted authorization</span>
          </div>
        </div>
      )}

      {/* State: APPROVED */}
      {pairingStatus === 'APPROVED' && (
        <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center flex flex-col items-center gap-3 my-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="font-heading text-base font-semibold text-emerald-300">
            Pairing Approved!
          </div>
          <p className="text-xs text-neutral-400">
            Connecting to your MIHO remote dashboard…
          </p>
        </div>
      )}

      {/* State: ERROR or REJECTED */}
      {(pairingStatus === 'ERROR' || pairingStatus === 'REJECTED') && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-center flex flex-col items-center gap-2 mb-4">
          <AlertCircle className="w-6 h-6 text-rose-400" />
          <div className="font-heading text-sm font-semibold text-rose-300">
            Pairing Incomplete
          </div>
          <p className="text-xs text-neutral-400">{statusMessage}</p>
          <button
            onClick={() => setPairingStatus('IDLE')}
            className="mt-2 btn-secondary text-[11px] py-1.5 px-4"
          >
            Try Again
          </button>
        </div>
      )}

      {/* QR Scanner Container */}
      {pairingStatus !== 'WAITING_APPROVAL' && pairingStatus !== 'APPROVED' && (
        <>
          {scannerActive ? (
            <div className="relative mb-5 rounded-xl overflow-hidden border border-white/20 bg-black aspect-square flex flex-col items-center justify-center">
              <div id="qr-reader-container" className="w-full h-full" />
              <button
                onClick={stopScanner}
                className="absolute bottom-3 px-4 py-1.5 rounded-full bg-black/80 border border-white/20 text-xs font-mono text-neutral-300 hover:text-white"
              >
                Cancel Camera
              </button>
            </div>
          ) : (
            <div className="mb-5 flex flex-col items-center">
              <button
                onClick={startScanner}
                className="w-full btn-primary py-3.5 flex items-center justify-center gap-2.5 text-xs font-bold tracking-wider"
              >
                <Camera className="w-4 h-4" />
                SCAN DESKTOP QR CODE
              </button>

              {cameraError && (
                <div className="mt-3 p-3 rounded-lg bg-neutral-900 border border-white/10 text-xs text-amber-300 text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  <span>{cameraError}</span>
                </div>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-5 text-[11px] font-mono text-neutral-500">
            <div className="flex-1 h-px bg-white/10" />
            <span>OR ENTER MANUALLY</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                PC Device ID
              </label>
              <input
                type="text"
                value={manualDeviceId}
                onChange={(e) => setManualDeviceId(e.target.value)}
                placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-xs text-white placeholder-neutral-600 font-mono focus:border-white/30 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                Temporary Pairing Code
              </label>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="48-character pairing hex token"
                className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-white/10 text-xs text-white placeholder-neutral-600 font-mono focus:border-white/30 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={!manualCode.trim() || !manualDeviceId.trim()}
              className="w-full btn-secondary py-2.5 text-xs font-semibold tracking-wider flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <span>SUBMIT PAIRING REQUEST</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </>
      )}

      {/* Cancel button */}
      <div className="mt-5 pt-4 border-t border-white/10 text-center">
        <button
          onClick={onCancel}
          className="text-xs text-neutral-400 hover:text-white transition-colors"
        >
          Return to MIHO Website
        </button>
      </div>
    </div>
  );
}
