export interface PhishingEmail {
  id: string;
  senderName: string;
  senderAddress: string;
  actualReturnPath: string;
  subject: string;
  timestamp: string;
  bodyHtml: string;
  hasAttachment: boolean;
  attachmentName?: string;
  attachmentRealExt?: string;
  attachmentSuspicious: boolean;
  hasQrCode: boolean;
  qrPayloadUrl?: string;
  targetLinkText?: string;
  targetLinkUrl?: string;
  isPhishing: boolean;
  threatCategory: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  redFlags: string[];
  explanation: string;
  actionableTips: string[];
}

export const PHISHING_EMAILS: PhishingEmail[] = [
  {
    id: 'email-discord-nitro',
    senderName: 'Discord Gifts Club',
    senderAddress: 'support@disccrd-nitro-promo.site',
    actualReturnPath: 'bounce-gateway@malicious-vps.ru',
    subject: '🎁 You received 3 Months of Discord Nitro Free!',
    timestamp: 'Today, 2:14 PM',
    bodyHtml: `
      <p class="font-medium text-slate-150 mb-3">Hey Gamer,</p>
      <p class="mb-3">You've been selected as part of our Summer Partner celebration! Claim 3 Months of Discord Nitro with 2 Server Boosts absolutely free.</p>
      <p class="text-amber-300 font-semibold mb-4">⚠️ Expires in 24 hours. Only 50 claims remaining!</p>
      <div class="p-4 bg-slate-900/80 rounded-lg border border-slate-700/60 text-center my-4">
        <p class="text-xs text-slate-400 mb-2">Scan with your mobile camera or click below to link your Discord account:</p>
        <div class="inline-block p-2 bg-white rounded-md mx-auto mb-3 shadow-inner">
          <svg class="w-32 h-32 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
            <rect x="10" y="10" width="25" height="25" fill="black"/>
            <rect x="15" y="15" width="15" height="15" fill="white"/>
            <rect x="18" y="18" width="9" height="9" fill="black"/>
            <rect x="65" y="10" width="25" height="25" fill="black"/>
            <rect x="70" y="15" width="15" height="15" fill="white"/>
            <rect x="73" y="18" width="9" height="9" fill="black"/>
            <rect x="10" y="65" width="25" height="25" fill="black"/>
            <rect x="15" y="70" width="15" height="15" fill="white"/>
            <rect x="18" y="73" width="9" height="9" fill="black"/>
            <rect x="42" y="42" width="16" height="16" fill="black"/>
            <rect x="45" y="15" width="8" height="20" fill="black"/>
            <rect x="45" y="65" width="12" height="15" fill="black"/>
            <rect x="65" y="45" width="15" height="10" fill="black"/>
          </svg>
        </div>
        <br />
        <a href="#claim" class="phish-link inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-md transition-colors shadow-lg">
          Claim Nitro Gift Now
        </a>
      </div>
      <p class="text-xs text-slate-400">Discord Inc. 444 De Haro St #51, San Francisco, CA</p>
    `,
    hasAttachment: false,
    attachmentSuspicious: false,
    hasQrCode: true,
    qrPayloadUrl: 'https://disccrd-nitro-promo.site/login?token=token_stealer_v3',
    targetLinkText: 'Claim Nitro Gift Now',
    targetLinkUrl: 'https://disccrd-nitro-promo.site/login?token=token_stealer_v3',
    isPhishing: true,
    threatCategory: 'Quishing & Typosquatting',
    difficulty: 'Beginner',
    redFlags: [
      'Sender address uses misspelled domain "disccrd-nitro-promo.site" instead of "discord.com"',
      'Artificial urgency ("Expires in 24 hours", "Only 50 claims remaining")',
      'Quishing trap: Scammers use QR codes in emails specifically because email security gateways cannot easily scan images',
      'The claim button leads to a lookalike domain designed to steal Discord session tokens',
    ],
    explanation: 'This is a classic "Nitro Bait" scam rampant on gaming communities. Clicking the link or scanning the QR code asks you to log into Discord, instantly granting session access to an attacker who hijacks your account to scam your friends.',
    actionableTips: [
      'Genuine Discord gifts never arrive via email requiring you to re-login with your credentials.',
      'Always inspect the sender domain carefully: Look for typosquatting (e.g. extra "c" in disccrd).',
      'Never scan QR codes displayed in unsolicited emails or Discord DMs.',
    ],
  },
  {
    id: 'email-college-refund',
    senderName: 'University Financial Aid Office',
    senderAddress: 'bursar-updates@state-university.edu.aid-portal.net',
    actualReturnPath: 'mailer@aid-portal.net',
    subject: 'URGENT: Outstanding Fall Tuition Refund ($1,420.00)',
    timestamp: 'Yesterday, 9:30 AM',
    bodyHtml: `
      <p class="font-medium text-slate-150 mb-3">Attention Student,</p>
      <p class="mb-3">Our records indicate an uncollected overpayment refund of <strong>$1,420.00</strong> on your student bursar account for the current semester.</p>
      <p class="mb-3">Due to institutional audit deadlines, this refund must be claimed within <strong>48 hours</strong> or the funds will be forfeited back to state auxiliary balances.</p>
      <div class="my-4 p-3 bg-slate-900 border border-slate-700 rounded-md">
        <p class="text-xs text-slate-400 mb-1">Attached documentation:</p>
        <div class="flex items-center gap-3 text-sm text-cyan-300 font-mono">
          <span>📄 Refund_DirectDeposit_Authorization.pdf.exe (842 KB)</span>
        </div>
      </div>
      <p class="mb-4">Please download, fill, and submit the attached electronic form immediately to authorize direct deposit.</p>
      <p class="text-xs text-slate-400">Office of the Bursar & Financial Aid Operations</p>
    `,
    hasAttachment: true,
    attachmentName: 'Refund_DirectDeposit_Authorization.pdf.exe',
    attachmentRealExt: '.exe',
    attachmentSuspicious: true,
    hasQrCode: false,
    isPhishing: true,
    threatCategory: 'Malicious Executable & Double Extension',
    difficulty: 'Intermediate',
    redFlags: [
      'Double file extension: "Refund_DirectDeposit_Authorization.pdf.exe" is an executable program, NOT a PDF!',
      'Domain deception: "state-university.edu.aid-portal.net" is owned by "aid-portal.net", not the university',
      'Pressure tactic threatening forfeiture of money within 48 hours',
    ],
    explanation: 'Attackers frequently use double extensions (like .pdf.exe) because default Windows settings hide known file extensions, making an executable malware file look like an innocent PDF.',
    actionableTips: [
      'Enable "Show File Name Extensions" in your computer folder settings to spot hidden .exe or .vbs extensions.',
      'Never download or run executable files (.exe, .bat, .scr) sent via email.',
      'Always log directly into your official student portal URL via your browser bookmark rather than following email links.',
    ],
  },
  {
    id: 'email-campus-legit',
    senderName: 'Campus Security & Facilities',
    senderAddress: 'facilities@university.edu',
    actualReturnPath: 'facilities@university.edu',
    subject: 'Scheduled Library Wi-Fi Maintenance (Friday 11 PM)',
    timestamp: 'Oct 23, 11:15 AM',
    bodyHtml: `
      <p class="font-medium text-slate-150 mb-3">Campus Community,</p>
      <p class="mb-3">Please be advised that the central library wireless access points will undergo planned firmware upgrades this Friday between 11:00 PM and 1:00 AM.</p>
      <p class="mb-3">During this window, wireless connectivity may experience brief 5-minute interruptions. No action is required on your part. Your login credentials will remain unchanged.</p>
      <p class="text-xs text-slate-400">Campus IT & Infrastructure Services · Help Desk: ext 4357</p>
    `,
    hasAttachment: false,
    attachmentSuspicious: false,
    hasQrCode: false,
    isPhishing: false,
    threatCategory: 'Legitimate Internal Communication',
    difficulty: 'Intermediate',
    redFlags: [],
    explanation: 'This is a genuine routine announcement from official campus infrastructure. It asks for zero user credentials, has no suspicious links or attachments, uses the authentic .edu domain, and provides verified help desk contact.',
    actionableTips: [
      'Legitimate service announcements usually inform you without demanding immediate logins or personal data.',
      'Do not flag every IT communication; verify sender domains and lack of urgency/threats before taking action.',
    ],
  },
];

