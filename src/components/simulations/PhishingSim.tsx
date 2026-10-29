import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, ExternalLink, QrCode, Search, ChevronRight } from 'lucide-react';
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
        title: 'Threat Neutralized & Quarantined',
        message: currentEmail.explanation,
        tips: currentEmail.actionableTips,
      });
      onSuccess(65, 'phishing', 'badge_phish_buster');
    } else {
      playClickSound();
      setFeedback({
        isSuccess: false,
        title: 'False Positive Classification',
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
        title: 'Correctly Verified Legitimate Communication',
        message: currentEmail.explanation,
        tips: currentEmail.actionableTips,
      });
      onSuccess(45, 'phishing');
    } else {
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
      {/* Module Header Card */}
      <div className="p-5 rounded-xl bg-white border border-[#D9DDD3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="rm-kicker">MOD-01 / Email &amp; Quishing Defense Sandbox</span>
          <h2 className="text-lg font-semibold text-[#0E2238]">
            Analyze Real-World Traps: Inspect Envelope Headers &amp; Payloads Before Acting
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-[#16232F] bg-[#F3F5F1] border border-[#C7CDC0] px-3 py-1.5 rounded-lg">
          <span>Artifact:</span>
          <span className="font-semibold text-[#0E2238]">
            {selectedEmailIndex + 1} of {PHISHING_EMAILS.length}
          </span>
        </div>
      </div>

      {/* Two-zone interactive stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Email Selection Inbox */}
        <div className="lg:col-span-4 space-y-2.5">
          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#4B5A66] mb-1 px-1">
            Quarantine Triage Queue
          </p>
          <div className="space-y-2.5">
            {PHISHING_EMAILS.map((email, idx) => (
              <button
                key={email.id}
                type="button"
                onClick={() => handleSelectEmail(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedEmailIndex === idx
                    ? 'bg-white border-[#0E2238] ring-1 ring-[#0E2238] shadow-sm'
                    : 'bg-[#F3F5F1] border-[#C7CDC0] hover:bg-white hover:border-[#0E2238]'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-[#4B5A66] mb-1">
                  <span className="font-semibold text-[#0E2238] truncate max-w-[160px]">{email.senderName}</span>
                  <span className="text-[11px] font-mono">{email.timestamp}</span>
                </div>
                <h4 className="text-sm font-semibold text-[#16232F] truncate mb-1.5">
                  {email.subject}
                </h4>
                <div className="flex items-center gap-2 text-[11px] font-mono text-[#4B5A66]">
                  <span>Tier: {email.difficulty}</span>
                  {email.hasQrCode && <span className="text-[#0E2238] font-medium">· QR Payload</span>}
                  {email.hasAttachment && <span className="text-amber-800 font-medium">· Attachment</span>}
                </div>
              </button>
            ))}
          </div>

          {/* Quick Tool: Security Checklist Card */}
          <div className="mt-4 p-4 rounded-xl bg-white border border-[#D9DDD3] text-xs space-y-2">
            <h5 className="font-semibold text-[#0E2238] flex items-center gap-1.5 font-mono uppercase text-[11px]">
              <Search className="w-3.5 h-3.5 text-[#2BB5A0]" />
              <span>Analyst Verification Checklist</span>
            </h5>
            <ul className="space-y-1.5 text-[#4B5A66] text-xs leading-relaxed">
              <li>• Click <strong className="text-[#16232F]">Inspect Technical Headers</strong> to audit SPF/DKIM and return-path.</li>
              <li>• Check for lookalike domain typosquatting before trusting links.</li>
              <li>• Flag double file extensions (<span className="font-mono text-[#0E2238]">.pdf.exe</span>).</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Live Email Stage & Inspection Deck */}
        <div className="lg:col-span-8 flex flex-col bg-white border border-[#D9DDD3] rounded-xl overflow-hidden shadow-xs">
          {/* Email Header Bar */}
          <div className="p-5 border-b border-[#D9DDD3] bg-[#F3F5F1] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-[#0E2238] tracking-tight">
                {currentEmail.subject}
              </h3>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setShowHeaderInspection(!showHeaderInspection);
                }}
                className="px-3 py-1.5 text-xs font-mono font-medium text-[#EEF3F1] bg-[#0E2238] hover:bg-[#081420] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5 text-[#5FD3BF]" />
                <span>{showHeaderInspection ? 'Hide SMTP Headers' : 'Inspect Technical Headers'}</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#4B5A66] gap-1">
              <div>
                <span className="text-[#4B5A66]">From: </span>
                <span className="font-semibold text-[#16232F]">{currentEmail.senderName} </span>
                <span className="font-mono text-[#0E2238] text-[11px]">&lt;{currentEmail.senderAddress}&gt;</span>
              </div>
              <span className="font-mono text-[#4B5A66]">{currentEmail.timestamp}</span>
            </div>

            {/* Expandable Technical Headers Inspector (Postrix Dark Command Card) */}
            {showHeaderInspection && (
              <div className="p-3.5 bg-[#081420] rounded-lg border border-[#3E6E86]/50 text-xs font-mono space-y-1.5 text-[#EEF3F1]">
                <div className="text-[#5FD3BF] font-semibold mb-1 uppercase tracking-wider text-[11px]">
                  SMTP Envelope &amp; Authentication Telemetry
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A9B7BF]">Return-Path:</span>
                  <span className={currentEmail.actualReturnPath.includes('malicious') || currentEmail.actualReturnPath.includes('aid-portal') ? 'text-[#EBC385] font-semibold' : 'text-[#5FD3BF]'}>
                    {currentEmail.actualReturnPath}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A9B7BF]">SPF Verification:</span>
                  <span className={currentEmail.isPhishing ? 'text-[#EBC385]' : 'text-[#5FD3BF]'}>
                    {currentEmail.isPhishing ? 'SOFTFAIL (~all ip unmatched)' : 'PASS (spf.university.edu)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A9B7BF]">DKIM Signature:</span>
                  <span className={currentEmail.isPhishing ? 'text-red-400 font-semibold' : 'text-[#5FD3BF]'}>
                    {currentEmail.isPhishing ? 'FAIL / UNSIGNED' : 'PASS (domain verified)'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Email Body Viewing Canvas */}
          <div className="p-5 sm:p-6 flex-1 overflow-y-auto text-[#16232F] text-sm leading-relaxed border-b border-[#D9DDD3]">
            <div dangerouslySetInnerHTML={{ __html: currentEmail.bodyHtml }} />

            {/* Clickable trap links inside email to test student vulnerability */}
            {currentEmail.isPhishing && (
              <div className="mt-5 p-3.5 bg-[#F3F5F1] rounded-lg border border-[#C7CDC0] flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-[#16232F] font-medium">
                  Sandbox Payload Simulation: Inspect QR destination or test link execution
                </span>
                <div className="flex items-center gap-2">
                  {currentEmail.hasQrCode && (
                    <button
                      type="button"
                      onClick={() => setShowQrPreview(!showQrPreview)}
                      className="px-3 py-1.5 bg-white hover:bg-[#E9ECE6] text-[#0E2238] border border-[#C7CDC0] rounded-lg text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Decode QR URL</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleTriggerMaliciousClick(currentEmail.attachmentName || currentEmail.targetLinkText || 'Malicious Payload')}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-300 text-red-800 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Simulate Click (Trigger Breach)</span>
                  </button>
                </div>
              </div>
            )}

            {/* QR Code Payload inspector if toggled */}
            {showQrPreview && currentEmail.qrPayloadUrl && (
              <div className="mt-3 p-3.5 bg-[#081420] rounded-lg border border-[#3E6E86]/50 text-xs space-y-1 text-[#EEF3F1]">
                <p className="font-semibold text-[#EBC385] font-mono">Decoded QR Destination URI:</p>
                <code className="text-[#5FD3BF] break-all block">{currentEmail.qrPayloadUrl}</code>
                <p className="text-[#A9B7BF] text-[11px] mt-1">
                  Notice that the QR destination points to a lookalike domain designed to bypass email gateway filters.
                </p>
              </div>
            )}
          </div>

          {/* Decision Deck Controls */}
          <div className="p-4 sm:p-5 bg-[#F3F5F1] flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-[#4B5A66] font-medium">
              <span>Analyst Verdict: Classify this communication</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleMarkSafe}
                className="px-4 py-2 text-xs font-semibold text-[#0E2238] bg-white hover:bg-[#E9ECE6] border border-[#C7CDC0] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>Verify as Legitimate</span>
              </button>

              <button
                type="button"
                onClick={handleFlagPhish}
                className="px-4 py-2 text-xs font-semibold text-[#F3F5F1] bg-[#0E2238] hover:bg-[#081420] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4 text-[#EBC385]" />
                <span>Quarantine &amp; Flag Threat</span>
              </button>
            </div>
          </div>

          {/* Dynamic Immediate Feedback Banner */}
          {feedback && (
            <div className={`p-5 border-t text-xs ${
              feedback.isSuccess
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-amber-50 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="font-bold text-sm flex items-center gap-1.5">
                  {feedback.isSuccess ? <CheckCircle className="w-4 h-4 text-emerald-700" /> : <AlertTriangle className="w-4 h-4 text-amber-700" />}
                  <span>{feedback.title}</span>
                </h4>
                {selectedEmailIndex < PHISHING_EMAILS.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleSelectEmail(selectedEmailIndex + 1)}
                    className="px-3 py-1.5 bg-[#0E2238] hover:bg-[#081420] text-[#F3F5F1] rounded-lg font-medium text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Next Artifact</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <p className="leading-relaxed mb-2">
                {feedback.message}
              </p>
              {feedback.tips && feedback.tips.length > 0 && (
                <div className="pt-2 border-t border-black/10">
                  <span className="font-semibold">Defensive Remediation Takeaways:</span>
                  <ul className="list-disc list-inside mt-1 space-y-1">
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
