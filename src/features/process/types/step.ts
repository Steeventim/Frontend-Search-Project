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
}