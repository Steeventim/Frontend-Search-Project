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
        // Extraire les hits de la structure Elasticsearch
        const elasticsearchHits = data.data?.hits?.hits || [];
        console.log(
          "Elasticsearch hits:",
          JSON.stringify(elasticsearchHits, null, 2)
        );

        // Transformer la structure Elasticsearch vers notre format
        const transformedHits = elasticsearchHits.map(
          (hit: {
            _id: string;
            _score: number;
            _source?: {
              content?: string;
              file?: {
                filename?: string;
                extension?: string;
                content_type?: string;
                created?: string;
                last_modified?: string;
                filesize?: number;
                url?: string;
                path?: object;
              };
              meta?: object;
            };
            highlight?: {
              content?: string[];
            };
          }) => ({
            id: hit._id,
            score: hit._score,
            source: {
              content: hit._source?.content || "",
              file: {
                filename: hit._source?.file?.filename || "Nom inconnu",
                extension: hit._source?.file?.extension || "Inconnu",
                content_type: hit._source?.file?.content_type || "",
                created: hit._source?.file?.created || "",
                last_modified: hit._source?.file?.last_modified || "",
                filesize: hit._source?.file?.filesize || 0,
                url: hit._source?.file?.url || "",
                path: hit._source?.file?.path || {},
              },
              meta: hit._source?.meta || {},
            },
            highlight: hit.highlight || undefined,
          })
        );

        console.log(
          "Transformed hits:",
          JSON.stringify(transformedHits, null, 2)
        );

        return {
          success: true,
          searchTerm,
          query: data.query,
          data: {
            total: data.data?.hits?.total?.value || transformedHits.length,
            hits: transformedHits,
          },
        };
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
