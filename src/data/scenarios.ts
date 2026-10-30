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
      <p class="font-semibold text-[#0E2238] mb-3">Hey Gamer,</p>
      <p class="mb-3 text-[#16232F]">You've been selected as part of our Summer Partner celebration! Claim 3 Months of Discord Nitro with 2 Server Boosts absolutely free.</p>
      <p class="text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-md font-semibold mb-4 inline-block text-xs">⚠️ Expires in 24 hours. Only 50 claims remaining!</p>
      <div class="p-4 bg-[#F3F5F1] rounded-lg border border-[#C7CDC0] text-center my-4">
        <p class="text-xs text-[#4B5A66] mb-2">Scan with your mobile camera or click below to link your Discord account:</p>
        <div class="inline-block p-2 bg-white border border-[#D9DDD3] rounded-md mx-auto mb-3 shadow-xs">
          <svg class="w-32 h-32 text-[#081420]" viewBox="0 0 100 100" fill="currentColor">
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
        <a href="#claim" class="phish-link inline-block px-5 py-2.5 bg-[#0E2238] hover:bg-[#081420] text-[#F3F5F1] font-semibold text-xs rounded-md transition-colors">
          Claim Nitro Gift Now
        </a>
      </div>
      <p class="text-xs text-[#4B5A66]">Discord Inc. 444 De Haro St #51, San Francisco, CA</p>
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
      <p class="font-semibold text-[#0E2238] mb-3">Attention Student,</p>
      <p class="mb-3 text-[#16232F]">Our records indicate an uncollected overpayment refund of <strong>$1,420.00</strong> on your student bursar account for the current semester.</p>
      <p class="mb-3 text-[#16232F]">Due to institutional audit deadlines, this refund must be claimed within <strong>48 hours</strong> or the funds will be forfeited back to state auxiliary balances.</p>
      <div class="my-4 p-3.5 bg-[#081420] border border-[#3E6E86]/40 rounded-lg">
        <p class="text-xs text-[#A9B7BF] mb-1">Attached documentation:</p>
        <div class="flex items-center gap-3 text-sm text-[#5FD3BF] font-mono break-all">
          <span>📄 Refund_DirectDeposit_Authorization.pdf.exe (842 KB)</span>
        </div>
      </div>
      <p class="mb-4 text-[#16232F]">Please download, fill, and submit the attached electronic form immediately to authorize direct deposit.</p>
      <p class="text-xs text-[#4B5A66]">Office of the Bursar & Financial Aid Operations</p>
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
      <p class="font-semibold text-[#0E2238] mb-3">Campus Community,</p>
      <p class="mb-3 text-[#16232F]">Please be advised that the central library wireless access points will undergo planned firmware upgrades this Friday between 11:00 PM and 1:00 AM.</p>
      <p class="mb-3 text-[#16232F]">During this window, wireless connectivity may experience brief 5-minute interruptions. No action is required on your part. Your login credentials will remain unchanged.</p>
      <p class="text-xs text-[#4B5A66]">Campus IT & Infrastructure Services · Help Desk: ext 4357</p>
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
  platform: 'Instagram' | 'Discord' | 'Snapchat' | 'SMS Text';
  attackerPersona: string;
  attackerAvatarSeed: string;
  situation: string;
  incomingMessages: string[];
  smsBannerText?: string;
  options: DialogueOption[];
  attackTechnique: string;
  mitreCode: string;
  forensicDebrief: {
    userMistake: string;
    redFlagsMissed: string[];
    actionableTips: string[];
  };
}

export interface SmishingClue {
  id: string;
  label: string;
  excerpt: string;
  explanation: string;
}

export interface SmishingScenario {
  id: string;
  title: string;
  categoryLabel: string;
  senderDisplay: string;
  senderNumber: string;
  carrierGateway: string;
  timestamp: string;
  urgencyLevel: 'Critical' | 'High' | 'Moderate';
  pretextType: string;
  mitreCode: string;
  smsMessages: string[];
  clues: SmishingClue[];
  options: DialogueOption[];
  forensicDebrief: {
    userMistake: string;
    redFlagsMissed: string[];
    actionableTips: string[];
    recoverySteps: string[];
  };
}

