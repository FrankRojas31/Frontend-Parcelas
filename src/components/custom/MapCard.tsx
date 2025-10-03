import LeafletMap from "./LeafletMap";

interface MapCardProps {
  title: string;
  date: string;
}

export default function MapCard({ title, date }: MapCardProps) {
  const parcelas = [
    {
      lat: 9.934739,
      lng: -84.087502,
      id: "P001",
      name: "Parcela Agrícola San José #1",
      area: "2.5 hectáreas",
      status: "Activa",
    },
    {
      lat: 9.928739,
      lng: -84.081502,
      id: "P002",
      name: "Parcela Agrícola San José #2",
      area: "1.8 hectáreas",
      status: "Activa",
    },
    {
      lat: 9.940739,
      lng: -84.093502,
      id: "P003",
      name: "Parcela Agrícola San José #3",
      area: "3.2 hectáreas",
      status: "Activa",
    },
    {
      lat: 9.937739,
      lng: -84.089502,
      id: "P004",
      name: "Parcela Agrícola San José #4",
      area: "2.1 hectáreas",
      status: "Activa",
    },
  ];

  const mapCenter: [number, number] = [9.934739, -84.087502];
  const mapZoom = 15;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg flex-1 min-w-[320px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700 font-semibold text-lg">{title}</h3>
        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
          {date}
        </span>
      </div>

      {/* Leaflet Map */}
      <LeafletMap center={mapCenter} zoom={mapZoom} parcelas={parcelas} />
    </div>
  );
}
