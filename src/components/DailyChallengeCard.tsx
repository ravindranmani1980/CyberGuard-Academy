import React, { useState, useEffect } from 'react';
import {
  Flame,
  Clock,
  Award,
  ShieldAlert,
  CheckCircle2,
  RotateCcw,
  ChevronRight,
  Sparkles,
  Timer,
} from 'lucide-react';
import { DailyChallengeSpec, SimulationType } from '../types';
import {
  getSecondsUntilNext24hReset,
  formatCountdownHMS,
} from '../utils/dailyChallenge';
import { playClickSound } from '../utils/audio';

interface DailyChallengeCardProps {
  challenge: DailyChallengeSpec;
  isCompletedToday: boolean;
  hasDailySentinelBadge: boolean;
  onLaunchDailyChallenge: (simType: SimulationType) => void;
  onSimulate24hReset: () => void;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
  challenge,
  isCompletedToday,
  hasDailySentinelBadge,
  onLaunchDailyChallenge,
  onSimulate24hReset,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(() =>
    getSecondsUntilNext24hReset()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(getSecondsUntilNext24hReset());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="p-6 rounded-xl bg-[#081420] border-2 border-[#D79A45]/75 text-[#EEF3F1] shadow-lg space-y-5">
      {/* Top Kicker Row: Daily Challenge Status & 24-Hour Reset Countdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-[#C9D3D9]/15">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#EBC385]">
            <Flame className="w-4 h-4 text-[#D79A45]" />
            <span>24-Hour Daily Sentinel Challenge</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-[#102236] border border-[#5FD3BF]/40 text-[11px] font-mono text-[#5FD3BF]">
            {challenge.operationName} · {challenge.moduleCode}
          </span>
          {isCompletedToday && (
            <span className="px-2.5 py-0.5 rounded bg-[#2BB5A0] text-[#04211B] text-[11px] font-mono font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>COMPLETED TODAY</span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3 py-1 rounded-lg bg-[#102236] border border-[#EBC385]/35 text-xs font-mono flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-[#EBC385]" />
            <span className="text-[#A9B7BF]">24H RESET IN:</span>
            <span className="font-bold text-[#EBC385] tabular-nums">
              {formatCountdownHMS(secondsLeft)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onSimulate24hReset();
            }}
            title="Simulate 24-hour reset to preview the next day's Daily Challenge"
            className="px-2.5 py-1 rounded-lg bg-[#102236] hover:bg-[#16304B] border border-[#C9D3D9]/25 text-[11px] font-mono text-[#C9D3D9] hover:text-[#5FD3BF] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-[#5FD3BF]" />
            <span>Simulate 24h Reset</span>
          </button>
        </div>
      </div>

      {/* Main Challenge Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Left 7 Cols: Mission & Unique Tactical Constraint */}
        <div className="lg:col-span-7 space-y-3">
          <div>
            <div className="text-xs font-mono text-[#5FD3BF] uppercase">
              Target Simulation: {challenge.moduleCode} — {challenge.missionTitle}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#EEF3F1] font-serif mt-0.5">
              {challenge.missionTitle} ({challenge.operationName})
            </h2>
          </div>

          {/* Unique Constraint Highlight Box */}
          <div className="p-3.5 rounded-xl bg-[#102236] border border-[#D79A45]/50 space-y-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#EBC385] flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#D79A45]" />
                <span>Unique Constraint: {challenge.constraintTitle}</span>
              </span>
              <span className="text-[11px] font-mono text-[#5FD3BF] flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" />
                <span>Time Limit: {challenge.timeLimitSeconds}s</span>
              </span>
            </div>
            <p className="text-xs text-[#C9D3D9] leading-relaxed">
              {challenge.constraintRule}
            </p>
          </div>
        </div>

        {/* Right 5 Cols: Daily Sentinel Badge + Bonus XP Rewards + Launch CTA */}
        <div className="lg:col-span-5 p-4 rounded-xl bg-[#102236] border border-[#C9D3D9]/20 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  hasDailySentinelBadge || isCompletedToday
                    ? 'bg-[#2BB5A0] text-[#04211B]'
                    : 'bg-[#081420] text-[#EBC385] border border-[#D79A45]/50'
                }`}
              >
                <Award className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#EBC385] uppercase font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Challenge Rewards</span>
                </div>
                <div className="text-sm font-bold text-[#EEF3F1]">
                  &ldquo;Daily Sentinel&rdquo; Badge
                </div>
                <div className="text-[11px] font-mono text-[#5FD3BF]">
                  +{challenge.bonusXp} Bonus XP · Legendary Credential
                </div>
              </div>
            </div>
          </div>

          {isCompletedToday ? (
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-lg bg-[#081420] border border-[#2BB5A0]/50 text-xs font-mono text-[#5FD3BF] flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2BB5A0]" />
                  <span>Daily Sentinel Verified!</span>
                </span>
                <span className="text-[#EBC385] font-bold">+{challenge.bonusXp} XP Claimed</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onLaunchDailyChallenge(challenge.simType);
                }}
                className="xh-btn w-full justify-center"
              >
                <span>Replay {challenge.moduleCode} Drill</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onLaunchDailyChallenge(challenge.simType);
              }}
              className="xh-btn primary w-full justify-center !py-2.5 font-semibold"
            >
              <Flame className="w-4 h-4" />
              <span>Accept Daily Challenge ({challenge.moduleCode})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
