import HistoryCard from "../../components/custom/HistoryCard";
import MapCard from "../../components/custom/MapCard";
import { LayoutAdmin } from "../../layout/admin/Layout.component";
import Card from "../../components/custom/Card.component";

function Dashboard() {
  const historyItems = [
    {
      id: "1",
      text: "Parcela de tierra agrícola eliminada el 01 Septiembre 2025",
      date: "01 Septiembre 2025",
    },
    {
      id: "2",
      text: "Parcela de tierra agrícola eliminada el 01 Septiembre 2025",
      date: "01 Septiembre 2025",
    },
    {
      id: "3",
      text: "Parcela de tierra agrícola eliminada el 01 Septiembre 2025",
      date: "01 Septiembre 2025",
    },
    {
      id: "4",
      text: "Parcela de tierra agrícola eliminada el 01 Septiembre 2025",
      date: "01 Septiembre 2025",
    },
  ];

  return (
    <>
      <LayoutAdmin title="Dashboard - Gestión de Parcelas">
        <MapCard
          title="Mapa de parcelas vigentes"
          date={new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />

        <Card title="Historial de parcelas eliminadas" className="mt-8">
          <HistoryCard items={historyItems} />
        </Card>
      </LayoutAdmin>
    </>
  );
}

export default Dashboard;
