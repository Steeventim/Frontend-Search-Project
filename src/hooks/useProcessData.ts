import { useState, useEffect } from "react";
import type { Process } from "../types";
import api from "../services/api";
import Cookies from "js-cookie";

export const useProcessData = (processId?: string, roleName?: string) => {
  const [process, setProcess] = useState<Process | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const roleName = Cookies.get("roleName"); // Récupérer le rôle depuis les cookies

        if (processId) {
          // Si un processId est fourni, on récupère les infos de l'étape actuelle
          const { data: currentData } = await api.get(`/etapes/${processId}`);
          setProcess(currentData.data);

          // Ensuite, on récupère les infos de l'étape suivante
          const { data: nextData } = await api.get(
            `/etapes/${processId}/next-users`
          );
          // Assurez-vous que les données sont correctement intégrées
          setProcess({
            ...currentData.data,
            nextEtape: nextData.data.nextEtape, // Ajout des données de l'étape suivante
          });
        } else if (roleName) {
          // Si un roleName est fourni, on récupère les processus associés à ce rôle
          const { data } = await api.get(`/etapes/role/${roleName}`);
          setProcess(data.data);
        } else {
          // Sinon, on récupère tous les processus
          const { data } = await api.get("/etapes/all");
          setProcess(data.data);
        }
      } catch (error) {
        // Utiliser 'error' pour définir le message d'erreur
        setError("Erreur lors du chargement des processus");
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [processId, roleName]);

  return { process, loading, error };
};
