import React, { useState, useEffect } from "react";
import { User, Mail, Building, Briefcase } from "lucide-react";
import { Card } from "../common/Card";
import { Button } from "../common/Button";
import { userService } from "../../services/userService";
import type { User as UserType } from "../../types/auth";
import Cookies from "js-cookie"; // Importez js-cookie

export const UserProfile: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [roleUser, setRoleUser] = useState<string>(""); // État pour stocker le rôle

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userService.getUserById("me"); // Assuming 'me' returns the current user
        setUser(userData);
        setEmail(userData.email);
        // Récupérer le rôle depuis les cookies
        const roleFromCookie = Cookies.get("roleUser");
        if (roleFromCookie) {
          setRoleUser(roleFromCookie);
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des informations utilisateur:",
          error
        );
      }
    };

    fetchUser();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const updatedUser = await userService.updateUser(user!.id, {
        email,
        password: password || undefined, // Only send password if it's not empty
      });
      setUser(updatedUser);
      alert("Profil mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      alert("Erreur lors de la mise à jour du profil");
    }
  };

  if (!user) {
    return <div>Chargement...</div>;
  }

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
                  {user.Nom} {user.Prenom}
                </h2>
                {/* <p className="text-sm text-gray-500">{user.position}</p> */}
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
                {/* <div className="flex items-center">
                  <dt className="flex items-center text-sm font-medium text-gray-500 w-1/3">
                    <Building className="h-5 w-5 mr-2" />
                    Département
                  </dt>
                  <dd className="text-sm text-gray-900">DEL</dd>
                </div> */}
                <div className="flex items-center">
                  <dt className="flex items-center text-sm font-medium text-gray-500 w-1/3">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Poste
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {roleUser || "Rôle non défini"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </Card>

        <Card>
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">
              Modifier le profil
            </h3>
            <form className="space-y-4" onSubmit={handleUpdateProfile}>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit" variant="primary">
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
