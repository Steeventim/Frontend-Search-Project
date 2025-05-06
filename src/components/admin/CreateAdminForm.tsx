import React, { useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const CreateAdminForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nomUser, setNomUser] = useState("");
  const [prenomUser, setPrenomUser] = useState("");
  const [countryCode, setCountryCode] = useState("+237");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
    nomUser: "",
    prenomUser: "",
    phoneNumber: "",
  });
  const navigate = useNavigate();

  // Liste des indicatifs de pays avec drapeaux
  const countryCodes = [
    { code: "+237", flag: "🇨🇲", country: "Cameroun" },
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
    { code: "+243", flag: "🇨🇩", country: "RD Congo" },
  ];

  // Fonctions de validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) ? "" : "Veuillez entrer un email valide.";
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

    return conditionsMet >= 2
      ? ""
      : "Le mot de passe doit contenir au moins 8 caractères, dont au moins deux des éléments suivants : une lettre, un chiffre, un caractère spécial.";
  };

  const validateNomUser = (nom: string) => {
    return nom.trim().length >= 2
      ? ""
      : "Le nom doit contenir au moins 2 caractères.";
  };

  const validatePrenomUser = (prenom: string) => {
    return prenom.trim().length >= 2
      ? ""
      : "Le prénom doit contenir au moins 2 caractères.";
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{9,}$/;
    return phoneRegex.test(phone)
      ? ""
      : "Le numéro de téléphone doit contenir au moins 9 chiffres, sans espaces ni caractères spéciaux.";
  };

  // Validation en temps réel
  const handleInputChange = (
    field: keyof typeof validationErrors,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(value);
    let error = "";
    switch (field) {
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
        break;
      case "nomUser":
        error = validateNomUser(value);
        break;
      case "prenomUser":
        error = validatePrenomUser(value);
        break;
      case "phoneNumber":
        error = validatePhoneNumber(value);
        break;
    }
    setValidationErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Vérifier si le formulaire est valide
  const isFormValid = () => {
    return (
      email &&
      password &&
      nomUser &&
      prenomUser &&
      phoneNumber &&
      !validationErrors.email &&
      !validationErrors.password &&
      !validationErrors.nomUser &&
      !validationErrors.prenomUser &&
      !validationErrors.phoneNumber
    );
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation finale
    const errors = {
      email: validateEmail(email),
      password: validatePassword(password),
      nomUser: validateNomUser(nomUser),
      prenomUser: validatePrenomUser(prenomUser),
      phoneNumber: validatePhoneNumber(phoneNumber),
    };
    setValidationErrors(errors);

    if (Object.values(errors).some((err) => err)) {
      setError("Veuillez corriger les erreurs dans le formulaire.");
      setLoading(false);
      return;
    }

    // Concaténer le countryCode avec le numéro de téléphone
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    try {
      const response = await api.post("/init/admin", {
        email,
        password,
        nomUser,
        prenomUser,
        telephone: fullPhoneNumber,
      });

      if (response.status === 201) {
        setSuccess("Administrateur créé avec succès");
        Cookies.remove("token");
        Cookies.remove("role");
        navigate("/login");
        setEmail("");
        setPassword("");
        setNomUser("");
        setPrenomUser("");
        setPhoneNumber("");
        setCountryCode("+237");
      } else {
        setError(
          "Erreur lors de la création de l'administrateur. Veuillez réessayer."
        );
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message || "Une erreur est survenue.");
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const apiError = error as { response: { data: { message?: string } } };
        setError(apiError.response.data.message || "Une erreur est survenue.");
      } else {
        setError(
          "Erreur lors de la création de l'administrateur. Veuillez réessayer."
        );
      }
    } finally {
      setLoading(false);
    }
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
            onChange={(e) =>
              handleInputChange("email", e.target.value, setEmail)
            }
            placeholder="email@exemple.com"
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              validationErrors.email
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-600"
            }`}
          />
          {validationErrors.email && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.email}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Mot de passe</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) =>
                handleInputChange("password", e.target.value, setPassword)
              }
              placeholder="••••••••"
              required
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 pr-10 ${
                validationErrors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-600"
              }`}
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
          {validationErrors.password && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.password}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nom</label>
          <input
            type="text"
            value={nomUser}
            onChange={(e) =>
              handleInputChange("nomUser", e.target.value, setNomUser)
            }
            placeholder="Timnou Tchuinte"
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              validationErrors.nomUser
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-600"
            }`}
          />
          {validationErrors.nomUser && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.nomUser}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Prénom</label>
          <input
            type="text"
            value={prenomUser}
            onChange={(e) =>
              handleInputChange("prenomUser", e.target.value, setPrenomUser)
            }
            placeholder="Yvan Steeve"
            required
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              validationErrors.prenomUser
                ? "border-red-500 focus:ring-red-500"
                : "focus:ring-blue-600"
            }`}
          />
          {validationErrors.prenomUser && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.prenomUser}
            </p>
          )}
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
              onChange={(e) =>
                handleInputChange("phoneNumber", e.target.value, setPhoneNumber)
              }
              placeholder="612345678"
              required
              className={`flex-grow px-4 py-2 border border-l-0 rounded-r-lg focus:outline-none focus:ring-2 ${
                validationErrors.phoneNumber
                  ? "border-red-500 focus:ring-red-500"
                  : "focus:ring-blue-600"
              }`}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Format attendu: Indicatif + Numéro sans le premier zéro
          </p>
          {validationErrors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">
              {validationErrors.phoneNumber}
            </p>
          )}
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
          disabled={loading || !isFormValid()}
          className={`w-full py-2 rounded-lg transition-all duration-300 flex items-center justify-center ${
            loading || !isFormValid()
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
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
