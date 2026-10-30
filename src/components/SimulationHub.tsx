import React, { useState, useEffect } from 'react';
import {
  Mail,
  Wifi,
  MessageSquare,
  Smartphone,
  KeyRound,
  Terminal,
  Award,
  Flame,
  Sparkles,
  CheckCircle2,
  Gamepad2,
  Shield,
  UserCheck,
  Edit3,
} from 'lucide-react';
import { SimulationType, BreachIncident, UserStats } from '../types';
import { PhishingSim } from './simulations/PhishingSim';
import { WiFiSim } from './simulations/WiFiSim';
import { SocialEngSim } from './simulations/SocialEngSim';
import { SmishingSim } from './simulations/SmishingSim';
import { PasswordSim } from './simulations/PasswordSim';
import { RansomwareSim } from './simulations/RansomwareSim';
import { playClickSound } from '../utils/audio';

interface SimulationHubProps {
  initialSim?: SimulationType;
  stats: UserStats;
  onOpenPlayerEntry: (simType?: SimulationType) => void;
  onBreach: (incident: BreachIncident) => void;
  onSuccess: (xp: number, category: string, badgeId?: string) => void;
}

const PRAISE_MESSAGES: Record<
  string,
  { headline: string; detail: string; flag: string }[]
> = {
  phishing: [
    {
      headline: 'Outstanding Phishing Triage — Threat Quarantined!',
      detail:
        'You accurately inspected the envelope return-path and neutralized a credential-harvesting trap.',
      flag: 'THM{PHISH-NEUTRALIZED}',
    },
    {
      headline: 'Spot-On Email Verification — Blue Team Excellence!',
      detail:
        'Great eye! Your domain and header verification prevented an unauthorized session hijack.',
      flag: 'THM{HEADER-VERIFIED}',
    },
  ],
  network: [
    {
      headline: 'Well Done! Rogue Evil Twin MITM Blocked!',
      detail:
        'You audited BSSID encryption telemetry and protected wireless traffic from packet interception.',
      flag: 'THM{AIRSPACE-SECURED}',
    },
  ],
  socialEng: [
    {
      headline: 'Brilliant Defense! Social Engineering Pretext Foiled!',
      detail:
        'By enforcing Out-of-Band (OOB) voice verification, you stopped an impersonator dead in their tracks.',
      flag: 'THM{PRETEXT-BLOCKED}',
    },
    {
      headline: 'Great Move! Urgent BEC & Spam SMS Trap Defeated!',
      detail:
        'You refused artificial executive urgency and protected company financial records.',
      flag: 'THM{THREAT-BLOCKED}',
    },
  ],
  passwords: [
    {
      headline: 'Cryptographic Fortress Unlocked — High-Entropy Passphrase!',
      detail:
        'Your passphrase exceeds 75 bits of entropy, resisting 350B-hash/sec offline GPU cracking.',
      flag: 'THM{ENTROPY-HARDENED}',
    },
  ],
  incidentResponse: [
    {
      headline: 'Heroic SOC Containment — Ransomware Halted in Time!',
      detail:
        'You isolated the host and terminated the rogue encryptor binary within the golden triage window.',
      flag: 'THM{THREAT-BLOCKED}',
    },
  ],
};

