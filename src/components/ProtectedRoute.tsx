import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  requireAdmin?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireAdmin = false,
  redirectTo = "/login",
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Afficher le chargement pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blanc">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bleu-saphir mx-auto mb-4"></div>
          <p className="text-gris-canon-de-fusil/60 text-xs font-bold">
            Vérification de l'authentification...
          </p>
        </div>
      </div>
    );
  }

  // Rediriger si non connecté
  if (!user) {
    return (
      <Navigate
        to={redirectTo}
        state={{
          from: location.pathname,
          message: "Vous devez être connecté pour accéder à cette page.",
          type: "warning",
        }}
        replace
      />
    );
  }

  // Vérifier les permissions administrateur
  if (requireAdmin && user.role !== "admin") {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          requiredRole: "admin",
          currentRole: user.role,
          from: location.pathname,
        }}
        replace
      />
    );
  }

  // Vérifier si le compte est actif (optionnel)
  if (user.email && !user.email.includes("@")) {
    return (
      <Navigate
        to="/login"
        state={{
          message: "Votre compte semble invalide. Veuillez vous reconnecter.",
          type: "error",
        }}
        replace
      />
    );
  }

  // Remplacement crucial : Utilisation de <Outlet /> à la place de {children}
  // pour que React Router sache où injecter tes composants Profile, Orders ou Admin
  return <Outlet />;
};

export default ProtectedRoute;
