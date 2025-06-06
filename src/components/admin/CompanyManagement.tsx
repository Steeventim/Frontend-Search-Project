import React, { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { TextArea } from "../common/form/TextArea";
import api from "../../services/api"; // Assurez-vous que le chemin est correct

// Définir l'interface pour une entreprise
interface Company {
  idStructure: string; // ID de l'entreprise
  NomStructure: string; // Nom de l'entreprise
  DescriptionStructure: string; // Description de l'entreprise
}

export const CompanyManagement: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await api.get("/structures/all");
        setCompanies(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des entreprises:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleUpdate = async () => {
    if (!selectedCompany) return;

    try {
      const response = await api.put(
        `/structures/${selectedCompany.idStructure}`,
        {
          NomStructure: selectedCompany.NomStructure,
          DescriptionStructure: selectedCompany.DescriptionStructure,
        }
      );
      console.log("Données de l'entreprise mises à jour:", response.data);

      // Mettre à jour la liste des entreprises après la mise à jour
      const updatedCompanies = companies.map((company) =>
        company.idStructure === selectedCompany.idStructure
          ? response.data
          : company
      );
      setCompanies(updatedCompanies);
      setSelectedCompany(null); // Réinitialiser la sélection
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour des données de l'entreprise:",
        error
      );
    }
  };

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Liste des entreprises
        </h1>
      </div>

      <Card>
        <ul className="space-y-4">
          {companies.map((company) => (
            <li
              key={company.idStructure}
              className="flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {company.NomStructure}
                </h3>
                <p className="text-sm text-gray-600">
                  {company.DescriptionStructure}
                </p>
              </div>
              <Button
                onClick={() => handleSelectCompany(company)}
                variant="primary"
              >
                Modifier
              </Button>
            </li>
          ))}
        </ul>
      </Card>

      {selectedCompany && (
        <Card>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
            className="space-y-6"
          >
            <h3 className="text-lg font-medium text-gray-900">
              Modifier l'entreprise
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  value={selectedCompany.NomStructure}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      NomStructure: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <TextArea
                  value={selectedCompany.DescriptionStructure}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      DescriptionStructure: e.target.value,
                    })
                  }
                  rows={4}
                  placeholder="Description de l'entreprise..."
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" icon={Save}>
                Enregistrer les modifications
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
