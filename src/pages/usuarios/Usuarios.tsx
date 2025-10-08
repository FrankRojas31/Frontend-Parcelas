import { useState, useEffect } from "react";
import Card from "../../components/custom/Card.component";
import CrudUsuarios from "../../components/custom/CrudUsuarios";
import Modal from "../../components/custom/Modals";
import { LayoutAdmin } from "../../layout/admin/Layout.component";
import type { Usuario } from "../../types";
import {
  deleteUsuario,
  createUsuario,
  updateUsuario,
} from "../../services/usuarios.service";
import { createPersona, updatePersona } from "../../services/personas.service";
import ModalUsuarioForm from "./components/ModalUsuarioForm";

function Usuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "delete">("add");
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [usuarioFormData, setUsuarioFormData] = useState<any>(null);
  const [reloadTable, setReloadTable] = useState(false);

  // Abre el modal con el tipo correspondiente
  const openModal = (type: "add" | "edit" | "delete", usuario?: Usuario) => {
    setModalType(type);
    setSelectedUsuario(usuario || null);
    setIsModalOpen(true);
  };

  // Confirmar acciones (eliminar, crear, editar)
  const handleConfirm = async () => {
    try {
      if (modalType === "delete" && selectedUsuario) {
        await deleteUsuario(selectedUsuario.id);
      }

      if ((modalType === "add" || modalType === "edit") && usuarioFormData) {
        if (modalType === "add") {
          // Crear persona
          const personaCreada = await createPersona({
            nombre: usuarioFormData.persona.nombre,
            apellido_paterno: usuarioFormData.persona.apellidoPaterno,
            apellido_materno: usuarioFormData.persona.apellidoMaterno,
            telefono: usuarioFormData.persona.telefono,
            direccion: usuarioFormData.persona.direccion,
            fecha_nacimiento: usuarioFormData.persona.fechaNacimiento,
          });

          // Crear usuario
          await createUsuario({
            username: usuarioFormData.usuario.username,
            email: usuarioFormData.usuario.email,
            password: usuarioFormData.usuario.password!,
            id_role: Number(usuarioFormData.usuario.rol),
            id_persona: personaCreada.id,
          });
        } else if (modalType === "edit" && selectedUsuario) {
          // 1️⃣ Actualizar persona
          await updatePersona(selectedUsuario.id_persona, {
            nombre: usuarioFormData.persona.nombre,
            apellido_paterno: usuarioFormData.persona.apellidoPaterno,
            apellido_materno: usuarioFormData.persona.apellidoMaterno,
            telefono: usuarioFormData.persona.telefono,
            direccion: usuarioFormData.persona.direccion,
            fecha_nacimiento: usuarioFormData.persona.fechaNacimiento,
          });

          // 2️⃣ Actualizar usuario
          await updateUsuario(selectedUsuario.id, {
            username: usuarioFormData.usuario.username,
            email: usuarioFormData.usuario.email,
            password: usuarioFormData.usuario.password!,
            id_role: Number(usuarioFormData.usuario.rol),
          });
        }

        setReloadTable(true);
      }

      // Cerrar modal y limpiar estados
      setUsuarioFormData(null);
      setSelectedUsuario(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al procesar la acción:", error);
      alert("Ocurrió un error, revisa la consola.");
      return;
    }
  };

  useEffect(() => {
    if (reloadTable) {
      setReloadTable(false);
    }
  }, [reloadTable]);

  return (
    <LayoutAdmin title="Gestión de Usuarios">
      <Card title="Usuarios" type="add" onButtonClick={() => openModal("add")}>
        <CrudUsuarios
          onEdit={(usuario: Usuario) => openModal("edit", usuario)}
          onDelete={(usuario: Usuario) => openModal("delete", usuario)}
          reload={reloadTable}
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
            ? `¿Estás seguro de que deseas eliminar el usuario "${selectedUsuario.username}"?`
            : undefined
        }
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onButtonClick={handleConfirm}
      >
        {(modalType === "add" || modalType === "edit") && (
          <ModalUsuarioForm
            mode={modalType}
            initialData={
              modalType === "edit" && selectedUsuario
                ? {
                    persona: {
                      nombre: selectedUsuario?.Tbl_Persona?.nombre || "",
                      apellidoPaterno:
                        selectedUsuario?.Tbl_Persona?.apellido_paterno || "",
                      apellidoMaterno:
                        selectedUsuario?.Tbl_Persona?.apellido_materno || "",
                      telefono: selectedUsuario?.Tbl_Persona?.telefono || "",
                      fechaNacimiento:
                        selectedUsuario?.Tbl_Persona?.fecha_nacimiento || "",
                      direccion: selectedUsuario?.Tbl_Persona?.direccion || "",
                    },
                    usuario: {
                      username: selectedUsuario?.username || "",
                      email: selectedUsuario?.email || "",
                      rol: selectedUsuario?.Tbl_Roles?.nombre || "",
                    },
                  }
                : undefined
            }
            onChange={(data) => setUsuarioFormData(data)}
          />
        )}

        {modalType === "delete" && (
          <div className="text-center py-4">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Esta acción no se puede deshacer.
            </p>
            <p className="text-xs text-gray-500">
              Se eliminará permanentemente el usuario y todos sus datos
              asociados.
            </p>
          </div>
        )}
      </Modal>
    </LayoutAdmin>
  );
}

export default Usuarios;
