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
    "success"
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
      }))
    );
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Vous devez être connecté
          </h1>
          <button
            onClick={() => navigate("/login")}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="mt-2 text-gray-600">
            Gérez vos informations personnelles et vos adresses
          </p>
        </div>

        {message && (
          <div
            className={`mb-6 rounded-md p-4 ${
              messageType === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            <div className="flex">
              {messageType === "success" ? (
                <Save className="h-5 w-5 mr-2" />
              ) : (
                <X className="h-5 w-5 mr-2" />
              )}
              <span>{message}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations personnelles */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Informations personnelles
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center text-indigo-600 hover:text-indigo-700"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Modifier
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center text-gray-600 hover:text-gray-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex items-center text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-1" />
                      )}
                      Enregistrer
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt="Avatar"
                          className="h-20 w-20 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1 rounded-full">
                        <Camera className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {formData.name}
                    </h3>
                    <p className="text-sm text-gray-500">{formData.email}</p>
                    <div className="flex items-center mt-1">
                      <Shield className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">
                        {user.role === "admin" ? "Administrateur" : "Membre"}
                      </span>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="space-y-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom complet
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL de l'avatar
                      </label>
                      <input
                        type="url"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleInputChange}
                        placeholder="https://exemple.com/avatar.jpg"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Adresses */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Mes adresses
                </h2>
                <button
                  onClick={() => setShowAddAddress(true)}
                  className="flex items-center text-indigo-600 hover:text-indigo-700"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter
                </button>
              </div>

              {showAddAddress && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
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
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Ville"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      placeholder="Région"
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
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
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
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
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={handleAddAddress}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Ajouter
                    </button>
                    <button
                      onClick={() => setShowAddAddress(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {addresses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Aucune adresse enregistrée</p>
                  </div>
                ) : (
                  addresses.map((address) => (
                    <div
                      key={address.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {address.street}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.zipCode} {address.city}, {address.state}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.country}
                            </p>
                            {address.isDefault && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                Adresse par défaut
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {!address.isDefault && (
                            <button
                              onClick={() =>
                                handleSetDefaultAddress(address.id)
                              }
                              className="text-indigo-600 hover:text-indigo-700 text-sm"
                            >
                              Définir par défaut
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-red-600 hover:text-red-700 text-sm"
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
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Statistiques
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Membre depuis</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Commandes</span>
                  <span className="text-sm font-medium text-gray-900">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Favoris</span>
                  <span className="text-sm font-medium text-gray-900">0</span>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Actions rapides
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <Calendar className="h-4 w-4 mr-2" />
                  Historique des commandes
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <User className="h-4 w-4 mr-2" />
                  Préférences
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
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
