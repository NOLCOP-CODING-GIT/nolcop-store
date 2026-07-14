import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Grid, List } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description?: string;
}

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Produits simulés pour la démo
  const allProducts = useMemo<Product[]>(
    () => [
      {
        id: "1",
        name: "iPhone 15 Pro",
        price: 999.99,
        image:
          "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=300",
        category: "Électronique",
        rating: 4.5,
        reviews: 234,
        description: "Le dernier iPhone avec processeur A17 Pro",
      },
      {
        id: "2",
        name: "MacBook Air M2",
        price: 1299.99,
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300",
        category: "Électronique",
        rating: 4.8,
        reviews: 156,
        description: "Ordinateur portable ultra-fin avec puce M2",
      },
      {
        id: "3",
        name: "Apple Watch Series 9",
        price: 449.99,
        image:
          "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=300",
        category: "Électronique",
        rating: 4.6,
        reviews: 89,
        description: "Montre connectée avec capteurs de santé",
      },
      {
        id: "4",
        name: "AirPods Pro",
        price: 249.99,
        image:
          "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300",
        category: "Électronique",
        rating: 4.4,
        reviews: 312,
        description: "Écouteurs sans fil avec réduction de bruit",
      },
      {
        id: "5",
        name: "iPad Air",
        price: 599.99,
        image:
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300",
        category: "Électronique",
        rating: 4.7,
        reviews: 178,
        description: "Tablette puante avec écran Liquid Retina",
      },
      {
        id: "6",
        name: "Samsung Galaxy S24",
        price: 899.99,
        image:
          "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=300",
        category: "Électronique",
        rating: 4.3,
        reviews: 267,
        description: "Smartphone Android avec écran AMOLED",
      },
      {
        id: "7",
        name: "Sony WH-1000XM5",
        price: 399.99,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300",
        category: "Électronique",
        rating: 4.6,
        reviews: 445,
        description: "Casque sans fil avec réduction de bruit premium",
      },
      {
        id: "8",
        name: "Nintendo Switch",
        price: 299.99,
        image:
          "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=300",
        category: "Électronique",
        rating: 4.5,
        reviews: 567,
        description: "Console de jeux hybride",
      },
    ],
    [],
  );

  useEffect(() => {
    const performSearch = async () => {
      setLoading(true);

      // Simuler un délai de recherche
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (!query) {
        setSearchResults(allProducts);
      } else {
        const filtered = allProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase()) ||
            (product.description &&
              product.description.toLowerCase().includes(query.toLowerCase())),
        );
        setSearchResults(filtered);
      }

      setLoading(false);
    };

    performSearch();
  }, [query, allProducts]);
  const sortedResults = [...searchResults].sort((a, b) => {
    let aScore = 0;
    let bScore = 0;

    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "relevance":
      default:
        // Simuler la pertinence basée sur la correspondance avec la recherche
        aScore = a.name.toLowerCase().includes(query.toLowerCase()) ? 2 : 0;
        bScore = b.name.toLowerCase().includes(query.toLowerCase()) ? 2 : 0;
        return bScore - aScore;
    }
  });

  const ProductCard = ({ product }: { product: Product }) => {
    // Formateur de prix FCFA (Bénin / XOF) pour rester cohérent avec CategoryPage
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("fr-BJ", {
        style: "currency",
        currency: "XOF",
        maximumFractionDigits: 0,
      }).format(price);
    };

    return (
      <div className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col h-full">
        {/* Zone Image */}
        <div className="relative overflow-hidden bg-gris-canon-de-fusil/5 aspect-video">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Contenu */}
        <div className="p-5 flex flex-col flex-1 justify-between gap-4">
          <div className="space-y-2">
            {/* Titre du produit */}
            <h3 className="text-base font-bold text-gris-canon-de-fusil line-clamp-2 min-h-[3rem] leading-tight">
              {product.name}
            </h3>

            {/* Étoiles et Note */}
            <div className="flex items-center space-x-1.5">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(product.rating)
                        ? "fill-current"
                        : "text-gris-canon-de-fusil/20"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[11px] font-bold text-gris-canon-de-fusil/50">
                {product.rating} ({product.reviews} avis)
              </span>
            </div>
          </div>

          {/* Prix et Bouton Action */}
          <div className="flex items-center justify-between pt-3 border-t border-gris-canon-de-fusil/5 mt-auto">
            <p className="text-xl font-black text-bleu-saphir">
              {formatPrice(product.price)}
            </p>
            <button className="px-4 py-2.5 bg-bleu-saphir text-blanc rounded-xl hover:bg-bleu-saphir/90 transition-colors shadow-xs cursor-pointer text-xs font-bold">
              Ajouter
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ProductListItem = ({ product }: { product: Product }) => {
    // Formateur de prix FCFA (Bénin / XOF) pour rester cohérent avec CategoryPage et ProductCard
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("fr-BJ", {
        style: "currency",
        currency: "XOF",
        maximumFractionDigits: 0,
      }).format(price);
    };

    return (
      <div className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl p-5 hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Zone Image */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden bg-gris-canon-de-fusil/5 rounded-xl border border-gris-canon-de-fusil/5">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          {/* Détails du produit */}
          <div className="flex-1 min-w-0 space-y-2">
            {/* Badge Catégorie */}
            {product.category && (
              <span className="inline-block text-[10px] font-black uppercase tracking-wider text-bleu-saphir/60 bg-bleu-saphir/5 px-2.5 py-1 rounded-md">
                {product.category}
              </span>
            )}

            {/* Nom du produit */}
            <h3 className="text-base sm:text-lg font-bold text-gris-canon-de-fusil leading-tight truncate">
              {product.name}
            </h3>

            {/* Description */}
            {product.description && (
              <p className="text-xs sm:text-sm text-gris-canon-de-fusil/60 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Étoiles et Note */}
            <div className="flex items-center space-x-1.5">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(product.rating)
                        ? "fill-current"
                        : "text-gris-canon-de-fusil/20"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[11px] font-bold text-gris-canon-de-fusil/50">
                {product.rating} ({product.reviews} avis)
              </span>
            </div>
          </div>

          {/* Prix et Action */}
          <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-gris-canon-de-fusil/5 shrink-0">
            <div className="sm:text-right">
              <p className="text-xl sm:text-2xl font-black text-bleu-saphir">
                {formatPrice(product.price)}
              </p>
            </div>
            <button className="px-5 py-2.5 bg-bleu-saphir text-blanc rounded-xl hover:bg-bleu-saphir/90 transition-colors shadow-xs cursor-pointer text-xs font-bold whitespace-nowrap">
              Ajouter au panier
            </button>
          </div>
        </div>
      </div>
    );
  };

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
            Chargement des produits...
          </h5>
          <p className="text-xs text-gris-canon-de-fusil/50 mt-1">
            Veuillez patienter un instant...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-blanc">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gris-canon-de-fusil mb-2 leading-tight">
          {query ? `Résultats pour "${query}"` : "Tous les produits"}
        </h1>
        <p className="text-xs sm:text-sm text-gris-canon-de-fusil/50 font-medium">
          {sortedResults.length}{" "}
          {sortedResults.length === 1 ? "résultat" : "résultats"} trouvé
          {sortedResults.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                defaultValue={query}
                placeholder="Rechercher des produits..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between lg:justify-end space-x-4 w-full lg:w-auto">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="relevance">Pertinence</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Meilleures notes</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center space-x-2 bg-gris-canon-de-fusil/10 p-1 rounded-xl border border-gris-canon-de-fusil/5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-blanc text-bleu-saphir shadow-xs font-bold"
                    : "text-gris-canon-de-fusil/40 hover:text-gris-canon-de-fusil/70"
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-blanc text-bleu-saphir shadow-xs font-bold"
                    : "text-gris-canon-de-fusil/40 hover:text-gris-canon-de-fusil/70"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Area */}
      {sortedResults.length === 0 ? (
        <div className="text-center py-16 bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl shadow-xs max-w-xl mx-auto px-4">
          <div className="text-gris-canon-de-fusil/20 mb-4">
            <Search className="h-14 w-14 mx-auto" />
          </div>
          <h3 className="text-lg font-black text-gris-canon-de-fusil mb-1">
            {query ? "Aucun résultat trouvé" : "Aucun produit disponible"}
          </h3>
          <p className="text-xs sm:text-sm text-gris-canon-de-fusil/50 mb-6 leading-relaxed">
            {query
              ? `Aucun produit ne correspond à votre recherche "${query}"`
              : "Essayez de modifier vos filtres ou de revenir plus tard."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-3 bg-bleu-saphir text-blanc rounded-xl text-xs font-bold hover:bg-bleu-saphir/90 shadow-sm transition-colors cursor-pointer"
          >
            Découvrir tous nos produits
          </Link>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {sortedResults.map((product) =>
            viewMode === "grid" ? (
              <ProductCard key={product.id} product={product} />
            ) : (
              <ProductListItem key={product.id} product={product} />
            ),
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
