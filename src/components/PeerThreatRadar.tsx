import React, { useState, useEffect } from 'react';
import {
  Radio,
  ShieldCheck,
  Plus,
  Filter,
  ThumbsUp,
  X,
  MessageSquare,
  Send,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PeerThreat, ThreatComment, MitigationStrategyCategory } from '../types';
import { loadPeerThreats, savePeerThreats } from '../utils/storage';
import { playClickSound, playSuccessSound } from '../utils/audio';

interface PeerThreatRadarProps {
  onVerifyThreat: (threatId: string) => void;
  onAddThreat: (threat: PeerThreat) => void;
  onAddMitigationComment?: (threatId: string, comment: ThreatComment) => void;
}

const STRATEGY_CATEGORIES: MitigationStrategyCategory[] = [
  'Technical Control',
  'Identity Hardening',
  'Verification Step',
  'Network Isolation',
];

export const PeerThreatRadar: React.FC<PeerThreatRadarProps> = ({
  onVerifyThreat,
  onAddThreat,
  onAddMitigationComment,
}) => {
  const [threats, setThreats] = useState<PeerThreat[]>(() => loadPeerThreats());
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Track which threat cards have their mitigation comment section expanded
  const [expandedThreatIds, setExpandedThreatIds] = useState<string[]>(['threat_discord_1']);

  // Draft comment inputs keyed by threatId
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [commentCategories, setCommentCategories] = useState<Record<string, MitigationStrategyCategory>>({});
  const [commentAuthorAlias, setCommentAuthorAlias] = useState<Record<string, string>>({});

  // New threat modal states
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<PeerThreat['targetPlatform']>('Discord');
  const [threatLevel, setThreatLevel] = useState<PeerThreat['threatLevel']>('High');
  const [indicator, setIndicator] = useState('');
  const [description, setDescription] = useState('');
  const [redFlagsText, setRedFlagsText] = useState('');
  const [actionableTip, setActionableTip] = useState('');

  useEffect(() => {
    savePeerThreats(threats);
  }, [threats]);

  const filterOptions = ['All', 'Discord', 'Instagram', 'Campus/Email', 'QR/Quishing', 'Mobile/APK'];

  const filteredThreats = selectedFilter === 'All'
    ? threats
    : threats.filter(t => t.targetPlatform === selectedFilter);

  const toggleCommentsSection = (threatId: string) => {
    playClickSound();
    setExpandedThreatIds((prev) =>
      prev.includes(threatId)
        ? prev.filter((id) => id !== threatId)
        : [...prev, threatId]
    );
  };

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

  const handleUpvoteComment = (threatId: string, commentId: string) => {
    playClickSound();
    setThreats((prev) =>
      prev.map((threat) => {
        if (threat.id !== threatId) return threat;
        const updatedComments = (threat.comments || []).map((c) => {
          if (c.id !== commentId) return c;
          const alreadyUpvoted = Boolean(c.isUpvotedByUser);
          return {
            ...c,
            upvotes: alreadyUpvoted ? Math.max(0, c.upvotes - 1) : c.upvotes + 1,
            isUpvotedByUser: !alreadyUpvoted,
          };
        });
        return { ...threat, comments: updatedComments };
      })
    );
  };

  const handlePostMitigationComment = (e: React.FormEvent, threatId: string) => {
    e.preventDefault();
    const draftText = (commentDrafts[threatId] || '').trim();
    if (!draftText) return;

    const category: MitigationStrategyCategory =
      commentCategories[threatId] || 'Technical Control';
    const customAlias = (commentAuthorAlias[threatId] || '').trim();

    const newComment: ThreatComment = {
      id: `cmt-${Date.now()}`,
      author: customAlias || 'You (Verified Defender)',
      role: 'Local Guardian',
      timestamp: 'Just now',
      strategyType: category,
      content: draftText,
      upvotes: 1,
      isUpvotedByUser: true,
    };

    playSuccessSound();
    setThreats((prev) =>
      prev.map((t) => {
        if (t.id !== threatId) return t;
        return {
          ...t,
          comments: [...(t.comments || []), newComment],
        };
      })
    );

    setCommentDrafts((prev) => ({ ...prev, [threatId]: '' }));
    if (onAddMitigationComment) {
      onAddMitigationComment(threatId, newComment);
    }
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
      comments: [],
    };

    setThreats([newThreat, ...threats]);
    setExpandedThreatIds((prev) => [newThreat.id, ...prev]);
    onAddThreat(newThreat);
    setShowSubmitModal(false);

    setTitle('');
    setIndicator('');
    setDescription('');
    setRedFlagsText('');
    setActionableTip('');
  };

  const totalStrategiesCount = threats.reduce(
    (sum, t) => sum + (t.comments?.length || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Postrix Command Header for Peer Threat Radar */}
      <section className="xh-panel">
        <div className="xh-kicker">
          <span className="k">Peer-to-Peer Threat Intelligence &amp; IOC Verification Grid</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="tag">{threats.length} Verified Advisories</span>
            <span className="tag">{totalStrategiesCount} Peer Mitigation Strategies</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-[#EEF3F1] font-serif">
              Community Threat Advisories &amp; Collaborative Mitigation Runbooks
            </h1>
            <p className="text-xs text-[#A9B7BF] mt-0.5">
              Crowdsourced threat sightings verified by youth defenders. Corroborate indicators, share actionable mitigation strategies, or publish emerging attack patterns.
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
      <div className="space-y-5">
        {filteredThreats.map((threat) => {
          const comments = threat.comments || [];
          const isExpanded = expandedThreatIds.includes(threat.id);
          const draftText = commentDrafts[threat.id] || '';
          const selectedCategory = commentCategories[threat.id] || 'Technical Control';
          const customAlias = commentAuthorAlias[threat.id] || '';

          return (
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
                  <span className="font-semibold text-emerald-900 block">Primary Remediation Blueprint:</span>
                  <p className="text-emerald-950 text-xs leading-relaxed">
                    {threat.actionableTip}
                  </p>
                </div>
              </div>

              {/* Verification & Mitigation Discussion Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D9DDD3] text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[#4B5A66]">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>
                      <strong className="text-[#0E2238] font-mono tabular-nums">{threat.verificationsCount}</strong> Peer Corroborations
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleCommentsSection(threat.id)}
                    className="px-3 py-1.5 rounded-lg bg-[#F3F5F1] hover:bg-[#E9ECE6] border border-[#C7CDC0] text-[#0E2238] font-medium transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#2BB5A0]" />
                    <span>
                      Mitigation Strategies (<strong className="font-mono tabular-nums">{comments.length}</strong>)
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-[#4B5A66]" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[#4B5A66]" />
                    )}
                  </button>
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

              {/* Expandable Peer Mitigation Strategies & Commenting System */}
              {isExpanded && (
                <div className="pt-4 mt-2 border-t border-[#D9DDD3] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="rm-kicker">Community Defense Runbooks</span>
                      <h4 className="text-sm font-semibold text-[#0E2238]">
                        Peer-Submitted Mitigation Strategies ({comments.length})
                      </h4>
                    </div>
                    <span className="text-[11px] font-mono text-[#4B5A66]">
                      Share a verified defense control to earn +15 XP
                    </span>
                  </div>

                  {/* List of existing mitigation comments */}
                  {comments.length === 0 ? (
                    <div className="p-4 rounded-xl bg-[#F3F5F1] border border-[#D9DDD3] text-xs text-[#4B5A66] text-center">
                      No peer mitigation strategies posted yet for this advisory. Be the first defender to contribute a hardening step below.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {comments.map((cmt) => (
                        <div
                          key={cmt.id}
                          className="p-3.5 rounded-xl bg-[#F3F5F1] border border-[#D9DDD3] space-y-2"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="font-semibold text-[#0E2238] font-mono">
                                {cmt.author}
                              </span>
                              <span className="text-[#4B5A66]" aria-hidden="true">·</span>
                              <span className="text-[11px] text-[#4B5A66]">
                                {cmt.role}
                              </span>
                              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-white border border-[#C7CDC0] text-[#0E2238]">
                                {cmt.strategyType}
                              </span>
                            </div>

                            <div className="flex items-center gap-3 text-[11px] font-mono text-[#4B5A66]">
                              <span>{cmt.timestamp}</span>
                              <button
                                type="button"
                                onClick={() => handleUpvoteComment(threat.id, cmt.id)}
                                className={`px-2 py-0.5 rounded border transition-colors cursor-pointer flex items-center gap-1 ${
                                  cmt.isUpvotedByUser
                                    ? 'bg-[#0E2238] text-[#5FD3BF] border-[#0E2238]'
                                    : 'bg-white hover:bg-[#E9ECE6] text-[#16232F] border-[#C7CDC0]'
                                }`}
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span className="tabular-nums">{cmt.upvotes}</span>
                              </button>
                            </div>
                          </div>

                          <p className="text-xs text-[#16232F] leading-relaxed">
                            {cmt.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Mitigation Strategy Form */}
                  <form
                    onSubmit={(e) => handlePostMitigationComment(e, threat.id)}
                    className="p-4 rounded-xl bg-[#F3F5F1] border border-[#C7CDC0] space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label
                        htmlFor={`comment-input-${threat.id}`}
                        className="text-xs font-semibold text-[#0E2238]"
                      >
                        Contribute a Mitigation Strategy or Remediation Tip
                      </label>

                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          value={customAlias}
                          onChange={(e) =>
                            setCommentAuthorAlias((prev) => ({
                              ...prev,
                              [threat.id]: e.target.value,
                            }))
                          }
                          placeholder="Handle (optional)"
                          aria-label="Your defender handle (optional)"
                          className="px-2.5 py-1 bg-white border border-[#C7CDC0] rounded-md text-xs font-mono text-[#16232F] w-36 focus:outline-none focus:border-[#0E2238]"
                        />

                        <select
                          aria-label="Mitigation strategy category"
                          value={selectedCategory}
                          onChange={(e) =>
                            setCommentCategories((prev) => ({
                              ...prev,
                              [threat.id]: e.target.value as MitigationStrategyCategory,
                            }))
                          }
                          className="px-2.5 py-1 bg-white border border-[#C7CDC0] rounded-md text-xs font-mono text-[#0E2238] focus:outline-none focus:border-[#0E2238]"
                        >
                          {STRATEGY_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        id={`comment-input-${threat.id}`}
                        type="text"
                        required
                        value={draftText}
                        onChange={(e) =>
                          setCommentDrafts((prev) => ({
                            ...prev,
                            [threat.id]: e.target.value,
                          }))
                        }
                        placeholder="Share a concrete technical control, verification check, or containment step..."
                        className="flex-1 px-3.5 py-2 bg-white border border-[#C7CDC0] rounded-lg text-xs text-[#16232F] focus:outline-none focus:border-[#0E2238]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#0E2238] hover:bg-[#081420] text-[#F3F5F1] rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <Send className="w-3.5 h-3.5 text-[#5FD3BF]" />
                        <span>Post Strategy (+15 XP)</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          );
        })}
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
