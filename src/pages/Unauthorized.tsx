import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, AlertTriangle, Home } from "lucide-react";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100 mb-6">
            <Shield className="h-8 w-8 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Accès refusé
          </h1>

          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette
            page.
          </p>

          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                <div className="text-left">
                  <h3 className="text-sm font-medium text-red-800 mb-1">
                    Permissions requises
                  </h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Être administrateur</li>
                    <li>• Avoir un compte actif</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.history.back()}
                className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Retour
              </button>

              <button
                onClick={() => navigate("/")}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Si vous pensez qu'il s'agit d'une erreur, contactez
              l'administrateur du site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
