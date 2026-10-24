export type SimulationType = 'phishing' | 'wifi' | 'social_eng' | 'password' | 'ransomware';

export interface UserStats {
  xp: number;
  level: number;
  rankTitle: string;
  defenseScore: number; // 0 to 100
  streakDays: number;
  lastActiveDate: string;
  categoryMastery: {
    phishing: number; // 0 to 100
    socialEng: number;
    network: number;
    passwords: number;
    incidentResponse: number;
  };
  simulationsCompleted: number;
  breachesTriggered: number;
  unlockedBadgeIds: string[];
  reportedThreatIds: string[];
  verifiedThreatIds: string[];
}

export interface BreachIncident {
  id: string;
  timestamp: string;
  scenarioTitle: string;
  category: string;
  attackerTechnique: string;
  mitreRef?: string;
  userMistake: string;
  redFlagsMissed: string[];
  actionableTips: string[];
  recoverySteps: string[];
  retested: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'detection' | 'fortress' | 'response' | 'community' | 'privacy';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  xpReward: number;
}

export interface PeerThreat {
  id: string;
  title: string;
  targetPlatform: 'Discord' | 'Instagram' | 'Campus/Email' | 'QR/Quishing' | 'Mobile/APK' | 'Gaming';
  threatLevel: 'Critical' | 'High' | 'Medium';
  reportedBy: string;
  reportedTime: string;
  description: string;
  sampleIndicator: string; // e.g. suspicious domain or text pattern
  redFlags: string[];
  actionableTip: string;
  verificationsCount: number;
  isUserVerified?: boolean;
}

export interface LeaderboardUser {
  rank: number;
  handle: string;
  team: string;
  xp: number;
  badgesCount: number;
  isCurrentUser?: boolean;
}
