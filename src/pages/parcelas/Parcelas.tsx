import { useState } from "react";
import Menu from "../../components/custom/Menu";
import ViewParcelasModal from "../../components/custom/dialogs-parcelas/ViewParcelasModal";
import DeleteParcelasModal from "../../components/custom/dialogs-parcelas/DeleteParcelasModal";
import ParcelaFormModal from "../../components/custom/dialogs-parcelas/ParcelaFormModal";
import type { ParcelaFormData } from "../../components/custom/dialogs-parcelas/ParcelaFormModal";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination";
import { FiEye, FiMapPin, FiPlus } from "react-icons/fi";

// Datos ficticios de ciudades de Quintana Roo
const ciudades = [
  "Cancún",
  "Playa del Carmen",
  "Chetumal",
  "Tulum",
  "Cozumel",
  "Felipe Carrillo Puerto",
  "Bacalar",
  "Isla Mujeres",
  "Puerto Morelos",
  "José María Morelos",
  "Othón P. Blanco",
  "Solidaridad",
];

const parcelasPorCiudad: Record<string, any[]> = {
  "Cancún": [
    { id: 1, nombre: "Parcela Norte A1", hectareas: 5.2, cultivo: "Maíz", responsable: "Juan Pérez García" },
    { id: 2, nombre: "Parcela Norte B2", hectareas: 3.8, cultivo: "Frijol", responsable: "María López Hernández" },
    { id: 3, nombre: "Parcela Centro C1", hectareas: 7.5, cultivo: "Caña", responsable: "Carlos Rodríguez Martínez" },
  ],
  "Playa del Carmen": [
    { id: 4, nombre: "Parcela Costa A1", hectareas: 4.2, cultivo: "Papaya", responsable: "Ana Sánchez Torres" },
    { id: 5, nombre: "Parcela Costa B1", hectareas: 6.1, cultivo: "Piña", responsable: "Luis Martínez Ramírez" },
  ],
  "Chetumal": [
    { id: 6, nombre: "Parcela Sur A1", hectareas: 8.3, cultivo: "Aguacate", responsable: "Carmen González Flores" },
    { id: 7, nombre: "Parcela Sur B2", hectareas: 5.7, cultivo: "Cacao", responsable: "José Hernández Cruz" },
    { id: 8, nombre: "Parcela Sur C3", hectareas: 4.9, cultivo: "Café", responsable: "Patricia Díaz Morales" },
  ],
  "Tulum": [
    { id: 9, nombre: "Parcela Maya A1", hectareas: 3.5, cultivo: "Henequén", responsable: "Juan Pérez García" },
    { id: 10, nombre: "Parcela Maya B1", hectareas: 6.8, cultivo: "Chile", responsable: "María López Hernández" },
  ],
  "Cozumel": [
    { id: 11, nombre: "Parcela Isla A1", hectareas: 2.3, cultivo: "Coco", responsable: "Carlos Rodríguez Martínez" },
  ],
  "Felipe Carrillo Puerto": [
    { id: 12, nombre: "Parcela Centro A1", hectareas: 9.1, cultivo: "Maíz", responsable: "Ana Sánchez Torres" },
    { id: 13, nombre: "Parcela Centro B1", hectareas: 7.2, cultivo: "Calabaza", responsable: "Luis Martínez Ramírez" },
  ],
  "Bacalar": [
    { id: 14, nombre: "Parcela Laguna A1", hectareas: 5.5, cultivo: "Mango", responsable: "Carmen González Flores" },
    { id: 15, nombre: "Parcela Laguna B1", hectareas: 4.3, cultivo: "Limón", responsable: "José Hernández Cruz" },
  ],
  "Isla Mujeres": [
    { id: 16, nombre: "Parcela Isla A1", hectareas: 1.8, cultivo: "Tomate", responsable: "Patricia Díaz Morales" },
  ],
  "Puerto Morelos": [
    { id: 17, nombre: "Parcela Puerto A1", hectareas: 3.9, cultivo: "Sandía", responsable: "Juan Pérez García" },
    { id: 18, nombre: "Parcela Puerto B1", hectareas: 4.7, cultivo: "Melón", responsable: "María López Hernández" },
  ],
  "José María Morelos": [
    { id: 19, nombre: "Parcela Rural A1", hectareas: 6.4, cultivo: "Sorgo", responsable: "Carlos Rodríguez Martínez" },
  ],
  "Othón P. Blanco": [
    { id: 20, nombre: "Parcela Municipal A1", hectareas: 8.7, cultivo: "Arroz", responsable: "Ana Sánchez Torres" },
    { id: 21, nombre: "Parcela Municipal B1", hectareas: 5.2, cultivo: "Soya", responsable: "Luis Martínez Ramírez" },
  ],
  "Solidaridad": [
    { id: 22, nombre: "Parcela Urbana A1", hectareas: 3.1, cultivo: "Hortalizas", responsable: "Carmen González Flores" },
  ],
};

