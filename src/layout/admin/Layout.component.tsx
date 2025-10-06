import Menu from "../../components/custom/Menu";
interface LayoutAdminProps {
  title?: string;
  children: React.ReactNode;
}

export function LayoutAdmin({ ...props }: LayoutAdminProps) {
  return (
    <>
      <div className="relative min-h-screen w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/background.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 px-10 py-4 mb-14">
          <div className="flex items-center justify-between mb-8">
            {props.title && (
              <h1 className="text-3xl font-bold text-white">{props.title}</h1>
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
          {props.children}
        </div>
      </div>
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[600px] z-50">
        <Menu />
      </div>
    </>
  );
}
