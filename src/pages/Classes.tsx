import React, { useState } from "react";
import ResponsiveTable from "../components/ResponsiveTable";
import ResponsiveTableRow, {
  ResponsiveTableCell,
} from "../components/ResponsiveTableRow";
import { Edit, Trash2 } from "lucide-react";

interface Class {
  id: string;
  name: string;
  level: string;
  capacity: number;
  currentStudents: number;
  teacher: string;
  room: string;
  schedule: string;
  status: "active" | "inactive";
}

const Classes: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([
    {
      id: "1",
      name: "3ème A",
      level: "Troisième",
      capacity: 30,
      currentStudents: 25,
      teacher: "Jean Dubois",
      room: "A101",
      schedule: "Lundi-Vendredi 8h-12h",
      status: "active",
    },
    {
      id: "2",
      name: "2nde B",
      level: "Seconde",
      capacity: 28,
      currentStudents: 22,
      teacher: "Marie Leroy",
      room: "B205",
      schedule: "Lundi-Vendredi 14h-18h",
      status: "active",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    capacity: "",
    teacher: "",
    room: "",
    schedule: "",
    description: "",
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
    const newClass: Class = {
      id: (classes.length + 1).toString(),
      name: formData.name,
      level: formData.level,
      capacity: parseInt(formData.capacity) || 0,
      currentStudents: 0,
      teacher: formData.teacher,
      room: formData.room,
      schedule: formData.schedule,
      status: "active",
    };
    setClasses([...classes, newClass]);
    setFormData({
      name: "",
      level: "",
      capacity: "",
      teacher: "",
      room: "",
      schedule: "",
      description: "",
    });
    setShowAddForm(false);
  };

  const levels = [
    "Sixième",
    "Cinquième",
    "Quatrième",
    "Troisième",
    "Seconde",
    "Première",
    "Terminale",
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestion des Classes
        </h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ajouter une classe
        </button>
      </div>

      {/* Modal pour ajouter une classe */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Ajouter une nouvelle classe
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
                    Nom de la classe
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 3ème A"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Niveau
                  </label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner un niveau</option>
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacité
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre d'élèves maximum"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professeur principal
                  </label>
                  <input
                    type="text"
                    name="teacher"
                    value={formData.teacher}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom du professeur"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salle
                  </label>
                  <input
                    type="text"
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: A101"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emploi du temps
                  </label>
                  <input
                    type="text"
                    name="schedule"
                    value={formData.schedule}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Lundi-Vendredi 8h-12h"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Description optionnelle de la classe"
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
                  Enregistrer la classe
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
          "Niveau",
          "Capacité",
          "Élèves actuels",
          "Professeur",
          "Salle",
          "Statut",
          "Actions",
        ]}
      >
        {classes.map((classItem) => (
          <ResponsiveTableRow key={classItem.id}>
            <ResponsiveTableCell header="ID" nowrap>
              {classItem.id}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Nom" maxWidth="150px">
              {classItem.name}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Niveau" nowrap>
              {classItem.level}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Capacité" nowrap>
              {classItem.capacity}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Élèves actuels" nowrap>
              <div className="flex items-center">
                <span>{classItem.currentStudents}</span>
                <span className="text-gray-500 ml-1">
                  /{classItem.capacity}
                </span>
                <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${(classItem.currentStudents / classItem.capacity) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Professeur" maxWidth="150px">
              {classItem.teacher}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Salle" nowrap>
              {classItem.room}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Statut" nowrap>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  classItem.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {classItem.status === "active" ? "Active" : "Inactive"}
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

export default Classes;
