import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  Edit,
  X,
  Save,
  Camera,
  LogOut,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth(); // Récupération de l'utilisateur et de la méthode logout
  const navigate = useNavigate();

  // États pour le formulaire de modification du profil
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [successMessage, setSuccessMessage] = useState(false);

  // Synchronisation des données utilisateur initiales
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({ name: user.name || "", email: user.email || "" });
    }
    setIsEditing(false);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Ta logique d'appel API ici
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 1. On active le message en passant l'état à true
      setSuccessMessage(true);

      // 2. On ferme le mode édition
      setIsEditing(false);

      // 3. On cache le message automatiquement après 3 secondes
      setTimeout(() => setSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Erreur de mise à jour", error);
    } finally {
      setLoading(false);
    }
  };

  // Gestion de la déconnexion logique vers /login
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blanc px-4">
        <div className="max-w-md w-full text-center space-y-6 bg-blanc border border-gris-canon-de-fusil/5 p-8 rounded-2xl shadow-xs">
          <div className="mx-auto w-16 h-16 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-gris-canon-de-fusil leading-tight">
              Connectez-vous pour voir votre profil
            </h2>
            <p className="text-xs sm:text-sm text-gris-canon-de-fusil/50 font-medium leading-relaxed">
              Vous devez être connecté pour accéder à votre profil.
            </p>
          </div>
          <Link
            to="/login"
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-bleu-saphir text-blanc rounded-xl text-xs font-bold hover:bg-bleu-saphir/90 shadow-sm transition-colors cursor-pointer"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-blanc relative">
      {successMessage && (
        <div className=" bg-vert-jungle mb-3 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>Profil mis à jour avec succès !</span>
        </div>
      )}
      {/* ---------------- CARD COMPOSANT PRINCIPAL ---------------- */}
      <div className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl p-5 sm:p-6 shadow-xs transition-all duration-300">
        {/* Header de la carte */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-gris-canon-de-fusil/5 mb-6">
          <div className="flex items-center space-x-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-bleu-saphir shrink-0" />
            <h2 className="text-base sm:text-lg font-black text-gris-canon-de-fusil tracking-tight">
              Informations personnelles
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center flex-1 sm:flex-none px-3 py-2 sm:py-1.5 bg-bleu-saphir/5 hover:bg-bleu-saphir/10 text-xs font-bold text-bleu-saphir rounded-xl transition-all cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                Modifier
              </button>
            ) : (
              <div className="flex items-center space-x-2 flex-1 sm:flex-none w-full sm:w-auto">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center justify-center flex-1 sm:flex-none px-3 py-2 sm:py-1.5 bg-gris-canon-de-fusil/5 hover:bg-gris-canon-de-fusil/10 text-xs font-bold text-gris-canon-de-fusil/60 hover:text-gris-canon-de-fusil rounded-xl transition-all cursor-pointer"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Annuler
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="flex items-center justify-center flex-1 sm:flex-none px-3 py-2 sm:py-1.5 bg-bleu-saphir text-blanc hover:bg-bleu-saphir/90 disabled:opacity-50 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-blanc border-t-transparent mr-1.5" />
                  ) : (
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  Enregistrer
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contenu principal de la carte */}
        <div className="space-y-6">
          {/* Section Identité / Profil Rapide */}
          <div className="flex items-center space-x-4 bg-gris-canon-de-fusil/2 p-4 rounded-xl border border-gris-canon-de-fusil/5">
            <div className="relative shrink-0 group">
              <div className="h-16 w-16 sm:h-20 sm:w-20 text-2xl font-black text-blanc rounded-2xl bg-linear-to-br from-orange-rougi to-orange-rougi/80 flex items-center justify-center border border-blanc shadow-sm overflow-hidden select-none">
                {formData.name ? formData.name.slice(0, 1).toUpperCase() : "?"}
              </div>
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-blanc opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="h-5 w-5" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-gris-canon-de-fusil leading-tight">
                {user.name}
              </h3>
              <p className="text-xs sm:text-sm text-gris-canon-de-fusil/50 font-semibold">
                {user.email}
              </p>
              <div className="pt-0.5">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    user.role === "admin"
                      ? "bg-bleu-saphir/10 text-bleu-saphir border border-bleu-saphir/10"
                      : "bg-gris-canon-de-fusil/5 text-gris-canon-de-fusil/60"
                  }`}
                >
                  <Shield className="h-3 w-3 mr-1 shrink-0" />
                  {user.role === "admin" ? "Administrateur" : "Membre"}
                </span>
              </div>
            </div>
          </div>

          {/* Formulaire / Affichage des champs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {/* Champ Nom */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase tracking-wider">
                Nom complet
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-blanc border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5 text-xs font-semibold text-gris-canon-de-fusil transition-all"
                  placeholder="Votre nom"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gris-canon-de-fusil/2 border border-transparent rounded-xl text-xs font-bold text-gris-canon-de-fusil/80">
                  {user.name || "Non renseigné"}
                </div>
              )}
            </div>

            {/* Champ Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase tracking-wider">
                Adresse email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 bg-blanc border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5 text-xs font-semibold text-gris-canon-de-fusil transition-all"
                  placeholder="votre@email.com"
                />
              ) : (
                <div className="w-full px-4 py-3 bg-gris-canon-de-fusil/2 border border-transparent rounded-xl text-xs font-bold text-gris-canon-de-fusil/80">
                  {user.email || "Non renseigné"}
                </div>
              )}
            </div>
          </div>

          {/* Section Déconnexion */}
          <div className="pt-6 border-t border-gris-canon-de-fusil/5 flex justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-xs font-bold bg-rouge-ecarlate text-blanc rounded-xl transition-all cursor-pointer"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
