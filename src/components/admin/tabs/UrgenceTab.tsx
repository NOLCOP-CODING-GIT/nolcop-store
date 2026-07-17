// Fichier : src/components/admin/tabs/UrgenceTab.tsx
import React from "react";
import { Table } from "../Table";
import { AlertTriangle } from "lucide-react";

export const UrgenceTab: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-rose-600 flex items-center">
      <AlertTriangle className="mr-2 h-6 w-6" /> Alertes & Urgences
    </h2>
    <Table headers={["Sujet", "Utilisateur", "Statut", "Date", "Actions"]}>
      <tr>
        <td colSpan={5} className="px-6 py-8 text-center text-sm text-gris-canon-de-fusil/60">
          Aucune urgence signalée.
        </td>
      </tr>
    </Table>
  </div>
);
