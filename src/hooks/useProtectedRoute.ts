import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

export const useProtectedRoute = (requireAdmin = false) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      navigate("/login", {
        state: { from: location.pathname },
        replace: true,
      });
      return;
    }

    if (requireAdmin && user.role !== "admin") {
      navigate("/unauthorized", { replace: true });
      return;
    }
  }, [user, loading, navigate, location, requireAdmin]);

  return {
    user,
    loading,
    isAuthorized:
      !loading && !!user && (!requireAdmin || user.role === "admin"),
  };
};
