import React, { useState, useEffect, useRef, memo } from "react";
import { useParams } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  XCircle,
  User,
  Calendar,
  MessageSquare,
  Paperclip,
  AlertTriangle,
  Navigation,
} from "lucide-react";
import { Button } from "../common/Button";
import { useProcessData } from "../../hooks/useProcessData";
import { userService } from "../../services/userService";
import { formatDateTime } from "../../utils/date";
import api from "../../services/api";
import { useRolePermissions } from "../../context/RolePermissionsContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

interface ReceivedDocument {
  documentId: string;
  title: string;
  previousEtapeId?: string;
  currentEtapeId?: string;
  status: string;
  transferStatus: string;
  transferTimestamp?: string;
  url: string | null;
  destinator?: string;
  senderUserId?: string;
  comments: {
    id: string;
    content: string;
    createdAt: string;
    user?: { id: string; name: string };
  }[];
  files: {
    idFile: string;
    documentId: string;
    fileName: string;
    filePath: string;
    fileType: string;
    fileSize: number;
    thumbnailPath?: string | null;
    createdAt: string;
    updatedAt: string;
  }[];
}

const ProcessDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { process, loading, error } = useProcessData(id);
  const [state, setState] = useState({
    initiatorName: "",
    initiatorId: "",
    receivedDocuments: [] as ReceivedDocument[],
    transferError: null as string | null,
  });
  const [comment, setComment] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idDocument = localStorage.getItem("idDocument");

  const { permissions } = useRolePermissions();
  const userRole = Cookies.get("roleUser") || "Guest"; // Récupérer dynamiquement le rôle de l'utilisateur
  const canSearch = permissions[userRole]?.includes("Rechercher"); // Vérifie si l'utilisateur peut rechercher
  const canApprove = permissions[userRole]?.includes("Valider"); // Vérifie si l'utilisateur peut approuver
  const canReject = permissions[userRole]?.includes("Rejeter"); // Vérifie si l'utilisateur peut rejeter
  const canTransfer = permissions[userRole]?.includes("Transférer"); // Vérifie si l'utilisateur peut transférer
  const navigate = useNavigate(); // Pour naviguer vers la page de recherche

  useEffect(() => {
    console.log("ProcessDetails mounted");
    const fetchUserAndDocuments = async () => {
      try {
        const userData = await userService.getUserById("me");
        const fullName = `${userData.Nom} ${userData.Prenom}`.trim();
        const { data } = await api.get(`/received-documents/${userData.id}`);
        setState((prev) => {
          if (
            prev.initiatorName === fullName &&
            prev.initiatorId === userData.id
          ) {
            console.log("useEffect: state unchanged, skipping setState");
            return prev;
          }
          console.log("useEffect: updating state");
          return {
            ...prev,
            initiatorName: fullName,
            initiatorId: userData.id,
            receivedDocuments: data.data,
          };
        });
      } catch (error) {
        console.error(
          "Erreur lors du chargement des informations utilisateur ou des documents reçus:",
          error
        );
      }
    };

    fetchUserAndDocuments();
    return () => console.log("ProcessDetails unmounted");
  }, []);

  // Compteur de rendus
  const renderCount = useRef(0);
  useEffect(() => {
    renderCount.current += 1;
    console.log(`ProcessDetails rendered ${renderCount.current} times`);
  }, [state, comment, attachments, process, loading, error]);

  const toBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleApproveClick = async () => {
    try {
      const base64Files = await Promise.all(
        attachments.map(async (file) => ({
          name: file.name,
          content: await toBase64(file),
        }))
      );
      const response = await api.post("/approve-document", {
        documentId: idDocument,
        userId: state.initiatorId,
        etapeId: process?.typeProjets[0]?.EtapeTypeProjet?.etapeId,
        comments: [{ content: comment }],
        files: base64Files,
      });

      if (response.data.success) {
        console.log("Document approuvé avec succès", response.data);
        setComment("");
        setAttachments([]);
      } else {
        console.error(
          "Erreur lors de l'approbation du document",
          response.data
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'approbation du document", error);
    }
  };

  const handleTransferClick = async () => {
    try {
      if ((process?.nextEtape?.users ?? []).length > 0) {
        const nextUser = process?.nextEtape?.users?.[0];
        const base64Files = await Promise.all(
          attachments.map(async (file) => ({
            name: file.name,
            content: await toBase64(file),
          }))
        );
        const payload = {
          documentId: idDocument,
          userId: state.initiatorId,
          comments: [{ content: comment }],
          files: base64Files,
          etapeId: process?.typeProjets[0]?.EtapeTypeProjet?.etapeId,
          nextEtapeName: process?.nextEtape?.name,
          UserDestinatorName: nextUser?.name, // Supposé disponible, sinon ajuster
        };
        console.log("Transfer payload:", payload);

        const response = await api.post("/etapes/affect", payload);

        if (response.data.success) {
          console.log("Processus transféré avec succès", response.data);
          setComment("");
          setAttachments([]);
          setState((prev) => ({ ...prev, transferError: null }));
        } else {
          console.error("Erreur lors du transfert du processus", response.data);
          setState((prev) => ({
            ...prev,
            transferError: response.data.message || "Erreur lors du transfert",
          }));
        }
      } else {
        console.error("Aucun utilisateur disponible pour l'étape suivante.");
        setState((prev) => ({
          ...prev,
          transferError: "Aucun utilisateur disponible pour l'étape suivante.",
        }));
      }
    } catch (error) {
      console.error("Erreur lors du transfert du processus", error);
      const errMsg = error instanceof Error ? error.message : String(error);
      setState((prev) => ({
        ...prev,
        transferError: `Erreur lors du transfert: ${errMsg}`,
      }));
    }
  };

  const handleRejectClick = async () => {
    try {
      const response = await api.post(`/documents/${idDocument}/reject`, {
        documentId: idDocument,
        userId: state.initiatorId,
        comments: [{ content: comment }],
      });

      if (response.data.success) {
        console.log("Document rejeté avec succès", response.data);
        setComment("");
      } else {
        console.error(
          "Erreur lors du rejet du document",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Erreur lors du rejet du document", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!process || !process.typeProjets) {
    return (
      <div className="text-center p-8 bg-gray-50 rounded-lg">
        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">Processus non trouvé</p>
      </div>
    );
  }

  const firstTypeProjet = process.typeProjets[0];
  const etapeTypeProjet = firstTypeProjet.EtapeTypeProjet;
  const status = "pending";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {firstTypeProjet.Libelle}
              </h1>
              <p className="mt-2 text-gray-600">
                {firstTypeProjet.Description}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800`}
            >
              <Clock className="h-4 w-4 mr-2" />
              {status.replace("_", " ")}
            </span>
          </div>

          <div className="mt-6 flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {state.initiatorName}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              {formatDateTime(process.createdAt)}
            </div>
          </div>

          <div className="mt-8">
            <div className="relative">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-between">
                {process.typeProjets.map((typeProjet, index) => (
                  <div
                    key={typeProjet.idType}
                    className={`flex flex-col items-center ${
                      index === 0
                        ? "text-blue-600"
                        : process.Validation === "approved"
                        ? "text-green-600"
                        : process.Validation === "rejected"
                        ? "text-red-600"
                        : "text-gray-400"
                    }`}
                  >
                    <div
                      className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 bg-white ${
                        index === 0
                          ? "border-blue-600"
                          : process.Validation === "approved"
                          ? "border-green-600"
                          : process.Validation === "rejected"
                          ? "border-red-600"
                          : "border-gray-200"
                      }`}
                    >
                      {process.Validation === "approved" ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : process.Validation === "rejected" ? (
                        <XCircle className="h-6 w-6" />
                      ) : (
                        <span className="text-sm font-medium">
                          {process.sequenceNumber}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium">
                      {process.LibelleEtape}
                    </p>
                    <p className="mt-1 text-xs">{process.Description}</p>
                    <p className="mt-1 text-xs">{state.initiatorName}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {etapeTypeProjet && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Action requise
            </h2>
            {state.transferError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-600">
                {state.transferError}
              </div>
            )}
            <div className="space-y-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              />

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Paperclip}
                  onClick={() => fileInputRef.current?.click()}
                >
                  Ajouter des fichiers
                </Button>

                {attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                      >
                        <div className="flex items-center">
                          <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-400 ml-2">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
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

              <div className="flex space-x-3">
                {canApprove && (
                  <Button
                    variant="primary"
                    icon={CheckCircle2}
                    onClick={handleApproveClick}
                  >
                    Approuver
                  </Button>
                )}
                {canReject && (
                  <Button
                    variant="danger"
                    icon={XCircle}
                    onClick={handleRejectClick}
                  >
                    Rejeter
                  </Button>
                )}
                {canTransfer &&
                  (process?.nextEtape?.users ?? []).length > 0 && (
                    <Button
                      variant="secondary"
                      icon={Navigation}
                      onClick={handleTransferClick}
                    >
                      Transférer
                    </Button>
                  )}
              </div>

              {attachments.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-semibold text-gray-700">
                    Prévisualisation des fichiers
                  </h3>
                  <div className="mt-2 space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="p-2 bg-gray-100 rounded-md">
                        <p className="text-gray-600">{file.name}</p>
                        <p className="text-xs text-gray-500">
                          Taille : {(file.size / 1024).toFixed(1)} KB
                        </p>
                        {file.type.startsWith("image/") && (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="mt-2 max-h-40"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Documents reçus
                  </h2>
                  {state.receivedDocuments.length > 0 ? (
                    state.receivedDocuments.map((doc) => (
                      <div key={doc.documentId} className="mb-6">
                        <a
                          href={doc.url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-lg font-medium ${
                            doc.url
                              ? "text-blue-600 hover:underline"
                              : "text-gray-500"
                          }`}
                        >
                          {doc.title}
                        </a>
                        <p className="text-sm text-gray-500">
                          Transféré le :{" "}
                          {doc.transferTimestamp
                            ? new Date(doc.transferTimestamp).toLocaleString()
                            : "N/A"}
                        </p>
                        {doc.files.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {doc.files.map((file) => (
                              <div
                                key={file.idFile}
                                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                              >
                                <div className="flex items-center">
                                  <Paperclip className="h-4 w-4 text-gray-400 mr-2" />
                                  <span className="text-sm text-gray-600">
                                    {file.fileName}
                                  </span>
                                  <span className="text-xs text-gray-400 ml-2">
                                    ({(file.fileSize / 1024).toFixed(1)} KB)
                                  </span>
                                </div>
                                <a
                                  href={file.filePath}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm"
                                >
                                  Visualiser
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      Aucun document reçu disponible.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Historique des commentaires
          </h2>
          <div className="space-y-4">
            {state.receivedDocuments[0]?.comments
              ?.filter((comment) => comment.user?.id !== state.initiatorId)
              .map((comment) => (
                <div
                  key={comment.id}
                  className="flex space-x-3 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {comment.user?.name || "Utilisateur inconnu"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(comment.createdAt)}
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProcessDetails);