function Parcelas() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCiudad, setSelectedCiudad] = useState<string | null>(null);
  const [selectedParcela, setSelectedParcela] = useState<any | null>(null);
  const [dialogType, setDialogType] = useState<"edit" | "delete" | "view" | "add" | null>(null);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(ciudades.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCiudades = ciudades.slice(startIndex, endIndex);

  const openDialog = (type: "edit" | "delete" | "view" | "add", ciudad: string) => {
    setSelectedCiudad(ciudad);
    setDialogType(type);
  };

  const closeDialog = () => {
    setDialogType(null);
    setSelectedCiudad(null);
    setSelectedParcela(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddParcela = (parcela: ParcelaFormData) => {
    console.log("Nueva parcela agregada:", parcela);
  };

  const handleEditParcela = (parcela: ParcelaFormData) => {
    console.log("Parcela editada:", parcela);
  };

  const handleEditFromList = (parcela: any) => {
    setSelectedParcela(parcela);
    setDialogType("edit");
  };

  const handleDeleteFromList = (parcela: any) => {
    setSelectedParcela(parcela);
    setDialogType("delete");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/background.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Contenido Principal */}
      <div className="relative z-10 min-h-screen p-6 pb-32">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">
            Gestión de Parcelas - Quintana Roo
          </h1>
          <div className="text-white text-sm bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        <div className="max-w-8xl  max-h-8 px-6">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Ciudades con Parcelas Registradas
              </h2>
              <Button
                onClick={() => openDialog("add", currentCiudades[0])}
                className="flex items-center gap-2"
              >
                <FiPlus className="h-5 w-5" />
                Agregar Parcela
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentCiudades.map((ciudad, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FiMapPin className="text-blue-600" />
                      {ciudad}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {parcelasPorCiudad[ciudad]?.length || 0} parcelas registradas
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => openDialog("view", ciudad)}
                    >
                      <FiEye className="mr-2 h-4 w-4" />
                      Ver Parcelas
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      size="default"
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                        size="icon"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      size="default"
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ViewParcelasModal
        isOpen={dialogType === "view"}
        onClose={closeDialog}
        ciudad={selectedCiudad}
        parcelas={selectedCiudad ? parcelasPorCiudad[selectedCiudad] || [] : []}
        onEdit={handleEditFromList}
        onDelete={handleDeleteFromList}
      />

      <ParcelaFormModal
        isOpen={dialogType === "edit"}
        onClose={closeDialog}
        ciudad={selectedCiudad}
        mode="edit"
        initialData={selectedParcela 
          ? {
              ...selectedParcela,
              ubicacion: "21.1619, -86.8515",
              latitud: 21.1619,
              longitud: -86.8515,
              notas: "Datos de ejemplo"
            } 
          : undefined
        }
        onSave={handleEditParcela}
      />

      <DeleteParcelasModal
        isOpen={dialogType === "delete"}
        onClose={closeDialog}
        ciudad={selectedCiudad}
        parcelasCount={selectedParcela ? 1 : (selectedCiudad ? parcelasPorCiudad[selectedCiudad]?.length || 0 : 0)}
        parcelaName={selectedParcela?.nombre}
        onDelete={() => console.log("Eliminar parcela:", selectedParcela || "todas")}
      />

      <ParcelaFormModal
        isOpen={dialogType === "add"}
        onClose={closeDialog}
        ciudad={selectedCiudad}
        mode="add"
        onSave={handleAddParcela}
      />

      {/* Menu */}
      <Menu />
    </div>
  );
}

export default Parcelas;
