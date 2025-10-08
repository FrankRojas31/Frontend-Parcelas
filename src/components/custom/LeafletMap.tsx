import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import "leaflet.markercluster";

// Interfaz para datos agrupados del nuevo API
interface GroupedSensorData {
  coordinates: {
    lat: number;
    lon: number;
  };
  sensors: {
    [sensorType: string]: SensorData[];
  };
}

interface SensorData {
  _id: string;
  value: number;
  unit: string;
  timestamp: string;
  isDeleted: boolean;
}

// Interfaz para datos en crudo del API (legacy support)
interface RawParcela {
  _id: string;
  value: number;
  unit: string;
  timestamp: string;
  coords: {
    lat: number;
    lon: number;
  };
  isDeleted: boolean;
}

// Interfaz para datos transformados (legacy support)
interface TransformedParcela {
  lat: number;
  lng: number;
  id: string;
  name: string;
  area?: string;
  status?: string;
  temperature?: string;
  timestamp?: string;
}

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  parcelas: Array<GroupedSensorData | RawParcela | TransformedParcela>;
  height?: string;
  showActions?: boolean;
  onEditParcela?: (
    parcela: GroupedSensorData | RawParcela | TransformedParcela
  ) => void;
  onDeleteParcela?: (
    parcela: GroupedSensorData | RawParcela | TransformedParcela
  ) => void;
}

// Función para determinar el tipo de dato
const isGroupedSensorData = (
  parcela: GroupedSensorData | RawParcela | TransformedParcela
): parcela is GroupedSensorData => {
  return "coordinates" in parcela && "sensors" in parcela;
};

const isRawParcela = (
  parcela: GroupedSensorData | RawParcela | TransformedParcela
): parcela is RawParcela => {
  return "_id" in parcela && "coords" in parcela && !("coordinates" in parcela);
};

// Interfaz extendida para marcadores
interface ExtendedMarker {
  id: string;
  lat: number;
  lng: number;
  name: string;
  temperature?: string;
  timestamp: string;
  status: string;
  sensorType?: string;
  area?: string;
}
const expandGroupedData = (
  groupedData: GroupedSensorData
): ExtendedMarker[] => {
  const markers: ExtendedMarker[] = [];

  Object.entries(groupedData.sensors).forEach(([sensorType, sensors]) => {
    sensors.forEach((sensor, index) => {
      if (!sensor.isDeleted) {
        // Mejorar el nombre del sensor con información más descriptiva
        const sensorName =
          sensorType.charAt(0).toUpperCase() + sensorType.slice(1);
        const locationName = `Sensor ${sensorName}`;

        markers.push({
          id: sensor._id,
          lat: groupedData.coordinates.lat,
          lng: groupedData.coordinates.lon,
          name: `${locationName} #${index + 1}`,
          temperature: `${sensor.value}${sensor.unit}`,
          timestamp: new Date(sensor.timestamp).toLocaleString("es-ES"),
          status: sensor.isDeleted ? "Inactivo" : "Activo",
          sensorType: sensorType,
          area: undefined,
        });
      }
    });
  });

  return markers;
};

// Función para normalizar datos
const normalizeParcela = (
  parcela: RawParcela | TransformedParcela,
  index: number
): {
  id: string;
  lat: number;
  lng: number;
  name: string;
  temperature?: string;
  timestamp: string;
  status: string;
  area?: string;
} => {
  if (isRawParcela(parcela)) {
    // Transformar dato crudo - mejorar el nombre del sensor
    const sensorName =
      parcela.unit === "°C"
        ? "Temperatura"
        : parcela.unit === "%"
        ? "Humedad"
        : parcela.unit === "ppm"
        ? "Calidad del Aire"
        : "Sensor";

    return {
      id: parcela._id,
      lat: parcela.coords.lat,
      lng: parcela.coords.lon,
      name: `Sensor de ${sensorName} #${index + 1}`,
      temperature: `${parcela.value}${parcela.unit}`,
      timestamp: new Date(parcela.timestamp).toLocaleString("es-ES"),
      status: parcela.isDeleted ? "Inactivo" : "Activo",
      area: undefined,
    };
  } else {
    // Ya es dato transformado
    return {
      id: parcela.id,
      lat: parcela.lat,
      lng: parcela.lng,
      name: parcela.name,
      temperature: parcela.temperature,
      timestamp: parcela.timestamp || new Date().toLocaleString("es-ES"),
      status: parcela.status || "Activo",
      area: parcela.area,
    };
  }
};

