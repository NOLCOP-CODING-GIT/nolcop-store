import React, { createContext, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<{ success: boolean; error?: string }>;
  register: (
    email: string,
    _password: string,
    name: string,
    address?: string
  ) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;
  updateProfile: (
    updates: Partial<User>
  ) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export { AuthContext };

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string) => {
    setLoading(true);
    try {
      // Simulation d'une connexion - à remplacer par votre logique
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock user pour démonstration
      const mockUser: User = {
        id: "1",
        email,
        name: "Utilisateur Test",
        role: "user",
        avatar: "",
        addresses: [],
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      return { success: true };
    } catch {
      return {
        success: false,
        error: "Une erreur est survenue lors de la connexion",
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    _password: string,
    name: string,
    address?: string
  ) => {
    setLoading(true);
    try {
      // Simulation d'une inscription - à remplacer par votre logique
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role: "user",
        avatar: "",
        addresses: address
          ? [
              {
                id: Date.now().toString(),
                street: address,
                city: "Ville par défaut",
                state: "État par défaut",
                zipCode: "00000",
                country: "France",
                isDefault: true,
              },
            ]
          : [],
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      return { success: true };
    } catch {
      return {
        success: false,
        error: "Une erreur est survenue lors de l'inscription",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return { success: false, error: "Utilisateur non connecté" };

    try {
      // Simulation d'une mise à jour - à remplacer par votre logique
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUser((prev) => (prev ? { ...prev, ...updates } : null));
      return { success: true };
    } catch {
      return {
        success: false,
        error: "Une erreur est survenue lors de la mise à jour",
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