export const SimulationHub: React.FC<SimulationHubProps> = ({
  initialSim = 'phishing',
  stats,
  onOpenPlayerEntry,
  onBreach,
  onSuccess,
}) => {
  const [activeSim, setActiveSim] = useState<SimulationType>(initialSim);
  const [moveStreak, setMoveStreak] = useState<number>(0);
  const [appreciationBanner, setAppreciationBanner] = useState<{
    id: number;
    xp: number;
    headline: string;
    detail: string;
    flag: string;
    streak: number;
  } | null>(null);

  useEffect(() => {
    setActiveSim(initialSim);
  }, [initialSim]);

  // Auto-hide the inline appreciation banner after 6 seconds
  useEffect(() => {
    if (!appreciationBanner) return;
    const timer = setTimeout(() => {
      setAppreciationBanner(null);
    }, 6000);
    return () => clearTimeout(timer);
  }, [appreciationBanner]);

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

  const handleDrillBreach = (incident: BreachIncident) => {
    setMoveStreak(0);
    setAppreciationBanner(null);
    onBreach(incident);
  };

  const handleDrillSuccess = (xp: number, category: string, badgeId?: string) => {
    const nextStreak = moveStreak + 1;
    setMoveStreak(nextStreak);

    const pool = PRAISE_MESSAGES[category] || PRAISE_MESSAGES.incidentResponse;
    const pick = pool[nextStreak % pool.length];

    setAppreciationBanner({
      id: Date.now(),
      xp,
      headline: pick.headline,
      detail: pick.detail,
      flag: pick.flag,
      streak: nextStreak,
    });

    onSuccess(xp, category, badgeId);
  };

  const activePlayerCallsign = stats.playerName?.trim() || 'Guest Defender';

  return (
    <div className="space-y-6">
      {/* Postrix Command Header for Interactive Simulations + Live Game HUD */}
      <section className="xh-panel">
        <div className="xh-kicker">
          <span className="k">Interactive Cyber Defense Game &amp; Threat Simulation Arena</span>
          <div className="flex flex-wrap items-center gap-2">
            {moveStreak > 0 && (
              <span className="tag !border-[#EBC385]/50 !text-[#EBC385] flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#EBC385]" />
                <span>{moveStreak}x Correct Move Streak</span>
              </span>
            )}
            <span className="tag">6 Live Assessment Modules</span>
          </div>
        </div>

        {/* Game Player HUD Bar */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#081420]/90 border border-[#5FD3BF]/35 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#2BB5A0] text-[#04211B] flex items-center justify-center shrink-0">
              <Gamepad2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#5FD3BF] uppercase">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Active Player Callsign</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-0.5">
                <span className="text-base font-bold text-[#EEF3F1] font-serif">
                  {activePlayerCallsign}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#102236] border border-[#C9D3D9]/20 text-[#EBC385]">
                  Level {stats.level} · {stats.rankTitle}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-[#102236] border border-[#C9D3D9]/15 text-xs font-mono flex items-center gap-2">
              <span className="text-[#A9B7BF]">SCORE:</span>
              <span className="font-bold text-[#5FD3BF] tabular-nums">{stats.xp} XP</span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-[#102236] border border-[#C9D3D9]/15 text-xs font-mono flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-[#5FD3BF]" />
              <span className="text-[#A9B7BF]">SHIELD:</span>
              <span className="font-bold text-[#EEF3F1] tabular-nums">{stats.defenseScore}%</span>
            </div>

            <button
              type="button"
              onClick={() => {
                playClickSound();
                onOpenPlayerEntry(activeSim);
              }}
              className="xh-btn !py-1.5 !px-3 !text-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#5FD3BF]" />
              <span>{stats.playerName ? 'Change Player / Mission' : 'Set Player Name'}</span>
            </button>
          </div>
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
          {tabs.map((tab, index) => {
            const isActive = activeSim === tab.id;
            const shortcutNum = index + 1;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                title={`${tab.label} (Shortcut: ${shortcutNum})`}
                aria-keyshortcuts={`${shortcutNum}`}
                className={`xh-btn w-full justify-between min-w-0 ${
                  isActive ? 'primary' : ''
                }`}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0">{tab.icon}</span>
                  <span className="font-mono text-[11px] opacity-80 shrink-0">{tab.code}</span>
                  <span className="truncate">{tab.label}</span>
                </span>
                <kbd
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                    isActive
                      ? 'bg-[#04211B]/25 text-[#04211B] font-bold'
                      : 'bg-[#081420] border border-[#C9D3D9]/20 text-[#5FD3BF]'
                  }`}
                >
                  {shortcutNum}
                </kbd>
              </button>
            );
          })}
        </div>
      </section>

      {/* Animated Player Appreciation Banner on Correct Move */}
      {appreciationBanner && (
        <div
          key={appreciationBanner.id}
          className="p-4 sm:p-5 rounded-xl bg-[#081420] border-2 border-[#5FD3BF] text-[#EEF3F1] shadow-lg animate-appreciation-pop flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#2BB5A0] text-[#04211B] flex items-center justify-center shrink-0 animate-emblem-celebrate">
              <Award className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#5FD3BF] font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#EBC385]" />
                <span>
                  {stats.playerName
                    ? `Bravo, ${stats.playerName}! Correct Move Verified`
                    : 'Correct Move Verified'}
                </span>
                <span>·</span>
                <span className="text-[#EBC385]">{appreciationBanner.flag}</span>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-[#EEF3F1] font-serif">
                {appreciationBanner.headline}
              </h3>
              <p className="text-xs text-[#A9B7BF]">{appreciationBanner.detail}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center animate-xp-float">
            <div className="px-3 py-1.5 rounded-lg bg-[#102236] border border-[#5FD3BF]/40 text-xs font-mono font-bold text-[#5FD3BF] flex items-center gap-1.5 tabular-nums">
              <CheckCircle2 className="w-4 h-4" />
              <span>+{appreciationBanner.xp} XP</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#102236] border border-[#EBC385]/40 text-xs font-mono font-bold text-[#EBC385] flex items-center gap-1 tabular-nums">
              <Flame className="w-4 h-4" />
              <span>{appreciationBanner.streak}x Streak</span>
            </div>
          </div>
        </div>
      )}

      {/* Render Active Simulation */}
      <div>
        {activeSim === 'phishing' && (
          <PhishingSim onBreach={handleDrillBreach} onSuccess={handleDrillSuccess} />
        )}
        {activeSim === 'wifi' && (
          <WiFiSim onBreach={handleDrillBreach} onSuccess={handleDrillSuccess} />
        )}
        {activeSim === 'social_eng' && (
          <SocialEngSim onBreach={handleDrillBreach} onSuccess={handleDrillSuccess} />
        )}
        {activeSim === 'smishing' && (
          <SmishingSim onBreach={handleDrillBreach} onSuccess={handleDrillSuccess} />
        )}
        {activeSim === 'password' && (
          <PasswordSim onSuccess={handleDrillSuccess} />
        )}
        {activeSim === 'ransomware' && (
          <RansomwareSim onBreach={handleDrillBreach} onSuccess={handleDrillSuccess} />
        )}
      </div>
    </div>
  );
};
