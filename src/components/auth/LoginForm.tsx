import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, GithubIcon, TwitterIcon } from "lucide-react";
import { InputField } from "../common/InputField";
import { authService } from "../../services/authService"; // Assurez-vous que cela importe le bon authService

interface LoginFormProps {
  onLogin: (credentials: { email: string; password: string }) => void; // Définir le type de la prop onLogin
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    email: "", // Email de l'utilisateur
    password: "", // Mot de passe de l'utilisateur
  });
  const [error, setError] = React.useState<string | null>(null); // État pour gérer les erreurs

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Réinitialiser l'erreur avant la soumission

    console.log("Connexion avec :", formData); // Log des informations d'identification

    try {
      const response = await authService.login(formData); // Appel à la méthode login avec les données du formulaire
      onLogin({ email: formData.email, password: formData.password }); // Appel de la prop onLogin avec email et mot de passe
      navigate("/dashboard"); // Rediriger vers le tableau de bord après une connexion réussie
    } catch (err) {
      setError(
        `Échec de la connexion. Veuillez vérifier vos identifiants. ${
          err instanceof Error ? err.message : err
        }`
      ); // Gérer l'erreur
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Section gauche - Inscription */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 text-white relative overflow-hidden">
        <div className="relative z-10 p-12 flex flex-col justify-between h-full">
          <div className="flex-grow flex flex-col justify-center">
            <h2 className="text-4xl font-bold mb-4">Nouveau ici ?</h2>
            <p className="text-lg text-blue-100 mb-8">
              Rejoignez notre plateforme et commencez à gérer vos processus
              d'entreprise de manière efficace et intuitive.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="w-48 border-2 border-white text-white py-2 px-6 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              S'inscrire
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800"
            alt="Illustration"
            className="absolute inset-0 w-full h-full object-cover opacity-10"
          />
        </div>
      </div>

      {/* Section droite - Connexion */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Se connecter
            </h2>
            {error && <p className="text-red-500 text-center">{error}</p>}{" "}
            {/* Afficher l'erreur si elle existe */}
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <InputField
                icon={<Mail className="h-5 w-5 text-gray-400" />}
                type="email"
                placeholder="Adresse email"
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
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Se connecter
              </button>
            </div>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <TwitterIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <GithubIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
