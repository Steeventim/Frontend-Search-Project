import React, { useState, useEffect } from "react";
import { Search, FileText, Plus } from "lucide-react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { searchService } from "../../services/searchService";
import { SearchResponse, Hit } from "../../types/search";
import api from "../../services/api";
import { Dialog } from "../common/Dialog";

// Define the interface for the etape object
interface Etape {
  LibelleEtape: string;
}

const SearchInterface: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Hit | null>(null);
  const [etapes, setEtapes] = useState<string[]>([]);
  const [selectedEtape, setSelectedEtape] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    const fetchEtapes = async () => {
      try {
        const response = await api.get<{
          success: boolean;
          count: number;
          data: Etape[];
        }>("/etapes/all");
        console.log("Réponse du serveur:", response.data); // Pour déboguer
        if (response.data.success) {
          const libelleEtapes = response.data.data
            .map((etape: Etape) => etape.LibelleEtape)
            .filter(Boolean);
          setEtapes(libelleEtapes);
        } else {
          setError("Erreur lors de la récupération des étapes");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des étapes", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      }
    };
    fetchEtapes();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response: SearchResponse = await searchService.search(searchQuery);
      console.log("Réponse de l'API:", response); // Ajoutez cette ligne pour déboguer

      // Vérifiez si la réponse est conforme à ce que vous attendez
      if (
        response.success &&
        response.data.hits &&
        response.data.hits.total.value > 0
      ) {
        setResults(response.data.hits.hits); // Accédez à la bonne structure
      } else {
        setResults([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (documentName: string) => {
    const searchTerm = searchQuery;
    const previewUrl = `${api.defaults.baseURL}/search/${encodeURIComponent(
      documentName
    )}/${encodeURIComponent(searchTerm)}`;
    window.open(previewUrl, "_blank");
  };

  const openAssignDialog = (document: Hit) => {
    setSelectedDocument(document);
    setSelectedEtape("");
    setShowDialog(true);
  };

  const handleAssign = async () => {
    if (!selectedEtape) return;
    setAssignLoading(true);
    try {
      await api.post("/etapes/affect", {
        documentName: selectedDocument?._source.file.filename, // Mettez à jour pour accéder à la bonne propriété
        etapeName: selectedEtape,
      });
      setConfirmationMessage("Document affecté avec succès.");
      setShowDialog(false);
      // Réinitialiser le message de confirmation après 3 secondes
      setTimeout(() => {
        setConfirmationMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Erreur lors de l'affectation du document", err);
      setError("Erreur lors de l'affectation du document");
      // Réinitialiser le message d'erreur après 3 secondes
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
      <Card className="shadow-lg p-6 bg-white rounded-xl">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-4">
          Recherche de documents
        </h2>
        <div className="flex space-x-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Rechercher dans les documents..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg shadow-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-gray-400" />
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handleSearch}
            loading={loading}
            className="text-lg px-6 py-3"
          >
            Rechercher
          </Button>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        {confirmationMessage && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-4 text-sm text-green-600 text-center">
            {confirmationMessage}
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">
              Résultats ({results.length})
            </h3>
            <div className="grid gap-4">
              {results.map((hit) => (
                <div
                  key={hit._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-6 w-6 text-gray-500" />
                      <div>
                        <h4 className="text-lg font-medium text-blue-600 hover:underline">
                          <a
                            href="#"
                            onClick={() =>
                              handlePreview(hit._source.file.filename)
                            }
                          >
                            {hit._source.file.filename}
                          </a>
                        </h4>
                        <p className="text-sm text-gray-500">
                          {hit._source.file.filename} (
                          {hit._source.file.extension})
                        </p>
                        <div className="text-sm text-gray-700 mt-1">
                          {hit.highlight?.content &&
                          hit.highlight.content.length > 0 ? (
                            hit.highlight.content.map((highlight, index) => (
                              <p
                                key={index}
                                dangerouslySetInnerHTML={{ __html: highlight }}
                              />
                            ))
                          ) : (
                            <p>{hit._source.content}</p> // Affichez le contenu par défaut si aucun highlight
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Plus}
                      className="text-sm px-4 py-2"
                      onClick={() => openAssignDialog(hit)}
                    >
                      Affecter
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {showDialog && (
        <Dialog onClose={() => setShowDialog(false)}>
          <h3 className="text-lg font-semibold">Affecter un document</h3>
          <select
            value={selectedEtape}
            onChange={(e) => setSelectedEtape(e.target.value)}
            className="w-full border p-2 mt-2 rounded"
          >
            <option value="">Sélectionner une étape</option>
            {etapes.map((etape, index) => (
              <option key={index} value={etape}>
                {etape}
              </option>
            ))}
          </select>
          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="secondary" onClick={() => setShowDialog(false)}>
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleAssign}
              disabled={!selectedEtape || assignLoading}
              loading={assignLoading}
            >
              Affecter
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  );
};

export default SearchInterface;
