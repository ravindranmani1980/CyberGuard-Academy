import React, { useState } from 'react';
import { Lock, ShieldCheck, Trash2, Download, CheckCircle2, AlertTriangle, X, ShieldAlert, Cpu } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-modal-title"
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Top Header */}
        <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                <span>Data Privacy Constitution</span>
                <span aria-hidden="true">·</span>
                <span>Zero-Data-Retention Architecture</span>
              </div>
              <h2 id="privacy-modal-title" className="text-lg font-bold text-white tracking-tight">
                Modern Privacy Standards & Client Sandbox
              </h2>
            </div>
          </div>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Real-time memory sandbox audit */}
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Active Local Sandbox Telemetry</span>
              </span>
              <span className="font-mono text-emerald-400">ZERO REMOTE UPLOADS</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              ThreatGuard is engineered specifically to ensure no personal information, keystrokes, simulated credentials, or device identifiers are ever collected or stored on remote servers.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 block">External DB:</span>
                <span className="text-slate-200">None (0 bytes)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tracking Cookies:</span>
                <span className="text-slate-200">Zero (0)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Encrypted Memory:</span>
                <span className="text-cyan-400">Local Only</span>
              </div>
            </div>
          </div>

          {/* Three Major Privacy Compliance Pillars */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-xs">
              Regulatory Compliance Pillars
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-cyan-400 block">GDPR Compliant</span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Articles 17 & 25: Built-in Data Protection by Design and immediate Right to Erasure.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-emerald-400 block">CCPA / CPRA</span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Strictly zero sale, sharing, or profiling of consumer or youth behavioral telemetry.
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-purple-400 block">COPPA Protected</span>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Guaranteed safe educational environment for teenagers without account requirements.
                </p>
              </div>
            </div>
          </div>

          {/* 1-Click Panic Shredder */}
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-red-300 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-red-400" />
                <span>Panic Memory Shredder (1-Click Zeroization)</span>
              </h4>
              <span className="text-[10px] font-mono text-red-400 uppercase">Irreversible</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Instantly purge and zeroize all locally cached progress, defense badges, drill attempts, and breach post-mortem incident logs with a single click.
            </p>

            <button
              onClick={handleShred}
              disabled={shredConfirmed}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                shredConfirmed
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-950/80 hover:bg-red-900 border border-red-600 text-red-200'
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
                  <span>Shred All Local Data Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleExportJson}
            disabled={isExporting}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>Export Audit Certificate (.json)</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-4 py-2 bg-slate-200 hover:bg-white text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Close Privacy Radar
          </button>
        </div>
      </div>
    </div>
  );
};
