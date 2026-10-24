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
import { TrendingUp, ShieldCheck, Activity, AlertOctagon } from 'lucide-react';
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

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const item = payload[0].payload;
    return (
      <div className="p-3 bg-slate-950/95 border border-cyan-500/40 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-1.5 font-sans min-w-[170px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="font-bold text-white font-mono">{item.session}</span>
          <span className="text-[10px] text-cyan-400 font-mono">AUDIT RECORD</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Resilience Score:</span>
          <span className="font-bold font-mono text-cyan-300 text-sm">{item.score}%</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Drills Completed:</span>
          <span className="font-mono text-emerald-400">{item.drills} drills</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Breaches Incurred:</span>
          <span className={`font-mono ${item.breaches > 1 ? 'text-amber-400' : 'text-slate-400'}`}>
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
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
      {/* Chart Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Weekly Threat Resilience Trend</span>
            <span aria-hidden="true">·</span>
            <span>Last 7 Sessions</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Defense Score Trajectory Over Time
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Empirical measurement of your threat identification accuracy, incident triage speeds, and breach mitigation habits.
          </p>
        </div>

        {/* High-level performance indicators */}
        <div className="flex items-center gap-4 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block mb-0.5">7-Session Growth</span>
            <div className="flex items-center gap-1 font-mono text-sm font-bold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{netDelta >= 0 ? `+${netDelta}%` : `${netDelta}%`}</span>
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800 hidden sm:block" />

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block mb-0.5">Rolling Average</span>
            <span className="font-mono text-sm font-bold text-cyan-300">
              {averageScore}%
            </span>
          </div>
        </div>
      </div>

      {/* Recharts Area / Line Chart Container */}
      <div className="w-full h-64 sm:h-72 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 15, right: 15, left: -15, bottom: 5 }}
          >
            <defs>
              <linearGradient id="cyberCyanGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />

            <XAxis
              dataKey="session"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              tickLine={{ stroke: '#334155' }}
              axisLine={{ stroke: '#334155' }}
            />

            <YAxis
              domain={[30, 100]}
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              tickLine={{ stroke: '#334155' }}
              axisLine={{ stroke: '#334155' }}
              unit="%"
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Target 70% Guardian Threshold line */}
            <ReferenceLine
              y={70}
              stroke="#10b981"
              strokeDasharray="4 4"
              label={{
                value: 'Guardian Baseline (70%)',
                fill: '#34d399',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />

            {/* Area fill under curve */}
            <Area
              type="monotone"
              dataKey="score"
              stroke="#06b6d4"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#cyberCyanGradient)"
              activeDot={{
                r: 6,
                fill: '#22d3ee',
                stroke: '#083344',
                strokeWidth: 2,
              }}
            />

            {/* Subtle trendline */}
            <Line
              type="monotone"
              dataKey="score"
              stroke="#38bdf8"
              strokeWidth={2}
              dot={{
                r: 4,
                fill: '#0f172a',
                stroke: '#06b6d4',
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Narrative Chart Footnote */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Target threshold is <strong>70%</strong>. Maintaining a score above this benchmark grants active protection against automated social engineering bot campaigns.
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>Resilience Score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 bg-emerald-400" />
            <span>Target Benchmark</span>
          </div>
        </div>
      </div>
    </div>
  );
};
