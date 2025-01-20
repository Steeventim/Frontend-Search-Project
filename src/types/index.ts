export type ProcessStatus = 'pending' | 'approved' | 'rejected' | 'in_progress';

export interface Comment {
  id: string;
  text: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

export interface ProcessStep {
  id: string;
  name: string;
  order: number;
  assignedTo: string;
  status: ProcessStatus;
  comments: Comment[];
  requiredLevel: number;
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