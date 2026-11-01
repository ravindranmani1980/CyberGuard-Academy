import { DailyChallengeSpec, SimulationType } from '../types';

interface ChallengeTemplate {
  id: string;
  simType: SimulationType;
  moduleCode: string;
  operationName: string;
  missionTitle: string;
  constraintTitle: string;
  constraintRule: string;
  timeLimitSeconds: number;
}

const DAILY_CHALLENGE_POOL: ChallengeTemplate[] = [
  {
    id: 'dc_smishing_blitz',
    simType: 'smishing',
    moduleCode: 'MOD-06',
    operationName: 'OP: PHANTOM TEXT',
    missionTitle: 'Spam SMS & Executive BEC Triage',
    constraintTitle: '45s Speed Triage · Zero False-Positive Breaches',
    constraintRule:
      'Identify and quarantine an urgent spam SMS or Boss BEC financial pretext within 45 seconds without triggering a single breach.',
    timeLimitSeconds: 45,
  },
  {
    id: 'dc_phishing_header',
    simType: 'phishing',
    moduleCode: 'MOD-01',
    operationName: 'OP: SPOOFED ENVELOPE',
    missionTitle: 'Email & Quishing Header Forensics',
    constraintTitle: '50s Rapid Header Inspection · Flawless Verdict',
    constraintRule:
      'Audit envelope return-paths and classify a phishing or quishing payload in under 50 seconds with 100% accuracy.',
    timeLimitSeconds: 50,
  },
  {
    id: 'dc_wifi_airspace',
    simType: 'wifi',
    moduleCode: 'MOD-02',
    operationName: 'OP: ROGUE BEACON',
    missionTitle: 'Evil Twin Wi-Fi & MITM Airspace Audit',
    constraintTitle: '45s BSSID Telemetry Sweep · Zero Unencrypted Joins',
    constraintRule:
      'Detect and neutralize the rogue Evil Twin hotspot within 45 seconds without connecting to an unverified BSSID.',
    timeLimitSeconds: 45,
  },
  {
    id: 'dc_social_oob',
    simType: 'social_eng',
    moduleCode: 'MOD-03',
    operationName: 'OP: VOICE LOCKDOWN',
    missionTitle: 'Social Engineering & OTP Defense',
    constraintTitle: '45s Out-of-Band Verification · Zero OTP Leaks',
    constraintRule:
      'Defeat an urgent DM impersonator by enforcing Out-of-Band verification in under 45 seconds with zero credential leaks.',
    timeLimitSeconds: 45,
  },
  {
    id: 'dc_password_entropy',
    simType: 'password',
    moduleCode: 'MOD-04',
    operationName: 'OP: QUANTUM VAULT',
    missionTitle: 'High-Entropy Passphrase Formulation',
    constraintTitle: '60s Cryptographic Forge · >75-Bit Entropy Threshold',
    constraintRule:
      'Construct and verify a high-entropy passphrase that withstands 350B-hash/sec GPU cracking within 60 seconds.',
    timeLimitSeconds: 60,
  },
  {
    id: 'dc_ransom_containment',
    simType: 'ransomware',
    moduleCode: 'MOD-05',
    operationName: 'OP: GOLDEN MINUTE',
    missionTitle: 'Ransomware SOC Containment Drill',
    constraintTitle: '40s Rapid Host Isolation · Zero Lateral Spread',
    constraintRule:
      'Isolate the infected network interface and terminate the encryptor binary in under 40 seconds with zero procedural errors.',
    timeLimitSeconds: 40,
  },
];

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDailyChallengeForDate(offsetDays = 0): DailyChallengeSpec {
  const now = new Date();
  const epochDays = Math.floor(now.getTime() / (1000 * 60 * 60 * 24)) + offsetDays;
  const index = Math.abs(epochDays) % DAILY_CHALLENGE_POOL.length;
  const template = DAILY_CHALLENGE_POOL[index];
  const dateKey = `${getTodayDateString()}#${offsetDays}`;

  return {
    ...template,
    dateKey,
    bonusXp: 200,
    badgeId: 'badge_daily_sentinel',
  };
}

export function getSecondsUntilNext24hReset(): number {
  const now = new Date();
  const tomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0
  );
  return Math.max(1, Math.floor((tomorrow.getTime() - now.getTime()) / 1000));
}

export function formatCountdownHMS(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return [hrs, mins, secs].map((v) => String(v).padStart(2, '0')).join(':');
}
