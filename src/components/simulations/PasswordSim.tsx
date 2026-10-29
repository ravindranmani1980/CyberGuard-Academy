import React, { useState, useMemo } from 'react';
import { Shield, AlertTriangle, Sparkles, Cpu, Eye, EyeOff } from 'lucide-react';
import { playClickSound, playSuccessSound } from '../../utils/audio';

interface PasswordSimProps {
  onSuccess: (xp: number, category: string, badgeId?: string) => void;
}

const COMMON_WORDS = [
  'password', '123456', 'qwerty', 'admin', 'welcome', 'football',
  'minecraft', 'roblox', 'fortnite', 'dragon', 'baseball', 'princess',
  'superman', 'sunshine', 'iloveyou', 'starwars', 'monkey', 'secret'
];

const DICEWARE_WORDS = [
  'velvet', 'orbit', 'falcon', 'timber', 'galaxy', 'quantum', 'breeze', 'granite',
  'shadow', 'ember', 'beacon', 'canyon', 'shield', 'comet', 'radiant', 'puzzle',
  'summit', 'aurora', 'matrix', 'cipher', 'horizon', 'prism', 'zenith', 'pulse'
];

export const PasswordSim: React.FC<PasswordSimProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('summer2024!');
  const [showPlaintext, setShowPlaintext] = useState(false);
  const [hasUnlockedMastery, setHasUnlockedMastery] = useState(false);

  const entropyStats = useMemo(() => {
    const len = password.length;
    if (len === 0) return { bits: 0, poolSize: 0, timeToCrack: 'Instant', status: 'Empty', color: 'text-[#4B5A66]', containsCommonWord: false };

    let pool = 0;
    if (/[a-z]/.test(password)) pool += 26;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/[0-9]/.test(password)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(password)) pool += 33;

    const lower = password.toLowerCase();
    const containsCommonWord = COMMON_WORDS.some(w => lower.includes(w));

    let bits = Math.floor(len * (Math.log2(pool || 1)));
    if (containsCommonWord) {
      bits = Math.max(12, bits - 28);
    }

    let timeToCrack = 'Instant';
    let status = 'Critical';
    let color = 'text-red-700';

    if (bits < 28) {
      timeToCrack = '< 1 millisecond';
      status = 'Very Weak';
      color = 'text-red-700';
    } else if (bits < 45) {
      timeToCrack = 'A few seconds to hours';
      status = 'Weak (Dictionary vulnerable)';
      color = 'text-amber-800';
    } else if (bits < 60) {
      timeToCrack = 'A few months';
      status = 'Moderate';
      color = 'text-amber-700';
    } else if (bits < 80) {
      timeToCrack = 'Centuries (3,400+ years)';
      status = 'Strong';
      color = 'text-[#0E2238]';
    } else {
      timeToCrack = 'Billions of Years (Quantum resilient)';
      status = 'Fortress Grade';
      color = 'text-emerald-700';
    }

    return { bits, poolSize: pool, timeToCrack, status, color, containsCommonWord };
  }, [password]);

  const handleGeneratePassphrase = () => {
    playClickSound();
    const chosen = [];
    for (let i = 0; i < 4; i++) {
      const idx = Math.floor(Math.random() * DICEWARE_WORDS.length);
      chosen.push(DICEWARE_WORDS[idx]);
    }
    const num = Math.floor(Math.random() * 90) + 10;
    const generated = `${chosen.join('-')}-${num}`;
    setPassword(generated);

    if (!hasUnlockedMastery) {
      playSuccessSound();
      setHasUnlockedMastery(true);
      onSuccess(80, 'passwords', 'badge_entropy_master');
    }
  };

  const handleApplyPreset = (preset: string) => {
    playClickSound();
    setPassword(preset);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Concept Header */}
      <div className="p-5 rounded-xl bg-white border border-[#D9DDD3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="rm-kicker">MOD-04 / Cryptographic Entropy &amp; Passkey Evaluator</span>
          <h2 className="text-lg font-semibold text-[#0E2238]">
            Brute Force vs Mathematical Entropy: Why Passphrases Beat Substitution Tricks
          </h2>
        </div>
        <button
          type="button"
          onClick={handleGeneratePassphrase}
          className="px-4 py-2 bg-[#0E2238] hover:bg-[#081420] text-[#F3F5F1] font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#5FD3BF]" />
          <span>Generate 80-Bit Passphrase</span>
        </button>
      </div>

      {/* Main Two-Zone Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Entropy Playground */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-xl bg-white border border-[#D9DDD3] shadow-xs space-y-4">
            <div>
              <label htmlFor="test-password" className="block text-xs font-medium text-[#16232F] mb-1.5">
                Evaluate Candidate Password or Passphrase (Zero-Knowledge Client Memory Only)
              </label>
              <div className="relative">
                <input
                  id="test-password"
                  type={showPlaintext ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type any password to test entropy..."
                  className="w-full px-4 py-2.5 bg-white border border-[#C7CDC0] rounded-lg text-[#16232F] font-mono text-sm focus:outline-none focus:border-[#0E2238] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPlaintext(!showPlaintext)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5A66] hover:text-[#081420] p-1 cursor-pointer"
                  aria-label={showPlaintext ? 'Hide password' : 'Show password'}
                >
                  {showPlaintext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Common youth presets */}
            <div>
              <span className="text-xs text-[#4B5A66] block mb-2">
                Compare candidate patterns:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleApplyPreset('minecraft2024')}
                  className="px-3 py-1 bg-[#F3F5F1] hover:bg-[#E9ECE6] border border-[#C7CDC0] text-[#16232F] rounded-md font-mono cursor-pointer"
                >
                  minecraft2024
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('P@$$w0rd123!')}
                  className="px-3 py-1 bg-[#F3F5F1] hover:bg-[#E9ECE6] border border-[#C7CDC0] text-[#16232F] rounded-md font-mono cursor-pointer"
                >
                  P@$$w0rd123!
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset('velvet-timber-canyon-zenith-42')}
                  className="px-3 py-1 bg-[#0E2238] text-[#5FD3BF] rounded-md font-mono cursor-pointer"
                >
                  velvet-timber-canyon-42
                </button>
              </div>
            </div>

            {/* Entropy Meter */}
            <div className="p-4 rounded-xl bg-[#F3F5F1] border border-[#D9DDD3] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#4B5A66] font-mono">MATHEMATICAL ENTROPY:</span>
                <span className={`text-sm sm:text-base font-bold font-mono tabular-nums ${entropyStats.color}`}>
                  {entropyStats.bits} BITS ({entropyStats.status})
                </span>
              </div>

              {/* Entropy Bar */}
              <div className="w-full h-2.5 bg-[#D9DDD3] rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    entropyStats.bits < 30 ? 'bg-red-600' :
                    entropyStats.bits < 60 ? 'bg-[#D79A45]' :
                    entropyStats.bits < 80 ? 'bg-[#0E2238]' : 'bg-[#2BB5A0]'
                  }`}
                  style={{ width: `${Math.min(100, (entropyStats.bits / 90) * 100)}%` }}
                />
              </div>

              {entropyStats.containsCommonWord && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <span>
                    Dictionary Pattern Detected: Modern hash-cracking tools (Hashcat) test 100M+ dictionary words and common leetspeak substitutions first.
                  </span>
                </div>
              )}
            </div>

            {/* Password vs Passkey Card */}
            <div className="p-4 rounded-xl bg-[#F3F5F1] border border-[#D9DDD3] text-xs space-y-1.5">
              <div className="flex items-center gap-2 text-[#0E2238] font-semibold">
                <Shield className="w-4 h-4 text-[#2BB5A0]" />
                <span>Hardened Control: Why FIDO2 Passkeys Eliminate Phishing</span>
              </div>
              <p className="text-[#4B5A66] leading-relaxed text-xs">
                Passkeys use asymmetric public-key cryptography bound to your hardware enclave. Even on an identical phishing clone domain, passkeys <strong>cannot be phished</strong> because the cryptographic challenge verifies the exact origin domain.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Hardware Cracking Benchmark */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-xl bg-white border border-[#D9DDD3] shadow-xs space-y-4">
            <div className="border-b border-[#D9DDD3] pb-3">
              <span className="rm-kicker">Brute-Force Benchmark</span>
              <h3 className="text-sm font-semibold text-[#0E2238] flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-[#2BB5A0]" />
                <span>Estimated Time-to-Crack Across Compute Tiers</span>
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-[#F3F5F1] rounded-lg border border-[#D9DDD3] space-y-1">
                <div className="flex items-center justify-between text-[#4B5A66]">
                  <span>Consumer Laptop (MD5 Hash):</span>
                  <span className="font-mono text-[#16232F]">~80M guesses/sec</span>
                </div>
                <div className="text-[#0E2238] font-semibold font-mono">
                  {entropyStats.bits < 35 ? 'A few seconds' : 'Several days'}
                </div>
              </div>

              <div className="p-3.5 bg-[#081420] rounded-lg border border-[#3E6E86]/40 space-y-1 text-[#EEF3F1]">
                <div className="flex items-center justify-between text-[#A9B7BF]">
                  <span>8x RTX 4090 GPU Cluster (NTLM):</span>
                  <span className="font-mono text-[#5FD3BF]">350B guesses/sec</span>
                </div>
                <div className="font-semibold font-mono text-[#EBC385]">
                  {entropyStats.timeToCrack}
                </div>
              </div>

              <div className="p-3.5 bg-[#F3F5F1] rounded-lg border border-[#D9DDD3] space-y-1">
                <div className="flex items-center justify-between text-[#4B5A66]">
                  <span>Quantum Grover Search:</span>
                  <span className="font-mono text-[#0E2238]">Sqrt(N) Complexity</span>
                </div>
                <div className="text-[#16232F] font-mono text-[11px]">
                  {entropyStats.bits >= 80 ? 'Cryptographically resilient (>2^40 cycles)' : 'Vulnerable to quadratic speedup'}
                </div>
              </div>
            </div>

            {/* Actionable Rules */}
            <div className="p-4 rounded-xl bg-[#F3F5F1] border border-[#D9DDD3] space-y-1.5 text-xs">
              <h5 className="font-semibold text-[#0E2238]">3 Credential Governance Rules:</h5>
              <ol className="list-decimal list-inside space-y-1 text-[#4B5A66] text-xs leading-relaxed">
                <li><strong className="text-[#16232F]">Length &gt; Complexity:</strong> A 4-word passphrase (24+ chars) yields far higher entropy than an 8-char complex string.</li>
                <li><strong className="text-[#16232F]">Zero Credential Reuse:</strong> Credential-stuffing bots replay leaked passwords across Discord, Instagram, and email.</li>
                <li><strong className="text-[#16232F]">Vault Management:</strong> Store unique 20+ character credentials per service in an encrypted password manager.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
