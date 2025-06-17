// Composant Header simple avec logo pour les pages sans navbar complète
import React from "react";
import Logo from "../common/Logo";

interface LogoHeaderProps {
  /** Taille du logo */
  size?: "sm" | "md" | "lg" | "xl";
  /** Couleur du logo */
  color?: "blue" | "gray" | "white" | "black";
  /** URL de redirection du logo */
  to?: string;
  /** Texte personnalisé */
  customText?: string;
  /** Classes CSS additionnelles */
  className?: string;
  /** Afficher un arrière-plan */
  showBackground?: boolean;
  /** Centrer le logo */
  centered?: boolean;
}

export const LogoHeader: React.FC<LogoHeaderProps> = ({
  size = "lg",
  color = "blue",
  to = "/dashboard",
  customText,
  className = "",
  showBackground = true,
  centered = false,
}) => {
  const containerClasses = `
    ${showBackground ? "bg-white shadow-sm" : ""}
    ${centered ? "text-center" : ""}
    ${className}
  `.trim();

  const logoClasses = centered
    ? "inline-flex justify-center"
    : "flex justify-start";

  return (
    <header className={containerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className={logoClasses}>
          <Logo size={size} color={color} to={to} customText={customText} />
        </div>
      </div>
    </header>
  );
};

export default LogoHeader;
