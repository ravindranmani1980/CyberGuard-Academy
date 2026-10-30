import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';
import { UserStats, BreachIncident, SimulationType, PeerThreat } from './types';
import { loadUserStats, saveUserStats, loadBreachIncidents, saveBreachIncidents, calculateRankAndLevel } from './utils/storage';
import { playLevelUpSound, playBreachAlertSound, playClickSound, setSoundEnabled, getSoundEnabled } from './utils/audio';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SimulationHub } from './components/SimulationHub';
import { PeerThreatRadar } from './components/PeerThreatRadar';
import { LeaderboardView } from './components/LeaderboardView';
import { BreachModal } from './components/BreachModal';
import { PrivacyShieldModal } from './components/PrivacyShieldModal';
import { VictoryAppreciationOverlay, AppreciationEvent } from './components/VictoryAppreciationOverlay';
import { PlayerDrillEntryModal } from './components/PlayerDrillEntryModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { BADGES } from './data/badges';

const APPRECIATION_MESSAGES: Record<string, { headline: string; detail: string; flag: string }> = {
  phishing: {
    headline: 'Well Done! Phishing Threat Neutralized!',
    detail: 'Your header & link verification protected the network from credential harvesting.',
    flag: 'THM{PHISH-BLOCKED}',
  },
  network: {
    headline: 'Spot-On Move! Evil Twin MITM Blocked!',
    detail: 'You verified BSSID encryption and thwarted wireless packet interception.',
    flag: 'THM{AIRSPACE-SECURED}',
  },
  socialEng: {
    headline: 'Brilliant Defense! Impersonator Foiled!',
    detail: 'Out-of-Band verification stopped an urgent social engineering pretext.',
    flag: 'THM{THREAT-BLOCKED}',
  },
  passwords: {
    headline: 'Outstanding! High-Entropy Passphrase Forged!',
    detail: 'Your passphrase resists 350B-hash/sec offline GPU cracking clusters.',
    flag: 'THM{ENTROPY-VERIFIED}',
  },
  incidentResponse: {
    headline: 'Heroic Triage! Ransomware Contained in Time!',
    detail: 'Rapid network isolation and process termination saved local files.',
    flag: 'THM{THREAT-BLOCKED}',
  },
};

