import React, { useState, useEffect } from 'react';
import { Terminal, Shield, AlertTriangle, CheckCircle, Clock, RotateCcw, Flame, HardDrive, WifiOff } from 'lucide-react';
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
      // Time expired -> Total Drive Encryption!
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

    // Check if user clicked "Pay Ransom"
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

    // Normal valid triage step
    const nextCompleted = [...completedStepIds, step.id];
    setCompletedStepIds(nextCompleted);

    // If completed the 3 valid defensive steps
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
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <span>Simulation 05</span>
            <span aria-hidden="true">·</span>
            <span>Ransomware Emergency Response Triage</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Under Attack: 45 Seconds to Halt Malware Spread
          </h2>
        </div>
        {!isActive && !isResolved && (
          <button
            onClick={handleStartDrill}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-400 hover:to-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shadow-md"
          >
            <Flame className="w-4 h-4 text-slate-950" />
            <span>Launch Triage Incident Drill</span>
          </button>
        )}
      </div>

      {/* Main Two-Zone Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Live Attack Monitor & Terminal */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-red-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  ACTIVE ALERT: C:\Windows\Temp\host_svc32.exe
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span className={`font-mono text-xs font-bold ${timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
                  00:{timeLeft.toString().padStart(2, '0')} SECONDS
                </span>
              </div>
            </div>

            {/* Simulated Ransom Note & Encryption Bar */}
            <div className="p-4 bg-slate-950 rounded-xl border border-red-500/30 space-y-3 font-mono text-xs">
              <div className="text-red-400 font-bold flex items-center justify-between">
                <span>⚠️ ENCRYPTION IN PROGRESS</span>
                <span>
                  {completedStepIds.includes('step-kill-process') ? 'PROCESS KILLED [HALTED]' : 'CPU: 94% · AES-256-CBC'}
                </span>
              </div>

              {/* Progress bar of drive encryption */}
              <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    completedStepIds.includes('step-kill-process') ? 'bg-emerald-500' : 'bg-red-500'
                  }`}
                  style={{
                    width: completedStepIds.includes('step-kill-process')
                      ? '35%'
                      : `${Math.min(100, ((45 - timeLeft) / 45) * 100)}%`
                  }}
                />
              </div>

              <div className="text-slate-400 text-[11px] leading-relaxed pt-2 border-t border-slate-800">
                <p className="text-slate-200 font-bold mb-1">Extortion Demand Note:</p>
                <p className="text-red-300">"Your personal photos, homework, and credentials are encrypted. Send 0.05 BTC to 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa within 48 hours."</p>
              </div>
            </div>

            {/* Victory Resolution Card */}
            {isResolved && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs space-y-2 animate-in fade-in">
                <h4 className="font-bold text-sm flex items-center gap-2 text-emerald-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <span>Threat Mitigated: System Isolated & Files Preserved!</span>
                </h4>
                <p className="text-slate-200 leading-relaxed">
                  Outstanding incident triage! By disconnecting network access first, you blocked lateral movement to family/school network drives. Terminating the rogue binary stopped encryption, and keeping offline backups means zero ransom needs to be paid.
                </p>
                <button
                  onClick={handleStartDrill}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium text-xs flex items-center gap-1.5 cursor-pointer mt-2"
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
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Incident Response Triage Actions
            </span>
            <p className="text-xs text-slate-300">
              Prioritize correct emergency containment actions to protect the network.
            </p>

            <div className="space-y-2.5 pt-1">
              {RANSOMWARE_STEPS.map((step) => {
                const isDone = completedStepIds.includes(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => handleExecuteAction(step)}
                    disabled={isDone || !isActive}
                    className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer ${
                      isDone
                        ? 'bg-slate-950/50 border-emerald-500/40 text-emerald-300'
                        : step.id === 'step-pay-ransom'
                        ? 'bg-red-950/20 border-red-800/40 text-red-200 hover:bg-red-950/40'
                        : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                    } ${!isActive && !isDone ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">
                        {step.id === 'step-isolate-network' && <WifiOff className="w-3.5 h-3.5 inline mr-1 text-cyan-400" />}
                        {step.id === 'step-kill-process' && <Terminal className="w-3.5 h-3.5 inline mr-1 text-amber-400" />}
                        {step.id === 'step-preserve-evidence' && <HardDrive className="w-3.5 h-3.5 inline mr-1 text-purple-400" />}
                        {step.actionText}
                      </span>
                      {isDone && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </div>
                    {isDone && (
                      <p className="text-[11px] text-slate-400 mt-1 border-t border-slate-800 pt-1">
                        {step.explanation}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            {/* 3-2-1 Rule Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <span className="font-semibold text-cyan-400">The Gold-Standard 3-2-1 Backup Rule:</span>
              <ul className="text-slate-400 text-[11px] space-y-1">
                <li>• <strong className="text-slate-300">3</strong> total copies of crucial data</li>
                <li>• <strong className="text-slate-300">2</strong> different storage formats (e.g. SSD + Cloud)</li>
                <li>• <strong className="text-slate-300">1</strong> offline, unplugged air-gapped drive that ransomware cannot touch</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
