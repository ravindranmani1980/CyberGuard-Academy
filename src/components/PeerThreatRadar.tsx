import React, { useState } from 'react';
import { Radio, ShieldCheck, Plus, Filter, ThumbsUp, X } from 'lucide-react';
import { PeerThreat } from '../types';
import { INITIAL_PEER_THREATS } from '../data/threatIntel';
import { playClickSound, playSuccessSound } from '../utils/audio';

interface PeerThreatRadarProps {
  onVerifyThreat: (threatId: string) => void;
  onAddThreat: (threat: PeerThreat) => void;
}

export const PeerThreatRadar: React.FC<PeerThreatRadarProps> = ({
  onVerifyThreat,
  onAddThreat,
}) => {
  const [threats, setThreats] = useState<PeerThreat[]>(INITIAL_PEER_THREATS);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<PeerThreat['targetPlatform']>('Discord');
  const [threatLevel, setThreatLevel] = useState<PeerThreat['threatLevel']>('High');
  const [indicator, setIndicator] = useState('');
  const [description, setDescription] = useState('');
  const [redFlagsText, setRedFlagsText] = useState('');
  const [actionableTip, setActionableTip] = useState('');

  const filterOptions = ['All', 'Discord', 'Instagram', 'Campus/Email', 'QR/Quishing', 'Mobile/APK'];

  const filteredThreats = selectedFilter === 'All'
    ? threats
    : threats.filter(t => t.targetPlatform === selectedFilter);

  const handleVerify = (id: string) => {
    playClickSound();
    setThreats(prev => prev.map(t => {
      if (t.id === id) {
        if (t.isUserVerified) return t;
        playSuccessSound();
        return {
          ...t,
          verificationsCount: t.verificationsCount + 1,
          isUserVerified: true,
        };
      }
      return t;
    }));
    onVerifyThreat(id);
  };

  const handleSubmitNewReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    playSuccessSound();
    const newThreat: PeerThreat = {
      id: `threat-user-${Date.now()}`,
      title: title.trim(),
      targetPlatform: platform,
      threatLevel,
      reportedBy: 'You (Verified Scout)',
      reportedTime: 'Just now',
      description: description.trim(),
      sampleIndicator: indicator.trim() || 'Confidential signature pattern',
      redFlags: redFlagsText.split('\n').filter(l => l.trim().length > 0),
      actionableTip: actionableTip.trim() || 'Verify official domain in isolated tab.',
      verificationsCount: 1,
      isUserVerified: true,
    };

    setThreats([newThreat, ...threats]);
    onAddThreat(newThreat);
    setShowSubmitModal(false);

    setTitle('');
    setIndicator('');
    setDescription('');
    setRedFlagsText('');
    setActionableTip('');
  };

  return (
    <div className="space-y-6">
      {/* Postrix Command Header for Peer Threat Radar */}
      <section className="xh-panel">
        <div className="xh-kicker">
          <span className="k">Peer-to-Peer Threat Intelligence &amp; IOC Verification Grid</span>
          <span className="tag">{threats.length} Verified Advisories</span>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-[#EEF3F1] font-serif">
              Community Threat Advisories &amp; Live Indicators of Compromise
            </h1>
            <p className="text-xs text-[#A9B7BF] mt-0.5">
              Crowdsourced threat sightings verified by youth defenders. Corroborate verified indicators or publish emerging attack patterns.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setShowSubmitModal(true);
            }}
            className="xh-btn primary self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Threat Advisory (+50 XP)</span>
          </button>
        </div>
      </section>

      {/* Filter Tabs on Paper */}
      <div className="flex items-center gap-1.5 p-2 bg-white border border-[#D9DDD3] rounded-xl overflow-x-auto text-xs shadow-xs">
        <span className="text-[#4B5A66] px-2.5 flex items-center gap-1.5 shrink-0 font-mono">
          <Filter className="w-3.5 h-3.5" />
          <span>Vector:</span>
        </span>
        {filterOptions.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => {
              playClickSound();
              setSelectedFilter(opt);
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer font-medium ${
              selectedFilter === opt
                ? 'bg-[#0E2238] text-[#F3F5F1] font-semibold'
                : 'text-[#4B5A66] hover:text-[#0E2238] hover:bg-[#F3F5F1]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Threats Feed */}
      <div className="space-y-4">
        {filteredThreats.map((threat) => (
          <div
            key={threat.id}
            className="p-6 rounded-xl bg-white border border-[#D9DDD3] hover:border-[#C7CDC0] transition-all space-y-4 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D9DDD3] pb-3.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold border ${
                  threat.threatLevel === 'Critical'
                    ? 'bg-red-50 text-red-800 border-red-200'
                    : threat.threatLevel === 'High'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                }`}>
                  {threat.threatLevel}
                </span>

                <span className="text-xs font-mono font-medium text-[#0E2238] bg-[#F3F5F1] px-2.5 py-0.5 rounded border border-[#C7CDC0]">
                  {threat.targetPlatform}
                </span>

                <h3 className="text-base font-semibold text-[#0E2238] tracking-tight">
                  {threat.title}
                </h3>
              </div>

              <div className="text-xs text-[#4B5A66] font-mono">
                Source: <strong className="text-[#16232F]">{threat.reportedBy}</strong> · {threat.reportedTime}
              </div>
            </div>

            <p className="text-[#16232F] text-xs sm:text-sm leading-relaxed">
              {threat.description}
            </p>

            {/* Indicator code snippet */}
            {threat.sampleIndicator && (
              <div className="p-3 bg-[#081420] rounded-lg border border-[#3E6E86]/40 font-mono text-xs flex items-center justify-between text-[#EEF3F1]">
                <div>
                  <span className="text-[#A9B7BF] mr-2">Observed IOC:</span>
                  <code className="text-[#5FD3BF]">{threat.sampleIndicator}</code>
                </div>
              </div>
            )}

            {/* Red Flags & Actionable Defense */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 bg-[#F3F5F1] rounded-xl border border-[#D9DDD3] text-xs space-y-1.5">
                <span className="font-semibold text-[#0E2238] block">Observed Attack Signatures:</span>
                <ul className="space-y-1 text-[#4B5A66] text-xs leading-relaxed">
                  {threat.redFlags.map((flag, idx) => (
                    <li key={idx}>• {flag}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                <span className="font-semibold text-emerald-900 block">Defensive Remediation Blueprint:</span>
                <p className="text-emerald-950 text-xs leading-relaxed">
                  {threat.actionableTip}
                </p>
              </div>
            </div>

            {/* Verification upvote footer */}
            <div className="flex items-center justify-between pt-3 border-t border-[#D9DDD3] text-xs">
              <div className="flex items-center gap-2 text-[#4B5A66]">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>
                  <strong className="text-[#0E2238] font-mono tabular-nums">{threat.verificationsCount}</strong> Peer Corroborations
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleVerify(threat.id)}
                disabled={threat.isUserVerified}
                className={`px-3.5 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  threat.isUserVerified
                    ? 'bg-[#E9ECE6] text-[#4B5A66] border border-[#C7CDC0] cursor-default'
                    : 'bg-[#0E2238] hover:bg-[#081420] text-[#F3F5F1]'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5 text-[#5FD3BF]" />
                <span>{threat.isUserVerified ? 'Verified by You' : 'Verify Advisory (+20 XP)'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Report Modal matching Postrix Modal Dialog */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-[#F3F5F1] border border-[#C7CDC0] rounded-xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D9DDD3]">
              <div>
                <span className="rm-kicker">Peer Intelligence Submission</span>
                <h2 className="text-lg font-semibold text-[#0E2238] flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#2BB5A0]" />
                  <span>Publish Anonymous Threat Advisory</span>
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="text-[#4B5A66] hover:text-[#081420] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitNewReport} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-xs font-medium text-[#16232F] mb-1">
                  Threat Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fake Steam Trade Link scam in Minecraft Discord"
                  className="w-full px-3 py-2 bg-white border border-[#C7CDC0] rounded-lg text-[#16232F] text-xs focus:outline-none focus:border-[#0E2238]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#16232F] mb-1">Platform Vector</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as PeerThreat['targetPlatform'])}
                    className="w-full px-3 py-2 bg-white border border-[#C7CDC0] rounded-lg text-[#16232F] text-xs focus:outline-none focus:border-[#0E2238]"
                  >
                    <option value="Discord">Discord</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Campus/Email">Campus/Email</option>
                    <option value="QR/Quishing">QR/Quishing</option>
                    <option value="Mobile/APK">Mobile/APK</option>
                    <option value="Gaming">Gaming</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#16232F] mb-1">Severity</label>
                  <select
                    value={threatLevel}
                    onChange={(e) => setThreatLevel(e.target.value as PeerThreat['threatLevel'])}
                    className="w-full px-3 py-2 bg-white border border-[#C7CDC0] rounded-lg text-[#16232F] text-xs focus:outline-none focus:border-[#0E2238]"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#16232F] mb-1">
                  Sample Indicator (Suspicious URL / Bot name / File hash)
                </label>
                <input
                  type="text"
                  value={indicator}
                  onChange={(e) => setIndicator(e.target.value)}
                  placeholder="e.g. disccrd-claim-nitro[.]com"
                  className="w-full px-3 py-2 bg-white border border-[#C7CDC0] rounded-lg text-[#16232F] text-xs font-mono focus:outline-none focus:border-[#0E2238]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#16232F] mb-1">
                  Attack Mechanics &amp; Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe how the attacker approaches targets and what they claim..."
                  className="w-full px-3 py-2 bg-white border border-[#C7CDC0] rounded-lg text-[#16232F] text-xs focus:outline-none focus:border-[#0E2238]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#16232F] mb-1">
                  Red Flags to Spot (one per line)
                </label>
                <textarea
                  rows={2}
                  value={redFlagsText}
                  onChange={(e) => setRedFlagsText(e.target.value)}
                  placeholder="Unverified domain name&#10;Urgent 15-minute countdown timer"
                  className="w-full px-3 py-2 bg-white border border-[#C7CDC0] rounded-lg text-[#16232F] text-xs focus:outline-none focus:border-[#0E2238]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#16232F] mb-1">
                  Defensive Remediation Tip
                </label>
                <input
                  type="text"
                  value={actionableTip}
                  onChange={(e) => setActionableTip(e.target.value)}
                  placeholder="e.g. Never click links sent over DMs; verify server mod role directly"
                  className="w-full px-3 py-2 bg-white border border-[#C7CDC0] rounded-lg text-[#16232F] text-xs focus:outline-none focus:border-[#0E2238]"
                />
              </div>

              <div className="pt-3 border-t border-[#D9DDD3] flex items-center justify-between">
                <span className="text-[11px] text-[#4B5A66] font-mono">
                  Zero personal metadata is attached.
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0E2238] hover:bg-[#081420] text-[#F3F5F1] font-semibold rounded-lg text-xs cursor-pointer"
                >
                  Publish Advisory (+50 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
