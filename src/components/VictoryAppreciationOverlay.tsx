import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, Flame, ShieldCheck, Sparkles, X } from 'lucide-react';
import { playClickSound } from '../utils/audio';

export interface AppreciationEvent {
  id: number;
  xpGained: number;
  category: string;
  streakCount: number;
  praiseHeadline: string;
  praiseDetail: string;
  flagToken: string;
}

interface VictoryAppreciationOverlayProps {
  event: AppreciationEvent | null;
  playerName?: string;
  onDismiss: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  phishing: 'Email & Quishing Defense',
  network: 'Network & Wireless Airspace',
  socialEng: 'Social Engineering & Smishing Defense',
  passwords: 'Cryptographic Entropy',
  incidentResponse: 'Incident Response & Ransomware Containment',
};

export const VictoryAppreciationOverlay: React.FC<VictoryAppreciationOverlayProps> = ({
  event,
  playerName,
  onDismiss,
}) => {
  const [displayedXp, setDisplayedXp] = useState(0);

  useEffect(() => {
    if (!event) return;

    // Trigger celebratory confetti burst matching Postrix teal & gold palette
    try {
      confetti({
        particleCount: 65,
        spread: 68,
        origin: { y: 0.65 },
        colors: ['#2BB5A0', '#5FD3BF', '#D79A45', '#EBC385', '#EEF3F1'],
      });
    } catch {
      // Ignore if canvas-confetti fails in headless environment
    }

    // Smooth XP count-up animation
    setDisplayedXp(0);
    const target = event.xpGained;
    const duration = 500;
    const steps = 20;
    const stepTime = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep += 1;
      if (currentStep >= steps) {
        setDisplayedXp(target);
        clearInterval(interval);
      } else {
        setDisplayedXp(Math.round((target * currentStep) / steps));
      }
    }, stepTime);

    return () => clearInterval(interval);
  }, [event]);

  if (!event) return null;

  const domainLabel = CATEGORY_LABELS[event.category] || 'Cyber Defense Mastery';

  return (
    <div
      key={event.id}
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-2rem)] sm:w-auto animate-appreciation-pop"
    >
      <div className="p-5 rounded-2xl bg-[#081420] border-2 border-[#5FD3BF] shadow-2xl text-[#EEF3F1] space-y-3.5">
        {/* Top Row: Animated Emblem + Appreciation Praise + Close */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#2BB5A0] text-[#04211B] flex items-center justify-center shrink-0 shadow-lg animate-emblem-celebrate">
              <Award className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#5FD3BF] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#EBC385]" />
                <span>
                  {playerName
                    ? `Great Move, ${playerName}!`
                    : 'Correct Defensive Move!'}
                </span>
              </div>
              <h4 className="text-base font-bold text-[#EEF3F1] font-serif leading-snug mt-0.5">
                {event.praiseHeadline}
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onDismiss();
            }}
            aria-label="Close appreciation banner"
            className="p-1 rounded-lg text-[#A9B7BF] hover:text-[#EEF3F1] hover:bg-[#102236] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#A9B7BF] leading-relaxed">
          {event.praiseDetail}
        </p>

        {/* Animated XP, Streak & Flag Strip */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="p-2.5 rounded-xl bg-[#102236] border border-[#5FD3BF]/35 text-center animate-xp-float">
            <div className="text-[10px] font-mono text-[#A9B7BF] uppercase">XP Reward</div>
            <div className="text-base font-mono font-bold text-[#5FD3BF] tabular-nums">
              +{displayedXp} XP
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#102236] border border-[#EBC385]/35 text-center animate-xp-float">
            <div className="text-[10px] font-mono text-[#A9B7BF] uppercase">Move Streak</div>
            <div className="text-base font-mono font-bold text-[#EBC385] flex items-center justify-center gap-1 tabular-nums">
              <Flame className="w-4 h-4 text-[#EBC385]" />
              <span>{event.streakCount}x</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#102236] border border-[#C9D3D9]/20 text-center animate-xp-float">
            <div className="text-[10px] font-mono text-[#A9B7BF] uppercase">Posture Boost</div>
            <div className="text-base font-mono font-bold text-[#EEF3F1] flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#5FD3BF]" />
              <span>+8%</span>
            </div>
          </div>
        </div>

        {/* Captured Flag & Domain Mastery Footer */}
        <div className="pt-2.5 border-t border-[#C9D3D9]/15 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
          <span className="text-[#5FD3BF] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{domainLabel}</span>
          </span>
          <span className="px-2 py-0.5 rounded bg-[#0D1C2D] border border-[#5FD3BF]/40 text-[#EBC385] font-semibold">
            {event.flagToken}
          </span>
        </div>
      </div>
    </div>
  );
};
