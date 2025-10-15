import { Mail, Lock, Eye, EyeOff, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const success = await login({ email, password });
      if (success) {
        navigate("/");
      } else {
        setError("Credenciales inválidas. Por favor, intenta de nuevo.");
      }
    } catch (error) {
      setError("Error al iniciar sesión. Por favor, intenta de nuevo.");
      console.error("Error en login:", error);
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: 'url("/background.jpg")' }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-600 rounded-2xl mb-4 shadow-lg">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Gestor de Parcelas
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500 ease-out"
          style={{ animation: "slideInUp 0.5s ease-out" }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Iniciar Sesión
          </h2>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-white mb-2"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@parcelas.com"
                  required
                  className="w-full pl-10 pr-4 py-3.5 bg-white/10 text-white border-2 border-white rounded-xl focus:outline-none form-input text-base placeholder-gray-300"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-white mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña segura"
                  required
                  className="w-full pl-10 pr-12 py-3.5 bg-white/10 text-white border-2 border-white rounded-xl focus:outline-none form-input text-base placeholder-gray-300"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl active:scale-[0.98] transition-all duration-200 text-base btn-parcelas disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-emerald-600 disabled:hover:to-emerald-700"
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </button>

          <p className="mt-6 text-center text-white text-sm">
            ¿No tienes una cuenta?{" "}
            <a
              href="/register"
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              Crear cuenta
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
