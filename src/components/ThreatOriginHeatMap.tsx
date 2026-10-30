import React, { useState, useMemo } from 'react';
import { Globe, ShieldAlert, Crosshair, ChevronRight, Radio } from 'lucide-react';
import { UserStats, BreachIncident, SimulationType } from '../types';
import { playClickSound } from '../utils/audio';

interface ThreatOriginHeatMapProps {
  stats: UserStats;
  incidents: BreachIncident[];
  onLaunchSimulation: (simType: SimulationType) => void;
}

interface GeoThreatNode {
  id: string;
  regionName: string;
  coordinatesLabel: string;
  svgX: number; // 0 to 800 viewBox
  svgY: number; // 0 to 400 viewBox
  vectorCategory: 'Phishing' | 'Wireless/MITM' | 'Social/OAuth' | 'Credentials' | 'Ransomware';
  simType: SimulationType;
  asnSignature: string;
  sampleIoc: string;
  mitreRef: string;
  severity: 'Critical' | 'High' | 'Elevated';
  simulatedEventsCount: number;
  blockedRate: number;
  activeBreachesFromRegion: number;
  description: string;
}

export const ThreatOriginHeatMap: React.FC<ThreatOriginHeatMapProps> = ({
  stats,
  incidents,
  onLaunchSimulation,
}) => {
  const [selectedVector, setSelectedVector] = useState<string>('All');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-ee-phish');

  // Compute dynamic geographical threat telemetry based on user simulation data & breach history
  const geoNodes: GeoThreatNode[] = useMemo(() => {
    const baseDrills = Math.max(1, stats.simulationsCompleted);
    const phishingBreaches = incidents.filter(
      (i) => i.category.toLowerCase().includes('phish') || i.category.toLowerCase().includes('quish')
    ).length;
    const wifiBreaches = incidents.filter(
      (i) => i.category.toLowerCase().includes('mitm') || i.category.toLowerCase().includes('wi-fi') || i.category.toLowerCase().includes('rogue')
    ).length;
    const socialBreaches = incidents.filter(
      (i) => i.category.toLowerCase().includes('social') || i.category.toLowerCase().includes('oauth')
    ).length;
    const ransomBreaches = incidents.filter(
      (i) => i.category.toLowerCase().includes('ransom') || i.category.toLowerCase().includes('extortion')
    ).length;

    return [
      {
        id: 'node-ee-phish',
        regionName: 'Eastern Europe Bulletproof VPS Cluster',
        coordinatesLabel: '55.75°N, 37.61°E',
        svgX: 468,
        svgY: 112,
        vectorCategory: 'Phishing',
        simType: 'phishing',
        asnSignature: 'AS49505 · bounce-gateway@malicious-vps.ru',
        sampleIoc: 'disccrd-nitro-promo[.]site / aid-portal[.]net',
        mitreRef: 'MITRE T1566.002',
        severity: 'Critical',
        simulatedEventsCount: 18 + baseDrills * 4 + phishingBreaches * 3,
        blockedRate: stats.categoryMastery.phishing,
        activeBreachesFromRegion: phishingBreaches,
        description:
          'Origin of lookalike domain typosquatting, Discord Nitro token harvesters, and double-extension (.pdf.exe) bursar refund traps.',
      },
      {
        id: 'node-na-wifi',
        regionName: 'North America Venue Airspace Nodes',
        coordinatesLabel: '37.77°N, 122.41°W',
        svgX: 162,
        svgY: 148,
        vectorCategory: 'Wireless/MITM',
        simType: 'wifi',
        asnSignature: 'IEEE 802.11 Rogue Beacon · WiFi Pineapple Mark VII',
        sampleIoc: 'SSID: CampusCafe_Free_WiFi (00:14:22:98:A1:C4)',
        mitreRef: 'MITRE T1040 / T1557',
        severity: 'High',
        simulatedEventsCount: 14 + baseDrills * 3 + wifiBreaches * 2,
        blockedRate: stats.categoryMastery.network,
        activeBreachesFromRegion: wifiBreaches,
        description:
          'Local wireless Evil Twin access points, SSL-stripping captive portals, and physical QR sticker overlays in urban transit & campus zones.',
      },
      {
        id: 'node-we-oauth',
        regionName: 'Western Europe OAuth & Token Relay Grid',
        coordinatesLabel: '50.11°N, 8.68°E',
        svgX: 405,
        svgY: 126,
        vectorCategory: 'Social/OAuth',
        simType: 'social_eng',
        asnSignature: 'AS24940 · Cloud Relay Proxy Node',
        sampleIoc: 'discord-auth-verify[.]xyz / Instagram OTP Forwarder',
        mitreRef: 'MITRE T1528 / T1539',
        severity: 'Critical',
        simulatedEventsCount: 16 + baseDrills * 3 + socialBreaches * 4,
        blockedRate: stats.categoryMastery.socialEng,
        activeBreachesFromRegion: socialBreaches,
        description:
          'Automated social engineering DM relays and malicious OAuth permission grants impersonating tournament bots and compromised peers.',
      },
      {
        id: 'node-sa-cred',
        regionName: 'South America Credential Stuffing Mesh',
        coordinatesLabel: '23.55°S, 46.63°W',
        svgX: 276,
        svgY: 282,
        vectorCategory: 'Credentials',
        simType: 'password',
        asnSignature: 'AS28573 · Distributed GPU Hash Cluster',
        sampleIoc: 'Hashcat NTLM / Leetspeak Dictionary Replay',
        mitreRef: 'MITRE T1110.004',
        severity: 'Elevated',
        simulatedEventsCount: 11 + baseDrills * 2,
        blockedRate: stats.categoryMastery.passwords,
        activeBreachesFromRegion: stats.categoryMastery.passwords < 60 ? 1 : 0,
        description:
          'High-throughput GPU credential-stuffing bots testing reused student passwords and low-entropy dictionary combinations.',
      },
      {
        id: 'node-sea-ransom',
        regionName: 'Southeast Asia Ransomware C2 Relay',
        coordinatesLabel: '1.35°N, 103.81°E',
        svgX: 615,
        svgY: 238,
        vectorCategory: 'Ransomware',
        simType: 'ransomware',
        asnSignature: 'AS132203 · Encrypted C2 Telemetry Tunnel',
        sampleIoc: 'host_svc32.exe (AES-256-CBC LockBit Strain)',
        mitreRef: 'MITRE T1486',
        severity: 'Critical',
        simulatedEventsCount: 12 + baseDrills * 3 + ransomBreaches * 3,
        blockedRate: stats.categoryMastery.incidentResponse,
        activeBreachesFromRegion: ransomBreaches,
        description:
          'Command-and-control key exchange servers orchestrating rapid local file encryption and Bitcoin extortion demands.',
      },
      {
        id: 'node-ea-apk',
        regionName: 'East Asia Mobile APK & SMS Siphon Hub',
        coordinatesLabel: '35.67°N, 139.65°E',
        svgX: 678,
        svgY: 154,
        vectorCategory: 'Social/OAuth',
        simType: 'phishing',
        asnSignature: 'AS17676 · Sideload APK Distribution CDN',
        sampleIoc: 'spotify-unlocked-2026[.]apk (READ_SMS / ACCESSIBILITY)',
        mitreRef: 'MITRE T1417.002',
        severity: 'High',
        simulatedEventsCount: 15 + baseDrills * 2,
        blockedRate: Math.round((stats.categoryMastery.phishing + stats.categoryMastery.socialEng) / 2),
        activeBreachesFromRegion: 0,
        description:
          'Distribution nodes hosting trojanized mobile mods designed to abuse Android Accessibility permissions and intercept 2FA SMS codes.',
      },
    ];
  }, [stats, incidents]);

  const vectorFilters = ['All', 'Phishing', 'Wireless/MITM', 'Social/OAuth', 'Credentials', 'Ransomware'];

  const filteredNodes = useMemo(() => {
    if (selectedVector === 'All') return geoNodes;
    return geoNodes.filter((n) => n.vectorCategory === selectedVector);
  }, [geoNodes, selectedVector]);

  const activeNode = useMemo(() => {
    return (
      filteredNodes.find((n) => n.id === selectedNodeId) ||
      filteredNodes[0] ||
      geoNodes[0]
    );
  }, [filteredNodes, selectedNodeId, geoNodes]);

  const totalSimulatedIntercepts = useMemo(
    () => geoNodes.reduce((acc, n) => acc + n.simulatedEventsCount, 0),
    [geoNodes]
  );

  return (
    <section className="p-6 rounded-xl bg-white border border-[#D9DDD3] shadow-xs space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D9DDD3]">
        <div>
          <span className="rm-kicker">03 / Global Threat Origin Telemetry &amp; Vector Attribution</span>
          <h2 className="text-lg font-semibold text-[#0E2238] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#2BB5A0]" />
            <span>Geographical Threat Heat Map (Simulation Telemetry)</span>
          </h2>
          <p className="text-xs text-[#4B5A66] mt-0.5">
            Spatial distribution of simulated attack origins, C2 relays, and intercepted threat vectors correlated with your drill history.
          </p>
        </div>

        {/* Vector Filter Bar */}
        <div className="flex items-center gap-1.5 bg-[#F3F5F1] border border-[#D9DDD3] p-1 rounded-lg overflow-x-auto text-xs self-start sm:self-auto">
          {vectorFilters.map((vec) => (
            <button
              key={vec}
              type="button"
              onClick={() => {
                playClickSound();
                setSelectedVector(vec);
              }}
              className={`px-2.5 py-1 rounded-md font-mono text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                selectedVector === vec
                  ? 'bg-[#0E2238] text-[#F3F5F1] font-semibold'
                  : 'text-[#4B5A66] hover:text-[#0E2238]'
              }`}
            >
              {vec}
            </button>
          ))}
        </div>
      </div>

      {/* Map + Inspector Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive World Heat Map SVG Canvas */}
        <div className="lg:col-span-7 bg-[#081420] border border-[#3E6E86]/50 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
          {/* Top HUD Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#C9D3D9]/15 text-[11px] font-mono text-[#A9B7BF]">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-[#5FD3BF]" />
              <span className="text-[#EEF3F1] font-semibold">GLOBAL ORIGIN TELEMETRY</span>
            </div>
            <div className="flex items-center gap-3">
              <span>
                Intercepted Signals: <strong className="text-[#5FD3BF] tabular-nums">{totalSimulatedIntercepts}</strong>
              </span>
              <span>·</span>
              <span>
                Active Zones: <strong className="text-[#EBC385] tabular-nums">{filteredNodes.length}</strong>
              </span>
            </div>
          </div>

          {/* World SVG Map */}
          <div className="my-2 relative w-full aspect-[2/1] select-none">
            <svg
              viewBox="0 0 800 400"
              className="w-full h-full"
              role="img"
              aria-label="Global cybersecurity threat origin heat map"
            >
              <defs>
                <radialGradient id="heatCritical" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
                  <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heatHigh" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ebc385" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#d79a45" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#d79a45" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="heatElevated" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#5fd3bf" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#2bb5a0" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2bb5a0" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Latitude / Longitude Graticule Grid */}
              {[80, 160, 240, 320].map((y) => (
                <line
                  key={`lat-${y}`}
                  x1="0"
                  y1={y}
                  x2="800"
                  y2={y}
                  stroke="#3E6E86"
                  strokeOpacity="0.2"
                  strokeDasharray="3 3"
                />
              ))}
              {[133, 266, 400, 533, 666].map((x) => (
                <line
                  key={`lon-${x}`}
                  x1={x}
                  y1="0"
                  x2={x}
                  y2="400"
                  stroke="#3E6E86"
                  strokeOpacity="0.2"
                  strokeDasharray="3 3"
                />
              ))}

              {/* Simplified Stylized World Continents Silhouette */}
              <g fill="#102236" stroke="#3E6E86" strokeWidth="1" strokeOpacity="0.55">
                {/* North America */}
                <path d="M 75 70 L 210 65 L 250 115 L 220 175 L 185 205 L 145 185 L 105 140 Z" />
                {/* Greenland */}
                <path d="M 255 40 L 315 35 L 305 75 L 265 78 Z" />
                {/* South America */}
                <path d="M 215 215 L 285 225 L 310 275 L 275 355 L 235 345 L 220 270 Z" />
                {/* Europe */}
                <path d="M 365 75 L 485 68 L 505 135 L 445 152 L 385 145 L 360 115 Z" />
                {/* Africa */}
                <path d="M 365 162 L 465 165 L 505 225 L 470 325 L 415 330 L 385 255 L 355 210 Z" />
                {/* Asia */}
                <path d="M 495 68 L 710 75 L 735 155 L 675 225 L 595 235 L 535 190 L 495 138 Z" />
                {/* Japan / East Asia Archipelago */}
                <path d="M 672 135 L 696 142 L 688 172 L 668 165 Z" />
                {/* Southeast Asia / Indonesia */}
                <path d="M 595 238 L 665 245 L 675 272 L 605 268 Z" />
                {/* Australia */}
                <path d="M 615 285 L 715 282 L 725 345 L 635 352 L 605 320 Z" />
              </g>

              {/* Simulated Vector Arcs connecting nodes to Defender Hub */}
              {filteredNodes.map((node) => {
                const isSelected = activeNode.id === node.id;
                return (
                  <path
                    key={`arc-${node.id}`}
                    d={`M ${node.svgX} ${node.svgY} Q 400 50 ${activeNode.svgX} ${activeNode.svgY}`}
                    fill="none"
                    stroke={isSelected ? '#5FD3BF' : '#3E6E86'}
                    strokeWidth={isSelected ? '1.5' : '0.75'}
                    strokeDasharray="4 4"
                    strokeOpacity={isSelected ? '0.75' : '0.3'}
                  />
                );
              })}

              {/* Heat Map Nodes */}
              {filteredNodes.map((node) => {
                const isSelected = activeNode.id === node.id;
                const heatRadius = Math.min(58, 28 + node.simulatedEventsCount * 0.9);
                const gradientId =
                  node.severity === 'Critical'
                    ? 'url(#heatCritical)'
                    : node.severity === 'High'
                    ? 'url(#heatHigh)'
                    : 'url(#heatElevated)';

                const coreColor =
                  node.severity === 'Critical'
                    ? '#ef4444'
                    : node.severity === 'High'
                    ? '#ebc385'
                    : '#5fd3bf';

                return (
                  <g
                    key={node.id}
                    onClick={() => {
                      playClickSound();
                      setSelectedNodeId(node.id);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Outer Heat Glow */}
                    <circle
                      cx={node.svgX}
                      cy={node.svgY}
                      r={heatRadius}
                      fill={gradientId}
                    />

                    {/* Selection Ring */}
                    {isSelected && (
                      <circle
                        cx={node.svgX}
                        cy={node.svgY}
                        r={16}
                        fill="none"
                        stroke="#5FD3BF"
                        strokeWidth="1.75"
                        strokeDasharray="3 2"
                      />
                    )}

                    {/* Core Node Dot */}
                    <circle
                      cx={node.svgX}
                      cy={node.svgY}
                      r={isSelected ? 7 : 5.5}
                      fill={coreColor}
                      stroke="#081420"
                      strokeWidth="2"
                    />

                    {/* Map Node Callout Label */}
                    <g transform={`translate(${node.svgX + 10}, ${node.svgY - 8})`}>
                      <rect
                        x="0"
                        y="-10"
                        width={isSelected ? 112 : 86}
                        height="18"
                        rx="4"
                        fill="#081420"
                        fillOpacity="0.88"
                        stroke={isSelected ? '#5FD3BF' : '#3E6E86'}
                        strokeWidth="0.8"
                      />
                      <text
                        x="6"
                        y="2"
                        fill={isSelected ? '#5FD3BF' : '#EEF3F1'}
                        fontSize="9"
                        fontFamily="IBM Plex Mono, monospace"
                      >
                        {node.vectorCategory} ({node.simulatedEventsCount})
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Legend Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#C9D3D9]/15 text-[11px] font-mono text-[#A9B7BF]">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                <span>Critical Heat Zone</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EBC385] inline-block" />
                <span>High Activity</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5FD3BF] inline-block" />
                <span>Elevated Probe</span>
              </span>
            </div>
            <span className="text-[#5FD3BF]">Click any heat zone node to inspect</span>
          </div>
        </div>

        {/* Right: Selected Region Telemetry Inspector & Regional List */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {activeNode && (
            <div className="p-5 rounded-xl bg-[#F3F5F1] border border-[#C7CDC0] space-y-3.5">
              <div className="flex items-start justify-between gap-2 border-b border-[#D9DDD3] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-semibold text-[#0E2238] bg-white border border-[#C7CDC0] px-2 py-0.5 rounded">
                      {activeNode.vectorCategory}
                    </span>
                    <span className="text-[11px] font-mono text-[#4B5A66]">
                      {activeNode.coordinatesLabel}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#0E2238] mt-1.5">
                    {activeNode.regionName}
                  </h3>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border shrink-0 ${
                    activeNode.severity === 'Critical'
                      ? 'bg-red-50 text-red-800 border-red-200'
                      : activeNode.severity === 'High'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {activeNode.severity.toUpperCase()}
                </span>
              </div>

              <p className="text-xs text-[#16232F] leading-relaxed">
                {activeNode.description}
              </p>

              {/* Technical Attribution Block */}
              <div className="p-3 bg-[#081420] rounded-lg border border-[#3E6E86]/40 font-mono text-[11px] space-y-1 text-[#EEF3F1]">
                <div className="flex justify-between gap-2">
                  <span className="text-[#A9B7BF]">ASN / Source:</span>
                  <span className="text-[#5FD3BF] text-right truncate">{activeNode.asnSignature}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#A9B7BF]">Observed IOC:</span>
                  <span className="text-[#EBC385] text-right truncate">{activeNode.sampleIoc}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#A9B7BF]">MITRE Mapping:</span>
                  <span className="text-[#EEF3F1]">{activeNode.mitreRef}</span>
                </div>
              </div>

              {/* Metrics Strip */}
              <div className="grid grid-cols-3 gap-2.5 text-center">
                <div className="p-2.5 bg-white rounded-lg border border-[#D9DDD3]">
                  <span className="text-[10px] font-mono text-[#4B5A66] block uppercase">Signals</span>
                  <span className="text-sm font-mono font-semibold text-[#0E2238] tabular-nums">
                    {activeNode.simulatedEventsCount}
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-[#D9DDD3]">
                  <span className="text-[10px] font-mono text-[#4B5A66] block uppercase">Your Mastery</span>
                  <span className="text-sm font-mono font-semibold text-emerald-700 tabular-nums">
                    {activeNode.blockedRate}%
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-[#D9DDD3]">
                  <span className="text-[10px] font-mono text-[#4B5A66] block uppercase">Breaches</span>
                  <span className="text-sm font-mono font-semibold text-red-700 tabular-nums">
                    {activeNode.activeBreachesFromRegion}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onLaunchSimulation(activeNode.simType);
                }}
                className="w-full py-2 px-3.5 bg-[#0E2238] hover:bg-[#081420] text-[#F3F5F1] rounded-lg text-xs font-medium transition-colors flex items-center justify-between cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-[#5FD3BF]" />
                  <span>Run {activeNode.vectorCategory} Defense Drill</span>
                </span>
                <ChevronRight className="w-4 h-4 text-[#5FD3BF]" />
              </button>
            </div>
          )}

          {/* Compact Regional Selector List */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono font-semibold uppercase text-[#4B5A66] px-1 block">
              Monitored Regional Threat Clusters
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {geoNodes.map((n) => {
                const isCurrent = activeNode.id === n.id;
                return (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setSelectedVector('All');
                      setSelectedNodeId(n.id);
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isCurrent
                        ? 'bg-[#0E2238] border-[#0E2238] text-[#F3F5F1]'
                        : 'bg-[#F3F5F1] border-[#D9DDD3] text-[#16232F] hover:bg-white'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">{n.regionName}</div>
                      <div
                        className={`text-[10px] font-mono ${
                          isCurrent ? 'text-[#5FD3BF]' : 'text-[#4B5A66]'
                        }`}
                      >
                        {n.vectorCategory} · {n.simulatedEventsCount} events
                      </div>
                    </div>
                    <ShieldAlert
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isCurrent ? 'text-[#EBC385]' : 'text-[#4B5A66]'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
