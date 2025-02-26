import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import api from "../../services/api";
import Cookies from "js-cookie";
import LoadingSpinner from "../common/LoadingSpinner";
import axios from "axios";

const CreateAdminForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nomUser, setNomUser] = useState("");
  const [prenomUser, setPrenomUser] = useState("");
  const [telephone, setTelephone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = Cookies.get("role");
    if (role !== "superadmin") {
      navigate(ROUTES.AUTH.LOGIN);
    }
  }, [navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post("/init/admin", {
        email,
        password,
        nomUser,
        prenomUser,
        telephone,
      });

      // Utiliser la réponse ici, par exemple, rediriger ou afficher des données
      console.log(response.data); // Affichez les données de la réponse si nécessaire

      setSuccess("Administrateur créé avec succès");
      setEmail("");
      setPassword("");
      setNomUser("");
      setPrenomUser("");
      setTelephone("");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || "Une erreur est survenue");
      } else {
        setError("Erreur réseau ou serveur.");
      }
      console.error("Erreur lors de la création de l'administrateur:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-4xl font-bold mb-4">Créer un Administrateur</h2>
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
        <div className="mb-4">
          <label className="block text-gray-700">Nom</label>
          <input
            type="text"
            value={nomUser}
            onChange={(e) => setNomUser(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Prénom</label>
          <input
            type="text"
            value={prenomUser}
            onChange={(e) => setPrenomUser(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Téléphone</label>
          <input
            type="text"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-green-500 mb-4">{success}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          {loading ? <LoadingSpinner /> : "Créer"}
        </button>
      </form>
    </div>
  );
};

export default CreateAdminForm;
