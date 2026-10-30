import React from 'react';
import { Volume2, VolumeX, ShieldAlert, Keyboard } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface HeaderProps {
  activeTab: 'dashboard' | 'simulations' | 'radar' | 'leaderboard' | 'privacy';
  setActiveTab: (tab: 'dashboard' | 'simulations' | 'radar' | 'leaderboard' | 'privacy') => void;
  onOpenPrivacy: () => void;
  onTriggerQuickDrill: () => void;
  onOpenShortcuts: () => void;
  muted: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenPrivacy,
  onTriggerQuickDrill,
  onOpenShortcuts,
  muted,
  onToggleSound,
}) => {
  const handleNavClick = (tab: 'dashboard' | 'simulations' | 'radar' | 'leaderboard' | 'privacy') => {
    playClickSound();
    if (tab === 'privacy') {
      onOpenPrivacy();
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <header className="rm-site-header px-6">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-6 min-h-[64px] py-2">
        {/* Zone 1: Brand lockup matching Postrix (.rm-brand + .rm-mono-mark) */}
        <a
          href="#dashboard"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('dashboard');
          }}
          className="rm-brand whitespace-nowrap shrink-0"
        >
          <span className="rm-mono-mark" aria-hidden="true">
            RM
          </span>
          <span>
            Maniq <span className="accent">Threat Guard</span>
          </span>
        </a>

        {/* Zone 2: Navigation links matching Postrix (.rm-navlink / .rm-navlink-active) with power-user hotkey badges */}
        <nav aria-label="Main navigation" className="hidden lg:flex flex-wrap items-center gap-x-5 gap-y-1">
          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            title="Posture Overview (Shortcut: D)"
            aria-keyshortcuts="d"
            aria-current={activeTab === 'dashboard' ? 'page' : undefined}
            className={`rm-navlink whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5 ${
              activeTab === 'dashboard' ? 'rm-navlink-active' : ''
            }`}
          >
            <span>Posture Overview</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#102236] border border-[#3E6E86]/50 text-[#5FD3BF] opacity-80">
              D
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('simulations')}
            title="Interactive Drills (Shortcut: S)"
            aria-keyshortcuts="s"
            aria-current={activeTab === 'simulations' ? 'page' : undefined}
            className={`rm-navlink whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5 ${
              activeTab === 'simulations' ? 'rm-navlink-active' : ''
            }`}
          >
            <span>Interactive Drills</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#102236] border border-[#3E6E86]/50 text-[#5FD3BF] opacity-80">
              S
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('radar')}
            title="Peer Threat Radar (Shortcut: R)"
            aria-keyshortcuts="r"
            aria-current={activeTab === 'radar' ? 'page' : undefined}
            className={`rm-navlink whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5 ${
              activeTab === 'radar' ? 'rm-navlink-active' : ''
            }`}
          >
            <span>Peer Threat Radar</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#102236] border border-[#3E6E86]/50 text-[#5FD3BF] opacity-80">
              R
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('leaderboard')}
            title="Guardian League (Shortcut: L)"
            aria-keyshortcuts="l"
            aria-current={activeTab === 'leaderboard' ? 'page' : undefined}
            className={`rm-navlink whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5 ${
              activeTab === 'leaderboard' ? 'rm-navlink-active' : ''
            }`}
          >
            <span>Guardian League</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#102236] border border-[#3E6E86]/50 text-[#5FD3BF] opacity-80">
              L
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('privacy')}
            title="Zero-Data Governance (Shortcut: P)"
            aria-keyshortcuts="p"
            className="rm-navlink whitespace-nowrap shrink-0 cursor-pointer inline-flex items-center gap-1.5"
          >
            <span>Zero-Data Governance</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#102236] border border-[#3E6E86]/50 text-[#5FD3BF] opacity-80">
              P
            </kbd>
          </button>
        </nav>

        {/* Zone 3: Primary Action, Shortcuts & Audio Control */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onOpenShortcuts();
            }}
            title="Keyboard Shortcuts (Shortcut: ?)"
            aria-keyshortcuts="?"
            aria-label="Keyboard Shortcuts"
            className="xh-btn !px-2.5 !py-2"
          >
            <Keyboard className="w-4 h-4 text-[#5FD3BF]" />
            <kbd className="hidden sm:inline text-[10px] font-mono text-[#EBC385]">?</kbd>
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            title={muted ? 'Unmute Audio (Shortcut: M)' : 'Mute Audio (Shortcut: M)'}
            aria-keyshortcuts="m"
            className="xh-btn !px-2.5 !py-2"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-[#A9B7BF]" /> : <Volume2 className="w-4 h-4 text-[#5FD3BF]" />}
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onTriggerQuickDrill();
            }}
            title="Start Cyber Drill (Shortcut: C)"
            aria-keyshortcuts="c"
            className="xh-btn primary whitespace-nowrap shrink-0"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Start Cyber Drill</span>
            <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#04211B]/25 text-[#04211B] font-bold">
              C
            </kbd>
          </button>
        </div>
      </div>

      {/* Tablet / Mobile Subnavigation Bar */}
      <div className="lg:hidden flex flex-wrap items-center justify-around gap-2 px-1 py-2 border-t border-[#3E6E86]/35 text-xs">
        <button
          type="button"
          onClick={() => handleNavClick('dashboard')}
          className={`rm-navlink !text-xs whitespace-nowrap cursor-pointer ${
            activeTab === 'dashboard' ? 'rm-navlink-active' : ''
          }`}
        >
          Overview [D]
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('simulations')}
          className={`rm-navlink !text-xs whitespace-nowrap cursor-pointer ${
            activeTab === 'simulations' ? 'rm-navlink-active' : ''
          }`}
        >
          Drills [S]
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('radar')}
          className={`rm-navlink !text-xs whitespace-nowrap cursor-pointer ${
            activeTab === 'radar' ? 'rm-navlink-active' : ''
          }`}
        >
          Threat Radar [R]
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('leaderboard')}
          className={`rm-navlink !text-xs whitespace-nowrap cursor-pointer ${
            activeTab === 'leaderboard' ? 'rm-navlink-active' : ''
          }`}
        >
          League [L]
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('privacy')}
          className="rm-navlink !text-xs whitespace-nowrap cursor-pointer"
        >
          Privacy [P]
        </button>
      </div>
    </header>
  );
};
