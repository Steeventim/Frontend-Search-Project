import React, { useState } from "react";
import axios from "axios";
import api from "../../services/api";
import LoadingSpinner from "../common/LoadingSpinner";
import { Twitter, Github } from "lucide-react";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/users/login", {
        Email: email,
        Password: password,
      });
      localStorage.setItem("token", response.data.token);
      window.location.href = "/dashboard"; // Rediriger vers le tableau de bord
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
            setError("Une erreur est survenue. Veuillez réessayer.");
        }
      } else {
        setError("Erreur réseau ou serveur.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Section d'inscription */}
      <div className="lg:w-1/2 bg-gradient-to-r from-blue-600 to-blue-400 p-8 hidden lg:flex flex-col justify-center">
        <div className="max-w-md mx-auto text-white">
          <h2 className="text-4xl font-bold mb-4">Première visite ?</h2>
          <p className="text-lg mb-8">
            Rejoignez notre communauté et simplifiez la gestion de vos processus
            métiers.
          </p>
          <button
            onClick={() => (window.location.href = "/register")}
            className="bg-transparent border-2 border-white rounded-lg px-8 py-3 hover:bg-white hover:text-blue-600 transition-all duration-300"
          >
            Créer un compte
          </button>
        </div>
      </div>

      {/* Section de connexion */}
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
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
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
          <div className="mt-4 flex justify-between">
            <button className="flex items-center space-x-2">
              <Twitter className="w-5 h-5" />
              <span>Twitter</span>
            </button>
            <button className="flex items-center space-x-2">
              <Github className="w-5 h-5" />
              <span>Github</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
