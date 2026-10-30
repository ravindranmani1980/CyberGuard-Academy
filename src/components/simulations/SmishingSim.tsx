import React, { useState } from 'react';
import {
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Search,
  ShieldCheck,
  Flame,
  ChevronRight,
  Radio,
} from 'lucide-react';
import { SMISHING_SCENARIOS, SmishingScenario, DialogueOption } from '../../data/scenarios';
import { BreachIncident } from '../../types';
import { playClickSound, playSuccessSound, playBreachAlertSound } from '../../utils/audio';

interface SmishingSimProps {
  onBreach: (incident: BreachIncident) => void;
  onSuccess: (xp: number, category: string, badgeId?: string) => void;
}

export const SmishingSim: React.FC<SmishingSimProps> = ({ onBreach, onSuccess }) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [flaggedClueIds, setFlaggedClueIds] = useState<string[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [outcome, setOutcome] = useState<{ isVulnerable: boolean; text: string } | null>(null);
  const [completedScenarioIds, setCompletedScenarioIds] = useState<string[]>([]);
  const [streakCount, setStreakCount] = useState<number>(0);

  const scenario: SmishingScenario = SMISHING_SCENARIOS[activeIndex];

  const handleSwitchScenario = (index: number) => {
    playClickSound();
    setActiveIndex(index);
    setFlaggedClueIds([]);
    setSelectedOptionId(null);
    setOutcome(null);
  };

  const handleToggleClue = (clueId: string) => {
    playClickSound();
    if (flaggedClueIds.includes(clueId)) return;
    playSuccessSound();
    setFlaggedClueIds((prev) => [...prev, clueId]);
  };

  const handleSelectOption = (option: DialogueOption) => {
    playClickSound();
    setSelectedOptionId(option.id);

    if (option.isVulnerable) {
      playBreachAlertSound();
      setStreakCount(0);
      setOutcome({ isVulnerable: true, text: option.responseMessage });

      const incident: BreachIncident = {
        id: `inc-smish-${Date.now()}`,
        timestamp: 'Just now',
        scenarioTitle: scenario.title,
        category: scenario.categoryLabel,
        attackerTechnique: `${scenario.pretextType} (${scenario.mitreCode})`,
        mitreRef: scenario.mitreCode,
        userMistake: scenario.forensicDebrief.userMistake,
        redFlagsMissed: scenario.forensicDebrief.redFlagsMissed,
        actionableTips: scenario.forensicDebrief.actionableTips,
        recoverySteps: scenario.forensicDebrief.recoverySteps,
        retested: false,
      };
      onBreach(incident);
    } else {
      playSuccessSound();
      const clueBonusXp = flaggedClueIds.length * 15;
      const totalXp = option.xpDelta + clueBonusXp;
      setStreakCount((prev) => prev + 1);
      if (!completedScenarioIds.includes(scenario.id)) {
        setCompletedScenarioIds((prev) => [...prev, scenario.id]);
      }
      setOutcome({
        isVulnerable: false,
        text: `${option.responseMessage} (+${option.xpDelta} Base XP + ${clueBonusXp} Forensic Clue Bonus XP)`,
      });
      onSuccess(totalXp, 'socialEng', 'badge_social_fortress');
    }
  };

  const handleNextDrill = () => {
    const nextIdx = (activeIndex + 1) % SMISHING_SCENARIOS.length;
    handleSwitchScenario(nextIdx);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Gaming Telemetry Bar */}
      <div className="p-5 rounded-xl bg-white border border-[#D9DDD3] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D9DDD3]">
          <div>
            <span className="rm-kicker">
              MOD-06 / Interactive Spam SMS &amp; Executive Pretexting Arcade
            </span>
            <h2 className="text-lg font-semibold text-[#0E2238]">
              Smishing, Emergency Money Traps &amp; Boss/Manager Financial Pretexting Drills
            </h2>
            <p className="text-xs text-[#4B5A66] mt-0.5">
              Inspect incoming spam text messages, flag forensic indicators for bonus XP, and execute verified out-of-band defense protocols.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="px-3 py-1.5 rounded-lg bg-[#081420] text-[#EEF3F1] border border-[#3E6E86]/50 text-xs font-mono flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#EBC385]" />
              <span>Streak: {streakCount}x</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-[#F3F5F1] text-[#0E2238] border border-[#C7CDC0] text-xs font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2BB5A0]" />
              <span>
                Drills Cleared: {completedScenarioIds.length}/{SMISHING_SCENARIOS.length}
              </span>
            </div>
          </div>
        </div>

        {/* Scenario Mission Selector Pills */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SMISHING_SCENARIOS.map((item, idx) => {
            const isActive = idx === activeIndex;
            const isCompleted = completedScenarioIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSwitchScenario(idx)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isActive
                    ? 'bg-[#0E2238] text-[#EEF3F1] border-[#0E2238] shadow-xs'
                    : 'bg-[#F3F5F1] hover:bg-white text-[#16232F] border-[#C7CDC0]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                  <span className={isActive ? 'text-[#5FD3BF]' : 'text-[#4B5A66]'}>
                    SMS DRILL 0{idx + 1} · {item.mitreCode}
                  </span>
                  {isCompleted && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px]">
                      CLEARED
                    </span>
                  )}
                </div>
                <div
                  className={`text-xs font-semibold leading-snug ${
                    isActive ? 'text-[#EEF3F1]' : 'text-[#0E2238]'
                  }`}
                >
                  {item.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Column Gaming Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 6 Columns: Interactive Smartphone SMS Inspector */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-[#081420] border border-[#3E6E86]/50 rounded-2xl p-5 shadow-xl text-[#EEF3F1] space-y-4">
            {/* Phone Carrier & Caller ID Header */}
            <div className="flex items-center justify-between p-3.5 bg-[#0D1C2D] rounded-xl border border-[#C9D3D9]/15">
              <div className="flex items-center gap-3">
                <div className="rm-mono-mark !w-9 !h-9 !text-xs shrink-0">
                  SMS
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#EEF3F1]">
                    {scenario.senderDisplay}
                  </div>
                  <div className="text-[11px] font-mono text-[#5FD3BF]">
                    Sender ID: {scenario.senderNumber}
                  </div>
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-[#A9B7BF]">
                <div>{scenario.timestamp}</div>
                <div className="text-[#EBC385]">{scenario.urgencyLevel} Risk</div>
              </div>
            </div>

            {/* Carrier Gateway Forensic Telemetry Banner */}
            <div className="p-3 rounded-lg bg-[#102236] border border-[#EBC385]/35 text-[11px] font-mono flex items-start gap-2">
              <Radio className="w-3.5 h-3.5 text-[#EBC385] shrink-0 mt-0.5" />
              <div>
                <span className="text-[#EBC385] font-semibold">GATEWAY TELEMETRY: </span>
                <span className="text-[#EEF3F1]">{scenario.carrierGateway}</span>
              </div>
            </div>

            {/* Incoming Spam Text Message Stream */}
            <div className="p-4 bg-[#0A1624] rounded-xl border border-[#C9D3D9]/15 space-y-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#A9B7BF] text-center pb-1 border-b border-[#C9D3D9]/10">
                Unverified SMS Text Message Thread
              </div>

              {scenario.smsMessages.map((msg, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded bg-[#102236] border border-[#3E6E86]/40 flex items-center justify-center text-[10px] font-mono font-bold text-[#EBC385] shrink-0 mt-0.5">
                    !
                  </div>
                  <div className="bg-[#102236] text-[#EEF3F1] p-3.5 rounded-xl rounded-tl-xs text-xs leading-relaxed border border-[#C9D3D9]/15">
                    {msg}
                  </div>
                </div>
              ))}

              {/* Selected Defender Reply */}
              {selectedOptionId && (
                <div className="flex justify-end pt-2">
                  <div className="max-w-[85%] bg-[#2BB5A0] text-[#04211B] font-medium p-3 rounded-xl rounded-tr-xs text-xs">
                    {scenario.options.find((o) => o.id === selectedOptionId)?.text}
                  </div>
                </div>
              )}
            </div>

            {/* Step 1 Mini-Game: Tap to Flag Red-Flag Clues (+15 XP each) */}
            <div className="p-4 rounded-xl bg-[#0D1C2D] border border-[#3E6E86]/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#5FD3BF] flex items-center gap-1.5 font-mono">
                  <Search className="w-3.5 h-3.5" />
                  <span>STEP 1: SPOT &amp; FLAG SMS RED FLAGS (+15 XP EACH)</span>
                </span>
                <span className="text-[11px] font-mono text-[#EBC385]">
                  {flaggedClueIds.length}/{scenario.clues.length} Flagged
                </span>
              </div>

              <div className="space-y-2">
                {scenario.clues.map((clue) => {
                  const isFlagged = flaggedClueIds.includes(clue.id);
                  return (
                    <button
                      key={clue.id}
                      type="button"
                      onClick={() => handleToggleClue(clue.id)}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-all cursor-pointer ${
                        isFlagged
                          ? 'bg-[#102236] border-[#5FD3BF] text-[#EEF3F1]'
                          : 'bg-[#081420] hover:bg-[#102236] border-[#C9D3D9]/20 text-[#A9B7BF]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                        <span className="font-semibold text-[#EEF3F1]">
                          {isFlagged ? '✓ FLAGGED: ' : '🔍 TAP TO INSPECT: '}
                          {clue.label}
                        </span>
                        <span className={isFlagged ? 'text-[#5FD3BF]' : 'text-[#EBC385]'}>
                          {isFlagged ? '+15 XP Ready' : 'Inspect Clue'}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#EBC385] mt-1">
                        {clue.excerpt}
                      </div>
                      {isFlagged && (
                        <p className="text-[11px] text-[#A9B7BF] mt-1.5 pt-1.5 border-t border-[#C9D3D9]/15 leading-relaxed">
                          {clue.explanation}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right 6 Columns: Step 2 Defensive Action Deck & Debrief */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-xl bg-white border border-[#D9DDD3] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9DDD3] pb-3">
              <div>
                <span className="rm-kicker">Step 2 / Execute Defensive Response</span>
                <h3 className="text-base font-semibold text-[#0E2238]">
                  {scenario.title}
                </h3>
                <p className="text-xs text-[#4B5A66] mt-0.5">
                  Pretext Vector: <strong className="text-[#0E2238]">{scenario.pretextType}</strong>
                </p>
              </div>
              <Smartphone className="w-5 h-5 text-[#0E2238] shrink-0" />
            </div>

            <div className="space-y-2.5">
              {scenario.options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelectOption(option)}
                  className={`w-full text-left p-4 rounded-xl border text-xs leading-relaxed transition-all cursor-pointer ${
                    selectedOptionId === option.id
                      ? option.isVulnerable
                        ? 'bg-red-50 border-red-400 text-red-950'
                        : 'bg-emerald-50 border-emerald-400 text-emerald-950'
                      : 'bg-[#F3F5F1] border-[#C7CDC0] text-[#16232F] hover:border-[#0E2238] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#0E2238] font-mono">
                      Defensive Action Option
                    </span>
                    <span className="text-[11px] font-mono text-[#4B5A66]">
                      {option.xpDelta > 0 ? `+${option.xpDelta} XP` : `${option.xpDelta} XP`}
                    </span>
                  </div>
                  <p>{option.text}</p>
                </button>
              ))}
            </div>

            {/* Outcome Banner & Next Scenario Button */}
            {outcome && (
              <div
                className={`p-4 rounded-xl border text-xs leading-relaxed space-y-3 ${
                  outcome.isVulnerable
                    ? 'bg-red-50 border-red-200 text-red-950'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}
              >
                <div>
                  <h5 className="font-bold mb-1 flex items-center gap-1.5">
                    {outcome.isVulnerable ? (
                      <AlertTriangle className="w-4 h-4 text-red-700" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-700" />
                    )}
                    <span>
                      {outcome.isVulnerable
                        ? 'Smishing Trap Triggered — Security Breach'
                        : 'Spam Text Neutralized & Verified Out-of-Band'}
                    </span>
                  </h5>
                  <p>{outcome.text}</p>
                </div>

                <div className="pt-2 border-t border-current/15 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleNextDrill}
                    className="px-4 py-2 bg-[#0E2238] hover:bg-[#081420] text-[#F3F5F1] rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Next Spam SMS Drill</span>
                    <ChevronRight className="w-4 h-4 text-[#5FD3BF]" />
                  </button>
                </div>
              </div>
            )}

            {/* Golden Rules for SMS Pretexting Defense */}
            <div className="p-4 rounded-xl bg-[#F3F5F1] border border-[#D9DDD3] space-y-2 text-xs">
              <span className="font-semibold text-[#0E2238] block">
                Actionable Smishing &amp; Pretexting Defense Blueprint:
              </span>
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
