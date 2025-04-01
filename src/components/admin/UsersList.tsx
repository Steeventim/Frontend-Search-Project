import React, { useState, useEffect } from "react";
import { Trash2, Edit, Plus, User as UserIcon } from "lucide-react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { UserFormModal } from "./modals/UserFormModal";
import { DeleteUserModal } from "./modals/DeleteUserModal";
import { userService } from "../../services/userService";
import { User, UserFormData } from "../../types/auth"; // Assurez-vous que ce type est défini correctement

export const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(
    null
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await userService.getUsers();
      // console.log("Réponse de l'API :", response); // Vérifiez la réponse brute ici
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

  const handleCreateUser = async (data: UserFormData) => {
    try {
      await userService.createUser({
        firstName: data.Prenom,
        lastName: data.Nom,
        email: data.Email,
        password: data.Password, // Assurez-vous que le mot de passe est inclus
        phone: data.Telephone || "", // Utilisez une chaîne vide si Telephone est undefined
        isActive: true, // Vous pouvez définir isActive par défaut si nécessaire
      });
      setConfirmationMessage("Utilisateur créé avec succès !");
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

  const handleUpdateUser = async (data: UserFormData) => {
    if (!selectedUser) return; // Assurez-vous qu'un utilisateur est sélectionné
    try {
      await userService.updateUser(selectedUser.id, {
        firstName: data.Prenom,
        lastName: data.Nom,
        email: data.Email,
        phone: data.Telephone || "", // Incluez le téléphone si nécessaire
        isActive: data.IsActive || true, // Incluez isActive si nécessaire
      });
      setConfirmationMessage("Utilisateur modifié avec succès !");
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
    if (!selectedUser) return; // Assurez-vous qu'un utilisateur est sélectionné
    try {
      await userService.deleteUser(selectedUser.id);
      setConfirmationMessage("Utilisateur supprimé avec succès !");
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
                      onClick={() => {
                        setSelectedUser(user);
                        setIsEditModalOpen(true);
                      }}
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

      <UserFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
        title="Ajouter un utilisateur"
      />

      <UserFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleUpdateUser}
        initialData={
          selectedUser
            ? {
                id: selectedUser.id,
                Nom: selectedUser.Nom,
                Prenom: selectedUser.Prenom,
                Email: selectedUser.email,
                Telephone: selectedUser.Telephone,
                IsActive: selectedUser.IsActive,
              }
            : undefined
        }
        title="Modifier l'utilisateur"
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDeleteUser}
        userName={
          selectedUser ? `${selectedUser.Prenom} ${selectedUser.Nom}` : ""
        }
      />
    </div>
  );
};
