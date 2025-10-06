import { Mail, Lock } from "lucide-react";

const Login = () => {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/background.jpg")' }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 backdrop-blur-sm"></div>

      <form className="relative z-10 bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl border border-white/30 px-10 py-12 w-[90%] max-w-md flex flex-col items-center animate-fadeIn">
        <h2 className="text-4xl font-semibold text-white mb-8 tracking-wide">
          Inicia Sesión
        </h2>

        <div className="w-full flex flex-col space-y-5">
          <div className="flex flex-col text-left">
            <label
              htmlFor="email"
              className="mb-2 text-gray-200 font-medium tracking-wide"
            >
              Correo
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                id="email"
                type="email"
                placeholder="correo@ejemplo.com"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white/70 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              />
            </div>
          </div>

          <div className="flex flex-col text-left">
            <label
              htmlFor="password"
              className="mb-2 text-gray-200 font-medium tracking-wide"
            >
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
              <input
                id="password"
                type="password"
                placeholder="********"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-white/70 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 w-3/4 py-2.5 bg-indigo-500 text-white font-semibold rounded-full shadow-md hover:bg-indigo-600 hover:shadow-lg active:scale-95 transition-all duration-200"
        >
          Acceder
        </button>

        <p className="mt-6 text-gray-200 text-sm">
          ¿No tienes una cuenta?{" "}
          <a
            href="/register"
            className="text-indigo-300 hover:text-indigo-400 underline transition-colors"
          >
            Regístrate
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
