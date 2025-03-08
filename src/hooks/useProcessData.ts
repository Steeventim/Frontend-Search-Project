import { useState, useEffect } from "react";
import type { Process } from "../types";
import api from "../services/api";

export const useProcessData = (processId?: string) => {
  const [process, setProcess] = useState<Process | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (processId) {
          // Si un processId est fourni, on récupère un processus spécifique
          const { data } = await api.get(`/etapes/${processId}`);
          setProcess(data.data);
        } else {
          // Sinon, on récupère tous les processus
          const { data } = await api.get("/etapes/all");
          setProcess(data.data);
        }
      } catch {
        setError("Erreur lors du chargement des processus");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [processId]);

  return { process, loading, error };
};
