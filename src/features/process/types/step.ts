import { Comment } from './comment';
import { ProcessStatus } from './process';

export interface ProcessStep {
  id: string;
  name: string;
  order: number;
  assignedTo: string;
  status: ProcessStatus;
  comments: Comment[];
  requiredLevel: number;
  // Optional fields used by dashboard views and services
  processName?: string;
  stepName?: string;
  priority?: "low" | "normal" | "high" | "urgent";
  currentStep?: number;
  totalSteps?: number;
}