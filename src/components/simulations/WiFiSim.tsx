import React, { useState } from 'react';
import { Wifi, WifiOff, ShieldCheck, AlertTriangle, Radio, CheckCircle, Lock, Unlock, RefreshCw } from 'lucide-react';
import { WIFI_HOTSPOTS, WiFiNetwork } from '../../data/scenarios';
import { BreachIncident } from '../../types';
import { playClickSound, playSuccessSound, playBreachAlertSound } from '../../utils/audio';

interface WiFiSimProps {
  onBreach: (incident: BreachIncident) => void;
  onSuccess: (xp: number, category: string, badgeId?: string) => void;
}

export const WiFiSim: React.FC<WiFiSimProps> = ({ onBreach, onSuccess }) => {
  const [selectedNetwork, setSelectedNetwork] = useState<WiFiNetwork>(WIFI_HOTSPOTS[0]);
  const [probedNetworkIds, setProbedNetworkIds] = useState<string[]>([]);
  const [connectedNetworkId, setConnectedNetworkId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'warn'; text: string; details: string[] } | null>(null);

  const handleScan = () => {
    playClickSound();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 400);
  };

  const handleProbe = (network: WiFiNetwork) => {
    playClickSound();
    if (!probedNetworkIds.includes(network.id)) {
      setProbedNetworkIds([...probedNetworkIds, network.id]);
    }
    setSelectedNetwork(network);

    if (network.isMalicious) {
      setMessage({
        type: 'warn',
        text: `PROBE ALERT: Suspicious telemetry on "${network.ssid}"!`,
        details: network.forensicBreakdown?.redFlags || ['Unencrypted traffic susceptible to packet sniffing.'],
      });
    } else {
      setMessage({
        type: 'success',
        text: `PROBE NOMINAL: "${network.ssid}" is encrypted with authentic vendor certificate.`,
        details: ['Valid WPA2/WPA3 handshake', 'Standard enterprise gateway address', 'No active DNS tampering detected'],
      });
    }
  };

  const handleConnect = (network: WiFiNetwork) => {
    playClickSound();
    setConnectedNetworkId(network.id);

    if (network.isMalicious) {
      playBreachAlertSound();
      const fb = network.forensicBreakdown;
      const incident: BreachIncident = {
        id: `inc-wifi-${Date.now()}`,
        timestamp: 'Just now',
        scenarioTitle: `Connected to Rogue Hotspot: ${network.ssid}`,
        category: 'Man-In-The-Middle (MITM) & Rogue Access Point',
        attackerTechnique: fb?.attackName || 'Rogue AP & SSL Strip (MITRE T1040)',
        mitreRef: 'MITRE T1040 / T1557',
        userMistake: `You joined an unencrypted rogue Wi-Fi network without checking the MAC address or verifying the captive portal SSL authenticity.`,
        redFlagsMissed: fb?.redFlags || [
          'No encryption required on public venue Wi-Fi',
          'Rogue router MAC address mismatch',
          'Prompted to accept untrusted root certificate',
        ],
        actionableTips: fb?.actionableTips || [
          'Use cellular 5G hotspot in cafes and airports instead of unverified open Wi-Fi.',
          'Always keep a reputable VPN active on public networks to encrypt all transit packets.',
          'Disable "Connect automatically to open networks" in your device settings.',
        ],
        recoverySteps: [
          'Immediately disconnect from the Wi-Fi and forget the network.',
          'Rotate passwords for any services opened while connected without a VPN.',
          'Verify your device has not installed any unauthorized mobile configuration profiles.',
        ],
        retested: false,
      };
      onBreach(incident);
    } else {
      playSuccessSound();
      setMessage({
        type: 'success',
        text: `Securely connected to "${network.ssid}"!`,
        details: [
          'Traffic is securely encrypted via WPA2-PSK.',
          'Attacker packet sniffers cannot read your sensitive communications.',
        ],
      });
      onSuccess(70, 'network', 'badge_airspace_guardian');
    }
  };

  return (
    <div className="space-y-6">
      {/* Simulation Concept Header */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <span>Simulation 02</span>
            <span aria-hidden="true">·</span>
            <span>Rogue Wi-Fi & Man-In-The-Middle Airspace</span>
          </div>
          <h2 className="text-lg font-bold text-white">
            Public Airspace Triage: Identify Evil Twins & Hotspot Traps
          </h2>
        </div>
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-cyan-300' : ''}`} />
          <span>{isScanning ? 'Scanning Airspace...' : 'Rescan Frequencies'}</span>
        </button>
      </div>

      {/* Two-Zone Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Discovered Wireless SSIDs */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Detected Wireless Signals (Downtown Cafe)
            </span>
            <span className="text-xs font-mono text-cyan-400">
              {WIFI_HOTSPOTS.length} Channels Monitored
            </span>
          </div>

          <div className="space-y-2.5">
            {WIFI_HOTSPOTS.map((hotspot) => {
              const isProbed = probedNetworkIds.includes(hotspot.id);
              const isSelected = selectedNetwork.id === hotspot.id;
              const isConnected = connectedNetworkId === hotspot.id;

              return (
                <div
                  key={hotspot.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-850 border-cyan-500/60 ring-1 ring-cyan-500/30'
                      : 'bg-slate-900/80 border-slate-800 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${
                        hotspot.security.includes('Open') || hotspot.security.includes('Captive')
                          ? 'bg-amber-950/60 text-amber-400 border border-amber-600/30'
                          : 'bg-emerald-950/60 text-emerald-400 border border-emerald-600/30'
                      }`}>
                        {hotspot.security.includes('Open') ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <span>{hotspot.ssid}</span>
                          {isConnected && (
                            <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700/60 px-1.5 py-0.5 rounded">
                              Connected
                            </span>
                          )}
                        </h4>
                        <span className="text-xs text-slate-400">
                          Security: <strong className="text-slate-300">{hotspot.security}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-400">
                        {hotspot.signalStrength} dBm
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 mb-3">
                    {hotspot.description}
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => handleProbe(hotspot)}
                      className="px-3 py-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-800/50 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>{isProbed ? 'Re-Probe Packets' : 'Probe Network Packets'}</span>
                    </button>

                    <button
                      onClick={() => handleConnect(hotspot)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isConnected
                          ? 'bg-slate-800 text-slate-400 cursor-default'
                          : 'bg-slate-200 hover:bg-white text-slate-950'
                      }`}
                    >
                      <Wifi className="w-3.5 h-3.5" />
                      <span>{isConnected ? 'Active Network' : 'Connect'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Packet & Gateway Telemetry */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Spectrum Telemetry: {selectedNetwork.ssid}</span>
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded font-mono ${
                selectedNetwork.isMalicious
                  ? 'bg-red-950/80 text-red-400 border border-red-800'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
              }`}>
                {selectedNetwork.isMalicious ? 'THREAT ANOMALY' : 'AUTHENTIC BEACON'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Gateway MAC Address:</span>
                  <span className={selectedNetwork.gatewayMac.includes('Pineapple') ? 'text-red-400 font-bold' : 'text-slate-300'}>
                    {selectedNetwork.gatewayMac}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">SSL Inspection Intercept:</span>
                  <span className={selectedNetwork.sslInspectionActive ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                    {selectedNetwork.sslInspectionActive ? 'DETECTED (Self-signed Root CA injected)' : 'NONE (Pure TLS 1.3)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">DNS Response Integrity:</span>
                  <span className={selectedNetwork.dnsHijacking ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                    {selectedNetwork.dnsHijacking ? 'SPOOFED (Local 192.168.1.1 Captive Redirection)' : 'VERIFIED (DoH / Cloudflare 1.1.1.1)'}
                  </span>
                </div>
              </div>

              {message && (
                <div className={`p-3.5 rounded-xl border ${
                  message.type === 'warn'
                    ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
                    : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
                }`}>
                  <h5 className="font-bold text-xs mb-1 flex items-center gap-1.5">
                    {message.type === 'warn' ? <AlertTriangle className="w-4 h-4 text-amber-400" /> : <CheckCircle className="w-4 h-4 text-emerald-400" />}
                    <span>{message.text}</span>
                  </h5>
                  <ul className="mt-2 space-y-1 text-[11px] text-slate-300">
                    {message.details.map((detail, idx) => (
                      <li key={idx}>• {detail}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actionable Defense Checklist for Public Wi-Fi */}
              <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2 text-xs">
                <span className="font-semibold text-slate-300">Youth Wi-Fi Safety Rulebook:</span>
                <ul className="space-y-1.5 text-slate-400 text-[11px]">
                  <li>• <strong className="text-slate-300">Open ≠ Free:</strong> Anyone can spin up a router named "Campus_Free_WiFi" for $40.</li>
                  <li>• <strong className="text-slate-300">HTTPS is not infallible:</strong> Evil twins can execute SSL-strip attacks to downgrade your connections.</li>
                  <li>• <strong className="text-slate-300">Cellular tethering:</strong> When submitting exams or logging into bank apps, always tether to your mobile 5G data.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
