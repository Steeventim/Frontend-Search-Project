import api from "./api"; // Assurez-vous que ce chemin est correct
import { SearchResponse, DocumentSource } from "../types/search"; // Importer les types nécessaires

export const searchService = {
  // Méthode pour effectuer une recherche avec un terme
  search: async (searchTerm: string): Promise<SearchResponse> => {
    try {
      // Use the enhanced-search endpoint which accepts a query param `q`
      const { data } = await api.get(
        `/enhanced-search?q=${encodeURIComponent(searchTerm)}`
      );
      console.log("Raw API response:", JSON.stringify(data, null, 2));

      if (data.success) {
        // Support both backend shapes:
        // 1) New enhanced endpoint: { success, query, total, hits: [...] }
        // 2) Legacy Elasticsearch shape: { data: { hits: { total: { value }, hits: [ ... ] } } }
        const rawHits = Array.isArray(data.hits)
          ? data.hits
          : Array.isArray(data.data?.hits?.hits)
          ? data.data.hits.hits
          : [];

        console.log("Normalized raw hits:", JSON.stringify(rawHits, null, 2));

        type RawHit = {
          id?: string;
          score?: number;
          filename?: string;
          path?: unknown;
          highlights?: unknown;
          source?: unknown;
          highlight?: unknown;
          _id?: string;
          _score?: number;
          _source?: Record<string, unknown>;
        };

        const transformedHits = rawHits.map((hit: unknown) => {
          const raw = hit as RawHit;
          // Backend enhanced-search returns { id, score, filename, path, highlights, source }
          if (raw.id || raw.source) {
            const src = (raw.source as Record<string, unknown>) || (raw._source as Record<string, unknown>) || {};
            const content = typeof src['content'] === 'string' ? (src['content'] as string) : '';
            return {
              id: raw.id || raw._id || "",
              score: raw.score || raw._score || 0,
              source: { content, ...(src || {}) },
              highlight: raw.highlights || raw.highlight || undefined,
            };
          }

          // Fallback for raw Elasticsearch hit shape
          const src = raw._source as Record<string, unknown> | undefined;
          const content = typeof src?.['content'] === 'string' ? (src!['content'] as string) : '';
          const file = (src && typeof src['file'] === 'object' ? (src['file'] as Record<string, unknown>) : {}) || {};
          const meta = (src && typeof src['meta'] === 'object' ? (src['meta'] as Record<string, unknown>) : {}) || {};
          return {
            id: raw._id || "",
            score: raw._score || 0,
            source: {
              content,
              file,
              meta,
            },
            highlight: raw.highlight || undefined,
          };
        });

        console.log("Transformed hits:", JSON.stringify(transformedHits, null, 2));

        const totalCount =
          typeof data.total === "number"
            ? data.total
            : data.data?.hits?.total?.value || transformedHits.length;

        return {
          success: true,
          searchTerm,
          query: data.query || data.data?.query || searchTerm,
          data: {
            total: totalCount,
            hits: transformedHits,
          },
        };
      }

      console.log("API response unsuccessful:", data);
      return {
        success: false,
        searchTerm,
        data: {
          total: 0,
          hits: [],
        },
      };
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
