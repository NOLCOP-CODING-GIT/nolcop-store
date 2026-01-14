import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAdmin = false,
  redirectTo = "/login",
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Afficher le chargement pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification de l'authentification...</p>
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

  return <>{children}</>;
};

export default ProtectedRoute;
