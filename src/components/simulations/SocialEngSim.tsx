import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Smartphone } from 'lucide-react';
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
      <div className="p-5 rounded-xl bg-white border border-[#D9DDD3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="rm-kicker">MOD-03 / Social Engineering &amp; OTP Relay Defense</span>
          <h2 className="text-lg font-semibold text-[#0E2238]">
            Compromised Peer Impersonation: 2FA Verification Forwarding Trap
          </h2>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="px-3.5 py-2 bg-[#F3F5F1] hover:bg-[#E9ECE6] text-[#0E2238] border border-[#C7CDC0] rounded-lg text-xs font-mono font-medium cursor-pointer self-start sm:self-auto"
        >
          Reset Scenario
        </button>
      </div>

      {/* Main Two-Zone Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Mobile Messenger Device Simulator */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="w-full max-w-md bg-[#081420] border border-[#3E6E86]/50 rounded-2xl p-4 shadow-xl overflow-hidden text-[#EEF3F1]">
            {/* Mobile Phone Mock Header */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0D1C2D] rounded-xl mb-3 border border-[#C9D3D9]/15">
              <div className="flex items-center gap-2.5">
                <div className="rm-mono-mark !w-8 !h-8 !text-xs">
                  JD
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#EEF3F1] flex items-center gap-1.5">
                    <span>{scenario.attackerPersona}</span>
                    <span className="text-[10px] text-[#5FD3BF] font-mono">({scenario.platform})</span>
                  </h4>
                  <span className="text-[10px] text-[#A9B7BF] font-mono">Active 2m ago</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[#A9B7BF]">
                <Smartphone className="w-4 h-4" />
              </div>
            </div>

            {/* Context situation banner */}
            <div className="p-3 mb-3 rounded-lg bg-[#102236] border border-[#C9D3D9]/15 text-[11px] text-[#EEF3F1] flex items-start gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-[#EBC385] shrink-0 mt-0.5" />
              <span>{scenario.situation}</span>
            </div>

            {/* Chat Bubble Thread */}
            <div className="p-3.5 bg-[#0A1624] rounded-xl border border-[#C9D3D9]/15 space-y-3 min-h-[220px]">
              {scenario.incomingMessages.map((msg, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded bg-[#102236] border border-[#C9D3D9]/20 flex items-center justify-center text-[10px] font-mono font-semibold text-[#5FD3BF] shrink-0">
                    J
                  </div>
                  <div className="max-w-[85%] bg-[#102236] text-[#EEF3F1] p-3 rounded-xl rounded-tl-xs text-xs leading-relaxed border border-[#C9D3D9]/15">
                    {msg}
                  </div>
                </div>
              ))}

              {/* Simulated incoming SMS push notification */}
              <div className="mt-4 p-3 bg-[#081420] border border-[#5FD3BF]/40 rounded-lg text-xs space-y-1">
                <div className="flex items-center justify-between text-[#5FD3BF] font-mono font-semibold text-[11px]">
                  <span>📲 INCOMING SMS GATEWAY</span>
                  <span className="text-[#A9B7BF]">12:30 PM</span>
                </div>
                <p className="text-[#EEF3F1] font-mono text-[11px]">
                  &quot;Instagram code: <span className="text-[#EBC385] font-bold underline">829-410</span>. DO NOT share this. It can be used to reset your Instagram password.&quot;
                </p>
              </div>

              {/* User selected response in chat */}
              {selectedOptionId && (
                <div className="flex justify-end pt-2">
                  <div className="max-w-[85%] bg-[#2BB5A0] text-[#04211B] font-medium p-3 rounded-xl rounded-tr-xs text-xs">
                    {scenario.options.find(o => o.id === selectedOptionId)?.text}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Decision Deck & Psychological Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-xl bg-white border border-[#D9DDD3] shadow-xs space-y-4">
            <div>
              <span className="rm-kicker">Decision Evaluation Deck</span>
              <h3 className="text-base font-semibold text-[#0E2238]">
                Select Your Defensive Response
              </h3>
              <p className="text-xs text-[#4B5A66] mt-0.5">
                Attackers exploit social trust and artificial time pressure to bypass technical 2FA safeguards.
              </p>
            </div>

            <div className="space-y-2.5">
              {scenario.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer ${
                    selectedOptionId === option.id
                      ? option.isVulnerable
                        ? 'bg-red-50 border-red-400 text-red-950'
                        : 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : 'bg-[#F3F5F1] border-[#C7CDC0] text-[#16232F] hover:border-[#0E2238] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#0E2238] font-mono">Response Option</span>
                    <span className="text-[11px] font-mono text-[#4B5A66]">
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
                  ? 'bg-red-50 border-red-200 text-red-950'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}>
                <h5 className="font-bold mb-1 flex items-center gap-1.5">
                  {outcome.isVulnerable ? <AlertTriangle className="w-4 h-4 text-red-700" /> : <CheckCircle className="w-4 h-4 text-emerald-700" />}
                  <span>{outcome.isVulnerable ? 'Critical Defense Failure' : 'Impersonator Blocked & Verified'}</span>
                </h5>
                <p>{outcome.text}</p>
              </div>
            )}

            {/* Psychological Traps Explainer */}
            <div className="p-4 rounded-xl bg-[#F3F5F1] border border-[#D9DDD3] space-y-2 text-xs">
              <span className="font-semibold text-[#0E2238] block">Social Engineering Deconstruction:</span>
              <ul className="space-y-1.5 text-[#4B5A66] text-xs leading-relaxed">
                <li>• <strong className="text-[#16232F]">Urgency:</strong> &quot;2 votes away&quot; suppresses out-of-band verification.</li>
                <li>• <strong className="text-[#16232F]">Relational Coercion:</strong> Exploits peer loyalty to bypass SMS reset warnings.</li>
                <li>• <strong className="text-[#16232F]">Out-of-Band Verification:</strong> Always verify unusual requests via a direct voice call or in person.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
