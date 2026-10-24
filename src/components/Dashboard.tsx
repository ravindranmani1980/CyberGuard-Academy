import React from 'react';
import { Shield, Award, Flame, AlertOctagon, CheckCircle2, ChevronRight, Zap, ArrowUpRight, Lock, Terminal, Wifi, Mail, MessageSquare, KeyRound } from 'lucide-react';
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
    color: string;
    description: string;
  }[] = [
    {
      type: 'phishing',
      title: 'Email & Quishing Defense',
      category: 'Phishing',
      masteryKey: 'phishing',
      icon: <Mail className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/30',
      description: 'Analyze disguised headers, typosquatted links, and malicious QR codes.',
    },
    {
      type: 'wifi',
      title: 'Rogue Wi-Fi & Hotspots',
      category: 'Network',
      masteryKey: 'network',
      icon: <Wifi className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/30',
      description: 'Probe public Wi-Fi access points and detect Evil Twin man-in-the-middle attacks.',
    },
    {
      type: 'social_eng',
      title: 'Social Engineering DMs',
      category: 'Social Engineering',
      masteryKey: 'socialEng',
      icon: <MessageSquare className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/30',
      description: 'Outsmart impersonator bots and fake friends begging for 2FA verification codes.',
    },
    {
      type: 'password',
      title: 'Password Entropy Lab',
      category: 'Credentials',
      masteryKey: 'passwords',
      icon: <KeyRound className="w-5 h-5 text-amber-400" />,
      color: 'border-amber-500/30',
      description: 'Test password crack times against 350-billion hash GPU clusters and build passphrases.',
    },
    {
      type: 'ransomware',
      title: 'Ransomware Emergency Triage',
      category: 'Incident Response',
      masteryKey: 'incidentResponse',
      icon: <Terminal className="w-5 h-5 text-red-400" />,
      color: 'border-red-500/30',
      description: '45-second high pressure drill: Isolate network cables and kill rogue encryptors.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Overview Strip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Main Guardian Rank Card */}
        <div className="md:col-span-8 p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 relative overflow-hidden flex flex-col justify-between shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <Shield className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                  <span>Level {rankInfo.level} Cyber Guardian</span>
                  <span aria-hidden="true">·</span>
                  <span>Zero-Knowledge Profile</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {rankInfo.rankTitle}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{stats.streakDays} Day Cyber Streak</span>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">
                Experience: <strong className="text-slate-200 font-mono tabular-nums">{stats.xp} XP</strong>
              </span>
              <span className="text-slate-400">
                Next Rank: <span className="font-mono tabular-nums text-cyan-300">{rankInfo.nextLevelXp} XP</span> ({progressPercent}%)
              </span>
            </div>
            <div className="w-full h-3 bg-slate-950 rounded-full border border-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Submetrics row */}
          <div className="grid grid-cols-3 gap-3 pt-6 mt-6 border-t border-slate-800/80 text-center">
            <div>
              <div className="text-xs text-slate-400 mb-0.5">Overall Defense</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-cyan-400 tabular-nums">
                {stats.defenseScore}%
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-0.5">Drills Passed</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-white tabular-nums">
                {stats.simulationsCompleted}
              </div>
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-0.5">Breaches Blocked</div>
              <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 tabular-nums">
                {Math.max(1, stats.simulationsCompleted * 2 - stats.breachesTriggered)}
              </div>
            </div>
          </div>
        </div>

        {/* Zero-Data Privacy & Security Guarantee Card */}
        <div className="md:col-span-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
                CLIENT-SIDE ONLY
              </span>
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Zero-Data Retention Standards
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Your security drills, test passwords, and telemetry never leave your device. 100% compliant with GDPR, CCPA, and COPPA youth privacy regulations.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                playClickSound();
                onOpenPrivacy();
              }}
              className="w-full py-2 px-3 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-750 rounded-xl transition-colors cursor-pointer flex items-center justify-between"
            >
              <span>View Privacy Radar & Shredder</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Threat Resilience Trend Chart */}
      <ThreatResilienceChart
        data={stats.sessionHistory || []}
        currentScore={stats.defenseScore}
      />

      {/* Category Mastery Meters */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">
              Cybersecurity Competency Radar
            </h3>
            <p className="text-xs text-slate-400">
              Mastery scores across critical youth threat vectors.
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            5 Domains Monitored
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {simulationCards.map((sim) => {
            const mastery = stats.categoryMastery[sim.masteryKey];
            return (
              <div key={sim.type} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-300 truncate">{sim.category}</span>
                  <span className="font-mono font-bold text-cyan-300 tabular-nums">{mastery}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 rounded-full"
                    style={{ width: `${mastery}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Simulations Quick Launch Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-lg font-bold text-white">
              Interactive Defense Sandboxes
            </h3>
            <p className="text-xs text-slate-400">
              Engage in hands-on scenarios to detect traps, investigate anomalies, and build real-world immunity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {simulationCards.map((sim) => (
            <div
              key={sim.type}
              className={`p-5 rounded-2xl bg-slate-900 border ${sim.color} hover:border-cyan-500/60 transition-all flex flex-col justify-between group shadow-lg`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    {sim.icon}
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {stats.categoryMastery[sim.masteryKey]}% Mastered
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
                  {sim.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {sim.description}
                </p>
              </div>

              <button
                onClick={() => {
                  playClickSound();
                  onLaunchSimulation(sim.type);
                }}
                className="w-full py-2.5 px-4 bg-slate-950 group-hover:bg-cyan-950/80 border border-slate-800 group-hover:border-cyan-600/60 text-slate-200 group-hover:text-cyan-300 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer"
              >
                <span>Launch Interactive Drill</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Forensic Incident Post-Mortem Log */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-950/60 text-red-400 border border-red-500/30">
              <AlertOctagon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Forensic Incident & Breach Post-Mortem Log
              </h3>
              <p className="text-xs text-slate-400">
                Learn from past simulated compromises with immediate actionable remediation tips.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {incidents.length} Incidents Recorded
          </span>
        </div>

        {incidents.length === 0 ? (
          <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800/80">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-200">No Security Breaches on Record</p>
            <p className="text-xs text-slate-400 mt-1">
              Your defenses are currently intact! Run a drill above to test your threat resistance.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-red-400 font-mono">
                      [BREACH]
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {inc.scenarioTitle}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300">
                    {inc.userMistake}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono pt-1">
                    <span>Vector: {inc.category}</span>
                    <span>·</span>
                    <span>{inc.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      playClickSound();
                      onOpenBreachDetails(inc);
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-800/50 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>View Post-Mortem</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gamification Badges Preview */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Unlocked Cyber Badges & Achievements
            </h3>
          </div>
          <span className="text-xs font-mono text-amber-400">
            {stats.unlockedBadgeIds.length} / {BADGES.length} Badges Earned
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {BADGES.map((badge) => {
            const isUnlocked = stats.unlockedBadgeIds.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-xl border text-center transition-all ${
                  isUnlocked
                    ? 'bg-slate-950 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-50'
                }`}
              >
                <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  isUnlocked ? 'bg-amber-950/60 text-amber-400 border border-amber-500/50' : 'bg-slate-900 text-slate-600'
                }`}>
                  <Award className="w-5 h-5" />
                </div>
                <h5 className="text-xs font-bold text-white truncate mb-0.5">
                  {badge.title}
                </h5>
                <span className="text-[10px] text-slate-400 line-clamp-2 leading-tight">
                  {badge.description}
                </span>
                <div className="mt-2 text-[10px] font-mono text-cyan-400">
                  {isUnlocked ? 'UNLOCKED' : `+${badge.xpReward} XP`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