export const SMISHING_SCENARIOS: SmishingScenario[] = [
  {
    id: 'smish-lost-vault-wallet',
    title: 'Drill #1: "I Lost My Valut — Send Me Money to Reach Home"',
    categoryLabel: 'Emergency Financial Smishing & Family/Friend Impersonation',
    senderDisplay: 'Unknown Number (Claiming to be Cousin / Best Friend)',
    senderNumber: '+1 (555) 019-7412',
    carrierGateway: 'Unverified VoIP SMS Gateway · Burner SIM Relay',
    timestamp: 'Today, 9:42 PM',
    urgencyLevel: 'Critical',
    pretextType: 'Distress & Financial Coercion ("Lost Valut / Stranded")',
    mitreCode: 'MITRE T1656 / T1660',
    smsMessages: [
      'Hey!! It is me, my phone screen broke and battery died so I am texting you from a stranger phone at the transit terminal.',
      'I lost my valut and send me money to reach home please!! All my cash and cards were inside.',
      'I need $185 sent right now via instant transfer to +1-555-019-7412 (Name: K. Vane) so I can buy the last ticket home tonight. Please hurry, this stranger is leaving in 3 minutes!!',
    ],
    clues: [
      {
        id: 'clue-valut-1',
        label: 'Unverified Burner Number',
        excerpt: 'Texting from +1 (555) 019-7412 ("stranger phone")',
        explanation: 'Scammers claim their phone broke or died to explain why the SMS comes from an unfamiliar VoIP number.',
      },
      {
        id: 'clue-valut-2',
        label: 'Distress & Spelling Bait',
        excerpt: '"I lost my valut and send me money to reach home"',
        explanation: 'High-emotion panic pretexts ("lost my valut/wallet", stranded at night) are engineered to bypass logical verification.',
      },
      {
        id: 'clue-valut-3',
        label: 'Mismatched Payment Recipient',
        excerpt: 'Instant transfer to third-party mule account (K. Vane)',
        explanation: 'Directing irreversible P2P payments to an unknown third-party name is a hallmark of money-mule smishing.',
      },
    ],
    options: [
      {
        id: 'valut-opt-send',
        text: 'Send the $185 immediately via instant transfer so they are not stranded overnight.',
        isVulnerable: true,
        responseMessage: 'BREACH: Funds were wired to a criminal money-mule account! The scammer immediately demands another $250 for "luggage fees".',
        xpDelta: -30,
      },
      {
        id: 'valut-opt-call',
        text: 'Refuse the transfer and call your friend/family member\'s real saved phone number directly to verify their location.',
        isVulnerable: false,
        responseMessage: 'DEFENSE VERIFIED: You called their real number—they answered from home safe and sound, confirming the SMS was a stranded-traveler smishing scam!',
        xpDelta: 80,
      },
      {
        id: 'valut-opt-challenge',
        text: 'Ask a secret personal verification question only your real friend would know (e.g., "What street did we grow up on?") and block if they dodge.',
        isVulnerable: false,
        responseMessage: 'DEFENSE VERIFIED: The scammer could not answer the personal challenge question and disconnected immediately.',
        xpDelta: 75,
      },
    ],
    forensicDebrief: {
      userMistake: 'Transferred money to an unverified phone number based on an emotional "I lost my valut / stranded" SMS pretext.',
      redFlagsMissed: [
        'Message originated from an unknown VoIP number with the excuse of borrowing a stranger\'s phone.',
        'Classic distress phrasing: "I lost my valut and send me money to reach home" paired with a 3-minute countdown.',
        'Payment recipient name ("K. Vane") did not match the person claiming to be in trouble.',
      ],
      actionableTips: [
        'Always call the person\'s original, saved phone number before ever sending money—even if the text claims their phone is dead.',
        'Establish a family/friend "safe word" or ask a specific personal question that an impersonator could never guess.',
        'Never send irreversible instant transfers (UPI, Zelle, Venmo, Crypto, or Wire) to an unknown recipient handle.',
      ],
      recoverySteps: [
        'Contact your bank or payment app fraud department immediately to report an unauthorized social-engineering scam transfer.',
        'Alert family members and contacts that a scammer is impersonating relatives via SMS.',
        'Forward the spam text message to 7726 (SPAM) so carrier filters block the burner number.',
      ],
    },
  },
  {
    id: 'smish-boss-financial-report',
    title: 'Drill #2: "Boss Ordering: Send Me the Financial Report"',
    categoryLabel: 'Executive Whaling & Authority Smishing (BEC)',
    senderDisplay: 'CEO / Managing Director (Unsaved Mobile)',
    senderNumber: '+1 (555) 014-8829',
    carrierGateway: 'External SMS Relay · Not in Corporate MDM Directory',
    timestamp: 'Today, 2:15 PM',
    urgencyLevel: 'Critical',
    pretextType: 'Executive Authority & Isolation ("Boss Ordering")',
    mitreCode: 'MITRE T1566.004 / T1656',
    smsMessages: [
      'Hi, this is your Boss. I am currently locked in an urgent off-site investor board session and cannot answer voice calls.',
      'I am ordering you right now: send me the financial report (Q4 balance sheet & payroll ledger) to exec-review-private@protonmail.com immediately.',
      'Do not loop in Finance or reply on Slack—this is strictly confidential until the board vote finishes in 15 minutes.',
    ],
    clues: [
      {
        id: 'clue-boss-1',
        label: 'Unlisted External Phone Number',
        excerpt: '+1 (555) 014-8829 (Not in Corporate Directory)',
        explanation: 'Attackers spoof display names or claim to have a "new private mobile number" to impersonate executives.',
      },
      {
        id: 'clue-boss-2',
        label: 'Coercive Authority Command',
        excerpt: '"Boss ordering: send me the financial report immediately"',
        explanation: 'Uses intimidating executive authority to pressure employees into bypassing data governance protocols.',
      },
      {
        id: 'clue-boss-3',
        label: 'Secrecy & Channel Isolation',
        excerpt: '"Cannot answer voice calls... Do not loop in Finance or reply on Slack"',
        explanation: 'Explicitly forbids out-of-band verification on official company channels (Slack/Teams/Voice) so the ruse isn\'t exposed.',
      },
    ],
    options: [
      {
        id: 'boss-opt-comply',
        text: 'Obey the Boss\'s order immediately and email the Q4 financial report to the external address before the 15-minute deadline.',
        isVulnerable: true,
        responseMessage: 'BREACH: Confidential company financial reports and employee payroll records were exfiltrated to an external threat actor!',
        xpDelta: -35,
      },
      {
        id: 'boss-opt-verify-slack',
        text: 'Refuse to send files via SMS/external email and verify the request with your Boss on your organization\'s authenticated Slack/Teams channel.',
        isVulnerable: false,
        responseMessage: 'DEFENSE VERIFIED: Your Boss confirmed on official Slack that they are at their desk and never sent that text. You stopped a Business Email/SMS Compromise!',
        xpDelta: 85,
      },
      {
        id: 'boss-opt-soc',
        text: 'Flag the SMS as an Executive Impersonation (BEC) attempt and forward the header to Security Operations.',
        isVulnerable: false,
        responseMessage: 'DEFENSE VERIFIED: Security Operations blocked the external protonmail drop-box and alerted all finance staff.',
        xpDelta: 80,
      },
    ],
    forensicDebrief: {
      userMistake: 'Exfiltrated internal financial reports in response to an unverified SMS claiming to be the Boss.',
      redFlagsMissed: [
        'Command arrived via personal SMS from an unrecognized phone number rather than authenticated corporate channels.',
        'Demanded delivery of sensitive financial reports to an external, non-corporate email address.',
        'Classic isolation tactic: "I am in a board session, cannot take calls, do not message on Slack."',
      ],
      actionableTips: [
        'Executives will never order confidential financial reports to be sent to external personal emails via text message.',
        'Always verify executive requests using an independent, authenticated internal directory channel (corporate Slack, Teams, or internal phone extension).',
        'Treat any instruction saying "do not verify with anyone else" as a high-severity social engineering red flag.',
      ],
      recoverySteps: [
        'Immediately notify the Data Protection Officer (DPO) and Security Operations of the disclosed financial document.',
        'Revoke any shared document links or cloud permissions if a link was transmitted.',
        'Issue a company-wide alert warning staff of active CEO/Boss SMS impersonation.',
      ],
    },
  },
  {
    id: 'smish-manager-launch-tomorrow',
    title: 'Drill #3: "Manager Requesting Company Financial Details Before Going Live Tomorrow"',
    categoryLabel: 'Pre-Launch Deadline Pretexting & Financial Credential Harvesting',
    senderDisplay: 'Project Manager (Launch Ops)',
    senderNumber: '+1 (555) 017-3309',
    carrierGateway: 'Spoofed Alphanumeric / Unverified SMS Gateway',
    timestamp: 'Today, 6:48 PM',
    urgencyLevel: 'Critical',
    pretextType: 'Pre-Launch Crisis ("Before Going Live Tomorrow")',
    mitreCode: 'MITRE T1598 / T1660',
    smsMessages: [
      'Urgent update from your Manager: Our payment gateway vendor flagged a blocker right before going live tomorrow morning at 8:00 AM!',
      'I am requesting company financial details—specifically our corporate bank routing/IBAN, tax ID, and Stripe live secret key—right now over SMS so I can paste them into the vendor portal.',
      'If you don\'t text me the company financial details in the next 10 minutes, tomorrow\'s go-live launch will be scrubbed and management will hold our team responsible!',
    ],
    clues: [
      {
        id: 'clue-mgr-1',
        label: 'Go-Live Tomorrow Crisis Pressure',
        excerpt: '"Before going live tomorrow... next 10 minutes or launch will be scrubbed"',
        explanation: 'Attackers research public product launch dates and strike the evening before go-live when teams are exhausted and stressed.',
      },
      {
        id: 'clue-mgr-2',
        label: 'Plaintext Financial & API Key Demand',
        excerpt: '"Requesting company financial details, bank routing, and Stripe live secret key over SMS"',
        explanation: 'Corporate banking details and live payment API keys are never transmitted in plaintext over SMS.',
      },
      {
        id: 'clue-mgr-3',
        label: 'Blame & Fear Intimidation',
        excerpt: '"Management will hold our team responsible"',
        explanation: 'Uses fear of professional blame for delaying a launch to force compliance without change-control approval.',
      },
    ],
    options: [
      {
        id: 'mgr-opt-send-details',
        text: 'Text the company financial details and Stripe live key right away so tomorrow\'s go-live is not delayed.',
        isVulnerable: true,
        responseMessage: 'BREACH: Attackers used the company financial details and live payment keys to divert settlement payouts and drain corporate funds before launch!',
        xpDelta: -40,
      },
      {
        id: 'mgr-opt-out-of-band',
        text: 'Halt! Never send company financial details or API keys over SMS. Call the Manager on the verified launch bridge / PagerDuty channel.',
        isVulnerable: false,
        responseMessage: 'DEFENSE VERIFIED: On the live launch bridge, your Manager confirmed the payment gateway was already configured weeks ago—the SMS was a targeted pre-launch spear-smishing attack!',
        xpDelta: 90,
      },
      {
        id: 'mgr-opt-policy',
        text: 'Reject the SMS request and require a dual-authorized Finance & DevSecOps change ticket inside the corporate vault.',
        isVulnerable: false,
        responseMessage: 'DEFENSE VERIFIED: Enforcing zero-trust secret management prevented unauthorized financial disclosure prior to go-live.',
        xpDelta: 85,
      },
    ],
    forensicDebrief: {
      userMistake: 'Transmitted company financial details and live payment credentials over SMS under pre-launch time pressure.',
      redFlagsMissed: [
        'Exploited the high-stress window "before going live tomorrow" to manufacture a fake 10-minute emergency.',
        'Requested raw company financial details and live production secret keys over unencrypted SMS.',
        'Bypassed standard change-management and finance vault workflows.',
      ],
      actionableTips: [
        'Never share company financial details, bank routing numbers, or production API keys via SMS, email, or chat.',
        'Pre-launch and Friday-evening deadlines are prime windows for targeted social engineering—always verify via your live incident/launch voice bridge.',
        'Store and share financial or payment credentials exclusively through hardware-authenticated enterprise vaults.',
      ],
      recoverySteps: [
        'Immediately rotate all live payment gateway API keys (e.g., Stripe/PayPal secret keys) and lock corporate payout routing changes.',
        'Place a fraud freeze on corporate bank accounts and notify treasury operations.',
        'Audit recent settlement webhook endpoints for unauthorized modifications.',
      ],
    },
  },
];

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
    smsBannerText: 'Instagram code: 829-410. DO NOT share this. It can be used to reset your Instagram password.',
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
  {
    id: 'social-sms-lost-vault',
    platform: 'SMS Text',
    attackerPersona: 'Unknown Number (+1 555-019-7412)',
    attackerAvatarSeed: 'vault',
    situation: 'Spam text message claiming to be a close friend/relative who lost their wallet/valut and needs emergency travel money.',
    incomingMessages: [
      'Hey it is me! My phone died and I am texting from a stranger phone at the station.',
      'I lost my valut and send me money to reach home please!!',
      'Send $185 right now to this instant transfer number (+1-555-019-7412) so I can buy the last ticket home tonight!',
    ],
    smsBannerText: 'CARRIER ALERT: Sender +1 (555) 019-7412 is not in your contacts and originates from an external VoIP gateway.',
    options: [
      {
        id: 'opt-vault-pay',
        text: 'Wire the $185 immediately so they can get home safely tonight.',
        isVulnerable: true,
        responseMessage: 'Scam successful! You wired money to an impersonator using a classic "stranded traveler / lost valut" spam text.',
        xpDelta: -30,
      },
      {
        id: 'opt-vault-call',
        text: 'Do not send money. Call your friend/relative on their real saved phone number first to verify.',
        isVulnerable: false,
        responseMessage: 'Verified! Your friend answered their real phone at home and confirmed they never lost their wallet.',
        xpDelta: 80,
      },
    ],
    attackTechnique: 'Stranded Relative / "Lost Valut" Emergency Smishing Scam',
    mitreCode: 'MITRE T1656 / T1660',
    forensicDebrief: {
      userMistake: 'Sent money to an unverified number after receiving an emotional "I lost my valut and send me money to reach home" text.',
      redFlagsMissed: [
        'Message came from an unknown number claiming to borrow a stranger\'s phone.',
        'Urgent demand for instant money transfer without verifying identity via voice call.',
      ],
      actionableTips: [
        'Always call your friend or family member\'s known number directly before sending emergency funds.',
        'Ask a personal verification question that only the real person could answer.',
      ],
    },
  },
  {
    id: 'social-sms-boss-report',
    platform: 'SMS Text',
    attackerPersona: 'Boss / Managing Director (+1 555-014-8829)',
    attackerAvatarSeed: 'boss',
    situation: 'Boss sending a text message ordering you to immediately send the confidential financial report while claiming to be in a meeting.',
    incomingMessages: [
      'This is your Boss. I am in a closed-door board meeting and cannot take calls.',
      'I am ordering you: send me the financial report right now to exec-board-files@protonmail.com.',
      'Do not message me on Slack or delay—the board needs the numbers in 10 minutes.',
    ],
    smsBannerText: 'SECURITY NOTICE: External phone number not registered in Corporate MDM Directory.',
    options: [
      {
        id: 'opt-boss-send',
        text: 'Follow the Boss\'s text order and send the financial report right away.',
        isVulnerable: true,
        responseMessage: 'Data Breach! You exfiltrated confidential financial reports to an external BEC attacker.',
        xpDelta: -35,
      },
      {
        id: 'opt-boss-verify',
        text: 'Refuse external SMS delivery and verify with your Boss via authenticated company Slack/Teams.',
        isVulnerable: false,
        responseMessage: 'Blocked! Your Boss confirmed on Slack that the SMS was a spoofed executive whaling attack.',
        xpDelta: 85,
      },
    ],
    attackTechnique: 'Executive Authority Pretexting (CEO / Boss Smishing)',
    mitreCode: 'MITRE T1566.004 / T1656',
    forensicDebrief: {
      userMistake: 'Complied with an unverified SMS from "Boss" ordering delivery of the financial report.',
      redFlagsMissed: [
        'Unlisted mobile number combined with "in a meeting, cannot take calls" isolation.',
        'Request to send internal financial reports to an external email address.',
      ],
      actionableTips: [
        'Never send internal financial reports in response to an SMS text message.',
        'Verify all executive requests through authenticated internal corporate channels.',
      ],
    },
  },
  {
    id: 'social-sms-manager-golive',
    platform: 'SMS Text',
    attackerPersona: 'Project Manager (+1 555-017-3309)',
    attackerAvatarSeed: 'manager',
    situation: 'Manager is requesting company financial details via text message right before going live tomorrow.',
    incomingMessages: [
      'Urgent from Manager: We have a payment settlement blocker right before going live tomorrow!',
      'I am requesting company financial details, corporate routing numbers, and live payment keys over SMS right now to clear the launch check.',
      'Send them in the next 10 minutes or tomorrow\'s go-live is cancelled!',
    ],
    smsBannerText: 'DLP WARNING: Never transmit banking routing details or live API keys over unencrypted SMS.',
    options: [
      {
        id: 'opt-mgr-comply',
        text: 'Reply with the company financial details so tomorrow\'s go-live launch stays on schedule.',
        isVulnerable: true,
        responseMessage: 'Critical Compromise! Attackers hijacked corporate payout routing prior to launch.',
        xpDelta: -40,
      },
      {
        id: 'opt-mgr-bridge',
        text: 'Refuse SMS disclosure and verify directly on the authenticated go-live launch bridge.',
        isVulnerable: false,
        responseMessage: 'Excellent defense! You protected company financial details from a pre-launch spear-smishing attack.',
        xpDelta: 90,
      },
    ],
    attackTechnique: 'Pre-Launch Urgency Pretexting ("Before Going Live Tomorrow")',
    mitreCode: 'MITRE T1598 / T1660',
    forensicDebrief: {
      userMistake: 'Shared company financial details via SMS under pre-launch deadline pressure.',
      redFlagsMissed: [
        'Artificial crisis manufactured "before going live tomorrow" to bypass normal financial controls.',
        'Plaintext SMS request for corporate banking and financial details.',
      ],
      actionableTips: [
        'Company financial details and production credentials must never be shared over SMS.',
        'Always confirm urgent pre-launch requests via your verified incident/launch voice bridge.',
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
