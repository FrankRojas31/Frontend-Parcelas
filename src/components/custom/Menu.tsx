import { Button } from "../ui/button";
import { FiPieChart, FiBarChart, FiUser, FiSettings } from "react-icons/fi";

export default function Menu() {
  const menuItems = [
    { icon: FiPieChart, label: "Gráfico circular" },
    { icon: FiBarChart, label: "Gráfico de barras" },
    { icon: FiUser, label: "Usuario" },
    { icon: FiSettings, label: "Configuración" },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 inset-shadow-sm inset-shadow-gray-500/40 backdrop-blur-md rounded-[40px] w-[390px] h-[70px] flex items-center justify-center px-8 shadow-2xl z-[9999]">
      <div className="flex items-center justify-between w-full max-w-[280px]">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className="p-4 hover:bg-gray-100/80 rounded-full transition-all duration-200 w-16 h-16"
              aria-label={item.label}
            >
              <IconComponent className="size-6 text-gray-700" />
            </Button>
          );
        })}
      </div>
    </div>
  );
}
