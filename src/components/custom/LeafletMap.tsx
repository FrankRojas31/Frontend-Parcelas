import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import "leaflet.markercluster";

// Estructura simple de datos del sensor
interface SensorData {
  value: number;
  unit: string;
  timestamp: string;
  coords: {
    lat: number;
    lon: number;
  };
  type: string;
  // Metadatos adicionales para las acciones
  parcelaId?: string;
  nombre?: string | null;
  hasResponsable?: boolean;
  responsable?: any;
}

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  parcelas: SensorData[];
  height?: string;
  showActions?: boolean;
  onEditParcela?: (parcela: SensorData) => void;
  onDeleteParcela?: (parcela: SensorData) => void;
  onAddResponsable?: (parcela: SensorData) => void;
}

// Función auxiliar para obtener nombre del sensor
const getSensorName = (type: string): string => {
  const sensorNames: Record<string, string> = {
    temperatura: "Temperatura",
    humedad: "Humedad",
    lluvia: "Lluvia",
    radiacion_solar: "Radiación Solar",
    co2: "CO2",
    ph: "pH",
  };
  return sensorNames[type] || type.charAt(0).toUpperCase() + type.slice(1);
};

export default function LeafletMap({
  center,
  zoom,
  parcelas,
  height = "h-48",
  showActions = false,
  onEditParcela,
  onDeleteParcela,
  onAddResponsable,
}: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = (L as any)
      .map(mapRef.current, {
        zoomControl: false,
      })
      .setView(center, zoom);

    (L as any)
      .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: " OpenStreetMap contributors",
        maxZoom: 19,
      })
      .addTo(map);

    // Crear el grupo de clustering con configuración optimizada
    const markerClusterGroup = (L as any).markerClusterGroup({
      chunkedLoading: true,
      chunkProgress: (processed: number, total: number) => {
        if (total > 5000) {
          console.log(`Cargando marcadores: ${processed}/${total}`);
        }
      },
      maxClusterRadius: 80,
      disableClusteringAtZoom: 18,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      spiderfyDistanceMultiplier: 1.5,
      iconCreateFunction: function (cluster: any) {
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

        return (L as any).divIcon({
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

    // Estilos personalizados para clusters
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

    const parcelaIcon = (L as any).divIcon({
      className: "custom-parcela-marker",
      html: '<div style="background-color: #ef4444; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    // Configurar handlers globales para las acciones
    if (showActions) {
      (window as any).handleParcelaAction = (index: number, action: string) => {
        const sensor = parcelas[index];
        if (!sensor) return;

        if (action === "edit" && onEditParcela) {
          onEditParcela(sensor);
        } else if (action === "delete" && onDeleteParcela) {
          onDeleteParcela(sensor);
        } else if (action === "add" && onAddResponsable) {
          onAddResponsable(sensor);
        }

        const selectElement = document.getElementById(
          `action-select-${index}`
        ) as HTMLSelectElement;
        if (selectElement) {
          selectElement.value = "";
        }
      };
    }

    // Procesar marcadores directamente
    parcelas.forEach((sensor, index) => {
      const marker = (L as any).marker([sensor.coords.lat, sensor.coords.lon], {
        icon: parcelaIcon,
      });

      const sensorName = getSensorName(sensor.type);
      const timestamp = new Date(sensor.timestamp).toLocaleString("es-ES");
      const nombreParcela = sensor.nombre || "Sin nombre";
      const responsableInfo = sensor.responsable
        ? `${sensor.responsable.username} - ${
            sensor.responsable.persona?.nombre || ""
          } ${sensor.responsable.persona?.apellido_paterno || ""}`.trim()
        : "Sin responsable";

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; min-width: ${
          showActions ? "280px" : "250px"
        }; padding: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">
            ${sensorName}
          </h3>
          
          <div style="display: grid; gap: 8px; ${
            showActions ? "margin-bottom: 16px;" : ""
          }">
            ${
              sensor.nombre
                ? `
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 600; color: #6b7280;">Parcela:</span> 
                <span style="color: #374151; font-weight: 500;">${nombreParcela}</span>
              </div>
            `
                : ""
            }
            <div style="display: flex; justify-content: space-between;">
              <span style="font-weight: 600; color: #6b7280;">Tipo:</span> 
              <span style="color: #374151; font-weight: 500;">${sensorName}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-weight: 600; color: #6b7280;">Valor:</span> 
              <span style="color: #374151; font-weight: 500;">${sensor.value}${
        sensor.unit
      }</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="font-weight: 600; color: #6b7280;">Fecha:</span> 
              <span style="color: #374151; font-weight: 500; font-size: 12px;">${timestamp}</span>
            </div>
            ${
              sensor.responsable
                ? `
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 600; color: #6b7280;">Responsable:</span> 
                <span style="color: #374151; font-weight: 500; font-size: 12px;">${responsableInfo}</span>
              </div>
            `
                : ""
            }
            <div style="display: flex; justify-content: space-between; font-size: 12px;">
              <span style="font-weight: 600; color: #6b7280;">Coordenadas:</span>
              <span style="color: #9ca3af;">Lat: ${sensor.coords.lat.toFixed(
                6
              )}, Lng: ${sensor.coords.lon.toFixed(6)}</span>
            </div>
          </div>
          
          ${
            showActions
              ? `
            <div style="border-top: 1px solid #e5e7eb; padding-top: 12px;">
              <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 6px; font-size: 14px;">Acciones:</label>
              <select 
                id="action-select-${index}" 
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
                onchange="handleParcelaAction(${index}, this.value)"
              >
                <option value="" style="color: #9ca3af;">Seleccione una acción</option>
                ${
                  sensor.hasResponsable
                    ? '<option value="edit">Editar responsable</option><option value="delete">Quitar responsable</option>'
                    : '<option value="add">Asignar responsable</option>'
                }
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

      markerClusterGroup.addLayer(marker);
    });

    map.addLayer(markerClusterGroup);
    mapInstance.current = map;

    // Escuchar evento personalizado para centrar el mapa
    const handleCenterMap = (event: any) => {
      if (mapInstance.current && event.detail) {
        const { lat, lon, zoom: newZoom } = event.detail;

        // Centrar el mapa en las coordenadas
        mapInstance.current.setView([lat, lon], newZoom || 15, {
          animate: true,
          duration: 1.5,
        });

        // Encontrar y abrir el popup del marcador más cercano
        setTimeout(() => {
          let closestMarker: unknown = null;
          let minDistance = Infinity;

          markerClusterGroup.eachLayer((layer: unknown) => {
            if (
              layer &&
              typeof layer === "object" &&
              "getLatLng" in layer &&
              typeof (
                layer as { getLatLng: () => { lat: number; lng: number } }
              ).getLatLng === "function"
            ) {
              const markerLatLng = (
                layer as { getLatLng: () => { lat: number; lng: number } }
              ).getLatLng();
              const distance = Math.sqrt(
                Math.pow(markerLatLng.lat - lat, 2) +
                  Math.pow(markerLatLng.lng - lon, 2)
              );

              if (distance < minDistance && distance < 0.001) {
                // Tolerancia pequeña
                minDistance = distance;
                closestMarker = layer;
              }
            }
          });

          // Abrir el popup del marcador más cercano
          if (
            closestMarker &&
            typeof closestMarker === "object" &&
            "openPopup" in closestMarker &&
            typeof (closestMarker as { openPopup: () => void }).openPopup ===
              "function"
          ) {
            (closestMarker as { openPopup: () => void }).openPopup();
          }
        }, 1600); // Esperar a que termine la animación del mapa
      }
    };

    window.addEventListener("centerMap", handleCenterMap);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
      // Limpiar estilos
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
      // Limpiar handlers globales
      if (showActions && "handleParcelaAction" in window) {
        delete (window as { handleParcelaAction?: unknown })
          .handleParcelaAction;
      }
      // Limpiar evento personalizado
      window.removeEventListener("centerMap", handleCenterMap);
    };
  }, [
    center,
    zoom,
    parcelas,
    showActions,
    onEditParcela,
    onDeleteParcela,
    onAddResponsable,
  ]);

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

  return (
    <div className={"relative " + height + " rounded-b-lg overflow-hidden"}>
      <div ref={mapRef} className="w-full h-full" />
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
          <span className="text-lg font-bold"></span>
        </button>
      </div>
      <div className="absolute bottom-4 left-4 bg-white/95 rounded px-3 py-2 backdrop-blur-sm z-[1000] shadow-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full border border-white shadow-sm"></div>
          <span className="text-xs text-gray-700 font-medium">
            Sensores activos
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Mostrando {parcelas.length} sensor{parcelas.length !== 1 ? "es" : ""}
        </div>
      </div>
    </div>
  );
}
