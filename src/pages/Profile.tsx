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
  MapPin,
  Plus,
  Trash2,
  Check,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabaseClient";
import { useNotification } from "../hooks/useNotification";

interface Address {
  id: string;
  user_id: string;
  street: string;
  city: string;
  country: string;
  is_default: boolean;
}

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telephone: "",
  });
  const [profileErrors, setProfileErrors] = useState<{ [key: string]: string }>(
    {},
  );

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    street: "",
    city: "",
    country: "",
    is_default: false,
  });
  const [addressErrors, setAddressErrors] = useState<{ [key: string]: string }>(
    {},
  );

  useEffect(() => {
    if (user) {
      fetchAddresses();
      fetchUser();
    }
  }, [user]);

  const fetchAddresses = async () => {
    if (!user) return;
    setLoadingAddresses(true);
    try {
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setAddresses(data || []);
    } catch (error) {
      console.error("Erreur de chargement des adresses", error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const fetchUser = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          name: data.name || "",
          email: data.email || "",
          telephone: data.telephone || "",
        });
      }
    } catch (error) {
      console.error("Erreur de chargement des données utilisateur", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelEdit = () => {
    fetchUser();
    setProfileErrors({});
    setIsEditing(false);
  };

  const validateProfileForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Le nom complet est obligatoire.";
    }
    if (!formData.telephone.trim()) {
      errors.telephone = "Le numéro de téléphone est obligatoire.";
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    if (!validateProfileForm()) {
      showNotification(
        "Veuillez corriger les erreurs dans le formulaire.",
        "error",
      );
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          name: formData.name.trim(),
          telephone: formData.telephone.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setProfileErrors({});
      setIsEditing(false);
      fetchUser();
      showNotification("Profil mis à jour avec succès !", "success");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error);
      showNotification("Erreur lors de la mise à jour du profil.", "error");
    } finally {
      setLoading(false);
    }
  };

  const openAddAddressModal = () => {
    setEditingAddressId(null);
    setAddressErrors({});
    setAddressForm({
      street: "",
      city: "",
      country: "",
      is_default: addresses.length === 0,
    });
    setIsAddressModalOpen(true);
  };

  const openEditAddressModal = (address: Address) => {
    setEditingAddressId(address.id);
    setAddressErrors({});
    setAddressForm({
      street: address.street,
      city: address.city,
      country: address.country,
      is_default: address.is_default,
    });
    setIsAddressModalOpen(true);
  };

  const validateAddressForm = () => {
    const errors: { [key: string]: string } = {};

    if (!addressForm.street.trim()) {
      errors.street = "La rue / quartier est obligatoire.";
    }
    if (!addressForm.city.trim()) {
      errors.city = "La ville est obligatoire.";
    }
    if (!addressForm.country.trim()) {
      errors.country = "Le pays est obligatoire.";
    }

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!validateAddressForm()) {
      showNotification(
        "Veuillez remplir tous les champs de l'adresse.",
        "error",
      );
      return;
    }

    setLoadingAddresses(true);
    try {
      if (addressForm.is_default) {
        await supabase
          .from("addresses")
          .update({ is_default: false })
          .eq("user_id", user.id);
      }

      if (editingAddressId) {
        const { error } = await supabase
          .from("addresses")
          .update({
            street: addressForm.street.trim(),
            city: addressForm.city.trim(),
            country: addressForm.country.trim(),
            is_default: addressForm.is_default,
          })
          .eq("id", editingAddressId);

        if (error) throw error;
        showNotification("Adresse modifiée avec succès !", "success");
      } else {
        const { error } = await supabase.from("addresses").insert([
          {
            user_id: user.id,
            street: addressForm.street.trim(),
            city: addressForm.city.trim(),
            country: addressForm.country.trim(),
            is_default: addresses.length === 0 ? true : addressForm.is_default,
          },
        ]);

        if (error) throw error;
        showNotification("Adresse ajoutée avec succès !", "success");
      }

      setAddressForm({
        street: "",
        city: "",
        country: "",
        is_default: false,
      });
      setAddressErrors({});
      setIsAddressModalOpen(false);
      setEditingAddressId(null);
      fetchAddresses();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'adresse", error);
      showNotification(
        "Erreur lors de l'enregistrement de l'adresse.",
        "error",
      );
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (addresses.length <= 1) {
      showNotification("Vous devez conserver au moins une adresse.", "error");
      return;
    }
    try {
      const { error } = await supabase.from("addresses").delete().eq("id", id);
      if (error) throw error;
      setAddresses((prev) => prev.filter((addr) => addr.id !== id));
      showNotification("Adresse supprimée avec succès !", "error");
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
      showNotification("Erreur lors de la suppression de l'adresse.", "error");
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    if (!user) return;
    try {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", user.id);

      const { error } = await supabase
        .from("addresses")
        .update({ is_default: true })
        .eq("id", id);

      if (error) throw error;
      fetchAddresses();
      showNotification("Adresse définie comme principale !", "success");
    } catch (error) {
      console.error("Erreur de mise à jour par défaut", error);
      showNotification(
        "Erreur lors du changement d'adresse par défaut.",
        "error",
      );
    }
  };

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
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-blanc relative space-y-8">
      {/* ---------------- SECTION PROFIL ---------------- */}
      <div className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl p-5 sm:p-6 shadow-xs transition-all duration-300">
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

        <div className="space-y-6">
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
                {formData.name || user.name}
              </h3>
              <p className="text-xs sm:text-sm text-gris-canon-de-fusil/50 font-semibold">
                {formData.email || user.email}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase tracking-wider">
                Nom complet {isEditing && "*"}
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) => {
                      handleInputChange(e);
                      if (profileErrors.name)
                        setProfileErrors({ ...profileErrors, name: "" });
                    }}
                    className={`w-full px-4 py-2.5 bg-blanc border rounded-xl focus:outline-none text-xs font-semibold text-gris-canon-de-fusil transition-all ${
                      profileErrors.name
                        ? "border-rouge-ecarlate focus:border-rouge-ecarlate"
                        : "border-gris-canon-de-fusil/10 focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5"
                    }`}
                    placeholder="Votre nom"
                  />
                  {profileErrors.name && (
                    <p className="text-rouge-ecarlate text-[10px] font-bold mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {profileErrors.name}
                    </p>
                  )}
                </div>
              ) : (
                <div className="w-full px-4 py-3 bg-gris-canon-de-fusil/2 border border-transparent rounded-xl text-xs font-bold text-gris-canon-de-fusil/80">
                  {formData.name || "Non renseigné"}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase tracking-wider">
                Adresse email
              </label>
              <div className="w-full px-4 py-3 bg-gris-canon-de-fusil/2 border border-transparent rounded-xl text-xs font-bold text-gris-canon-de-fusil/80">
                {formData.email || "Non renseigné"}
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase tracking-wider">
                Téléphone {isEditing && "*"}
              </label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    name="telephone"
                    value={formData.telephone}
                    onChange={(e) => {
                      handleInputChange(e);
                      if (profileErrors.telephone)
                        setProfileErrors({ ...profileErrors, telephone: "" });
                    }}
                    className={`w-full px-4 py-2.5 bg-blanc border rounded-xl focus:outline-none text-xs font-semibold text-gris-canon-de-fusil transition-all ${
                      profileErrors.telephone
                        ? "border-rouge-ecarlate focus:border-rouge-ecarlate"
                        : "border-gris-canon-de-fusil/10 focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5"
                    }`}
                    placeholder="+229 01 02 03 04"
                  />
                  {profileErrors.telephone && (
                    <p className="text-rouge-ecarlate text-[10px] font-bold mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {profileErrors.telephone}
                    </p>
                  )}
                </div>
              ) : (
                <div className="w-full px-4 py-3 bg-gris-canon-de-fusil/2 border border-transparent rounded-xl text-xs font-bold text-gris-canon-de-fusil/80">
                  {formData.telephone || "Non renseigné"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- SECTION ADRESSES (MULTI-LOCATIONS) ---------------- */}
      <div className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl p-5 sm:p-6 shadow-xs transition-all duration-300">
        <div className="flex items-center justify-between pb-5 border-b border-gris-canon-de-fusil/5 mb-6">
          <div className="flex items-center space-x-2.5">
            <MapPin className="h-5 w-5 text-bleu-saphir" />
            <h2 className="text-base sm:text-lg font-black text-gris-canon-de-fusil tracking-tight">
              Mes Adresses
            </h2>
          </div>
          <button
            onClick={openAddAddressModal}
            className="flex items-center justify-center px-3 py-2 bg-bleu-saphir text-blanc text-xs font-bold rounded-xl transition-all cursor-pointer hover:bg-bleu-saphir/90"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Ajouter
          </button>
        </div>

        {/* Liste des adresses */}
        {loadingAddresses ? (
          <p className="text-xs font-medium text-gris-canon-de-fusil/50">
            Chargement des adresses...
          </p>
        ) : addresses.length === 0 ? (
          <p className="text-xs font-medium text-gris-canon-de-fusil/50">
            Aucune adresse enregistrée pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                  address.is_default
                    ? "border-bleu-saphir bg-bleu-saphir/2"
                    : "border-gris-canon-de-fusil/10 bg-blanc"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gris-canon-de-fusil">
                      {address.street}
                    </span>
                    {address.is_default && (
                      <span className="px-2 py-0.5 text-[10px] bg-bleu-saphir/10 text-bleu-saphir font-bold rounded-md">
                        Par défaut
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gris-canon-de-fusil/60 font-medium">
                    {address.city}, {address.country}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gris-canon-de-fusil/5">
                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefaultAddress(address.id)}
                      className="text-[11px] font-bold text-bleu-saphir flex items-center hover:underline cursor-pointer"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      Définir par défaut
                    </button>
                  )}
                  <div className="flex items-center space-x-2 ml-auto">
                    <button
                      onClick={() => openEditAddressModal(address)}
                      className="text-bleu-saphir hover:bg-bleu-saphir/5 p-1 rounded-lg transition-colors cursor-pointer"
                      title="Modifier l'adresse"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    {addresses.length > 1 && (
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="text-rouge-ecarlate hover:bg-rouge-ecarlate/5 p-1 rounded-lg transition-colors cursor-pointer"
                        title="Supprimer l'adresse"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section Déconnexion */}
        <div className="pt-6 mt-8 border-t border-gris-canon-de-fusil/5 flex justify-end">
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-xs font-bold bg-rouge-ecarlate text-blanc rounded-xl transition-all cursor-pointer hover:opacity-90"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Se déconnecter
          </button>
        </div>
      </div>

      {/* MODAL AJOUT / MODIFICATION D'ADRESSE */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-blanc rounded-2xl p-6 w-full max-w-md border border-gris-canon-de-fusil/10 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gris-canon-de-fusil/5">
              <h3 className="text-base font-black text-gris-canon-de-fusil">
                {editingAddressId
                  ? "Modifier l'adresse"
                  : "Ajouter une adresse"}
              </h3>
              <button
                onClick={() => {
                  setIsAddressModalOpen(false);
                  setEditingAddressId(null);
                  setAddressErrors({});
                }}
                className="p-1 rounded-lg hover:bg-gris-canon-de-fusil/5 text-gris-canon-de-fusil/60 hover:text-gris-canon-de-fusil transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gris-canon-de-fusil/60 uppercase">
                  Rue / Quartier *
                </label>
                <input
                  type="text"
                  value={addressForm.street}
                  onChange={(e) => {
                    setAddressForm({ ...addressForm, street: e.target.value });
                    if (addressErrors.street)
                      setAddressErrors({ ...addressErrors, street: "" });
                  }}
                  placeholder="Ex: Cadjehoun, Rue 12"
                  className={`w-full px-3 py-2 bg-blanc border rounded-xl text-xs font-semibold focus:outline-none transition-colors ${
                    addressErrors.street
                      ? "border-rouge-ecarlate focus:border-rouge-ecarlate"
                      : "border-gris-canon-de-fusil/10 focus:border-bleu-saphir"
                  }`}
                />
                {addressErrors.street && (
                  <p className="text-rouge-ecarlate text-[10px] font-bold mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {addressErrors.street}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gris-canon-de-fusil/60 uppercase">
                    Ville *
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, city: e.target.value });
                      if (addressErrors.city)
                        setAddressErrors({ ...addressErrors, city: "" });
                    }}
                    placeholder="Ex: Cotonou"
                    className={`w-full px-3 py-2 bg-blanc border rounded-xl text-xs font-semibold focus:outline-none transition-colors ${
                      addressErrors.city
                        ? "border-rouge-ecarlate focus:border-rouge-ecarlate"
                        : "border-gris-canon-de-fusil/10 focus:border-bleu-saphir"
                    }`}
                  />
                  {addressErrors.city && (
                    <p className="text-rouge-ecarlate text-[10px] font-bold mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {addressErrors.city}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gris-canon-de-fusil/60 uppercase">
                    Pays *
                  </label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(e) => {
                      setAddressForm({
                        ...addressForm,
                        country: e.target.value,
                      });
                      if (addressErrors.country)
                        setAddressErrors({ ...addressErrors, country: "" });
                    }}
                    placeholder="Ex: Bénin"
                    className={`w-full px-3 py-2 bg-blanc border rounded-xl text-xs font-semibold focus:outline-none transition-colors ${
                      addressErrors.country
                        ? "border-rouge-ecarlate focus:border-rouge-ecarlate"
                        : "border-gris-canon-de-fusil/10 focus:border-bleu-saphir"
                    }`}
                  />
                  {addressErrors.country && (
                    <p className="text-rouge-ecarlate text-[10px] font-bold mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {addressErrors.country}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="modal_is_default"
                  checked={addressForm.is_default}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      is_default: e.target.checked,
                    })
                  }
                  className="rounded text-bleu-saphir focus:ring-bleu-saphir"
                />
                <label
                  htmlFor="modal_is_default"
                  className="text-xs font-semibold text-gris-canon-de-fusil/70 cursor-pointer"
                >
                  Définir comme adresse principale
                </label>
              </div>

              <div className="flex justify-end items-center space-x-2 pt-4 border-t border-gris-canon-de-fusil/5">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddressModalOpen(false);
                    setEditingAddressId(null);
                    setAddressErrors({});
                  }}
                  className="px-4 py-2 bg-gris-canon-de-fusil/5 hover:bg-gris-canon-de-fusil/10 text-gris-canon-de-fusil/70 text-xs font-bold rounded-xl cursor-pointer transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loadingAddresses}
                  className="px-4 py-2 bg-bleu-saphir text-blanc text-xs font-bold rounded-xl cursor-pointer hover:bg-bleu-saphir/90 transition-all shadow-xs"
                >
                  {loadingAddresses ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
