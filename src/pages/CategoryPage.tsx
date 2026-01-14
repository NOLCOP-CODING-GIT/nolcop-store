import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Grid, List, Search, SlidersHorizontal } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  featured?: boolean;
}

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showFilters, setShowFilters] = useState(false);

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
      price: 999.99,
      image:
        "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=300",
      category: "Électronique",
      rating: 4.5,
      reviews: 234,
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
    },
    {
      id: "3",
      name: "Apple Watch Series 9",
      price: 449.99,
      image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=300",
      category: "Électronique",
      rating: 4.6,
      reviews: 89,
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
    },
    {
      id: "5",
      name: "iPad Air",
      price: 599.99,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300",
      category: "Électronique",
      rating: 4.7,
      reviews: 178,
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
    },
  ]);

  const filteredProducts = products.filter(
    (product) =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
  );

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

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {product.featured && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Populaire
          </span>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {product.name}
        </h3>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {product.rating} ({product.reviews} avis)
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-indigo-600">
            {product.price.toFixed(2)} €
          </p>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );

  const ProductListItem = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
      <div className="flex items-center space-x-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-24 h-24 object-cover rounded-md"
        />

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {product.name}
          </h3>

          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {product.rating} ({product.reviews} avis)
            </span>
          </div>

          <p className="text-sm text-gray-600">{product.category}</p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold text-indigo-600 mb-2">
            {product.price.toFixed(2)} €
          </p>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Ajouter au panier
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {categoryName}
        </h1>
        <p className="text-gray-600">
          Découvrez notre sélection de {sortedProducts.length} produits dans
          cette catégorie
        </p>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans cette catégorie..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="name">Nom</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Meilleures notes</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-indigo-100 text-indigo-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-indigo-100 text-indigo-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded"
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-20 px-2 py-1 border border-gray-300 rounded"
                    placeholder="Max"
                  />
                </div>
              </div>

              {/* Add more filters here */}
            </div>
          </div>
        )}
      </div>

      {/* Products */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun produit trouvé
          </h3>
          <p className="text-gray-600">
            Essayez de modifier vos filtres ou votre recherche
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
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
