import { Process } from '../types';
import { mockProcesses } from '../../../data/mockData';

export const processService = {
  getProcesses: async (): Promise<Process[]> => {
    // Simuler un appel API
    return Promise.resolve(mockProcesses);
  },

  getProcessById: async (id: string): Promise<Process | null> => {
    const process = mockProcesses.find(p => p.id === id);
    return Promise.resolve(process || null);
  },

  approveStep: async (processId: string, stepId: string, comment: string): Promise<void> => {
    // TODO: Implement API call
    console.log('Approving step:', { processId, stepId, comment });
  },

  rejectStep: async (processId: string, stepId: string, comment: string): Promise<void> => {
    // TODO: Implement API call
    console.log('Rejecting step:', { processId, stepId, comment });
  }
};