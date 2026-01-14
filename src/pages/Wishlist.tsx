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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connectez-vous pour voir vos favoris
          </h2>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour accéder à votre liste de souhaits
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Heart className="h-8 w-8 mr-3 text-red-500" />
          Mes Favoris
        </h1>
        <p className="text-gray-600">
          {wishlist.length} {wishlist.length === 1 ? "article" : "articles"}
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Votre liste de favoris est vide
          </h2>
          <p className="text-gray-600 mb-6">
            Ajoutez des articles à vos favoris pour les retrouver facilement
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Découvrir des produits
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </button>
              </div>

              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.name}
                </h3>
                <p className="text-2xl font-bold text-indigo-600 mb-4">
                  {item.price} €
                </p>

                <div className="flex space-x-2">
                  <button
                    onClick={() => addToCart(item)}
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Ajouter au panier
                  </button>
                  <Link
                    to={`/product/${item.id}`}
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors text-center"
                  >
                    Voir détails
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
