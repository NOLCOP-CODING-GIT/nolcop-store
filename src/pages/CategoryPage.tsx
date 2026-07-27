import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Search } from "lucide-react";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";
import { supabase } from "../supabaseClient";

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [sortBy, setSortBy] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");

  useEffect(() => {
    let isMounted = true;

    const fetchCategoryProducts = async () => {
      if (!slug) return;

      setLoading(true);
      try {
        const { data: categoryData } = await supabase
          .from("categories")
          .select("id, name")
          .eq("slug", slug)
          .single();

        if (categoryData && isMounted) {
          setCategoryName(categoryData.name);

          const { data: productsData } = await supabase
            .from("products")
            .select("*, category:categories(name)")
            .eq("category_id", categoryData.id);

          if (productsData) {
            const formattedProducts = productsData.map((p) => ({
              id: p.id,
              name: p.name,
              description: p.description,
              price: p.price,
              discount: p.discount,
              category: p.category?.name || categoryData.name,
              images: p.images,
              stock: p.stock,
              rating: p.rating,
              reviews: p.reviews,
              featured: p.featured,
              specifications: p.specifications,
              createdAt: p.created_at,
              updatedAt: p.updated_at,
            }));
            setProducts(formattedProducts as Product[]);
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des produits de la catégorie:",
          error,
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCategoryProducts();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const filteredProducts = products.filter((product) => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return true;
    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
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
            Chargement de la catégorie...
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
        <h1 className="text-3xl font-black text-gris-canon-de-fusil mb-2">
          {categoryName}
        </h1>
        <p className="text-sm text-gris-canon-de-fusil/60">
          Découvrez notre sélection de {sortedProducts.length} produits dans
          cette catégorie
        </p>
      </div>

      <div className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gris-canon-de-fusil/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom de produit..."
                className="w-full pl-10 pr-4 py-2 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-bleu-saphir text-sm text-gris-canon-de-fusil bg-blanc"
              />
            </div>
          </div>

          <div className="flex items-center justify-between lg:justify-end space-x-4 w-full lg:w-auto">
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
