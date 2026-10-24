import React, { useState } from 'react';
import { Mail, Wifi, MessageSquare, KeyRound, Terminal } from 'lucide-react';
import { SimulationType, BreachIncident } from '../types';
import { PhishingSim } from './simulations/PhishingSim';
import { WiFiSim } from './simulations/WiFiSim';
import { SocialEngSim } from './simulations/SocialEngSim';
import { PasswordSim } from './simulations/PasswordSim';
import { RansomwareSim } from './simulations/RansomwareSim';
import { playClickSound } from '../utils/audio';

interface SimulationHubProps {
  initialSim?: SimulationType;
  onBreach: (incident: BreachIncident) => void;
  onSuccess: (xp: number, category: string, badgeId?: string) => void;
}

export const SimulationHub: React.FC<SimulationHubProps> = ({
  initialSim = 'phishing',
  onBreach,
  onSuccess,
}) => {
  const [activeSim, setActiveSim] = useState<SimulationType>(initialSim);

  const tabs: { id: SimulationType; label: string; icon: React.ReactNode; category: string }[] = [
    { id: 'phishing', label: 'Email & Quishing', icon: <Mail className="w-4 h-4" />, category: 'Phishing' },
    { id: 'wifi', label: 'Rogue Wi-Fi & MITM', icon: <Wifi className="w-4 h-4" />, category: 'Networks' },
    { id: 'social_eng', label: 'Social Engineering DMs', icon: <MessageSquare className="w-4 h-4" />, category: 'Social' },
    { id: 'password', label: 'Password Entropy Lab', icon: <KeyRound className="w-4 h-4" />, category: 'Credentials' },
    { id: 'ransomware', label: 'Ransomware Triage', icon: <Terminal className="w-4 h-4" />, category: 'Response' },
  ];

  const handleTabChange = (simId: SimulationType) => {
    playClickSound();
    setActiveSim(simId);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Selector Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeSim === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950 to-slate-900 text-cyan-400 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Active Simulation */}
      <div>
        {activeSim === 'phishing' && (
          <PhishingSim onBreach={onBreach} onSuccess={onSuccess} />
        )}
        {activeSim === 'wifi' && (
          <WiFiSim onBreach={onBreach} onSuccess={onSuccess} />
        )}
        {activeSim === 'social_eng' && (
          <SocialEngSim onBreach={onBreach} onSuccess={onSuccess} />
        )}
        {activeSim === 'password' && (
          <PasswordSim onSuccess={onSuccess} />
        )}
        {activeSim === 'ransomware' && (
          <RansomwareSim onBreach={onBreach} onSuccess={onSuccess} />
        )}
      </div>
    </div>
  );
};
