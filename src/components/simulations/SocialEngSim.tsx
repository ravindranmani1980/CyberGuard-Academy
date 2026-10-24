import React, { useState } from 'react';
import { MessageSquare, Shield, AlertTriangle, CheckCircle, Smartphone, User, PhoneCall } from 'lucide-react';
import { SOCIAL_ENG_SCENARIOS, SocialEngScenario, DialogueOption } from '../../data/scenarios';
import { BreachIncident } from '../../types';
import { playClickSound, playSuccessSound, playBreachAlertSound } from '../../utils/audio';

interface SocialEngSimProps {
  onBreach: (incident: BreachIncident) => void;
  onSuccess: (xp: number, category: string, badgeId?: string) => void;
}

export const SocialEngSim: React.FC<SocialEngSimProps> = ({ onBreach, onSuccess }) => {
  const [scenario] = useState<SocialEngScenario>(SOCIAL_ENG_SCENARIOS[0]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<{ isVulnerable: boolean; text: string } | null>(null);

  const handleSelectOption = (option: DialogueOption) => {
    playClickSound();
    setSelectedOptionId(option.id);

    if (option.isVulnerable) {
      playBreachAlertSound();
      setOutcome({ isVulnerable: true, text: option.responseMessage });
      const incident: BreachIncident = {
        id: `inc-social-${Date.now()}`,
        timestamp: 'Just now',
        scenarioTitle: `Compromised Friend Account Takeover (${scenario.platform} DM)`,
        category: 'Social Engineering & Credential Harvesting',
        attackerTechnique: scenario.attackTechnique,
        mitreRef: scenario.mitreCode,
        userMistake: scenario.forensicDebrief.userMistake,
        redFlagsMissed: scenario.forensicDebrief.redFlagsMissed,
        actionableTips: scenario.forensicDebrief.actionableTips,
        recoverySteps: [
          'Log into your account via the official app and select "Forget Password" -> "Need More Help".',
          'Notify close friends on alternative apps (SMS/Discord) that your handle is currently hijacked.',
          'Request Instagram/Platform identity selfie verification to re-bind your mobile number.',
        ],
        retested: false,
      };
      onBreach(incident);
    } else {
      playSuccessSound();
      setOutcome({ isVulnerable: false, text: option.responseMessage });
      onSuccess(option.xpDelta, 'socialEng', 'badge_social_fortress');
    }
  };

  const handleReset = () => {
    playClickSound();
    setSelectedOptionId(null);
    setOutcome(null);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Concept Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <span>Simulation 03</span>
            <span aria-hidden="true">·</span>
            <span>Social Engineering & Compromised Peer DMs</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            The Compromised Friend Trap: The Fake Contest & 2FA Forwarding Scam
          </h2>
        </div>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium cursor-pointer"
        >
          Reset Simulation
        </button>
      </div>

      {/* Main Two-Zone Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Mobile Messenger Device Simulator */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl p-3 shadow-2xl overflow-hidden ring-1 ring-slate-800">
            {/* Mobile Phone Mock Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 rounded-2xl mb-3 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-xs text-white">
                    JD
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{scenario.attackerPersona}</span>
                    <span className="text-[10px] text-pink-400 font-normal">({scenario.platform})</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">Active 2m ago</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Smartphone className="w-4 h-4 text-slate-500" />
              </div>
            </div>

            {/* Context situation pill */}
            <div className="p-2.5 mb-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{scenario.situation}</span>
            </div>

            {/* Chat Bubble Thread */}
            <div className="p-3 bg-slate-900/40 rounded-2xl border border-slate-800/80 space-y-3 min-h-[220px]">
              {scenario.incomingMessages.map((msg, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
                    J
                  </div>
                  <div className="max-w-[85%] bg-slate-800 text-slate-200 p-3 rounded-2xl rounded-tl-sm text-xs leading-relaxed border border-slate-700/50">
                    {msg}
                  </div>
                </div>
              ))}

              {/* Simulated incoming SMS push notification */}
              <div className="mt-4 p-3 bg-slate-950/90 border border-cyan-500/40 rounded-xl text-xs space-y-1 shadow-lg animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-cyan-400 font-semibold text-[11px]">
                  <span>📲 INCOMING SMS FROM INSTAGRAM</span>
                  <span className="text-slate-500 font-mono">12:30 PM</span>
                </div>
                <p className="text-slate-300 font-mono text-[11px]">
                  "Instagram code: <span className="text-cyan-300 font-bold underline">829-410</span>. DO NOT share this. It can be used to reset your Instagram password."
                </p>
              </div>

              {/* User selected response in chat */}
              {selectedOptionId && (
                <div className="flex justify-end pt-2">
                  <div className="max-w-[85%] bg-cyan-600 text-white p-3 rounded-2xl rounded-tr-sm text-xs">
                    {scenario.options.find(o => o.id === selectedOptionId)?.text}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Decision Deck & Psychological Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                How Will You Respond?
              </span>
              <p className="text-xs text-slate-300 mt-1">
                Your friend is pleading for help. Attackers leverage your trust and sense of loyalty to bypass logic.
              </p>
            </div>

            <div className="space-y-2.5">
              {scenario.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer ${
                    selectedOptionId === option.id
                      ? option.isVulnerable
                        ? 'bg-red-950/40 border-red-500 text-red-200'
                        : 'bg-emerald-950/40 border-emerald-500 text-emerald-200'
                      : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-white">Option {option.id.slice(-1)}</span>
                    <span className="text-[11px] font-mono text-slate-400">
                      {option.xpDelta > 0 ? `+${option.xpDelta} XP` : `${option.xpDelta} XP`}
                    </span>
                  </div>
                  <p>{option.text}</p>
                </button>
              ))}
            </div>

            {/* Outcome card */}
            {outcome && (
              <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                outcome.isVulnerable
                  ? 'bg-red-950/40 border-red-500/40 text-red-200'
                  : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              }`}>
                <h5 className="font-bold mb-1 flex items-center gap-1.5">
                  {outcome.isVulnerable ? <AlertTriangle className="w-4 h-4 text-red-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  <span>{outcome.isVulnerable ? 'Critical Defense Failure' : 'Impersonator Blocked!'}</span>
                </h5>
                <p>{outcome.text}</p>
              </div>
            )}

            {/* Psychological Traps Explainer */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <span className="font-semibold text-slate-300">Social Engineering Deconstruction:</span>
              <ul className="space-y-1.5 text-slate-400 text-[11px]">
                <li>• <strong className="text-slate-300">Urgency:</strong> "Contest ends in 20 minutes" prevents you from calling your friend.</li>
                <li>• <strong className="text-slate-300">Relational Coercion:</strong> "Please don't let me down" makes you feel guilty for questioning them.</li>
                <li>• <strong className="text-slate-300">Out-of-band Verification:</strong> Always call their actual voice number or ask a private personal question only they would know.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
