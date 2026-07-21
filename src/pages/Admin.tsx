// Fichier : src/pages/Admin.tsx (ou là où se trouve ton fichier Admin actuel)
import React, { useState } from "react";
import {
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Tags,
  TrendingUp,
  Star,
  Mail,
  AlertTriangle,
} from "lucide-react";

// Imports des sous-composants (ajuste le chemin si nécessaire)
import { TableauBordTab } from "../components/admin/tabs/TableauBordTab";
import { ProduitsTab } from "../components/admin/tabs/ProduitsTab";
import { CategoriesTab } from "../components/admin/tabs/CategoriesTab";
import { CommandesTab } from "../components/admin/tabs/CommandesTab";
import { UtilisateursTab } from "../components/admin/tabs/UtilisateursTab";
import { AnalyseTab } from "../components/admin/tabs/AnalyseTab";
import { AvisTab } from "../components/admin/tabs/AvisTab";
import { NewsletterMailTab } from "../components/admin/tabs/NewsletterMailTab";
import { UrgenceTab } from "../components/admin/tabs/UrgenceTab";

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const TABS = [
    {
      id: "dashboard",
      label: "Tableau de bord",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      id: "categories",
      label: "Catégories",
      icon: <Tags className="h-4 w-4" />,
    },
    {
      id: "products",
      label: "Produits",
      icon: <Package className="h-4 w-4" />,
    },
    {
      id: "orders",
      label: "Commandes",
      icon: <ShoppingCart className="h-4 w-4" />,
    },
    { id: "users", label: "Utilisateurs", icon: <Users className="h-4 w-4" /> },
    {
      id: "analytics",
      label: "Analyse",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    { id: "reviews", label: "Avis", icon: <Star className="h-4 w-4" /> },
    {
      id: "newsletter",
      label: "Newsletter Mail",
      icon: <Mail className="h-4 w-4" />,
    },
    {
      id: "emergency",
      label: "Urgence",
      icon: <AlertTriangle className="h-4 w-4" />,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <TableauBordTab />;
      case "categories":
        return <CategoriesTab />;
      case "products":
        return <ProduitsTab />;
      case "orders":
        return <CommandesTab />;
      case "users":
        return <UtilisateursTab />;
      case "analytics":
        return <AnalyseTab />;
      case "reviews":
        return <AvisTab />;
      case "newsletter":
        return <NewsletterMailTab />;
      case "emergency":
        return <UrgenceTab />;
      default:
        return <TableauBordTab />;
    }
  };

  return (
    <div className="mx-auto px-4 py-8 bg-blanc">
      <h1 className="text-3xl font-black text-gris-canon-de-fusil mb-8">
        Administration
      </h1>

      <div className="border-b border-gris-canon-de-fusil/10 mb-8">
        <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-none pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
                activeTab === tab.id
                  ? "border-bleu-saphir text-bleu-saphir"
                  : "border-transparent text-gris-canon-de-fusil/40 hover:text-gris-canon-de-fusil/70"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Rendu dynamique du composant actif */}
      {renderTabContent()}
    </div>
  );
};

export default Admin;
