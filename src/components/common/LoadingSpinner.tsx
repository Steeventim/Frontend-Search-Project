import React from "react";
import "./LoadingSpinner.css"; // Assurez-vous de créer ce fichier pour les styles

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
