import HistoryCard from "../../components/custom/HistoryCard";
import MapCard from "../../components/custom/MapCard";
import ChartCard from "../../components/custom/ChartCard";
import { useEffect, useState } from "react";
import { getSensorStats } from "../../services/sensors.service";
import { LayoutAdmin } from "../../layout/admin/Layout.component";
import Card from "../../components/custom/Card.component";
import { FiSun, FiTrendingUp, FiActivity } from "react-icons/fi";
import { buildApiUrl, API_CONFIG } from "../../config/api.config";

function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        setErrorStats(null);
        const s = await getSensorStats();
        setStats(s);
      } catch (err) {
        setErrorStats("Error al cargar estadísticas");
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, []);

  const chartCards = [
    {
      title: "Humedad del Suelo",
      subtitle: "Promedio últimos 7 días",
      icon: FiActivity,
      trending: "Datos en tiempo real de sensores IoT",
      chartType: "bar" as const,
      sensorType: "humedad" as const,
      stats: stats?.humedad || null,
      loadingStats,
      errorStats,
    },
    {
      title: "Temperatura Ambiente",
      subtitle: "Tendencia últimos 7 días",
      icon: FiTrendingUp,
      trending: "Monitoreo continuo 24/7",
      chartType: "line" as const,
      sensorType: "temperatura" as const,
      stats: stats?.temperatura || null,
      loadingStats,
      errorStats,
    },
    {
      title: "Precipitación",
      subtitle: "Registro últimos 7 días",
      icon: FiSun,
      trending: "Datos pluviométricos en tiempo real",
      chartType: "donut" as const,
      sensorType: "lluvia" as const,
      // stats: stats?.lluvia || null, // Si agregas stats de lluvia en getSensorStats
      loadingStats,
      errorStats,
    },
  ];

  return (
    <>
      <LayoutAdmin title="Dashboard - Gestión de Parcelas">
        <div className=" max-w-7xl mx-auto mb-8">
          <div className="lg:col-span-2">
            <MapCard
              title="Mapa de parcelas vigentes"
              apiEndpoint={buildApiUrl(API_CONFIG.ENDPOINTS.SENSORES, "/")}
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
                    stats={card.stats}
                    loadingStats={card.loadingStats}
                    errorStats={card.errorStats}
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
