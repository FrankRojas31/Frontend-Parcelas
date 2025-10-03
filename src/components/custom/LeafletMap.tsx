import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix para los iconos por defecto de Leaflet en bundlers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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
}

export default function LeafletMap({
  center,
  zoom,
  parcelas,
  height = "h-48",
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

    parcelas.forEach((parcela) => {
      const marker = L.marker([parcela.lat, parcela.lng], {
        icon: parcelaIcon,
      }).addTo(map);

      const popupContent = `
        <div style="font-family: system-ui, sans-serif; min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">${
            parcela.name
          }</h3>
          <div style="margin-bottom: 4px;">
            <span style="font-weight: 600; color: #6b7280;">ID:</span> 
            <span style="color: #374151;">${parcela.id}</span>
          </div>
          ${
            parcela.area
              ? `
            <div style="margin-bottom: 4px;">
              <span style="font-weight: 600; color: #6b7280;">Área:</span> 
              <span style="color: #374151;">${parcela.area}</span>
            </div>
          `
              : ""
          }
          ${
            parcela.status
              ? `
            <div style="margin-bottom: 4px;">
              <span style="font-weight: 600; color: #6b7280;">Estado:</span> 
              <span style="color: #059669; font-weight: 600;">${parcela.status}</span>
            </div>
          `
              : ""
          }
          <div style="margin-top: 8px; font-size: 12px; color: #9ca3af;">
            Lat: ${parcela.lat.toFixed(6)}, Lng: ${parcela.lng.toFixed(6)}
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: "custom-popup",
      });
    });

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
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
    <div className={`relative ${height} rounded-lg overflow-hidden`}>
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

      {/* Atribución de OpenStreetMap */}
      <div className="absolute bottom-1 right-1 text-xs text-gray-500 bg-white/80 px-1 rounded z-[1000]">
        © OpenStreetMap
      </div>
    </div>
  );
}