export default function LeafletMap({
  center,
  zoom,
  parcelas,
  height = "h-48",
  showActions = false,
  onEditParcela,
  onDeleteParcela,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: false,
    }).setView(center, zoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    // Crear el grupo de clustering con configuración optimizada para 40K+ marcadores
    const markerClusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      chunkProgress: (processed: number, total: number) => {
        // Opcional: mostrar progreso de carga
        if (total > 5000) {
          console.log(`Cargando marcadores: ${processed}/${total}`);
        }
      },
      maxClusterRadius: 80, // Radio más grande para datasets grandes
      disableClusteringAtZoom: 18, // Solo deshabilitar en zoom muy alto
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      spiderfyDistanceMultiplier: 1.5, // Mejor separación en spider
      // Función personalizada para crear clusters
      iconCreateFunction: function (cluster: L.MarkerCluster) {
        const count = cluster.getChildCount();

        let className = "marker-cluster-";
        let size = 30;

        if (count < 10) {
          className += "small";
          size = 30;
        } else if (count < 100) {
          className += "medium";
          size = 40;
        } else if (count < 1000) {
          className += "large";
          size = 50;
        } else {
          className += "xlarge";
          size = 60;
        }

        return L.divIcon({
          html: `
            <div>
              <span class="cluster-count">${count > 999 ? "999+" : count}</span>
              <span class="cluster-types">sensores</span>
            </div>
          `,
          className: className,
          iconSize: [size, size],
        });
      },
    });

    // Estilos personalizados para clusters optimizados para grandes datasets
    const style = document.createElement("style");
    style.textContent = `
      .marker-cluster-small {
        background-color: rgba(181, 226, 140, 0.9);
        border: 2px solid rgba(110, 204, 57, 0.9);
      }
      .marker-cluster-medium {
        background-color: rgba(241, 211, 87, 0.9);
        border: 2px solid rgba(240, 194, 12, 0.9);
      }
      .marker-cluster-large {
        background-color: rgba(253, 156, 115, 0.9);
        border: 2px solid rgba(241, 128, 23, 0.9);
      }
      .marker-cluster-xlarge {
        background-color: rgba(248, 113, 113, 0.9);
        border: 2px solid rgba(239, 68, 68, 0.9);
      }
      .marker-cluster {
        border-radius: 50%;
        text-align: center;
        font-weight: bold;
        font-size: 11px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
      }
      .marker-cluster:hover {
        transform: scale(1.1);
      }
      .marker-cluster div {
        width: calc(100% - 4px);
        height: calc(100% - 4px);
        margin: 2px;
        text-align: center;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: white;
        text-shadow: 1px 1px 1px rgba(0,0,0,0.5);
        padding: 2px;
      }
      .cluster-count {
        font-size: 12px;
        font-weight: bold;
        line-height: 1;
      }
      .cluster-types {
        font-size: 8px;
        font-weight: normal;
        text-transform: capitalize;
        margin-top: 1px;
        opacity: 0.9;
        line-height: 1;
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    `;
    document.head.appendChild(style);

    const parcelaIcon = L.divIcon({
      className: "custom-parcela-marker",
      html: `
        <div style="
          background-color: #ef4444;
          border: 3px solid white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    if (showActions) {
      (
        window as unknown as {
          handleParcelaAction?: (id: string, action: string) => void;
        }
      ).handleParcelaAction = (parcelaId: string, action: string) => {
        // Buscar en los datos originales
        let originalParcela:
          | GroupedSensorData
          | RawParcela
          | TransformedParcela
          | undefined;

        for (const p of parcelas) {
          if (isGroupedSensorData(p)) {
            // Buscar en sensores agrupados
            for (const sensors of Object.values(p.sensors)) {
              const found = sensors.find((s) => s._id === parcelaId);
              if (found) {
                originalParcela = p;
                break;
              }
            }
          } else {
            const normalized = normalizeParcela(p, 0);
            if (normalized.id === parcelaId) {
              originalParcela = p;
              break;
            }
          }
          if (originalParcela) break;
        }

        if (!originalParcela) return;

        if (action === "edit" && onEditParcela) {
          onEditParcela(originalParcela);
        } else if (action === "delete" && onDeleteParcela) {
          onDeleteParcela(originalParcela);
        }

        const selectElement = document.getElementById(
          `action-select-${parcelaId}`
        ) as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = "";
        }
      };
    }

    // Expandir datos agrupados a marcadores individuales
    const expandedParcelas: ExtendedMarker[] = [];

    parcelas.forEach((parcela) => {
      if (isGroupedSensorData(parcela)) {
        // Expandir datos agrupados
        const expandedMarkers = expandGroupedData(parcela);
        expandedParcelas.push(...expandedMarkers);
      } else {
        // Procesar datos legacy (crudo o transformado)
        if (isRawParcela(parcela) && parcela.isDeleted) {
          return; // Filtrar eliminados
        }

        const normalized = normalizeParcela(parcela, expandedParcelas.length);
        expandedParcelas.push(normalized);
      }
    });

    // CLUSTERING + BATCH LOADING: Procesamiento inteligente de grandes datasets
    console.log(
      `Procesando ${expandedParcelas.length} marcadores con clustering`
    );

    // Array para mantener referencia de marcadores
    const markers: L.Marker[] = [];

    // Procesar marcadores en lotes para evitar bloqueo del UI
    const BATCH_SIZE = 500;
    let processedCount = 0;

    const processBatch = (startIndex: number) => {
      const endIndex = Math.min(
        startIndex + BATCH_SIZE,
        expandedParcelas.length
      );
      const batch = expandedParcelas.slice(startIndex, endIndex);

      batch.forEach((normalized) => {
        const marker = L.marker([normalized.lat, normalized.lng], {
          icon: parcelaIcon,
          sensorType: normalized.sensorType || "sensor",
        });

        const popupContent = `
          <div style="font-family: system-ui, sans-serif; min-width: ${
            showActions ? "280px" : "250px"
          }; padding: 8px;">
            <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">${
              normalized.name
            }</h3>
            
            <div style="display: grid; gap: 8px; ${
              showActions ? "margin-bottom: 16px;" : ""
            }">
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 600; color: #6b7280;">ID:</span> 
                <span style="color: #374151; font-weight: 500;">${
                  normalized.id
                }</span>
              </div>
              ${
                normalized.sensorType
                  ? `
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-weight: 600; color: #6b7280;">Tipo:</span> 
                  <span style="color: #374151; font-weight: 500;">${normalized.sensorType}</span>
                </div>
              `
                  : ""
              }
              ${
                normalized.temperature
                  ? `
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-weight: 600; color: #6b7280;">Valor:</span> 
                  <span style="color: #374151; font-weight: 500;">${normalized.temperature}</span>
                </div>
              `
                  : ""
              }
              ${
                normalized.area
                  ? `
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-weight: 600; color: #6b7280;">Área:</span> 
                  <span style="color: #374151; font-weight: 500;">${normalized.area}</span>
                </div>
              `
                  : ""
              }
              ${
                normalized.timestamp
                  ? `
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-weight: 600; color: #6b7280;">Fecha:</span> 
                  <span style="color: #374151; font-weight: 500; font-size: 12px;">${normalized.timestamp}</span>
                </div>
              `
                  : ""
              }
              ${
                normalized.status
                  ? `
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-weight: 600; color: #6b7280;">Estado:</span> 
                  <span style="background: ${
                    normalized.status === "Activo"
                      ? "#dcfce7; color: #166534"
                      : "#fee2e2; color: #991b1b"
                  }; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">${
                      normalized.status
                    }</span>
                </div>
              `
                  : ""
              }
              <div style="display: flex; justify-content: space-between; font-size: 12px;">
                <span style="font-weight: 600; color: #6b7280;">Coordenadas:</span>
                <span style="color: #9ca3af;">Lat: ${normalized.lat.toFixed(
                  6
                )}, Lng: ${normalized.lng.toFixed(6)}</span>
              </div>
            </div>
            
            ${
              showActions
                ? `
            <div style="border-top: 1px solid #e5e7eb; padding-top: 12px;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 6px; font-size: 14px;">Acciones:</label>
              <select 
                id="action-select-${normalized.id}" 
                style="
                  width: 100%;
                  padding: 8px 12px;
                  border: 2px solid #d1d5db;
                  border-radius: 6px;
                  background: white;
                  font-size: 14px;
                  color: #374151;
                  cursor: pointer;
                  transition: all 0.2s ease;
                "
                onchange="handleParcelaAction('${normalized.id}', this.value)"
              >
                <option value="" style="color: #9ca3af;">Seleccione una acción</option>
                <option value="edit">Editar parcela</option>
                <option value="delete">Eliminar parcela</option>
              </select>
            </div>
            `
                : ""
            }
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 320,
          className: "custom-popup",
        });

        // Agregar marcador al grupo de clustering
        markerClusterGroup.addLayer(marker);
        markers.push(marker);
      });

      processedCount += batch.length;

      // Procesar el siguiente lote si hay más datos
      if (endIndex < expandedParcelas.length) {
        // Usar setTimeout para no bloquear el UI
        setTimeout(() => processBatch(endIndex), 0);
      } else {
        console.log(`✅ Completado: ${processedCount} marcadores procesados`);
      }
    };

    // Iniciar el procesamiento en lotes
    if (expandedParcelas.length > 0) {
      processBatch(0);
    }

    // Agregar el grupo de clustering al mapa
    map.addLayer(markerClusterGroup);

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
      // Limpiar el manejador global solo si fue configurado
      if (showActions) {
        delete (
          window as unknown as {
            handleParcelaAction?: (id: string, action: string) => void;
          }
        ).handleParcelaAction;
      }
    };
  }, [center, zoom, parcelas, showActions, onEditParcela, onDeleteParcela]);

  const handleZoomIn = () => {
    if (mapInstance.current) {
      mapInstance.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstance.current) {
      mapInstance.current.zoomOut();
    }
  };

  // Calcular el total de sensores para el contador
  const totalSensors = parcelas.reduce((total, p) => {
    if (isGroupedSensorData(p)) {
      // Contar sensores activos en datos agrupados
      return (
        total +
        Object.values(p.sensors).reduce((sensorTotal, sensors) => {
          return sensorTotal + sensors.filter((s) => !s.isDeleted).length;
        }, 0)
      );
    } else if (isRawParcela(p)) {
      return total + (p.isDeleted ? 0 : 1);
    } else {
      return total + 1; // TransformedParcela
    }
  }, 0);

  // Con clustering, mostramos todos los sensores
  const showingCount = totalSensors;

  return (
    <div className={`relative ${height} rounded-b-lg overflow-hidden`}>
      <div ref={mapRef} className="w-full h-full" />

      {/* Controles de zoom personalizados */}
      <div className="absolute top-4 right-4 flex flex-col gap-1 z-[1000]">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <span className="text-lg font-bold">+</span>
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 bg-white rounded shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors border border-gray-200"
        >
          <span className="text-lg font-bold">−</span>
        </button>
      </div>

      {/* Leyenda mejorada */}
      <div className="absolute bottom-4 left-4 bg-white/95 rounded px-3 py-2 backdrop-blur-sm z-[1000] shadow-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full border border-white shadow-sm"></div>
          <span className="text-xs text-gray-700 font-medium">
            Sensores activos
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Mostrando {showingCount} de {totalSensors} sensor
          {totalSensors !== 1 ? "es" : ""}
        </div>
      </div>
    </div>
  );
}
