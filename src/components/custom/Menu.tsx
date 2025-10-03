import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { FiHome, FiGrid, FiUser, FiSettings } from "react-icons/fi";

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: FiHome, label: "Dashboard", path: "/" },
    { icon: FiGrid, label: "Parcelas", path: "/parcelas" },
    { icon: FiUser, label: "Usuario", path: "/usuario" },
    { icon: FiSettings, label: "Configuración", path: "/configuracion" },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 inset-shadow-sm inset-shadow-gray-500/40 backdrop-blur-md rounded-[40px] w-[390px] h-[70px] flex items-center justify-center px-8 shadow-2xl z-[9999]">
      <div className="flex items-center justify-between w-full max-w-[280px]">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={`p-4 rounded-full transition-all duration-200 w-16 h-16 ${
                isActive ? "bg-blue-100/80 hover:bg-blue-100/80" : "hover:bg-gray-100/80"
              }`}
              aria-label={item.label}
              onClick={() => navigate(item.path)}
            >
              <IconComponent className={`size-6 ${isActive ? "text-blue-600" : "text-gray-700"}`} />
            </Button>
          );
        })}
      </div>
    </div>
  );
}
