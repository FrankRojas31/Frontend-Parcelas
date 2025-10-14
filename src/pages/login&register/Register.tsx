import { User, Mail, Lock, Eye, EyeOff, MapPin, UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Aquí agregarías la lógica de registro
    console.log("Register:", formData);
    navigate("/login");
  };

  return (
    <div
      className="relative min-h-screen bg-cover bg-center"
      style={{ backgroundImage: 'url("/background.jpg")' }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

      <div className="relative z-10 flex items-center justify-center min-h-screen py-8">
        <div className="w-full max-w-lg">
          <form
            onSubmit={handleSubmit}
            className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 transform transition-all duration-500 ease-out"
            style={{ animation: "slideInUp 0.5s ease-out" }}
          >
            <div className="flex items-center justify-center mb-6">
              <UserPlus className="w-6 h-6 text-white mr-2" />
              <h2 className="text-xl font-bold text-white">
                Crear Nueva Cuenta
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-white mb-1"
                  >
                    Nombre
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Juan"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-white/10 text-white border-2 border-white rounded-lg focus:outline-none form-input text-sm placeholder-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lastname"
                    className="block text-sm font-semibold text-white mb-1"
                  >
                    Apellidos
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      id="lastname"
                      name="lastname"
                      type="text"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      placeholder="Pérez"
                      required
                      className="w-full pl-9 pr-3 py-2.5 bg-white/10 text-white border-2 border-white rounded-lg focus:outline-none form-input text-sm placeholder-gray-300"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-white mb-1"
                >
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="juan@parcelas.com"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-white/10 text-white border-2 border-white rounded-lg focus:outline-none form-input text-sm placeholder-gray-300"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-white mb-1"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Mínimo 8 caracteres"
                    required
                    minLength={8}
                    className="w-full pl-9 pr-10 py-2.5 bg-white/10 text-white border-2 border-white rounded-lg focus:outline-none form-input text-sm placeholder-gray-300"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold text-white mb-1"
                >
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Repite tu contraseña"
                    required
                    className="w-full pl-9 pr-10 py-2.5 bg-white/10 text-white border-2 border-white rounded-lg focus:outline-none form-input text-sm placeholder-gray-300"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl active:scale-[0.98] transition-all duration-200 text-sm btn-parcelas"
            >
              Crear Cuenta
            </button>

            <p className="mt-4 text-center text-white text-xs">
              ¿Ya tienes una cuenta?{" "}
              <a
                href="/login"
                className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                Iniciar sesión
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
