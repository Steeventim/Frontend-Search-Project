import React, { useState, useEffect } from "react";
import { AxiosError } from "axios";
import { Search, FileText, Plus, Paperclip, XCircle } from "lucide-react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { searchService } from "../../services/searchService";
import { SearchResponse, Hit, LatestDocument } from "../../types/search";
import api from "../../services/api";
import { Dialog } from "../common/Dialog";
import { SearchNavbar } from "../layout/SearchNavbar";
import { userService } from "../../services/userService";
import { useProcessData } from "../../hooks/useProcessData";

// Interface pour l'étape
interface Etape {
  idEtape: string;
  LibelleEtape: string;
  typeProjets: { Libelle: string }[];
}

const SearchInterface: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Hit | null>(null);
  const [latestDocument, setLatestDocument] = useState<LatestDocument | null>(
    null
  );
  const [comment, setComment] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );
  const [assignLoading, setAssignLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const { process } = useProcessData();
  const [userDestinatorName, setUserDestinatorName] = useState<string | null>(
    null
  );
  const [nextEtape, setNextEtape] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await userService.getUserById("me");
        setUserId(user.id);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'utilisateur connecté :",
          error
        );
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (process?.nextEtape) {
      setNextEtape({
        id: process.nextEtape.id,
        name: process.nextEtape.name,
      });
    }
  }, [process]);

  useEffect(() => {
    if (process?.nextEtape?.users && process.nextEtape.users.length > 0) {
      const nextUser = process.nextEtape.users[0];
      setUserDestinatorName(nextUser.name);
    }
  }, [process]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [etapesResponse, latestDocumentResponse] = await Promise.all([
          api.get<{ success: boolean; count: number; data: Etape[] }>(
            "/etapes/all"
          ),
          api.get<{ success: boolean; data: LatestDocument }>(
            "/latest-document"
          ),
        ]);

        if (etapesResponse.data.success) {
          // setEtapes(etapesResponse.data.data);
        } else {
          setError("Erreur lors de la récupération des étapes");
        }

        if (latestDocumentResponse.data.success) {
          setLatestDocument(latestDocumentResponse.data.data);
        } else {
          setError("Erreur lors de la récupération du dernier document");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des données", err);
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      }
    };

    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response: SearchResponse = await searchService.search(searchQuery);
      if (
        response.success &&
        response.data.hits &&
        response.data.hits.total.value > 0
      ) {
        setResults(response.data.hits.hits);
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
    const previewUrl = `${
      api.defaults.baseURL
    }/highlightera2/${encodeURIComponent(documentName)}/${encodeURIComponent(
      searchTerm
    )}`;
    window.open(previewUrl, "_blank");
  };

  const openAssignDialog = (document: Hit) => {
    setSelectedDocument(document);
    setShowDialog(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Fonction pour encoder un fichier en Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === "string") {
          // Supprimer le préfixe "data:application/pdf;base64," (ou autre type MIME)
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        } else {
          reject(new Error("Erreur lors de la lecture du fichier"));
        }
      };
      reader.onerror = () =>
        reject(new Error("Erreur lors de la lecture du fichier"));
    });
  };

  const handleAssign = async () => {
    if (!nextEtape || !selectedDocument || !latestDocument?.idDocument) {
      setError("L'ID du document est manquant ou invalide.");
      return;
    }

    setAssignLoading(true);

    try {
      // Encoder les fichiers en Base64
      const encodedFiles = await Promise.all(
        attachments.map(async (file) => ({
          name: file.name,
          content: await fileToBase64(file),
        }))
      );

      // Créer le payload JSON
      const payload = {
        documentId: String(latestDocument.idDocument),
        userId: userId || "",
        commentaire: comment,
        etapeId: latestDocument.etape?.idEtape || "",
        UserDestinatorName: userDestinatorName || "",
        nextEtapeName: nextEtape.name || "",
        files: encodedFiles, // Tableau de { name, content }
      };

      console.log("Envoi de payload JSON :", payload);

      const response = await api.post("/etapes/affect", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Réponse :", response.data);

      if (response.data.success) {
        const idDocument = response.data.data.document.idDocument;
        localStorage.setItem("idDocument", idDocument);
        setConfirmationMessage("Document affecté avec succès.");
        setShowDialog(false);
        setTimeout(() => {
          setConfirmationMessage(null);
        }, 3000);
      } else {
        setError(response.data.message || "Erreur lors de l'affectation.");
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        console.error("Erreur lors de l'affectation du document :", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(
          err.response?.data?.message ||
            "Erreur lors de l'affectation du document"
        );
      } else {
        console.error("Erreur inattendue :", err);
        setError("Erreur inattendue lors de l'affectation du document");
      }
      setTimeout(() => {
        setError(null);
      }, 9000);
    } finally {
      setAssignLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-100 min-h-screen">
      <SearchNavbar />
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
                            <p>{hit._source.content}</p>
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
          {nextEtape ? (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                Étape suivante
              </label>
              <input
                type="text"
                value={nextEtape.name}
                readOnly
                className="mt-2 block w-full text-sm text-gray-500 border-gray-300 rounded-md"
              />
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">
              Aucune étape suivante disponible.
            </p>
          )}

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Ajouter un commentaire..."
            rows={4}
            className="w-full border p-2 mt-4 rounded"
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Joindre des fichiers
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center">
                      <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">{file.name}</span>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <Button variant="secondary" onClick={() => setShowDialog(false)}>
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleAssign}
              disabled={!nextEtape?.name || assignLoading}
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
