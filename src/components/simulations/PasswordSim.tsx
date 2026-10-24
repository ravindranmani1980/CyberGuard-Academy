import React, { useState, useMemo } from 'react';
import { KeyRound, Shield, CheckCircle, AlertTriangle, Sparkles, RefreshCw, Lock, Cpu, Eye, EyeOff } from 'lucide-react';
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

  // Calculate mathematical entropy
  const entropyStats = useMemo(() => {
    const len = password.length;
    if (len === 0) return { bits: 0, poolSize: 0, timeToCrack: 'Instant', status: 'Empty', color: 'text-slate-500' };

    let pool = 0;
    if (/[a-z]/.test(password)) pool += 26;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/[0-9]/.test(password)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(password)) pool += 33;

    // Check for common dictionary words
    const lower = password.toLowerCase();
    const containsCommonWord = COMMON_WORDS.some(w => lower.includes(w));

    let bits = Math.floor(len * (Math.log2(pool || 1)));
    if (containsCommonWord) {
      bits = Math.max(12, bits - 28); // Heavy penalty for dictionary word
    }

    // Cracking time based on 300 Billion attempts/sec (high-end GPU rig)
    let timeToCrack = 'Instant';
    let status = 'Critical';
    let color = 'text-red-400';

    if (bits < 28) {
      timeToCrack = '< 1 millisecond';
      status = 'Very Weak';
      color = 'text-red-400';
    } else if (bits < 45) {
      timeToCrack = 'A few seconds to hours';
      status = 'Weak (Dictionary vulnerable)';
      color = 'text-amber-400';
    } else if (bits < 60) {
      timeToCrack = 'A few months';
      status = 'Moderate';
      color = 'text-yellow-400';
    } else if (bits < 80) {
      timeToCrack = 'Centuries (3,400+ years)';
      status = 'Strong';
      color = 'text-cyan-400';
    } else {
      timeToCrack = 'Billions of Years (Quantum resilient)';
      status = 'Fortress Grade';
      color = 'text-emerald-400';
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
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <span>Simulation 04</span>
            <span aria-hidden="true">·</span>
            <span>Password Fortress & Entropy Laboratory</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Brute Force vs Mathematical Entropy: Why Passphrases Beat "P@ssw0rd"
          </h2>
        </div>
        <button
          onClick={handleGeneratePassphrase}
          className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate 80-Bit Passphrase</span>
        </button>
      </div>

      {/* Main Two-Zone Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Entropy Playground */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <label htmlFor="test-password" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Test a Password or Passphrase (Zero-Knowledge: Evaluated in Browser RAM only)
              </label>
              <div className="relative">
                <input
                  id="test-password"
                  type={showPlaintext ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Type any password to test entropy..."
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-cyan-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPlaintext(!showPlaintext)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                  aria-label={showPlaintext ? 'Hide password' : 'Show password'}
                >
                  {showPlaintext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Common youth presets */}
            <div>
              <span className="text-xs text-slate-400 block mb-2">
                Try common patterns used by teenagers & young adults:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => handleApplyPreset('minecraft2024')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md font-mono cursor-pointer"
                >
                  minecraft2024
                </button>
                <button
                  onClick={() => handleApplyPreset('P@$$w0rd123!')}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md font-mono cursor-pointer"
                >
                  P@$$w0rd123!
                </button>
                <button
                  onClick={() => handleApplyPreset('velvet-timber-canyon-zenith-42')}
                  className="px-2.5 py-1 bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 rounded-md font-mono cursor-pointer"
                >
                  velvet-timber-canyon-42
                </button>
              </div>
            </div>

            {/* Entropy Meter */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">MATHEMATICAL ENTROPY:</span>
                <span className={`text-base font-bold font-mono ${entropyStats.color}`}>
                  {entropyStats.bits} BITS ({entropyStats.status})
                </span>
              </div>

              {/* Entropy Bar */}
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    entropyStats.bits < 30 ? 'bg-red-500' :
                    entropyStats.bits < 60 ? 'bg-amber-500' :
                    entropyStats.bits < 80 ? 'bg-cyan-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (entropyStats.bits / 90) * 100)}%` }}
                />
              </div>

              {entropyStats.containsCommonWord && (
                <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>
                    Warning: Contains common dictionary word. Modern cracking software (Hashcat) checks top 100M dictionary words first, rendering substitution tricks like "@" useless.
                  </span>
                </div>
              )}
            </div>

            {/* Password vs Passkey Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Shield className="w-4 h-4" />
                <span>Modern Standard: Why Passkeys (FIDO2) Win</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Passkeys use asymmetric public-key cryptography tied to your hardware (Face ID, Touch ID, or Security Key). Even if an attacker builds a 100% identical phishing clone site, passkeys <strong>cannot be phished</strong> because the cryptographic challenge binds strictly to the authentic website origin domain.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Hardware Cracking Benchmark */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Simulated Attacker Cracking Times</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Consumer Laptop (MD5 Hash):</span>
                  <span className="font-mono text-slate-300">~80M guesses/sec</span>
                </div>
                <div className="text-slate-200 font-semibold">
                  {entropyStats.bits < 35 ? 'A few seconds' : 'Several days'}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>8x RTX 4090 GPU Farm (NTLM Hash):</span>
                  <span className="font-mono text-cyan-400">350 Billion guesses/sec</span>
                </div>
                <div className={`font-semibold font-mono ${entropyStats.color}`}>
                  {entropyStats.timeToCrack}
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Quantum Shor / Grover Algorithm:</span>
                  <span className="font-mono text-purple-400">Sqrt(N) Complexity</span>
                </div>
                <div className="text-slate-300 font-mono text-[11px]">
                  {entropyStats.bits >= 80 ? 'Cryptographically secure (>2^40 quantum cycles)' : 'Instantly collapsible'}
                </div>
              </div>
            </div>

            {/* Actionable Rules */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
              <h5 className="font-semibold text-slate-300">3 Golden Password Rules:</h5>
              <ol className="list-decimal list-inside space-y-1 text-slate-400 text-[11px]">
                <li><strong className="text-slate-300">Length &gt; Complexity:</strong> A 4-word passphrase (24 chars) is exponentially harder to crack than a short complex word (8 chars).</li>
                <li><strong className="text-slate-300">Never Reuse:</strong> If one database leaks, credential stuffing bots test that exact combo across Instagram, Discord, and Gmail.</li>
                <li><strong className="text-slate-300">Use a Password Manager:</strong> Generate 20+ random characters per site and memorize just one master passphrase.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
