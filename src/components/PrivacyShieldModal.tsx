import React, { useState } from 'react';
import { Lock, Trash2, Download, CheckCircle2, X, Cpu } from 'lucide-react';
import { UserStats, BreachIncident } from '../types';
import { shredAllData } from '../utils/storage';
import { playClickSound, playSuccessSound } from '../utils/audio';

interface PrivacyShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: UserStats;
  incidents: BreachIncident[];
  onDataPurged: () => void;
  onUnlockBadge: (badgeId: string) => void;
}

export const PrivacyShieldModal: React.FC<PrivacyShieldModalProps> = ({
  isOpen,
  onClose,
  stats,
  incidents,
  onDataPurged,
  onUnlockBadge,
}) => {
  const [shredConfirmed, setShredConfirmed] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleShred = () => {
    playClickSound();
    shredAllData();
    setShredConfirmed(true);
    playSuccessSound();
    onUnlockBadge('badge_zero_privacy');
    setTimeout(() => {
      onDataPurged();
      onClose();
    }, 1200);
  };

  const handleExportJson = () => {
    playClickSound();
    setIsExporting(true);
    const auditData = {
      exportTimestamp: new Date().toISOString(),
      complianceStandard: 'GDPR / CCPA / COPPA Zero-Knowledge',
      userStats: stats,
      incidentHistory: incidents,
    };

    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `threatguard-audit-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
        className="w-full max-w-2xl bg-[#F3F5F1] border border-[#C7CDC0] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top Header */}
        <div className="bg-[#081420] border-b border-[#3E6E86]/40 px-6 py-4 flex items-center justify-between text-[#EEF3F1]">
          <div className="flex items-center gap-3">
            <div className="rm-mono-mark !w-9 !h-9 !text-xs">
              RM
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-[#5FD3BF] uppercase tracking-wider">
                <span>Zero-Data Governance</span>
                <span aria-hidden="true">·</span>
                <span>Client Sandbox Architecture</span>
              </div>
              <h2 id="privacy-modal-title" className="text-lg font-semibold text-[#EEF3F1] tracking-tight font-serif">
                Data Privacy Standards &amp; Zero-Retention Assurance
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 text-[#A9B7BF] hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-[#16232F]">
          {/* Real-time memory sandbox audit */}
          <div className="p-4 rounded-xl bg-[#081420] border border-[#3E6E86]/40 space-y-2.5 text-[#EEF3F1]">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#EEF3F1] flex items-center gap-1.5 font-mono">
                <Cpu className="w-4 h-4 text-[#5FD3BF]" />
                <span>Active Client Sandbox Telemetry</span>
              </span>
              <span className="font-mono text-[#5FD3BF] text-[11px]">ZERO REMOTE UPLOADS</span>
            </div>
            <p className="text-[#A9B7BF] text-xs leading-relaxed">
              ThreatGuard is engineered so that zero personal information, keystrokes, candidate passwords, or device identifiers are ever transmitted to or persisted on remote servers.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-[#C9D3D9]/15 font-mono text-[11px]">
              <div>
                <span className="text-[#A9B7BF] block">External DB:</span>
                <span className="text-[#EEF3F1]">None (0 bytes)</span>
              </div>
              <div>
                <span className="text-[#A9B7BF] block">Tracking Cookies:</span>
                <span className="text-[#EEF3F1]">Zero (0)</span>
              </div>
              <div>
                <span className="text-[#A9B7BF] block">Session State:</span>
                <span className="text-[#5FD3BF]">Local Browser RAM</span>
              </div>
            </div>
          </div>

          {/* Three Major Privacy Compliance Pillars */}
          <div className="space-y-2.5">
            <span className="rm-kicker">Regulatory Compliance Matrix</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-white rounded-xl border border-[#D9DDD3] space-y-1">
                <span className="font-semibold text-[#0E2238] block">GDPR Compliant</span>
                <p className="text-xs text-[#4B5A66] leading-relaxed">
                  Articles 17 &amp; 25: Data Protection by Design and immediate Right to Erasure.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#D9DDD3] space-y-1">
                <span className="font-semibold text-[#0E2238] block">CCPA / CPRA</span>
                <p className="text-xs text-[#4B5A66] leading-relaxed">
                  Strictly zero sale, sharing, or profiling of user or youth behavioral telemetry.
                </p>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-[#D9DDD3] space-y-1">
                <span className="font-semibold text-[#0E2238] block">COPPA Protected</span>
                <p className="text-xs text-[#4B5A66] leading-relaxed">
                  Safe educational environment for teenagers without account registration gates.
                </p>
              </div>
            </div>
          </div>

          {/* Author & Application Provenance */}
          <div className="p-4 rounded-xl bg-white border border-[#D9DDD3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="font-semibold text-[#0E2238] block">Author: Mani Ravindran</span>
              <p className="text-xs text-[#4B5A66] mt-0.5">
                Interactive cyber defense posture and zero-data educational simulation platform.
              </p>
            </div>
            <a
              href="https://ravindran.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-[#0E2238] hover:bg-[#081420] text-[#5FD3BF] transition-colors font-mono text-xs self-start sm:self-auto shrink-0 flex items-center gap-1.5"
            >
              <span>ravindran.in</span>
              <span>↗</span>
            </a>
          </div>

          {/* 1-Click Panic Shredder */}
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-red-900 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-red-700" />
                <span>Panic Memory Shredder (1-Click Zeroization)</span>
              </h4>
              <span className="text-[10px] font-mono text-red-800 uppercase font-semibold">Irreversible</span>
            </div>
            <p className="text-red-950 text-xs leading-relaxed">
              Instantly purge and zeroize all locally cached progress, defense certifications, drill attempts, and breach post-mortem logs with a single click.
            </p>

            <button
              type="button"
              onClick={handleShred}
              disabled={shredConfirmed}
              className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                shredConfirmed
                  ? 'bg-emerald-700 text-white'
                  : 'bg-red-800 hover:bg-red-900 text-white'
              }`}
            >
              {shredConfirmed ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Memory Zeroized! Purging Sandbox...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Shred All Local Sandbox Data Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-white px-6 py-4 border-t border-[#D9DDD3] flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleExportJson}
            disabled={isExporting}
            className="px-4 py-2 bg-[#F3F5F1] hover:bg-[#E9ECE6] border border-[#C7CDC0] text-[#0E2238] rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#0E2238]" />
            <span>Export Audit Certificate (.json)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-4 py-2 bg-[#0E2238] hover:bg-[#081420] text-[#F3F5F1] font-semibold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Close Governance Panel
          </button>
        </div>
      </div>
    </div>
  );
};
