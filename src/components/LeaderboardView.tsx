import React from 'react';
import { Trophy, Award, Users } from 'lucide-react';
import { LeaderboardUser, UserStats } from '../types';
import { INITIAL_LEADERBOARD } from '../data/leaderboard';
import { BADGES } from '../data/badges';

interface LeaderboardViewProps {
  stats: UserStats;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ stats }) => {
  const sortedLeaderboard: LeaderboardUser[] = React.useMemo(() => {
    const list = INITIAL_LEADERBOARD.map(u => {
      if (u.isCurrentUser) {
        return {
          ...u,
          xp: stats.xp,
          badgesCount: stats.unlockedBadgeIds.length,
        };
      }
      return u;
    });

    list.sort((a, b) => b.xp - a.xp);
    return list.map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [stats.xp, stats.unlockedBadgeIds.length]);

  return (
    <div className="space-y-8">
      {/* Postrix Command Header for Leaderboard */}
      <section className="xh-panel">
        <div className="xh-kicker">
          <span className="k">Youth Cyber Defense League &amp; Sentinel Standings</span>
          <span className="tag">Division 1 · Active Season</span>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-[#EEF3F1] font-serif flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#EBC385]" />
              <span>Collegiate &amp; Youth Sentinel Brackets</span>
            </h1>
            <p className="text-xs text-[#A9B7BF] mt-0.5">
              Benchmarking threat identification speed, incident containment accuracy, and verified peer intelligence across regional squads.
            </p>
          </div>

          <div className="xh-metric !py-2.5 !px-4 text-right self-start sm:self-auto min-w-[140px]">
            <span className="text-[11px] font-mono text-[#5FD3BF] block uppercase">Your Standing</span>
            <span className="text-xl font-mono font-semibold text-[#EEF3F1] tabular-nums">
              #{sortedLeaderboard.find(u => u.isCurrentUser)?.rank || 6}
            </span>
          </div>
        </div>
      </section>

      {/* Leaderboard Table on Postrix Paper */}
      <section className="bg-white border border-[#D9DDD3] rounded-xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-[#D9DDD3] flex items-center justify-between">
          <div>
            <span className="rm-kicker">01 / Global Sentinel Standings</span>
            <h2 className="text-base font-semibold text-[#0E2238] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#2BB5A0]" />
              <span>Verified Defender Rankings</span>
            </h2>
          </div>
          <span className="text-xs text-[#4B5A66] font-mono">Weekly Cycle</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F3F5F1] text-[#4B5A66] border-b border-[#D9DDD3] font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4 font-semibold w-16">Rank</th>
                <th className="py-3 px-4 font-semibold">Defender Handle</th>
                <th className="py-3 px-4 font-semibold">Institution / Squad</th>
                <th className="py-3 px-4 font-semibold text-right">Certifications</th>
                <th className="py-3 px-4 font-semibold text-right">Posture XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9DDD3]">
              {sortedLeaderboard.map((user) => (
                <tr
                  key={user.handle}
                  className={`transition-colors ${
                    user.isCurrentUser
                      ? 'bg-[#F3F5F1] font-semibold text-[#0E2238]'
                      : 'hover:bg-[#F3F5F1]/60 text-[#16232F]'
                  }`}
                >
                  <td className="py-3.5 px-4 font-mono font-semibold text-sm tabular-nums">
                    {user.rank === 1 ? (
                      <span className="text-[#D79A45]">01</span>
                    ) : user.rank === 2 ? (
                      <span className="text-[#0E2238]">02</span>
                    ) : user.rank === 3 ? (
                      <span className="text-[#4B5A66]">03</span>
                    ) : (
                      <span className="text-[#4B5A66]">
                        {user.rank.toString().padStart(2, '0')}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#0E2238]">
                        {user.handle}
                      </span>
                      {user.isCurrentUser && (
                        <span className="text-[10px] font-mono bg-[#0E2238] text-[#5FD3BF] px-2 py-0.5 rounded">
                          ACTIVE SESSION
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[#4B5A66]">
                    {user.team}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-[#16232F]">
                    {user.badgesCount}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold tabular-nums text-[#0E2238]">
                    {user.xp} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Gamification Trophy Hall */}
      <section className="p-6 rounded-xl bg-white border border-[#D9DDD3] space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#D9DDD3] pb-4">
          <div>
            <span className="rm-kicker">02 / Competency Credentials</span>
            <h2 className="text-lg font-semibold text-[#0E2238] flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D79A45]" />
              <span>Trophy Hall &amp; Master Certifications</span>
            </h2>
          </div>
          <span className="text-xs font-mono text-[#0E2238] bg-[#F3F5F1] border border-[#C7CDC0] px-2.5 py-1 rounded">
            {stats.unlockedBadgeIds.length} of {BADGES.length} Verified
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((badge) => {
            const isUnlocked = stats.unlockedBadgeIds.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-[#F3F5F1] border-[#0E2238]'
                    : 'bg-[#F3F5F1]/50 border-[#D9DDD3] opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isUnlocked
                      ? 'bg-[#0E2238] text-[#5FD3BF]'
                      : 'bg-[#E9ECE6] text-[#4B5A66]'
                  }`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-white border border-[#C7CDC0] text-[#0E2238]">
                    {badge.rarity}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-[#0E2238] mb-1">
                  {badge.title}
                </h4>
                <p className="text-xs text-[#4B5A66] leading-relaxed mb-3">
                  {badge.description}
                </p>

                <div className="flex items-center justify-between text-[11px] font-mono pt-2.5 border-t border-[#D9DDD3]">
                  <span className="text-[#4B5A66]">Credential Credit:</span>
                  <span className={isUnlocked ? 'text-emerald-700 font-semibold' : 'text-[#0E2238]'}>
                    {isUnlocked ? 'VERIFIED' : `+${badge.xpReward} XP`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
