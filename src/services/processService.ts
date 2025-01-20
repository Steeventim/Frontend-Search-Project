import api from './api';
import type { Process } from '../types/process';

export const processService = {
  getProcesses: async (): Promise<Process[]> => {
    const { data } = await api.get('/processes');
    return data;
  },

  getProcessById: async (id: string): Promise<Process> => {
    const { data } = await api.get(`/processes/${id}`);
    return data;
  },

  createProcess: async (processData: Partial<Process>): Promise<Process> => {
    const { data } = await api.post('/processes', processData);
    return data;
  },

  updateProcess: async (id: string, processData: Partial<Process>): Promise<Process> => {
    const { data } = await api.put(`/processes/${id}`, processData);
    return data;
  },

  deleteProcess: async (id: string): Promise<void> => {
    await api.delete(`/processes/${id}`);
  },

  approveStep: async (processId: string, stepId: string, comment: string, attachments: File[]): Promise<void> => {
    const formData = new FormData();
    formData.append('comment', comment);
    attachments.forEach(file => {
      formData.append('attachments', file);
    });

    await api.post(`/processes/${processId}/steps/${stepId}/approve`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  rejectStep: async (processId: string, stepId: string, comment: string, attachments: File[]): Promise<void> => {
    const formData = new FormData();
    formData.append('comment', comment);
    attachments.forEach(file => {
      formData.append('attachments', file);
    });

    await api.post(`/processes/${processId}/steps/${stepId}/reject`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};