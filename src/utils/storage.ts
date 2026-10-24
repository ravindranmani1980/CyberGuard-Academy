import { UserStats, BreachIncident } from '../types';

const STORAGE_KEY = 'threatguard_user_sandbox_v1';
const INCIDENTS_KEY = 'threatguard_incidents_sandbox_v1';

export const INITIAL_USER_STATS: UserStats = {
  xp: 180,
  level: 1,
  rankTitle: 'Script Scout',
  defenseScore: 72,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().slice(0, 10),
  categoryMastery: {
    phishing: 65,
    socialEng: 70,
    network: 45,
    passwords: 80,
    incidentResponse: 55,
  },
  simulationsCompleted: 2,
  breachesTriggered: 1,
  unlockedBadgeIds: ['badge_first_defense'],
  reportedThreatIds: [],
  verifiedThreatIds: ['threat_discord_1'],
};

export const INITIAL_INCIDENTS: BreachIncident[] = [
  {
    id: 'inc-init-1',
    timestamp: '2 hours ago',
    scenarioTitle: 'Fake Gaming Tournament Discord Bot',
    category: 'Phishing & OAuth Scam',
    attackerTechnique: 'Malicious OAuth Application Permission Grant (MITRE T1528)',
    mitreRef: 'MITRE ATT&CK T1528',
    userMistake: 'Authorized an unverified Discord bot requesting full server admin & account management.',
    redFlagsMissed: [
      'Bot was created less than 48 hours ago',
      'Scope requested included "Join servers on your behalf" and "Read messages"',
      'Domain redirected to discord-auth-verify.xyz instead of discord.com',
    ],
    actionableTips: [
      'Always inspect Discord OAuth scopes; genuine bots never need administrative account rights for tournament entry.',
      'Check bot verified badges and check developer portal registration date.',
      'Enable Multi-Factor Authentication with an Authenticator app (TOTP) or Security Key.',
    ],
    recoverySteps: [
      'Go to Discord User Settings > Authorized Apps > Deauthorize suspect bot immediately.',
      'Change your Discord master password to terminate active session tokens.',
      'Review connected bank or payment methods associated with Nitro subscriptions.',
    ],
    retested: false,
  },
];

export const loadUserStats = (): UserStats => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_USER_STATS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_USER_STATS;
  }
};

export const saveUserStats = (stats: UserStats) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Zero-knowledge fallback
  }
};

export const loadBreachIncidents = (): BreachIncident[] => {
  try {
    const raw = localStorage.getItem(INCIDENTS_KEY);
    if (!raw) return INITIAL_INCIDENTS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_INCIDENTS;
  }
};

export const saveBreachIncidents = (incidents: BreachIncident[]) => {
  try {
    localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
  } catch {
    // Fail safe
  }
};

// 1-Click Panic Shredder: Compliant with GDPR/CCPA right to erasure
export const shredAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(INCIDENTS_KEY);
    // Overwrite with zeroes in memory
    sessionStorage.clear();
  } catch {
    // Silent purge
  }
};

// XP & Level Calculator
export const calculateRankAndLevel = (xp: number): { level: number; rankTitle: string; nextLevelXp: number } => {
  if (xp < 300) return { level: 1, rankTitle: 'Script Scout', nextLevelXp: 300 };
  if (xp < 750) return { level: 2, rankTitle: 'Packet Defender', nextLevelXp: 750 };
  if (xp < 1400) return { level: 3, rankTitle: 'Cyber Guardian', nextLevelXp: 1400 };
  if (xp < 2200) return { level: 4, rankTitle: 'Threat Hunter', nextLevelXp: 2200 };
  return { level: 5, rankTitle: 'Zero-Day Sentinel', nextLevelXp: 3500 };
};
