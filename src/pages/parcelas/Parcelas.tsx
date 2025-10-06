import Card from "../../components/custom/Card.component";
import LeafletMap from "../../components/custom/LeafletMap";
import { LayoutAdmin } from "../../layout/admin/Layout.component";

function Parcelas() {
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
    <LayoutAdmin title="Gestión de Parcelas - Quintana Roo">
      <Card
        title="Parcelas"
        type="add"
        onButtonClick={() => console.log("Agregar nueva parcela")}
      >
        <div className="p-4">
          <Card
            title="Cancún"
            onButtonClick={() => console.log("Ver detalles de Cancún")}
            className="w-full"
            secondary
          >
              <LeafletMap
                center={mapCenter}
                zoom={mapZoom}
                parcelas={parcelas}
                height="h-[300px]"
              />
          </Card>
        </div>
      </Card>
    </LayoutAdmin>
  );
}

export default Parcelas;
