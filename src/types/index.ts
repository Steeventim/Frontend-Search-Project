import { ReactNode } from "react";

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
  comments: Comment[];
  requiredLevel: number;
  description: string; // Ajout de la propriété description
  // Ajoutez d'autres propriétés si nécessaire
}

// Interface pour un processus
export interface Process {
  LibelleEtape: ReactNode; // Titre de l'étape, peut contenir du JSX
  Description: ReactNode; // Description, peut contenir du JSX
  Validation: ProcessStatus; // Utilisation de ProcessStatus pour la validation
  sequenceNumber: number; // Changement de type pour un numéro de séquence
  typeProjets: {
    idType: string;
    Libelle: string;
    Description: string;
    EtapeTypeProjet: {
      etapeId(etapeId: string, comment: string, attachments: File[]): void;
      status: ProcessStatus;
      comments: Comment[];
    };
  }[]; // Remplacement par le type approprié
  id: string;
  title: string;
  description: string;
  currentStep: number; // Indice de l'étape actuelle
  status: ProcessStatus; // Utilisation de ProcessStatus ici pour la cohérence
  createdAt: string; // Utilisez string si vous ne parsez pas en Date
  updatedAt: string; // Utilisez string si vous ne parsez pas en Date
  initiatedBy: string; // Utilisateur qui a initié le processus
  steps: ProcessStep[]; // Utilisation de ProcessStep pour les étapes
}
