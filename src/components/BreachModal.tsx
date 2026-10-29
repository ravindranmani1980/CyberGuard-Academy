import React from 'react';
import { AlertOctagon, CheckCircle2, XCircle, ArrowRight, RotateCcw, ShieldAlert } from 'lucide-react';
import { BreachIncident } from '../types';
import { playClickSound } from '../utils/audio';

interface BreachModalProps {
  incident: BreachIncident | null;
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export const BreachModal: React.FC<BreachModalProps> = ({
  incident,
  isOpen,
  onClose,
  onRetry,
}) => {
  if (!isOpen || !incident) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="breach-title"
        className="w-full max-w-2xl bg-[#F3F5F1] border border-[#C7CDC0] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top Emergency Banner in Postrix Deep Navy */}
        <div className="bg-[#081420] border-b border-[#3E6E86]/40 px-6 py-4 flex items-center justify-between text-[#EEF3F1]">
          <div className="flex items-center gap-3.5">
            <div className="p-2 rounded-lg bg-red-950/80 text-red-400 border border-red-500/40">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-[#EBC385] uppercase tracking-wider">
                <span>Immediate Security Breach Alert</span>
                {incident.mitreRef && (
                  <span className="text-[11px] text-[#5FD3BF] bg-[#102236] px-2 py-0.5 rounded border border-[#C9D3D9]/20">
                    {incident.mitreRef}
                  </span>
                )}
              </div>
              <h2 id="breach-title" className="text-lg font-semibold text-[#EEF3F1] tracking-tight font-serif">
                {incident.scenarioTitle}
              </h2>
            </div>
          </div>
          <span className="text-[11px] font-mono text-red-300 bg-red-950/90 px-2.5 py-1 rounded border border-red-800/80 shrink-0">
            COMPROMISE DETECTED
          </span>
        </div>

        {/* Modal Scrollable Body on Paper */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-[#16232F]">
          {/* What went wrong section */}
          <div className="p-4 rounded-xl bg-white border border-[#D9DDD3]">
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-red-800 mb-1 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-red-700" />
              <span>Root-Cause Finding &amp; Control Failure</span>
            </h3>
            <p className="text-[#16232F] text-sm leading-relaxed mt-1">
              {incident.userMistake}
            </p>
            <div className="mt-3 pt-3 border-t border-[#D9DDD3] flex items-center justify-between text-xs text-[#4B5A66]">
              <span>Attacker Vector: <strong className="text-[#0E2238]">{incident.attackerTechnique}</strong></span>
              <span className="font-mono">{incident.timestamp}</span>
            </div>
          </div>

          {/* Red flags that were missed */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-900 mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-800" />
              <span>Missed Indicators of Compromise (Red Flags)</span>
            </h3>
            <ul className="space-y-2">
              {incident.redFlagsMissed.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 text-xs">
                  <span className="text-amber-800 font-bold font-mono shrink-0">!</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Tips to Prevent Future Attacks */}
          <div>
            <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <span>Defensive Remediation Blueprint (Future Prevention)</span>
            </h3>
            <div className="space-y-2">
              {incident.actionableTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs leading-relaxed">
                  <span className="w-5 h-5 rounded bg-[#0E2238] text-[#5FD3BF] flex items-center justify-center font-mono font-semibold shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Real-World Remediation Checklist */}
          {incident.recoverySteps && incident.recoverySteps.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-[#D9DDD3]">
              <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-[#0E2238] mb-2">
                Incident Response &amp; Recovery Runbook:
              </h4>
              <ul className="space-y-1.5 text-xs text-[#4B5A66]">
                {incident.recoverySteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#2BB5A0] font-bold shrink-0">→</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white px-6 py-4 border-t border-[#D9DDD3] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onRetry();
            }}
            className="px-4 py-2 text-xs font-semibold text-[#0E2238] bg-[#F3F5F1] hover:bg-[#E9ECE6] border border-[#C7CDC0] rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-Execute Scenario</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-[#F3F5F1] bg-[#0E2238] hover:bg-[#081420] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Acknowledge &amp; Continue</span>
            <ArrowRight className="w-4 h-4 text-[#5FD3BF]" />
          </button>
        </div>
      </div>
    </div>
  );
};
