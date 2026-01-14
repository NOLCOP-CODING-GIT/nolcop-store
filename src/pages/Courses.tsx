import React, { useState } from "react";
import ResponsiveTable from "../components/ResponsiveTable";
import ResponsiveTableRow, {
  ResponsiveTableCell,
} from "../components/ResponsiveTableRow";
import { Edit, Trash2 } from "lucide-react";

interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  hours: number;
  teacher: string;
  semester: string;
  status: "active" | "inactive";
}

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([
    {
      id: "1",
      name: "Mathématiques Avancées",
      code: "MATH301",
      description: "Algèbre linéaire et calcul différentiel",
      credits: 6,
      hours: 60,
      teacher: "Jean Dubois",
      semester: "Semestre 1",
      status: "active",
    },
    {
      id: "2",
      name: "Physique Quantique",
      code: "PHYS202",
      description: "Introduction à la mécanique quantique",
      credits: 4,
      hours: 45,
      teacher: "Marie Leroy",
      semester: "Semestre 2",
      status: "active",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    credits: "",
    hours: "",
    teacher: "",
    semester: "",
    prerequisites: "",
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
    const newCourse: Course = {
      id: (courses.length + 1).toString(),
      name: formData.name,
      code: formData.code,
      description: formData.description,
      credits: parseInt(formData.credits) || 0,
      hours: parseInt(formData.hours) || 0,
      teacher: formData.teacher,
      semester: formData.semester,
      status: "active",
    };
    setCourses([...courses, newCourse]);
    setFormData({
      name: "",
      code: "",
      description: "",
      credits: "",
      hours: "",
      teacher: "",
      semester: "",
      prerequisites: "",
    });
    setShowAddForm(false);
  };

  const semesters = [
    "Semestre 1",
    "Semestre 2",
    "Semestre 3",
    "Semestre 4",
    "Semestre 5",
    "Semestre 6",
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Cours</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ajouter un cours
        </button>
      </div>

      {/* Modal pour ajouter un cours */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Ajouter un nouveau cours
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
                    Nom du cours
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Mathématiques Avancées"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code du cours
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: MATH301"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Crédits
                  </label>
                  <input
                    type="number"
                    name="credits"
                    value={formData.credits}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre de crédits"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heures
                  </label>
                  <input
                    type="number"
                    name="hours"
                    value={formData.hours}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre d'heures"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enseignant
                  </label>
                  <input
                    type="text"
                    name="teacher"
                    value={formData.teacher}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nom de l'enseignant"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Semestre
                  </label>
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner un semestre</option>
                    {semesters.map((semester) => (
                      <option key={semester} value={semester}>
                        {semester}
                      </option>
                    ))}
                  </select>
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
                    placeholder="Description du cours"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prérequis
                  </label>
                  <textarea
                    name="prerequisites"
                    value={formData.prerequisites}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Prérequis optionnels"
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
                  Enregistrer le cours
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ResponsiveTable
        headers={[
          "ID",
          "Code",
          "Nom",
          "Description",
          "Crédits",
          "Heures",
          "Enseignant",
          "Semestre",
          "Statut",
          "Actions",
        ]}
      >
        {courses.map((course) => (
          <ResponsiveTableRow key={course.id}>
            <ResponsiveTableCell header="ID" nowrap>
              {course.id}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Code" nowrap>
              {course.code}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Nom" maxWidth="200px">
              {course.name}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Description" maxWidth="300px">
              <div className="truncate">{course.description}</div>
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Crédits" nowrap>
              {course.credits}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Heures" nowrap>
              {course.hours}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Enseignant" maxWidth="150px">
              {course.teacher}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Semestre" nowrap>
              {course.semester}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Statut" nowrap>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  course.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {course.status === "active" ? "Actif" : "Inactif"}
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

export default Courses;
