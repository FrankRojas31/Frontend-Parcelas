import { buildApiUrl, API_CONFIG } from "../config/api.config";

export interface SensorData {
  _id: string;
  value: number;
  unit: string;
  timestamp: string;
  coords: {
    lat: number;
    lng: number;
  };
  type: "temperatura" | "humedad" | "ph" | "fertilizante" | "lluvia";
  isDeleted: boolean;
}

export interface ChartDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface AggregatedData {
  temperature: ChartDataPoint[];
  humidity: ChartDataPoint[];
  ph: ChartDataPoint[];
  fertilizer: ChartDataPoint[];
  rain: ChartDataPoint[];
}

const API_BASE_URL = buildApiUrl(API_CONFIG.ENDPOINTS.SENSORES);

const generateFallbackData = (type: string, days: number = 7): SensorData[] => {
  const data: SensorData[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generar múltiples lecturas por día
    for (let j = 0; j < 3; j++) {
      const time = new Date(date);
      time.setHours(8 + j * 4); // 8am, 12pm, 4pm
      
      let value: number;
      let unit: string;
      
      if (type === 'temperatura') {
        value = 20 + Math.random() * 15; // 20-35°C
        unit = '°C';
      } else if (type === 'humedad') {
        value = 40 + Math.random() * 40; // 40-80%
        unit = '%';
      } else if (type === 'lluvia') {
        // Generar datos de lluvia realistas (0-20mm por día)
        const rainProbability = Math.random();
        if (rainProbability < 0.3) {
          value = 0; // 30% probabilidad de no lluvia
        } else if (rainProbability < 0.7) {
          value = Math.random() * 2; // 40% lluvia ligera (0-2mm)
        } else if (rainProbability < 0.9) {
          value = 2 + Math.random() * 8; // 20% lluvia moderada (2-10mm)
        } else {
          value = 10 + Math.random() * 10; // 10% lluvia fuerte (10-20mm)
        }
        unit = 'mm';
      } else {
        value = Math.random() * 100;
        unit = '%';
      }
      
      data.push({
        _id: `fallback_${type}_${Date.now()}_${j}`,
        value: Number(value.toFixed(2)),
        unit,
        timestamp: time.toISOString(),
        coords: { lat: 9.934739, lng: -84.087502 },
        type: type as any,
        isDeleted: false
      });
    }
  }
  
  return data;
};

// Obtener todos los datos de sensores
export const getAllSensorData = async (): Promise<SensorData[]> => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn(`Endpoint no disponible (${response.status}), usando datos de ejemplo`);
      return generateFallbackData('temperatura')
        .concat(generateFallbackData('humedad'))
        .concat(generateFallbackData('lluvia'));
    }

    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    } else {
      console.warn("Respuesta inválida, usando datos de ejemplo");
      return generateFallbackData('temperatura')
        .concat(generateFallbackData('humedad'))
        .concat(generateFallbackData('lluvia'));
    }
  } catch (error) {
    console.warn("Endpoint de sensores no disponible, usando datos de ejemplo:", error);
    return generateFallbackData('temperatura')
      .concat(generateFallbackData('humedad'))
      .concat(generateFallbackData('lluvia'));
  }
};

