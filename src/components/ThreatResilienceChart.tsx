import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { TrendingUp, ShieldCheck } from 'lucide-react';
import { SessionScorePoint } from '../types';

interface ThreatResilienceChartProps {
  data: SessionScorePoint[];
  currentScore: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; dataKey: string; payload: SessionScorePoint }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="p-3.5 bg-[#081420] border border-[#3E6E86]/50 rounded-lg shadow-xl text-xs space-y-1.5 min-w-[180px] text-[#EEF3F1]">
        <div className="flex items-center justify-between border-b border-[#C9D3D9]/20 pb-1.5">
          <span className="font-semibold text-[#EEF3F1] font-mono">{item.session}</span>
          <span className="text-[10px] text-[#5FD3BF] font-mono uppercase">Session Record</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#A9B7BF]">Posture Score:</span>
          <span className="font-semibold font-mono text-[#5FD3BF] text-sm">{item.score}%</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#A9B7BF]">Drills Passed:</span>
          <span className="font-mono text-[#EEF3F1]">{item.drills} drills</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#A9B7BF]">Breaches Triggered:</span>
          <span className={`font-mono ${item.breaches > 1 ? 'text-[#EBC385]' : 'text-[#A9B7BF]'}`}>
            {item.breaches} {item.breaches === 1 ? 'breach' : 'breaches'}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export const ThreatResilienceChart: React.FC<ThreatResilienceChartProps> = ({ data, currentScore }) => {
  const chartData = data && data.length > 0 ? data : [
    { session: 'S-1', score: 52, breaches: 3, drills: 2 },
    { session: 'S-2', score: 58, breaches: 2, drills: 3 },
    { session: 'S-3', score: 61, breaches: 2, drills: 4 },
    { session: 'S-4', score: 65, breaches: 1, drills: 4 },
    { session: 'S-5', score: 67, breaches: 1, drills: 5 },
    { session: 'S-6', score: 70, breaches: 1, drills: 6 },
    { session: 'S-7 (Now)', score: currentScore, breaches: 1, drills: 7 },
  ];

  const firstScore = chartData[0]?.score || 50;
  const lastScore = chartData[chartData.length - 1]?.score || currentScore;
  const netDelta = lastScore - firstScore;
  const averageScore = Math.round(
    chartData.reduce((acc, curr) => acc + curr.score, 0) / chartData.length
  );

  return (
    <div className="p-6 rounded-xl bg-white border border-[#D9DDD3] shadow-xs space-y-5">
      {/* Chart Section Header matching Postrix */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#D9DDD3]">
        <div>
          <span className="rm-kicker">02 / Longitudinal Posture Telemetry</span>
          <h2 className="text-lg font-semibold text-[#0E2238] tracking-tight">
            7-Session Threat Resilience Trajectory
          </h2>
          <p className="text-xs text-[#4B5A66] mt-0.5">
            Longitudinal measurement of threat identification accuracy, incident triage speeds, and defensive posture over the last 7 sessions.
          </p>
        </div>

        {/* High-level performance indicators */}
        <div className="flex items-center gap-5 self-start sm:self-auto bg-[#F3F5F1] border border-[#D9DDD3] rounded-lg px-4 py-2.5">
          <div className="text-right">
            <span className="text-[11px] font-mono text-[#4B5A66] block mb-0.5 uppercase">7-Session Delta</span>
            <div className="flex items-center justify-end gap-1 font-mono text-sm font-semibold text-emerald-700 tabular-nums">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{netDelta >= 0 ? `+${netDelta}%` : `${netDelta}%`}</span>
            </div>
          </div>

          <div className="h-8 w-px bg-[#C7CDC0]" />

          <div className="text-right">
            <span className="text-[11px] font-mono text-[#4B5A66] block mb-0.5 uppercase">Rolling Mean</span>
            <span className="font-mono text-sm font-semibold text-[#0E2238] tabular-nums">
              {averageScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Area / Line Chart Container */}
      <div className="w-full h-64 sm:h-72 pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 15, right: 15, left: -15, bottom: 5 }}
          >
            <defs>
              <linearGradient id="postrixTealGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2BB5A0" stopOpacity={0.28} />
                <stop offset="95%" stopColor="#2BB5A0" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#D9DDD3"
              vertical={false}
            />

            <XAxis
              dataKey="session"
              stroke="#4B5A66"
              tick={{ fill: '#4B5A66', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
              tickLine={{ stroke: '#C7CDC0' }}
              axisLine={{ stroke: '#C7CDC0' }}
            />

            <YAxis
              domain={[30, 100]}
              stroke="#4B5A66"
              tick={{ fill: '#4B5A66', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
              tickLine={{ stroke: '#C7CDC0' }}
              axisLine={{ stroke: '#C7CDC0' }}
              unit="%"
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Target 70% Guardian Threshold line */}
            <ReferenceLine
              y={70}
              stroke="#D79A45"
              strokeDasharray="4 4"
              label={{
                value: 'Target Posture Baseline (70%)',
                fill: '#92400e',
                fontSize: 10,
                fontFamily: 'IBM Plex Mono',
                position: 'insideTopRight',
              }}
            />

            {/* Area fill under curve */}
            <Area
              type="monotone"
              dataKey="score"
              stroke="#0E2238"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#postrixTealGradient)"
              activeDot={{
                r: 6,
                fill: '#2BB5A0',
                stroke: '#081420',
                strokeWidth: 2,
              }}
            />

            {/* Subtle secondary line */}
            <Line
              type="monotone"
              dataKey="score"
              stroke="#2BB5A0"
              strokeWidth={2}
              dot={{
                r: 4,
                fill: '#FFFFFF',
                stroke: '#0E2238',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Narrative Chart Footnote */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#D9DDD3] text-xs text-[#4B5A66]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            Target posture baseline is <strong className="text-[#0E2238] font-mono">70%</strong>. Maintaining posture above this threshold verifies active resilience against social engineering and credential-harvesting vectors.
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono shrink-0 text-[#16232F]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0E2238]" />
            <span>Posture Score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#D79A45]" />
            <span>70% Baseline</span>
          </div>
        </div>
      </div>
    </div>
  );
};
