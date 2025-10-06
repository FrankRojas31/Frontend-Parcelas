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
    { icon: FiUser, label: "Usuario", path: "/usuarios" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
        
        <div className="relative" ref={dropdownRef}>
          <button
            className={`rounded-full transition-all duration-200 p-4 ${
              showDropdown
                ? "bg-blue-100/80 hover:bg-blue-100/80"
                : "hover:bg-gray-100/80"
            }`}
            aria-label="Configuración"
            onClick={toggleDropdown}
          >
            <FiSettings
              className={`size-6 transition-transform duration-200 ${
                showDropdown ? "text-blue-600 rotate-90" : "text-gray-700"
              }`}
            />
          </button>

          {showDropdown && (
            <div className="absolute bottom-full mb-2 right-0 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 py-2 min-w-[160px] animate-fadeIn">
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
