import { useState, useEffect, useRef } from "react";
import Card from "../../components/custom/Card.component";
import LeafletMap from "../../components/custom/LeafletMap";
import { LayoutAdmin } from "../../layout/admin/Layout.component";
import Modal from "../../components/custom/Modals";
import {
  getParcelasWithResponsables,
  getParcelasForTable,
  createOrUpdateParcelaSQL,
  updateParcelaSQL,
  removeResponsableFromParcela,
  type ParcelaWithResponsable
} from "../../services/parcelas-sql.service";
import { getAllUsuarios } from "../../services/usuarios.service";
import { SweetAlert } from "../../components/custom/SweetAlert";
import type { Usuario } from "../../types";

function Parcelas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit">("add");
  const [selectedParcela, setSelectedParcela] = useState<ParcelaWithResponsable | null>(null);
  const [parcelas, setParcelas] = useState<ParcelaWithResponsable[]>([]); // Para el mapa
  const [parcelasTabla, setParcelasTabla] = useState<any[]>([]); // Para la tabla (solo SQL)
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [operationLoading, setOperationLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const nombreRef = useRef<HTMLInputElement>(null);
  const usuarioRef = useRef<HTMLSelectElement>(null);

  const getMapCenter = (): [number, number] => {
    if (parcelas.length > 0) {
      const avgLat = parcelas.reduce((sum, p) => sum + p.coords.lat, 0) / parcelas.length;
      const avgLng = parcelas.reduce((sum, p) => sum + p.coords.lon, 0) / parcelas.length;
      return [avgLat, avgLng];
    }
    return [9.934739, -84.087502]; 
  };

  const mapCenter: [number, number] = getMapCenter();
  const mapZoom = parcelas.length > 0 ? 10 : 8;

  useEffect(() => {
    fetchParcelas();
    fetchParcelasTabla();
    fetchUsuarios();
  }, []);

  const fetchParcelas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        // Intentar obtener parcelas con responsables
        const data = await getParcelasWithResponsables();
        setParcelas(data);
      } catch (responsableError) {
        console.warn("No se pudieron obtener parcelas con responsables, usando endpoint básico:", responsableError);
        
        // Fallback: usar endpoint básico y transformar los datos
        const response = await fetch('http://localhost:3000/api/parcelas/');
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
          const transformedData = result.data.map((parcela: any) => ({
            _id: parcela._id || parcela.id,
            coords: parcela.coords || { lat: 0, lon: 0 },
            sensores: parcela.sensores || {
              temperatura: [{
                value: parcela.value || 0,
                unit: parcela.unit || "°C",
                timestamp: parcela.timestamp || new Date().toISOString(),
                coords: parcela.coords || { lat: 0, lon: 0 },
                type: "temperatura"
              }]
            },
            timestamp: parcela.timestamp || new Date().toISOString(),
            isDeleted: parcela.isDeleted || false,
            sqlData: null,
            hasResponsable: false,
            responsable: null,
            nombre: null
          }));
          setParcelas(transformedData);
        } else {
          setParcelas([]);
        }
      }
    } catch (err) {
      console.error("Error al cargar parcelas:", err);
      setError("Error al cargar las parcelas. Verifica que el servidor esté corriendo.");
      setParcelas([]);
    } finally {
      setLoading(false);
      setLastUpdate(new Date());
    }
  };

  const fetchParcelasTabla = async () => {
    try {
      setError(null);
      const data = await getParcelasForTable();
      setParcelasTabla(data);
    } catch (err) {
      console.error("Error al cargar parcelas para tabla:", err);
      setError("Error al cargar las parcelas para la tabla.");
      setParcelasTabla([]);
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

  const openModal = (type: "add" | "edit", parcela?: ParcelaWithResponsable) => {
    setModalType(type);
    setSelectedParcela(parcela || null);
    setIsModalOpen(true);
  };

  // Manejar eliminación con confirmación integrada
  const handleDeleteResponsable = async (parcela: ParcelaWithResponsable) => {
    if (!parcela.sqlData || operationLoading) return;
    
    const result = await SweetAlert.confirm({
      title: '¿Eliminar responsable?',
      text: `Se eliminará el responsable de la parcela "${parcela.nombre || 'Sin nombre'}".`,
      icon: 'warning',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    });
    
    if (result.isConfirmed) {
      try {
        setOperationLoading(true);

        await removeResponsableFromParcela(parcela.sqlData.id);
        
        await SweetAlert.success({
          title: '¡Eliminado!',
          text: 'El responsable ha sido eliminado exitosamente.',
          timer: 2000,
        });
        
        await fetchParcelas();
        await fetchParcelasTabla();
      } catch (error) {
        await SweetAlert.errorOperation('eliminar el responsable', error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setOperationLoading(false);
      }
    }
  };

  const handleConfirm = async () => {
    if (operationLoading) return;
    
    try {
      if (modalType === "add" && selectedParcela) {
        // Asignar responsable a parcela existente de MongoDB
        const nombre = nombreRef.current?.value?.trim() || "";
        const id_usuario = parseInt(usuarioRef.current?.value || "0");

        if (!nombre || !id_usuario) {
          await SweetAlert.warning({
            title: 'Campos requeridos',
            text: 'Nombre y responsable son requeridos',
          });
          return;
        }

        // Cerrar modal y mostrar loading completo
        setIsModalOpen(false);
        setOperationLoading(true);

        await createOrUpdateParcelaSQL({
          parcelaMg_Id: selectedParcela._id,
          nombre,
          id_usuario,
        });

        await SweetAlert.successAssign(`la parcela "${nombre}"`, 'el responsable seleccionado');
        
        await fetchParcelas();
        await fetchParcelasTabla();
        return;
        
      } else if (modalType === "edit" && selectedParcela) {
        const nombre = nombreRef.current?.value?.trim() || selectedParcela.nombre || "";
        const id_usuario = parseInt(usuarioRef.current?.value || (selectedParcela.responsable?.id.toString() || "0"));

        if (!nombre) {
          await SweetAlert.warning({
            title: 'Campo requerido',
            text: 'El nombre es requerido',
          });
          return;
        }

        // Cerrar modal y mostrar loading completo
        setIsModalOpen(false);
        setOperationLoading(true);

        if (selectedParcela.sqlData) {
          // Actualizar parcela SQL existente
          await updateParcelaSQL(selectedParcela.sqlData.id, {
            nombre,
            id_usuario: id_usuario || undefined,
          });
        } else {
          // Crear nueva asociación SQL
          await createOrUpdateParcelaSQL({
            parcelaMg_Id: selectedParcela._id,
            nombre,
            id_usuario: id_usuario || undefined,
          });
        }

        await SweetAlert.successUpdate(`La parcela "${nombre}"`);
        
        await fetchParcelas();
        await fetchParcelasTabla();
        return;
      }
    } catch (err: any) {
      console.error("Error en la operación:", err);
      await SweetAlert.errorOperation(
        modalType === "add" ? "asignar el responsable" : "actualizar la parcela", 
        err.message || "Ocurrió un error al procesar la solicitud"
      );
    } finally {
      setOperationLoading(false);
    }
  };

  // Filtrar parcelas de la tabla según el término de búsqueda
  const getFilteredParcelasTabla = () => {
    let filtered = parcelasTabla;
    
    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(p => 
        (p.nombre?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.responsable?.username?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.responsable?.persona?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.responsable?.persona?.apellido_paterno?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    return filtered;
  };

  const filteredParcelasTabla = getFilteredParcelasTabla();

  return (
    <LayoutAdmin title="Gestión de Parcelas">
      <style>{`
        .animation-delay-75 { animation-delay: 0.075s; }
        .animation-delay-150 { animation-delay: 0.15s; }
      `}</style>
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
          
          <div className="mb-3 text-sm text-white">
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
                  parcelas={parcelas.map(p => ({
                    coords: p.coords,
                    sensores: p.sensores,
                    timestamp: p.timestamp,
                    isDeleted: p.isDeleted,
                    // Agregar propiedades faltantes para el tipo
                    value: p.sensores.temperatura[0]?.value || 0,
                    unit: p.sensores.temperatura[0]?.unit || "°C",
                    // Metadata adicional para las acciones
                    _id: p._id,
                    responsable: p.responsable,
                    nombre: p.nombre,
                    hasResponsable: p.hasResponsable
                  }))}
                  height="h-[500px]"
                  showActions={true}
                  onEditParcela={(parcela: any) => {
                    const originalParcela = parcelas.find(p => p._id === parcela._id);
                    if (originalParcela) openModal("edit", originalParcela);
                  }}
                  onDeleteParcela={(parcela: any) => {
                    const originalParcela = parcelas.find(p => p._id === parcela._id);
                    if (originalParcela) handleDeleteResponsable(originalParcela);
                  }}
                  onAddResponsable={(parcela: any) => {
                    const originalParcela = parcelas.find(p => p._id === parcela._id);
                    if (originalParcela) openModal("add", originalParcela);
                  }}
                />
              )}
            </div>
          </Card>

          {/* Tabla de Parcelas con Responsables */}
          <Card title="Gestión de Responsables" className="w-full mt-4" secondary>
            <div className="p-4">
              <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-white">
                  <div>
                    Mostrando: <strong>{filteredParcelasTabla.length}</strong> parcelas con responsables
                    <span> | Total en SQL: <strong>{parcelasTabla.length}</strong></span>
                  </div>
                  {lastUpdate && (
                    <div className="text-xs text-white/70 mt-1">
                      Última actualización: {lastUpdate.toLocaleTimeString()}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm font-medium text-white">Buscar:</label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Por nombre o responsable..."
                      className="border border-white/30 rounded px-3 py-1 text-sm w-48 bg-white/20 backdrop-blur-md placeholder-gray-300 text-white focus:outline-none focus:placeholder-white-400 focus:ring-1 focus:ring-white-500 focus:border-white-500"
                    />
                  </div>
                  <button
                    onClick={() => {
                      fetchParcelas();
                      fetchParcelasTabla();
                    }}
                    disabled={loading || operationLoading}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Refrescar datos"
                  >
                    {loading ? "..." : "↻"}
                  </button>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-white uppercase bg-lime-600">
                    <tr>
                      <th scope="col" className="px-6 py-3 font-bold">Coordenadas</th>
                      <th scope="col" className="px-6 py-3 font-bold">Nombre</th>
                      <th scope="col" className="px-6 py-3 font-bold">Responsable</th>
                      <th scope="col" className="px-6 py-3 font-bold">Temperatura</th>
                      <th scope="col" className="px-6 py-3 font-bold">Estado</th>
                      <th scope="col" className="px-6 py-3 font-bold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredParcelasTabla.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-black/70">
                          {parcelasTabla.length === 0 ? "No hay parcelas con responsables asignados" : "No hay parcelas que coincidan con la búsqueda"}
                        </td>
                      </tr>
                    ) : (
                      filteredParcelasTabla.map((parcela: any) => (
                        <tr key={parcela.id} className="bg-white/10 border-b border-white/20 hover:bg-white/20 backdrop-blur-sm">
                          <td className="px-6 py-4 font-medium text-white">
                            {parcela.coords ? (
                              <div className="text-xs">
                                <div>Lat: {parcela.coords.lat.toFixed(6)}</div>
                                <div>Lon: {parcela.coords.lon.toFixed(6)}</div>
                              </div>
                            ) : (
                              <div className="text-xs text-red-500">
                                <div>MongoDB ID:</div>
                                <div className="font-mono">{parcela.parcelaMg_Id}</div>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {parcela.nombre ? (
                              <span className="font-medium text-black">{parcela.nombre}</span>
                            ) : (
                              <span className="text-white/60 italic">Sin nombre</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {parcela.responsable ? (
                              <div>
                                <div className="font-medium text-black">
                                  {parcela.responsable.username}
                                </div>
                                <div className="text-xs text-black/70">
                                  {parcela.responsable.persona?.nombre} {parcela.responsable.persona?.apellido_paterno}
                                </div>
                              </div>
                            ) : (
                              <span className="text-black/60 italic">Sin responsable</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              {parcela.sensores?.temperatura?.[0]?.value ? (
                                <span 
                                  className={`font-medium ${
                                    parcela.sensores.temperatura[0].value > 30 
                                      ? 'text-red-600' 
                                      : parcela.sensores.temperatura[0].value > 25 
                                        ? 'text-orange-600' 
                                        : 'text-green-600'
                                  }`}
                                >
                                  {parcela.sensores.temperatura[0].value}
                                  <span className="text-black/70 ml-1">
                                    {parcela.sensores.temperatura[0].unit || '°C'}
                                  </span>
                                </span>
                              ) : (
                                <span className="text-black/60">N/A</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Asignado
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  // Convertir el formato para que funcione con el modal existente
                                  const parcelaForModal = {
                                    _id: parcela.parcelaMg_Id,
                                    coords: parcela.coords || { lat: 0, lon: 0 },
                                    sensores: parcela.sensores || { temperatura: [{ value: 0, unit: "°C", timestamp: "", coords: { lat: 0, lon: 0 }, type: "temperatura" }] },
                                    timestamp: parcela.timestamp || "",
                                    isDeleted: parcela.isDeleted || false,
                                    sqlData: {
                                      id: parcela.id,
                                      nombre: parcela.nombre,
                                      parcelaMg_Id: parcela.parcelaMg_Id,
                                      fecha_creacion: parcela.fecha_creacion,
                                      borrado: false
                                    },
                                    hasResponsable: true,
                                    responsable: parcela.responsable,
                                    nombre: parcela.nombre
                                  };
                                  openModal("edit", parcelaForModal);
                                }}
                                className="text-blue-600 hover:text-blue-900 text-xs font-medium"
                                disabled={loading || operationLoading}
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => {
                                  // Convertir el formato para que funcione con el modal existente
                                  const parcelaForModal = {
                                    _id: parcela.parcelaMg_Id,
                                    coords: parcela.coords || { lat: 0, lon: 0 },
                                    sensores: parcela.sensores || { temperatura: [{ value: 0, unit: "°C", timestamp: "", coords: { lat: 0, lon: 0 }, type: "temperatura" }] },
                                    timestamp: parcela.timestamp || "",
                                    isDeleted: parcela.isDeleted || false,
                                    sqlData: {
                                      id: parcela.id,
                                      nombre: parcela.nombre,
                                      parcelaMg_Id: parcela.parcelaMg_Id,
                                      fecha_creacion: parcela.fecha_creacion,
                                      borrado: false
                                    },
                                    hasResponsable: true,
                                    responsable: parcela.responsable,
                                    nombre: parcela.nombre
                                  };
                                  handleDeleteResponsable(parcelaForModal);
                                }}
                                className="text-red-600 hover:text-red-900 text-xs font-medium"
                                disabled={loading || operationLoading}
                              >
                                Quitar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </div>
      </Card>
      <Modal
        type={modalType}
        title={
          modalType === "add"
            ? "Asignar Responsable"
            : "Editar Responsable"
        }
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onButtonClick={handleConfirm}
      >
        {(modalType === "add" || modalType === "edit") && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nombre de la parcela
              </label>
              <input
                ref={nombreRef}
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                placeholder="Nombre para identificar la parcela..."
                defaultValue={
                  modalType === "edit" && selectedParcela
                    ? selectedParcela.nombre || ""
                    : ""
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Coordenadas (Solo lectura)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1.5 text-sm bg-gray-50"
                  placeholder="Latitud"
                  value={selectedParcela ? selectedParcela.coords.lat : ""}
                  readOnly
                />
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1.5 text-sm bg-gray-50"
                  placeholder="Longitud"
                  value={selectedParcela ? selectedParcela.coords.lon : ""}
                  readOnly
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Usuario responsable
              </label>
              <select
                ref={usuarioRef}
                key={`usuario-${selectedParcela?._id || 'new'}-${selectedParcela?.responsable?.id || 'none'}`}
                title="Usuario responsable"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                defaultValue={
                  modalType === "edit" && selectedParcela && selectedParcela.responsable
                    ? selectedParcela.responsable.id.toString()
                    : ""
                }
              >
                <option value="">Selecciona un usuario</option>
                {usuarios.length === 0 ? (
                  <option value="" disabled>Cargando usuarios...</option>
                ) : (
                  usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.username} - {usuario.Tbl_Persona?.nombre} {usuario.Tbl_Persona?.apellido_paterno}
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
        )}
      </Modal>

      {/* Loading Overlay Completo */}
      {operationLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-emerald-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-r-transparent animate-spin"></div>
                <div className="absolute inset-2 border-2 border-emerald-400 rounded-full border-l-transparent animate-spin animation-delay-150"></div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Procesando...
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                {modalType === "add" 
                  ? "Asignando responsable a la parcela"
                  : modalType === "edit"
                  ? "Actualizando información de la parcela"
                  : "Eliminando responsable de la parcela"
                }
              </p>
              
              <div className="flex items-center justify-center space-x-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce animation-delay-75"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce animation-delay-150"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </LayoutAdmin>
  );
}

export default Parcelas;
