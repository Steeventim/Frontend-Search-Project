import React, { useState, useEffect } from "react";
import { FileText, Trash2, Edit } from "lucide-react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import api from "../../services/api";

interface TypeProjet {
  idType: string;
  Libelle: string;
  Description: string;
}

interface Etape {
  idEtape: string;
  LibelleEtape: string;
  Description: string;
  Validation: string;
  sequenceNumber: number;
  createdAt: string;
  updatedAt: string;
  documents: { id: string; name: string; url: string }[];
  typeProjets: TypeProjet[];
}

export const ProcessTemplatesList: React.FC = () => {
  const [etapes, setEtapes] = useState<Etape[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEtapes = async () => {
      try {
        const response = await api.get("/etapes/all");
        setEtapes(response.data.data);
      } catch (err) {
        setError("Erreur lors du chargement des étapes");
        console.error(err);
      }
    };

    fetchEtapes();
  }, []);

  const removeEtape = (idEtape: string) => {
    setEtapes(etapes.filter((etape) => etape.idEtape !== idEtape));
  };

  const updateEtape = (idEtape: string) => {
    const updatedName = prompt(
      "Nom de l'étape:",
      etapes.find((etape) => etape.idEtape === idEtape)?.LibelleEtape
    );
    const updatedDescription = prompt(
      "Description de l'étape:",
      etapes.find((etape) => etape.idEtape === idEtape)?.Description
    );

    if (updatedName !== null && updatedDescription !== null) {
      setEtapes(
        etapes.map((etape) =>
          etape.idEtape === idEtape
            ? {
                ...etape,
                LibelleEtape: updatedName,
                Description: updatedDescription,
              }
            : etape
        )
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Liste des étapes</h1>
        <Button variant="primary" icon={FileText}>
          Ajouter une étape
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projet
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {etapes.map((etape) => (
                <tr key={etape.idEtape}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {etape.LibelleEtape}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {etape.Description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {etape.Validation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {etape.typeProjets
                      .map((projet) => projet.Libelle)
                      .join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      onClick={() => updateEtape(etape.idEtape)}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => removeEtape(etape.idEtape)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
