import React, { useState, useEffect } from "react";
import { Plus, Trash2, Save, Loader2, X } from "lucide-react";
import { Button } from "../common/Button";
import api from "../../services/api";

interface TypeProjet {
  idType: string;
  Libelle: string;
  Description: string;
}

interface ProcessStep {
  idEtape: string;
  LibelleEtape: string;
  Description: string;
  Validation: string;
  sequenceNumber: number;
  roleId: string | null;
  TypeProjets?: TypeProjet[];
}

export const ProcessStepsManagement: React.FC = () => {
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newStep, setNewStep] = useState<Partial<ProcessStep>>({
    LibelleEtape: "",
    Description: "",
    Validation: "pending",
    roleId: null,
  });

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const response = await api.get("/etapes/all");
        console.log("Fetched steps:", response.data);
        if (Array.isArray(response.data)) {
          setSteps(response.data);
        } else {
          throw new Error("La réponse de l'API n'est pas un tableau");
        }
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        setError(`Erreur lors du chargement des étapes: ${errMsg}`);
        console.error("Fetch steps error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSteps();
  }, []);

  const handleAddStepClick = () => {
    console.log(
      "Bouton 'Ajouter une étape' cliqué, showModal avant:",
      showModal
    );
    setShowModal(true);
    console.log("showModal après:", showModal); // Note: showModal ne sera pas encore mis à jour ici
  };

  const addStep = async () => {
    if (!newStep.LibelleEtape?.trim() || !newStep.Description?.trim()) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await api.post("/etapes", {
        ...newStep,
        idEtape: Date.now().toString(), // ID temporaire, à remplacer par l'ID du backend si fourni
        sequenceNumber: steps.length + 1,
        Validation: newStep.Validation || "pending",
      });
      console.log("Created step:", response.data);

      setSteps([...steps, response.data]);
      setSuccessMessage("Étape ajoutée avec succès !");
      setShowModal(false);
      setNewStep({
        LibelleEtape: "",
        Description: "",
        Validation: "pending",
        roleId: null,
      });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setError(`Erreur lors de l'ajout de l'étape: ${errMsg}`);
      console.error("Add step error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const removeStep = async (id: string) => {
    setIsSaving(true);
    try {
      await api.delete(`/etapes/delete/${id}`);
      setSteps(steps.filter((s) => s.idEtape !== id));
      setSuccessMessage("Étape supprimée avec succès !");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setError(`Erreur lors de la suppression de l'étape: ${errMsg}`);
      console.error("Delete step error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateStep = (
    id: string,
    field: keyof ProcessStep,
    value: string | number | null
  ) => {
    setSteps(
      steps.map((s) => (s.idEtape === id ? { ...s, [field]: value } : s))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.post("/etapes/update", { steps });
      setSuccessMessage("Étapes mises à jour avec succès !");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      setError(`Erreur lors de la mise à jour des étapes: ${errMsg}`);
      console.error("Update steps error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewStep({
      LibelleEtape: "",
      Description: "",
      Validation: "pending",
      roleId: null,
    });
    setError(null);
  };

  const handleModalSave = () => {
    setShowModal(false);
    addStep();
  };

  // Log pour vérifier si la modale est rendue
  useEffect(() => {
    console.log("showModal changé:", showModal);
  }, [showModal]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Configuration des étapes
        </h1>
        {/* Test avec Button personnalisé */}
        {/* <Button variant="primary" icon={Plus} onClick={handleAddStepClick}>
          Ajouter une étape
        </Button> */}
        {/* Test avec button natif pour isoler le problème */}
        <button
          onClick={handleAddStepClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Ajouter une étape (natif)
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          {successMessage}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        </div>
      ) : steps.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucune étape disponible
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">
                  Nom
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">
                  Description
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">
                  Ordre
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">
                  Rôle requis
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {steps.map((step) => (
                <tr key={step.idEtape} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                    <input
                      type="text"
                      value={step.LibelleEtape}
                      onChange={(e) =>
                        updateStep(step.idEtape, "LibelleEtape", e.target.value)
                      }
                      className="w-full border-none bg-transparent focus:ring-0"
                    />
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                    <input
                      type="text"
                      value={step.Description}
                      onChange={(e) =>
                        updateStep(step.idEtape, "Description", e.target.value)
                      }
                      className="w-full border-none bg-transparent focus:ring-0"
                    />
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                    {step.sequenceNumber}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                    <input
                      type="text"
                      value={step.roleId || ""}
                      onChange={(e) =>
                        updateStep(
                          step.idEtape,
                          "roleId",
                          e.target.value || null
                        )
                      }
                      className="w-full border-none bg-transparent focus:ring-0"
                    />
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                    <button
                      type="button"
                      onClick={() => removeStep(step.idEtape)}
                      className="text-red-600 hover:text-red-700"
                      disabled={isSaving}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mt-6 flex justify-end">
          <Button
            type="submit"
            variant="primary"
            icon={Save}
            disabled={isSaving || steps.length === 0}
          >
            {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </form>

      {/* Modale pour ajouter une étape */}
      {showModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ajouter une étape</h2>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom de l'étape
                </label>
                <input
                  type="text"
                  value={newStep.LibelleEtape || ""}
                  onChange={(e) =>
                    setNewStep({ ...newStep, LibelleEtape: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={newStep.Description || ""}
                  onChange={(e) =>
                    setNewStep({ ...newStep, Description: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rôle requis
                </label>
                <input
                  type="text"
                  value={newStep.roleId || ""}
                  onChange={(e) =>
                    setNewStep({ ...newStep, roleId: e.target.value || null })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Validation
                </label>
                <select
                  value={newStep.Validation || "pending"}
                  onChange={(e) =>
                    setNewStep({ ...newStep, Validation: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvé</option>
                  <option value="rejected">Rejeté</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={handleModalClose}
                disabled={isSaving}
              >
                Annuler
              </Button>
              <Button
                variant="primary"
                onClick={handleModalSave}
                disabled={isSaving}
              >
                {isSaving ? "Ajout..." : "Ajouter"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
