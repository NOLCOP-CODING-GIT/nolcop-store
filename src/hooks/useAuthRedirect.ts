import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export const useAuthRedirect = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Ne rien faire pendant le chargement
    if (loading) return;

    // Si l'utilisateur est connecté, vérifier s'il doit rester sur la page actuelle
    if (user) {
      const publicRoutes = ["/login", "/register"];
      const currentPath = location.pathname;

      // Si l'utilisateur est sur une page d'authentification et est connecté,
      // le rediriger vers la page d'accueil ou une page appropriée
      if (publicRoutes.includes(currentPath)) {
        // Vérifier s'il vient de s'inscrire ou de se connecter
        const fromState = location.state as { from?: string };

        if (fromState?.from) {
          // S'il vient d'une autre page, le rediriger vers cette page
          navigate(fromState.from, { replace: true });
        } else {
          // Sinon, rediriger vers l'accueil
          navigate("/", { replace: true });
        }
      }
    }
  }, [user, loading, navigate, location]);
};
