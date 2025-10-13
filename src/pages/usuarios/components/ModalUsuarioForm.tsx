import { useState, useEffect } from "react";
import type { Rol } from "../../../types";
import { getAllRoles } from "../../../services/roles.service";

interface ModalUsuarioFormProps {
  mode: "add" | "edit";
  initialData?: {
    persona?: {
      nombre: string;
      apellidoPaterno: string;
      apellidoMaterno: string;
      telefono: string;
      direccion: string;
      fechaNacimiento?: string;
    };
    usuario?: {
      username: string;
      email: string;
      rol: string;
    };
  };
  onChange: (formData: any) => void;
}

export default function ModalUsuarioForm({
  initialData,
  onChange,
}: ModalUsuarioFormProps) {
  // Campos de persona
  const [nombre, setNombre] = useState(initialData?.persona?.nombre || "");
  const [apellidoPaterno, setApellidoPaterno] = useState(
    initialData?.persona?.apellidoPaterno || ""
  );
  const [apellidoMaterno, setApellidoMaterno] = useState(
    initialData?.persona?.apellidoMaterno || ""
  );
  const [telefono, setTelefono] = useState(
    initialData?.persona?.telefono || ""
  );
  const [direccion, setDireccion] = useState(
    initialData?.persona?.direccion || ""
  );
  const [fechaNacimiento, setFechaNacimiento] = useState(() => {
    if (initialData?.persona?.fechaNacimiento) {
      const fecha = new Date(initialData.persona.fechaNacimiento);
      // formatea a YYYY-MM-DD
      return fecha.toISOString().split("T")[0];
    }
    return "";
  });

  // Campos de usuario
  const [username, setUsername] = useState(
    initialData?.usuario?.username || ""
  );
  const [email, setEmail] = useState(initialData?.usuario?.email || "");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState(initialData?.usuario?.rol || "");

  // Roles desde el backend
  const [roles, setRoles] = useState<Rol[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await getAllRoles();
        setRoles(data);
      } catch (error) {
        console.error("Error al cargar roles:", error);
      }
    };
    fetchRoles();
  }, []);

  // Emitir los datos hacia el componente padre cuando cambian
  useEffect(() => {
    onChange({
      persona: {
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        telefono,
        direccion,
        fechaNacimiento,
      },
      usuario: { username, email, password, rol },
    });
  }, [
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    telefono,
    direccion,
    fechaNacimiento,
    username,
    email,
    password,
    rol,
  ]);

  return (
    <div className="space-y-6 p-2 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Nombre"
          className="w-full px-4 py-2.5 border border-white rounded-md text-white placeholder-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Apellido paterno"
          className="w-full px-4 py-2.5 border border-white rounded-md text-white placeholder-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={apellidoPaterno}
          onChange={(e) => setApellidoPaterno(e.target.value)}
        />
        <input
          type="text"
          placeholder="Apellido materno"
          className="w-full px-4 py-2.5 border border-white rounded-md text-white placeholder-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={apellidoMaterno}
          onChange={(e) => setApellidoMaterno(e.target.value)}
        />
        <input
          type="text"
          placeholder="Teléfono"
          className="w-full px-4 py-2.5 border border-white rounded-md text-white placeholder-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dirección"
          className="w-full px-4 py-2.5 border border-white rounded-md text-white placeholder-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:col-span-2"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
        />
        <input
          type="date"
          placeholder="Fecha de nacimiento"
          className="w-full px-4 py-2.5 border border-white rounded-md text-white bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nombre de usuario"
          className="w-full px-4 py-2.5 border border-white rounded-md text-white placeholder-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full px-4 py-2.5 border border-white rounded-md text-white placeholder-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:col-span-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full px-4 py-2.5 border border-white rounded-md text-white placeholder-gray-300 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          className="w-full px-4 py-2.5 border border-white rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-transparent"
          value={rol}
          onChange={(e) => setRol(e.target.value)}
        >
          <option value="" className="text-gray-900 bg-white">
            Selecciona un rol
          </option>
          {roles.map((r) => (
            <option key={r.id} value={r.id} className="text-gray-900 bg-white">
              {r.nombre}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
