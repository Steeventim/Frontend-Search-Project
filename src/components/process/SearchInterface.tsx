import React, { useState, useEffect, useCallback, useMemo } from "react";
import { AxiosError } from "axios";
import { Search, FileText, Plus, XCircle } from "lucide-react";
import { FixedSizeList as List } from "react-window";
import debounce from "lodash/debounce";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { searchService } from "../../services/searchService";
import { SearchResponse, Hit, LatestDocument } from "../../types/search";
import api from "../../services/api";
import { Dialog } from "../common/Dialog";
import { SearchNavbar } from "../layout/SearchNavbar";
import { userService } from "../../services/userService";
import { useProcessData } from "../../hooks/useProcessData";
import type { Etape, Process, ProcessData } from "../../types/process";

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
  const { process }: ProcessData = useProcessData();
  const [userDestinatorName, setUserDestinatorName] = useState<string | null>(
    null
  );
  const [nextEtape, setNextEtape] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [etapes, setEtapes] = useState<Etape[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [currentEtape, setCurrentEtape] = useState<Etape | null>(null);

  // Consolidation des fetchs initiaux
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [userResponse, etapesResponse, latestDocumentResponse] =
          await Promise.all([
            userService.getUserById("me"),
            api.get<{ success: boolean; count: number; data: Etape[] }>(
              "/etapes/all"
            ),
            api.get<{ success: boolean; data: LatestDocument }>(
              "/latest-document"
            ),
          ]);
        setUserId(userResponse.id);
        if (etapesResponse.data.success) {
          setEtapes(etapesResponse.data.data);
        } else {
          setError("Erreur lors de la récupération des étapes");
        }
        if (latestDocumentResponse.data.success) {
          setLatestDocument(latestDocumentResponse.data.data);
        } else {
          setError("Erreur lors de la récupération du dernier document");
        }
      } catch (err) {
        console.error(
          "Erreur lors de la récupération des données initiales",
          err
        );
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      }
    };
    fetchInitialData();
  }, []);

  // Déterminer l'étape actuelle
  useEffect(() => {
    if (latestDocument?.etape) {
      setCurrentEtape(latestDocument.etape);
    } else if (process?.etape) {
      setCurrentEtape(process.etape);
    } else {
      setCurrentEtape(null);
    }
  }, [latestDocument, process]);

  // Déterminer l'étape suivante
  useEffect(() => {
    if (process?.nextEtape) {
      setNextEtape({
        id: process.nextEtape.id,
        name: process.nextEtape.name,
      });
      if (process.nextEtape.users && process.nextEtape.users.length > 0) {
        setUserDestinatorName(process.nextEtape.users[0].name);
      }
    } else if (currentEtape && etapes.length > 0) {
      const sortedEtapes = [...etapes].sort(
        (a, b) => a.sequenceNumber - b.sequenceNumber
      );
      const nextEtapeIndex = sortedEtapes.findIndex(
        (etape) => etape.idEtape === currentEtape.idEtape
      );
      const nextEtapeCandidate = sortedEtapes[nextEtapeIndex + 1];
      if (nextEtapeCandidate) {
        setNextEtape({
          id: nextEtapeCandidate.idEtape,
          name: nextEtapeCandidate.LibelleEtape,
        });
        setUserDestinatorName(null);
      } else {
        setNextEtape(null);
        setUserDestinatorName(null);
      }
    } else {
      setNextEtape(null);
      setUserDestinatorName(null);
    }
  }, [currentEtape, etapes, process]);

  // Recherche avec debounce
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) return;
      setLoading(true);
      setError(null);
      try {
        const response: SearchResponse = await searchService.search(query);
        console.log(
          "Search response in component:",
          JSON.stringify(response, null, 2)
        );
        if (
          response.success &&
          response.data.hits &&
          response.data.hits.length > 0
        ) {
          setResults(response.data.hits);
        } else {
          setResults([]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue"
        );
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleSearch = useCallback(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handlePreview = useCallback(
    (documentName: string) => {
      const searchTerm = searchQuery;
      const previewUrl = `${
        api.defaults.baseURL
      }/highlightera2/${encodeURIComponent(documentName)}/${encodeURIComponent(
        searchTerm
      )}`;
      console.log("Opening preview:", previewUrl);
      window.open(previewUrl, "_blank");
    },
    [searchQuery]
  );

  const openAssignDialog = useCallback((document: Hit) => {
    setSelectedDocument(document);
    setShowDialog(true);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setAttachments(Array.from(e.target.files));
      }
    },
    []
  );

  const removeAttachment = useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const fileToBase64 = useCallback(
    (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          if (typeof reader.result === "string") {
            const base64String = reader.result.split(",")[1];
            resolve(base64String);
          } else {
            reject(new Error("Erreur lors de la lecture du fichier"));
          }
        };
        reader.onerror = () =>
          reject(new Error("Erreur lors de la lecture du fichier"));
      }),
    []
  );

  const handleAssign = useCallback(async () => {
    const newErrors: { [key: string]: string } = {};
    if (!nextEtape?.name) newErrors.etape = "Aucune étape suivante disponible.";
    if (!userId) newErrors.userId = "Utilisateur non identifié.";
    if (!latestDocument?.idDocument)
      newErrors.document = "Document non sélectionné.";
    if (!userDestinatorName)
      newErrors.userDestinatorName = "Destinataire non spécifié.";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setAssignLoading(true);

    try {
      const encodedFiles = await Promise.all(
        attachments.map(async (file) => ({
          name: file.name,
          content: await fileToBase64(file),
        }))
      );

      const payload = {
        documentId: latestDocument?.idDocument
          ? String(latestDocument.idDocument)
          : "",
        userId: userId || "",
        comments: comment.trim() ? [{ content: comment }] : [],
        etapeId: latestDocument?.etape?.idEtape || "",
        UserDestinatorName: userDestinatorName || "",
        nextEtapeName: nextEtape?.name || "",
        files: encodedFiles,
      };

      const response = await api.post("/etapes/affect", payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        const idDocument = response.data.data.document.idDocument;
        localStorage.setItem("idDocument", idDocument);
        setConfirmationMessage("Document affecté avec succès.");
        setShowDialog(false);
        setComment("");
        setAttachments([]);
        setTimeout(() => setConfirmationMessage(null), 3000);
      } else {
        setError(response.data.message || "Erreur lors de l'affectation.");
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message ||
            "Erreur lors de l'affectation du document"
        );
      } else {
        setError("Erreur inattendue lors de l'affectation du document");
      }
      setTimeout(() => setError(null), 9000);
    } finally {
      setAssignLoading(false);
    }
  }, [
    nextEtape,
    userId,
    latestDocument,
    comment,
    attachments,
    userDestinatorName,
    fileToBase64,
  ]);

  const transformHighlight = useCallback((highlight: string): string => {
    return highlight.replace(
      /<strong style="font-weight:bold;color:black;">(.*?)<\/strong>/g,
      '<span style="font-weight: bold;">$1</span>'
    );
  }, []);

  const highlightText = useCallback((text: string, query: string): string => {
    if (!text || !query.trim()) return text;
    const words = query
      .split(/\s+/)
      .filter((word) => word.length > 0)
      .map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    let highlightedText = text;
    words.forEach((word) => {
      const regex = new RegExp(`(${word})`, "gi");
      highlightedText = highlightedText.replace(
        regex,
        '<span style="font-weight: bold;">$1</span>'
      );
    });
    return highlightedText;
  }, []);

  const highlightedResults = useMemo(() => {
    console.log("Results before processing:", JSON.stringify(results, null, 2));
    const processedResults = results.map((hit) => ({
      ...hit,
      highlightedContent: hit.highlight?.content?.length
        ? hit.highlight.content.map((text) => {
            const transformed = transformHighlight(text);
            return transformed.length > 150
              ? transformed.slice(0, 150) + "..."
              : transformed;
          })
        : [
            highlightText(
              hit.source.content || "Aucun extrait disponible",
              searchQuery
            ).slice(0, 150) + "...",
          ],
      filename: hit.source?.file?.filename || "Nom inconnu",
      extension: hit.source?.file?.extension || "Inconnu",
    }));
    console.log(
      "Highlighted results:",
      JSON.stringify(processedResults, null, 2)
    );
    return processedResults;
  }, [results, searchQuery, transformHighlight, highlightText]);

  const Row = ({
    index,
    style,
  }: {
    index: number;
    style: React.CSSProperties;
  }) => {
    const hit = highlightedResults[index];
    return (
      <div
        style={{ ...style, padding: "8px 0" }}
        className="w-full result-container hover:bg-gray-50 transition-all"
      >
        <div className="max-w-full py-3 border-b border-gray-100">
          <div className="flex items-start justify-between space-y-1">
            <div className="space-y-1 max-w-[75%]">
              {/* Titre tronqué */}
              <a
                href="#"
                onClick={() => handlePreview(hit.filename)}
                className="text-google-blue hover:text-google-blue-hover text-lg font-medium truncate inline-block"
                title={hit.filename}
              >
                {hit.filename}
              </a>

              {/* Extension tronquée */}
              <div className="text-google-meta text-sm truncate">
                Extension: {hit.extension}
              </div>

              {/* Extraits pertinents tronqués */}
              <div className="text-google-text text-base line-clamp-2">
                {hit.highlightedContent.map((highlight, idx) => (
                  <div
                    key={idx}
                    dangerouslySetInnerHTML={{ __html: highlight }}
                  />
                ))}
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={Plus}
              className="text-sm px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-all"
              onClick={() => openAssignDialog(hit)}
            >
              Affecter
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <nav className="w-full bg-white shadow-md border-b border-gray-200">
        {" "}
        <SearchNavbar />
      </nav>
      <Card className="modern-card p-8 bg-white max-w-6xl w-full my-8">
        <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
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
              className="modern-input block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <Button
            variant="primary"
            onClick={handleSearch}
            loading={loading}
            className="text-base px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
          >
            Rechercher
          </Button>
        </div>

        {searchQuery.trim() && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchQuery.split(/\s+/).map(
              (word, index) =>
                word.length > 0 && (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 transition-all hover:bg-blue-200"
                  >
                    {word}
                  </span>
                )
            )}
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600 text-center">
            {error}
          </div>
        )}

        {confirmationMessage && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-600 text-center">
            {confirmationMessage}
          </div>
        )}

        {highlightedResults.length > 0 && (
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="text-sm text-gray-500 mb-3">
              Environ {highlightedResults.length} résultats
            </div>
            <div className="fixed-size-list-container">
              <List
                height={600}
                itemCount={highlightedResults.length}
                itemSize={180} // Augmenté pour éviter le chevauchement
                width="100%"
              >
                {Row}
              </List>
            </div>
          </div>
        )}

        {searchQuery.trim() && !loading && highlightedResults.length === 0 && (
          <div className="mt-8 text-center text-gray-500 max-w-3xl mx-auto">
            Aucun résultat trouvé pour "{searchQuery}"
          </div>
        )}
      </Card>

      {showDialog && (
        <Dialog onClose={() => setShowDialog(false)}>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Étape suivante
            </label>
            {nextEtape ? (
              <p className="mt-2 text-sm text-gray-900 border border-gray-200 rounded-md px-3 py-2 bg-gray-50">
                {nextEtape.name}
              </p>
            ) : (
              <p className="mt-2 text-sm text-red-600">
                Aucune étape suivante disponible. Il s'agit peut-être de la
                dernière étape.
              </p>
            )}
            {errors.etape && (
              <p className="text-sm text-red-600 mt-1">{errors.etape}</p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Commentaire
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              rows={4}
              className="w-full border border-gray-200 p-3 mt-2 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Joindre des fichiers
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
            />
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-md transition-all hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="h-8 w-8 mr-2 object-cover rounded"
                        />
                      ) : (
                        <FileText className="h-8 w-8 text-gray-400 mr-2" />
                      )}
                      <span className="text-sm text-gray-600">{file.name}</span>
                      <span className="text-xs text-gray-400 ml-2">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="text-gray-400 hover:text-gray-600 transition-all"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {errors.userId && (
            <p className="text-sm text-red-600 mt-2">{errors.userId}</p>
          )}
          {errors.document && (
            <p className="text-sm text-red-600 mt-2">{errors.document}</p>
          )}
          {errors.userDestinatorName && (
            <p className="text-sm text-red-600 mt-2">
              {errors.userDestinatorName}
            </p>
          )}

          <div className="flex justify-end mt-6 space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDialog(false)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleAssign}
              disabled={assignLoading || !nextEtape || !userDestinatorName}
              loading={assignLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
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
