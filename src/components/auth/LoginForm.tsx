import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { Eye, EyeOff, Lock, Mail, User, Key, AlertCircle } from "lucide-react";
import { ROUTES } from "../../constants/routes";
import Cookies from "js-cookie";

const AuthForm = () => {
  // États
  const [formState, setFormState] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginStep, setLoginStep] = useState(1); // 1 = email, 2 = password
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Vérifier le support biométrique au chargement
  useEffect(() => {
    // Vérifier si l'utilisateur a déjà visité l'application
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setFormState((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

  // Gestionnaire de changement des champs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement;

    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormState((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Animation de transition entre les étapes
  const nextStep = useCallback(() => {
    if (formState.email.trim() === "") return;
    setLoginStep(2);
  }, [formState.email]); // Ajoutez les dépendances nécessaires

  // Retour à l'étape email
  const backToEmailStep = () => {
    setLoginStep(1);
    setError(null);
  };

  // Simuler l'authentification biométrique
  // const handleBiometricAuth = async () => {
  //   setShowBiometricPrompt(true);
  //   setLoading(true);

  //   // Simuler un délai pour l'authentification biométrique
  //   setTimeout(() => {
  //     setLoading(false);
  //     setShowBiometricPrompt(false);
  //     setAuthenticated(true);

  //     // Rediriger après une courte pause pour montrer l'animation de succès
  //     setTimeout(() => {
  //       navigate(ROUTES.USER.DASHBOARD);
  //     }, 1000);
  //   }, 2000);
  // };

  // Soumission du formulaire
  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (loginStep === 1) {
        nextStep();
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await api.post("/users/login", {
          Email: formState.email,
          Password: formState.password,
        });

        const { token, user } = response.data;
        Cookies.set("token", token, {
          expires: formState.rememberMe ? 7 : 3 / 24,
        });

        // Sauvegarder l'email si "se souvenir de moi" est activé
        if (formState.rememberMe) {
          localStorage.setItem("userEmail", formState.email);
        } else {
          localStorage.removeItem("userEmail");
        }

        if (!user.roles || user.roles.length === 0) {
          navigate(ROUTES.ERROR);
          return;
        }

        const userRole = user.roles[0].name;
        Cookies.set("roleName", userRole, {
          expires: formState.rememberMe ? 7 : 3 / 24,
        });

        // Vérifier les étapes associées au rôle
        const etapesResponse = await api.get(`/etapes/role/${userRole}`);
        const etapes = etapesResponse.data.data;

        // Vérifier si une étape a un sequenceNumber égal à 1
        const firstEtape = etapes.find(
          (etape: { sequenceNumber: number }) => etape.sequenceNumber === 1
        );

        // Animation de connexion réussie
        setAuthenticated(true);

        // Attendre un peu pour l'animation avant la redirection
        setTimeout(() => {
          if (userRole === "superadmin") {
            navigate(ROUTES.ADMIN.CREATE_ADMIN);
          } else if (userRole === "admin") {
            navigate(ROUTES.AUTH.SETUP);
          } else if (firstEtape) {
            // Rediriger vers la page de recherche
            navigate(ROUTES.SEARCH.INTERFACE);
          } else {
            navigate(ROUTES.USER.DASHBOARD);
          }
        }, 500);
      } catch (err) {
        setAuthenticated(false);
        if (axios.isAxiosError(err) && err.response) {
          switch (err.response.status) {
            case 400:
              setError("Requête invalide. Vérifiez vos informations.");
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
    [formState, loginStep, nextStep, navigate]
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-50 to-white">
      {/* Panneau de gauche avec animation */}
      <div className="lg:w-1/2 bg-gradient-to-r from-blue-700 to-indigo-600 p-8 hidden lg:flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute w-96 h-96 rounded-full bg-white/20 -top-20 -left-20 animate-pulse"
            style={{ animationDuration: "8s" }}
          ></div>
          <div
            className="absolute w-72 h-72 rounded-full bg-white/20 bottom-40 right-10 animate-pulse"
            style={{ animationDuration: "6s" }}
          ></div>
          <div
            className="absolute w-60 h-60 rounded-full bg-white/20 bottom-10 left-40 animate-pulse"
            style={{ animationDuration: "10s" }}
          ></div>
        </div>

        <div className="max-w-md mx-auto text-white relative z-10">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>

          <h2 className="text-4xl font-bold mb-4">
            Bienvenue sur notre plateforme
          </h2>
          <p className="text-lg mb-8 text-blue-100">
            Sécurisée et intuitive, notre solution vous permet de gérer
            efficacement vos processus métiers.
          </p>

          <div className="space-y-6 mt-12">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <Key className="w-5 h-5 text-white" />
              </div>
              <p className="text-blue-100">Authentification sécurisée</p>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <User className="w-5 h-5 text-white" />
              </div>
              <p className="text-blue-100">Gestion des rôles et permissions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Panneau de droite avec formulaire */}
      <div className="lg:w-1/2 flex flex-col justify-center p-8">
        <div className="max-w-md mx-auto w-full">
          {authenticated ? (
            <div className="text-center py-16 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Connexion réussie!
              </h2>
              <p className="text-gray-500">Redirection en cours...</p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold mb-2 text-gray-800">
                {loginStep === 1 ? "Bonjour 👋" : "Entrez votre mot de passe"}
              </h2>
              <p className="text-gray-500 mb-8">
                {loginStep === 1
                  ? "Connectez-vous pour accéder à votre espace"
                  : `Connexion avec ${formState.email}`}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {loginStep === 1 ? (
                  <div className="transition-all duration-500 transform">
                    <div className="mb-6">
                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          placeholder="votre@email.com"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center"
                    >
                      Continuer
                    </button>

                    {/* {supportsBiometric && (
                      <div className="mt-6 text-center">
                        <button
                          type="button"
                          onClick={handleBiometricAuth}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all duration-300 flex items-center justify-center mx-auto"
                        >
                          <svg
                            className="w-5 h-5 mr-2 text-gray-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                            ></path>
                          </svg>
                          Connexion biométrique
                        </button>
                      </div>
                    )} */}
                  </div>
                ) : (
                  <div className="transition-all duration-500 transform">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-gray-700 text-sm font-medium">
                          Mot de passe
                        </label>
                        <button
                          type="button"
                          onClick={backToEmailStep}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Changer d'email
                        </button>
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formState.password}
                          onChange={handleChange}
                          required
                          placeholder="••••••••"
                          className="w-full pl-10 pr-14 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center mb-6">
                      <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formState.rememberMe}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="rememberMe"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Se souvenir de moi
                      </label>
                      <a
                        href="#"
                        className="ml-auto text-sm text-blue-600 hover:text-blue-800"
                      >
                        Mot de passe oublié ?
                      </a>
                    </div>

                    {error && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                        <div className="flex items-center">
                          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                          <p className="text-red-700 text-sm">{error}</p>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center"
                    >
                      {loading ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white"
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
                      ) : (
                        "Se connecter"
                      )}
                    </button>
                  </div>
                )}

                {/* <div className="text-center mt-6">
                  <p className="text-sm text-gray-600">
                    Vous n'avez pas de compte ?{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Créer un compte
                    </a>
                  </p>
                </div> */}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
