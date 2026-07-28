import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Heart, AlertCircle, Search } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabaseClient";

import type { Product } from "../types";
import WishlistCard from "../components/WishlistCard";

const Wishlist: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [filteredWishlist, setFilteredWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("wishlist_items")
        .select(
          `
          product_id,
          products (*)
        `,
        )
        .eq("user_id", user?.id);

      if (error) throw error;

      if (data) {
        const productsList = data
          .map((item: any) => item.products)
          .filter(Boolean) as Product[];

        setWishlist(productsList);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des favoris", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    const previousWishlist = [...wishlist];
    setWishlist(wishlist.filter((item) => item.id !== productId));

    try {
      const { error } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (error) {
        setWishlist(previousWishlist);
        throw error;
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du favori", error);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase().trim();
      setFilteredWishlist(
        wishlist.filter((product) => product.name.toLowerCase().includes(q)),
      );
    } else {
      setFilteredWishlist(wishlist);
    }
  }, [searchTerm, wishlist]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blanc px-4">
        <div className="max-w-md w-full text-center space-y-6 bg-blanc border border-gris-canon-de-fusil/5 p-8 rounded-2xl shadow-xs">
          <div className="mx-auto w-16 h-16 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-gris-canon-de-fusil leading-tight">
              Connectez-vous pour voir vos favoris
            </h2>
            <p className="text-xs sm:text-sm text-gris-canon-de-fusil/50 font-medium leading-relaxed">
              Vous devez être connecté pour accéder à votre liste de souhaits
              personnelle.
            </p>
          </div>
          <Link
            to="/login"
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-bleu-saphir text-blanc rounded-xl text-xs font-bold hover:bg-bleu-saphir/90 shadow-sm transition-colors cursor-pointer"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blanc gap-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-12 w-12 rounded-full border-4 border-gris-canon-de-fusil/5"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-bleu-saphir"></div>
        </div>
        <div className="text-center animate-pulse">
          <h5 className="text-sm font-bold text-gris-canon-de-fusil">
            Chargement des favoris...
          </h5>
          <p className="text-xs text-gris-canon-de-fusil/50 mt-1">
            Veuillez patienter un instant...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-blanc">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center space-x-3.5">
          <div className="h-12 w-12 rounded-xl bg-bleu-saphir/5 flex items-center justify-center text-bleu-saphir">
            <Heart className="h-6 w-6 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gris-canon-de-fusil leading-none">
              Mes Favoris
            </h1>
            <p className="text-[11px] sm:text-xs text-gris-canon-de-fusil/40 font-bold uppercase tracking-wider mt-1">
              Liste de souhaits personnelle
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-gris-canon-de-fusil/50 font-semibold self-start sm:self-center bg-gris-canon-de-fusil/5 px-3 py-1.5 rounded-lg">
          {filteredWishlist.length} / {wishlist.length}{" "}
          {wishlist.length === 1 ? "article" : "articles"} enregistré
          {wishlist.length > 1 ? "s" : ""}
        </p>
      </div>

      {wishlist.length > 0 && (
        <div className="mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gris-canon-de-fusil/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value) {
                  setSearchParams({ q: e.target.value });
                } else {
                  setSearchParams({});
                }
              }}
              placeholder="Rechercher par nom de produit..."
              className="w-full pl-10 pr-4 py-2 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-bleu-saphir text-sm text-gris-canon-de-fusil bg-blanc"
            />
          </div>
        </div>
      )}

      {wishlist.length === 0 ? (
        <div className="text-center py-16 bg-blanc rounded-2xl shadow-xs max-w-xl mx-auto px-4">
          <div className="text-gris-canon-de-fusil/20 mb-4">
            <Heart className="h-14 w-14 mx-auto" />
          </div>
          <h2 className="text-lg font-black text-gris-canon-de-fusil mb-1">
            Votre liste de favoris est vide
          </h2>
          <p className="text-xs sm:text-sm text-gris-canon-de-fusil/50 mb-6 leading-relaxed">
            Parcourez notre collection et ajoutez des articles à vos favoris
            pour les retrouver facilement plus tard.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-5 py-3 bg-bleu-saphir text-blanc rounded-xl text-xs font-bold hover:bg-bleu-saphir/90 shadow-sm transition-colors cursor-pointer"
          >
            Découvrir des produits
          </Link>
        </div>
      ) : filteredWishlist.length === 0 ? (
        <div className="text-center py-16 bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl shadow-xs max-w-xl mx-auto px-4">
          <div className="text-gris-canon-de-fusil/20 mb-4">
            <Search className="h-14 w-14 mx-auto" />
          </div>
          <h3 className="text-lg font-black text-gris-canon-de-fusil mb-1">
            Aucun résultat trouvé
          </h3>
          <p className="text-xs sm:text-sm text-gris-canon-de-fusil/50 mb-6 leading-relaxed">
            Aucun article dans vos favoris ne correspond à "{searchTerm}".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          {filteredWishlist.map((product) => (
            <WishlistCard
              key={product.id}
              product={product}
              onRemove={removeFromWishlist}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
