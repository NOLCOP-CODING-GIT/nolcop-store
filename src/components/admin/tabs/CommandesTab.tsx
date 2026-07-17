// Fichier : src/components/admin/tabs/CommandesTab.tsx
import React from "react";
import { Table } from "../Table";

export const CommandesTab: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gris-canon-de-fusil">Toutes les Commandes</h2>
    <Table headers={["ID", "Client", "Total", "Date", "Statut", "Actions"]}>
      <tr><td colSpan={6} className="px-6 py-8 text-center text-sm text-gris-canon-de-fusil/60">Module en cours de développement...</td></tr>
    </Table>
  </div>
);