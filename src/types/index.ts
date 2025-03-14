// import { ReactNode } from "react";

// Définition des statuts possibles pour un processus
export type ProcessStatus = "pending" | "approved" | "rejected" | "in_progress";

// Interface pour un commentaire
export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: string; // Utilisez string si vous ne parsez pas en Date
}

// Interface pour une étape de processus
export interface ProcessStep {
  id: string;
  name: string;
  order: number;
  assignedTo: string;
  status: ProcessStatus;
  comments: Comment;
  requiredLevel: number;
  description: string; // Ajout de la propriété description
  // Ajoutez d'autres propriétés si nécessaire
}

export interface TypeProjet {
  idType: string;
  Libelle: string;
  Description: string;
  EtapeTypeProjet: {
    comments: Comment[];
    id: string;
    etapeId: string;
    idType: string;
    createdAt: string; // Date au format string
    updatedAt: string; // Date au format string
  };
}

// Interface pour un processus
export interface Process {
  idEtape: string; // Identifiant de l'étape
  LibelleEtape: string; // Titre de l'étape
  Description: string; // Description de l'étape
  Validation: string; // Validation par le chef de projet
  sequenceNumber: number; // Numéro de séquence
  createdAt: string; // Date de création
  updatedAt: string; // Date de mise à jour
  documents: Document[]; // Remplacez par le type approprié si nécessaire
  typeProjets: TypeProjet[]; // Liste des types de projets
  nextEtape: {
    idEtape: string; // Identifiant de la prochaine étape
    LibelleEtape: string; // Titre de la prochaine étape
  };
}
