import { useCallback } from "react";
import type { ProcessStep } from "../../../types/process";
import api from "../../../services/api";

export const useProcessActions = () => {
  const handleApprove = useCallback(
    async (step: ProcessStep, comment: string, attachments: File[]) => {
      try {
        // Préparez les données pour l'appel API
        const data = {
          documentId: step.documentId,
          userId: step.userId,
          etapeId: step.id,
          nextEtapeName: step.nextEtapeName,
          UserDestinatorName: step.UserDestinatorName,
          comments: [{ content: comment }],
          files: attachments.map((file) => ({
            name: file.name,
            type: file.type,
            size: file.size,
            content: file,
          })),
        };

        // Faites l'appel API pour approuver l'étape
        const response = await api.post("/forward-to-next-etape", data, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        console.log("Approved:", response.data);
      } catch (error) {
        console.error("Error approving step:", error);
      }
    },
    []
  );

  const handleReject = useCallback(
    async (step: ProcessStep, comment: string, attachments: File[]) => {
      // Implémentez ici l'appel API pour rejeter l'étape
      console.log("Rejected:", step.id, comment, attachments);
      // Exemple d'appel API
      // await api.rejectStep(step.id, comment, attachments);
    },
    []
  );

  return {
    handleApprove,
    handleReject,
  };
};
