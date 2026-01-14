import React, { useState } from "react";
import ResponsiveTable from "../components/ResponsiveTable";
import ResponsiveTableRow, {
  ResponsiveTableCell,
} from "../components/ResponsiveTableRow";
import { Edit, Trash2 } from "lucide-react";

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  phone: string;
  hireDate: string;
  status: "active" | "inactive";
}

const Teachers: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: "1",
      firstName: "Jean",
      lastName: "Dubois",
      email: "jean.dubois@email.com",
      subject: "Mathématiques",
      phone: "0123456789",
      hireDate: "2020-09-01",
      status: "active",
    },
    {
      id: "2",
      firstName: "Marie",
      lastName: "Leroy",
      email: "marie.leroy@email.com",
      subject: "Français",
      phone: "0234567890",
      hireDate: "2019-09-01",
      status: "active",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    phone: "",
    hireDate: "",
    address: "",
    salary: "",
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
    const newTeacher: Teacher = {
      id: (teachers.length + 1).toString(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      subject: formData.subject,
      phone: formData.phone,
      hireDate: formData.hireDate || new Date().toISOString().split("T")[0],
      status: "active",
    };
    setTeachers([...teachers, newTeacher]);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      subject: "",
      phone: "",
      hireDate: "",
      address: "",
      salary: "",
    });
    setShowAddForm(false);
  };

  const subjects = [
    "Mathématiques",
    "Français",
    "Histoire-Géographie",
    "Physique-Chimie",
    "SVT",
    "Anglais",
    "Espagnol",
    "Allemand",
    "EPS",
    "Musique",
    "Arts Plastiques",
    "Technologie",
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestion des Enseignants
        </h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ajouter un enseignant
        </button>
      </div>

      {/* Modal pour ajouter un enseignant */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Ajouter un nouvel enseignant
              </h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Matière
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner une matière</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date d'embauche
                  </label>
                  <input
                    type="date"
                    name="hireDate"
                    value={formData.hireDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salaire
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 2500€"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Enregistrer l'enseignant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ResponsiveTable
        headers={[
          "ID",
          "Nom",
          "Email",
          "Matière",
          "Téléphone",
          "Statut",
          "Actions",
        ]}
      >
        {teachers.map((teacher) => (
          <ResponsiveTableRow key={teacher.id}>
            <ResponsiveTableCell header="ID" nowrap>
              {teacher.id}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Nom" maxWidth="200px">
              {teacher.firstName} {teacher.lastName}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Email" maxWidth="250px">
              {teacher.email}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Matière" nowrap>
              {teacher.subject}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Téléphone" nowrap>
              {teacher.phone}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Statut" nowrap>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  teacher.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {teacher.status === "active" ? "Actif" : "Inactif"}
              </span>
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Actions" nowrap>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                  title="Modifier"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </ResponsiveTableCell>
          </ResponsiveTableRow>
        ))}
      </ResponsiveTable>
    </div>
  );
};

export default Teachers;
