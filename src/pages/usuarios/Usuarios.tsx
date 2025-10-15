import { useState, useEffect } from "react";
import Card from "../../components/custom/Card.component";
import CrudUsuarios from "../../components/custom/CrudUsuarios";
import Modal from "../../components/custom/Modals";
import { LayoutAdmin } from "../../layout/admin/Layout.component";
import type { Usuario } from "../../types";
import {
  deleteUsuarioWithAlert,
  createUsuarioWithAlert,
  updateUsuarioWithAlert,
} from "../../services/usuarios.service";
import { createPersonaWithAlert, updatePersonaWithAlert } from "../../services/personas.service";
import ModalUsuarioForm from "./components/ModalUsuarioForm";

function Usuarios() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);
  const [usuarioFormData, setUsuarioFormData] = useState<any>(null);
  const [reloadTable, setReloadTable] = useState(false);

  // Abre el modal con el tipo correspondiente
  const openModal = (type: "add" | "edit", usuario?: Usuario) => {
    setModalType(type);
    setSelectedUsuario(usuario || null);
    setIsModalOpen(true);
  };

  // Manejar eliminación con confirmación integrada
  const handleDelete = async (usuario: Usuario) => {
    const success = await deleteUsuarioWithAlert(usuario.id, usuario.username);
    if (success) {
      setReloadTable(true);
    }
  };

  // Confirmar acciones (crear, editar)
  const handleConfirm = async () => {
    try {
      if ((modalType === "add" || modalType === "edit") && usuarioFormData) {
        if (modalType === "add") {
          // Crear persona con alerta
          const personaCreada = await createPersonaWithAlert({
            nombre: usuarioFormData.persona.nombre,
            apellido_paterno: usuarioFormData.persona.apellidoPaterno,
            apellido_materno: usuarioFormData.persona.apellidoMaterno,
            telefono: usuarioFormData.persona.telefono,
            direccion: usuarioFormData.persona.direccion,
            fecha_nacimiento: usuarioFormData.persona.fechaNacimiento,
          });

          if (personaCreada) {
            // Crear usuario con alerta
            const usuarioCreado = await createUsuarioWithAlert({
              username: usuarioFormData.usuario.username,
              email: usuarioFormData.usuario.email,
              password: usuarioFormData.usuario.password!,
              id_role: Number(usuarioFormData.usuario.rol),
              id_persona: personaCreada.id!,
            });

            if (usuarioCreado) {
              setReloadTable(true);
              setIsModalOpen(false);
              setUsuarioFormData(null);
            }
          }
        } else if (modalType === "edit" && selectedUsuario) {
          // Actualizar persona con alerta
          const personaActualizada = await updatePersonaWithAlert(
            selectedUsuario.id_persona,
            {
              nombre: usuarioFormData.persona.nombre,
              apellido_paterno: usuarioFormData.persona.apellidoPaterno,
              apellido_materno: usuarioFormData.persona.apellidoMaterno,
              telefono: usuarioFormData.persona.telefono,
              direccion: usuarioFormData.persona.direccion,
              fecha_nacimiento: usuarioFormData.persona.fechaNacimiento,
            },
            `${usuarioFormData.persona.nombre} ${usuarioFormData.persona.apellidoPaterno}`
          );

          if (personaActualizada) {
            // Actualizar usuario con alerta
            const usuarioActualizado = await updateUsuarioWithAlert(
              selectedUsuario.id,
              {
                username: usuarioFormData.usuario.username,
                email: usuarioFormData.usuario.email,
                password: usuarioFormData.usuario.password!,
                id_role: Number(usuarioFormData.usuario.rol),
              },
              usuarioFormData.usuario.username
            );

            if (usuarioActualizado) {
              setReloadTable(true);
              setIsModalOpen(false);
              setUsuarioFormData(null);
              setSelectedUsuario(null);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error al procesar la acción:", error);
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
          onDelete={handleDelete}
          reload={reloadTable}
        />
      </Card>

      <Modal
        type={modalType}
        title={modalType === "add" ? "Agregar Usuario" : "Editar Usuario"}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onButtonClick={handleConfirm}
      >
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
      </Modal>
    </LayoutAdmin>
  );
}

export default Usuarios;
