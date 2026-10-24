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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="breach-title"
        className="w-full max-w-2xl bg-slate-900 border border-red-500/50 rounded-2xl shadow-[0_0_50px_rgba(239,68,68,0.25)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top Emergency Banner */}
        <div className="bg-red-950/70 border-b border-red-500/30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-900/60 text-red-400 border border-red-500/40">
              <AlertOctagon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-red-400 uppercase tracking-wider">
                <span>Immediate Security Breach Alert</span>
                {incident.mitreRef && (
                  <span className="font-mono text-[11px] text-red-300 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                    {incident.mitreRef}
                  </span>
                )}
              </div>
              <h2 id="breach-title" className="text-xl font-bold text-white tracking-tight">
                {incident.scenarioTitle}
              </h2>
            </div>
          </div>
          <span className="text-xs font-mono text-red-400 bg-red-950/90 px-2.5 py-1 rounded border border-red-800/80">
            COMPROMISE DETECTED
          </span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* What went wrong section */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
              <XCircle className="w-4 h-4 text-red-400" />
              <span>What Happened & The Mistake Made</span>
            </h3>
            <p className="text-slate-200 text-sm leading-relaxed mt-1">
              {incident.userMistake}
            </p>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Attacker Vector: <strong className="text-slate-200">{incident.attackerTechnique}</strong></span>
              <span className="font-mono text-slate-500">{incident.timestamp}</span>
            </div>
          </div>

          {/* Red flags that were missed */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Red Flags You Missed in This Scenario</span>
            </h3>
            <ul className="space-y-2">
              {incident.redFlagsMissed.map((flag, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-slate-200 text-xs">
                  <span className="text-amber-400 font-bold shrink-0 mt-0.5">!</span>
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Tips to Prevent Future Attacks */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Actionable Defense Playbook (Future Prevention)</span>
            </h3>
            <div className="space-y-2">
              {incident.actionableTips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-slate-200 text-xs leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-mono font-bold shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Real-World Remediation Checklist */}
          {incident.recoverySteps && incident.recoverySteps.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Emergency Real-World Remediation Checklist:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {incident.recoverySteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 shrink-0">→</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-4">
          <button
            onClick={() => {
              playClickSound();
              onRetry();
            }}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Scenario Again</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-red-400 to-amber-400 hover:from-red-300 hover:to-amber-300 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <span>Acknowledge & Continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
