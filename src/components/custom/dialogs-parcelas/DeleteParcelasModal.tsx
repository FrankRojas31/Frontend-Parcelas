import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";

interface DeleteParcelasModalProps {
  isOpen: boolean;
  onClose: () => void;
  ciudad: string | null;
  parcelasCount: number;
  parcelaName?: string;
  onDelete?: () => void;
}

export default function DeleteParcelasModal({
  isOpen,
  onClose,
  ciudad,
  parcelasCount,
  parcelaName,
  onDelete,
}: DeleteParcelasModalProps) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    onClose();
  };

  const isSingleParcela = parcelasCount === 1 && parcelaName;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogDescription>
            {isSingleParcela 
              ? `¿Estás seguro de que deseas eliminar la parcela "${parcelaName}"?`
              : `¿Estás seguro de que deseas eliminar todas las parcelas de ${ciudad}?`
            }
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600">
            Esta acción no se puede deshacer. Se {isSingleParcela ? "eliminará" : "eliminarán"}{" "}
            <span className="font-bold">
              {isSingleParcela ? "esta parcela" : `${parcelasCount} parcelas`}
            </span>{" "}
            permanentemente.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