// Rogue Wi-Fi Hotspot Scenarios
export interface WiFiNetwork {
  id: string;
  ssid: string;
  security: 'WPA3 Enterprise' | 'WPA2 Personal' | 'Open (None)' | 'Captive Portal (Untrusted)';
  signalStrength: number; // dBm
  isMalicious: boolean;
  threatType?: string;
  gatewayMac: string;
  sslInspectionActive: boolean;
  dnsHijacking: boolean;
  description: string;
  forensicBreakdown?: {
    attackName: string;
    description: string;
    redFlags: string[];
    actionableTips: string[];
  };
}

export const WIFI_HOTSPOTS: WiFiNetwork[] = [
  {
    id: 'wifi-evil-twin',
    ssid: 'CampusCafe_Free_WiFi',
    security: 'Open (None)',
    signalStrength: -38,
    isMalicious: true,
    threatType: 'Evil Twin & SSL Strip (MITM)',
    gatewayMac: '00:14:22:98:A1:C4 (Raspberry Pi Pineapple)',
    sslInspectionActive: true,
    dnsHijacking: true,
    description: 'An unencrypted open network mimicking the cafe name with full signal strength right next to the register.',
    forensicBreakdown: {
      attackName: 'Evil Twin Rogue Access Point (MITRE T1040)',
      description: 'An attacker is broadcasting a cloned Wi-Fi name using a rogue device (like a WiFi Pineapple). Connecting routes all your unencrypted HTTP traffic, session cookies, and DNS requests directly through the attacker machine.',
      redFlags: [
        'Network requires no password (Open) while the real cafe provides a WPA2 key on the receipt',
        'Captive portal prompts to install a "Security Root Certificate" on your device',
        'Suspicious gateway MAC address belonging to portable hardware tools',
      ],
      actionableTips: [
        'Never install custom configuration profiles or root certificates to access public Wi-Fi.',
        'Use your phone mobile hotspot (cellular 5G) when handling banking, logins, or coursework in public venues.',
        'Always use a trusted VPN with kill-switch enabled whenever connecting to open public networks.',
      ],
    },
  },
  {
    id: 'wifi-legit-cafe',
    ssid: 'CampusCafe_Guest_Secure',
    security: 'WPA2 Personal',
    signalStrength: -62,
    isMalicious: false,
    gatewayMac: '80:2A:A8:12:34:56 (Cisco Meraki AP)',
    sslInspectionActive: false,
    dnsHijacking: false,
    description: 'The genuine cafe guest network with password printed on receipt.',
  },
  {
    id: 'wifi-airport-rogue',
    ssid: 'Airport_HighSpeed_Free_5G',
    security: 'Captive Portal (Untrusted)',
    signalStrength: -42,
    isMalicious: true,
    threatType: 'Credential Harvesting Captive Portal',
    gatewayMac: 'DC:A6:32:44:81:99 (Unknown AP)',
    sslInspectionActive: true,
    dnsHijacking: true,
    description: 'Prompts you to "Sign in with Google or Apple ID" to get 30 minutes of high-speed browsing.',
    forensicBreakdown: {
      attackName: 'Captive Portal Credential Harvester',
      description: 'The login page you see is a phishing page hosted directly on the rogue router. Entering your Google or Apple credentials hands over your email and password to the operator.',
      redFlags: [
        'Browser URL bar does not show the official airport domain',
        'Legitimate airport networks rarely require full OAuth passwords—they usually just ask for terms acceptance',
        'Certificate error appears when attempting to reach standard HTTPS websites',
      ],
      actionableTips: [
        'Never type real passwords into captive portal splash screens.',
        'Turn off "Auto-Join Hotspots" in your smartphone and laptop Wi-Fi settings.',
        'If a captive portal asks for your Google password, disconnect immediately.',
      ],
    },
  },
];

