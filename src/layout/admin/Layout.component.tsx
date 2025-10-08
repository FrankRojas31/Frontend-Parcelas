import Menu from "../../components/custom/Menu";
interface LayoutAdminProps {
  title?: string;
  children: React.ReactNode;
}

export function LayoutAdmin({ ...props }: LayoutAdminProps) {
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
            <div className="text-white text-sm bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
              {new Date().toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
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