import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Smartphone, ChevronRight } from 'lucide-react';
import { SOCIAL_ENG_SCENARIOS, SocialEngScenario, DialogueOption } from '../../data/scenarios';
import { BreachIncident } from '../../types';
import { playClickSound, playSuccessSound, playBreachAlertSound } from '../../utils/audio';

interface SocialEngSimProps {
  onBreach: (incident: BreachIncident) => void;
  onSuccess: (xp: number, category: string, badgeId?: string) => void;
}

export const SocialEngSim: React.FC<SocialEngSimProps> = ({ onBreach, onSuccess }) => {
  const [scenarioIdx, setScenarioIdx] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<{ isVulnerable: boolean; text: string } | null>(null);

  const scenario: SocialEngScenario = SOCIAL_ENG_SCENARIOS[scenarioIdx];

  const handleSelectScenario = (index: number) => {
    playClickSound();
    setScenarioIdx(index);
    setSelectedOptionId(null);
    setOutcome(null);
  };

  const handleSelectOption = (option: DialogueOption) => {
    playClickSound();
    setSelectedOptionId(option.id);

    if (option.isVulnerable) {
      playBreachAlertSound();
      setOutcome({ isVulnerable: true, text: option.responseMessage });
      const incident: BreachIncident = {
        id: `inc-social-${Date.now()}`,
        timestamp: 'Just now',
        scenarioTitle: `${scenario.attackTechnique} (${scenario.platform})`,
        category: 'Social Engineering & Smishing Pretexting',
        attackerTechnique: scenario.attackTechnique,
        mitreRef: scenario.mitreCode,
        userMistake: scenario.forensicDebrief.userMistake,
        redFlagsMissed: scenario.forensicDebrief.redFlagsMissed,
        actionableTips: scenario.forensicDebrief.actionableTips,
        recoverySteps: [
          'Contact the impersonated person or manager directly via a verified voice call or corporate directory channel.',
          'Never wire emergency funds, forward OTP codes, or transmit company financial details over SMS or DM.',
          'Report the phone number or hijacked handle to carrier spam (7726) or internal Security Operations.',
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

  const handleNextScenario = () => {
    handleSelectScenario((scenarioIdx + 1) % SOCIAL_ENG_SCENARIOS.length);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Concept Header & Scenario Switcher */}
      <div className="p-5 rounded-xl bg-white border border-[#D9DDD3] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="rm-kicker">
              MOD-03 / Social Engineering, DM &amp; Spam Text Pretexting Defense
            </span>
            <h2 className="text-lg font-semibold text-[#0E2238]">
              {scenario.attackTechnique}
            </h2>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 bg-[#F3F5F1] hover:bg-[#E9ECE6] text-[#0E2238] border border-[#C7CDC0] rounded-lg text-xs font-mono font-medium cursor-pointer"
            >
              Reset Scenario
            </button>
            <button
              type="button"
              onClick={handleNextScenario}
              className="px-3.5 py-2 bg-[#0E2238] hover:bg-[#081420] text-[#F3F5F1] rounded-lg text-xs font-mono font-medium cursor-pointer flex items-center gap-1"
            >
              <span>Next Scenario</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#5FD3BF]" />
            </button>
          </div>
        </div>

        {/* Scenario Selector Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-3 border-t border-[#D9DDD3]">
          {SOCIAL_ENG_SCENARIOS.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectScenario(idx)}
              className={`p-3 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                idx === scenarioIdx
                  ? 'bg-[#0E2238] text-[#EEF3F1] border-[#0E2238]'
                  : 'bg-[#F3F5F1] hover:bg-white text-[#16232F] border-[#C7CDC0]'
              }`}
            >
              <div className="text-[10px] font-mono opacity-80 mb-0.5">
                SCENARIO 0{idx + 1} · {item.platform}
              </div>
              <div className="font-semibold line-clamp-1">{item.attackerPersona}</div>
            </button>
          ))}
        </div>
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
                  {scenario.platform === 'SMS Text' ? 'SMS' : 'DM'}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#EEF3F1] flex items-center gap-1.5">
                    <span>{scenario.attackerPersona}</span>
                    <span className="text-[10px] text-[#5FD3BF] font-mono">({scenario.platform})</span>
                  </h4>
                  <span className="text-[10px] text-[#A9B7BF] font-mono">Active Now</span>
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
                    !
                  </div>
                  <div className="max-w-[85%] bg-[#102236] text-[#EEF3F1] p-3 rounded-xl rounded-tl-xs text-xs leading-relaxed border border-[#C9D3D9]/15">
                    {msg}
                  </div>
                </div>
              ))}

              {/* Simulated incoming SMS push notification / carrier telemetry */}
              {scenario.smsBannerText && (
                <div className="mt-4 p-3 bg-[#081420] border border-[#5FD3BF]/40 rounded-lg text-xs space-y-1">
                  <div className="flex items-center justify-between text-[#5FD3BF] font-mono font-semibold text-[11px]">
                    <span>📲 TELEMETRY &amp; GATEWAY NOTICE</span>
                    <span className="text-[#A9B7BF]">LIVE</span>
                  </div>
                  <p className="text-[#EEF3F1] font-mono text-[11px]">
                    {scenario.smsBannerText}
                  </p>
                </div>
              )}

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
                Attackers exploit social trust, executive authority, and artificial time pressure to bypass security controls.
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
              <div className={`p-4 rounded-xl border text-xs leading-relaxed animate-appreciation-pop ${
                outcome.isVulnerable
                  ? 'bg-red-50 border-red-200 text-red-950'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}>
                <h5 className="font-bold mb-1 flex items-center gap-1.5">
                  {outcome.isVulnerable ? <AlertTriangle className="w-4 h-4 text-red-700" /> : <CheckCircle className="w-4 h-4 text-emerald-700 animate-emblem-celebrate" />}
                  <span>{outcome.isVulnerable ? 'Critical Defense Failure' : 'Great Move! Impersonator Blocked & Verified'}</span>
                </h5>
                <p>{outcome.text}</p>
              </div>
            )}

            {/* Psychological Traps Explainer */}
            <div className="p-4 rounded-xl bg-[#F3F5F1] border border-[#D9DDD3] space-y-2 text-xs">
              <span className="font-semibold text-[#0E2238] block">Actionable Defense Rules:</span>
              <ul className="space-y-1.5 text-[#4B5A66] text-xs leading-relaxed">
                {scenario.forensicDebrief.actionableTips.map((tip, idx) => (
                  <li key={idx}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
