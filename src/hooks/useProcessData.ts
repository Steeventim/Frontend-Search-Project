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

  // Fonction pour récupérer le dernier document
  const fetchLatestDocument = useCallback(async () => {
    setLoading(true);
    setError(null); // Réinitialiser l'erreur avant de commencer

    try {
      const { data } = await api.get("/latest-document");
      setProcess(data.data); // Assurez-vous que la structure des données est correcte
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
      if (processId) {
        // Si un processId est fourni, on récupère les infos de l'étape actuelle
        const { data: currentData } = await api.get(`/etapes/${processId}`);
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
  }, [processId]); // Ajoutez processId comme dépendance

  // // Fonction pour récupérer les documents reçus
  // const fetchReceivedDocuments = useCallback(async () => {
  //   setLoading(true);
  //   setError(null); // Réinitialiser l'erreur avant de commencer

  //   try {
  //     const user = await userService.getUserById("me"); // Récupérer les informations de l'utilisateur
  //     const { data } = await api.get(`/received-documents/${user.id}`); // Utiliser l'ID utilisateur
  //     setProcess(data.data); // Assurez-vous que la structure des données est correcte
  //   } catch (error) {
  //     // Vérifier si l'erreur est une AxiosError
  //     if (error instanceof AxiosError) {
  //       const errorMessage =
  //         error.response?.data?.message ||
  //         "Erreur lors du chargement des documents reçus";
  //       setError(errorMessage);
  //     } else {
  //       setError("Erreur inconnue lors du chargement des documents reçus");
  //     }
  //     console.error(
  //       "Erreur lors de la récupération des documents reçus:",
  //       error
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  useEffect(() => {
    if (processId) {
      fetchProcessData(); // Appeler la fonction pour récupérer les données du processus
    } else {
      fetchLatestDocument(); // Appeler la fonction pour récupérer le dernier document
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
