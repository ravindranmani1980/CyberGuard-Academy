import React, { useState, useEffect } from 'react';
import { Mail, Wifi, MessageSquare, Smartphone, KeyRound, Terminal } from 'lucide-react';
import { SimulationType, BreachIncident } from '../types';
import { PhishingSim } from './simulations/PhishingSim';
import { WiFiSim } from './simulations/WiFiSim';
import { SocialEngSim } from './simulations/SocialEngSim';
import { SmishingSim } from './simulations/SmishingSim';
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

  useEffect(() => {
    setActiveSim(initialSim);
  }, [initialSim]);

  const tabs: { id: SimulationType; label: string; icon: React.ReactNode; code: string }[] = [
    { id: 'phishing', label: 'Email & Quishing', icon: <Mail className="w-4 h-4" />, code: 'MOD-01' },
    { id: 'wifi', label: 'Rogue Wi-Fi & MITM', icon: <Wifi className="w-4 h-4" />, code: 'MOD-02' },
    { id: 'social_eng', label: 'Social Engineering DMs', icon: <MessageSquare className="w-4 h-4" />, code: 'MOD-03' },
    { id: 'password', label: 'Password Entropy Lab', icon: <KeyRound className="w-4 h-4" />, code: 'MOD-04' },
    { id: 'ransomware', label: 'Ransomware Triage', icon: <Terminal className="w-4 h-4" />, code: 'MOD-05' },
    { id: 'smishing', label: 'Spam SMS & BEC Drills', icon: <Smartphone className="w-4 h-4" />, code: 'MOD-06' },
  ];

  const handleTabChange = (simId: SimulationType) => {
    playClickSound();
    setActiveSim(simId);
  };

  return (
    <div className="space-y-6">
      {/* Postrix Command Header for Interactive Simulations */}
      <section className="xh-panel">
        <div className="xh-kicker">
          <span className="k">Interactive Security Posture &amp; Threat Simulation Suite</span>
          <span className="tag">6 Live Assessment Modules</span>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-[#EEF3F1] font-serif">
              Hands-On Threat Evaluation &amp; Defensive Triage Lab
            </h1>
            <p className="text-xs text-[#A9B7BF] mt-0.5">
              Select a simulation module below to inspect real-world attack artifacts, spot spam SMS pretexts, verify technical telemetry, and test breach resilience.
            </p>
          </div>
        </div>

        {/* Module Selector Bar inside xh-panel (Responsive Grid — Zero Horizontal Scrollbar) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-4 mt-4 border-t border-[#C9D3D9]/15">
          {tabs.map((tab) => {
            const isActive = activeSim === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`xh-btn w-full justify-start min-w-0 ${
                  isActive ? 'primary' : ''
                }`}
              >
                <span className="shrink-0">{tab.icon}</span>
                <span className="font-mono text-[11px] opacity-80 shrink-0">{tab.code}</span>
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

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
        {activeSim === 'smishing' && (
          <SmishingSim onBreach={onBreach} onSuccess={onSuccess} />
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