// Social Engineering & DM Impersonation Scenarios
export interface DialogueOption {
  id: string;
  text: string;
  isVulnerable: boolean;
  responseMessage: string;
  xpDelta: number;
}

export interface SocialEngScenario {
  id: string;
  platform: 'Instagram' | 'Discord' | 'Snapchat';
  attackerPersona: string;
  attackerAvatarSeed: string;
  situation: string;
  incomingMessages: string[];
  options: DialogueOption[];
  attackTechnique: string;
  mitreCode: string;
  forensicDebrief: {
    userMistake: string;
    redFlagsMissed: string[];
    actionableTips: string[];
  };
}

export const SOCIAL_ENG_SCENARIOS: SocialEngScenario[] = [
  {
    id: 'social-insta-ambassador',
    platform: 'Instagram',
    attackerPersona: 'Jordan (School Track Teammate)',
    attackerAvatarSeed: 'jordan',
    situation: "Jordan's account was hacked 30 minutes ago. The hacker is messaging his contact list posing as him.",
    incomingMessages: [
      "Yo!! Are you awake??",
      "I need a huge favor, I'm competing in this Red Bull creator contest and I'm 2 votes away from qualifying for the finals!! 🏆",
      "I entered your number so you can vote for me. Insta is gonna text you a 6-digit link/code right now, can you screenshot it and send it to me real quick?? Please don't let me down!!",
    ],
    options: [
      {
        id: 'opt-send-code',
        text: 'Sure bro! Here is the code from SMS: 829-410',
        isVulnerable: true,
        responseMessage: 'Hacker logged in! Your Instagram account session has been terminated and phone number updated.',
        xpDelta: -30,
      },
      {
        id: 'opt-ask-proof',
        text: 'Wait, why does Instagram say "Use this code to RESET your password"? What was our coach\'s nickname?',
        isVulnerable: false,
        responseMessage: 'Hacker immediately blocks you or goes silent. You caught the impersonator red-handed!',
        xpDelta: 60,
      },
      {
        id: 'opt-call-friend',
        text: 'I am calling you right now to verify this. Don\'t share any codes.',
        isVulnerable: false,
        responseMessage: 'Smart move! Jordan answers on another app and confirms his account was just stolen.',
        xpDelta: 75,
      },
    ],
    attackTechnique: 'Account Takeover via SMS OTP Forwarding (Social Engineering)',
    mitreCode: 'MITRE T1539 / T1556',
    forensicDebrief: {
      userMistake: 'Forwarded a password reset OTP (One-Time Passcode) sent directly by Instagram.',
      redFlagsMissed: [
        'The SMS message clearly states "DO NOT SHARE THIS CODE WITH ANYONE. It is to reset your password."',
        'Contests and votes NEVER require third parties to receive authorization codes from your personal phone.',
        'Urgency ("Please don\'t let me down!!", "2 votes away") designed to suppress critical thinking.',
      ],
      actionableTips: [
        'Never forward any verification code sent to your phone, even if the person messaging you is your best friend or sibling.',
        'When a friend makes unusual requests involving codes, money, or gift cards, contact them through a different channel (phone call or in person).',
        'Switch your account 2FA from SMS to an Authenticator App (e.g. Google Authenticator) which cannot be forwarded like this.',
      ],
    },
  },
];

