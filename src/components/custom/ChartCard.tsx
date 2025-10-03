import type { IconType } from "react-icons";

interface ChartCardProps {
  title: string;
  subtitle: string;
  icon: IconType;
  trending: string;
  chartType: "bar" | "line" | "donut";
  data?: unknown[];
}

export default function ChartCard({
  title,
  subtitle,
  icon: Icon,
  trending,
  chartType,
}: ChartCardProps) {
  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <div className="h-32 flex items-end justify-center gap-1 mt-4">
            {[65, 45, 80, 35, 70, 55, 90, 40].map((height, index) => (
              <div
                key={index}
                className="bg-teal-500 w-6 rounded-t"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        );

      case "line":
        return (
          <div className="h-32 flex items-center mt-4">
            <svg className="w-full h-full" viewBox="0 0 300 100">
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                points="20,80 60,40 100,60 140,20 180,45 220,30 260,50"
              />
              <circle cx="20" cy="80" r="3" fill="#10b981" />
              <circle cx="60" cy="40" r="3" fill="#10b981" />
              <circle cx="100" cy="60" r="3" fill="#10b981" />
              <circle cx="140" cy="20" r="3" fill="#10b981" />
              <circle cx="180" cy="45" r="3" fill="#10b981" />
              <circle cx="220" cy="30" r="3" fill="#10b981" />
              <circle cx="260" cy="50" r="3" fill="#10b981" />
            </svg>
          </div>
        );

      case "donut":
        return (
          <div className="h-32 flex items-center justify-center mt-4">
            <svg className="w-24 h-24" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="20"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="20"
                fill="none"
                stroke="#10b981"
                strokeWidth="10"
                strokeDasharray="75.4 25.1"
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
              <circle
                cx="50"
                cy="50"
                r="20"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="10"
                strokeDasharray="25.1 75.4"
                strokeDashoffset="-75.4"
                transform="rotate(-90 50 50)"
              />
            </svg>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg flex-1 min-w-[280px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-600" />
          <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        </div>
      </div>

      {/* Subtitle */}
      <p className="text-gray-500 text-xs mb-2">{subtitle}</p>

      {/* Chart */}
      {renderChart()}

      {/* Trending info */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs text-gray-500">{trending}</span>
        <div className="flex items-center gap-1">
          <span className="text-xs text-green-600">↗</span>
          <span className="text-xs text-green-600">6.2% this month</span>
        </div>
      </div>
    </div>
  );
}
