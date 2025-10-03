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
  iconColor = "text-yellow-500",
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg min-w-[240px]">
      <div className="flex items-center gap-4">
        {/* Icono */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <Icon className={`w-8 h-8 ${iconColor}`} />
        </div>

        {/* Contenido */}
        <div className="flex-1">
          <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-2xl font-bold">
              +{positiveValue}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-red-500 text-2xl font-bold">
              -{negativeValue}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
