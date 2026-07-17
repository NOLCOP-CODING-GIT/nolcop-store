// Fichier : src/components/admin/tabs/NewsletterMailTab.tsx
import React from "react";
import { Table } from "../Table";

export const NewsletterMailTab: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gris-canon-de-fusil">Abonnés Newsletter</h2>
    <Table headers={["Email", "Statut", "Date d'inscription", "Actions"]}>
      <tr><td colSpan={4} className="px-6 py-8 text-center text-sm text-gris-canon-de-fusil/60">Module en cours de développement...</td></tr>
    </Table>
  </div>
);