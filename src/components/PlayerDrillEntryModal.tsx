import React, { useState, useEffect, useRef } from 'react';
import {
  Gamepad2,
  Shield,
  Mail,
  Wifi,
  MessageSquare,
  KeyRound,
  Terminal,
  Smartphone,
  ChevronRight,
  Lock,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import { SimulationType } from '../types';
import { playClickSound, playSuccessSound } from '../utils/audio';

interface PlayerDrillEntryModalProps {
  isOpen: boolean;
  initialPlayerName?: string;
  initialSimType: SimulationType;
  onClose: () => void;
  onConfirmEnterDrill: (playerName: string, selectedSim: SimulationType) => void;
}

const CALLSIGN_SUGGESTIONS = [
  'CyberHawk',
  'ShadowShield',
  'ZeroTrust_01',
  'BlueSentinel',
];

const DRILL_MODULES: {
  id: SimulationType;
  code: string;
  title: string;
  subtitle: string;
  xpReward: string;
  icon: React.ReactNode;
}[] = [
  {
    id: 'phishing',
    code: 'MOD-01',
    title: 'Email & Quishing Defense',
    subtitle: 'Inspect envelope headers & neutralise phishing traps',
    xpReward: '+120 XP',
    icon: <Mail className="w-4 h-4" />,
  },
  {
    id: 'wifi',
    code: 'MOD-02',
    title: 'Rogue Wi-Fi & MITM',
    subtitle: 'Audit BSSID telemetry & block Evil Twin hotspots',
    xpReward: '+130 XP',
    icon: <Wifi className="w-4 h-4" />,
  },
  {
    id: 'social_eng',
    code: 'MOD-03',
    title: 'Social Engineering DMs',
    subtitle: 'Defeat impersonators demanding 2FA OTP codes',
    xpReward: '+125 XP',
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    id: 'password',
    code: 'MOD-04',
    title: 'Password Entropy Lab',
    subtitle: 'Forge high-entropy passphrases vs GPU cracking rigs',
    xpReward: '+110 XP',
    icon: <KeyRound className="w-4 h-4" />,
  },
  {
    id: 'ransomware',
    code: 'MOD-05',
    title: 'Ransomware Incident Triage',
    subtitle: '45s SOC containment: isolate host & kill encryptor',
    xpReward: '+160 XP',
    icon: <Terminal className="w-4 h-4" />,
  },
  {
    id: 'smishing',
    code: 'MOD-06',
    title: 'Spam SMS & BEC Drills',
    subtitle: 'Spot "lost my valut" texts & urgent Boss financial traps',
    xpReward: '+140 XP',
    icon: <Smartphone className="w-4 h-4" />,
  },
];

export const PlayerDrillEntryModal: React.FC<PlayerDrillEntryModalProps> = ({
  isOpen,
  initialPlayerName = '',
  initialSimType,
  onClose,
  onConfirmEnterDrill,
}) => {
  const [nameInput, setNameInput] = useState(initialPlayerName);
  const [selectedSim, setSelectedSim] = useState<SimulationType>(initialSimType);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setNameInput(initialPlayerName || '');
      setSelectedSim(initialSimType);
      setErrorMsg(null);
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialPlayerName, initialSimType]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      setErrorMsg('Please enter your Player Name or Defender Callsign to enter the drill.');
      inputRef.current?.focus();
      return;
    }
    playSuccessSound();
    onConfirmEnterDrill(trimmed, selectedSim);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081420]/80 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drill-entry-modal-title"
    >
      <div className="w-full max-w-2xl rounded-2xl bg-[#081420] border-2 border-[#3E6E86]/70 shadow-2xl text-[#EEF3F1] overflow-hidden animate-appreciation-pop my-auto">
        {/* Top Game Command Header */}
        <div className="px-6 py-4 bg-[#102236] border-b border-[#C9D3D9]/15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2BB5A0] text-[#04211B] flex items-center justify-center shrink-0 shadow-md">
              <Gamepad2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-[#5FD3BF]">
                <Sparkles className="w-3.5 h-3.5 text-[#EBC385]" />
                <span>Interactive Cyber Defense Arena · Mission Briefing</span>
              </div>
              <h2
                id="drill-entry-modal-title"
                className="text-lg sm:text-xl font-bold text-[#EEF3F1] font-serif"
              >
                Enter Cyber Drill — Player Registration
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-[#A9B7BF] hover:text-[#EEF3F1] hover:bg-[#081420] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step 1: Player Name Input */}
          <div className="space-y-2.5">
            <label
              htmlFor="player-callsign-input"
              className="block text-xs font-mono uppercase tracking-wider text-[#5FD3BF]"
            >
              01 / Enter Your Player Name or Defender Callsign
            </label>

            <div className="relative">
              <input
                ref={inputRef}
                id="player-callsign-input"
                type="text"
                maxLength={28}
                value={nameInput}
                onChange={(e) => {
                  setNameInput(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="e.g., Alex, CyberHawk, Mani_Defender..."
                className="w-full px-4 py-3 rounded-xl bg-[#102236] border-2 border-[#3E6E86]/70 focus:border-[#5FD3BF] text-[#EEF3F1] placeholder-[#A9B7BF]/50 text-sm sm:text-base font-medium outline-none transition-colors"
              />
              {nameInput.trim().length > 0 && (
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-mono text-[#5FD3BF] flex items-center gap-1 bg-[#081420] px-2 py-1 rounded border border-[#5FD3BF]/30">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>READY</span>
                </span>
              )}
            </div>

            {errorMsg && (
              <p className="text-xs font-mono text-[#EBC385]">{errorMsg}</p>
            )}

            {/* Quick Callsign Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-mono text-[#A9B7BF]">
                Quick Callsigns:
              </span>
              {CALLSIGN_SUGGESTIONS.map((callsign) => (
                <button
                  key={callsign}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    setNameInput(callsign);
                    setErrorMsg(null);
                  }}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors cursor-pointer border ${
                    nameInput === callsign
                      ? 'bg-[#2BB5A0] text-[#04211B] border-[#5FD3BF] font-semibold'
                      : 'bg-[#102236] text-[#C9D3D9] border-[#C9D3D9]/20 hover:border-[#5FD3BF]'
                  }`}
                >
                  {callsign}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Select Cyber Drill Arena */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#5FD3BF]">
                02 / Select Combat Drill Mission
              </span>
              <span className="text-[11px] font-mono text-[#EBC385]">
                6 Interactive Scenarios Available
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DRILL_MODULES.map((mod) => {
                const isSelected = selectedSim === mod.id;
                return (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSelectedSim(mod.id);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#102236] border-2 border-[#5FD3BF] shadow-md'
                        : 'bg-[#0D1C2D]/80 border-[#C9D3D9]/15 hover:border-[#3E6E86]'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-[#2BB5A0] text-[#04211B]'
                          : 'bg-[#081420] text-[#5FD3BF] border border-[#C9D3D9]/15'
                      }`}
                    >
                      {mod.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono font-semibold text-[#5FD3BF]">
                          {mod.code}
                        </span>
                        <span className="text-[10px] font-mono text-[#EBC385]">
                          {mod.xpReward}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-[#EEF3F1] truncate mt-0.5">
                        {mod.title}
                      </div>
                      <div className="text-[11px] text-[#A9B7BF] line-clamp-1 mt-0.5">
                        {mod.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zero-Data Privacy Notice + Action Buttons */}
          <div className="pt-4 border-t border-[#C9D3D9]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#A9B7BF]">
              <Lock className="w-3.5 h-3.5 text-[#5FD3BF] shrink-0" />
              <span>
                Player name stays 100% in local browser memory. Zero server storage.
              </span>
            </div>

            <div className="flex items-center justify-end gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onClose();
                }}
                className="xh-btn"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="xh-btn primary !px-5 !py-2.5 font-semibold"
              >
                <Shield className="w-4 h-4" />
                <span>Enter Cyber Drill</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
