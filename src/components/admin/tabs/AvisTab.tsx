import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { Table } from "../Table";
import { Trash2, Search, Star } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  users: { name: string } | null;
  products: { name: string } | null;
}

export const AvisTab: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*, users(name), products(name)")
      .order("created_at", { ascending: false });

    if (data && !error) {
      setReviews(data);
    }
    setLoading(false);
  };

  const deleteReview = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet avis ?")) {
      await supabase.from("reviews").delete().eq("id", id);
      fetchReviews();
    }
  };

  const filteredData = reviews.filter(
    (review) =>
      (review.users?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (review.products?.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatRef = (id: string) => {
    return `AVIS${id.split("-")[0].substring(0, 5).toUpperCase()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gris-canon-de-fusil">
          Avis Clients
        </h2>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Client, produit, avis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <Table
        headers={[
          "Ref",
          "Client",
          "Produit",
          "Note",
          "Commentaire",
          "Date création",
          "Actions",
        ]}
      >
        {loading ? (
          <tr>
            <td colSpan={7} className="px-6 py-8 text-center text-sm">
              Chargement...
            </td>
          </tr>
        ) : filteredData.length === 0 ? (
          <tr>
            <td colSpan={7} className="px-6 py-8 text-center text-sm">
              Aucun avis trouvé.
            </td>
          </tr>
        ) : (
          filteredData.map((review) => (
            <tr
              key={review.id}
              className="hover:bg-bleu-saphir/5 transition-colors border-b border-gray-100"
            >
              {/* Ref */}
              <td className="px-6 py-4 text-sm font-bold text-bleu-saphir/70">
                {formatRef(review.id)}
              </td>

              {/* Utilisateur avec Avatar */}
              <td className="px-6 py-4 text-sm font-bold text-gris-canon-de-fusil">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-bleu-saphir text-white font-black text-xs flex items-center justify-center shrink-0">
                    {(review.users?.name || "A").charAt(0).toUpperCase()}
                  </div>
                  <span>{review.users?.name || "Anonyme"}</span>
                </div>
              </td>

              {/* Produit */}
              <td className="px-6 py-4 text-sm font-medium text-gris-canon-de-fusil/80">
                {review.products?.name ? (
                  <span className="inline-block px-2.5 py-1 bg-gris-canon-de-fusil/5 text-gris-canon-de-fusil rounded-lg text-xs font-semibold">
                    {review.products.name}
                  </span>
                ) : (
                  <span className="text-gray-400 italic text-xs">-</span>
                )}
              </td>

              {/* Note / Étoiles */}
              <td className="px-6 py-4 text-sm">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-orange-rougi/15 rounded-full text-orange-rougi font-extrabold text-xs">
                  <Star className="h-3.5 w-3.5 fill-orange-rougi text-orange-rougi" />
                  <span>{review.rating}/5</span>
                </div>
              </td>

              {/* Commentaire */}
              <td
                className="px-6 py-4 text-sm text-gris-canon-de-fusil/80 max-w-xs truncate italic"
                title={review.comment}
              >
                {review.comment}
              </td>

              {/* Date */}
              <td className="px-6 py-4 text-sm font-semibold text-gray-500">
                {new Date(review.created_at).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </td>

              {/* Actions */}
              <td className="px-6 py-4 text-sm">
                <button
                  onClick={() => deleteReview(review.id)}
                  className="p-2 bg-rouge-ecarlate/15 text-rouge-ecarlate hover:bg-rouge-ecarlate/25 rounded-xl transition-all cursor-pointer"
                  title="Supprimer l'avis"
                >
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
