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
          <div className="h-32 flex items-end justify-center gap-2">
            {[65, 45, 80, 35, 70, 55, 90, 40].map((height, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-emerald-500 to-emerald-400 w-5 rounded-t-md shadow-sm hover:from-emerald-600 hover:to-emerald-500 transition-colors duration-200"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        );

      case "line":
        return (
          <div className="h-32 flex items-center">
            <svg className="w-full h-full" viewBox="0 0 300 100">
              {/* Área bajo la curva */}
              <path
                d="M20,80 L60,40 L100,60 L140,20 L180,45 L220,30 L260,50 L260,100 L20,100 Z"
                fill="url(#gradient)"
                fillOpacity="0.2"
              />
              {/* Línea principal */}
              <polyline
                fill="none"
                stroke="#059669"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="20,80 60,40 100,60 140,20 180,45 220,30 260,50"
              />
              <circle cx="20" cy="80" r="4" fill="#059669" stroke="#ffffff" strokeWidth="2" />
              <circle cx="60" cy="40" r="4" fill="#059669" stroke="#ffffff" strokeWidth="2" />
              <circle cx="100" cy="60" r="4" fill="#059669" stroke="#ffffff" strokeWidth="2" />
              <circle cx="140" cy="20" r="4" fill="#059669" stroke="#ffffff" strokeWidth="2" />
              <circle cx="180" cy="45" r="4" fill="#059669" stroke="#ffffff" strokeWidth="2" />
              <circle cx="220" cy="30" r="4" fill="#059669" stroke="#ffffff" strokeWidth="2" />
              <circle cx="260" cy="50" r="4" fill="#059669" stroke="#ffffff" strokeWidth="2" />
              
              {/* Gradiente */}
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        );

      case "donut":
        return (
          <div className="h-32 flex items-center justify-between">
            <div className="flex items-center justify-center flex-1">
              <svg className="w-28 h-28" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="20"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="8"
                />
                {/* Segmento 1 - Maíz (60%) */}
                <circle
                  cx="50"
                  cy="50"
                  r="20"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="8"
                  strokeDasharray="75.4 50.3"
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                  strokeLinecap="round"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="20"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="8"
                  strokeDasharray="31.4 94.3"
                  strokeDashoffset="-75.4"
                  transform="rotate(-90 50 50)"
                  strokeLinecap="round"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="20"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  strokeDasharray="18.8 107.0"
                  strokeDashoffset="-106.8"
                  transform="rotate(-90 50 50)"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                <span className="text-gray-600">Maíz 60%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-gray-600">Trigo 25%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Soja 15%</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 flex-1 min-w-[280px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-50">
            <Icon className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-gray-800 text-sm font-semibold">{title}</h3>
            <p className="text-gray-500 text-xs">{subtitle}</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-50/50 rounded-lg p-4">
        {renderChart()}
      </div>

      {/* Trending info */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{trending.split(' ').slice(0, -3).join(' ')}</span>
          <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
            <span className="text-xs text-green-600">↗</span>
            <span className="text-xs text-green-600 font-medium">
              {trending.split(' ').slice(-3).join(' ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
