import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { FiMapPin } from "react-icons/fi";

interface ParcelaModalProps {
  isOpen: boolean;
  onClose: () => void;
  ciudad: string | null;
  mode: "add" | "edit";
  initialData?: ParcelaFormData;
  onSave?: (parcela: ParcelaFormData) => void;
}

export interface ParcelaFormData {
  id?: number;
  nombre: string;
  ubicacion: string;
  latitud: number;
  longitud: number;
  hectareas: number;
  cultivo: string;
  responsable: string;
  notas?: string;
}

const cultivosDisponibles = [
  "Maíz",
  "Frijol",
  "Caña de Azúcar",
  "Papaya",
  "Piña",
  "Aguacate",
  "Cacao",
  "Café",
  "Henequén",
  "Chile",
  "Coco",
  "Calabaza",
  "Mango",
  "Limón",
  "Tomate",
  "Sandía",
  "Melón",
  "Sorgo",
  "Arroz",
  "Soya",
  "Hortalizas",
];

const usuariosResponsables = [
  "Juan Pérez García",
  "María López Hernández",
  "Carlos Rodríguez Martínez",
  "Ana Sánchez Torres",
  "Luis Martínez Ramírez",
  "Carmen González Flores",
  "José Hernández Cruz",
  "Patricia Díaz Morales",
];

const emptyFormData: ParcelaFormData = {
  nombre: "",
  ubicacion: "",
  latitud: 21.1619,
  longitud: -86.8515,
  hectareas: 0,
  cultivo: "",
  responsable: "",
  notas: "",
};

export default function ParcelaModal({
  isOpen,
  onClose,
  ciudad,
  mode,
  initialData,
  onSave,
}: ParcelaModalProps) {
  const [formData, setFormData] = useState<ParcelaFormData>(emptyFormData);

  useEffect(() => {
    if (isOpen) {
      if (mode === "edit" && initialData) {
        setFormData(initialData);
      } else {
        setFormData(emptyFormData);
      }
    }
  }, [isOpen, mode, initialData]);

  const handleSelectLocation = () => {
    // Generar coordenadas aleatorias dentro de Quintana Roo
    const latitudes = [21.1619, 20.6296, 18.5001, 20.2114, 20.5083];
    const longitudes = [-86.8515, -87.0739, -88.2960, -87.4653, -86.9458];
    const randomIndex = Math.floor(Math.random() * latitudes.length);
    
    setFormData({
      ...formData,
      latitud: latitudes[randomIndex],
      longitud: longitudes[randomIndex],
      ubicacion: `${latitudes[randomIndex].toFixed(6)}, ${longitudes[randomIndex].toFixed(6)}`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      onSave(formData);
    }
    if (mode === "add") {
      setFormData(emptyFormData);
    }
    onClose();
  };

  const handleChange = (field: keyof ParcelaFormData, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === "add" ? "Agregar Nueva Parcela" : "Editar Parcela"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add" 
              ? `Registra una nueva parcela en ${ciudad}` 
              : `Modifica la información de la parcela en ${ciudad}`
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Nombre de la Parcela */}
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre de la Parcela *</Label>
              <Input
                id="nombre"
                placeholder="Ej: Parcela Norte A1"
                value={formData.nombre}
                onChange={(e) => handleChange("nombre", e.target.value)}
                required
              />
            </div>

            {/* Ubicación con Google Maps simulado */}
            <div className="grid gap-2">
              <Label htmlFor="ubicacion">Ubicación (Coordenadas) *</Label>
              <div className="flex gap-2">
                <Input
                  id="ubicacion"
                  placeholder="Selecciona desde el mapa"
                  value={formData.ubicacion}
                  readOnly
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSelectLocation}
                  className="flex items-center gap-2"
                >
                  <FiMapPin className="h-4 w-4" />
                  Seleccionar
                </Button>
              </div>
              {formData.ubicacion && (
                <p className="text-sm text-gray-500">
                  Lat: {formData.latitud.toFixed(6)}, Lng: {formData.longitud.toFixed(6)}
                </p>
              )}
            </div>

            {/* Hectáreas */}
            <div className="grid gap-2">
              <Label htmlFor="hectareas">Hectáreas *</Label>
              <Input
                id="hectareas"
                type="number"
                step="0.1"
                min="0.1"
                placeholder="Ej: 5.2"
                value={formData.hectareas || ""}
                onChange={(e) => handleChange("hectareas", parseFloat(e.target.value) || 0)}
                required
              />
            </div>

            {/* Cultivo */}
            <div className="grid gap-2">
              <Label htmlFor="cultivo">Tipo de Cultivo *</Label>
              <Select
                value={formData.cultivo}
                onValueChange={(value) => handleChange("cultivo", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un cultivo" />
                </SelectTrigger>
                <SelectContent>
                  {cultivosDisponibles.map((cultivo) => (
                    <SelectItem key={cultivo} value={cultivo}>
                      {cultivo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Usuario Responsable */}
            <div className="grid gap-2">
              <Label htmlFor="responsable">Usuario Responsable *</Label>
              <Select
                value={formData.responsable}
                onValueChange={(value) => handleChange("responsable", value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un responsable" />
                </SelectTrigger>
                <SelectContent>
                  {usuariosResponsables.map((usuario) => (
                    <SelectItem key={usuario} value={usuario}>
                      {usuario}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Notas adicionales */}
            <div className="grid gap-2">
              <Label htmlFor="notas">Notas Adicionales (Opcional)</Label>
              <Textarea
                id="notas"
                placeholder="Información adicional sobre la parcela..."
                value={formData.notas}
                onChange={(e) => handleChange("notas", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {mode === "add" ? "Agregar Parcela" : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
