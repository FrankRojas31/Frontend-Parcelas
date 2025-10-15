import Menu from "../../components/custom/Menu";
import { useAuthStore } from "../../stores/auth.store";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

interface LayoutAdminProps {
  title?: string;
  children: React.ReactNode;
}

export function LayoutAdmin({ ...props }: LayoutAdminProps) {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Aunque falle, navegamos al login
      navigate("/login");
    }
  };

  return (
    <div
      className="flex h-screen w-full bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/background.jpg')",
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      {/* Sidebar Menu */}
      <div className="relative z-10">
        <Menu />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <div className="relative flex-shrink-0 px-8 py-3">
          <div className="flex items-center justify-between">
            {props.title && (
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                {props.title}
              </h1>
            )}
            <div className="flex items-center gap-4">
              {user && (
                <div className="text-white text-sm bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  Bienvenido, {user.username}
                </div>
              )}
              <div className="text-white text-sm bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                {new Date().toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-white bg-red-500/80 hover:bg-red-600/90 backdrop-blur-sm rounded-lg px-4 py-2 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Salir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="relative flex-1 overflow-auto">
          <div className="p-8 h-full">{props.children}</div>
        </div>
      </div>
    </div>
  );
}
