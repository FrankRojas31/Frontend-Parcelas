import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface ModalProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  type?: "add" | "edit" | "view" | "delete" | "none";
  onButtonClick?: () => void;
  open?: boolean;
  onClose?: () => void;
}

export default function Modal({
  type = "none",
  onButtonClick,
  open = false,
  onClose,
  children,
  title = "Modal",
  description,
  className = "",
}: ModalProps) {
  const getButtonText = () => {
    switch (type) {
      case "add":
        return "Agregar";
      case "edit":
        return "Guardar Cambios";
      case "view":
        return "Cerrar";
      case "delete":
        return "Eliminar";
      default:
        return "Confirmar";
    }
  };

  const getButtonVariant = () => {
    switch (type) {
      case "delete":
        return "destructive" as const;
      case "view":
        return "outline" as const;
      case "add":
      case "edit":
        return "default" as const;
      default:
        return "default" as const;
    }
  };

  const shouldShowCancelButton = type !== "view";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <DialogContent className={`sm:max-w-[500px] ${className}`}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="px-6 py-4">{children}</div>

        <DialogFooter>
          <div className="flex gap-3 w-full">
            {shouldShowCancelButton && (
              <Button variant="outline" onClick={onClose} className="flex-1 bg-white/20 hover:bg-white/30 text-white">
                Cancelar
              </Button>
            )}
            <Button
              variant={getButtonVariant()}
              onClick={onButtonClick}
              className={`flex-1 ${
                type === "add" || type === "edit"
                  ? "bg-green-600/80 hover:bg-green-700/80 text-white border"
                  : ""
              }`}
            >
              {getButtonText()}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
