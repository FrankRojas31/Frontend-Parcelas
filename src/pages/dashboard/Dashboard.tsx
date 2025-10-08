import HistoryCard from "../../components/custom/HistoryCard";
import MapCard from "../../components/custom/MapCard";
import StatsCard from "../../components/custom/StatsCard";
import ChartCard from "../../components/custom/ChartCard";
import { LayoutAdmin } from "../../layout/admin/Layout.component";
import Card from "../../components/custom/Card.component";
import { FiSun, FiTrendingUp, FiActivity, FiUsers } from "react-icons/fi";

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

  const chartCards = [
    {
      title: "Humedad",
      subtitle: "Enero - Octubre 2024",
      icon: FiActivity,
      trending: "Incremento del 6.2% este mes",
      chartType: "bar" as const,
    },
    {
      title: "Temperatura",
      subtitle: "Enero - Octubre 2024",
      icon: FiTrendingUp,
      trending: "Incremento del 5.2% este mes",
      chartType: "line" as const,
    },
    {
      title: "Distribución de cultivos",
      subtitle: "Enero - Octubre 2024",
      icon: FiUsers,
      trending: "Incremento del 8.2% este mes",
      chartType: "donut" as const,
    },
  ];

  return (
    <>
      <LayoutAdmin title="Dashboard - Gestión de Parcelas">
        <div className=" max-w-7xl mx-auto mb-8">
          <div className="lg:col-span-2">
            <MapCard
              title="Mapa de parcelas vigentes"
              apiEndpoint="http://localhost:3000/api/parcelas-mongo/"
            />
          </div>

          <div className="lg:col-span-3">
            <Card title="Histórico de Datos" className="mb-8 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
                {chartCards.map((card, index) => (
                  <ChartCard
                    key={index}
                    title={card.title}
                    subtitle={card.subtitle}
                    icon={card.icon}
                    trending={card.trending}
                    chartType={card.chartType}
                  />
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card title="Historial de parcelas eliminadas">
              <HistoryCard items={historyItems} />
            </Card>
          </div>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default Dashboard;
