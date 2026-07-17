import { createClient } from "@supabase/supabase-js";

// Récupération des clés d'accès depuis tes variables d'environnement (.env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Sécurité : Vérification que les variables d'environnement sont bien configurées
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Erreur : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY doivent être définies dans votre fichier .env",
  );
}

// Initialisation et exportation du client global Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
