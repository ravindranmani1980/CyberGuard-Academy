import React from 'react';
import { Trophy, Award, Flame, Users, Shield, ArrowUp } from 'lucide-react';
import { LeaderboardUser, UserStats } from '../types';
import { INITIAL_LEADERBOARD } from '../data/leaderboard';
import { BADGES } from '../data/badges';
import { playClickSound } from '../utils/audio';

interface LeaderboardViewProps {
  stats: UserStats;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ stats }) => {
  // Merge user's real XP into leaderboard
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
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Youth Cyber Defense League</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Competitive Leaderboards & Team Brackets
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Top youth and collegiate cyber clubs testing threat detection, reverse engineering, and incident response.
          </p>
        </div>

        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center self-start sm:self-auto min-w-[140px]">
          <span className="text-[11px] text-slate-400 block mb-0.5">Your Current Rank</span>
          <span className="text-xl font-mono font-bold text-cyan-400 tabular-nums">
            #{sortedLeaderboard.find(u => u.isCurrentUser)?.rank || 6}
          </span>
          <span className="text-[10px] text-slate-500 block">Division 1 Sentinel</span>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Global Youth Sentinel Standings</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Weekly Reset in 3 Days</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold w-16">Rank</th>
                <th className="py-3 px-4 font-semibold">Defender Handle</th>
                <th className="py-3 px-4 font-semibold">Club / Squad</th>
                <th className="py-3 px-4 font-semibold text-right">Badges</th>
                <th className="py-3 px-4 font-semibold text-right">Defense XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {sortedLeaderboard.map((user) => (
                <tr
                  key={user.handle}
                  className={`transition-colors ${
                    user.isCurrentUser
                      ? 'bg-cyan-950/40 text-cyan-200 font-semibold'
                      : 'hover:bg-slate-850/50 text-slate-300'
                  }`}
                >
                  <td className="py-3 px-4 font-mono font-bold text-sm">
                    {user.rank === 1 ? (
                      <span className="text-amber-400">01</span>
                    ) : user.rank === 2 ? (
                      <span className="text-slate-300">02</span>
                    ) : user.rank === 3 ? (
                      <span className="text-amber-600">03</span>
                    ) : (
                      <span className="text-slate-500">
                        {user.rank.toString().padStart(2, '0')}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span className={user.isCurrentUser ? 'text-white font-bold' : 'text-slate-200'}>
                        {user.handle}
                      </span>
                      {user.isCurrentUser && (
                        <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700/60 px-1.5 py-0.5 rounded">
                          You
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {user.team}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-300">
                    {user.badgesCount}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-cyan-400">
                    {user.xp} XP
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Gamification Trophy Hall */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Trophy Hall & Master Achievements
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {stats.unlockedBadgeIds.length} of {BADGES.length} Unlocked
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
                    ? 'bg-slate-950 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.08)]'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isUnlocked
                      ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                      : 'bg-slate-900 text-slate-600'
                  }`}>
                    <Award className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                    badge.rarity === 'Legendary'
                      ? 'bg-purple-950 text-purple-300 border border-purple-800'
                      : badge.rarity === 'Epic'
                      ? 'bg-pink-950 text-pink-300 border border-pink-800'
                      : badge.rarity === 'Rare'
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {badge.rarity}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-1">
                  {badge.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {badge.description}
                </p>

                <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400">Reward:</span>
                  <span className={isUnlocked ? 'text-emerald-400' : 'text-cyan-400'}>
                    +{badge.xpReward} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
