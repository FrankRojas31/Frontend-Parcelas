import type { IconType } from "react-icons";

interface StatsCardProps {
  title: string;
  icon: IconType;
  positiveValue: number;
  negativeValue: number;
  iconColor?: string;
}

export default function StatsCard({
  title,
  icon: Icon,
  positiveValue,
  negativeValue,
  iconColor = "text-blue-500"
}: StatsCardProps) {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-gray-50">
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
          <h3 className="text-gray-800 font-semibold text-lg">{title}</h3>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">Activas</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-green-600 font-semibold">{positiveValue}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">Inactivas</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-red-600 font-semibold">{negativeValue}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-xs">Total</span>
          <span className="text-gray-800 font-bold text-xl">{positiveValue + negativeValue}</span>
        </div>
      </div>
    </div>
  );
}