import React from 'react';
import useAdminLanguage from '../../hooks/admin/useAdminLanguage.js';

export const SimpleChart = ({
  type = 'bar', // 'bar', 'area', 'donut'
  title,
  subtitle,
  data = [], // [{ label: string, value: number, secondaryValue?: number, color?: string }]
  emptyMessage,
  height = 220,
  className = ''
}) => {
  const { t } = useAdminLanguage();

  const hasData = Array.isArray(data) && data.length > 0 && data.some((d) => (d.value || 0) > 0);

  return (
    <div
      className={`p-5 rounded-2xl bg-[#FFFDF8] dark:bg-[#33372E] border border-[#E9D8B9]/70 dark:border-stone-700/60 rustic-shadow-1 flex flex-col justify-between ${className}`}
    >
      <div className="mb-4">
        {title && (
          <h4 className="font-serif-brand text-lg font-bold text-[#282B24] dark:text-[#F7F0E3]">
            {title}
          </h4>
        )}
        {subtitle && (
          <p className="text-xs text-[#795640] dark:text-[#A5AD91] mt-0.5">
            {subtitle}
          </p>
        )}
      </div>

      {!hasData ? (
        <div
          className="flex flex-col items-center justify-center text-center p-6 rounded-xl bg-[#F7F0E3]/40 dark:bg-[#282B24]/40 border border-dashed border-[#E9D8B9] dark:border-stone-700"
          style={{ minHeight: height }}
        >
          <span className="material-symbols-outlined !text-3xl text-[#795640]/50 dark:text-[#A5AD91]/50 mb-2">
            query_stats
          </span>
          <span className="text-xs font-semibold text-[#795640] dark:text-[#A5AD91]">
            {emptyMessage || t('noDataDescription')}
          </span>
        </div>
      ) : type === 'donut' ? (
        <DonutChart data={data} height={height} />
      ) : type === 'area' ? (
        <AreaChart data={data} height={height} />
      ) : (
        <BarChart data={data} height={height} />
      )}
    </div>
  );
};

const BarChart = ({ data, height }) => {
  const maxValue = Math.max(...data.map((d) => d.value || 0), 1);

  return (
    <div className="w-full flex flex-col justify-end" style={{ height }}>
      <div className="flex-1 flex items-end gap-2 pb-2 border-b border-[#E9D8B9]/60 dark:border-stone-700/60">
        {data.map((item, idx) => {
          const pct = Math.max(4, Math.round(((item.value || 0) / maxValue) * 100));
          const color = item.color || '#3E5035';
          return (
            <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-2 py-1 rounded bg-[#282B24] text-[#FFFDF8] text-[10px] whitespace-nowrap pointer-events-none z-10">
                {item.label}: {item.value}
              </div>
              <div
                className="w-full max-w-[36px] rounded-t-md transition-all duration-300 group-hover:brightness-110"
                style={{
                  height: `${pct}%`,
                  backgroundColor: color
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-2 pt-2 text-[10px] font-medium text-[#795640] dark:text-[#A5AD91]">
        {data.map((item, idx) => (
          <div key={idx} className="flex-1 text-center truncate" title={item.label}>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

const AreaChart = ({ data, height }) => {
  const maxValue = Math.max(...data.map((d) => d.value || 0), 1);
  const width = 500;
  const paddingY = 20;
  const chartHeight = height - 40;

  const points = data.map((d, i) => {
    const x = (i / Math.max(1, data.length - 1)) * (width - 40) + 20;
    const y = chartHeight - ((d.value || 0) / maxValue) * (chartHeight - paddingY) + paddingY;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${width - 20},${chartHeight + paddingY} L 20,${chartHeight + paddingY} Z`;

  return (
    <div className="w-full flex flex-col justify-end" style={{ height }}>
      <svg viewBox={`0 0 ${width} ${chartHeight + paddingY}`} className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3E5035" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3E5035" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#areaGradient)" />
        <path d={pathD} fill="none" stroke="#3E5035" strokeWidth="2.5" strokeLinecap="round" />
        {data.map((d, i) => {
          const x = (i / Math.max(1, data.length - 1)) * (width - 40) + 20;
          const y = chartHeight - ((d.value || 0) / maxValue) * (chartHeight - paddingY) + paddingY;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              className="fill-[#FFFDF8] stroke-[#3E5035] stroke-2 hover:r-6 transition-all cursor-pointer"
            >
              <title>{`${d.label}: ${d.value}`}</title>
            </circle>
          );
        })}
      </svg>
      <div className="flex items-center justify-between text-[10px] font-medium text-[#795640] dark:text-[#A5AD91] pt-1">
        <span>{data[0]?.label}</span>
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
};

const DonutChart = ({ data, height }) => {
  const total = data.reduce((acc, cur) => acc + (cur.value || 0), 0) || 1;
  const colors = ['#3E5035', '#C8754D', '#A5AD91', '#ffa276', '#795640', '#adc29f'];

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-around gap-4" style={{ minHeight: height }}>
      <div className="relative w-36 h-36 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {data.map((item, idx) => {
            const pct = ((item.value || 0) / total) * 100;
            const strokeDasharray = `${pct} ${100 - pct}`;
            const strokeDashoffset = -accumulatedPercent;
            accumulatedPercent += pct;
            const color = item.color || colors[idx % colors.length];

            return (
              <circle
                key={idx}
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke={color}
                strokeWidth="3.8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-serif-brand text-xl font-bold text-[#282B24] dark:text-[#F7F0E3]">
            {total}
          </span>
          <span className="text-[10px] font-semibold text-[#795640] dark:text-[#A5AD91] uppercase">
            Total
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-xs">
        {data.map((item, idx) => {
          const color = item.color || colors[idx % colors.length];
          const pct = Math.round(((item.value || 0) / total) * 100);
          return (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
              <span className="text-[#282B24] dark:text-[#F7F0E3] font-medium">{item.label}</span>
              <span className="text-[#795640] dark:text-[#A5AD91] ml-auto font-bold pl-2">
                {item.value} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimpleChart;
