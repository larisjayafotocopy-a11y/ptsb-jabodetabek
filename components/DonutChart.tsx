interface DataPoint {
  label: string;
  value: number;
  color: string;
}

export default function DonutChart({ data, size = 96 }: { data: DataPoint[]; size?: number }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulative = 0;
  const stops =
    total > 0
      ? data
          .map((d) => {
            const start = (cumulative / total) * 360;
            cumulative += d.value;
            const end = (cumulative / total) * 360;
            return `${d.color} ${start}deg ${end}deg`;
          })
          .join(', ')
      : '#e5e7eb 0deg 360deg';

  return (
    <div className="flex items-center gap-4">
      <div
        className="relative rounded-full flex-shrink-0"
        style={{ width: size, height: size, background: `conic-gradient(${stops})` }}
      >
        <div className="absolute inset-[14%] bg-white rounded-full flex items-center justify-center">
          <span className="text-sm font-black text-gray-800">{total}</span>
        </div>
      </div>
      <div className="space-y-1.5 text-left">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }}></span>
            <span className="text-gray-600 font-medium">{d.label}</span>
            <span className="text-gray-400">
              ({total > 0 ? Math.round((d.value / total) * 100) : 0}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
