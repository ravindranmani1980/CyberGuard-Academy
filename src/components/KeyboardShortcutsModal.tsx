import React from 'react';
import { Keyboard, X, Command, Sparkles, Shield } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerShortcut: (key: string) => void;
}

const NAVIGATION_SHORTCUTS = [
  { key: 'D', label: 'Posture Overview (Dashboard)', description: 'Jump to executive posture metrics, radial chart & heat map' },
  { key: 'S', label: 'Interactive Drills (Simulations)', description: 'Enter the hands-on threat evaluation & triage arena' },
  { key: 'R', label: 'Peer Threat Radar', description: 'Inspect community threat advisories, comments & watchlist' },
  { key: 'L', label: 'Guardian League (Leaderboard)', description: 'View global sentinel standings & earned certifications' },
  { key: 'P', label: 'Zero-Data Governance', description: 'Open client-side sandbox inspector & memory shredder' },
  { key: 'C', label: 'Start Cyber Drill', description: 'Open player callsign registration & mission launcher' },
];

const ARENA_AND_SYSTEM_SHORTCUTS = [
  { key: '1 – 6', label: 'Switch Drill Module (MOD-01 to MOD-06)', description: 'Directly switch active simulation module while in Interactive Drills' },
  { key: 'M', label: 'Toggle Audio Synthesis', description: 'Mute or unmute Web Audio tactical sound effects' },
  { key: '?', label: 'Keyboard Shortcuts Reference', description: 'Toggle this power-user hotkey cheat sheet' },
  { key: 'Esc', label: 'Dismiss Active Modal / Overlay', description: 'Close any open modal dialog or celebration banner' },
];

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onTriggerShortcut,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#081420]/80 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-shortcuts-title"
    >
      <div className="w-full max-w-2xl rounded-2xl bg-[#081420] border-2 border-[#3E6E86]/70 shadow-2xl text-[#EEF3F1] overflow-hidden animate-appreciation-pop my-auto">
        {/* Header */}
        <div className="px-6 py-4 bg-[#102236] border-b border-[#C9D3D9]/15 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#2BB5A0] text-[#04211B] flex items-center justify-center shrink-0 shadow-md">
              <Keyboard className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-[#5FD3BF]">
                <Sparkles className="w-3.5 h-3.5 text-[#EBC385]" />
                <span>Power-User Command Navigation</span>
              </div>
              <h2
                id="keyboard-shortcuts-title"
                className="text-lg sm:text-xl font-bold text-[#EEF3F1] font-serif"
              >
                Global Keyboard Shortcuts
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            aria-label="Close keyboard shortcuts modal"
            className="p-1.5 rounded-lg text-[#A9B7BF] hover:text-[#EEF3F1] hover:bg-[#081420] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Primary Navigation Hotkeys */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#5FD3BF]">
                01 / Global View Navigation (Click or Press Key)
              </span>
              <span className="text-[11px] font-mono text-[#A9B7BF]">
                Single-Key Instant Jump
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {NAVIGATION_SHORTCUTS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onTriggerShortcut(item.key.toLowerCase());
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-[#102236] border border-[#C9D3D9]/15 hover:border-[#5FD3BF] text-left transition-all flex items-start justify-between gap-3 group cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#EEF3F1] group-hover:text-[#5FD3BF] transition-colors">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-[#A9B7BF] line-clamp-2 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                  <kbd className="px-2.5 py-1 rounded-lg bg-[#081420] border border-[#5FD3BF]/40 text-xs font-mono font-bold text-[#EBC385] shrink-0 shadow-inner">
                    {item.key}
                  </kbd>
                </button>
              ))}
            </div>
          </div>

          {/* Simulation Arena & System Hotkeys */}
          <div className="space-y-3">
            <span className="block text-xs font-mono uppercase tracking-wider text-[#5FD3BF]">
              02 / Drill Arena &amp; System Controls
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ARENA_AND_SYSTEM_SHORTCUTS.map((item) => (
                <div
                  key={item.key}
                  className="p-3 rounded-xl bg-[#0D1C2D]/90 border border-[#C9D3D9]/15 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#EEF3F1]">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-[#A9B7BF] mt-0.5">
                      {item.description}
                    </div>
                  </div>
                  <kbd className="px-2.5 py-1 rounded-lg bg-[#081420] border border-[#C9D3D9]/30 text-xs font-mono font-semibold text-[#5FD3BF] shrink-0 whitespace-nowrap">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Note */}
          <div className="pt-4 border-t border-[#C9D3D9]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#A9B7BF]">
              <Command className="w-3.5 h-3.5 text-[#5FD3BF] shrink-0" />
              <span>
                Shortcuts automatically pause while typing inside text inputs or comment fields.
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                onClose();
              }}
              className="xh-btn primary self-end sm:self-auto"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Got It</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
