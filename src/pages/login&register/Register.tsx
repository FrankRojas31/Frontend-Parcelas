import { User, Mail, Lock, Eye, EyeOff, UserPlus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/auth.service";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    direccion: "",
    fechaNacimiento: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (
      !formData.username ||
      !formData.name ||
      !formData.lastname ||
      !formData.email ||
      !formData.password
    ) {
      setError("Por favor, completa todos los campos obligatorios");
      return;
    }

    try {
      setIsLoading(true);

      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        nombre: formData.name,
        apellido_paterno: formData.lastname,
        apellido_materno: "", // Campo opcional
        telefono: formData.telefono || "",
        direccion: formData.direccion || "",
        fecha_nacimiento: formData.fechaNacimiento || "",
      };

      const response = await registerUser(registerData);

      if (response.success) {
        // Registro exitoso, redirigir al login
        navigate("/login");
      } else {
        setError(response.message || "Error en el registro");
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al registrar usuario. Por favor, intenta de nuevo.";
      setError(errorMessage);
      console.error("Error en registro:", error);
    } finally {
      setIsLoading(false);
    }
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
                  htmlFor="username"
                  className="block text-sm font-semibold text-white mb-1"
                >
                  Nombre de Usuario
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="juan_perez"
                    required
                    className="w-full pl-9 pr-3 py-2.5 bg-white/10 text-white border-2 border-white rounded-lg focus:outline-none form-input text-sm placeholder-gray-300"
                  />
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

            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-200 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:from-emerald-700 hover:to-emerald-800 hover:shadow-xl active:scale-[0.98] transition-all duration-200 text-sm btn-parcelas disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-emerald-600 disabled:hover:to-emerald-700"
            >
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
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
