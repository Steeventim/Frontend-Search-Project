import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const CreateAdminForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nomUser, setNomUser] = useState("");
  const [prenomUser, setPrenomUser] = useState("");
  const [countryCode, setCountryCode] = useState("+33");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

  // Liste des indicatifs de pays avec drapeaux
  const countryCodes = [
    { code: "+33", flag: "🇫🇷", country: "France" },
    { code: "+1", flag: "🇺🇸", country: "États-Unis/Canada" },
    { code: "+44", flag: "🇬🇧", country: "Royaume-Uni" },
    { code: "+49", flag: "🇩🇪", country: "Allemagne" },
    { code: "+39", flag: "🇮🇹", country: "Italie" },
    { code: "+34", flag: "🇪🇸", country: "Espagne" },
    { code: "+32", flag: "🇧🇪", country: "Belgique" },
    { code: "+41", flag: "🇨🇭", country: "Suisse" },
    { code: "+212", flag: "🇲🇦", country: "Maroc" },
    { code: "+213", flag: "🇩🇿", country: "Algérie" },
    { code: "+216", flag: "🇹🇳", country: "Tunisie" },
    { code: "+221", flag: "🇸🇳", country: "Sénégal" },
    { code: "+225", flag: "🇨🇮", country: "Côte d'Ivoire" },
    { code: "+237", flag: "🇨🇲", country: "Cameroun" },
    { code: "+243", flag: "🇨🇩", country: "RD Congo" },
  ];

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password: string) => {
    const lengthCondition = password.length >= 8;
    const letterCondition = /[a-zA-Z]/.test(password);
    const numberCondition = /\d/.test(password);
    const specialCharacterCondition = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const conditionsMet = [
      lengthCondition,
      letterCondition,
      numberCondition,
      specialCharacterCondition,
    ].filter(Boolean).length;

    return conditionsMet >= 2; // Doit respecter au moins deux conditions
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!validatePassword(password)) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, dont au moins une lettre, un chiffre et un caractère spécial."
      );
      setLoading(false);
      return;
    }

    // Simuler une requête API
    setTimeout(() => {
      setLoading(false);
      setSuccess("Administrateur créé avec succès");

      // Détruire tous les tokens
      Cookies.remove("token");
      Cookies.remove("role");

      // Rediriger vers la page de connexion
      navigate("/login"); // Remplacez "/login" par le chemin de votre page de connexion

      // Réinitialiser le formulaire
      setEmail("");
      setPassword("");
      setNomUser("");
      setPrenomUser("");
      setPhoneNumber("");
      setCountryCode("+33");
    }, 2000);
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Créer un Administrateur
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemple.com"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Mot de passe</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 pr-10"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                    clipRule="evenodd"
                  />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Cliquez sur l'icône pour afficher/masquer le mot de passe
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nom</label>
          <input
            type="text"
            value={nomUser}
            onChange={(e) => setNomUser(e.target.value)}
            placeholder="Timnou Tchuinte"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Prénom</label>
          <input
            type="text"
            value={prenomUser}
            onChange={(e) => setPrenomUser(e.target.value)}
            placeholder="Yvan Steeve"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Téléphone</label>
          <div className="flex">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="min-w-24 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white text-gray-700"
            >
              {countryCodes.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.code}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="612345678"
              required
              className="flex-grow px-4 py-2 border border-l-0 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Format attendu: Indicatif + Numéro sans le premier zéro
          </p>
        </div>

        {error && (
          <p className="text-red-500 mb-4 p-2 bg-red-50 border border-red-100 rounded">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-500 mb-4 p-2 bg-green-50 border border-green-100 rounded">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Création en cours...
            </>
          ) : (
            "Créer"
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateAdminForm;
