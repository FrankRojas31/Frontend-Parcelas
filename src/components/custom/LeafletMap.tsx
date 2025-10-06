import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

interface LeafletMapProps {
  center: [number, number];
  zoom: number;
  parcelas: Array<{
    lat: number;
    lng: number;
    id: string;
    name: string;
    area?: string;
    status?: string;
  }>;
  height?: string;
  onEditParcela?: (parcela: any) => void;
  onDeleteParcela?: (parcela: any) => void;
}

export default function LeafletMap({
  center,
  zoom,
  parcelas,
  height = "h-48",
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

    // Configurar manejador global para las acciones del popup
    (window as any).handleParcelaAction = (parcelaId: string, action: string) => {
      const parcela = parcelas.find(p => p.id === parcelaId);
      if (!parcela) return;

      if (action === 'edit' && onEditParcela) {
        onEditParcela(parcela);
      } else if (action === 'delete' && onDeleteParcela) {
        onDeleteParcela(parcela);
      }

      // Resetear el select
      const selectElement = document.getElementById(`action-select-${parcelaId}`) as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = '';
      }
    };

    parcelas.forEach((parcela) => {
      const marker = L.marker([parcela.lat, parcela.lng], {
        icon: parcelaIcon,
      }).addTo(map);

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; min-width: 280px; padding: 8px;">
          <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: bold; color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">${
            parcela.name
          }</h3>
          
          <div style="display: grid; gap: 8px; margin-bottom: 16px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-weight: 600; color: #6b7280;">ID:</span> 
              <span style="color: #374151; font-weight: 500;">${parcela.id}</span>
            </div>
            ${
              parcela.area
                ? `
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 600; color: #6b7280;">Área:</span> 
                <span style="color: #374151; font-weight: 500;">${parcela.area}</span>
              </div>
            `
                : ""
            }
            ${
              parcela.status
                ? `
              <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 600; color: #6b7280;">Estado:</span> 
                <span style="background: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">${parcela.status}</span>
              </div>
            `
                : ""
            }
            <div style="display: flex; justify-content: space-between; font-size: 12px;">
              <span style="font-weight: 600; color: #6b7280;">Coordenadas:</span>
              <span style="color: #9ca3af;">Lat: ${parcela.lat.toFixed(6)}, Lng: ${parcela.lng.toFixed(6)}</span>
            </div>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 12px;">
            <label style="display: block; font-weight: 600; color: #374151; margin-bottom: 6px; font-size: 14px;">Acciones:</label>
            <select 
              id="action-select-${parcela.id}" 
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
              onchange="handleParcelaAction('${parcela.id}', this.value)"
            >
              <option value="" style="color: #9ca3af;">Seleccione una acción</option>
              <option value="edit">Editar parcela</option>
              <option value="delete">Eliminar parcela</option>
            </select>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 320,
        className: "custom-popup",
      });
    });

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
      delete (window as any).handleParcelaAction;
    };
  }, [center, zoom, parcelas]);

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

      {/* Leyenda */}
      <div className="absolute bottom-4 left-4 bg-white/95 rounded px-3 py-2 backdrop-blur-sm z-[1000] shadow-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full border border-white shadow-sm"></div>
          <span className="text-xs text-gray-700 font-medium">
            Parcelas vigentes
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {parcelas.length} parcela{parcelas.length !== 1 ? "s" : ""} registrada
          {parcelas.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}
