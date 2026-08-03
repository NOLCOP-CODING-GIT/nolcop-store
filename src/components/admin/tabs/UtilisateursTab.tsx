import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { Table } from "../Table";
import { Trash2, Ban, CheckCircle, Search } from "lucide-react";

interface Address {
  street: string;
  city: string;
  is_default: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  telephone: string;
  role: string;
  created_at: string;
  is_suspended?: boolean;
  addresses?: Address[];
}

export const UtilisateursTab: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("*, addresses(street, city, is_default)")
      .order("created_at", { ascending: false });

    if (data && !error) {
      const filteredUsers = data.filter((user) => user.role !== "admin");
      setUsers(filteredUsers);
    }
    setLoading(false);
  };

  const deleteUser = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) {
      await supabase.from("users").delete().eq("id", id);
      fetchUsers();
    }
  };

  const formatRef = (id: string) => {
    return `USR${id.split("-")[0].substring(0, 5).toUpperCase()}`;
  };

  const toggleSuspendUser = async (
    id: string,
    currentStatus: boolean | undefined,
  ) => {
    const newStatus = !currentStatus;
    const confirmMessage = newStatus
      ? "Voulez-vous vraiment suspendre cet utilisateur ?"
      : "Voulez-vous vraiment réactiver cet utilisateur ?";

    if (window.confirm(confirmMessage)) {
      const { error } = await supabase
        .from("users")
        .update({ is_suspended: newStatus })
        .eq("id", id);

      if (error) {
        alert(
          "Erreur lors de la suspension. Assurez-vous que la colonne 'is_suspended' existe dans la table 'users'.",
        );
        console.error(error);
      } else {
        fetchUsers();
      }
    }
  };

  const formatAddress = (addresses?: Address[]) => {
    if (!addresses || addresses.length === 0) return "-";
    const defaultAddress = addresses.find((a) => a.is_default) || addresses[0];
    return `${defaultAddress.street}, ${defaultAddress.city}`;
  };

  const filteredData = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.telephone && user.telephone.includes(searchTerm)),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gris-canon-de-fusil">
          Gestion des Utilisateurs
        </h2>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Rechercher (nom, email...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm shadow-xs text-gris-canon-de-fusil"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <Table
        headers={[
          "Ref",
          "Nom & Statut",
          "Email",
          "Téléphone",
          "Adresse",
          "Date d'inscription",
          "Actions",
        ]}
      >
        {loading ? (
          <tr>
            <td
              colSpan={7}
              className="px-6 py-8 text-center text-sm font-semibold text-gray-500"
            >
              Chargement...
            </td>
          </tr>
        ) : filteredData.length === 0 ? (
          <tr>
            <td
              colSpan={7}
              className="px-6 py-8 text-center text-sm font-semibold text-gray-500"
            >
              Aucun utilisateur trouvé.
            </td>
          </tr>
        ) : (
          filteredData.map((user) => (
            <tr
              key={user.id}
              className={`transition-colors border-b border-gray-100 ${
                user.is_suspended
                  ? "bg-rouge-ecarlate/10 hover:bg-rouge-ecarlate/15"
                  : "hover:bg-bleu-saphir/5"
              }`}
            >
              {/* ID / Ref */}
              <td className="px-6 py-4 text-xs font-black text-bleu-saphir/70">
                {formatRef(user.id)}
              </td>

              {/* User avec Avatar & Statut */}
              <td className="px-6 py-4 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="h-9 w-9 rounded-full bg-bleu-saphir text-white font-black text-xs flex items-center justify-center shadow-xs shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-gris-canon-de-fusil flex items-center gap-2">
                      <span>{user.name}</span>
                      {user.is_suspended ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rouge-ecarlate/15 text-rouge-ecarlate">
                          Suspendu
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-vert-jungle/15 text-vert-jungle">
                          Actif
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </td>

              {/* Email */}
              <td className="px-6 py-4 text-sm font-bold text-vert-jungle/80">
                {user.email}
              </td>

              {/* Téléphone */}
              <td className="px-6 py-4 text-sm font-bold text-gris-canon-de-fusil/80">
                {user.telephone ? (
                  <span className="inline-block px-2.5 py-1 bg-gris-canon-de-fusil/5 text-gris-canon-de-fusil rounded-lg text-xs font-semibold">
                    {user.telephone}
                  </span>
                ) : (
                  <span className="text-gray-400 italic text-xs">-</span>
                )}
              </td>

              {/* Adresse */}
              <td className="px-6 py-4 text-sm text-gris-canon-de-fusil/80 max-w-xs truncate">
                {formatAddress(user.addresses)}
              </td>

              {/* Date */}
              <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                {new Date(user.created_at).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-sm">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      toggleSuspendUser(user.id, user.is_suspended)
                    }
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      user.is_suspended
                        ? "bg-vert-jungle/15 text-vert-jungle hover:bg-vert-jungle/25"
                        : "bg-orange-rougi/15 text-orange-rougi hover:bg-orange-rougi/25"
                    }`}
                    title={
                      user.is_suspended
                        ? "Réactiver l'utilisateur"
                        : "Suspendre l'utilisateur"
                    }
                  >
                    {user.is_suspended ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Ban className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="p-2 bg-rouge-ecarlate/15 text-rouge-ecarlate hover:bg-rouge-ecarlate/25 rounded-xl transition-all cursor-pointer"
                    title="Supprimer définitivement"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </Table>
    </div>
  );
};
