import React from 'react';
import { Volume2, VolumeX, ShieldAlert } from 'lucide-react';
import { playClickSound, setSoundEnabled, getSoundEnabled } from '../utils/audio';

interface HeaderProps {
  activeTab: 'dashboard' | 'simulations' | 'radar' | 'leaderboard' | 'privacy';
  setActiveTab: (tab: 'dashboard' | 'simulations' | 'radar' | 'leaderboard' | 'privacy') => void;
  onOpenPrivacy: () => void;
  onTriggerQuickDrill: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenPrivacy,
  onTriggerQuickDrill,
}) => {
  const [muted, setMuted] = React.useState(!getSoundEnabled());

  const toggleSound = () => {
    const nextState = !muted;
    setMuted(nextState);
    setSoundEnabled(!nextState);
    if (nextState === false) {
      playClickSound();
    }
  };

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
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8 min-h-[64px] py-2">
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
            Threat <span className="accent">Guard</span>
          </span>
        </a>

        {/* Zone 2: Navigation links matching Postrix (.rm-navlink / .rm-navlink-active) */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-7 overflow-x-auto">
          <button
            type="button"
            onClick={() => handleNavClick('dashboard')}
            aria-current={activeTab === 'dashboard' ? 'page' : undefined}
            className={`rm-navlink whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'dashboard' ? 'rm-navlink-active' : ''
            }`}
          >
            Posture Overview
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('simulations')}
            aria-current={activeTab === 'simulations' ? 'page' : undefined}
            className={`rm-navlink whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'simulations' ? 'rm-navlink-active' : ''
            }`}
          >
            Interactive Drills
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('radar')}
            aria-current={activeTab === 'radar' ? 'page' : undefined}
            className={`rm-navlink whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'radar' ? 'rm-navlink-active' : ''
            }`}
          >
            Peer Threat Radar
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('leaderboard')}
            aria-current={activeTab === 'leaderboard' ? 'page' : undefined}
            className={`rm-navlink whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'leaderboard' ? 'rm-navlink-active' : ''
            }`}
          >
            Guardian League
          </button>

          <button
            type="button"
            onClick={() => handleNavClick('privacy')}
            className="rm-navlink whitespace-nowrap shrink-0 cursor-pointer"
          >
            Zero-Data Governance
          </button>
        </nav>

        {/* Zone 3: Primary Action & Audio Control */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleSound}
            title={muted ? 'Unmute Audio' : 'Mute Audio'}
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
            className="xh-btn primary whitespace-nowrap shrink-0"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Start Cyber Drill</span>
          </button>
        </div>
      </div>

      {/* Mobile Subnavigation Bar */}
      <div className="md:hidden flex items-center justify-around px-1 py-2 border-t border-[#3E6E86]/35 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => handleNavClick('dashboard')}
          className={`rm-navlink !text-xs whitespace-nowrap cursor-pointer ${
            activeTab === 'dashboard' ? 'rm-navlink-active' : ''
          }`}
        >
          Overview
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('simulations')}
          className={`rm-navlink !text-xs whitespace-nowrap cursor-pointer ${
            activeTab === 'simulations' ? 'rm-navlink-active' : ''
          }`}
        >
          Drills
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('radar')}
          className={`rm-navlink !text-xs whitespace-nowrap cursor-pointer ${
            activeTab === 'radar' ? 'rm-navlink-active' : ''
          }`}
        >
          Threat Radar
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('leaderboard')}
          className={`rm-navlink !text-xs whitespace-nowrap cursor-pointer ${
            activeTab === 'leaderboard' ? 'rm-navlink-active' : ''
          }`}
        >
          League
        </button>
        <button
          type="button"
          onClick={() => handleNavClick('privacy')}
          className="rm-navlink !text-xs whitespace-nowrap cursor-pointer"
        >
          Privacy
        </button>
      </div>
    </header>
  );
};
