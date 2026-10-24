import React, { useState } from 'react';
import { Mail, Shield, AlertTriangle, CheckCircle, FileText, ExternalLink, QrCode, Search, ChevronRight } from 'lucide-react';
import { PHISHING_EMAILS, PhishingEmail } from '../../data/scenarios';
import { BreachIncident } from '../../types';
import { playClickSound, playSuccessSound, playBreachAlertSound } from '../../utils/audio';

interface PhishingSimProps {
  onBreach: (incident: BreachIncident) => void;
  onSuccess: (xp: number, category: string, badgeId?: string) => void;
}

export const PhishingSim: React.FC<PhishingSimProps> = ({ onBreach, onSuccess }) => {
  const [selectedEmailIndex, setSelectedEmailIndex] = useState(0);
  const [showHeaderInspection, setShowHeaderInspection] = useState(false);
  const [showQrPreview, setShowQrPreview] = useState(false);
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; title: string; message: string; tips: string[] } | null>(null);

  const currentEmail: PhishingEmail = PHISHING_EMAILS[selectedEmailIndex];

  const handleSelectEmail = (idx: number) => {
    playClickSound();
    setSelectedEmailIndex(idx);
    setShowHeaderInspection(false);
    setShowQrPreview(false);
    setFeedback(null);
  };

  const handleFlagPhish = () => {
    playClickSound();
    if (currentEmail.isPhishing) {
      playSuccessSound();
      setFeedback({
        isSuccess: true,
        title: 'Threat Neutralized!',
        message: currentEmail.explanation,
        tips: currentEmail.actionableTips,
      });
      onSuccess(65, 'phishing', 'badge_phish_buster');
    } else {
      // Flagged a legitimate campus email by mistake
      playClickSound();
      setFeedback({
        isSuccess: false,
        title: 'False Positive!',
        message: 'This email is a legitimate campus maintenance alert. Notice the genuine university domain, absence of urgent credential requests, and verified help desk numbers.',
        tips: currentEmail.actionableTips,
      });
    }
  };

  const handleMarkSafe = () => {
    playClickSound();
    if (!currentEmail.isPhishing) {
      playSuccessSound();
      setFeedback({
        isSuccess: true,
        title: 'Correctly Identified Safe Communication',
        message: currentEmail.explanation,
        tips: currentEmail.actionableTips,
      });
      onSuccess(45, 'phishing');
    } else {
      // Marked a phishing email as safe -> SECURITY BREACH!
      playBreachAlertSound();
      const incident: BreachIncident = {
        id: `inc-phish-${Date.now()}`,
        timestamp: 'Just now',
        scenarioTitle: currentEmail.subject,
        category: currentEmail.threatCategory,
        attackerTechnique: currentEmail.threatCategory,
        mitreRef: 'MITRE T1566',
        userMistake: `Marked a malicious message from "${currentEmail.senderAddress}" as safe, trusting an attacker domain.`,
        redFlagsMissed: currentEmail.redFlags,
        actionableTips: currentEmail.actionableTips,
        recoverySteps: [
          'Audit all accounts using similar credentials and immediately invalidate session cookies.',
          'Report the phishing domain to Google Safe Browsing and campus IT.',
          'Verify if Multi-Factor Authentication is active across all student/personal profiles.',
        ],
        retested: false,
      };
      onBreach(incident);
    }
  };

  // User clicked a phishing link or downloaded an executable
  const handleTriggerMaliciousClick = (actionName: string) => {
    playBreachAlertSound();
    const incident: BreachIncident = {
      id: `inc-click-${Date.now()}`,
      timestamp: 'Just now',
      scenarioTitle: `Clicked Malicious Link in: ${currentEmail.subject}`,
      category: currentEmail.threatCategory,
      attackerTechnique: currentEmail.threatCategory,
      mitreRef: 'MITRE T1204.001 / T1566.002',
      userMistake: `You clicked "${actionName}" from an unverified sender without checking the actual destination URL or sender return-path.`,
      redFlagsMissed: currentEmail.redFlags,
      actionableTips: currentEmail.actionableTips,
      recoverySteps: [
        'Disconnect device from network immediately if an executable was launched.',
        'Run an endpoint security scan (e.g. Windows Defender / Malwarebytes).',
        'Revoke OAuth grants or change passwords immediately on a secondary clean device.',
      ],
      retested: false,
    };
    onBreach(incident);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Concept Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <span>Simulation 01</span>
            <span aria-hidden="true">·</span>
            <span>Email & Quishing Defense Sandbox</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Analyze Real-World Traps: Spot Red Flags Before You Click
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Current Scenario:</span>
          <span className="font-semibold text-slate-200">
            {selectedEmailIndex + 1} of {PHISHING_EMAILS.length}
          </span>
        </div>
      </div>

      {/* Two-zone interactive stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Email Selection Inbox */}
        <div className="lg:col-span-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Incoming Mailbox
          </p>
          <div className="space-y-2">
            {PHISHING_EMAILS.map((email, idx) => (
              <button
                key={email.id}
                onClick={() => handleSelectEmail(idx)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedEmailIndex === idx
                    ? 'bg-slate-850 border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-medium text-slate-300 truncate max-w-[140px]">{email.senderName}</span>
                  <span className="text-[11px] font-mono">{email.timestamp}</span>
                </div>
                <h4 className="text-sm font-semibold text-white truncate mb-1">
                  {email.subject}
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>Level: {email.difficulty}</span>
                  {email.hasQrCode && <span className="text-cyan-400">· QR Code</span>}
                  {email.hasAttachment && <span className="text-amber-400">· Attachment</span>}
                </div>
              </button>
            ))}
          </div>

          {/* Quick Tool: Security Checklist Card */}
          <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2.5">
            <h5 className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Inspection Toolkit Guide</span>
            </h5>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>• Click <strong className="text-slate-300">Inspect Headers</strong> to check the true sender bounce path.</li>
              <li>• Hover links to inspect the destination domain before clicking.</li>
              <li>• Check double file extensions (e.g. <span className="font-mono text-cyan-300">.pdf.exe</span>).</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Live Email Stage & Inspection Deck */}
        <div className="lg:col-span-8 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          {/* Email Header Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/40 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {currentEmail.subject}
              </h3>
              <button
                onClick={() => {
                  playClickSound();
                  setShowHeaderInspection(!showHeaderInspection);
                }}
                className="px-2.5 py-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 border border-cyan-800/60 rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-3 h-3" />
                <span>{showHeaderInspection ? 'Hide Technical Headers' : 'Inspect Technical Headers'}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-1">
              <div>
                <span className="text-slate-500">From: </span>
                <span className="font-semibold text-slate-200">{currentEmail.senderName} </span>
                <span className="font-mono text-cyan-300 text-[11px]">&lt;{currentEmail.senderAddress}&gt;</span>
              </div>
              <span className="font-mono text-slate-500">{currentEmail.timestamp}</span>
            </div>

            {/* Expandable Technical Headers Inspector */}
            {showHeaderInspection && (
              <div className="p-3 bg-slate-950 rounded-lg border border-cyan-500/30 text-xs font-mono space-y-1 text-slate-300 animate-in fade-in duration-150">
                <div className="text-cyan-400 font-bold mb-1">// EMAIL ENVELOPE TELEMETRY</div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Return-Path:</span>
                  <span className={currentEmail.actualReturnPath.includes('malicious') || currentEmail.actualReturnPath.includes('aid-portal') ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                    {currentEmail.actualReturnPath}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SPF Verification:</span>
                  <span className={currentEmail.isPhishing ? 'text-amber-400' : 'text-emerald-400'}>
                    {currentEmail.isPhishing ? 'SOFTFAIL (~all ip unmatched)' : 'PASS (spf.university.edu)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">DKIM Signature:</span>
                  <span className={currentEmail.isPhishing ? 'text-red-400' : 'text-emerald-400'}>
                    {currentEmail.isPhishing ? 'FAIL / UNSIGNED' : 'PASS (domain verified)'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Email Body Viewing Canvas */}
          <div className="p-5 sm:p-6 flex-1 overflow-y-auto text-slate-300 text-sm leading-relaxed border-b border-slate-800">
            <div dangerouslySetInnerHTML={{ __html: currentEmail.bodyHtml }} />

            {/* Clickable trap links inside email to test student vulnerability */}
            {currentEmail.isPhishing && (
              <div className="mt-4 p-3 bg-slate-950/70 rounded-lg border border-dashed border-red-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-red-300/80">
                  Simulated Trap: What happens if you click the claim link or attachment?
                </span>
                <div className="flex items-center gap-2">
                  {currentEmail.hasQrCode && (
                    <button
                      onClick={() => setShowQrPreview(!showQrPreview)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Scan QR Preview</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleTriggerMaliciousClick(currentEmail.attachmentName || currentEmail.targetLinkText || 'Malicious Payload')}
                    className="px-2.5 py-1 bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 rounded text-xs flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Test Click (Trigger Breach)</span>
                  </button>
                </div>
              </div>
            )}

            {/* QR Code Payload inspector if toggled */}
            {showQrPreview && currentEmail.qrPayloadUrl && (
              <div className="mt-3 p-3 bg-slate-950 rounded-lg border border-amber-500/40 text-xs space-y-1">
                <p className="font-semibold text-amber-300">Scanned QR Destination:</p>
                <code className="text-cyan-300 break-all">{currentEmail.qrPayloadUrl}</code>
                <p className="text-slate-400 text-[11px] mt-1">
                  Notice that the QR destination points to a lookalike domain designed to bypass email filter sandboxes.
                </p>
              </div>
            )}
          </div>

          {/* Decision Deck Controls */}
          <div className="p-4 sm:p-5 bg-slate-950/90 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              <span>Your Verdict: Is this communication safe or a cybersecurity threat?</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleMarkSafe}
                className="px-4 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Mark as Legitimate & Safe</span>
              </button>

              <button
                onClick={handleFlagPhish}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-gradient-to-r from-red-400 to-amber-400 hover:from-red-300 hover:to-amber-300 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <AlertTriangle className="w-4 h-4 text-slate-950" />
                <span>Quarantine & Flag as Phishing</span>
              </button>
            </div>
          </div>

          {/* Dynamic Immediate Feedback Banner */}
          {feedback && (
            <div className={`p-4 border-t text-xs ${
              feedback.isSuccess
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-200'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="font-bold text-sm flex items-center gap-1.5">
                  {feedback.isSuccess ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  <span>{feedback.title}</span>
                </h4>
                {selectedEmailIndex < PHISHING_EMAILS.length - 1 && (
                  <button
                    onClick={() => handleSelectEmail(selectedEmailIndex + 1)}
                    className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next Scenario</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="text-slate-300 leading-relaxed mb-2">
                {feedback.message}
              </p>
              {feedback.tips && feedback.tips.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="font-semibold text-slate-200">Key Defense Takeaways:</span>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-slate-300">
                    {feedback.tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
