// Fichier : src/components/admin/tabs/UtilisateursTab.tsx
import React from "react";
import { Table } from "../Table";

export const UtilisateursTab: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gris-canon-de-fusil">Gestion des Utilisateurs</h2>
    <Table headers={["Nom", "Email", "Téléphone", "Date d'inscription", "Actions"]}>
      <tr>
        <td
          colSpan={5}
          className="px-6 py-8 text-center text-sm text-gris-canon-de-fusil/60"
        >
          Module en cours de développement...
        </td>
      </tr>
    </Table>
  </div>
);