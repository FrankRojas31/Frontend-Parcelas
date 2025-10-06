import LeafletMap from "./LeafletMap";
import Card from "../custom/Card.component";

interface MapCardProps {
  title: string;
  date: string;
}

export default function MapCard({ ...props }: MapCardProps) {
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
  const mapZoom = 10;

  return (
    <>
      <Card title={props.title} className="">
        <LeafletMap
          center={mapCenter}
          zoom={mapZoom}
          parcelas={parcelas}
          height="h-[500px]"
        />
      </Card>
    </>
  );
}
