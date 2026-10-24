import React from 'react';
import { Volume2, VolumeX, Shield, AlertTriangle } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Single text element brand wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <button
            onClick={() => handleNavClick('dashboard')}
            className="text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
          >
            ThreatGuard
          </button>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'dashboard'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => handleNavClick('simulations')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'simulations'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Simulations
          </button>

          <button
            onClick={() => handleNavClick('radar')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'radar'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Peer Threat Radar
          </button>

          <button
            onClick={() => handleNavClick('leaderboard')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
              activeTab === 'leaderboard'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Leaderboard
          </button>

          <button
            onClick={() => handleNavClick('privacy')}
            className="whitespace-nowrap shrink-0 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer py-1 flex items-center gap-1.5"
          >
            <span>Zero-Data Privacy</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action & utility */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={toggleSound}
            title={muted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          <button
            onClick={() => {
              playClickSound();
              onTriggerQuickDrill();
            }}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 rounded-lg transition-all shadow-sm hover:shadow-[0_0_16px_rgba(6,182,212,0.3)] whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-slate-950" />
            <span>Start Cyber Drill</span>
          </button>
        </div>
      </div>

      {/* Mobile subnavigation bar for small screens */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-slate-900 bg-slate-950/95 overflow-x-auto text-xs">
        <button
          onClick={() => handleNavClick('dashboard')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'dashboard' ? 'text-cyan-400 font-semibold bg-cyan-950/40' : 'text-slate-400'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => handleNavClick('simulations')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'simulations' ? 'text-cyan-400 font-semibold bg-cyan-950/40' : 'text-slate-400'
          }`}
        >
          Simulations
        </button>
        <button
          onClick={() => handleNavClick('radar')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'radar' ? 'text-cyan-400 font-semibold bg-cyan-950/40' : 'text-slate-400'
          }`}
        >
          Threat Radar
        </button>
        <button
          onClick={() => handleNavClick('leaderboard')}
          className={`px-2.5 py-1.5 rounded-md whitespace-nowrap ${
            activeTab === 'leaderboard' ? 'text-cyan-400 font-semibold bg-cyan-950/40' : 'text-slate-400'
          }`}
        >
          Leaderboard
        </button>
        <button
          onClick={() => handleNavClick('privacy')}
          className="px-2.5 py-1.5 rounded-md text-slate-400 whitespace-nowrap"
        >
          Privacy
        </button>
      </div>
    </header>
  );
};
