import api from "./api"; // Assurez-vous que ce chemin est correct
import { SearchResponse, DocumentSource } from "../types/search"; // Importer les types nécessaires

export const searchService = {
  // Méthode pour effectuer une recherche avec un terme
  search: async (searchTerm: string): Promise<SearchResponse> => {
    try {
      const { data } = await api.get(
        `/search1Highligth/${encodeURIComponent(searchTerm)}`
      );
      console.log("Raw API response:", JSON.stringify(data, null, 2));

      if (data.success) {
        const hits = data.data.hits || [];
        console.log("Hits received:", JSON.stringify(hits, null, 2));

        return data; // Renvoyer les données brutes
      } else {
        console.log("API response unsuccessful:", data);
        return {
          success: false,
          searchTerm,
          data: {
            total: 0,
            hits: [],
          },
        };
      }
    } catch (error) {
      console.error("Search error:", error);
      throw new Error("Failed to perform search");
    }
  },

  // Méthode pour obtenir un aperçu d'un document
  getDocumentPreview: async (
    documentName: string,
    searchTerm: string
  ): Promise<DocumentSource> => {
    try {
      const { data } = await api.get(
        `/highlightera2/${encodeURIComponent(
          documentName
        )}/${encodeURIComponent(searchTerm)}`
      );
      return data; // Retourner les données de prévisualisation
    } catch (error) {
      console.error(
        "Erreur lors de l'obtention de l'aperçu du document :",
        error
      );
      throw new Error("Échec de l'obtention de l'aperçu. Veuillez réessayer."); // Gérer les erreurs
    }
  },
};
