import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, AlertTriangle, Home } from "lucide-react";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-blanc px-4 py-8">
      <div className="max-w-md w-full text-center">
        <div className="p-6 sm:p-8">
          {/* Shield Icon */}
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-rose-500/5 border border-rose-500/10 mb-6 text-rose-600">
            <Shield className="h-8 w-8" />
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-black text-gris-canon-de-fusil mb-2 leading-tight">
            Accès refusé
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-gris-canon-de-fusil/50 font-medium mb-6 leading-relaxed">
            Vous n'avez pas les permissions nécessaires pour accéder à cette
            page.
          </p>

          <div className="space-y-6">
            {/* Alert Box */}
            <div className="bg-rose-500/[0.02] border border-rose-500/10 rounded-2xl p-4">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mr-3 mt-0.5" />
                <div className="text-left">
                  <h3 className="text-xs font-black uppercase tracking-wider text-rose-800 mb-1.5">
                    Permissions requises
                  </h3>
                  <ul className="text-xs text-rose-700/80 font-semibold space-y-1">
                    <li className="flex items-center gap-1.5">
                      <span className="h-1 w-1 bg-rose-500 rounded-full" />
                      Être administrateur
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="h-1 w-1 bg-rose-500 rounded-full" />
                      Avoir un compte actif
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.history.back()}
                className="flex-1 flex items-center justify-center px-4 py-2.5 border border-gris-canon-de-fusil/10 rounded-xl text-xs font-bold text-gris-canon-de-fusil/80 hover:bg-gris-canon-de-fusil/5 transition-all cursor-pointer"
              >
                Retour
              </button>

              <button
                onClick={() => navigate("/")}
                className="flex-1 flex items-center justify-center px-4 py-2.5 bg-bleu-saphir text-blanc rounded-xl text-xs font-bold hover:bg-bleu-saphir/90 transition-all shadow-xs cursor-pointer"
              >
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </button>
            </div>
          </div>

          {/* Footer info */}
          <div className="mt-6 pt-6 border-t border-gris-canon-de-fusil/5">
            <p className="text-[11px] text-gris-canon-de-fusil/45 font-medium leading-relaxed">
              Si vous pensez qu'il s'agit d'une erreur, veuillez contacter
              l'administrateur de la plateforme.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
