import React, { useState } from "react";
import { Building } from "lucide-react";
import type { Company } from "../../../types/setup";

interface CompanySetupProps {
  data: Company;
  onUpdate: (data: Company) => void;
}

export const CompanySetup: React.FC<CompanySetupProps> = ({
  data,
  onUpdate,
}) => {
  const [companyData, setCompanyData] = useState<Company>(data);

  const handleUpdate = (key: keyof Company, value: string) => {
    const updatedData = { ...companyData, [key]: value };
    setCompanyData(updatedData);
    onUpdate(updatedData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Building className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">
          Informations del'entreprise
        </h3>
      </div>
      <div>
        <label className="block text-gray-700">Nom de l'entreprise</label>
        <input
          type="text"
          value={companyData.name}
          onChange={(e) => handleUpdate("name", e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>
      <div>
        <label className="block text-gray-700">
          Description de l'entreprise
        </label>
        <textarea
          value={companyData.description}
          onChange={(e) => handleUpdate("description", e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          rows={6} // Ajustez le nombre de lignes pour rendre la zone de texte plus large
        />
      </div>
    </div>
  );
};
