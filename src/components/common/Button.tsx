import React from "react";
import clsx from "clsx";

interface ButtonProps {
  variant: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean; // Propriété loading ajoutée
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size = "md",
  icon: Icon,
  className,
  onClick,
  disabled,
  loading, // Utilisation de la propriété loading
  children,
  type,
}) => {
  const baseClasses = "inline-flex items-center px-4 py-2 border rounded-md font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  const variantClasses = {
    primary: "bg-green-600 hover:bg-green-700 text-white border-transparent focus:ring-green-500",
    secondary: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500"
  };

  return (
    <button
      type={type || "button"}
      className={clsx(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        "transition duration-150 ease-in-out",
        { "opacity-50 cursor-not-allowed": disabled || loading },
        className
      )}
      onClick={onClick}
      disabled={disabled || loading} // Empêcher les clics si loading est true
    >
      {loading ? (
        <span className="loader" /> // Afficher un indicateur de chargement
      ) : (
        <>
          {Icon && <Icon className="btn-icon" />}
          {children}
        </>
      )}
    </button>
  );
};
