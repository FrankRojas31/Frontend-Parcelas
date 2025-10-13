import HistoryCard from "../../components/custom/HistoryCard";
import MapCard from "../../components/custom/MapCard";
import ChartCard from "../../components/custom/ChartCard";
import { LayoutAdmin } from "../../layout/admin/Layout.component";
import Card from "../../components/custom/Card.component";
import { FiSun, FiTrendingUp, FiActivity } from "react-icons/fi";

function Dashboard() {
  const chartCards = [
    {
      title: "Humedad del Suelo",
      subtitle: "Promedio últimos 7 días",
      icon: FiActivity,
      trending: "Datos en tiempo real de sensores IoT",
      chartType: "bar" as const,
      sensorType: "humedad" as const,
    },
    {
      title: "Temperatura Ambiente",
      subtitle: "Tendencia últimos 7 días",
      icon: FiTrendingUp,
      trending: "Monitoreo continuo 24/7",
      chartType: "line" as const,
      sensorType: "temperatura" as const,
    },
    {
      title: "Precipitación",
      subtitle: "Registro últimos 7 días",
      icon: FiSun,
      trending: "Datos pluviométricos en tiempo real",
      chartType: "donut" as const,
      sensorType: "lluvia" as const,
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
                    sensorType={card.sensorType}
                  />
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3 mb-10">
            <Card title="Historial de parcelas eliminadas">
              <HistoryCard />
            </Card>
          </div>
        </div>
      </LayoutAdmin>
    </>
  );
}

export default Dashboard;
