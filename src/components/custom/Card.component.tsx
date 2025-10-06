import { IoMdAdd } from "react-icons/io";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";

interface CardProps {
  secondary?: boolean;
  children?: React.ReactNode;
  className?: string;
  title?: string;
  type?: "add" | "edit" | "view" | "delete" | "none";
  onButtonClick?: () => void;
}

export default function Card({
  type = "none",
  onButtonClick,
  ...props
}: CardProps) {
  const getButtonConfig = () => {
    switch (type) {
      case "add":
        return {
          icon: IoMdAdd,
          text: "Agregar",
          className: "bg-green-700 hover:bg-green-800",
        };
      case "edit":
        return {
          icon: FiEdit,
          text: "Editar",
          className: "bg-blue-600 hover:bg-blue-700",
        };
      case "view":
        return {
          icon: FiEye,
          text: "Ver",
          className: "bg-gray-600 hover:bg-gray-700",
        };
      case "delete":
        return {
          icon: FiTrash2,
          text: "Eliminar",
          className: "bg-red-600 hover:bg-red-700",
        };
      default:
        return null;
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <div
      className={`${
        props.secondary === true ? "border border-gray-300" : ""
      } bg-white rounded-lg shadow-lg ${props.className}`}
    >
      {props.title && (
        <>
          <div className="flex items-center justify-between px-4 py-3">
            <h3 className="text-lg font-semibold">{props.title}</h3>
            {buttonConfig && (
              <button
                onClick={onButtonClick}
                className={`${buttonConfig.className} ease-in-out duration-300 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors`}
              >
                <buttonConfig.icon className="text-xl" />
                <span>{buttonConfig.text}</span>
              </button>
            )}
          </div>
          <hr className="border-gray-300" />
        </>
      )}
      {props.children}
    </div>
  );
}
