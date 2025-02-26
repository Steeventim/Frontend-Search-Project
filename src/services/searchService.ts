import api from "./api"; // Assurez-vous que ce chemin est correct
import { SearchResponse, DocumentSource } from "../types/search"; // Importer les types nécessaires

export const searchService = {
  // Méthode pour effectuer une recherche avec un terme
  search: async (searchTerm: string): Promise<SearchResponse> => {
    const { data } = await api.get(
      `/search-propositions/${encodeURIComponent(searchTerm)}`
    );
    return data;
  },

  // Méthode pour obtenir un aperçu d'un document
  getDocumentPreview: async (
    documentName: string,
    searchTerm: string
  ): Promise<DocumentSource> => {
    try {
      const { data } = await api.get(
        `/search/${encodeURIComponent(documentName)}/${encodeURIComponent(
          searchTerm
        )}`
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
