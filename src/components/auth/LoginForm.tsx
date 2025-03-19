import React, { useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";
import { Eye, EyeOff } from "lucide-react"; // Importer les icônes
import { ROUTES } from "../../constants/routes";
import Cookies from "js-cookie";

const AuthForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // État pour le toggle du mot de passe
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      setLoading(true);
      setError(null);

      try {
        const response = await api.post("/users/login", {
          Email: email,
          Password: password,
        });
        const { token, user } = response.data;
        Cookies.set("token", token, { expires: 3 / 24 }); // 3 heures

        if (!user.roles || user.roles.length === 0) {
          // Redirection pour les utilisateurs sans rôle
          navigate(ROUTES.ERROR);
          return;
        }

        const userRole = user.roles[0].name; // On prend le premier rôle
        Cookies.set("roleName", userRole, { expires: 7 }); // Stocker le rôle dans les cookies

        // Redirection en fonction du rôle de l'utilisateur
        console.log("Redirection en cours...", { userRole });
        if (userRole === "superadmin") {
          console.log("Redirection vers:", ROUTES.ADMIN.CREATE_ADMIN);
          navigate(ROUTES.ADMIN.CREATE_ADMIN);
        } else if (userRole === "admin") {
          console.log("Redirection vers:", ROUTES.AUTH.SETUP);
          navigate(ROUTES.AUTH.SETUP);
        } else {
          console.log("Redirection vers le tableau de bord utilisateur");
          navigate(ROUTES.USER.DASHBOARD); // Remplacez par la route appropriée pour le tableau de bord utilisateur
        }
        console.log("Redirection effectuée");
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          switch (err.response.status) {
            case 400:
              setError(
                "Requête invalide. Vérifiez vos informations d'identification."
              );
              break;
            case 401:
              setError("Email ou mot de passe incorrect.");
              break;
            default:
              setError("Une erreur est survenue lors de la connexion.");
          }
        } else {
          setError("Erreur réseau ou serveur.");
        }
        console.error("Erreur lors de la connexion:", err);
      } finally {
        setLoading(false);
      }
    },
    [email, password, navigate]
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-1/2 bg-gradient-to-r from-blue-600 to-blue-400 p-8 hidden lg:flex flex-col justify-center">
        <div className="max-w-md mx-auto text-white">
          <h2 className="text-4xl font-bold mb-4">Première visite ?</h2>
          <p className="text-lg mb-8">
            Rejoignez notre communauté et simplifiez la gestion de vos processus
            métiers.
          </p>
        </div>
      </div>

      <div className="lg:w-1/2 flex flex-col justify-center p-8">
        <div className="max-w-md mx-auto w-full">
          <h2 className="text-4xl font-bold mb-4">Connexion</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Toggle entre texte et mot de passe
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)} // Toggle de l'état showPassword
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}{" "}
                  {/* Icône pour afficher/masquer */}
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              {loading ? <LoadingSpinner /> : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
