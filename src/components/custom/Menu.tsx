import { useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiGrid, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

export default function Menu() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { icon: FiHome, label: "Dashboard", path: "/" },
    { icon: FiGrid, label: "Parcelas", path: "/parcelas" },
    { icon: FiUser, label: "Usuarios", path: "/usuarios" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="w-64 h-full shadow-2xl rounded-tr-4xl border-r border-white/20 flex flex-col overflow-hidden bg-white/20 backdrop-blur-md">
      {/* Header */}
      <div className="text-center py-4 border-b border-white/20">
        <h2 className="text-xl font-bold text-white drop-shadow-lg">
          Sistema Parcelas
        </h2>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={index}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                  isActive
                    ? "bg-white/30 text-white shadow-md border border-white/40 backdrop-blur-sm"
                    : "text-white/90 hover:bg-white/20 hover:text-white"
                }`}
                onClick={() => navigate(item.path)}
              >
                <IconComponent
                  className={`size-5 flex-shrink-0 ${
                    isActive ? "text-white" : "text-white/80"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-white/20">
        <div className="relative" ref={dropdownRef}>
          <button
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
              showDropdown
                ? "bg-white/30 text-white shadow-md backdrop-blur-sm"
                : "text-white/90 hover:bg-white/20 hover:text-white"
            }`}
            onClick={toggleDropdown}
          >
            <FiSettings
              className={`size-5 flex-shrink-0 transition-transform duration-200 ${
                showDropdown ? "text-white rotate-90" : "text-white/80"
              }`}
            />
            <span className="font-medium">Configuración</span>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute bottom-full mb-2 left-0 right-0 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/20 py-2 animate-fadeIn">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 group"
              >
                <FiLogOut className="size-4 group-hover:text-red-600" />
                <span className="text-sm font-medium">Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
