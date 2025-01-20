import { useState, useEffect } from 'react';
import type { Process } from '../types';
import { mockProcesses } from '../data/mockData';

export const useProcessData = (processId?: string) => {
  const [process, setProcess] = useState<Process | Process[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Si un processId est fourni, on récupère un processus spécifique
        if (processId) {
          const foundProcess = mockProcesses.find(p => p.id === processId);
          if (foundProcess) {
            setProcess(foundProcess);
          } else {
            setError('Processus non trouvé');
          }
        } else {
          // Sinon, on récupère tous les processus
          setProcess(mockProcesses);
        }
      } catch (err) {
        setError('Erreur lors du chargement des processus');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [processId]);

  return { process, loading, error };
};