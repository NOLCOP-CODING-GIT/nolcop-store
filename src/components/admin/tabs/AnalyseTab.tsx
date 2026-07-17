// Fichier : src/components/admin/tabs/AnalyseTab.tsx
import React from "react";
import { TrendingUp } from "lucide-react";

export const AnalyseTab: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gris-canon-de-fusil">Analyses & Statistiques</h2>
    <div className="p-8 border border-gris-canon-de-fusil/10 rounded-2xl flex flex-col items-center justify-center bg-gray-50/50">
      <TrendingUp className="h-8 w-8 text-gris-canon-de-fusil/30 mb-2" />
      <p className="text-sm font-semibold text-gris-canon-de-fusil/60">Graphiques bientôt disponibles</p>
    </div>
  </div>
);