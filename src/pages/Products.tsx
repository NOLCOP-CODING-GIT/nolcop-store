import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Grid, List } from "lucide-react";
import { useCart } from "../hooks/useCart"; // Importation du hook
import ProductCard from "../components/ProductCard"; // Import global
import type { Product } from "../types";
import { supabase } from "../supabaseClient";

const Products: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupération de l'état global du panier
  const { state, addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data: productsData } = await supabase
          .from('products')
          .select('*, category:categories(name)');

        if (productsData) {
          const formattedProducts = productsData.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            discount: p.discount,
            category: p.category?.name || "Général",
            images: p.images,
            stock: p.stock,
            rating: p.rating,
            reviews: p.reviews,
            featured: p.featured,
            specifications: p.specifications,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
          }));
          setAllProducts(formattedProducts as Product[]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (allProducts.length === 0) return;

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
  }, [query, allProducts]);

  const sortedResults = [...searchResults].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "relevance":
      default:
        const aScore = a.name.toLowerCase().includes(query.toLowerCase())
          ? 2
          : 0;
        const bScore = b.name.toLowerCase().includes(query.toLowerCase())
          ? 2
          : 0;
        return bScore - aScore;
    }
  });

  const ProductListItem = ({ product }: { product: Product }) => {
    const isAlreadyInCart = state.items.some(
      (item) => item.product.id === product.id,
    );
    const inStock = product.stock !== undefined ? product.stock > 0 : true;

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
          <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden bg-gris-canon-de-fusil/5 rounded-xl border border-gris-canon-de-fusil/5">
            {/* Correction : Récupération de la première image du tableau images */}
            <img
              src={product.images[0] || "/images/placeholder.png"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>

          <div className="flex-1 min-w-0 space-y-2">
            {product.category && (
              <span className="inline-block text-[10px] font-black uppercase tracking-wider text-bleu-saphir/60 bg-bleu-saphir/5 px-2.5 py-1 rounded-md">
                {product.category}
              </span>
            )}

            <h3 className="text-base sm:text-lg font-bold text-gris-canon-de-fusil leading-tight truncate">
              {product.name}
            </h3>

            {product.description && (
              <p className="text-xs sm:text-sm text-gris-canon-de-fusil/60 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
            )}

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

          <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 pt-4 sm:pt-0 border-t sm:border-t-0 border-gris-canon-de-fusil/5 shrink-0">
            <div className="sm:text-right">
              <p className="text-xl sm:text-2xl font-black text-bleu-saphir">
                {formatPrice(product.price)}
              </p>
            </div>
            <button
              disabled={isAlreadyInCart || !inStock}
              onClick={() => addToCart(product as any, 1)}
              className={`px-5 py-2.5 rounded-xl transition-colors shadow-xs text-xs font-bold whitespace-nowrap ${
                !inStock
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : isAlreadyInCart
                    ? "bg-green-100 text-green-600 border border-green-200 cursor-not-allowed"
                    : "bg-bleu-saphir text-blanc hover:bg-bleu-saphir/90 cursor-pointer"
              }`}
            >
              {isAlreadyInCart
                ? "Déjà au panier"
                : !inStock
                  ? "Rupture de stock"
                  : "Ajouter au panier"}
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
          <div className="absolute h-12 w-12 rounded-full border-4 border-gris-canon-de-fusil/5"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-bleu-saphir"></div>
        </div>

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
          {sortedResults.length === 1 ? "produit" : "produits"} trouvé
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
              <ProductCard key={product.id} product={product} /> // Utilise le ProductCard importé avec Framer Motion !
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
