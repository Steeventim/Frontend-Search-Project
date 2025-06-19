// Configuration du logo - Modifiez ce fichier pour personnaliser le logo de l'application
export interface LogoConfiguration {
  /** Texte principal du logo */
  defaultText: string;

  /** URL ou chemin vers l'image du logo */
  defaultImage: string;

  /** Texte alternatif pour l'accessibilité */
  altText: string;

  /** Lien de redirection par défaut */
  defaultLink: string;

  /** Configuration pour différents contextes */
  variants: {
    /** Logo pour les navbars */
    navbar: {
      text: string;
      size: "sm" | "md" | "lg" | "xl";
      color: "blue" | "gray" | "white" | "black";
      showImage: boolean;
      showText: boolean;
    };

    /** Logo pour les pages d'authentification */
    auth: {
      text: string;
      size: "sm" | "md" | "lg" | "xl";
      color: "blue" | "gray" | "white" | "black";
      showImage: boolean;
      showText: boolean;
    };

    /** Logo pour les pages d'erreur */
    error: {
      text: string;
      size: "sm" | "md" | "lg" | "xl";
      color: "blue" | "gray" | "white" | "black";
      showImage: boolean;
      showText: boolean;
    };
  };
}

/**
 * ⚙️ CONFIGURATION DU LOGO
 *
 * Modifiez les valeurs ci-dessous pour personnaliser l'apparence
 * du logo dans toute l'application.
 *
 * Pour changer l'image du logo :
 * 1. Placez votre nouvelle image dans le dossier public/
 * 2. Modifiez la propriété 'defaultImage' avec le nouveau chemin
 *
 * Pour changer le texte :
 * 1. Modifiez la propriété 'defaultText'
 * 2. Ajustez les variantes selon vos besoins
 */
export const logoConfig: LogoConfiguration = {
  // 🎯 Configuration principale
  defaultText: "SearchEngine",
  defaultImage: "/CCAA.jpeg", // Chemin vers l'image du logo
  altText: "Logo SearchEngine - Autorité aéronautique du Cameroun",
  defaultLink: "#",

  // 🎨 Variantes pour différents contextes
  variants: {
    // Logo dans les barres de navigation
    navbar: {
      text: "SearchEngine",
      size: "md",
      color: "blue",
      showImage: true,
      showText: true,
    },

    // Logo sur les pages de connexion/inscription
    auth: {
      text: "SearchEngine",
      size: "xl",
      color: "blue",
      showImage: true,
      showText: true,
    },

    // Logo sur les pages d'erreur
    error: {
      text: "SearchEngine",
      size: "lg",
      color: "gray",
      showImage: true,
      showText: true,
    },
  },
};

/**
 * 📝 GUIDE DE PERSONNALISATION
 *
 * 1. CHANGER L'IMAGE DU LOGO :
 *    - Placez votre image dans /public/ (ex: /public/mon-logo.png)
 *    - Modifiez defaultImage: '/mon-logo.png'
 *
 * 2. CHANGER LE TEXTE :
 *    - Modifiez defaultText: 'Mon Entreprise'
 *
 * 3. CHANGER LES COULEURS :
 *    - Options disponibles: 'blue', 'gray', 'white', 'black'
 *
 * 4. CHANGER LES TAILLES :
 *    - Options disponibles: 'sm', 'md', 'lg', 'xl'
 *
 * 5. MASQUER IMAGE OU TEXTE :
 *    - showImage: false (masque l'image)
 *    - showText: false (masque le texte)
 *
 * 6. CONFIGURATION AVANCÉE :
 *    - Modifiez les variantes pour chaque contexte
 *    - navbar: pour les barres de navigation
 *    - auth: pour les pages de connexion
 *    - error: pour les pages d'erreur
 */

// Export par défaut pour l'utilisation simple
export default logoConfig;
