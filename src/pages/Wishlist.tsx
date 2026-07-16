import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Wishlist: React.FC = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Simuler des données pour la démo
  React.useEffect(() => {
    setTimeout(() => {
      setWishlist([
        {
          id: "1",
          name: "iPhone 15 Pro",
          price: 999,
          image:
            "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=300",
          category: "Électronique",
        },
        {
          id: "2",
          name: "MacBook Air M2",
          price: 1299,
          image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300",
          category: "Électronique",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const removeFromWishlist = (id: string) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  const addToCart = (item: any) => {
    // Logique pour ajouter au panier
    console.log("Ajouté au panier:", item);
  };

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
          {/* Rail extérieur discret */}
          <div className="absolute h-12 w-12 rounded-full border-4 border-gris-canon-de-fusil/5"></div>
          {/* Spinner actif */}
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-bleu-saphir"></div>
        </div>

        {/* Texte avec pulsation douce */}
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-blanc">
      {/* Header de la page */}
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
          {wishlist.length} {wishlist.length === 1 ? "article" : "articles"}{" "}
          enregistré{wishlist.length > 1 ? "s" : ""}
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-16 bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl shadow-xs max-w-xl mx-auto px-4">
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-blanc rounded-2xl border border-gris-canon-de-fusil/5 shadow-xs overflow-hidden group hover:border-gris-canon-de-fusil/10 transition-all duration-300"
            >
              {/* Image de l'article */}
              <div className="relative aspect-video sm:aspect-square md:aspect-video w-full overflow-hidden bg-gris-canon-de-fusil/5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 p-2 bg-blanc text-rose-600 rounded-xl shadow-sm border border-gris-canon-de-fusil/5 hover:bg-rose-500/5 transition-all cursor-pointer"
                  title="Supprimer des favoris"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Contenu et Actions */}
              <div className="p-5 space-y-4">
                <div>
                  <span className="inline-flex items-center text-[10px] font-black uppercase tracking-wider text-gris-canon-de-fusil/40 mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-gris-canon-de-fusil line-clamp-1">
                    {item.name}
                  </h3>
                </div>

                <p className="text-xl sm:text-2xl font-black text-bleu-saphir">
                  {item.price} €
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => addToCart(item)}
                    className="flex-1 flex items-center justify-center px-4 py-2.5 bg-bleu-saphir text-blanc rounded-xl text-xs font-bold hover:bg-bleu-saphir/90 transition-all shadow-xs cursor-pointer"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Ajouter
                  </button>
                  <Link
                    to={`/products/${item.id}`}
                    className="flex-1 flex items-center justify-center px-4 py-2.5 border border-gris-canon-de-fusil/10 text-gris-canon-de-fusil/70 hover:bg-gris-canon-de-fusil/5 rounded-xl text-xs font-bold transition-all text-center"
                  >
                    Détails
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