// Obtener datos de sensores por tipo y rango de fechas
export const getSensorDataByType = async (
  type: string,
  startDate?: string,
  endDate?: string,
  limit?: number
): Promise<SensorData[]> => {
  try {
    const params = new URLSearchParams({
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
      ...(limit && { limit: limit.toString() }),
    });

    const url = `${API_BASE_URL}/${type}${params.toString() ? `?${params}` : ''}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.warn(`Endpoint no disponible para ${type} (${response.status}), usando datos de ejemplo`);
      return generateFallbackData(type, 7).slice(0, limit || 50);
    }

    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data;
    } else {
      console.warn(`Respuesta inválida para ${type}, usando datos de ejemplo`);
      return generateFallbackData(type, 7).slice(0, limit || 50);
    }
  } catch (error) {
    console.warn(`Endpoint no disponible para ${type}, usando datos de ejemplo:`, error);
    return generateFallbackData(type, 7).slice(0, limit || 50);
  }
};

// Procesar datos para gráficos - agregar por horas/días
export const processDataForChart = (
  data: SensorData[], 
  groupBy: 'hour' | 'day' | 'week' = 'day'
): ChartDataPoint[] => {
  if (!data || data.length === 0) return [];

  // Agrupar datos por período de tiempo
  const grouped = data.reduce((acc, item) => {
    const date = new Date(item.timestamp);
    let key: string;

    switch (groupBy) {
      case 'hour':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
        break;
      case 'day':
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        break;
      case 'week':
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        key = `${startOfWeek.getFullYear()}-${String(startOfWeek.getMonth() + 1).padStart(2, '0')}-${String(startOfWeek.getDate()).padStart(2, '0')}`;
        break;
      default:
        key = item.timestamp;
    }

    if (!acc[key]) {
      acc[key] = {
        values: [],
        timestamp: key,
      };
    }
    
    acc[key].values.push(item.value);
    return acc;
  }, {} as Record<string, { values: number[]; timestamp: string }>);

  // Calcular promedio para cada grupo y ordenar por fecha
  return Object.values(grouped)
    .map(group => ({
      timestamp: group.timestamp,
      value: Number((group.values.reduce((sum, val) => sum + val, 0) / group.values.length).toFixed(2)),
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

// Obtener estadísticas resumidas
export const getSensorStats = async () => {
  try {
    const data = await getAllSensorData();
    
    const stats = {
      temperatura: {
        count: data.filter(d => d.type === 'temperatura').length,
        avg: 0,
        min: 0,
        max: 0,
        unit: '°C'
      },
      humedad: {
        count: data.filter(d => d.type === 'humedad').length,
        avg: 0,
        min: 0,
        max: 0,
        unit: '%'
      },
      total: data.length,
      lastUpdate: data.length > 0 ? new Date(Math.max(...data.map(d => new Date(d.timestamp).getTime()))) : null
    };

    // Calcular estadísticas de temperatura
    const tempData = data.filter(d => d.type === 'temperatura');
    if (tempData.length > 0) {
      const tempValues = tempData.map(d => d.value);
      stats.temperatura.avg = Number((tempValues.reduce((sum, val) => sum + val, 0) / tempValues.length).toFixed(1));
      stats.temperatura.min = Math.min(...tempValues);
      stats.temperatura.max = Math.max(...tempValues);
    }

    // Calcular estadísticas de humedad
    const humidityData = data.filter(d => d.type === 'humedad');
    if (humidityData.length > 0) {
      const humidityValues = humidityData.map(d => d.value);
      stats.humedad.avg = Number((humidityValues.reduce((sum, val) => sum + val, 0) / humidityValues.length).toFixed(1));
      stats.humedad.min = Math.min(...humidityValues);
      stats.humedad.max = Math.max(...humidityValues);
    }

    return stats;
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    throw error;
  }
};

// Obtener datos agregados para todas las gráficas
export const getAggregatedSensorData = async (
  days: number = 7,
  groupBy: 'hour' | 'day' = 'day'
): Promise<AggregatedData> => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const [tempData, humidityData, rainData] = await Promise.all([
      getSensorDataByType('temperatura', startDate.toISOString(), endDate.toISOString()),
      getSensorDataByType('humedad', startDate.toISOString(), endDate.toISOString()),
      getSensorDataByType('lluvia', startDate.toISOString(), endDate.toISOString()),
    ]);

    return {
      temperature: processDataForChart(tempData, groupBy),
      humidity: processDataForChart(humidityData, groupBy),
      ph: [],
      fertilizer: [],
      rain: processDataForChart(rainData, groupBy),
    };
  } catch (error) {
    console.error("Error al obtener datos agregados:", error);
    throw error;
  }
};

// Función específica para obtener datos agregados del backend
export const getBackendAggregatedData = async (type: string, days: number = 7) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${type}/aggregated?days=${days}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.success && result.data) {
      return result.data.map((item: any) => ({
        timestamp: item.date,
        value: item.avgValue,
        label: item.date
      }));
    } else {
      throw new Error('Respuesta inválida del servidor');
    }
  } catch (error) {
    console.warn(`Error obteniendo datos agregados de ${type}:`, error);
    return [];
  }
};