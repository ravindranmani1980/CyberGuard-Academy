import React, { useState } from 'react';
import { Radio, AlertTriangle, CheckCircle, ShieldCheck, Plus, Filter, MessageSquare, ExternalLink, ThumbsUp } from 'lucide-react';
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

  // Form states for new report
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

    // Reset form
    setTitle('');
    setIndicator('');
    setDescription('');
    setRedFlagsText('');
    setActionableTip('');
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <span>Peer-to-Peer Threat Radar</span>
            <span aria-hidden="true">·</span>
            <span>Real-World Early Warning Grid</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Community Threat Intelligence & Sightings
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Real youth threat reports verified by peers. Upvote verified sightings or report emerging attack patterns.
          </p>
        </div>

        <button
          onClick={() => {
            playClickSound();
            setShowSubmitModal(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Report New Threat (+50 XP)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-xs">
        <span className="text-slate-400 px-2 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>Platform:</span>
        </span>
        {filterOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => {
              playClickSound();
              setSelectedFilter(opt);
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedFilter === opt
                ? 'bg-slate-800 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
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
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3.5 shadow-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                  threat.threatLevel === 'Critical'
                    ? 'bg-red-950/80 text-red-400 border border-red-800'
                    : threat.threatLevel === 'High'
                    ? 'bg-amber-950/80 text-amber-400 border border-amber-800'
                    : 'bg-yellow-950/80 text-yellow-400 border border-yellow-800'
                }`}>
                  {threat.threatLevel}
                </span>

                <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                  {threat.targetPlatform}
                </span>

                <h3 className="text-base font-bold text-white tracking-tight">
                  {threat.title}
                </h3>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Reported by <strong className="text-slate-300">{threat.reportedBy}</strong> · {threat.reportedTime}
              </div>
            </div>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {threat.description}
            </p>

            {/* Indicator code snippet */}
            {threat.sampleIndicator && (
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs flex items-center justify-between">
                <div>
                  <span className="text-slate-500 mr-2">Indicator:</span>
                  <code className="text-red-300">{threat.sampleIndicator}</code>
                </div>
              </div>
            )}

            {/* Red Flags & Actionable Defense */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
                <span className="font-semibold text-amber-400">Red Flag Signatures:</span>
                <ul className="space-y-1 text-slate-400 text-[11px]">
                  {threat.redFlags.map((flag, idx) => (
                    <li key={idx}>• {flag}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-500/20 text-xs space-y-1.5">
                <span className="font-semibold text-emerald-400">Actionable Defense Tip:</span>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {threat.actionableTip}
                </p>
              </div>
            </div>

            {/* Verification upvote footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>
                  <strong className="text-slate-200 font-mono">{threat.verificationsCount}</strong> Peer Verifications
                </span>
              </div>

              <button
                onClick={() => handleVerify(threat.id)}
                disabled={threat.isUserVerified}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  threat.isUserVerified
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 cursor-default'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white border border-slate-700'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{threat.isUserVerified ? 'Verified by You' : 'Verify Sighting (+20 XP)'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Report Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>Submit Anonymous Threat Sighting</span>
              </h3>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer text-xs"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmitNewReport} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Threat Campaign Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Fake Steam Trade Link scam in Minecraft Discord"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Platform Vector</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as PeerThreat['targetPlatform'])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
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
                  <label className="block text-slate-300 font-semibold mb-1">Severity</label>
                  <select
                    value={threatLevel}
                    onChange={(e) => setThreatLevel(e.target.value as PeerThreat['threatLevel'])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Sample Indicator (Suspicious URL / Bot name / File pattern)
                </label>
                <input
                  type="text"
                  value={indicator}
                  onChange={(e) => setIndicator(e.target.value)}
                  placeholder="e.g. disccrd-claim-nitro[.]com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  How does the attack work? (Description)
                </label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe how the attacker approaches victims and what they claim..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Red Flags to Spot (one per line)
                </label>
                <textarea
                  rows={2}
                  value={redFlagsText}
                  onChange={(e) => setRedFlagsText(e.target.value)}
                  placeholder="Unverified domain name&#10;Urgent 15-minute countdown timer"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Actionable Tip for Youth to Avoid It
                </label>
                <input
                  type="text"
                  value={actionableTip}
                  onChange={(e) => setActionableTip(e.target.value)}
                  placeholder="e.g. Never click links sent over DMs; check server mod role directly"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Zero personal data is linked to reports.
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold rounded-lg text-xs cursor-pointer hover:from-cyan-300 hover:to-emerald-300"
                >
                  Publish Report (+50 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