export default function App() {
  const [stats, setStats] = useState<UserStats>(() => loadUserStats());
  const [incidents, setIncidents] = useState<BreachIncident[]>(() => loadBreachIncidents());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulations' | 'radar' | 'leaderboard' | 'privacy'>('dashboard');
  const [currentSim, setCurrentSim] = useState<SimulationType>('phishing');

  // Modal, Audio & Appreciation states
  const [activeBreachIncident, setActiveBreachIncident] = useState<BreachIncident | null>(null);
  const [isBreachModalOpen, setIsBreachModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isDrillEntryModalOpen, setIsDrillEntryModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [muted, setMuted] = useState<boolean>(() => !getSoundEnabled());
  const [pendingSimType, setPendingSimType] = useState<SimulationType>('phishing');
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);
  const [appreciationEvent, setAppreciationEvent] = useState<AppreciationEvent | null>(null);
  const [correctMoveStreak, setCorrectMoveStreak] = useState<number>(0);

  const handleToggleSound = () => {
    setMuted(prev => {
      const nextMuted = !prev;
      setSoundEnabled(!nextMuted);
      if (!nextMuted) {
        playClickSound();
      }
      return nextMuted;
    });
  };

  // Sync to local client sandbox
  useEffect(() => {
    saveUserStats(stats);
  }, [stats]);

  useEffect(() => {
    saveBreachIncidents(incidents);
  }, [incidents]);

  // Handle immediate breach detection
  const handleBreach = (incident: BreachIncident) => {
    playBreachAlertSound();
    setCorrectMoveStreak(0);
    setAppreciationEvent(null);
    setActiveBreachIncident(incident);
    setIsBreachModalOpen(true);

    setIncidents(prev => [incident, ...prev]);

    setStats(prev => {
      const newScore = Math.max(20, prev.defenseScore - 4);
      const history = prev.sessionHistory ? [...prev.sessionHistory] : [];
      if (history.length > 0) {
        const last = history[history.length - 1];
        history[history.length - 1] = {
          ...last,
          score: newScore,
          breaches: last.breaches + 1,
        };
      }
      return {
        ...prev,
        defenseScore: newScore,
        breachesTriggered: prev.breachesTriggered + 1,
        sessionHistory: history,
      };
    });
  };

  // Handle successful drill or threat detection
  const handleSuccess = (xpGained: number, categoryKey: string, badgeIdToUnlock?: string) => {
    const nextStreak = correctMoveStreak + 1;
    setCorrectMoveStreak(nextStreak);

    const praiseInfo = APPRECIATION_MESSAGES[categoryKey] || APPRECIATION_MESSAGES.incidentResponse;
    setAppreciationEvent({
      id: Date.now(),
      xpGained,
      category: categoryKey,
      streakCount: nextStreak,
      praiseHeadline: praiseInfo.headline,
      praiseDetail: praiseInfo.detail,
      flagToken: praiseInfo.flag,
    });

    setStats(prev => {
      const oldRank = calculateRankAndLevel(prev.xp);
      const newXp = prev.xp + xpGained;
      const newRank = calculateRankAndLevel(newXp);

      if (newRank.level > oldRank.level) {
        playLevelUpSound();
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // Ignore
        }
        setToastMessage({
          title: `Rank Promoted: ${newRank.rankTitle}`,
          subtitle: `You reached Level ${newRank.level} in the Cyber Guardian League.`,
        });
      }

      const nextBadges = [...prev.unlockedBadgeIds];
      if (badgeIdToUnlock && !nextBadges.includes(badgeIdToUnlock)) {
        nextBadges.push(badgeIdToUnlock);
        const badge = BADGES.find(b => b.id === badgeIdToUnlock);
        if (badge) {
          setToastMessage({
            title: `Certification Unlocked: ${badge.title}`,
            subtitle: badge.description,
          });
        }
      }

      const currentMastery = prev.categoryMastery;
      const updatedMastery = { ...currentMastery };
      if (categoryKey in updatedMastery) {
        const k = categoryKey as keyof typeof currentMastery;
        updatedMastery[k] = Math.min(100, updatedMastery[k] + 8);
      }

      const newDefenseScore = Math.min(100, prev.defenseScore + 3);
      const history = prev.sessionHistory ? [...prev.sessionHistory] : [];
      if (history.length > 0) {
        const last = history[history.length - 1];
        history[history.length - 1] = {
          ...last,
          score: newDefenseScore,
          drills: last.drills + 1,
        };
      }

      return {
        ...prev,
        xp: newXp,
        level: newRank.level,
        rankTitle: newRank.rankTitle,
        defenseScore: newDefenseScore,
        simulationsCompleted: prev.simulationsCompleted + 1,
        unlockedBadgeIds: nextBadges,
        categoryMastery: updatedMastery,
        sessionHistory: history,
      };
    });
  };

  // Handle "Start Cyber Drill" button from header — opens game registration modal asking for Player Name
  const handleTriggerQuickDrill = () => {
    playClickSound();
    const simTypes: SimulationType[] = ['phishing', 'wifi', 'social_eng', 'smishing', 'password', 'ransomware'];
    const randomSim = simTypes[Math.floor(Math.random() * simTypes.length)];
    setPendingSimType(randomSim);
    setIsDrillEntryModalOpen(true);
  };

  // Launch specific simulation from dashboard card — ask for Player Name if not yet set, or open entry modal
  const handleLaunchSimulation = (simType: SimulationType) => {
    setPendingSimType(simType);
    setIsDrillEntryModalOpen(true);
  };

  // Confirm player name & enter selected drill
  const handleConfirmEnterDrill = (playerName: string, selectedSim: SimulationType) => {
    setStats(prev => ({
      ...prev,
      playerName,
    }));
    setCurrentSim(selectedSim);
    setIsDrillEntryModalOpen(false);
    setActiveTab('simulations');
    setToastMessage({
      title: `Welcome to the Arena, ${playerName}!`,
      subtitle: 'Cyber drill initialized. Inspect telemetry and make your defensive move.',
    });
  };

  // Handle top nav tab changes (prompt for player name if entering simulations for the first time)
  const handleChangeTab = (tab: 'dashboard' | 'simulations' | 'radar' | 'leaderboard' | 'privacy') => {
    if (tab === 'simulations' && !stats.playerName) {
      setPendingSimType(currentSim);
      setIsDrillEntryModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  // Verify peer threat
  const handleVerifyThreat = (threatId: string) => {
    if (!stats.verifiedThreatIds.includes(threatId)) {
      setStats(prev => ({
        ...prev,
        xp: prev.xp + 20,
        verifiedThreatIds: [...prev.verifiedThreatIds, threatId],
      }));
      setToastMessage({
        title: '+20 XP Earned',
        subtitle: 'Thank you for corroborating peer cyber threat intelligence.',
      });
    }
  };

  // Add new peer threat
  const handleAddThreat = (threat: PeerThreat) => {
    setStats(prev => ({
      ...prev,
      xp: prev.xp + 50,
      reportedThreatIds: [...prev.reportedThreatIds, threat.id],
    }));
    setToastMessage({
      title: '+50 XP Earned',
      subtitle: 'Your threat advisory was published anonymously to the peer radar.',
    });
  };

  // Add peer mitigation strategy comment
  const handleAddMitigationComment = () => {
    setStats(prev => {
      const nextBadges = prev.unlockedBadgeIds.includes('badge_peer_sentinel')
        ? prev.unlockedBadgeIds
        : [...prev.unlockedBadgeIds, 'badge_peer_sentinel'];
      const newXp = prev.xp + 15;
      const newRank = calculateRankAndLevel(newXp);
      return {
        ...prev,
        xp: newXp,
        level: newRank.level,
        rankTitle: newRank.rankTitle,
        unlockedBadgeIds: nextBadges,
      };
    });
    setToastMessage({
      title: '+15 XP Earned',
      subtitle: 'Your mitigation strategy was added to the community defense runbook.',
    });
  };

  // Toggle threat bookmark in personal watchlist
  const handleToggleBookmark = (threatId: string) => {
    const currentBookmarks = stats.bookmarkedThreatIds || [];
    const isCurrentlyBookmarked = currentBookmarks.includes(threatId);
    const updatedBookmarks = isCurrentlyBookmarked
      ? currentBookmarks.filter((id) => id !== threatId)
      : [threatId, ...currentBookmarks];

    setStats((prev) => ({
      ...prev,
      bookmarkedThreatIds: updatedBookmarks,
    }));

    setToastMessage({
      title: isCurrentlyBookmarked ? 'Removed from My Watchlist' : 'Saved to My Watchlist',
      subtitle: isCurrentlyBookmarked
        ? 'The threat advisory was removed from your personal watchlist.'
        : 'Threat advisory pinned to My Watchlist for future reference and review.',
    });
  };

  // Data purged from Privacy Shredder
  const handleDataPurged = () => {
    setStats(loadUserStats());
    setIncidents([]);
    setToastMessage({
      title: 'Memory Shredded Clean',
      subtitle: 'All client sandboxed events and metrics have been completely erased.',
    });
  };

  // Open breach modal from dashboard post-mortem click
  const handleOpenBreachDetails = (incident: BreachIncident) => {
    setActiveBreachIncident(incident);
    setIsBreachModalOpen(true);
  };

  // Auto-dismiss toast after 4s
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  // Auto-dismiss appreciation overlay after 5.5s
  useEffect(() => {
    if (appreciationEvent) {
      const t = setTimeout(() => setAppreciationEvent(null), 5500);
      return () => clearTimeout(t);
    }
  }, [appreciationEvent]);

  // Execute shortcut command by key
  const executeShortcutAction = (lowerKey: string) => {
    if (lowerKey === 'd') {
      playClickSound();
      setActiveTab('dashboard');
    } else if (lowerKey === 's') {
      playClickSound();
      handleChangeTab('simulations');
    } else if (lowerKey === 'r') {
      playClickSound();
      setActiveTab('radar');
    } else if (lowerKey === 'l') {
      playClickSound();
      setActiveTab('leaderboard');
    } else if (lowerKey === 'p') {
      playClickSound();
      setIsPrivacyModalOpen(prev => !prev);
    } else if (lowerKey === 'c') {
      handleTriggerQuickDrill();
    } else if (lowerKey === 'm') {
      handleToggleSound();
    } else if (lowerKey === '?') {
      playClickSound();
      setIsShortcutsModalOpen(prev => !prev);
    }
  };

  // Global keyboard shortcuts listener for power users
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Allow Escape to close any open modal or overlay
      if (e.key === 'Escape') {
        if (isShortcutsModalOpen) {
          setIsShortcutsModalOpen(false);
          return;
        }
        if (isDrillEntryModalOpen) {
          setIsDrillEntryModalOpen(false);
          return;
        }
        if (isPrivacyModalOpen) {
          setIsPrivacyModalOpen(false);
          return;
        }
        if (isBreachModalOpen) {
          setIsBreachModalOpen(false);
          return;
        }
        if (appreciationEvent) {
          setAppreciationEvent(null);
          return;
        }
      }

      // Ignore shortcuts when typing in inputs, textareas, selects, or contentEditable elements
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Ignore when Ctrl, Meta, or Alt modifiers are held
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // Toggle shortcuts help modal on '?'
      if (e.key === '?') {
        e.preventDefault();
        playClickSound();
        setIsShortcutsModalOpen(prev => !prev);
        return;
      }

      // Do not trigger view jumps while a modal dialog is open
      if (
        isDrillEntryModalOpen ||
        isPrivacyModalOpen ||
        isBreachModalOpen ||
        isShortcutsModalOpen
      ) {
        return;
      }

      const lower = e.key.toLowerCase();
      if (['d', 's', 'r', 'l', 'p', 'c', 'm'].includes(lower)) {
        e.preventDefault();
        executeShortcutAction(lower);
        return;
      }

      // Numeric keys 1-6 switch active simulation module when inside Interactive Drills
      if (activeTab === 'simulations' && ['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        e.preventDefault();
        playClickSound();
        const orderedModules: SimulationType[] = [
          'phishing',
          'wifi',
          'social_eng',
          'password',
          'ransomware',
          'smishing',
        ];
        const idx = parseInt(e.key, 10) - 1;
        if (orderedModules[idx]) {
          setCurrentSim(orderedModules[idx]);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F5F1] text-[#16232F]">
      {/* Postrix Site Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleChangeTab}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        onTriggerQuickDrill={handleTriggerQuickDrill}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        muted={muted}
        onToggleSound={handleToggleSound}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            stats={stats}
            incidents={incidents}
            onLaunchSimulation={handleLaunchSimulation}
            onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
            onOpenBreachDetails={handleOpenBreachDetails}
          />
        )}

        {activeTab === 'simulations' && (
          <SimulationHub
            initialSim={currentSim}
            stats={stats}
            onOpenPlayerEntry={(simType) => {
              setPendingSimType(simType || currentSim);
              setIsDrillEntryModalOpen(true);
            }}
            onBreach={handleBreach}
            onSuccess={handleSuccess}
          />
        )}

        {activeTab === 'radar' && (
          <PeerThreatRadar
            bookmarkedThreatIds={stats.bookmarkedThreatIds || []}
            onToggleBookmark={handleToggleBookmark}
            onVerifyThreat={handleVerifyThreat}
            onAddThreat={handleAddThreat}
            onAddMitigationComment={handleAddMitigationComment}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            stats={stats}
          />
        )}
      </main>

      {/* Game Player Registration & Cyber Drill Mission Entry Modal */}
      <PlayerDrillEntryModal
        isOpen={isDrillEntryModalOpen}
        initialPlayerName={stats.playerName}
        initialSimType={pendingSimType}
        onClose={() => setIsDrillEntryModalOpen(false)}
        onConfirmEnterDrill={handleConfirmEnterDrill}
      />

      {/* Global Power-User Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
        onTriggerShortcut={executeShortcutAction}
      />

      {/* Immediate Security Breach Alert Modal */}
      <BreachModal
        isOpen={isBreachModalOpen}
        incident={activeBreachIncident}
        onClose={() => setIsBreachModalOpen(false)}
        onRetry={() => {
          setIsBreachModalOpen(false);
          setActiveTab('simulations');
        }}
      />

      {/* Zero-Data Privacy & Memory Shredder Modal */}
      <PrivacyShieldModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        stats={stats}
        incidents={incidents}
        onDataPurged={handleDataPurged}
        onUnlockBadge={(badgeId) => {
          if (!stats.unlockedBadgeIds.includes(badgeId)) {
            setStats(prev => ({
              ...prev,
              unlockedBadgeIds: [...prev.unlockedBadgeIds, badgeId],
              xp: prev.xp + 80,
            }));
          }
        }}
      />

      {/* Celebratory Player Appreciation Animation Overlay on Correct Move */}
      <VictoryAppreciationOverlay
        event={appreciationEvent}
        playerName={stats.playerName}
        onDismiss={() => setAppreciationEvent(null)}
      />

      {/* Dynamic Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#081420] border border-[#3E6E86]/60 p-4 rounded-xl shadow-2xl flex items-start gap-3 max-w-sm text-[#EEF3F1]">
          <div className="rm-mono-mark !w-8 !h-8 !text-xs shrink-0">
            <Sparkles className="w-4 h-4 text-[#062019]" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[#EEF3F1]">{toastMessage.title}</h4>
            <p className="text-xs text-[#A9B7BF] mt-0.5">{toastMessage.subtitle}</p>
          </div>
        </div>
      )}

      {/* Postrix Footer matching apps.ravindran.in/postrix/app/ */}
      <footer className="bg-[#081420] text-[#B9C4CC] border-t border-[#3E6E86]/35 px-6 py-6 mt-auto">
        <div className="max-w-[1440px] mx-auto space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="rm-mono-mark !w-6 !h-6 !text-[11px]" aria-hidden="true">
                RM
              </span>
              <span>
                <strong className="font-serif text-sm font-semibold text-[#F3F5F1]">
                  Maniq <span className="text-[#D79A45]">Threat Guard</span>
                </strong>{' '}
                — Interactive Cyber Defense Posture &amp; Threat Simulation Platform
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span>
                Author:{' '}
                <a
                  href="https://ravindran.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#5FD3BF] hover:underline font-medium"
                >
                  Mani Ravindran
                </a>{' '}
                (
                <a
                  href="https://ravindran.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[#EBC385] hover:underline"
                >
                  ravindran.in
                </a>
                )
              </span>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsShortcutsModalOpen(true);
                }}
                className="text-[#C9D3D9] hover:text-[#5FD3BF] transition-colors cursor-pointer font-mono"
              >
                Keyboard Shortcuts [?]
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setIsPrivacyModalOpen(true);
                }}
                className="text-[#C9D3D9] hover:text-[#5FD3BF] transition-colors cursor-pointer font-mono"
              >
                Zero-Data Governance (GDPR/COPPA)
              </button>
            </div>
          </div>

          {/* Explicit Privacy & No-Advertisement Disclaimer */}
          <div className="pt-3 border-t border-[#3E6E86]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-[#A9B7BF]">
            <span>
              <strong className="text-[#EBC385]">Disclaimer:</strong> Maniq Threat Guard will not store any personal records on external servers and will never send advertisement or promotional emails.
            </span>
            <span className="text-[#5FD3BF]">100% Client-Side Sandbox · Zero Sign-In Required</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
