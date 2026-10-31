import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Monitor,
  MonitorOff,
  Video,
  VideoOff,
  MousePointer,
  Keyboard,
  Power,
  Volume2,
  VolumeX,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Download,
  Play,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function RemoteDashboard({ session, onDisconnect }) {
  // Connection states: 'DISCONNECTED' | 'CONNECTING' | 'AUTHENTICATING' | 'CONNECTED' | 'RECONNECTING' | 'CONNECTION FAILED'
  const [connectionState, setConnectionState] = useState('CONNECTING');
  const [latencyMs, setLatencyMs] = useState(null);

  // Section 1: MIHO Voice & Conversation State (Works independently from screen sharing!)
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [textCommand, setTextCommand] = useState('');
  const [conversation, setConversation] = useState([
    {
      sender: 'miho',
      text: 'Good to have you here. I am connected to your Windows PC. How can I help you?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Section 2: PC Screen State (NEVER appears automatically, ONLY on user click!)
  const [screenSharingState, setScreenSharingState] = useState('OFF'); // 'OFF' | 'CONNECTING' | 'ACTIVE' | 'STOPPED' | 'FAILED'
  const [currentFrameUrl, setCurrentFrameUrl] = useState(null);
  const [screenFps, setScreenFps] = useState(12);

  // Section 3: Remote Controls (Touchpad & Keyboard)
  const [activeTab, setActiveTab] = useState('voice'); // 'voice' | 'screen' | 'controls' | 'recordings'
  const [keyboardText, setKeyboardText] = useState('');
  const [recordingState, setRecordingState] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingsList, setRecordingsList] = useState([]);

  const wsRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const touchStartRef = useRef({ x: 0, y: 0, time: 0 });
  const touchMovedRef = useRef(false);
  const recordingTimerRef = useRef(null);

  // Initialize Web Speech API for voice conversation
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US'; // Supports multilingual speech

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        handleUserMessage(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
    }
  }, []);

  // Text-to-Speech Spoken Response from MIHO
  const speakResponse = (text) => {
    if (voiceMuted || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  // Connect WebSocket to Windows Agent / Relay
  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [session]);

  const connectWebSocket = () => {
    setConnectionState('CONNECTING');
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Connect to host on /ws/remote
    const wsUrl = `${protocol}//${window.location.host}/ws/remote`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnectionState('AUTHENTICATING');
        // Authenticate with device session credentials
        ws.send(
          JSON.stringify({
            type: 'auth',
            deviceId: session.deviceId,
            clientDeviceId: session.clientDeviceId,
            token: session.deviceAuthToken,
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'auth_success') {
            setConnectionState('CONNECTED');
            // Start ping latency check
            startPingLoop();
          } else if (msg.type === 'auth_error') {
            setConnectionState('CONNECTION FAILED');
            alert('Authentication failed: ' + (msg.error || 'Invalid session credentials.'));
            onDisconnect();
          } else if (msg.type === 'command_result') {
            setIsProcessing(false);
            const confirmationText = msg.ok
              ? (typeof msg.result === 'string' ? msg.result : `Command completed successfully (${msg.executionTimeMs}ms).`)
              : `Execution notice: ${msg.error || 'Action could not be executed.'}`;

            addConversationMessage('miho', confirmationText);
            speakResponse(confirmationText);
          } else if (msg.type === 'screen_frame') {
            setCurrentFrameUrl(`data:image/jpeg;base64,${msg.frameBase64}`);
          } else if (msg.type === 'screen_stream_status') {
            if (msg.streaming) {
              setScreenSharingState('ACTIVE');
            } else {
              setScreenSharingState('STOPPED');
              setCurrentFrameUrl(null);
            }
          } else if (msg.type === 'record_status') {
            if (msg.recording) {
              setRecordingState(true);
              startRecordingTimer();
            } else {
              setRecordingState(false);
              stopRecordingTimer();
              fetchRecordingsList();
            }
          } else if (msg.type === 'pong') {
            setLatencyMs(Date.now() - msg.clientTimestamp);
          }
        } catch (e) {
          console.error('WS message error:', e);
        }
      };

      ws.onerror = () => {
        setConnectionState('CONNECTION FAILED');
      };

      ws.onclose = () => {
        setConnectionState('DISCONNECTED');
        setScreenSharingState('OFF');
        setCurrentFrameUrl(null);
      };
    } catch (e) {
      setConnectionState('CONNECTION FAILED');
    }
  };

  const startPingLoop = () => {
    const pingInterval = setInterval(() => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping', timestamp: Date.now() }));
      } else {
        clearInterval(pingInterval);
      }
    }, 4000);
  };

  const addConversationMessage = (sender, text) => {
    setConversation((prev) => [
      ...prev,
      {
        sender,
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Voice Interaction Handlers
  const toggleVoiceListening = () => {
    if (isListening) {
      if (speechRecognitionRef.current) speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.start();
        } catch {}
      } else {
        alert('Voice recognition is not supported in this browser. You can type commands below.');
      }
    }
  };

  const handleUserMessage = (text) => {
    if (!text.trim()) return;
    addConversationMessage('user', text);
    setIsProcessing(true);

    // Send command over authenticated WebSocket to Windows PC
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Analyze text for direct tools or AI prompt
      let tool = 'searchGoogle';
      let args = { query: text };

      const lower = text.toLowerCase();
      if (lower.includes('notepad') || lower.includes('open notepad')) {
        tool = 'openApplication';
        args = { application: 'notepad' };
      } else if (lower.includes('chrome') || lower.includes('open chrome') || lower.includes('browser')) {
        tool = 'openWebsite';
        args = { url: 'https://google.com' };
      } else if (lower.includes('volume up')) {
        tool = 'volumeUp';
        args = {};
      } else if (lower.includes('volume down')) {
        tool = 'volumeDown';
        args = {};
      } else if (lower.includes('mute')) {
        tool = 'muteToggle';
        args = {};
      } else if (lower.includes('screenshot') || lower.includes('capture screen')) {
        tool = 'saveScreenshot';
        args = {};
      }

      wsRef.current.send(
        JSON.stringify({
          type: 'command',
          commandId: Math.random().toString(36).substring(7),
          tool,
          args,
          prompt: text,
        })
      );
    } else {
      setIsProcessing(false);
      addConversationMessage('miho', 'Cannot send command: PC is currently offline.');
    }
  };

  // Screen Sharing Handlers (Strictly On-Demand: Only when clicked!)
  const handleStartScreenShare = () => {
    setScreenSharingState('CONNECTING');
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'screen_stream_start', fps: screenFps }));
    } else {
      setScreenSharingState('FAILED');
    }
  };

  const handleStopScreenShare = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'screen_stream_stop' }));
    }
    setScreenSharingState('OFF');
    setCurrentFrameUrl(null);
  };

  // Mouse & Touchpad Event Handlers
  const handleTouchpadStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    touchMovedRef.current = false;
  };

  const handleTouchpadMove = (e) => {
    touchMovedRef.current = true;
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const normX = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
    const normY = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'mouse_move', normX, normY }));
    }
  };

  const handleTouchpadEnd = (e) => {
    const duration = Date.now() - touchStartRef.current.time;
    // If short tap without significant move -> Left Click
    if (!touchMovedRef.current && duration < 250) {
      sendMouseClick('left');
    }
  };

  const sendMouseClick = (button = 'left', double = false) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'mouse_click', button, double }));
    }
  };

  const sendMouseScroll = (delta) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'mouse_scroll', delta }));
    }
  };

  // Virtual Keyboard Typing
  const handleSendKeyboardText = (e) => {
    e.preventDefault();
    if (!keyboardText) return;
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'keyboard_type', text: keyboardText }));
      setKeyboardText('');
    }
  };

  const sendHotkey = (keys) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'keyboard_hotkey', keys }));
    }
  };

  // Screen Recording Handlers
  const startRecordingTimer = () => {
    setRecordingSeconds(0);
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopRecordingTimer = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
  };

  const toggleRecording = () => {
    if (recordingState) {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'screen_record_stop' }));
      }
    } else {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'screen_record_start', fps: 6 }));
      }
    }
  };

  const fetchRecordingsList = async () => {
    try {
      const res = await fetch('/api/remote/recordings');
      const data = await res.json();
      if (data.ok && Array.isArray(data.recordings)) {
        setRecordingsList(data.recordings);
      }
    } catch {}
  };

  // Local Emergency Disconnect
  const handleEmergencyDisconnect = async () => {
    try {
      await fetch('/api/remote/emergency-disconnect', { method: 'POST' });
    } catch {}
    handleStopScreenShare();
    onDisconnect();
  };

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col font-sans">
      {/* Top Remote Status Bar */}
      <header className="sticky top-0 z-40 bg-neutral-950/95 border-b border-white/10 px-4 py-3 flex items-center justify-between backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full ${
            connectionState === 'CONNECTED' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
          }`} />
          <div>
            <div className="font-heading text-xs font-bold tracking-wider text-white">
              {session.deviceName || 'MIHO Windows PC'}
            </div>
            <div className="text-[10px] font-mono text-neutral-400 flex items-center gap-2">
              <span>{connectionState}</span>
              {latencyMs !== null && <span>· {latencyMs}ms</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceMuted(!voiceMuted)}
            className="p-1.5 rounded-lg bg-neutral-900 border border-white/10 text-neutral-300"
            title={voiceMuted ? 'Unmute MIHO Voice' : 'Mute MIHO Voice'}
          >
            {voiceMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={onDisconnect}
            className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-white/15 text-[11px] font-mono text-neutral-300 hover:text-white"
          >
            Disconnect
          </button>
        </div>
      </header>

      {/* Navigation Tabs for Mobile Remote */}
      <nav className="flex items-center border-b border-white/10 bg-neutral-950 px-2 py-1 text-xs font-mono">
        <button
          onClick={() => setActiveTab('voice')}
          className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'voice' ? 'bg-white/15 text-white' : 'text-neutral-400'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>MIHO Voice</span>
        </button>

        <button
          onClick={() => setActiveTab('screen')}
          className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'screen' ? 'bg-white/15 text-white' : 'text-neutral-400'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>PC Screen</span>
          {screenSharingState === 'ACTIVE' && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('controls')}
          className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'controls' ? 'bg-white/15 text-white' : 'text-neutral-400'
          }`}
        >
          <MousePointer className="w-3.5 h-3.5" />
          <span>Controls</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('recordings');
            fetchRecordingsList();
          }}
          className={`flex-1 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeTab === 'recordings' ? 'bg-white/15 text-white' : 'text-neutral-400'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Recordings</span>
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-4 pb-24 overflow-y-auto max-w-lg mx-auto w-full">
        {/* =================================================================== */}
        {/* SECTION 1: MIHO VOICE & CONVERSATION (Completely Independent!)      */}
        {/* =================================================================== */}
        {activeTab === 'voice' && (
          <div className="flex flex-col gap-4">
            {/* Voice Status Pill */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900/60 border border-white/10 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Voice Engine: Gemini Live Duplex</span>
              </div>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                isListening
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : isSpeaking
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-neutral-800 text-neutral-400'
              }`}>
                {isListening ? 'Listening…' : isSpeaking ? 'Speaking…' : isProcessing ? 'Processing…' : 'Ready'}
              </span>
            </div>

            {/* Conversation Log */}
            <div className="flex flex-col gap-2.5 min-h-[220px] max-h-[340px] overflow-y-auto p-3 rounded-2xl bg-neutral-950 border border-white/[0.08]">
              {conversation.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'ml-auto bg-neutral-800 text-white rounded-br-none border border-white/10'
                      : 'mr-auto bg-neutral-900/80 text-neutral-200 rounded-bl-none border border-white/[0.06]'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className="text-[9px] font-mono text-neutral-500 mt-1 self-end">
                    {msg.time}
                  </span>
                </div>
              ))}
              {isProcessing && (
                <div className="mr-auto p-3 rounded-2xl bg-neutral-900/50 text-xs font-mono text-neutral-400 flex items-center gap-2">
                  <RefreshCw className="w-3 h-3 animate-spin text-cyan-400" />
                  <span>Executing Windows command…</span>
                </div>
              )}
            </div>

            {/* Central Interactive Microphone Orb */}
            <div className="flex flex-col items-center justify-center my-3">
              <button
                onClick={toggleVoiceListening}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-2xl relative group ${
                  isListening
                    ? 'bg-cyan-500 text-black shadow-[0_0_35px_rgba(6,182,212,0.8)] scale-105'
                    : 'bg-neutral-900 text-white border border-white/20 hover:border-white/40'
                }`}
                title="Tap to Speak with MIHO"
              >
                {isListening && (
                  <span className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping" />
                )}
                {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8 text-neutral-400 group-hover:text-white" />}
              </button>
              <span className="text-xs font-mono text-neutral-400 mt-2">
                {isListening ? 'Listening to your voice…' : 'Tap to speak with MIHO'}
              </span>
            </div>

            {/* Text Input Fallback */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUserMessage(textCommand);
                setTextCommand('');
              }}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-neutral-900 border border-white/10"
            >
              <input
                type="text"
                value={textCommand}
                onChange={(e) => setTextCommand(e.target.value)}
                placeholder="Type instructions (e.g. open Chrome, volume up)…"
                className="flex-1 bg-transparent px-3 py-1.5 text-xs text-white placeholder-neutral-500 outline-none font-mono"
              />
              <button
                type="submit"
                disabled={!textCommand.trim() || isProcessing}
                className="p-2 rounded-lg bg-white text-black font-bold disabled:opacity-30 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* =================================================================== */}
        {/* SECTION 2: PC SCREEN (Strictly On-Demand: Only When User Clicks!)   */}
        {/* =================================================================== */}
        {activeTab === 'screen' && (
          <div className="flex flex-col gap-4">
            {screenSharingState === 'OFF' && (
              <div className="p-8 rounded-2xl bg-neutral-950 border border-white/10 text-center flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400">
                  <MonitorOff className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">
                    Screen Sharing is Off
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xs leading-relaxed">
                    For your privacy, your PC screen is never streamed automatically. Click below to view your Windows screen.
                  </p>
                </div>

                <button
                  onClick={handleStartScreenShare}
                  className="btn-primary py-3 px-6 text-xs font-bold tracking-wider flex items-center gap-2"
                >
                  <Monitor className="w-4 h-4" />
                  SHARE SCREEN
                </button>
              </div>
            )}

            {screenSharingState === 'CONNECTING' && (
              <div className="p-8 rounded-2xl bg-neutral-950 border border-cyan-500/30 text-center flex flex-col items-center gap-3">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                <div className="text-sm font-semibold text-white">Connecting to Windows Screen…</div>
                <p className="text-xs text-neutral-400">Awaiting stream authorization from Windows agent.</p>
              </div>
            )}

            {screenSharingState === 'ACTIVE' && (
              <div className="flex flex-col gap-3">
                {/* Live Screen Viewer */}
                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/20 bg-black flex items-center justify-center shadow-2xl">
                  {currentFrameUrl ? (
                    <img
                      src={currentFrameUrl}
                      alt="Live PC Screen"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-xs font-mono text-neutral-500">Buffering screen frames…</div>
                  )}

                  {/* Top Live Overlay */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 border border-white/20 text-[10px] font-mono text-rose-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    <span>LIVE STREAM</span>
                  </div>
                </div>

                {/* Stream Controls */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-900 border border-white/10 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400">Stream FPS:</span>
                    <select
                      value={screenFps}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setScreenFps(val);
                        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                          wsRef.current.send(JSON.stringify({ type: 'screen_stream_start', fps: val }));
                        }
                      }}
                      className="bg-neutral-800 text-white rounded px-2 py-1 outline-none border border-white/10"
                    >
                      <option value="6">6 FPS (Low Data)</option>
                      <option value="12">12 FPS (Balanced)</option>
                      <option value="20">20 FPS (Smooth)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleStopScreenShare}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                  >
                    STOP SHARING
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* SECTION 3: REMOTE CONTROLS (Touchpad & Keyboard)                    */}
        {/* =================================================================== */}
        {activeTab === 'controls' && (
          <div className="flex flex-col gap-4">
            {/* Interactive Touchpad Surface */}
            <div className="flex flex-col gap-1.5">
              <div className="text-xs font-mono text-neutral-400 flex items-center justify-between">
                <span>VIRTUAL TOUCHPAD</span>
                <span className="text-[10px] text-neutral-500">Drag to move · Tap to click</span>
              </div>
              <div
                onTouchStart={handleTouchpadStart}
                onTouchMove={handleTouchpadMove}
                onTouchEnd={handleTouchpadEnd}
                className="h-52 rounded-2xl bg-neutral-950 border border-white/20 flex items-center justify-center text-xs font-mono text-neutral-500 select-none shadow-inner"
              >
                Touchpad Active (Touch & Drag)
              </div>
            </div>

            {/* Mouse Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => sendMouseClick('left')}
                className="btn-secondary py-2.5 text-xs font-semibold"
              >
                Left Click
              </button>
              <button
                onClick={() => sendMouseClick('left', true)}
                className="btn-secondary py-2.5 text-xs font-semibold"
              >
                Double Click
              </button>
              <button
                onClick={() => sendMouseClick('right')}
                className="btn-secondary py-2.5 text-xs font-semibold"
              >
                Right Click
              </button>
            </div>

            {/* Mouse Scroll Bar */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-neutral-900 border border-white/10 text-xs font-mono">
              <span className="text-neutral-400">Scroll:</span>
              <button
                onClick={() => sendMouseScroll(-180)}
                className="flex-1 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white"
              >
                ▲ Up
              </button>
              <button
                onClick={() => sendMouseScroll(180)}
                className="flex-1 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white"
              >
                ▼ Down
              </button>
            </div>

            {/* Keyboard Typing Form */}
            <form onSubmit={handleSendKeyboardText} className="flex gap-2">
              <input
                type="text"
                value={keyboardText}
                onChange={(e) => setKeyboardText(e.target.value)}
                placeholder="Type text to send to PC window…"
                className="flex-1 px-3 py-2 rounded-xl bg-neutral-900 border border-white/10 text-xs text-white placeholder-neutral-500 font-mono outline-none"
              />
              <button type="submit" className="btn-primary py-2 px-4 text-xs font-bold">
                TYPE
              </button>
            </form>

            {/* PC Shortcuts Bar */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
              <button onClick={() => sendHotkey(['enter'])} className="pill-tag text-xs">Enter</button>
              <button onClick={() => sendHotkey(['esc'])} className="pill-tag text-xs">Esc</button>
              <button onClick={() => sendHotkey(['tab'])} className="pill-tag text-xs">Tab</button>
              <button onClick={() => sendHotkey(['ctrl', 'c'])} className="pill-tag text-xs">Ctrl+C</button>
              <button onClick={() => sendHotkey(['ctrl', 'v'])} className="pill-tag text-xs">Ctrl+V</button>
              <button onClick={() => sendHotkey(['win'])} className="pill-tag text-xs">Win Key</button>
              <button onClick={() => sendHotkey(['alt', 'tab'])} className="pill-tag text-xs">Alt+Tab</button>
              <button onClick={() => sendHotkey(['alt', 'f4'])} className="pill-tag text-xs text-rose-300">Alt+F4</button>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* SECTION 4: SCREEN RECORDINGS (Authorized File Access)               */}
        {/* =================================================================== */}
        {activeTab === 'recordings' && (
          <div className="flex flex-col gap-4">
            {/* Record Control Box */}
            <div className="p-4 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-between">
              <div>
                <div className="font-heading text-sm font-semibold text-white">
                  Windows Screen Recording
                </div>
                <div className="text-[11px] font-mono text-neutral-400">
                  {recordingState ? `Recording: ${recordingSeconds}s` : 'Authorized local recording'}
                </div>
              </div>

              <button
                onClick={toggleRecording}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                  recordingState
                    ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                {recordingState ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                <span>{recordingState ? 'STOP' : 'START RECORD'}</span>
              </button>
            </div>

            {/* Recordings List */}
            <div className="flex flex-col gap-2">
              <div className="text-xs font-mono text-neutral-400">AVAILABLE RECORDINGS</div>
              {recordingsList.length === 0 ? (
                <div className="p-6 rounded-xl bg-neutral-950 border border-white/[0.08] text-center text-xs font-mono text-neutral-500">
                  No screen recordings found on PC.
                </div>
              ) : (
                recordingsList.map((rec) => (
                  <div
                    key={rec.filename}
                    className="p-3 rounded-xl bg-neutral-950 border border-white/10 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-mono text-xs text-white truncate max-w-[200px]">{rec.filename}</div>
                      <div className="text-[10px] font-mono text-neutral-500">
                        {rec.createdAt} · {Math.round(rec.sizeBytes / 1024)} KB
                      </div>
                    </div>

                    <a
                      href={`/api/remote/recordings/${rec.filename}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-cyan-400 border border-white/10"
                      title="Download / Preview Recording"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Fixed Emergency Bar */}
      <footer className="fixed bottom-0 inset-x-0 bg-neutral-950/90 border-t border-white/10 px-4 py-3 flex items-center justify-between backdrop-blur-md z-40 max-w-lg mx-auto">
        <button
          onClick={handleEmergencyDisconnect}
          className="px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-mono font-bold flex items-center gap-1.5"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Emergency Disconnect</span>
        </button>

        <span className="text-[10px] font-mono text-neutral-500">
          MIHO Remote · Zero UAC
        </span>
      </footer>
    </div>
  );
}
