import { useNavigate, useLocation } from "react-router-dom";
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
    <div className=" bg-white/95 inset-shadow-sm inset-shadow-gray-500/40 rounded-t-4xl flex items-center justify-center px-8 shadow-2xl z-[9999]">
      <div className="flex items-center justify-between w-full max-w-[280px]">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={index}
              className={`rounded-full transition-all duration-200 p-4 ${
                isActive
                  ? "bg-blue-100/80 hover:bg-blue-100/80"
                  : "hover:bg-gray-100/80"
              }`}
              aria-label={item.label}
              onClick={() => navigate(item.path)}
            >
              <IconComponent
                className={`size-6 ${
                  isActive ? "text-blue-600" : "text-gray-700"
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
