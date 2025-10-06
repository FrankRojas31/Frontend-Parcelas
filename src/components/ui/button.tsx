interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "destructive";
  children: React.ReactNode;
}

export function Button({ 
  variant = "default", 
  children, 
  className = "", 
  ...props 
}: ButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "outline":
        return "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50";
      case "destructive":
        return "bg-red-600 text-white hover:bg-red-700";
      default:
        return "bg-blue-600 text-white hover:bg-blue-700";
    }
  };

  return (
    <button
      className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${getVariantClasses()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}