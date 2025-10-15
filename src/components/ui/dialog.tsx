import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
}

interface DialogTitleProps {
  children: React.ReactNode;
  onClose?: () => void;
}

interface DialogDescriptionProps {
  children: React.ReactNode;
}

interface DialogFooterProps {
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        onOpenChange(false);
      }
    };

    if (open) {
      setIsVisible(true);
      // Pequeño delay para que la animación se active después de que el elemento sea visible
      setTimeout(() => setIsAnimating(true), 10);
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      setIsAnimating(false);
      // Delay para permitir que la animación de salida se complete
      const timer = setTimeout(() => setIsVisible(false), 200);
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, onOpenChange]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-200 ease-out ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
      onClick={() => onOpenChange(false)}
    >
      {children}
    </div>
  );
}

export function DialogContent({
  children,
  className = "",
}: DialogContentProps) {
  return (
    <div
      className={`bg-white/20 rounded-lg shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out ${className}`}
      style={{
        animation: "modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ children, onClose }: DialogHeaderProps) {
  return (
    <div className="flex flex-col space-y-2 px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex-1 text-white">{children}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
            title="Cerrar modal"
          >
            <FiX className="text-xl" />
          </button>
        )}
      </div>
    </div>
  );
}

export function DialogTitle({ children }: DialogTitleProps) {
  return (
    <h3 className="text-lg font-semibold leading-none tracking-tight">
      {children}
    </h3>
  );
}

export function DialogDescription({ children }: DialogDescriptionProps) {
  return <p className="text-sm text-gray-600">{children}</p>;
}

export function DialogFooter({ children }: DialogFooterProps) {
  return <div className="flex justify-end gap-2 px-6 py-3">{children}</div>;
}
