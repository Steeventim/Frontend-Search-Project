import React from "react";
import clsx from "clsx";

interface ButtonProps {
  variant: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean; // Propriété loading ajoutée
  children: React.ReactNode;
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
}) => {
  return (
    <button
      className={clsx(
        "btn",
        `btn-${variant}`,
        `btn-${size}`,
        className,
        { "btn-disabled": disabled || loading } // Désactiver le bouton si loading est true
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
