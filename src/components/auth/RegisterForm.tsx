import React, { useState } from "react";
import { User, Mail, Lock, Phone } from "lucide-react";
import { InputField } from "../common/InputField";
import { Button } from "../common/Button";
import api from "../../services/api";
import axios from "axios";

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "", // Ajout du numéro de téléphone
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/users/register", formData);
      console.log("User registered:", response.data);
      window.location.href = "/login"; // Rediriger vers la page de connexion
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        switch (err.response.status) {
          case 400:
            setError("Bad request. Please check your input.");
            break;
          case 409:
            setError("Email already in use.");
            break;
          default:
            setError("An error occurred during registration.");
        }
      } else {
        setError("Network or server error.");
      }
      console.error("Erreur lors de l'enregistrement:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Créer un compte
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Commencez à gérer vos processus d'entreprise
        </p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <InputField
                icon={<User className="h-5 w-5 text-gray-400" />}
                type="text"
                placeholder="Prénom"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
              <InputField
                icon={<User className="h-5 w-5 text-gray-400" />}
                type="text"
                placeholder="Nom"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
              <InputField
                icon={<Mail className="h-5 w-5 text-gray-400" />}
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              <InputField
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                type="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <InputField
                icon={<Phone className="h-5 w-5 text-gray-400" />}
                type="tel"
                placeholder="Numéro de téléphone"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                required
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Chargement..." : "S'inscrire"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
