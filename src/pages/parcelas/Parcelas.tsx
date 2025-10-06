import { useState, useEffect, useRef } from "react";
import Card from "../../components/custom/Card.component";
import LeafletMap from "../../components/custom/LeafletMap";
import { LayoutAdmin } from "../../layout/admin/Layout.component";
import Modal from "../../components/custom/Modals";
import {
  getAllParcelas,
  createParcela,
  updateParcela,
  deleteParcela,
} from "../../services/parcelas.service";
import { getAllUsuarios } from "../../services/usuarios.service";
import type { Usuario } from "../../types";

function Parcelas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "delete">("add");
  const [selectedParcela, setSelectedParcela] = useState<any>(null);
  const [parcelas, setParcelas] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nombreRef = useRef<HTMLInputElement>(null);
  const latitudRef = useRef<HTMLInputElement>(null);
  const longitudRef = useRef<HTMLInputElement>(null);
  const usuarioRef = useRef<HTMLSelectElement>(null);

  const getMapCenter = (): [number, number] => {
    if (parcelas.length > 0) {
      const avgLat = parcelas.reduce((sum, p) => sum + p.lat, 0) / parcelas.length;
      const avgLng = parcelas.reduce((sum, p) => sum + p.lng, 0) / parcelas.length;
      return [avgLat, avgLng];
    }
    return [9.934739, -84.087502]; 
  };

  const mapCenter: [number, number] = getMapCenter();
  const mapZoom = parcelas.length > 0 ? 10 : 8;

  useEffect(() => {
    fetchParcelas();
    fetchUsuarios();
  }, []);

  const fetchParcelas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllParcelas();
      
      const parcelasTransformadas = data
        .filter((p) => !p.borrado)
        .map((parcela) => ({
          lat: parseFloat(parcela.latitud),
          lng: parseFloat(parcela.longitud),
          id: parcela.id?.toString() || "", 
          name: parcela.nombre,
          id_usuario: parcela.id_usuario,
        }));
      
      setParcelas(parcelasTransformadas);
    } catch (err) {
      setError("Error al cargar las parcelas. Verifica que el servidor esté corriendo.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const data = await getAllUsuarios();
      const usuariosFiltrados = data.filter((u) => !u.borrado);
      setUsuarios(usuariosFiltrados);
    } catch (err) {
      setError("Error al cargar usuarios. Verifica que el servidor esté corriendo.");
    }
  };

  const openModal = (type: "add" | "edit" | "delete", parcela?: any) => {
    setModalType(type);
    setSelectedParcela(parcela || null);
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setError(null);

      if (modalType === "add") {
        const nombre = nombreRef.current?.value?.trim() || "";
        const latitud = latitudRef.current?.value?.trim() || "";
        const longitud = longitudRef.current?.value?.trim() || "";
        const id_usuario = parseInt(usuarioRef.current?.value || "0");

        if (!nombre || !latitud || !longitud || !id_usuario) {
          alert("Todos los campos son requeridos");
          setLoading(false);
          return;
        }

        if (isNaN(parseFloat(latitud)) || isNaN(parseFloat(longitud))) {
          alert("Las coordenadas deben ser números válidos");
          setLoading(false);
          return;
        }

        await createParcela({
          nombre,
          latitud,
          longitud,
          id_usuario,
        });

        alert("Parcela creada exitosamente");
      } else if (modalType === "edit" && selectedParcela) {
        const nombre = nombreRef.current?.value?.trim() || selectedParcela.name;
        const latitud = latitudRef.current?.value?.trim() || selectedParcela.lat.toString();
        const longitud = longitudRef.current?.value?.trim() || selectedParcela.lng.toString();
        const id_usuario = parseInt(usuarioRef.current?.value || selectedParcela.id_usuario.toString());

        if (isNaN(parseFloat(latitud)) || isNaN(parseFloat(longitud))) {
          alert("Las coordenadas deben ser números válidos");
          setLoading(false);
          return;
        }

        await updateParcela(parseInt(selectedParcela.id), {
          nombre,
          latitud,
          longitud,
          id_usuario,
        });

        alert("Parcela actualizada exitosamente");
      } else if (modalType === "delete" && selectedParcela) {
        await deleteParcela(parseInt(selectedParcela.id));
        alert("Parcela eliminada exitosamente");
      }
      await fetchParcelas();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error en la operación:", err);
      alert(`Error: ${err.message || "Ocurrió un error al procesar la solicitud"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LayoutAdmin title="Gestión de Parcelas">
      <Card title="Parcelas" type="add" onButtonClick={() => openModal("add")}>
        <div className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300">
              <strong>Error:</strong> {error}
            </div>
          )}
          {loading && (
            <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded border border-blue-300">
              Cargando datos...
            </div>
          )}
          
          <div className="mb-3 text-sm text-gray-600">
            Total de parcelas: <strong>{parcelas.length}</strong>
          </div>

          <Card title="Mapa de Parcelas" className="w-full" secondary>
            <div className="p-4">
              {parcelas.length === 0 && !loading ? (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">No hay parcelas registradas</p>
                  <p className="text-sm">Haz clic en el botón "+" para agregar una nueva parcela</p>
                </div>
              ) : (
                <LeafletMap
                  center={mapCenter}
                  zoom={mapZoom}
                  parcelas={parcelas}
                  height="h-[500px]"
                  showActions={true}
                  onEditParcela={(parcela) => openModal("edit", parcela)}
                  onDeleteParcela={(parcela) => openModal("delete", parcela)}
                />
              )}
            </div>
          </Card>
        </div>
      </Card>
      <Modal
        type={modalType}
        title={
          modalType === "add"
            ? "Agregar Parcela"
            : modalType === "edit"
            ? "Editar Parcela"
            : "Confirmar Eliminación"
        }
        description={
          modalType === "delete" && selectedParcela
            ? `¿Estás seguro de que deseas eliminar la parcela "${selectedParcela.name}"?`
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
                ref={nombreRef}
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                placeholder="Nombre de la parcela..."
                defaultValue={
                  modalType === "edit" && selectedParcela
                    ? selectedParcela.name
                    : ""
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Coordenadas
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  ref={latitudRef}
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1.5 text-sm"
                  placeholder="Latitud"
                  defaultValue={
                    modalType === "edit" && selectedParcela
                      ? selectedParcela.lat
                      : ""
                  }
                />
                <input
                  ref={longitudRef}
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1.5 text-sm"
                  placeholder="Longitud"
                  defaultValue={
                    modalType === "edit" && selectedParcela
                      ? selectedParcela.lng
                      : ""
                  }
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Usuario responsable
              </label>
              <select
                ref={usuarioRef}
                title="Usuario responsable"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                defaultValue={
                  modalType === "edit" && selectedParcela
                    ? selectedParcela.id_usuario
                    : ""
                }
              >
                <option value="">Selecciona un usuario</option>
                {usuarios.length === 0 ? (
                  <option value="" disabled>Cargando usuarios...</option>
                ) : (
                  usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.username}
                    </option>
                  ))
                )}
              </select>
              {usuarios.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  No hay usuarios disponibles. Verifica la conexión con el servidor.
                </p>
              )}
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

export default Parcelas;
