import React from 'react';
import { Shield, Award, Flame, AlertOctagon, CheckCircle2, ChevronRight, ArrowUpRight, Lock, Terminal, Wifi, Mail, MessageSquare, KeyRound } from 'lucide-react';
import { UserStats, BreachIncident, SimulationType } from '../types';
import { BADGES } from '../data/badges';
import { calculateRankAndLevel } from '../utils/storage';
import { playClickSound } from '../utils/audio';
import { ThreatResilienceChart } from './ThreatResilienceChart';

interface DashboardProps {
  stats: UserStats;
  incidents: BreachIncident[];
  onLaunchSimulation: (simType: SimulationType) => void;
  onOpenPrivacy: () => void;
  onOpenBreachDetails: (incident: BreachIncident) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  incidents,
  onLaunchSimulation,
  onOpenPrivacy,
  onOpenBreachDetails,
}) => {
  const rankInfo = calculateRankAndLevel(stats.xp);
  const currentLevelFloorXp = rankInfo.level === 1 ? 0 : rankInfo.level === 2 ? 300 : rankInfo.level === 3 ? 750 : rankInfo.level === 4 ? 1400 : 2200;
  const progressInLevel = Math.max(0, stats.xp - currentLevelFloorXp);
  const xpNeededForLevel = rankInfo.nextLevelXp - currentLevelFloorXp;
  const progressPercent = Math.min(100, Math.round((progressInLevel / xpNeededForLevel) * 100));

  const simulationCards: {
    type: SimulationType;
    title: string;
    category: string;
    masteryKey: keyof typeof stats.categoryMastery;
    icon: React.ReactNode;
    codeRef: string;
    description: string;
  }[] = [
    {
      type: 'phishing',
      title: 'Email & Quishing Defense',
      category: 'Phishing & OAuth',
      masteryKey: 'phishing',
      icon: <Mail className="w-4 h-4 text-[#0E2238]" />,
      codeRef: 'MOD-01',
      description: 'Analyze disguised envelope headers, typosquatted links, and malicious QR payloads.',
    },
    {
      type: 'wifi',
      title: 'Rogue Wi-Fi & Hotspots',
      category: 'Network Airspace',
      masteryKey: 'network',
      icon: <Wifi className="w-4 h-4 text-[#0E2238]" />,
      codeRef: 'MOD-02',
      description: 'Probe public Wi-Fi access points and detect Evil Twin man-in-the-middle interception.',
    },
    {
      type: 'social_eng',
      title: 'Social Engineering DMs',
      category: 'Identity & OTP',
      masteryKey: 'socialEng',
      icon: <MessageSquare className="w-4 h-4 text-[#0E2238]" />,
      codeRef: 'MOD-03',
      description: 'Outsmart impersonator bots and compromised peers requesting 2FA verification codes.',
    },
    {
      type: 'password',
      title: 'Password Entropy Lab',
      category: 'Cryptographic Strength',
      masteryKey: 'passwords',
      icon: <KeyRound className="w-4 h-4 text-[#0E2238]" />,
      codeRef: 'MOD-04',
      description: 'Evaluate password crack resistance against 350B-hash/sec GPU rigs and formulate passphrases.',
    },
    {
      type: 'ransomware',
      title: 'Ransomware Incident Triage',
      category: 'Incident Response',
      masteryKey: 'incidentResponse',
      icon: <Terminal className="w-4 h-4 text-[#0E2238]" />,
      codeRef: 'MOD-05',
      description: '45-second containment drill: Isolate network interfaces and terminate rogue encryptor binaries.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Executive Command Panel matching Postrix (.xh-panel) */}
      <section className="xh-panel">
        <div className="xh-kicker">
          <span className="k">Human Cyber Defense Posture & Interactive Threat Governance</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="tag">Level {rankInfo.level} · {rankInfo.rankTitle}</span>
            <span className="tag">{stats.streakDays}d Active Streak</span>
            <span className="tag">Zero-Knowledge Sandbox</span>
          </div>
        </div>

        {/* Identity & Posture Summary Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pt-5 pb-6 border-b border-[#C9D3D9]/12">
          <div className="flex items-start sm:items-center gap-4">
            <div className="rm-mono-mark !w-12 !h-12 !text-base shrink-0" aria-hidden="true">
              RM
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-semibold text-[#EEF3F1] tracking-tight font-serif">
                  {rankInfo.rankTitle} — Personal Security Posture
                </h1>
              </div>
              <p className="text-xs sm:text-sm text-[#A9B7BF] mt-1 max-w-2xl leading-relaxed">
                Continuous interactive threat simulation, MITRE ATT&amp;CK forensic post-mortems, and client-side zero-data telemetry engineered by{' '}
                <a
                  href="https://ravindran.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5FD3BF] hover:underline font-mono"
                >
                  Mani Ravindran (ravindran.in)
                </a>
                .
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onOpenPrivacy();
              }}
              className="xh-btn"
            >
              <Lock className="w-3.5 h-3.5 text-[#5FD3BF]" />
              <span>Zero-Data Governance</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onLaunchSimulation('phishing');
              }}
              className="xh-btn primary"
            >
              <Shield className="w-4 h-4" />
              <span>Run Live Posture Drill</span>
            </button>
          </div>
        </div>

        {/* 4-Column Postrix Metric Strip (.xh-metric) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
          <div className="xh-metric">
            <div className="lbl">
              <span>OVERALL POSTURE SCORE</span>
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div className="num tabular-nums">
              {stats.defenseScore}% <span className="text-xs font-normal text-[#5FD3BF]">Grade {stats.defenseScore >= 85 ? 'A' : stats.defenseScore >= 70 ? 'B+' : 'C'}</span>
            </div>
            <div className="text-[11px] text-[#A9B7BF] mt-1.5 font-mono">
              Target Baseline: 70% Resilience
            </div>
          </div>

          <div className="xh-metric">
            <div className="lbl">
              <span>EXPERIENCE & RANK</span>
              <Flame className="w-3.5 h-3.5 text-[#EBC385]" />
            </div>
            <div className="num tabular-nums">
              {stats.xp} <span className="text-sm font-normal text-[#A9B7BF]">/ {rankInfo.nextLevelXp} XP</span>
            </div>
            <div className="w-full h-1.5 bg-[#081420] rounded-full overflow-hidden mt-2.5 border border-[#C9D3D9]/15">
              <div
                className="h-full bg-[#2BB5A0] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="xh-metric">
            <div className="lbl">
              <span>SIMULATIONS COMPLETED</span>
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div className="num tabular-nums">
              {stats.simulationsCompleted} <span className="text-xs font-normal text-[#5FD3BF]">Drills Verified</span>
            </div>
            <div className="text-[11px] text-[#A9B7BF] mt-1.5 font-mono">
              {stats.unlockedBadgeIds.length} of {BADGES.length} Certifications Earned
            </div>
          </div>

          <div className="xh-metric">
            <div className="lbl">
              <span>BREACHES MITIGATED</span>
              <AlertOctagon className="w-3.5 h-3.5 text-[#EBC385]" />
            </div>
            <div className="num tabular-nums">
              {Math.max(1, stats.simulationsCompleted * 2 - stats.breachesTriggered)}{' '}
              <span className="text-xs font-normal text-[#EBC385]">({stats.breachesTriggered} Incidents)</span>
            </div>
            <div className="text-[11px] text-[#A9B7BF] mt-1.5 font-mono">
              MITRE ATT&amp;CK Post-Mortems Active
            </div>
          </div>
        </div>
      </section>

      {/* 01 / Competency Matrix across 5 Security Domains */}
      <section className="p-6 rounded-xl bg-white border border-[#D9DDD3] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#D9DDD3]">
          <div>
            <span className="rm-kicker">01 / Multi-Vector Control Coverage</span>
            <h2 className="text-lg font-semibold text-[#0E2238]">
              Cybersecurity Domain Competency Matrix
            </h2>
            <p className="text-xs text-[#4B5A66] mt-0.5">
              Evaluated defense readiness across phishing, wireless airspace, identity verification, cryptography, and incident response.
            </p>
          </div>
          <span className="text-xs font-mono text-[#0E2238] bg-[#F3F5F1] border border-[#C7CDC0] px-2.5 py-1 rounded">
            5 Control Domains Monitored
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {simulationCards.map((sim) => {
            const mastery = stats.categoryMastery[sim.masteryKey];
            return (
              <div key={sim.type} className="p-4 rounded-lg bg-[#F3F5F1] border border-[#D9DDD3] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-[#4B5A66]">{sim.codeRef}</span>
                  <span className="font-mono font-semibold text-[#0E2238] tabular-nums">{mastery}%</span>
                </div>
                <div className="text-xs font-semibold text-[#16232F] truncate">
                  {sim.category}
                </div>
                <div className="w-full h-1.5 bg-[#D9DDD3] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0E2238] rounded-full"
                    style={{ width: `${mastery}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 02 / Weekly Threat Resilience Trend Chart */}
      <ThreatResilienceChart
        data={stats.sessionHistory || []}
        currentScore={stats.defenseScore}
      />

      {/* 03 / Interactive Defense Sandboxes */}
      <section className="p-6 rounded-xl bg-white border border-[#D9DDD3] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#D9DDD3]">
          <div>
            <span className="rm-kicker">03 / Interactive Assessment Modules</span>
            <h2 className="text-lg font-semibold text-[#0E2238]">
              Live Threat Simulation & Defense Sandboxes
            </h2>
            <p className="text-xs text-[#4B5A66] mt-0.5">
              Execute hands-on threat scenarios to inspect indicators, verify headers, and harden defensive reflexes.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {simulationCards.map((sim) => (
            <div
              key={sim.type}
              className="p-5 rounded-xl bg-[#F3F5F1] border border-[#C7CDC0] hover:border-[#0E2238] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-white border border-[#D9DDD3] flex items-center gap-2">
                    {sim.icon}
                    <span className="text-[11px] font-mono font-medium text-[#0E2238]">{sim.codeRef}</span>
                  </div>
                  <span className="text-xs font-mono font-medium text-[#4B5A66] tabular-nums">
                    {stats.categoryMastery[sim.masteryKey]}% Mastery
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#0E2238] mb-1.5">
                  {sim.title}
                </h3>
                <p className="text-xs text-[#4B5A66] leading-relaxed mb-5">
                  {sim.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onLaunchSimulation(sim.type);
                }}
                className="w-full py-2.5 px-4 bg-[#0E2238] hover:bg-[#081420] text-[#F3F5F1] rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>Execute Simulation Drill</span>
                <ChevronRight className="w-4 h-4 text-[#5FD3BF] group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 04 / Forensic Incident & Breach Post-Mortem Ledger */}
      <section className="p-6 rounded-xl bg-white border border-[#D9DDD3] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#D9DDD3]">
          <div>
            <span className="rm-kicker">04 / Vulnerability Triage & Forensic Ledger</span>
            <h2 className="text-lg font-semibold text-[#0E2238]">
              Breach Post-Mortem & Defensive Remediation Runbooks
            </h2>
            <p className="text-xs text-[#4B5A66] mt-0.5">
              Detailed root-cause diagnostics, missed indicator analysis, and actionable remediation steps for triggered compromises.
            </p>
          </div>
          <span className="text-xs font-mono text-[#16232F] bg-[#F3F5F1] border border-[#C7CDC0] px-2.5 py-1 rounded">
            {incidents.length} Logged Findings
          </span>
        </div>

        {incidents.length === 0 ? (
          <div className="p-8 text-center bg-[#F3F5F1] rounded-xl border border-[#D9DDD3]">
            <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#0E2238]">Zero Unresolved Security Breaches</p>
            <p className="text-xs text-[#4B5A66] mt-1">
              Your defensive posture is intact. Launch a simulation drill above to test resilience against emerging vectors.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="p-4 rounded-xl bg-[#F3F5F1] border border-[#C7CDC0] hover:border-[#0E2238] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-mono font-semibold text-red-800 bg-red-100 border border-red-200 px-2 py-0.5 rounded">
                      COMPROMISE RECORD
                    </span>
                    {inc.mitreRef && (
                      <span className="text-[11px] font-mono text-[#0E2238] bg-white border border-[#C7CDC0] px-2 py-0.5 rounded">
                        {inc.mitreRef}
                      </span>
                    )}
                    <h4 className="text-sm font-semibold text-[#0E2238]">
                      {inc.scenarioTitle}
                    </h4>
                  </div>
                  <p className="text-xs text-[#16232F]">
                    {inc.userMistake}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-[#4B5A66] font-mono pt-1">
                    <span>Vector: {inc.category}</span>
                    <span>·</span>
                    <span>{inc.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      onOpenBreachDetails(inc);
                    }}
                    className="px-3.5 py-2 text-xs font-medium text-[#0E2238] hover:text-white bg-white hover:bg-[#0E2238] border border-[#0E2238] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Inspect Remediation Blueprint</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 05 / Unlocked Cyber Badges & Certifications */}
      <section className="p-6 rounded-xl bg-white border border-[#D9DDD3] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#D9DDD3]">
          <div>
            <span className="rm-kicker">05 / Verified Defender Credentials</span>
            <h2 className="text-lg font-semibold text-[#0E2238]">
              Earned Security Certifications & Badges
            </h2>
          </div>
          <span className="text-xs font-mono text-[#0E2238] bg-[#F3F5F1] border border-[#C7CDC0] px-2.5 py-1 rounded">
            {stats.unlockedBadgeIds.length} / {BADGES.length} Verified
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {BADGES.map((badge) => {
            const isUnlocked = stats.unlockedBadgeIds.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isUnlocked
                    ? 'bg-[#F3F5F1] border-[#0E2238]'
                    : 'bg-[#F3F5F1]/60 border-[#D9DDD3] opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isUnlocked ? 'bg-[#0E2238] text-[#5FD3BF]' : 'bg-[#E9ECE6] text-[#4B5A66]'
                  }`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-medium text-[#4B5A66]">
                    {isUnlocked ? 'VERIFIED' : `+${badge.xpReward} XP`}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-[#0E2238] truncate mb-1">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-[#4B5A66] line-clamp-2 leading-relaxed">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
