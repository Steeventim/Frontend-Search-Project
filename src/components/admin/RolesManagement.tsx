import React, { useState, useEffect } from "react";
import { Shield, Plus, Trash2, Save, Loader2, X } from "lucide-react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import api from "../../services/api";

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  idRole: string;
  name: string;
  description: string;
  isSystemRole: boolean;
  permissions: string[] | null;
  createdAt: string;
  updatedAt: string;
}

const availablePermissions: Permission[] = [
  {
    id: "create_process",
    name: "Créer un processus",
    description: "Permet de créer de nouveaux processus",
  },
  {
    id: "edit_process",
    name: "Modifier un processus",
    description: "Permet de modifier les processus existants",
  },
  {
    id: "delete_process",
    name: "Supprimer un processus",
    description: "Permet de supprimer des processus",
  },
  {
    id: "approve_step",
    name: "Approuver une étape",
    description: "Permet d'approuver les étapes d'un processus",
  },
  {
    id: "reject_step",
    name: "Rejeter une étape",
    description: "Permet de rejeter les étapes d'un processus",
  },
  {
    id: "manage_users",
    name: "Gérer les utilisateurs",
    description: "Permet de gérer les utilisateurs",
  },
  {
    id: "view_reports",
    name: "Voir les rapports",
    description: "Permet de consulter les rapports",
  },
];

export const RolesManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // État pour afficher/masquer la modale
  const [newRole, setNewRole] = useState<Role>({
    idRole: "",
    name: "",
    description: "",
    isSystemRole: false,
    permissions: [],
    createdAt: "",
    updatedAt: "",
  });

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get("/rolesss"); // Route pour récupérer tous les rôles
        setRoles(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des rôles");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  const handleAddRoleClick = () => {
    setNewRole({
      idRole: Date.now().toString(),
      name: "",
      description: "",
      isSystemRole: false,
      permissions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setShowModal(true); // Afficher la modale
  };

  const handleModalClose = () => {
    setShowModal(false); // Masquer la modale
  };

  const handleSaveRole = () => {
    if (!newRole.name.trim() || !newRole.description.trim()) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setRoles([...roles, newRole]); // Ajouter le rôle à la liste
    setShowModal(false); // Masquer la modale
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des rôles</h1>
        <Button variant="primary" icon={Plus} onClick={handleAddRoleClick}>
          Ajouter un rôle
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
                  Rôle Système
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">
                  Permissions
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role.idRole} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                    {role.name}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                    {role.description}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                    {role.isSystemRole ? "Oui" : "Non"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                    {role.permissions ? role.permissions.join(", ") : "Aucune"}
                  </td>
                  <td className="px-6 py-4 border-b border-gray-200 text-sm text-gray-900">
                    <button
                      type="button"
                      onClick={() =>
                        setRoles(roles.filter((r) => r.idRole !== role.idRole))
                      }
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
      )}

      {/* Modale pour ajouter un rôle */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ajouter un rôle</h2>
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
                  Nom du rôle
                </label>
                <input
                  type="text"
                  value={newRole.name}
                  onChange={(e) =>
                    setNewRole({ ...newRole, name: e.target.value })
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
                  value={newRole.description}
                  onChange={(e) =>
                    setNewRole({ ...newRole, description: e.target.value })
                  }
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availablePermissions.map((permission) => (
                    <div key={permission.id} className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          type="checkbox"
                          checked={
                            newRole.permissions?.includes(permission.id) ||
                            false
                          }
                          onChange={() => {
                            const newPermissions =
                              newRole.permissions?.includes(permission.id)
                                ? newRole.permissions.filter(
                                    (p) => p !== permission.id
                                  )
                                : [
                                    ...(newRole.permissions || []),
                                    permission.id,
                                  ];
                            setNewRole({
                              ...newRole,
                              permissions: newPermissions,
                            });
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label className="font-medium text-gray-700">
                          {permission.name}
                        </label>
                        <p className="text-gray-500">
                          {permission.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <Button variant="secondary" onClick={handleModalClose}>
                Annuler
              </Button>
              <Button variant="primary" onClick={handleSaveRole}>
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
