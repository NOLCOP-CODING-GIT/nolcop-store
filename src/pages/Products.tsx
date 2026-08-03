import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types";
import { supabase } from "../supabaseClient";

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("name");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSearchTerm(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      setLoading(true);
      try {
        const { data: productsData } = await supabase
          .from("products")
          .select("*, category:categories(name)");

        if (productsData) {
          const formattedProducts = productsData.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            discount: p.discount,
            category: p.category?.name || "Général",
            images: p.images,
            qte_min: Number(p.qte_min) || 1,
            rating: p.rating,
            reviews: p.reviews,
            featured: p.featured,
            specifications: p.specifications,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
          }));
          setAllProducts(formattedProducts as Product[]);

          const uniqueCategories = Array.from(
            new Set(formattedProducts.map((p) => p.category).filter(Boolean)),
          );
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des produits:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndCategories();
  }, []);

  useEffect(() => {
    let result = [...allProducts];

    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q),
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter(
        (product) =>
          product.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, allProducts]);

  const sortedResults = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

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
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-blanc">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-gris-canon-de-fusil mb-2 leading-tight">
          {searchTerm ? `Résultats pour "${searchTerm}"` : "Tous les produits"}
        </h1>
        <p className="text-xs sm:text-sm text-gris-canon-de-fusil/50 font-medium">
          {sortedResults.length}{" "}
          {sortedResults.length === 1 ? "produit" : "produits"} trouvé
          {sortedResults.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-md">
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
                placeholder="Rechercher par produit ou catégorie..."
                className="w-full pl-10 pr-4 py-2 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-bleu-saphir text-sm text-gris-canon-de-fusil bg-blanc"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filtre par catégories */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-bleu-saphir text-sm font-semibold text-gris-canon-de-fusil/80 bg-blanc cursor-pointer"
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Filtre de tri */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-bleu-saphir text-sm font-semibold text-gris-canon-de-fusil/80 bg-blanc cursor-pointer"
            >
              <option value="name">Nom (A-Z)</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Meilleures notes</option>
            </select>
          </div>
        </div>
      </div>

      {sortedResults.length === 0 ? (
        <div className="text-center py-16 bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl shadow-xs max-w-xl mx-auto px-4">
          <div className="text-gris-canon-de-fusil/20 mb-4">
            <Search className="h-14 w-14 mx-auto" />
          </div>
          <h3 className="text-lg font-black text-gris-canon-de-fusil mb-1">
            {searchTerm ? "Aucun résultat trouvé" : "Aucun produit disponible"}
          </h3>
          <p className="text-xs sm:text-sm text-gris-canon-de-fusil/50 mb-6 leading-relaxed">
            {searchTerm
              ? `Aucun produit ne correspond à votre recherche "${searchTerm}"`
              : "Essayez de modifier vos filtres ou de revenir plus tard."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          {sortedResults.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
