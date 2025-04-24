import React, { useState, useEffect } from "react";
import { Trash2, Edit, Plus, User as UserIcon, X } from "lucide-react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { InputField } from "../common/InputField";
import Select from "../common/form/Select";
import { userService } from "../../services/userService";
import { User } from "../../types/auth";
import api from "../../services/api";

// Interface pour le formulaire utilisateur (création et mise à jour)
interface UserFormData {
  nomUser: string;
  prenomUser: string;
  email: string;
  password?: string; // Optionnel pour la mise à jour
  Telephone: string;
  IsActive: boolean;
  roles: string[];
}

export const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<string[]>(["admin", "user", "manager"]); // Liste statique temporaire
  const [error, setError] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [newUser, setNewUser] = useState<UserFormData>({
    nomUser: "",
    prenomUser: "",
    email: "",
    password: "",
    Telephone: "",
    IsActive: true,
    roles: [],
  });

  useEffect(() => {
    loadUsers();
    loadRoles();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors du chargement des utilisateurs.";
      setError(errorMessage);
      console.error(
        "Erreur lors du chargement des utilisateurs:",
        errorMessage
      );
    }
  };

  const loadRoles = async () => {
    try {
      // Remplacer par un appel API réel si disponible
      const response = await api.get("/roles");
      setRoles(response.data.map((role: { name: string }) => role.name));
    } catch (err) {
      console.error(
        "Erreur lors du chargement des rôles, utilisation de la liste statique:",
        err
      );
      // Garder la liste statique en cas d'erreur
      setRoles(["admin", "user", "manager"]);
    }
  };

  const handleCreateUser = async () => {
    try {
      await userService.createUser({
        email: newUser.email,
        password: newUser.password || "",
        nomUser: newUser.nomUser,
        prenomUser: newUser.prenomUser,
        roles: newUser.roles,
        IsActive: newUser.IsActive,
        Telephone: newUser.Telephone || "",
      });
      setConfirmationMessage("Utilisateur créé avec succès !");
      setIsCreateModalOpen(false);
      setNewUser({
        nomUser: "",
        prenomUser: "",
        email: "",
        password: "",
        Telephone: "",
        IsActive: true,
        roles: [],
      });
      await loadUsers();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la création de l'utilisateur.";
      setError(errorMessage);
      console.error(
        "Erreur lors de la création de l'utilisateur:",
        errorMessage
      );
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;
    try {
      await userService.updateUser(selectedUser.id, {
        email: newUser.email,
        nomUser: newUser.nomUser,
        prenomUser: newUser.prenomUser,
        roles: newUser.roles,
        IsActive: newUser.IsActive,
        Telephone: newUser.Telephone || "",
        password: newUser.password || undefined, // Ne pas envoyer si vide
      });
      setConfirmationMessage("Utilisateur mis à jour avec succès !");
      setIsEditModalOpen(false);
      setSelectedUser(null);
      setNewUser({
        nomUser: "",
        prenomUser: "",
        email: "",
        password: "",
        Telephone: "",
        IsActive: true,
        roles: [],
      });
      await loadUsers();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la mise à jour de l'utilisateur.";
      setError(errorMessage);
      console.error(
        "Erreur lors de la mise à jour de l'utilisateur:",
        errorMessage
      );
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    try {
      await userService.deleteUser(selectedUser.id);
      setConfirmationMessage("Utilisateur supprimé avec succès !");
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de la suppression de l'utilisateur.";
      setError(errorMessage);
      console.error(
        "Erreur lors de la suppression de l'utilisateur:",
        errorMessage
      );
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setNewUser({
      nomUser: user.Nom,
      prenomUser: user.Prenom,
      email: user.email,
      password: "",
      Telephone: user.Telephone || "",
      IsActive: user.IsActive ?? false,
      roles: user.roles || [],
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {confirmationMessage && (
        <div className="text-green-500">{confirmationMessage}</div>
      )}
      {error && <div className="text-red-500">{error}</div>}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestion des utilisateurs
        </h1>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Ajouter un utilisateur
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Téléphone
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.Prenom} {user.Nom}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.Telephone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(user)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setIsDeleteModalOpen(true);
                      }}
                      className="text-red-600 hover:text-red-900"
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

      {/* Modale pour créer un utilisateur */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ajouter un utilisateur</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Nom
                <InputField
                  value={newUser.nomUser}
                  onChange={(e) =>
                    setNewUser({ ...newUser, nomUser: e.target.value })
                  }
                  placeholder="Entrez le nom"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Prénom
                <InputField
                  value={newUser.prenomUser}
                  onChange={(e) =>
                    setNewUser({ ...newUser, prenomUser: e.target.value })
                  }
                  placeholder="Entrez le prénom"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Email
                <InputField
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="Entrez l'email"
                />
              </label>
              <InputField
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                placeholder="Entrez le mot de passe"
              />
              <label className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              /
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Téléphone
                </label>
                <InputField
                  value={newUser.Telephone}
                  onChange={(e) =>
                    setNewUser({ ...newUser, Telephone: e.target.value })
                  }
                  placeholder="Entrez le téléphone"
                />
              </div>
              <label className="block text-sm font-medium text-gray-700">
                Rôles
                <Select
                  value={newUser.roles[0] || ""}
                  onChange={(e) =>
                    setNewUser({ ...newUser, roles: [e.target.value] })
                  }
                >
                  <option value="">Sélectionnez un rôle</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </Select>
              </label>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Annuler
              </Button>
              <Button variant="primary" onClick={handleCreateUser}>
                Ajouter
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modale pour modifier un utilisateur */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Modifier l'utilisateur</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Nom
                <InputField
                  value={newUser.nomUser}
                  onChange={(e) =>
                    setNewUser({ ...newUser, nomUser: e.target.value })
                  }
                  placeholder="Entrez le nom"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Prénom
                <InputField
                  value={newUser.prenomUser}
                  onChange={(e) =>
                    setNewUser({ ...newUser, prenomUser: e.target.value })
                  }
                  placeholder="Entrez le prénom"
                />
              </label>
              <label className="block text-sm font-medium text-gray-700">
                Email
                <InputField
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder="Entrez l'email"
                />
              </label>
              <InputField
                label="Mot de passe (laisser vide pour ne pas modifier)"
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                placeholder="Entrez un nouveau mot de passe"
              />
              <label className="block text-sm font-medium text-gray-700">
                Téléphone
                <InputField
                  value={newUser.Telephone}
                  onChange={(e) =>
                    setNewUser({ ...newUser, Telephone: e.target.value })
                  }
                  placeholder="Entrez le téléphone"
                />
              </label>
              <Select
                label="Rôles"
                value={newUser.roles[0] || ""}
                onChange={(e) =>
                  setNewUser({ ...newUser, roles: [e.target.value] })
                }
              >
                <option value="">Sélectionnez un rôle</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Select>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => setIsEditModalOpen(false)}
              >
                Annuler
              </Button>
              <Button variant="primary" onClick={handleEditUser}>
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modale pour confirmer la suppression */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Confirmer la suppression</h2>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p>
              Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
              <strong>
                {selectedUser.Prenom} {selectedUser.Nom}
              </strong>
              ?
            </p>
            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="secondary"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Annuler
              </Button>
              <Button variant="danger" onClick={handleDeleteUser}>
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
