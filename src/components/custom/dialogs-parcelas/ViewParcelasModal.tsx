import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Button } from "../../ui/button";
import { FiEdit, FiTrash2 } from "react-icons/fi";

interface Parcela {
  id: number;
  nombre: string;
  hectareas: number;
  cultivo: string;
  responsable?: string;
}

interface ViewParcelasModalProps {
  isOpen: boolean;
  onClose: () => void;
  ciudad: string | null;
  parcelas: Parcela[];
  onEdit?: (parcela: Parcela) => void;
  onDelete?: (parcela: Parcela) => void;
}

export default function ViewParcelasModal({
  isOpen,
  onClose,
  ciudad,
  parcelas,
  onEdit,
  onDelete,
}: ViewParcelasModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Parcelas de {ciudad}</DialogTitle>
          <DialogDescription>
            Listado completo de parcelas registradas en {ciudad}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {parcelas?.map((parcela) => (
            <Card key={parcela.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{parcela.nombre}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit?.(parcela)}
                      className="h-8"
                    >
                      <FiEdit className="mr-1 h-3.5 w-3.5" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete?.(parcela)}
                      className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <FiTrash2 className="mr-1 h-3.5 w-3.5" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Hectáreas</p>
                    <p className="text-lg font-semibold">{parcela.hectareas} ha</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Cultivo</p>
                    <p className="text-lg font-semibold">{parcela.cultivo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Responsable</p>
                    <p className="text-lg font-semibold">{parcela.responsable || "No asignado"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
