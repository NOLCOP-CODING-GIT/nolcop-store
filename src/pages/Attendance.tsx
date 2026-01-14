import React, { useState } from "react";
import Modal from "../components/Modal";
import ResponsiveTable from "../components/ResponsiveTable";
import ResponsiveTableRow, {
  ResponsiveTableCell,
} from "../components/ResponsiveTableRow";
import { Edit, Trash2 } from "lucide-react";

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  notes: string;
}

const Attendance: React.FC = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([
    {
      id: "1",
      studentId: "1",
      studentName: "Marie Dupont",
      courseId: "1",
      courseName: "Mathématiques Avancées",
      date: "2024-01-15",
      status: "present",
      notes: "",
    },
    {
      id: "2",
      studentId: "2",
      studentName: "Pierre Martin",
      courseId: "2",
      courseName: "Physique Quantique",
      date: "2024-01-16",
      status: "late",
      notes: "Retard de 10 minutes",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
    date: "",
    status: "",
    notes: "",
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

    const newRecord: AttendanceRecord = {
      id: (attendanceRecords.length + 1).toString(),
      studentId: formData.studentId,
      studentName: studentName,
      courseId: formData.courseId,
      courseName: courseName,
      date: formData.date,
      status: formData.status as "present" | "absent" | "late" | "excused",
      notes: formData.notes,
    };
    setAttendanceRecords([...attendanceRecords, newRecord]);
    setFormData({
      studentId: "",
      courseId: "",
      date: "",
      status: "",
      notes: "",
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

  const statusOptions = [
    {
      value: "present",
      label: "Présent",
      color: "bg-green-100 text-green-800",
    },
    { value: "absent", label: "Absent", color: "bg-red-100 text-red-800" },
    {
      value: "late",
      label: "En retard",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "excused", label: "Excusé", color: "bg-blue-100 text-blue-800" },
  ];

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    return statusOption ? statusOption.color : "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const statusOption = statusOptions.find((s) => s.value === status);
    return statusOption ? statusOption.label : status;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestion des Présences
        </h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ajouter une présence
        </button>
      </div>

      <Modal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        title="Ajouter une nouvelle présence"
      >
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un statut</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Notes optionnelles sur la présence"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Enregistrer la présence
            </button>
          </div>
        </form>
      </Modal>

      <ResponsiveTable
        headers={[
          "ID",
          "Étudiant",
          "Cours",
          "Date",
          "Statut",
          "Notes",
          "Actions",
        ]}
      >
        {attendanceRecords.map((record) => (
          <ResponsiveTableRow key={record.id}>
            <ResponsiveTableCell header="ID" nowrap>
              {record.id}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Étudiant" maxWidth="200px">
              {record.studentName}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Cours" maxWidth="200px">
              {record.courseName}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Date" nowrap>
              {record.date}
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Statut" nowrap>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(record.status)}`}
              >
                {getStatusLabel(record.status)}
              </span>
            </ResponsiveTableCell>
            <ResponsiveTableCell header="Notes" maxWidth="250px">
              <div className="truncate">{record.notes}</div>
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

export default Attendance;
