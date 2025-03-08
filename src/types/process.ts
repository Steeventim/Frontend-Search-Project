export type ProcessStatus = "pending" | "approved" | "rejected" | "in_progress";

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: string; // Utilisez string si vous ne parsez pas en Date
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface Step {
  id: string;
  name: string;
  order: number;
  assignedTo: string;
  status: ProcessStatus;
  comments: Comment[];
  requiredLevel: number;
  description: string;
  documentId: string;
  userId: string;
  UserDestinatorName: string;
  nextEtapeName: string;
}

export interface Process {
  idEtape: string;
  LibelleEtape: string;
  Description: string;
  Validation: string;
  sequenceNumber: number;
  createdAt: string; // ou Date
  updatedAt: string; // ou Date
  documents: Attachment[]; // ou un type spécifique pour les documents
  typeProjets: {
    idType: string;
    Libelle: string;
    Description: string;
    EtapeTypeProjet: {
      id: string;
      etapeId: string;
      idType: string;
      createdAt: string; // ou Date
      updatedAt: string; // ou Date
      comments: Comment[]; // Assurez-vous que les commentaires sont ici
    };
  }[];
}

export interface ProcessStep {
  id: string;
  documentId: string;
  userId: string;
  UserDestinatorName: string;
  nextEtapeName: string;
  name: string;
  order: number;
  assignedTo: string;
  status: string;
}

export interface Etape {
  idEtape: string;
  LibelleEtape: string;
  Description: string;
  Validation: string;
  sequenceNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface EtapeTypeProjet {
  id: string;
  etapeId: string; // Assurez-vous que cette propriété existe
  idType: string;
  createdAt: string; // ou Date
  updatedAt: string; // ou Date
  comments: Comment[]; // Assurez-vous que les commentaires sont ici
}
