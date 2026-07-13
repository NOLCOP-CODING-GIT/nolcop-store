import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, List, Search, Star, ShoppingCart } from "lucide-react";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");

  // Mapping des slugs vers les noms de catégories
  const categoryNames: Record<string, string> = {
    electronics: "Électronique",
    fashion: "Mode",
    home: "Maison",
    sports: "Sports",
    software: "Logiciels",
  };

  const categoryName = categoryNames[slug || ""] || "Catégorie";

  // Produits simulés pour la démo
  const [products] = useState<Product[]>([
    {
      id: "1",
      name: "iPhone 15 Pro",
      description:
        "Le summum de la technologie mobile avec châssis en titane et puce A17 Pro.",
      price: 650000, // Prix adapté en Francs CFA
      image:
        "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=300",
      category: "Électronique",
      stock: 12,
      rating: 4.5,
      reviews: 234,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "MacBook Air M2",
      description:
        "Incroyablement fin, rapide et silencieux avec une autonomie record de 18 heures.",
      price: 850000, // Prix adapté en Francs CFA
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300",
      category: "Électronique",
      stock: 8,
      rating: 4.8,
      reviews: 156,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Apple Watch Series 9",
      description:
        "Votre compagnon idéal pour la santé, le sport et une connectivité toujours active.",
      price: 295000, // Prix adapté en Francs CFA
      image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=300",
      category: "Électronique",
      stock: 15,
      rating: 4.6,
      reviews: 89,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "4",
      name: "AirPods Pro",
      description:
        "Réduction active du bruit deux fois plus performante et audio spatial personnalisé.",
      price: 165000, // Prix adapté en Francs CFA
      image:
        "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300",
      category: "Électronique",
      stock: 25,
      rating: 4.4,
      reviews: 312,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "5",
      name: "iPad Air",
      description:
        "Écran Liquid Retina immersif de 10,9 pouces et puissance phénoménale de la puce M1.",
      price: 395000, // Prix adapté en Francs CFA
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300",
      category: "Électronique",
      stock: 10,
      rating: 4.7,
      reviews: 178,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "6",
      name: "Samsung Galaxy S24",
      description:
        "Découvrez l'ère de la puissance mobile assistée par intelligence artificielle (Galaxy AI).",
      price: 590000, // Prix adapté en Francs CFA
      image:
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=300",
      category: "Électronique",
      stock: 14,
      rating: 4.3,
      reviews: 267,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]);

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating;
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  const ProductListItem = ({ product }: { product: Product }) => {
    // Formateur de prix FCFA (Bénin / XOF)
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat("fr-BJ", {
        style: "currency",
        currency: "XOF",
        maximumFractionDigits: 0,
      }).format(price);
    };

    return (
      <div className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl p-4 hover:shadow-md transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row items-center sm:space-x-4 space-y-4 sm:space-y-0">
          {/* Image du produit */}
          <img
            src={product.image}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-xl shrink-0"
          />

          {/* Détails du produit */}
          <div className="flex-1 text-center sm:text-left space-y-1">
            <h3 className="text-base font-bold text-gris-canon-de-fusil">
              {product.name}
            </h3>

            {/* Étoiles de notation */}
            <div className="flex items-center justify-center sm:justify-start space-x-1">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(product.rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gris-canon-de-fusil/20"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-gris-canon-de-fusil/50">
                {product.rating} ({product.reviews} avis)
              </span>
            </div>

            <p className="text-xs text-gris-canon-de-fusil/60">
              {product.category}
            </p>
          </div>

          {/* Prix et Bouton d'action */}
          <div className="text-center sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-gris-canon-de-fusil/5">
            <p className="text-xl font-extrabold text-bleu-saphir mb-0 sm:mb-2">
              {formatPrice(product.price)}
            </p>
            <button className="flex items-center space-x-2 px-4 py-2.5 bg-bleu-saphir text-blanc rounded-xl hover:bg-bleu-saphir/90 transition-colors shadow-xs cursor-pointer text-sm font-semibold">
              <ShoppingCart className="h-4 w-4" />
              <span>Ajouter</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-blanc">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gris-canon-de-fusil mb-2">
          {categoryName}
        </h1>
        <p className="text-sm text-gris-canon-de-fusil/60">
          Découvrez notre sélection de {sortedProducts.length} produits dans
          cette catégorie
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-blanc rounded-2xl border border-gris-canon-de-fusil/5 p-4 mb-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gris-canon-de-fusil/40" />
              <input
                type="text"
                placeholder="Rechercher dans cette catégorie..."
                className="w-full pl-10 pr-4 py-2 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-bleu-saphir text-sm text-gris-canon-de-fusil"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between lg:justify-end space-x-4 w-full lg:w-auto">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-bleu-saphir text-sm font-semibold text-gris-canon-de-fusil/80 bg-blanc cursor-pointer"
            >
              <option value="name">Nom</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Meilleures notes</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center space-x-2 bg-gris-canon-de-fusil/[0.03] p-1 rounded-xl border border-gris-canon-de-fusil/5">
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

      {/* Products Section */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-16 bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl shadow-xs">
          <div className="text-gris-canon-de-fusil/20 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-bold text-gris-canon-de-fusil mb-1">
            Aucun produit trouvé
          </h3>
          <p className="text-sm text-gris-canon-de-fusil/50">
            Essayez de modifier vos filtres ou votre recherche.
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {sortedProducts.map((product) =>
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

export default CategoryPage;
