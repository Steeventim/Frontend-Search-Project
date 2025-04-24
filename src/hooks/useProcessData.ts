import { useState, useEffect, useCallback, useMemo } from "react";
import type { Process, NextEtape } from "../types/process";
import api from "../services/api";
import Cookies from "js-cookie";
import { AxiosError } from "axios";

// Interface pour typage strict
// interface Etape {
//   idEtape: string;
//   LibelleEtape: string;
//   typeProjets?: { Libelle: string }[];
// }

interface ProcessData {
  process: Process | null;
  loading: boolean;
  error: string | null;
  latestEtapeId: string | null;
}

export const useProcessData = (processId?: string): ProcessData => {
  const [process, setProcess] = useState<Process | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [latestEtapeId, setLatestEtapeId] = useState<string | null>(null);

  // Fonction pour récupérer le dernier document
  const fetchLatestDocument = useCallback(async () => {
    console.log("useProcessData: fetchLatestDocument called");
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.get<{ success: boolean; data: Process }>(
        "/latest-document"
      );
      if (data.success && data.data) {
        console.log("useProcessData: latest document fetched:", data.data);
        setProcess(data.data);
        setLatestEtapeId(data.data.etape?.idEtape || null);
      } else {
        setError("Aucun document récent trouvé");
        console.log("useProcessData: no recent document found");
      }
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message ||
            "Erreur lors du chargement du dernier document"
          : "Erreur inconnue lors du chargement du dernier document";
      setError(errorMessage);
      console.error("useProcessData: fetchLatestDocument error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fonction pour récupérer les données du processus
  const fetchProcessData = useCallback(async () => {
    console.log(
      "useProcessData: fetchProcessData called for id:",
      processId || latestEtapeId
    );
    setLoading(true);
    setError(null);

    const roleName = Cookies.get("roleName");
    console.log("useProcessData: roleName from cookies:", roleName);

    try {
      let processData: Process | null = null;

      if (processId || latestEtapeId) {
        const etapeIdToUse = processId || latestEtapeId;
        console.log("useProcessData: fetching for etapeId:", etapeIdToUse);

        const [currentResponse, nextResponse] = await Promise.all([
          api.get<{ data: Process }>(`/etapes/${etapeIdToUse}`),
          api.get<{ data: { nextEtape: NextEtape } }>(
            `/etapes/${etapeIdToUse}/next-users`
          ),
        ]);

        processData = {
          ...currentResponse.data.data,
          nextEtape: nextResponse.data.data.nextEtape,
        };
        console.log("useProcessData: process data fetched:", processData);
      } else if (roleName) {
        console.log("useProcessData: fetching for role:", roleName);
        const { data } = await api.get<{ data: Process }>(
          `/etapes/role/${roleName}`
        );
        processData = data.data;
        console.log(
          "useProcessData: role-based process data fetched:",
          processData
        );
      } else {
        console.log("useProcessData: fetching all processes");
        const { data } = await api.get<{ data: Process }>("/etapes/all");
        processData = data.data;
        console.log("useProcessData: all processes fetched:", processData);
      }

      setProcess((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(processData)) {
          console.log("useProcessData: process unchanged, skipping setProcess");
          return prev;
        }
        console.log("useProcessData: updating process");
        return processData;
      });
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message ||
            "Erreur lors du chargement des processus"
          : "Erreur inconnue lors du chargement des processus";
      setError(errorMessage);
      console.error("useProcessData: fetchProcessData error:", error);
    } finally {
      setLoading(false);
    }
  }, [processId, latestEtapeId]);

  // useEffect consolidé
  useEffect(() => {
    console.log(
      "useProcessData: useEffect triggered with processId:",
      processId
    );
    if (processId) {
      fetchProcessData();
    } else {
      fetchLatestDocument().then(() => {
        if (latestEtapeId) {
          fetchProcessData();
        }
      });
    }
  }, [processId, fetchProcessData, fetchLatestDocument, latestEtapeId]);

  // Mémorisation du résultat pour éviter des re-rendus inutiles
  const result = useMemo(
    () => ({
      process,
      loading,
      error,
      latestEtapeId,
    }),
    [process, loading, error, latestEtapeId]
  );

  console.log("useProcessData: returning result:", result);
  return result;
};
