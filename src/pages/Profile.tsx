import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Calendar,
  Edit,
  Save,
  X,
  Plus,
  Camera,
  Shield,
  LogOut,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Profile: React.FC = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });

  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    isDefault: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage("");

    const result = await updateProfile(formData);

    if (result.success) {
      setMessage("Profil mis à jour avec succès");
      setMessageType("success");
      setIsEditing(false);
    } else {
      setMessage(result.error || "Une erreur est survenue");
      setMessageType("error");
    }

    setLoading(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCancelEdit = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || "",
    });
    setIsEditing(false);
  };

  const handleAddAddress = () => {
    const updatedAddresses = [
      ...addresses,
      { ...newAddress, id: Date.now().toString() },
    ];
    setAddresses(updatedAddresses);
    setNewAddress({
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      isDefault: false,
    });
    setShowAddAddress(false);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    );
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blanc px-4">
        <div className="max-w-md w-full text-center space-y-6 bg-blanc border border-gris-canon-de-fusil/5 p-8 rounded-2xl shadow-xs">
          {/* Icône décorative optionnelle en arrière-plan discret */}
          <div className="mx-auto w-16 h-16 bg-bleu-saphir/5 rounded-2xl flex items-center justify-center text-bleu-saphir">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-gris-canon-de-fusil leading-tight">
              Connexion requise
            </h1>
            <p className="text-xs sm:text-sm text-gris-canon-de-fusil/50 leading-relaxed">
              Vous devez être connecté pour accéder à cet espace de votre
              plateforme.
            </p>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-bleu-saphir text-blanc rounded-xl text-xs font-bold hover:bg-bleu-saphir/90 shadow-sm transition-colors cursor-pointer"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gris-canon-de-fusilpy-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gris-canon-de-fusil leading-tight">
            Mon Profil
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-gris-canon-de-fusil/50 font-medium">
            Gérez vos informations personnelles et vos adresses de livraison
          </p>
        </div>

        {/* Notifications / Messages */}
        {message && (
          <div
            className={`mb-6 rounded-xl p-4 border transition-all text-xs sm:text-sm font-semibold ${
              messageType === "success"
                ? "bg-emerald-50/50 border-emerald-500/10 text-emerald-800"
                : "bg-rose-50/50 border-rose-500/10 text-rose-800"
            }`}
          >
            <div className="flex items-center">
              {messageType === "success" ? (
                <Save className="h-4 w-4 mr-2.5 shrink-0" />
              ) : (
                <X className="h-4 w-4 mr-2.5 shrink-0" />
              )}
              <span>{message}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations personnelles */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base sm:text-lg font-black text-gris-canon-de-fusil">
                  Informations personnelles
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-xs font-bold text-bleu-saphir hover:text-bleu-saphir/80 transition-colors cursor-pointer"
                  >
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    Modifier
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center text-xs font-bold text-gris-canon-de-fusil/50 hover:text-gris-canon-de-fusil/80 transition-colors cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5 mr-1.5" />
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex items-center text-xs font-bold text-bleu-saphir hover:text-bleu-saphir/80 disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-bleu-saphir mr-1.5"></div>
                      ) : (
                        <Save className="h-3.5 w-3.5 mr-1.5" />
                      )}
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {/* Profil Identité */}
                <div className="flex items-center space-x-4">
                  <div className="relative shrink-0">
                    <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-gris-canon-de-fusil/5 flex items-center justify-center border border-gris-canon-de-fusil/5 overflow-hidden">
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt="Avatar"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 sm:h-8 sm:w-8 text-gris-canon-de-fusil/40" />
                      )}
                    </div>
                    {isEditing && (
                      <button className="absolute -bottom-1 -right-1 bg-bleu-saphir text-blanc p-1.5 rounded-lg shadow-sm hover:bg-bleu-saphir/90 transition-all cursor-pointer border-2 border-blanc">
                        <Camera className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-gris-canon-de-fusil">
                      {formData.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gris-canon-de-fusil/50 font-medium">
                      {formData.email}
                    </p>
                    <div className="flex items-center mt-1.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          user.role === "admin"
                            ? "bg-bleu-saphir/5 text-bleu-saphir"
                            : "bg-gris-canon-de-fusil/5 text-gris-canon-de-fusil/60"
                        }`}
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        {user.role === "admin" ? "Administrateur" : "Membre"}
                      </span>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="space-y-4 pt-6 border-t border-gris-canon-de-fusil/5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gris-canon-de-fusil/70 mb-1.5">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-blanc border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5 text-xs font-semibold text-gris-canon-de-fusil transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gris-canon-de-fusil/70 mb-1.5">
                          Adresse email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2.5 bg-blanc border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5 text-xs font-semibold text-gris-canon-de-fusil transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gris-canon-de-fusil/70 mb-1.5">
                        URL de l'avatar
                      </label>
                      <input
                        type="url"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleInputChange}
                        placeholder="https://exemple.com/avatar.jpg"
                        className="w-full px-4 py-2.5 bg-blanc border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5 text-xs font-semibold text-gris-canon-de-fusil placeholder-gris-canon-de-fusil/30 transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Adresses */}
            <div className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl p-6 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base sm:text-lg font-black text-gris-canon-de-fusil">
                  Mes adresses
                </h2>
                <button
                  onClick={() => setShowAddAddress(true)}
                  className="flex items-center text-xs font-bold text-bleu-saphir hover:text-bleu-saphir/80 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Ajouter
                </button>
              </div>

              {showAddAddress && (
                <div className="mb-6 p-4 sm:p-5 border border-gris-canon-de-fusil/10 rounded-2xl bg-gris-canon-de-fusil/10 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gris-canon-de-fusil/60">
                    Nouvelle adresse
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Rue"
                      value={newAddress.street}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, street: e.target.value })
                      }
                      className="px-4 py-2.5 bg-blanc border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5 text-xs font-semibold text-gris-canon-de-fusil transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Ville"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      className="px-4 py-2.5 bg-blanc border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5 text-xs font-semibold text-gris-canon-de-fusil transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Région / État"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                      className="px-4 py-2.5 bg-blanc border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5 text-xs font-semibold text-gris-canon-de-fusil transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Code postal"
                      value={newAddress.zipCode}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          zipCode: e.target.value,
                        })
                      }
                      className="px-4 py-2.5 bg-blanc border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5 text-xs font-semibold text-gris-canon-de-fusil transition-all"
                    />
                    <div className="md:col-span-2">
                      <input
                        type="text"
                        placeholder="Pays"
                        value={newAddress.country}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            country: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 bg-blanc border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5 text-xs font-semibold text-gris-canon-de-fusil transition-all"
                      />
                    </div>
                  </div>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={handleAddAddress}
                      className="px-4 py-2.5 bg-bleu-saphir text-blanc rounded-xl text-xs font-bold hover:bg-bleu-saphir/90 transition-colors shadow-xs cursor-pointer"
                    >
                      Ajouter l'adresse
                    </button>
                    <button
                      onClick={() => setShowAddAddress(false)}
                      className="px-4 py-2.5 border border-gris-canon-de-fusil/10 text-gris-canon-de-fusil/60 rounded-xl text-xs font-bold hover:bg-gris-canon-de-fusil/5 transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-10 bg-gris-canon-de-fusil/10 border border-dashed border-gris-canon-de-fusil/10 rounded-2xl">
                    <MapPin className="h-10 w-10 mx-auto mb-2 text-gris-canon-de-fusil/20" />
                    <p className="text-xs font-bold text-gris-canon-de-fusil/40">
                      Aucune adresse enregistrée
                    </p>
                  </div>
                ) : (
                  addresses.map((address) => (
                    <div
                      key={address.id}
                      className="border border-gris-canon-de-fusil/5 rounded-2xl p-4 sm:p-5 hover:border-gris-canon-de-fusil/10 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-gris-canon-de-fusil/30 mt-0.5 shrink-0" />
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-gris-canon-de-fusil">
                              {address.street}
                            </p>
                            <p className="text-xs text-gris-canon-de-fusil/60 font-medium">
                              {address.zipCode} {address.city}, {address.state}
                            </p>
                            <p className="text-xs text-gris-canon-de-fusil/60 font-medium">
                              {address.country}
                            </p>
                            {address.isDefault && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/5 text-emerald-700 border border-emerald-500/10 mt-1">
                                Adresse par défaut
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 self-end sm:self-start">
                          {!address.isDefault && (
                            <button
                              onClick={() =>
                                handleSetDefaultAddress(address.id)
                              }
                              className="text-bleu-saphir hover:text-bleu-saphir/80 text-xs font-bold transition-colors cursor-pointer"
                            >
                              Par défaut
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-rose-600 hover:text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Statistiques */}
            <div className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-black uppercase tracking-wider text-gris-canon-de-fusil/60 mb-5">
                Statistiques
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gris-canon-de-fusil/5">
                  <span className="text-xs text-gris-canon-de-fusil/50 font-semibold">
                    Membre depuis
                  </span>
                  <span className="text-xs font-bold text-gris-canon-de-fusil">
                    {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-gris-canon-de-fusil/5">
                  <span className="text-xs text-gris-canon-de-fusil/50 font-semibold">
                    Commandes
                  </span>
                  <span className="text-xs font-bold text-gris-canon-de-fusil">
                    0
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gris-canon-de-fusil/50 font-semibold">
                    Favoris
                  </span>
                  <span className="text-xs font-bold text-gris-canon-de-fusil">
                    0
                  </span>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl p-6 shadow-xs">
              <h3 className="text-sm font-black uppercase tracking-wider text-gris-canon-de-fusil/60 mb-5">
                Actions rapides
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2.5 border border-gris-canon-de-fusil/10 rounded-xl text-xs font-bold text-gris-canon-de-fusil/80 hover:bg-gris-canon-de-fusil/5 transition-all cursor-pointer">
                  <Calendar className="h-4 w-4 mr-2 text-gris-canon-de-fusil/40" />
                  Historique des commandes
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2.5 border border-gris-canon-de-fusil/10 rounded-xl text-xs font-bold text-gris-canon-de-fusil/80 hover:bg-gris-canon-de-fusil/5 transition-all cursor-pointer">
                  <User className="h-4 w-4 mr-2 text-gris-canon-de-fusil/40" />
                  Préférences
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-2.5 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 bg-rose-500/5 hover:bg-rose-500/10 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2 text-rose-500/80" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
