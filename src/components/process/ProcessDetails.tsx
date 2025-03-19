import React, { useState, useEffect, useRef } from "react";
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
import api from "../../services/api"; // Importez votre service API

export const ProcessDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Utilisez l'idDocument passé via la navigation
  const { process, loading, error } = useProcessData(id);
  const [comment, setComment] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [initiatorName, setInitiatorName] = useState<string>("");
  const [initiatorId, setInitiatorId] = useState<string>("");

  // Récupérer l'idDocument depuis localStorage
  const idDocument = localStorage.getItem("idDocument");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userService.getUserById("me");
        setInitiatorName(userData.Nom && userData.Prenom);
        setInitiatorId(userData.id);
      } catch (error) {
        console.error(
          "Erreur lors du chargement des informations utilisateur:",
          error
        );
      }
    };

    fetchUser();
  }, []);

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
      const response = await api.post("/approve-document", {
        documentId: idDocument, // Utilisez l'idDocument ici
        userId: initiatorId,
        etapeId: etapeTypeProjet.etapeId,
        comments: [{ content: comment }],
        files: attachments,
      });

      if (response.data.success) {
        console.log("Document approuvé avec succès", response.data);
        // Mettez à jour l'état ou affichez un message de succès si nécessaire
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
      if (
        process.nextEtape &&
        process.nextEtape.users &&
        process.nextEtape.users.length > 0
      ) {
        const nextUser = process.nextEtape.users[0]; // Récupérer le premier utilisateur de l'étape suivante
        const response = await api.post("/forward-to-next-etape", {
          documentId: idDocument,
          userId: initiatorId,
          comments: [{ content: comment }],
          files: attachments,
          etapeId: etapeTypeProjet.etapeId,
          UserDestinatorName: nextUser.name, // Utiliser le nom de l'utilisateur récupéré
          nextEtapeName: process.nextEtape.name, // Utiliser le nom de l'étape suivante
        });

        if (response.data.success) {
          console.log("Processus transféré avec succès", response.data);
        } else {
          console.error("Erreur lors du transfert du processus", response.data);
        }
      } else {
        console.error("Aucun utilisateur disponible pour l'étape suivante.");
      }
    } catch (error) {
      console.error("Erreur lors du transfert du processus", error);
    }
  };

  const handleRejectClick = async () => {
    try {
      const comments = [{ content: comment }];

      // Appel à l'API pour rejeter le document
      const response = await api.post(`/documents/${idDocument}/reject`, {
        documentId: idDocument,
        userId: initiatorId,
        comments,
      });

      if (response.data.success) {
        console.log("Document rejeté avec succès", response.data);

        // Mettez à jour l'état ou affichez un message de succès si nécessaire
        // Par exemple, vous pourriez réinitialiser le commentaire ou afficher une notification
        setComment(""); // Réinitialiser le champ de commentaire
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {process.typeProjets[0].Libelle}
              </h1>
              <p className="mt-2 text-gray-600">
                {process.typeProjets[0].Description}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                status === "approved"
                  ? "bg-green-100 text-green-800"
                  : status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : status === "in_progress"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {process.Validation === "approved" ? (
                <CheckCircle2 className="h-4 w-4 mr-2" />
              ) : process.Validation === "rejected" ? (
                <XCircle className="h-4 w-4 mr-2" />
              ) : (
                <Clock className="h-4 w-4 mr-2" />
              )}
              {process.Validation.replace("_", " ")}
            </span>
          </div>

          <div className="mt-6 flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              {initiatorName}
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
                      ) : status === "rejected" ? (
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
                <Button
                  variant="primary"
                  icon={CheckCircle2}
                  onClick={handleApproveClick}
                >
                  Approuver
                </Button>
                <Button
                  variant="danger"
                  icon={XCircle}
                  onClick={handleRejectClick}
                >
                  Rejeter
                </Button>
                {process &&
                process.nextEtape &&
                process.nextEtape.users &&
                process.nextEtape.users.length > 0 ? (
                  <Button
                    variant="secondary"
                    icon={Navigation}
                    onClick={handleTransferClick}
                  >
                    Transférer
                  </Button>
                ) : (
                  <p>Aucun utilisateur disponible pour l'étape suivante.</p>
                )}
              </div>

              {/* Prévisualisation des fichiers joints */}
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
                        {/* Affichage d'une prévisualisation si le fichier est une image */}
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
            {process.typeProjets.flatMap((typeProjet) =>
              typeProjet.EtapeTypeProjet.comments?.map((comment) => (
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
                      {comment.userName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDateTime(comment.timestamp)}
                    </p>
                    <p className="mt-2 text-sm text-gray-700">{comment.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
