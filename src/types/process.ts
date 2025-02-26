export type ProcessStatus = "pending" | "approved" | "rejected" | "in_progress";

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface Comment {
  id: string;
  userName: string;
  text: string;
  timestamp: Date;
  attachments?: Attachment[];
}

export interface ProcessStep {
  id: string;
  name: string;
  assignedTo: string;
  status: ProcessStatus;
  comments: Comment[];
}

export interface Process {
  id: string;
  title: string;
  description: string;
  currentStep: number;
  status: ProcessStatus;
  createdAt: Date;
  updatedAt: Date;
  steps: ProcessStep[];
  initiatedBy: string;
}
