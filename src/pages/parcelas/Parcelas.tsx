import { useState } from "react";
import Card from "../../components/custom/Card.component";
import LeafletMap from "../../components/custom/LeafletMap";
import { LayoutAdmin } from "../../layout/admin/Layout.component";
import Modal from "../../components/custom/Modals";

function Parcelas() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<
    "add" | "edit" | "delete"
  >("add");
  const [selectedParcela, setSelectedParcela] = useState<any>(null);

  const parcelas = [
    {
      lat: 9.934739,
      lng: -84.087502,
      id: "P001",
      name: "Parcela Agrícola San José #1",
      area: "2.5 hectáreas",
      status: "Activa",
    },
    {
      lat: 9.928739,
      lng: -84.081502,
      id: "P002",
      name: "Parcela Agrícola San José #2",
      area: "1.8 hectáreas",
      status: "Activa",
    },
    {
      lat: 9.940739,
      lng: -84.093502,
      id: "P003",
      name: "Parcela Agrícola San José #3",
      area: "3.2 hectáreas",
      status: "Activa",
    },
    {
      lat: 9.937739,
      lng: -84.089502,
      id: "P004",
      name: "Parcela Agrícola San José #4",
      area: "2.1 hectáreas",
      status: "Activa",
    },
  ];
  const mapCenter: [number, number] = [9.934739, -84.087502];
  const mapZoom = 10;

  const openModal = (
    type: "add" | "edit" | "delete",
    parcela?: any
  ) => {
    setModalType(type);
    setSelectedParcela(parcela || null);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    console.log(`${modalType} parcela:`, selectedParcela);
    setIsModalOpen(false);
  };

  return (
    <LayoutAdmin title="Gestión de Parcelas - Quintana Roo">
      <Card title="Parcelas" type="add" onButtonClick={() => openModal("add")}>
        <div className="p-4">
          <Card title="Cancún" className="w-full" secondary>
            <div className="p-4">
              <LeafletMap
                center={mapCenter}
                zoom={mapZoom}
                parcelas={parcelas}
                height="h-[300px]"
                showActions={true}
                onEditParcela={(parcela) => openModal("edit", parcela)}
                onDeleteParcela={(parcela) => openModal("delete", parcela)}
              />
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
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                placeholder="Parcela..."
                defaultValue={
                  modalType === "edit" && selectedParcela
                    ? selectedParcela.name
                    : ""
                }
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Área
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                placeholder="2.5"
                defaultValue={
                  modalType === "edit" && selectedParcela
                    ? selectedParcela.area.replace(" hectáreas", "")
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
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1.5 text-sm"
                  placeholder="Lat"
                  defaultValue={
                    modalType === "edit" && selectedParcela
                      ? selectedParcela.lat
                      : ""
                  }
                />
                <input
                  type="text"
                  className="border border-gray-300 rounded px-2 py-1.5 text-sm"
                  placeholder="Lng"
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
                Estado
              </label>
              <select
                title="Estado"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                defaultValue={
                  modalType === "edit" && selectedParcela
                    ? selectedParcela.status
                    : "Activa"
                }
              >
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
                <option value="En mantenimiento">En mantenimiento</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Usuario responsable
              </label>
              <select
                title="Usuario responsable"
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
                defaultValue={
                  modalType === "edit" && selectedParcela
                    ? selectedParcela.status
                    : "Activa"
                }
              >
                <option value="Activa">Emmanuel</option>
                <option value="Inactiva">Jose</option>
                <option value="Inactiva">Joshua</option>

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

export default Parcelas;
