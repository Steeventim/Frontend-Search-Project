// Composant Logo réutilisable et facilement modifiable
import React from "react";
import { Link } from "react-router-dom";
import { LOGO_CONFIG } from "./LogoConstants";
import type { LogoConfiguration } from "../../config/logoConfig";

interface LogoProps {
  /** Variante prédéfinie du logo (navbar, auth, error) */
  variant?: keyof LogoConfiguration["variants"];
  /** Taille du logo - affecte la taille du texte et de l'image */
  size?: "sm" | "md" | "lg" | "xl";
  /** Couleur du texte du logo */
  color?: "blue" | "gray" | "white" | "black";
  /** URL de redirection lors du clic */
  to?: string;
  /** Afficher uniquement l'image sans texte */
  imageOnly?: boolean;
  /** Afficher uniquement le texte sans image */
  textOnly?: boolean;
  /** Texte personnalisé pour le logo */
  customText?: string;
  /** URL de l'image du logo personnalisée */
  customImage?: string;
  /** Classes CSS additionnelles */
  className?: string;
  /** Désactiver le lien */
  noLink?: boolean;
}

const Logo: React.FC<LogoProps> = ({
  size = "md",
  color = "blue",
  to = LOGO_CONFIG.defaultLink,
  imageOnly = false,
  textOnly = false,
  customText,
  customImage,
  className = "",
}) => {
  // Configuration des tailles
  const sizeClasses = {
    sm: {
      text: "text-lg",
      image: "h-6 w-6",
      container: "gap-2",
    },
    md: {
      text: "text-xl",
      image: "h-8 w-8",
      container: "gap-2",
    },
    lg: {
      text: "text-2xl",
      image: "h-10 w-10",
      container: "gap-3",
    },
    xl: {
      text: "text-3xl",
      image: "h-12 w-12",
      container: "gap-3",
    },
  };

  // Configuration des couleurs
  const colorClasses = {
    blue: "text-blue-600 hover:text-blue-700",
    gray: "text-gray-800 hover:text-gray-900",
    white: "text-white hover:text-gray-100",
    black: "text-black hover:text-gray-800",
  };

  const currentSize = sizeClasses[size];
  const currentColor = colorClasses[color];

  // Texte à afficher
  const displayText = customText || LOGO_CONFIG.defaultText;

  // Image à afficher
  const displayImage = customImage || LOGO_CONFIG.defaultImage;

  // Contenu du logo
  const logoContent = (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      {/* Image du logo */}
      {!textOnly && (
        <div className="flex-shrink-0">
          <img
            src={displayImage}
            alt={LOGO_CONFIG.altText}
            className={`${currentSize.image} object-contain`}
            onError={(e) => {
              // Fallback en cas d'erreur de chargement de l'image
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
        </div>
      )}

      {/* Texte du logo */}
      {!imageOnly && (
        <span
          className={`font-bold ${currentSize.text} ${currentColor} transition-colors duration-200`}
        >
          {displayText}
        </span>
      )}
    </div>
  );

  // Si pas de lien, retourner juste le contenu
  if (!to) {
    return logoContent;
  }

  // Avec lien
  return (
    <Link to={to} className="inline-flex items-center">
      {logoContent}
    </Link>
  );
};

export default Logo;
