import { ProcessStep } from './step';

export type ProcessStatus = 'pending' | 'approved' | 'rejected' | 'in_progress';

export interface Process {
  id: string;
  title: string;
  description: string;
  currentStep: number;
  totalSteps?: number;
  status: ProcessStatus;
  createdAt: Date;
  updatedAt: Date;
  steps: ProcessStep[];
  initiatedBy: string;
}