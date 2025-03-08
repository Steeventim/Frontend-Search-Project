import React, { useState, useEffect } from "react";
import { ListOrdered, Plus, Trash2, Save, Loader2 } from "lucide-react";
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
  TypeProjets: TypeProjet[];
}

export const ProcessStepsManagement: React.FC = () => {
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const response = await api.get("/etapes/all");
        setSteps(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des étapes");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSteps();
  }, []);

  const addStep = () => {
    setSteps([
      ...steps,
      {
        idEtape: Date.now().toString(),
        LibelleEtape: "",
        Description: "",
        Validation: "",
        sequenceNumber: steps.length + 1,
        roleId: null,
        TypeProjets: [],
      },
    ]);
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter((s) => s.idEtape !== id));
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
    // TODO: Implement steps update
    console.log("Steps:", steps);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Configuration des étapes
        </h1>
        <Button variant="primary" icon={Plus} onClick={addStep}>
          Ajouter une étape
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      ) : (
        Array.isArray(steps) && (
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
                    Type de projet
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
                      {step.LibelleEtape}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                      {step.Description}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                      {step.sequenceNumber}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                      {step.roleId || "N/A"}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                      {step.TypeProjets.map((type) => type.Libelle).join(
                        ", "
                      ) || "Aucun"}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                      <button
                        type="button"
                        onClick={() => removeStep(step.idEtape)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.idEtape} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ListOrdered className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Étape {index + 1}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => removeStep(step.idEtape)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom de l'étape
                  </label>
                  <input
                    type="text"
                    value={step.LibelleEtape}
                    onChange={(e) =>
                      updateStep(step.idEtape, "LibelleEtape", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ordre
                  </label>
                  <input
                    type="number"
                    value={step.sequenceNumber}
                    onChange={(e) =>
                      updateStep(
                        step.idEtape,
                        "sequenceNumber",
                        parseInt(e.target.value)
                      )
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Rôle requis
                  </label>
                  <input
                    type="text"
                    value={step.roleId || ""}
                    onChange={(e) =>
                      updateStep(step.idEtape, "roleId", e.target.value || null)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={step.Description}
                    onChange={(e) =>
                      updateStep(step.idEtape, "Description", e.target.value)
                    }
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          {steps.length > 0 && (
            <div className="mt-6 flex justify-end">
              <Button type="submit" variant="primary" icon={Save}>
                Enregistrer les modifications
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
