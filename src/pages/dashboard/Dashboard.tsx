import Menu from "../../components/custom/Menu";
import StatsCard from "../../components/custom/StatsCard";
import ChartCard from "../../components/custom/ChartCard";
import HistoryCard from "../../components/custom/HistoryCard";
import MapCard from "../../components/custom/MapCard";
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
      subtitle: "Enero - Julio 2024",
      icon: FiActivity,
      trending: "Trending up by 6.2% this month",
      chartType: "bar" as const,
    },
    {
      title: "Temperatura",
      subtitle: "Enero - Julio 2024",
      icon: FiTrendingUp,
      trending: "Trending up by 5.2% this month",
      chartType: "line" as const,
    },
    {
      title: "Distribución de cultivos",
      subtitle: "Enero - Julio 2024",
      icon: FiUsers,
      trending: "Trending up by 8.2% this month",
      chartType: "donut" as const,
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/background.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Dashboard Content */}
      <div className="relative z-10 min-h-screen p-6 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">
            Dashboard - Gestor de parcelas
          </h1>
          <div className="text-white text-sm bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Primera fila */}
          <div className="lg:col-span-1">
            <StatsCard
              title="Parcelas"
              icon={FiSun}
              positiveValue={1}
              negativeValue={1}
              iconColor="text-yellow-500"
            />
          </div>

          <div className="lg:col-span-2">
            <MapCard
              title="Mapa de parcelas vigentes"
              date="Miércoles 25 de Septiembre del 2025"
            />
          </div>

          {/* Segunda fila - Histórico de Datos */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-semibold text-white mb-4">
              Histórico de Datos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>

          {/* Tercera fila - Historial de eliminadas */}
          <div className="lg:col-span-3">
            <HistoryCard
              title="Historial de parcelas eliminadas"
              items={historyItems}
            />
          </div>
        </div>
      </div>

      {/* Menu */}
      <Menu />
    </div>
  );
}

export default Dashboard;
