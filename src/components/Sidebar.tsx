import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Tableau de bord", path: "/" },
    { icon: Users, label: "Étudiants", path: "/students" },
    { icon: GraduationCap, label: "Enseignants", path: "/teachers" },
    { icon: BookOpen, label: "Classes", path: "/classes" },
    { icon: Calendar, label: "Cours", path: "/courses" },
    { icon: BarChart3, label: "Notes", path: "/grades" },
    { icon: FileText, label: "Présence", path: "/attendance" },
    { icon: BookOpen, label: "Rapports", path: "/reports" },
    { icon: Settings, label: "Paramètres", path: "/settings" },
  ];

  return (
    <>
      {/* Overlay pour mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => {}}
        />
      )}

      <aside
        className={`fixed left-0 top-16 h-full bg-white shadow-lg transition-all duration-300 z-40 ${
          isOpen ? "w-64" : "w-16"
        } ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
                title={!isOpen ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {isOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
