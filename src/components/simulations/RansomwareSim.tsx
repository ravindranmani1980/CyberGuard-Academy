import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle, Clock, RotateCcw, Flame, HardDrive, WifiOff } from 'lucide-react';
import { RANSOMWARE_STEPS, TriageStep } from '../../data/scenarios';
import { BreachIncident } from '../../types';
import { playClickSound, playSuccessSound, playBreachAlertSound } from '../../utils/audio';

interface RansomwareSimProps {
  onBreach: (incident: BreachIncident) => void;
  onSuccess: (xp: number, category: string, badgeId?: string) => void;
}

export const RansomwareSim: React.FC<RansomwareSimProps> = ({ onBreach, onSuccess }) => {
  const [timeLeft, setTimeLeft] = useState(45);
  const [isActive, setIsActive] = useState(false);
  const [completedStepIds, setCompletedStepIds] = useState<string[]>([]);
  const [isResolved, setIsResolved] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isActive && timeLeft > 0 && !isResolved) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isResolved && isActive) {
      playBreachAlertSound();
      const incident: BreachIncident = {
        id: `inc-ransom-timeout-${Date.now()}`,
        timestamp: 'Just now',
        scenarioTitle: 'Ransomware Triage Window Expired: Local System Encrypted',
        category: 'Ransomware & Cryptovirology',
        attackerTechnique: 'Data Encrypted for Impact (MITRE T1486)',
        mitreRef: 'MITRE ATT&CK T1486',
        userMistake: 'Failed to isolate the network and kill the malicious encryption process within the critical golden window.',
        redFlagsMissed: [
          'Unrecognized high CPU process running from %TEMP% directory',
          'Files appending unusual extension (.lockbit / .crypt)',
          'High network outbound traffic to unrecognized foreign IP address',
        ],
        actionableTips: [
          'Immediate network containment within the first 60 seconds stops lateral movement.',
          'Never pay ransomware demands—implement automated immutable offline backups (3-2-1 rule).',
          'Use endpoint detection and response (EDR) software with automated rollback.',
        ],
        recoverySteps: [
          'Isolate all interconnected machines and switch off network switches.',
          'Format and re-image the operating system from a verified clean golden image.',
          'Restore personal data from an air-gapped, offline external hard drive.',
        ],
        retested: false,
      };
      onBreach(incident);
      setIsActive(false);
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, isResolved, onBreach]);

  const handleStartDrill = () => {
    playClickSound();
    setTimeLeft(45);
    setCompletedStepIds([]);
    setIsResolved(false);
    setIsActive(true);
  };

  const handleExecuteAction = (step: TriageStep) => {
    playClickSound();
    if (!isActive) return;

    if (step.id === 'step-pay-ransom') {
      playBreachAlertSound();
      setIsActive(false);
      const incident: BreachIncident = {
        id: `inc-ransom-pay-${Date.now()}`,
        timestamp: 'Just now',
        scenarioTitle: 'Ransomware Extortion Mistake: Paid the Ransom Demand',
        category: 'Extortion & Cybercrime Financing',
        attackerTechnique: 'Financial Extortion via Ransomware',
        mitreRef: 'MITRE T1486',
        userMistake: 'You agreed to pay the Bitcoin ransom demand instead of isolating the machine and restoring from clean backups.',
        redFlagsMissed: [
          'Criminal syndicates have no legal or contractual obligation to decrypt your files',
          'Over 50% of victims who pay never get working decryption keys',
          'Payment flags your network as a "willing payer" in criminal dark web databases, inviting repeat attacks',
        ],
        actionableTips: [
          'The FBI, CISA, and Europol strictly urge victims NEVER to pay ransomware extortionists.',
          'Ransomware payments directly finance international cyber syndicates and human trafficking.',
          'Always maintain a 3-2-1 backup strategy: 3 copies, 2 different media, 1 immutable offline/air-gapped.',
        ],
        recoverySteps: [
          'Contact local cybercrime authorities (e.g. IC3 / CISA) with the attacker BTC address.',
          'Check NoMoreRansom.org for public master keys discovered by law enforcement.',
          'Wipe compromised drives completely and rebuild systems from scratch.',
        ],
        retested: false,
      };
      onBreach(incident);
      return;
    }

    const nextCompleted = [...completedStepIds, step.id];
    setCompletedStepIds(nextCompleted);

    const validCount = nextCompleted.filter(id => id !== 'step-pay-ransom').length;
    if (validCount === 3) {
      playSuccessSound();
      setIsResolved(true);
      setIsActive(false);
      onSuccess(100, 'incidentResponse', 'badge_ransom_triage');
    }
  };

  return (
    <div className="space-y-6">
      {/* Concept Header */}
      <div className="p-5 rounded-xl bg-white border border-[#D9DDD3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="rm-kicker">MOD-05 / Incident Response &amp; Ransomware Containment</span>
          <h2 className="text-lg font-semibold text-[#0E2238]">
            Active Endpoint Encryption Alert: 45-Second Containment Window
          </h2>
        </div>
        {!isActive && !isResolved && (
          <button
            type="button"
            onClick={handleStartDrill}
            className="px-4 py-2 bg-[#0E2238] hover:bg-[#081420] text-[#F3F5F1] font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Flame className="w-4 h-4 text-[#EBC385]" />
            <span>Launch Triage Incident Drill</span>
          </button>
        )}
      </div>

      {/* Main Two-Zone Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Attack Monitor & Terminal */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-xl bg-white border border-[#D9DDD3] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9DDD3] pb-3.5">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#0E2238]" />
                <h3 className="text-xs font-bold text-[#0E2238] uppercase tracking-wider font-mono">
                  ENDPOINT TELEMETRY: C:\Windows\Temp\host_svc32.exe
                </h3>
              </div>
              <div className="flex items-center gap-2 bg-[#081420] px-3 py-1 rounded-md border border-[#3E6E86]/40">
                <Clock className="w-3.5 h-3.5 text-[#EBC385]" />
                <span className={`font-mono text-xs font-semibold tabular-nums ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-[#EBC385]'}`}>
                  00:{timeLeft.toString().padStart(2, '0')}s
                </span>
              </div>
            </div>

            {/* Simulated Ransom Note & Encryption Bar (Dark Command Console) */}
            <div className="p-5 bg-[#081420] rounded-xl border border-[#3E6E86]/50 space-y-3.5 font-mono text-xs text-[#EEF3F1]">
              <div className="text-[#EBC385] font-semibold flex items-center justify-between">
                <span>⚠️ FILE SYSTEM ENCRYPTION STATUS</span>
                <span className={completedStepIds.includes('step-kill-process') ? 'text-[#5FD3BF]' : 'text-red-400'}>
                  {completedStepIds.includes('step-kill-process') ? 'PROCESS TERMINATED [HALTED]' : 'CPU: 94% · AES-256-CBC'}
                </span>
              </div>

              {/* Progress bar of drive encryption */}
              <div className="w-full h-2.5 bg-[#102236] rounded-full overflow-hidden border border-[#C9D3D9]/15">
                <div
                  className={`h-full transition-all duration-1000 ${
                    completedStepIds.includes('step-kill-process') ? 'bg-[#2BB5A0]' : 'bg-red-500'
                  }`}
                  style={{
                    width: completedStepIds.includes('step-kill-process')
                      ? '35%'
                      : `${Math.min(100, ((45 - timeLeft) / 45) * 100)}%`
                  }}
                />
              </div>

              <div className="text-[#A9B7BF] text-[11px] leading-relaxed pt-3 border-t border-[#C9D3D9]/15">
                <p className="text-[#EEF3F1] font-semibold mb-1">Detected Extortion Artifact (README_DECRYPT.txt):</p>
                <p className="text-red-300">&quot;Your personal documents, coursework, and tokens are encrypted. Transfer 0.05 BTC to 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa within 48 hours.&quot;</p>
              </div>
            </div>

            {/* Victory Resolution Card */}
            {isResolved && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-2">
                <h4 className="font-bold text-sm flex items-center gap-2 text-emerald-900">
                  <CheckCircle className="w-5 h-5 text-emerald-700" />
                  <span>Incident Contained: Network Isolated &amp; Process Terminated</span>
                </h4>
                <p className="leading-relaxed">
                  By disconnecting network interfaces first, you prevented lateral movement to shared network drives. Terminating the rogue binary stopped local file encryption, and maintaining air-gapped backups ensures full recovery without paying ransom.
                </p>
                <button
                  type="button"
                  onClick={handleStartDrill}
                  className="px-3.5 py-1.5 bg-[#0E2238] hover:bg-[#081420] text-[#F3F5F1] rounded-lg font-medium text-xs flex items-center gap-1.5 cursor-pointer mt-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Replay Incident Drill</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Incident Response Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-xl bg-white border border-[#D9DDD3] shadow-xs space-y-3.5">
            <div>
              <span className="rm-kicker">Containment Runbook</span>
              <h3 className="text-base font-semibold text-[#0E2238]">
                Incident Response Triage Actions
              </h3>
              <p className="text-xs text-[#4B5A66] mt-0.5">
                Execute valid containment steps while avoiding extortion traps.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              {RANSOMWARE_STEPS.map((step) => {
                const isDone = completedStepIds.includes(step.id);
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleExecuteAction(step)}
                    disabled={isDone || !isActive}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer ${
                      isDone
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : step.id === 'step-pay-ransom'
                        ? 'bg-red-50/70 border-red-200 text-red-950 hover:bg-red-100'
                        : 'bg-[#F3F5F1] border-[#C7CDC0] text-[#16232F] hover:border-[#0E2238] hover:bg-white'
                    } ${!isActive && !isDone ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[#0E2238]">
                        {step.id === 'step-isolate-network' && <WifiOff className="w-3.5 h-3.5 inline mr-1.5 text-[#0E2238]" />}
                        {step.id === 'step-kill-process' && <Terminal className="w-3.5 h-3.5 inline mr-1.5 text-[#0E2238]" />}
                        {step.id === 'step-preserve-evidence' && <HardDrive className="w-3.5 h-3.5 inline mr-1.5 text-[#0E2238]" />}
                        {step.actionText}
                      </span>
                      {isDone && <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />}
                    </div>
                    {isDone && (
                      <p className="text-[11px] text-emerald-900 mt-1 border-t border-emerald-200 pt-1.5">
                        {step.explanation}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 3-2-1 Rule Card */}
            <div className="p-4 rounded-xl bg-[#F3F5F1] border border-[#D9DDD3] text-xs space-y-1.5">
              <span className="font-semibold text-[#0E2238] block">The 3-2-1 Immutable Backup Standard:</span>
              <ul className="text-[#4B5A66] text-xs space-y-1">
                <li>• <strong className="text-[#16232F]">3</strong> total copies of critical data</li>
                <li>• <strong className="text-[#16232F]">2</strong> distinct storage media (e.g. NVMe + Cloud)</li>
                <li>• <strong className="text-[#16232F]">1</strong> air-gapped, offline backup unreachable by ransomware</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
