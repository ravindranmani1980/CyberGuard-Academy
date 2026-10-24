import { LeaderboardUser } from '../types';

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  { rank: 1, handle: 'HexValkyrie', team: 'Stanford CyberSec', xp: 2840, badgesCount: 8 },
  { rank: 2, handle: 'CipherPulse', team: 'MIT ByteHacks', xp: 2410, badgesCount: 7 },
  { rank: 3, handle: 'ZeroHunter', team: 'Austin High CyberClub', xp: 1980, badgesCount: 6 },
  { rank: 4, handle: 'NeonGuardian', team: 'Berlin HackLab', xp: 1650, badgesCount: 5 },
  { rank: 5, handle: 'PacketNomad', team: 'Tokyo ZeroDay Squad', xp: 1320, badgesCount: 4 },
  { rank: 6, handle: 'You (Defender)', team: 'Local Guardian', xp: 180, badgesCount: 1, isCurrentUser: true },
  { rank: 7, handle: 'ShadowGlitch', team: 'Seattle High CyberLab', xp: 150, badgesCount: 1 },
  { rank: 8, handle: 'BufferKnight', team: 'Toronto Tech Youth', xp: 110, badgesCount: 1 },
];
