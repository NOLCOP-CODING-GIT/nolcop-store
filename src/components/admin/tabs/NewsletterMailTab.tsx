import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { Table } from "../Table";
import { Trash2, Search } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  member: boolean;
  created_at: string;
}

export const NewsletterMailTab: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (data && !error) {
      setSubscribers(data);
    }
    setLoading(false);
  };

  const deleteSubscriber = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment désabonner cet email ?")) {
      await supabase.from("newsletter_subscribers").delete().eq("id", id);
      fetchSubscribers();
    }
  };

  const filteredData = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatRef = (id: string) => {
    return `NEWS${id.split("-")[0].substring(0, 5).toUpperCase()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gris-canon-de-fusil">
          Abonnés Newsletter
        </h2>
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Rechercher un email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <Table
        headers={["Ref", "Email", "Membre", "Date d'inscription", "Actions"]}
      >
        {loading ? (
          <tr>
            <td colSpan={5} className="px-6 py-8 text-center text-sm">Chargement...</td>
          </tr>
        ) : filteredData.length === 0 ? (
          <tr>
            <td colSpan={5} className="px-6 py-8 text-center text-sm">Aucun abonné trouvé.</td>
          </tr>
        ) : (
          filteredData.map((sub) => (
            <tr key={sub.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-bold text-bleu-saphir/70">{formatRef(sub.id)}</td>
              <td className="px-6 py-4 text-sm">{sub.email}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${sub.member ? 'bg-bleu-saphir/10 text-bleu-saphir' : 'bg-gray-100 text-gray-600'}`}>
                  {sub.member ? "Oui" : "Non"}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">{new Date(sub.created_at).toLocaleDateString("fr-FR")}</td>
              <td className="px-6 py-4 text-sm">
                <button onClick={() => deleteSubscriber(sub.id)} className="text-rouge-ecarlate hover:opacity-80">
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))
        )}
      </Table>
    </div>
  );
};
