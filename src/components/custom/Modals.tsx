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
      default:
        return "default" as const;
    }
  };

  const shouldShowCancelButton = type !== "view";

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <DialogContent className={className}>
        <DialogHeader onClose={onClose}>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>
        
        <div className="px-6 py-3">
          {children}
        </div>
        
        <DialogFooter>
          {shouldShowCancelButton && (
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          )}
          <Button 
            variant={getButtonVariant()} 
            onClick={onButtonClick}
          >
            {getButtonText()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}