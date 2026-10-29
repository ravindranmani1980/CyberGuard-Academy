import React, { useState } from 'react';
import { Wifi, ShieldCheck, AlertTriangle, Radio, CheckCircle, Lock, Unlock, RefreshCw } from 'lucide-react';
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
        text: `PROBE ALERT: Suspicious telemetry on "${network.ssid}"`,
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
        text: `Securely connected to "${network.ssid}"`,
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
      <div className="p-5 rounded-xl bg-white border border-[#D9DDD3] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="rm-kicker">MOD-02 / Wireless Airspace &amp; MITM Assessment</span>
          <h2 className="text-lg font-semibold text-[#0E2238]">
            Public Airspace Triage: Identify Evil Twins &amp; Hotspot Traps
          </h2>
        </div>
        <button
          type="button"
          onClick={handleScan}
          disabled={isScanning}
          className="px-3.5 py-2 bg-[#F3F5F1] hover:bg-[#E9ECE6] text-[#0E2238] border border-[#C7CDC0] rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-[#2BB5A0]' : ''}`} />
          <span>{isScanning ? 'Scanning Airspace...' : 'Rescan Frequencies'}</span>
        </button>
      </div>

      {/* Two-Zone Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Discovered Wireless SSIDs */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#4B5A66]">
              Detected Wireless Beacons (Downtown Venue)
            </span>
            <span className="text-xs font-mono text-[#0E2238]">
              {WIFI_HOTSPOTS.length} Channels Monitored
            </span>
          </div>

          <div className="space-y-3">
            {WIFI_HOTSPOTS.map((hotspot) => {
              const isProbed = probedNetworkIds.includes(hotspot.id);
              const isSelected = selectedNetwork.id === hotspot.id;
              const isConnected = connectedNetworkId === hotspot.id;

              return (
                <div
                  key={hotspot.id}
                  className={`p-5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-white border-[#0E2238] ring-1 ring-[#0E2238] shadow-xs'
                      : 'bg-[#F3F5F1] border-[#C7CDC0] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg border ${
                        hotspot.security.includes('Open') || hotspot.security.includes('Captive')
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {hotspot.security.includes('Open') ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-[#0E2238] flex items-center gap-2 font-mono">
                          <span>{hotspot.ssid}</span>
                          {isConnected && (
                            <span className="text-[10px] bg-[#0E2238] text-[#5FD3BF] px-2 py-0.5 rounded">
                              ACTIVE
                            </span>
                          )}
                        </h4>
                        <span className="text-xs text-[#4B5A66]">
                          Security Protocol: <strong className="text-[#16232F]">{hotspot.security}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono text-[#4B5A66] tabular-nums">
                        {hotspot.signalStrength} dBm
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#16232F] mb-3.5 leading-relaxed">
                    {hotspot.description}
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#D9DDD3]">
                    <button
                      type="button"
                      onClick={() => handleProbe(hotspot)}
                      className="px-3 py-1.5 text-xs font-mono font-medium text-[#0E2238] bg-[#F3F5F1] hover:bg-[#E9ECE6] border border-[#C7CDC0] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Radio className="w-3.5 h-3.5 text-[#2BB5A0]" />
                      <span>{isProbed ? 'Re-Probe Beacon' : 'Probe Beacon Packets'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleConnect(hotspot)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                        isConnected
                          ? 'bg-[#E9ECE6] text-[#4B5A66] cursor-default'
                          : 'bg-[#0E2238] hover:bg-[#081420] text-[#F3F5F1]'
                      }`}
                    >
                      <Wifi className="w-3.5 h-3.5 text-[#5FD3BF]" />
                      <span>{isConnected ? 'Active Session' : 'Connect'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Packet & Gateway Telemetry */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-6 rounded-xl bg-white border border-[#D9DDD3] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#D9DDD3] pb-3.5">
              <div>
                <span className="rm-kicker">Beacon Inspection Console</span>
                <h3 className="text-sm font-semibold text-[#0E2238] flex items-center gap-2 font-mono">
                  <ShieldCheck className="w-4 h-4 text-[#2BB5A0]" />
                  <span>{selectedNetwork.ssid}</span>
                </h3>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded font-mono font-medium ${
                selectedNetwork.isMalicious
                  ? 'bg-red-50 text-red-800 border border-red-200'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {selectedNetwork.isMalicious ? 'THREAT ANOMALY' : 'AUTHENTIC BEACON'}
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Dark telemetry card matching Postrix */}
              <div className="p-4 bg-[#081420] rounded-lg border border-[#3E6E86]/40 space-y-2 font-mono text-[11px] text-[#EEF3F1]">
                <div className="flex justify-between">
                  <span className="text-[#A9B7BF]">Gateway BSSID / Vendor:</span>
                  <span className={selectedNetwork.gatewayMac.includes('Pineapple') ? 'text-[#EBC385] font-semibold' : 'text-[#EEF3F1]'}>
                    {selectedNetwork.gatewayMac}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A9B7BF]">TLS / SSL Inspection:</span>
                  <span className={selectedNetwork.sslInspectionActive ? 'text-[#EBC385] font-semibold' : 'text-[#5FD3BF]'}>
                    {selectedNetwork.sslInspectionActive ? 'INTERCEPTED (Self-signed Root CA)' : 'NOMINAL (Pure TLS 1.3)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A9B7BF]">DNS Resolution Path:</span>
                  <span className={selectedNetwork.dnsHijacking ? 'text-red-400 font-semibold' : 'text-[#5FD3BF]'}>
                    {selectedNetwork.dnsHijacking ? 'SPOOFED (Local Captive Redirect)' : 'VERIFIED (DoH / 1.1.1.1)'}
                  </span>
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-lg border ${
                  message.type === 'warn'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                }`}>
                  <h5 className="font-bold text-xs mb-1 flex items-center gap-1.5">
                    {message.type === 'warn' ? <AlertTriangle className="w-4 h-4 text-amber-700" /> : <CheckCircle className="w-4 h-4 text-emerald-700" />}
                    <span>{message.text}</span>
                  </h5>
                  <ul className="mt-2 space-y-1 text-xs">
                    {message.details.map((detail, idx) => (
                      <li key={idx}>• {detail}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actionable Defense Checklist for Public Wi-Fi */}
              <div className="p-4 bg-[#F3F5F1] rounded-lg border border-[#D9DDD3] space-y-2 text-xs">
                <span className="font-semibold text-[#0E2238] block">Wireless Posture Hardening Blueprint:</span>
                <ul className="space-y-1.5 text-[#4B5A66] text-xs leading-relaxed">
                  <li>• <strong className="text-[#16232F]">Open ≠ Trusted:</strong> Commodity rogue access points can broadcast any SSID name in seconds.</li>
                  <li>• <strong className="text-[#16232F]">Never Install Captive Certificates:</strong> Reject any public network prompting for root certificate installation.</li>
                  <li>• <strong className="text-[#16232F]">Cellular Tethering:</strong> Prefer 5G personal hotspots or WireGuard VPN tunnels when handling sensitive sessions.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
