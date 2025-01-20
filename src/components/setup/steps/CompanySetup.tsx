import React from 'react';
import { Building } from 'lucide-react';
import { TextArea } from '../../common/form/TextArea';
import type { Company } from '../../../types/setup';

interface CompanySetupProps {
  data: Company;
  onUpdate: (data: Company) => void;
}

export const CompanySetup: React.FC<CompanySetupProps> = ({ data, onUpdate }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Building className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">
          Informations de l'entreprise
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom de l'entreprise
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onUpdate({ ...data, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        <TextArea
          label="Description"
          value={data.description}
          onChange={(e) => onUpdate({ ...data, description: e.target.value })}
          rows={4}
          placeholder="Décrivez brièvement votre entreprise..."
        />
      </div>
    </div>
  );
};