import React from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../common/Button';
import type { User } from '../../../types/setup';

interface UsersSetupProps {
  users: User[];
  onUpdate: (users: User[]) => void;
}

export const UsersSetup: React.FC<UsersSetupProps> = ({ users, onUpdate }) => {
  const addUser = () => {
    onUpdate([
      ...users,
      {
        id: Date.now().toString(),
        firstName: '',
        lastName: '',
        email: '',
        position: ''
      }
    ]);
  };

  const removeUser = (id: string) => {
    onUpdate(users.filter(u => u.id !== id));
  };

  const updateUser = (id: string, field: keyof User, value: string) => {
    onUpdate(
      users.map(u => u.id === id ? { ...u, [field]: value } : u)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            Utilisateurs du système
          </h3>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={Plus}
          onClick={addUser}
        >
          Ajouter un utilisateur
        </Button>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="p-4 bg-white rounded-lg border border-gray-200"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-grow grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={user.firstName}
                  onChange={(e) => updateUser(user.id, 'firstName', e.target.value)}
                  placeholder="Prénom"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <input
                  type="text"
                  value={user.lastName}
                  onChange={(e) => updateUser(user.id, 'lastName', e.target.value)}
                  placeholder="Nom"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => updateUser(user.id, 'email', e.target.value)}
                  placeholder="Email"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                <input
                  type="text"
                  value={user.position}
                  onChange={(e) => updateUser(user.id, 'position', e.target.value)}
                  placeholder="Poste"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <button
                onClick={() => removeUser(user.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};