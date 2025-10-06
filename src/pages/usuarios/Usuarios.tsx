import { useState, useEffect } from "react";
import Card from "../../components/custom/Card.component";
import CrudUsuarios from "../../components/custom/CrudUsuarios";
import Modal from "../../components/custom/Modals";
import { LayoutAdmin } from "../../layout/admin/Layout.component";

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  parcelas: number;
  rol: string;
}

function Usuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "delete">("add");
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);

  // Estados controlados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [parcelas, setParcelas] = useState(0);
  const [rol, setRol] = useState("Administrador");

  // Cuando se abre el modal de editar, cargar los datos del usuario seleccionado
  useEffect(() => {
    if ((modalType === "edit" || modalType === "delete") && selectedUsuario) {
      setNombre(selectedUsuario.nombre);
      setCorreo(selectedUsuario.correo);
      setParcelas(selectedUsuario.parcelas);
      setRol(selectedUsuario.rol);
    }
    if (modalType === "add") {
      setNombre("");
      setCorreo("");
      setParcelas(0);
      setRol("Administrador");
    }
  }, [modalType, selectedUsuario]);

  const openModal = (type: "add" | "edit" | "delete", usuario?: Usuario) => {
    setModalType(type);
    setSelectedUsuario(usuario || null);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (modalType === "add" || modalType === "edit") {
      const usuarioData = {
        id: selectedUsuario?.id || Date.now(),
        nombre,
        correo,
        parcelas,
        rol,
      };
      console.log(`${modalType} usuario:`, usuarioData);
    } else {
      console.log(`${modalType} usuario:`, selectedUsuario);
    }
    setIsModalOpen(false);
  };

  return (
    <LayoutAdmin title="Gestión de Usuarios">
      <Card title="Usuarios" type="add" onButtonClick={() => openModal("add")}>
        <CrudUsuarios
          onEdit={(usuario: Usuario) => openModal("edit", usuario)}
          onDelete={(usuario: Usuario) => openModal("delete", usuario)}
        />
      </Card>
      <Modal
        type={modalType}
        title={
          modalType === "add"
            ? "Agregar Usuario"
            : modalType === "edit"
            ? "Editar Usuario"
            : "Confirmar Eliminación"
        }
        description={
          modalType === "delete" && selectedUsuario
            ? `¿Estás seguro de que deseas eliminar el usuario "${selectedUsuario.nombre}"?`
            : undefined
        }
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onButtonClick={handleConfirm}
      >
        {modalType === "add" || modalType === "edit" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Ingrese el nombre completo"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="ejemplo@correo.com"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Cantidad de parcelas
              </label>
              <input
                type="number"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="0"
                value={parcelas}
                onChange={e => setParcelas(Number(e.target.value))}
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Rol del usuario
              </label>
              <select
                title="Seleccionar rol del usuario"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                value={rol}
                onChange={e => setRol(e.target.value)}
              >
                <option value="Administrador">Administrador</option>
                <option value="Usuario">Usuario</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Esta acción no se puede deshacer.
            </p>
            <p className="text-xs text-gray-500">
              Se eliminará permanentemente el usuario y todos sus datos asociados.
            </p>
          </div>
        )}
      </Modal>
    </LayoutAdmin>
  );
}

export default Usuarios;