import { useState, useEffect } from "react";
import type { IconType } from "react-icons";
import { getSensorDataByType, processDataForChart, type ChartDataPoint } from "../../services/sensors.service";

interface ChartCardProps {
  title: string;
  subtitle: string;
  icon: IconType;
  trending: string;
  chartType: "bar" | "line" | "donut";
  sensorType?: "temperatura" | "humedad" | "ph" | "fertilizante" | "lluvia";
  data?: ChartDataPoint[];
}

export default function ChartCard({
  title,
  subtitle,
  icon: Icon,
  trending,
  chartType,
  sensorType,
  data: providedData,
}: ChartCardProps) {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUnit = (type?: string) => {
    switch (type) {
      case 'temperatura': return '°C';
      case 'humedad': return '%';
      case 'lluvia': return 'mm';
      default: return '';
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (providedData) {
        setData(providedData);
        setLoading(false);
        return;
      }

      if (!sensorType) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Obtener datos directamente sin filtro de fechas para obtener más datos
        const sensorData = await getSensorDataByType(
          sensorType,
          undefined, // Sin fecha de inicio
          undefined, // Sin fecha de fin
          50 // Limitar a 50 registros más recientes
        );
        
        if (sensorData.length > 0) {
          const processedData = processDataForChart(sensorData, 'day');
          setData(processedData);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error('Error loading sensor data:', err);
        setError('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sensorType, providedData]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg">
            <Icon className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
        
        <div className="h-32 flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Cargando datos...</div>
        </div>
        
        <div className="mt-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <Icon className="w-6 h-6 text-red-600" />
          </div>
        </div>
        
        <div className="h-32 flex items-center justify-center">
          <div className="text-red-500 text-sm">{error}</div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-red-600">No se pudieron cargar los datos</p>
        </div>
      </div>
    );
  }

  const getChartValues = () => {
    if (data.length === 0) {
      // Mostrar mensaje de no datos en lugar de datos falsos
      return [];
    }
    
    // Tomar hasta 8 valores más recientes y normalizar para el gráfico
    const recentData = data.slice(-8);
    const values = recentData.map(d => d.value).filter(val => !isNaN(val) && val != null);
    
    if (values.length === 0) return [];
    
    const max = Math.max(...values);
    const min = Math.min(...values);
    
    // Verificar que min y max sean números válidos
    if (isNaN(max) || isNaN(min)) return [];
    
    // Normalizar valores entre 20 y 100 para visualización
    return values.map(val => {
      if (max === min) return 60; // Valor promedio si todos son iguales
      const normalized = 20 + ((val - min) / (max - min)) * 80;
      return Math.round(isNaN(normalized) ? 60 : normalized);
    });
  };

  const getNoDataMessage = () => (
    <div className="h-32 flex items-center justify-center">
      <div className="text-center text-gray-500">
        <div className="text-sm">No hay datos disponibles</div>
        <div className="text-xs mt-1">Conectando con sensores...</div>
      </div>
    </div>
  );

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        const barValues = getChartValues();
        if (barValues.length === 0) return getNoDataMessage();
        
        return (
          <div className="space-y-2">
            <div className="h-32 flex items-end justify-center gap-2">
              {barValues.map((height, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-t from-emerald-500 to-emerald-400 w-5 rounded-t-md shadow-sm hover:from-emerald-600 hover:to-emerald-500 transition-colors duration-200"
                  style={{ height: `${height}%` }}
                  title={data[index] ? `${data[index].value} ${getUnit(sensorType)} - ${new Date(data[index].timestamp).toLocaleDateString()}` : ''}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-2">
              <span>{data.length > 0 ? `${data.length} días` : 'Sin datos'}</span>
              <span>Promedio: {(() => {
                const validValues = data.map(d => d.value).filter(val => !isNaN(val) && val != null);
                return validValues.length > 0 ? (validValues.reduce((sum, val) => sum + val, 0) / validValues.length).toFixed(1) : '0';
              })()}{getUnit(sensorType)}</span>
            </div>
          </div>
        );

      case "line":
        const lineValues = getChartValues();
        if (lineValues.length === 0) return getNoDataMessage();
        
        const linePoints = lineValues.map((value, index) => {
          const x = 20 + (index * 240 / Math.max(1, lineValues.length - 1));
          const y = 100 - value;
          // Validar que x e y sean números válidos
          if (isNaN(x) || isNaN(y)) return null;
          return `${x},${y}`;
        }).filter(point => point !== null).join(' ');
        
        if (!linePoints || lineValues[0] == null || isNaN(lineValues[0])) {
          return getNoDataMessage();
        }
        
        const areaPath = `M20,${100 - lineValues[0]} ${linePoints.split(' ').join(' L')} L260,100 L20,100 Z`;
        
        return (
          <div className="space-y-2">
            <div className="h-32 flex items-center">
              <svg className="w-full h-full" viewBox="0 0 300 100">
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                
                <path d={areaPath} fill="url(#lineGradient)" />
                <polyline
                  fill="none"
                  stroke="#059669"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={linePoints}
                />
                
                {lineValues.map((value, index) => {
                  const x = 20 + (index * 240 / Math.max(1, lineValues.length - 1));
                  const y = 100 - value;
                  const actualValue = data[index]?.value || 0;
                  const unit = getUnit(sensorType);
                  const date = data[index]?.timestamp ? new Date(data[index].timestamp).toLocaleDateString() : '';
                  
                  // Solo renderizar círculo si x e y son válidos
                  if (isNaN(x) || isNaN(y) || x < 0 || y < 0) {
                    return null;
                  }
                  
                  return (
                    <circle 
                      key={index}
                      cx={x} 
                      cy={y} 
                      r="4" 
                      fill="#059669" 
                      stroke="#ffffff" 
                      strokeWidth="2"
                    >
                      <title>{actualValue}{unit} - {date}</title>
                    </circle>
                  );
                }).filter(circle => circle !== null)}
              </svg>
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-2">
              <span>Últimos {data.length} días</span>
              <span>Máx: {(() => {
                const validValues = data.map(d => d.value).filter(val => !isNaN(val) && val != null);
                return validValues.length > 0 ? Math.max(...validValues).toFixed(1) : '0';
              })()}{getUnit(sensorType)}</span>
            </div>
          </div>
        );

      case "donut":
        if (data.length === 0) return getNoDataMessage();
        
        const totalRainfall = data.reduce((sum, d) => sum + d.value, 0);
        
        // Categorizar la lluvia: ligera (<2mm), moderada (2-10mm), fuerte (>10mm)
        const lightRain = data.filter(d => d.value < 2).length;
        const moderateRain = data.filter(d => d.value >= 2 && d.value <= 10).length;
        const heavyRain = data.filter(d => d.value > 10).length;
        const totalReadings = data.length;
        
        const lightPercent = totalReadings > 0 ? (lightRain / totalReadings) * 100 : 0;
        const moderatePercent = totalReadings > 0 ? (moderateRain / totalReadings) * 100 : 0;
        const heavyPercent = totalReadings > 0 ? (heavyRain / totalReadings) * 100 : 0;
        
        const circumference = 2 * Math.PI * 22;
        const lightArc = (lightPercent / 100) * circumference;
        const moderateArc = (moderatePercent / 100) * circumference;
        const heavyArc = (heavyPercent / 100) * circumference;
        
        return (
          <div className="space-y-2">
            <div className="h-32 flex items-center justify-between">
              <div className="flex items-center justify-center flex-1">
                <div className="relative">
                  <svg className="w-50 h-50" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="22" fill="none" stroke="#f3f4f6" strokeWidth="10" />
                    
                    {lightPercent > 0 && (
                      <circle
                        cx="50" cy="50" r="22" fill="none" stroke="#22d3ee" strokeWidth="10"
                        strokeDasharray={`${lightArc} ${circumference - lightArc}`}
                        strokeDashoffset="0" transform="rotate(-90 50 50)" strokeLinecap="round"
                      />
                    )}
                    
                    {moderatePercent > 0 && (
                      <circle
                        cx="50" cy="50" r="22" fill="none" stroke="#3b82f6" strokeWidth="10"
                        strokeDasharray={`${moderateArc} ${circumference - moderateArc}`}
                        strokeDashoffset={`-${lightArc}`} transform="rotate(-90 50 50)" strokeLinecap="round"
                      />
                    )}
                    
                    {heavyPercent > 0 && (
                      <circle
                        cx="50" cy="50" r="22" fill="none" stroke="#1e40af" strokeWidth="10"
                        strokeDasharray={`${heavyArc} ${circumference - heavyArc}`}
                        strokeDashoffset={`-${lightArc + moderateArc}`} transform="rotate(-90 50 50)" strokeLinecap="round"
                      />
                    )}
                  </svg>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-800">
                        {totalRainfall.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">mm total</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                  <span className="text-gray-600">Ligera {lightPercent.toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600">Moderada {moderatePercent.toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
                  <span className="text-gray-600">Fuerte {heavyPercent.toFixed(0)}%</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-2">
              <span>{totalReadings} lecturas</span>
              <span>Promedio: {totalReadings > 0 ? (totalRainfall / totalReadings).toFixed(1) : '0'}mm/día</span>
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
        
        {/* Estadísticas clave */}
        {data.length > 0 && (() => {
          const validValues = data.map(d => d.value).filter(val => !isNaN(val) && val != null);
          if (validValues.length === 0) return null;
          
          const min = Math.min(...validValues);
          const max = Math.max(...validValues);
          const avg = validValues.reduce((sum, val) => sum + val, 0) / validValues.length;
          
          return (
            <div className="mt-3 flex justify-between items-center text-xs">
              <div className="text-center">
                <div className="font-semibold text-gray-700">
                  {min.toFixed(1)}{getUnit(sensorType)}
                </div>
                <div className="text-gray-500">Mín</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-700">
                  {avg.toFixed(1)}{getUnit(sensorType)}
                </div>
                <div className="text-gray-500">Prom</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-700">
                  {max.toFixed(1)}{getUnit(sensorType)}
                </div>
                <div className="text-gray-500">Máx</div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Stats and info */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500">{trending}</span>
            {data.length > 0 && (
              <span className="text-xs text-gray-400 mt-1">
                {data.length} lecturas • Última: {new Date(data[data.length - 1]?.timestamp || '').toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-full">
            <span className="text-xs text-emerald-600">●</span>
            <span className="text-xs text-emerald-600 font-medium">
              Activo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
