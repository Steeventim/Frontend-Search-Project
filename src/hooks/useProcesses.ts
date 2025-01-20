import { useState, useCallback } from 'react';
import type { Process } from '../types/process';
import { processService } from '../services/processService';

export const useProcesses = () => {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProcesses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await processService.getProcesses();
      setProcesses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  }, []);

  const approveStep = useCallback(async (processId: string, stepId: string, comment: string, attachments: File[]) => {
    setLoading(true);
    setError(null);
    try {
      await processService.approveStep(processId, stepId, comment, attachments);
      await fetchProcesses(); // Refresh the list after approval
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProcesses]);

  const rejectStep = useCallback(async (processId: string, stepId: string, comment: string, attachments: File[]) => {
    setLoading(true);
    setError(null);
    try {
      await processService.rejectStep(processId, stepId, comment, attachments);
      await fetchProcesses(); // Refresh the list after rejection
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProcesses]);

  return {
    processes,
    loading,
    error,
    fetchProcesses,
    approveStep,
    rejectStep
  };
};