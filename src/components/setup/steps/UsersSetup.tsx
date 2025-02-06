import React from "react";
import { Users, Plus, Trash2 } from "lucide-react";
import { Button } from "../../common/Button";
import type { User } from "../../../types/setup";

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
        firstName: "",
        lastName: "",
        email: "",
        position: "",
        password: "", // Ajout du mot de passe
        phoneNumber: "", // Ajout du numéro de téléphone
      },
    ]);
  };

  const updateUser = (index: number, key: keyof User, value: string) => {
    const updatedUsers = [...users];
    updatedUsers[index] = { ...updatedUsers[index], [key]: value };
    onUpdate(updatedUsers);
  };

  const removeUser = (index: number) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    onUpdate(updatedUsers);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Utilisateurs</h2>
      {users.map((user, index) => (
        <div key={user.id} className="mb-4 p-4 border rounded-lg">
          <div className="flex items-center mb-2">
            <Users className="mr-2" />
            <input
              type="text"
              placeholder="Prénom"
              value={user.firstName}
              onChange={(e) => updateUser(index, "firstName", e.target.value)}
              className="mr-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Nom de famille"
              value={user.lastName}
              onChange={(e) => updateUser(index, "lastName", e.target.value)}
              className="mr-2 p-2 border rounded"
            />
          </div>
          <div className="flex items-center mb-2">
            <input
              type="email"
              placeholder="Email"
              value={user.email}
              onChange={(e) => updateUser(index, "email", e.target.value)}
              className="mr-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Poste"
              value={user.position}
              onChange={(e) => updateUser(index, "position", e.target.value)}
              className="mr-2 p-2 border rounded"
            />
          </div>
          <div className="flex items-center mb-2">
            <input
              type="password"
              placeholder="Mot de passe"
              value={user.password}
              onChange={(e) => updateUser(index, "password", e.target.value)}
              className="mr-2 p-2 border rounded"
            />
            <input
              type="tel"
              placeholder="Numéro de téléphone"
              value={user.phoneNumber}
              onChange={(e) => updateUser(index, "phoneNumber", e.target.value)}
              className="mr-2 p-2 border rounded"
            />
          </div>
          <Button
            onClick={() => removeUser(index)}
            className="bg-red-500 text-white"
          >
            <Trash2 className="mr-2" /> Supprimer
          </Button>
        </div>
      ))}
      <Button onClick={addUser} className="bg-blue-500 text-white">
        <Plus className="mr-2" /> Ajouter un utilisateur
      </Button>
    </div>
  );
};
