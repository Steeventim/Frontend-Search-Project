// types/process.ts

export type ProcessStatus = "pending" | "approved" | "rejected" | "in_progress";

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: string; // ISO string (ex: "2025-04-17T12:00:00Z")
}

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string; // ISO string pour cohérence
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

export interface Etape {
  idEtape: string;
  LibelleEtape: string;
  Description: string;
  Validation: string;
  sequenceNumber: number;
  createdAt: string;
  updatedAt: string;
  typeProjets?: { Libelle: string }[];
  hasTransfer?: boolean; // Optionnel, ajouté pour compatibilité
}

export interface NextEtape {
  id: string;
  name: string;
  users?: { name: string }[];
}

export interface EtapeTypeProjet {
  id: string;
  etapeId: string;
  idType: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

export interface Process {
  id: string;
  name: string;
  title: string;
  description: string;
  createdAt: Date;
  status: ProcessStatus;
  typeProjets: {
    idType: string;
    Libelle: string;
    Description: string;
    createdAt: Date; // Changé de string à Date
    updatedAt: Date; // Changé de string à Date
    EtapeTypeProjet: { etapeId: string };
  }[];
  nextEtape?: NextEtape;
  Validation?: string;
  sequenceNumber?: number;
  LibelleEtape?: string;
  Description?: string;
  etape?: Etape; // Pour latestDocument
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

export interface LatestDocument {
  idDocument: string;
  etape?: Etape;
}

export interface ProcessData {
  process: Process | null;
  loading: boolean;
  error: string | null;
  latestEtapeId: string | null;
}
