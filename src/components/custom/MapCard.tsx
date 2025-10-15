import LeafletMap from "./LeafletMap";
import Card from "../custom/Card.component";
import { useState, useEffect, useCallback } from "react";
import type { ApiResponse } from "../../types";

// Nueva estructura de datos agrupados
interface SensorData {
  value: number;
  unit: string;
  timestamp: string;
  coords: {
    lat: number;
    lon: number;
  };
  type: string;
}

interface GroupedSensorData {
  coords: {
    lat: number;
    lon: number;
  };
  sensores: {
    temperatura?: SensorData[];
    humedad?: SensorData[];
    lluvia?: SensorData[];
    radiacion_solar?: SensorData[];
  };
  timestamp: string;
  isDeleted: boolean;
}

interface MapCardProps {
  title: string;
  apiEndpoint?: string; // URL del endpoint a consumir
}

// Datos estáticos como fallback (usando nueva estructura)
const DEFAULT_PARCELAS: GroupedSensorData[] = [
  {
    coords: { lat: 9.934739, lon: -84.087502 },
    sensores: {
      temperatura: [
        {
          value: 25.5,
          unit: "°C",
          timestamp: new Date().toISOString(),
          coords: { lat: 9.934739, lon: -84.087502 },
          type: "temperatura",
        },
      ],
    },
    timestamp: new Date().toISOString(),
    isDeleted: false,
  },
  {
    coords: { lat: 9.928739, lon: -84.081502 },
    sensores: {
      temperatura: [
        {
          value: 23.2,
          unit: "°C",
          timestamp: new Date().toISOString(),
          coords: { lat: 9.928739, lon: -84.081502 },
          type: "temperatura",
        },
      ],
      humedad: [
        {
          value: 68.5,
          unit: "%",
          timestamp: new Date().toISOString(),
          coords: { lat: 9.928739, lon: -84.081502 },
          type: "humedad",
        },
      ],
    },
    timestamp: new Date().toISOString(),
    isDeleted: false,
  },
];
export default function MapCard({ ...props }: MapCardProps) {
  const [parcelas, setParcelas] = useState<GroupedSensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para consumir el endpoint
  const fetchParcelas = useCallback(async () => {
    if (!props.apiEndpoint) {
      // Si no hay endpoint, usar datos estáticos
      setParcelas(DEFAULT_PARCELAS);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(props.apiEndpoint);

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: ApiResponse<GroupedSensorData[]> = await response.json();

      console.log(data.data);

      if (data.data.length > 0) {
        setParcelas(data.data);
      } else {
        // Si no hay datos válidos, usar fallback
        console.warn("No hay datos disponibles, usando fallback");
        setParcelas(DEFAULT_PARCELAS);
      }
    } catch (err) {
      console.error("Error al cargar datos del endpoint:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      // En caso de error, usar datos estáticos
      setParcelas(DEFAULT_PARCELAS);
    } finally {
      setLoading(false);
    }
  }, [props.apiEndpoint]);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchParcelas();
  }, [props.apiEndpoint, fetchParcelas]);

  // Calcular centro del mapa basado en los datos
  const mapCenter: [number, number] =
    parcelas.length > 0
      ? [parcelas[0].coords.lat, parcelas[0].coords.lon]
      : [9.934739, -84.087502];

  const mapZoom = 10;

  return (
    <>
      <Card title={props.title} className="">
        {loading && (
          <div className="flex items-center justify-center h-[500px]">
            <div className="text-white/90">Cargando datos del mapa...</div>
          </div>
        )}

        {error && (
          <div className="p-4">
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
              <p className="text-red-100 text-sm">
                ⚠️ Error al cargar datos: {error}
              </p>
              <p className="text-red-200/80 text-xs mt-1">
                Mostrando datos de ejemplo
              </p>
            </div>
          </div>
        )}

        {!loading && (
          <LeafletMap
            center={mapCenter}
            zoom={mapZoom}
            parcelas={
              parcelas as unknown as Array<{
                lat: number;
                lng: number;
                id: string;
                name: string;
                area?: string;
                status?: string;
              }>
            }
            height="h-[500px]"
          />
        )}
      </Card>
    </>
  );
}
