import React, { useState } from "react";
import Modal from "../components/Modal";

interface Setting {
  id: string;
  category: string;
  key: string;
  label: string;
  value: string | boolean;
  type: "text" | "email" | "number" | "boolean" | "select";
  options?: string[];
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Setting[]>([
    {
      id: "1",
      category: "Général",
      key: "schoolName",
      label: "Nom de l'établissement",
      value: "Lycée Excellence",
      type: "text",
    },
    {
      id: "2",
      category: "Général",
      key: "schoolEmail",
      label: "Email de l'établissement",
      value: "contact@lycee-exemple.fr",
      type: "email",
    },
    {
      id: "3",
      category: "Général",
      key: "maxStudents",
      label: "Nombre maximum d'élèves par classe",
      value: "30",
      type: "number",
    },
    {
      id: "4",
      category: "Notifications",
      key: "emailNotifications",
      label: "Notifications par email",
      value: true,
      type: "boolean",
    },
    {
      id: "5",
      category: "Notifications",
      key: "notificationFrequency",
      label: "Fréquence des notifications",
      value: "daily",
      type: "select",
      options: ["immediate", "daily", "weekly"],
    },
    {
      id: "6",
      category: "Sécurité",
      key: "sessionTimeout",
      label: "Délai d'expiration de session (minutes)",
      value: "60",
      type: "number",
    },
    {
      id: "7",
      category: "Sécurité",
      key: "passwordComplexity",
      label: "Exiger mot de passe complexe",
      value: true,
      type: "boolean",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    key: "",
    label: "",
    value: "",
    type: "text",
    options: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSetting: Setting = {
      id: (settings.length + 1).toString(),
      category: formData.category,
      key: formData.key,
      label: formData.label,
      value:
        formData.type === "boolean"
          ? formData.value === "true"
          : formData.value,
      type: formData.type as "text" | "email" | "number" | "boolean" | "select",
      options: formData.options
        ? formData.options.split(",").map((opt) => opt.trim())
        : undefined,
    };
    setSettings([...settings, newSetting]);
    setFormData({
      category: "",
      key: "",
      label: "",
      value: "",
      type: "text",
      options: "",
    });
    setShowAddForm(false);
  };

  const handleSettingChange = (
    settingId: string,
    newValue: string | boolean
  ) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === settingId ? { ...setting, value: newValue } : setting
      )
    );
  };

  const categories = [
    "Général",
    "Notifications",
    "Sécurité",
    "Académique",
    "Système",
  ];
  const types = [
    { value: "text", label: "Texte" },
    { value: "email", label: "Email" },
    { value: "number", label: "Nombre" },
    { value: "boolean", label: "Booléen" },
    { value: "select", label: "Sélection" },
  ];

  const groupedSettings = settings.reduce(
    (acc, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = [];
      }
      acc[setting.category].push(setting);
      return acc;
    },
    {} as Record<string, Setting[]>
  );

  const renderSettingInput = (setting: Setting) => {
    switch (setting.type) {
      case "boolean":
        return (
          <input
            type="checkbox"
            checked={setting.value as boolean}
            onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        );
      case "select":
        return (
          <select
            value={setting.value as string}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {setting.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case "number":
        return (
          <input
            type="number"
            value={setting.value as string}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      case "email":
        return (
          <input
            type="email"
            value={setting.value as string}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
      default:
        return (
          <input
            type="text"
            value={setting.value as string}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Paramètres du Système
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ajouter un paramètre
        </button>
      </div>

      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Ajouter un nouveau paramètre"
      >
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clé
            </label>
            <input
              type="text"
              name="key"
              value={formData.key}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: schoolName"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Libellé
            </label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Nom de l'établissement"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un type</option>
              {types.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valeur
            </label>
            <input
              type="text"
              name="value"
              value={formData.value}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Valeur du paramètre"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Options (pour type sélection)
            </label>
            <input
              type="text"
              name="options"
              value={formData.options}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="option1, option2, option3"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Ajouter le paramètre
            </button>
          </div>
        </form>
      </Modal>

      <div className="space-y-6">
        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <div
            key={category}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {category}
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {categorySettings.map((setting) => (
                  <div
                    key={setting.id}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                  >
                    <div className="md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700">
                        {setting.label}
                      </label>
                    </div>
                    <div className="md:col-span-2">
                      {renderSettingInput(setting)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors">
          Sauvegarder tous les paramètres
        </button>
      </div>
    </div>
  );
};

export default Settings;
