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
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                placeholder="Nombre completo"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Correo
              </label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                placeholder="Correo electrónico"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Parcelas
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                placeholder="Cantidad de parcelas"
                value={parcelas}
                onChange={e => setParcelas(Number(e.target.value))}
                min={0}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
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
          <div className="text-sm text-gray-600">
            Esta acción no se puede deshacer.
          </div>
        )}
      </Modal>
    </LayoutAdmin>
  );
}

export default Usuarios;