import React from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../common/Button";

interface ErrorPageProps {
  error?: Error;
  resetError?: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ error, resetError }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
              <AlertTriangle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-gray-900" role="alert">
              Une erreur est survenue
            </h1>
            <p className="mt-3 text-gray-600 text-sm">
              {error?.message ||
                "Nous rencontrons actuellement des difficultés techniques. Nos équipes travaillent à résoudre le problème."}
            </p>

            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-md">
                <pre
                  className="text-xs text-red-700 overflow-auto"
                  aria-hidden={!error?.stack}
                >
                  {error.stack}
                </pre>
              </div>
            )}

            <div className="mt-8 space-y-3">
              {resetError && (
                <Button
                  variant="primary"
                  icon={RotateCcw}
                  onClick={resetError}
                  className="w-full"
                >
                  Réessayer
                </Button>
              )}

              <Button
                variant="secondary"
                icon={Home}
                onClick={() => navigate("/")}
                className="w-full"
              >
                Retour à l'accueil
              </Button>
            </div>

            <p className="mt-6 text-xs text-gray-500">
              Si le problème persiste, veuillez contacter le support technique
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
