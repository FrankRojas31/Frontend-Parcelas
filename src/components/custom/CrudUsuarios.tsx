import React from "react";

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  parcelas: number;
  rol: string;
}

// Agrega las props aquí
interface CrudUsuariosProps {
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
}

const usuariosDummy: Usuario[] = [
  { id: 1, nombre: "Martinez Lara Jose Moises", correo: "Jose@gmail.com", parcelas: 4, rol: "Administrador" },
  { id: 2, nombre: "Martinez Lara Jose Moises", correo: "223913@gmail.com", parcelas: 12, rol: "Administrador" },
  { id: 3, nombre: "Martinez Lara Jose Moises", correo: "Jose@gmail.com", parcelas: 6, rol: "Administrador" },
  { id: 4, nombre: "Martinez Lara Jose Moises", correo: "Jose@gmail.com", parcelas: 2, rol: "Administrador" },
  { id: 5, nombre: "Martinez Lara Jose Moises", correo: "Jose@gmail.com", parcelas: 1, rol: "Administrador" },
  { id: 6, nombre: "Martinez Lara Jose Moises", correo: "Jose@gmail.com", parcelas: 12, rol: "Administrador" },
  { id: 7, nombre: "Martinez Lara Jose Moises", correo: "Jose@gmail.com", parcelas: 4, rol: "Administrador" },
];

const iconEdit = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
    <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"/>
  </svg>
);

const iconDelete = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffffff">
    <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z"/>
  </svg>
);

// Recibe las props aquí
const CrudUsuarios: React.FC<CrudUsuariosProps> = ({ onEdit, onDelete }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-md p-2 bg-white">
      <table className="min-w-full border-separate border-spacing-0">
        <thead>
          <tr className="bg-lime-600">
            <th className="text-white px-4 py-3 text-left font-bold">Nombre</th>
            <th className="text-white px-4 py-3 text-left font-bold">Correo</th>
            <th className="text-white px-4 py-3 text-left font-bold">Parcelas</th>
            <th className="text-white px-4 py-3 text-left font-bold">Rol</th>
            <th className="text-white px-4 py-3 text-center font-bold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosDummy.map((usuario, idx) => (
            <tr key={usuario.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}>
              <td className="px-4 py-2">{usuario.nombre}</td>
              <td className="px-4 py-2">{usuario.correo}</td>
              <td className="px-4 py-2">{usuario.parcelas}</td>
              <td className="px-4 py-2">{usuario.rol}</td>
              <td className="px-4 py-2 text-center">
                <button
                  className="inline-flex items-center justify-center rounded-full bg-yellow-500 hover:bg-yellow-600 p-2 mr-2"
                  title="Editar"
                  onClick={() => onEdit(usuario)}
                >
                  {iconEdit}
                </button>
                <button
                  className="inline-flex items-center justify-center rounded-full bg-red-500 hover:bg-red-800 p-2"
                  title="Eliminar"
                  onClick={() => onDelete(usuario)}
                >
                  {iconDelete}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CrudUsuarios;