import { useState, useEffect, useCallback } from "react";
import type { Process } from "../types";
import api from "../services/api";
import Cookies from "js-cookie";
import { AxiosError } from "axios"; // Importer AxiosError
// import { userService } from "../services/userService"; // Importer userService

export const useProcessData = (processId?: string) => {
  const [process, setProcess] = useState<Process | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestEtapeId, setLatestEtapeId] = useState<string | null>(null);

  // Fonction pour récupérer le dernier document
  const fetchLatestDocument = useCallback(async () => {
    setLoading(true);
    setError(null); // Réinitialiser l'erreur avant de commencer

    try {
      const { data } = await api.get("/latest-document");
      setProcess(data.data); // Assurez-vous que la structure des données est correcte
      setLatestEtapeId(data.data.etape?.idEtape || null); // Stocker l'idEtape
    } catch (error) {
      // Vérifier si l'erreur est une AxiosError
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          "Erreur lors du chargement du dernier document";
        setError(errorMessage);
      } else {
        setError("Erreur inconnue lors du chargement du dernier document");
      }
      console.error(
        "Erreur lors de la récupération du dernier document:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []); // Pas de dépendances, car cette fonction ne dépend d'aucune variable externe

  // Fonction pour récupérer les données du processus
  const fetchProcessData = useCallback(async () => {
    setLoading(true);
    setError(null); // Réinitialiser l'erreur avant de commencer

    const roleName = Cookies.get("roleName"); // Récupérer le rôle depuis les cookies

    try {
      if (processId || latestEtapeId) {
        // Utiliser processId ou latestEtapeId pour récupérer les données
        const etapeIdToUse = processId || latestEtapeId;

        // Si un processId est fourni, on récupère les infos de l'étape actuelle
        const { data: currentData } = await api.get(`/etapes/${etapeIdToUse}`);
        const { data: nextData } = await api.get(
          `/etapes/${etapeIdToUse}/next-users`
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
      // Vérifier si l'erreur est une AxiosError
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.message ||
          "Erreur lors du chargement des processus";
        setError(errorMessage);
      } else {
        setError("Erreur inconnue lors du chargement des processus");
      }
      console.error("Erreur lors de la récupération des données:", error);
    } finally {
      setLoading(false);
    }
  }, [processId, latestEtapeId]); // Ajoutez processId comme dépendance

  useEffect(() => {
    if (processId) {
      fetchProcessData(); // Appeler la fonction pour récupérer les données du processus
    } else {
      fetchLatestDocument().then(() => {
        fetchProcessData();
      });
      // fetchReceivedDocuments(); // Appeler la fonction pour récupérer les documents reçus
    }
  }, [
    processId,
    fetchProcessData,
    // fetchReceivedDocuments,
    fetchLatestDocument,
  ]); // Inclure fetchProcessData et fetchReceivedDocuments

  return { process, loading, error };
};
