import React from 'react';
import { User, Mail, Building, Briefcase } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

export const UserProfile: React.FC = () => {
  const user = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.com',
    department: 'IT',
    position: 'Développeur Senior',
    joinedDate: '2023-01-15'
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="space-y-6">
            <div className="flex items-center">
              <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-10 w-10 text-gray-500" />
              </div>
              <div className="ml-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-gray-500">{user.position}</p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <dl className="space-y-4">
                <div className="flex items-center">
                  <dt className="flex items-center text-sm font-medium text-gray-500 w-1/3">
                    <Mail className="h-5 w-5 mr-2" />
                    Email
                  </dt>
                  <dd className="text-sm text-gray-900">{user.email}</dd>
                </div>
                <div className="flex items-center">
                  <dt className="flex items-center text-sm font-medium text-gray-500 w-1/3">
                    <Building className="h-5 w-5 mr-2" />
                    Département
                  </dt>
                  <dd className="text-sm text-gray-900">{user.department}</dd>
                </div>
                <div className="flex items-center">
                  <dt className="flex items-center text-sm font-medium text-gray-500 w-1/3">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Poste
                  </dt>
                  <dd className="text-sm text-gray-900">{user.position}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Modifier le profil</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  defaultValue={user.email}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end">
                <Button variant="primary">
                  Enregistrer les modifications
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};