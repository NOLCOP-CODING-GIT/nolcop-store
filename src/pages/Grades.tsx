import React, { useState } from "react";
import Modal from "../components/Modal";
import ResponsiveTable from "../components/ResponsiveTable";
import ResponsiveTableRow, {
  ResponsiveTableCell,
} from "../components/ResponsiveTableRow";
import { Edit, Trash2 } from "lucide-react";

interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  grade: number;
  coefficient: number;
  semester: string;
  date: string;
  type: "exam" | "assignment" | "project" | "participation";
  comments: string;
}

const Grades: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([
    {
      id: "1",
      studentId: "1",
      studentName: "Marie Dupont",
      courseId: "1",
      courseName: "Mathématiques Avancées",
      grade: 15,
      coefficient: 3,
      semester: "Semestre 1",
      date: "2024-01-15",
      type: "exam",
      comments: "Excellent travail",
    },
    {
      id: "2",
      studentId: "2",
      studentName: "Pierre Martin",
      courseId: "2",
      courseName: "Physique Quantique",
      grade: 12,
      coefficient: 2,
      semester: "Semestre 2",
      date: "2024-02-20",
      type: "assignment",
      comments: "Bon raisonnement",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    grade: "",
    coefficient: "",
    semester: "",
    date: "",
    type: "",
    comments: "",
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
    const studentName =
      formData.studentId === "1"
        ? "Marie Dupont"
        : formData.studentId === "2"
          ? "Pierre Martin"
          : "Étudiant inconnu";
    const courseName =
      formData.courseId === "1"
        ? "Mathématiques Avancées"
        : formData.courseId === "2"
          ? "Physique Quantique"
          : "Cours inconnu";

    const newGrade: Grade = {
      id: (grades.length + 1).toString(),
      studentId: formData.studentId,
      studentName: studentName,
      courseId: formData.courseId,
      courseName: courseName,
      grade: parseFloat(formData.grade) || 0,
      coefficient: parseFloat(formData.coefficient) || 1,
      semester: formData.semester,
      date: formData.date,
      type: formData.type as
        | "exam"
        | "assignment"
        | "project"
        | "participation",
      comments: formData.comments,
    };
    setGrades([...grades, newGrade]);
    setFormData({
      studentId: "",
      courseId: "",
      grade: "",
      coefficient: "",
      semester: "",
      date: "",
      type: "",
      comments: "",
    });
    setShowAddForm(false);
  };

  const students = [
    { id: "1", name: "Marie Dupont" },
    { id: "2", name: "Pierre Martin" },
    { id: "3", name: "Sophie Bernard" },
  ];

  const courses = [
    { id: "1", name: "Mathématiques Avancées" },
    { id: "2", name: "Physique Quantique" },
  ];

  const semesters = [
    "Semestre 1",
    "Semestre 2",
    "Semestre 3",
    "Semestre 4",
    "Semestre 5",
    "Semestre 6",
  ];

  const gradeTypes = [
    { value: "exam", label: "Examen" },
    { value: "assignment", label: "Devoir" },
    { value: "project", label: "Projet" },
    { value: "participation", label: "Participation" },
  ];

  const getGradeColor = (grade: number) => {
    if (grade >= 16) return "text-green-600 font-bold";
    if (grade >= 14) return "text-blue-600 font-semibold";
    if (grade >= 12) return "text-yellow-600";
    if (grade >= 10) return "text-orange-600";
    return "text-red-600 font-semibold";
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des Notes</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ajouter une note
        </button>
      </div>

      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Ajouter une nouvelle note"
      >
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Étudiant
            </label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un étudiant</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cours
            </label>
            <select
              name="courseId"
              value={formData.courseId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un cours</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note (sur 20)
            </label>
            <input
              type="number"
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              min="0"
              max="20"
              step="0.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Note sur 20"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coefficient
            </label>
            <input
              type="number"
              name="coefficient"
              value={formData.coefficient}
              onChange={handleInputChange}
              min="1"
              step="0.5"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Coefficient"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type d'évaluation
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un type</option>
              {gradeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commentaires
            </label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Commentaires optionnels"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full sm:w-auto bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Enregistrer la note
            </button>
          </div>
        </form>
      </Modal>

      <ResponsiveTable
        headers={[
          "ID",
          "Étudiant",
          "Cours",
          "Note",
          "Coefficient",
          "Type",
          "Semestre",
          "Date",
          "Actions",
        ]}
      >
        {grades.map((grade) => (
          <ResponsiveTableRow key={grade.id}>
            <ResponsiveTableCell header="ID" nowrap>
              {grade.id}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Étudiant" maxWidth="200px">
              {grade.studentName}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Cours" maxWidth="200px">
              {grade.courseName}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Note" nowrap>
              <span className={`${getGradeColor(grade.grade)}`}>
                {grade.grade}/20
              </span>
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Coefficient" nowrap>
              {grade.coefficient}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Type" nowrap>
              {gradeTypes.find((t) => t.value === grade.type)?.label}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Semestre" nowrap>
              {grade.semester}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Date" nowrap>
              {grade.date}
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

export default Grades;
