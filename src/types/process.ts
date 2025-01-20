import { ProcessStep } from './step';

export type ProcessStatus = 'pending' | 'approved' | 'rejected' | 'in_progress';

export interface Attachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  uploadedAt: Date;
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