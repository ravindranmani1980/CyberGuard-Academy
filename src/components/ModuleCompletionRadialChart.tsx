import React from 'react';
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { CheckCircle2, Play, ShieldCheck } from 'lucide-react';
import { UserStats, SimulationType } from '../types';
import { playClickSound } from '../utils/audio';

interface ModuleCompletionRadialChartProps {
  stats: UserStats;
  onLaunchSimulation: (simType: SimulationType) => void;
}

interface RadialModuleDatum {
  name: string;
  shortCode: string;
  simType: SimulationType;
  completion: number;
  fill: string;
  targetNote: string;
}

interface CustomRadialTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: RadialModuleDatum;
  }>;
}

const CustomRadialTooltip: React.FC<CustomRadialTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0].payload;

  return (
    <div className="bg-[#081420] border border-[#3E6E86]/70 rounded-lg p-3 shadow-xl text-xs text-[#EEF3F1] space-y-1">
      <div className="flex items-center justify-between gap-4 border-b border-[#C9D3D9]/15 pb-1 font-mono">
        <span className="text-[#5FD3BF] font-semibold">{item.shortCode}</span>
        <span className="text-[#EBC385]">{item.completion}% Complete</span>
      </div>
      <div className="font-semibold text-[#EEF3F1]">{item.name}</div>
      <div className="text-[11px] text-[#A9B7BF]">{item.targetNote}</div>
    </div>
  );
};

export const ModuleCompletionRadialChart: React.FC<ModuleCompletionRadialChartProps> = ({
  stats,
  onLaunchSimulation,
}) => {
  // Ordered from outer ring to inner ring for Recharts RadialBarChart
  const radialData: RadialModuleDatum[] = [
    {
      name: 'Incident Response & Ransomware',
      shortCode: 'MOD-05',
      simType: 'ransomware',
      completion: stats.categoryMastery.incidentResponse,
      fill: '#3E6E86',
      targetNote: '45-second containment & rogue PID termination',
    },
    {
      name: 'Password Entropy & Cryptography',
      shortCode: 'MOD-04',
      simType: 'password',
      completion: stats.categoryMastery.passwords,
      fill: '#D79A45',
      targetNote: 'GPU crack resistance & high-entropy passphrases',
    },
    {
      name: 'Social Engineering & OTP Defense',
      shortCode: 'MOD-03',
      simType: 'social_eng',
      completion: stats.categoryMastery.socialEng,
      fill: '#5E9C97',
      targetNote: 'Impersonation detection & 2FA code protection',
    },
    {
      name: 'Rogue Wi-Fi & Network Airspace',
      shortCode: 'MOD-02',
      simType: 'wifi',
      completion: stats.categoryMastery.network,
      fill: '#2BB5A0',
      targetNote: 'Evil Twin hotspot & MITM packet inspection',
    },
    {
      name: 'Email & Quishing Defense',
      shortCode: 'MOD-01',
      simType: 'phishing',
      completion: stats.categoryMastery.phishing,
      fill: '#0E2238',
      targetNote: 'Header authentication, lookalike URLs & QR payloads',
    },
  ];

  const totalCompletionAvg = Math.round(
    radialData.reduce((acc, item) => acc + item.completion, 0) / radialData.length
  );

  // Display in ascending order MOD-01 -> MOD-05 for the interactive legend list
  const orderedList = [...radialData].reverse();
  const fullyMasteredCount = orderedList.filter((m) => m.completion >= 80).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
      {/* Left 5 Columns: Recharts RadialBarChart Container */}
      <div className="lg:col-span-5 p-5 rounded-xl bg-[#F3F5F1] border border-[#D9DDD3] flex flex-col items-center justify-center relative">
        <div className="w-full flex items-center justify-between text-xs mb-1">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#4B5A66]">
            Multi-Module Radial Telemetry
          </span>
          <span className="font-mono text-[11px] font-semibold text-[#0E2238] bg-white px-2 py-0.5 rounded border border-[#C7CDC0]">
            {fullyMasteredCount}/5 Modules ≥ 80%
          </span>
        </div>

        <div className="w-full h-[270px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="28%"
              outerRadius="96%"
              barSize={14}
              data={radialData}
              startAngle={90}
              endAngle={-270}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                angleAxisId={0}
                tick={false}
              />
              <RadialBar
                background={{ fill: '#DCE1D7' }}
                dataKey="completion"
                cornerRadius={8}
              />
              <Tooltip content={<CustomRadialTooltip />} />
            </RadialBarChart>
          </ResponsiveContainer>

          {/* Center Aggregate Completion Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#4B5A66]">
              TOTAL COMPLETION
            </span>
            <span className="text-2xl font-bold font-mono text-[#0E2238] tabular-nums">
              {totalCompletionAvg}%
            </span>
          </div>
        </div>

        <div className="w-full pt-2 border-t border-[#D9DDD3] flex items-center justify-between text-[11px] text-[#4B5A66] font-mono">
          <span>Rings: MOD-01 (Outer) → MOD-05 (Inner)</span>
          <span className="text-[#0E2238] font-semibold">100% Scale</span>
        </div>
      </div>

      {/* Right 7 Columns: Module-by-Module Completion Breakdown & Quick Launch */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
          <div>
            <h3 className="text-sm font-semibold text-[#0E2238] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2BB5A0]" />
              <span>Training Curriculum Completion Breakdown</span>
            </h3>
            <p className="text-xs text-[#4B5A66]">
              Each concentric ring in the radial chart tracks your verified completion percentage per training module.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-[#0E2238] bg-[#F3F5F1] border border-[#C7CDC0] px-2.5 py-1 rounded tabular-nums">
            Aggregate: {totalCompletionAvg}% Complete
          </span>
        </div>

        <div className="space-y-2.5">
          {orderedList.map((mod) => {
            const isProficient = mod.completion >= 80;
            return (
              <div
                key={mod.shortCode}
                className="p-3.5 rounded-xl bg-[#F3F5F1] border border-[#D9DDD3] hover:border-[#0E2238] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-xs shrink-0"
                        style={{ backgroundColor: mod.fill }}
                        aria-hidden="true"
                      />
                      <span className="text-[11px] font-mono font-semibold text-[#4B5A66]">
                        {mod.shortCode}
                      </span>
                      <span className="text-xs font-semibold text-[#0E2238]">
                        {mod.name}
                      </span>
                      {isProficient && (
                        <CheckCircle2
                          className="w-3.5 h-3.5 text-emerald-700 shrink-0"
                          aria-label="Proficient"
                        />
                      )}
                    </div>
                    <span className="text-xs font-mono font-bold text-[#0E2238] tabular-nums">
                      {mod.completion}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-[#D9DDD3] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${mod.completion}%`,
                        backgroundColor: mod.fill,
                      }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onLaunchSimulation(mod.simType);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#0E2238] text-[#0E2238] hover:text-[#F3F5F1] border border-[#C7CDC0] hover:border-[#0E2238] text-xs font-mono font-medium transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-center shrink-0"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Train Module</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
