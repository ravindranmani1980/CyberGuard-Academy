import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles } from 'lucide-react';
import { UserStats, BreachIncident, SimulationType, PeerThreat } from './types';
import { loadUserStats, saveUserStats, loadBreachIncidents, saveBreachIncidents, calculateRankAndLevel } from './utils/storage';
import { playLevelUpSound, playBreachAlertSound, playClickSound } from './utils/audio';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { SimulationHub } from './components/SimulationHub';
import { PeerThreatRadar } from './components/PeerThreatRadar';
import { LeaderboardView } from './components/LeaderboardView';
import { BreachModal } from './components/BreachModal';
import { PrivacyShieldModal } from './components/PrivacyShieldModal';
import { BADGES } from './data/badges';

export default function App() {
  const [stats, setStats] = useState<UserStats>(() => loadUserStats());
  const [incidents, setIncidents] = useState<BreachIncident[]>(() => loadBreachIncidents());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'simulations' | 'radar' | 'leaderboard' | 'privacy'>('dashboard');
  const [currentSim, setCurrentSim] = useState<SimulationType>('phishing');

  // Modal states
  const [activeBreachIncident, setActiveBreachIncident] = useState<BreachIncident | null>(null);
  const [isBreachModalOpen, setIsBreachModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);

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

  // Handle quick drill from header button
  const handleTriggerQuickDrill = () => {
    playClickSound();
    const simTypes: SimulationType[] = ['phishing', 'wifi', 'social_eng', 'password', 'ransomware'];
    const randomSim = simTypes[Math.floor(Math.random() * simTypes.length)];
    setCurrentSim(randomSim);
    setActiveTab('simulations');
  };

  // Launch specific simulation from dashboard card
  const handleLaunchSimulation = (simType: SimulationType) => {
    setCurrentSim(simType);
    setActiveTab('simulations');
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

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F5F1] text-[#16232F]">
      {/* Postrix Site Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        onTriggerQuickDrill={handleTriggerQuickDrill}
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
            onBreach={handleBreach}
            onSuccess={handleSuccess}
          />
        )}

        {activeTab === 'radar' && (
          <PeerThreatRadar
            onVerifyThreat={handleVerifyThreat}
            onAddThreat={handleAddThreat}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            stats={stats}
          />
        )}
      </main>

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

      {/* Dynamic Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#081420] border border-[#3E6E86]/60 p-4 rounded-xl shadow-2xl flex items-start gap-3 max-w-sm text-[#EEF3F1]">
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
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="rm-mono-mark !w-6 !h-6 !text-[11px]" aria-hidden="true">
              RM
            </span>
            <span>
              <strong className="font-serif text-sm font-semibold text-[#F3F5F1]">
                Threat <span className="text-[#D79A45]">Guard</span>
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
                setIsPrivacyModalOpen(true);
              }}
              className="text-[#C9D3D9] hover:text-[#5FD3BF] transition-colors cursor-pointer font-mono"
            >
              Zero-Data Governance (GDPR/COPPA)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
