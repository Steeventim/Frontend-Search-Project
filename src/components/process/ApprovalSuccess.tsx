import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../common/Button";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";

export const ApprovalSuccess: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-full bg-green-50 p-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Processus terminé</h1>
        <p className="text-gray-600 mb-6">
          Le workflow est maintenant terminé et le document a été vérifié et approuvé.
        </p>
        <div className="flex justify-center space-x-3">
          <Button variant="primary" onClick={() => navigate(ROUTES.USER.DASHBOARD)}>
            Retour au tableau de bord
          </Button>
          <Button variant="secondary" onClick={() => navigate(ROUTES.SEARCH.INTERFACE)}>
            Rechercher dans les documents
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApprovalSuccess;