// Ransomware Incident Response Triage Steps
export interface TriageStep {
  id: string;
  order: number;
  actionText: string;
  isCorrectPriority: boolean;
  priorityRank: number; // 1 = Highest, 4 = Lowest
  explanation: string;
}

export const RANSOMWARE_STEPS: TriageStep[] = [
  {
    id: 'step-isolate-network',
    order: 1,
    actionText: 'Immediately disconnect network cable & turn off Wi-Fi (Isolate System)',
    isCorrectPriority: true,
    priorityRank: 1,
    explanation: 'Stopping network traffic prevents ransomware from spreading laterally to school/family shared drives and stops the malware from contacting the attacker command & control server.',
  },
  {
    id: 'step-kill-process',
    order: 2,
    actionText: 'Identify & terminate the rogue process in Task Manager',
    isCorrectPriority: true,
    priorityRank: 2,
    explanation: 'Halting the running encryptor binary stops ongoing file encryption on local storage before more directories are locked.',
  },
  {
    id: 'step-preserve-evidence',
    order: 3,
    actionText: 'Take a memory snapshot / record ransom note details and report to IT',
    isCorrectPriority: true,
    priorityRank: 3,
    explanation: 'Documentation helps incident responders identify the exact ransomware strain and check if free decryption keys exist on NoMoreRansom.org.',
  },
  {
    id: 'step-pay-ransom',
    order: 4,
    actionText: 'Open Bitcoin wallet and pay the 0.05 BTC ransom demand',
    isCorrectPriority: false,
    priorityRank: 4,
    explanation: 'NEVER PAY THE RANSOM! FBI and cybersecurity agencies warn that over 50% of victims who pay never receive working keys, and payment funds future criminal syndicates.',
  },
];
