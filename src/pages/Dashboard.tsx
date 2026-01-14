import React from "react";
import {
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: "Total Étudiants",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Enseignants",
      value: "89",
      change: "+5%",
      icon: GraduationCap,
      color: "bg-green-500",
    },
    {
      title: "Total Classes",
      value: "45",
      change: "+8%",
      icon: BookOpen,
      color: "bg-purple-500",
    },
    {
      title: "Présence Aujourd'hui",
      value: "92%",
      change: "+2%",
      icon: Calendar,
      color: "bg-orange-500",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "Nouvel étudiant",
      description: "Marie Dupont a été ajoutée",
      time: "Il y a 5 minutes",
      icon: Users,
    },
    {
      id: 2,
      type: "Note ajoutée",
      description: "Notes du cours de Mathématiques",
      time: "Il y a 1 heure",
      icon: Award,
    },
    {
      id: 3,
      type: "Présence enregistrée",
      description: "Classe 3ème A",
      time: "Il y a 2 heures",
      icon: Calendar,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">
          Vue d'ensemble de votre établissement scolaire
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activités récentes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Activités récentes
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <activity.icon className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.type}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
