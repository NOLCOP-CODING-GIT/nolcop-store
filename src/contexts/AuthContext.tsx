import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";
import { supabase } from "../supabaseClient";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password?: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    password?: string,
    name?: string,
    address?: string,
    phone?: string,
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (
    updates: Partial<User>,
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Charger la session à l'initialisation
  useEffect(() => {
    const loadSession = async () => {
      // 1. Vérifier si un utilisateur admin est connecté via Supabase Auth
      const {
        data: { session },
        error: _authError,
      } = await supabase.auth.getSession();

      if (session?.user) {
        // C'est un admin ou un utilisateur géré par Supabase Auth
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setUser({
            ...profile,
            createdAt: profile.created_at,
            updatedAt: profile.updated_at,
          } as User);
        }
      } else {
        // 2. Sinon, vérifier si un utilisateur simple est connecté via notre token local sécurisé
        const userId = sessionStorage.getItem("nolcop_session");
        if (userId) {
          const { data: profile } = await supabase
            .from("users")
            .select("*")
            .eq("id", userId)
            .single();

          if (profile) {
            setUser({
              ...profile,
              createdAt: profile.created_at,
              updatedAt: profile.updated_at,
            } as User);
          } else {
            sessionStorage.removeItem("nolcop_session");
          }
        }
      }
      setLoading(false);
    };

    loadSession();

    // Écouter les changements d'état de l'authentification native Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          const { data: profile } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profile) {
            setUser({
              ...profile,
              createdAt: profile.created_at,
              updatedAt: profile.updated_at,
            } as User);
          }
        } else if (event === "SIGNED_OUT") {
          if (!sessionStorage.getItem("nolcop_session")) {
            setUser(null);
          }
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password?: string) => {
    setLoading(true);
    try {
      if (!password) {
        return { success: false, error: "Mot de passe requis" };
      }

      // 🚀 MODIFICATION : On teste d'abord la connexion native Supabase Auth (Admin)
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      // Si la connexion native fonctionne, on s'arrête là, c'est un Admin !
      if (!authError && authData?.user) {
        return { success: true };
      }

      // Si la connexion native échoue, on tente la méthode locale (Utilisateur simple)
      const { data, error: rpcError } = await supabase.rpc("login_user", {
        p_email: email,
        p_password: password,
      });

      if (!rpcError && data) {
        const userData = data as any;
        setUser({
          ...userData,
          createdAt: userData.created_at,
          updatedAt: userData.updated_at,
        } as User);

        sessionStorage.setItem("nolcop_session", userData.id);
        return { success: true };
      }

      // Si les deux ont échoué
      return {
        success: false,
        error: "Email ou mot de passe incorrect",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Une erreur est survenue lors de la connexion",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password?: string,
    name?: string,
    address?: string,
    phone?: string,
  ) => {
    setLoading(true);
    try {
      if (!password || !name) {
        return { success: false, error: "Nom et mot de passe requis" };
      }

      // Inscription via RPC pour les utilisateurs simples (sans Supabase Auth)
      const { data, error } = await supabase.rpc("register_user", {
        p_email: email,
        p_password: password,
        p_name: name,
        p_telephone: phone || null,
      });

      if (error) {
        return {
          success: false,
          error:
            error.message || "Une erreur est survenue lors de l'inscription",
        };
      }

      const userData = data as any;

      // Si une adresse est fournie, l'ajouter
      if (address && userData.id) {
        await supabase.from("addresses").insert({
          user_id: userData.id,
          street: address,
          city: "Ville à définir",
          country: "Bénin",
          is_default: true,
        });
      }

      // Connexion automatique après inscription
      setUser({
        ...userData,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
      } as User);

      sessionStorage.setItem("nolcop_session", userData.id);

      return { success: true, message: "Inscription réussie" };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Une erreur est survenue lors de l'inscription",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    // Déconnexion Admin
    await supabase.auth.signOut();

    // Déconnexion Utilisateur Simple
    sessionStorage.removeItem("nolcop_session");
    setUser(null);
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { success: false, error: "Utilisateur non connecté" };

    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: updates.name,
          telephone: updates.phone,
          // Convertir les autres champs si nécessaire
        })
        .eq("id", user.id);

      if (error) throw error;

      setUser((prev) => (prev ? { ...prev, ...updates } : null));
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || "Une erreur est survenue lors de la mise à jour",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
