import { Mail, Lock, Eye, EyeOff, MapPin } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", { email, password });
    localStorage.setItem("token", "demo-token");
    navigate("/");
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
          <h1 className="text-3xl font-bold text-white mb-2">Gestor de Parcelas</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Iniciar Sesión
          </h2>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@parcelas.com"
                  required
                  className="w-full pl-10 pr-4 py-3.5 bg-white text-gray-800 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 form-input text-base"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña segura"
                  required
                  className="w-full pl-10 pr-12 py-3.5 bg-white text-gray-800 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 form-input text-base"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

           
          </div>

          <button
            type="submit"
            className="w-full mt-8 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl active:scale-[0.98] transition-all duration-200 text-base btn-parcelas"
          >
            Iniciar Sesión
          </button>

          <p className="mt-6 text-center text-gray-600 text-sm">
            ¿No tienes una cuenta?{" "}
            <a
              href="/register"
              className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
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
