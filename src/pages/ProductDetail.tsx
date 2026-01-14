import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Star,
  Package,
  Truck,
  Shield,
  RefreshCw,
} from "lucide-react";
import type { Product } from "../types";
import { useCart } from "../hooks/useCart";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "reviews" | "specs"
  >("description");

  const { addToCart } = useCart();

  useEffect(() => {
    let isMounted = true;

    // Mock data - In real app, this would come from your database
    const mockProducts: Product[] = [
      {
        id: "1",
        name: 'MacBook Pro 14"',
        description:
          "Ordinateur portable puissant avec puce M3 Pro, écran Liquid Retina XDR, 16 Go RAM, 512 Go SSD",
        price: 1999.99,
        category: "Électronique",
        image:
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
        images: [
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600",
          "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop",
        ],
        stock: 15,
        rating: 4.8,
        reviews: 124,
        featured: true,
        colors: ["Space Gray", "Silver"],
        specifications: {
          Écran: '14.2" Liquid Retina XDR',
          Processeur: "Apple M3 Pro",
          Mémoire: "16 Go RAM unifiée",
          Stockage: "512 Go SSD",
          Autonomie: "Jusqu'à 18 heures",
          Poids: "1.6 kg",
        },
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-15T10:00:00Z",
      },
    ];

    // Simulate async operation
    const foundProduct = mockProducts.find((p) => p.id === id);

    // Use setTimeout to simulate async behavior and prevent cascading renders
    const timer = setTimeout(() => {
      if (isMounted) {
        setProduct(foundProduct || null);
        setLoading(false);
      }
    }, 0);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(
        product,
        quantity,
        selectedColor || undefined,
        selectedSize || undefined
      );
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Produit non trouvé
          </h1>
          <Link
            to="/"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = product.discount
    ? Math.round(((product.price - product.discount) / product.price) * 100)
    : 0;

  return (
    <div className="min-h-screen">
      {/* Header avec breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Accueil
            </Link>
            <span className="text-gray-300">/</span>
            <Link
              to={`/category/${product.category.toLowerCase()}`}
              className="text-gray-500 hover:text-gray-700"
            >
              {product.category}
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images produit */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && (
                  <span className="bg-indigo-600 text-white px-3 py-1 text-sm font-medium rounded-full">
                    Vedette
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="bg-red-600 text-white px-3 py-1 text-sm font-medium rounded-full">
                    -{discountPercentage}%
                  </span>
                )}
              </div>

              {/* Miniatures */}
              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {product.images.slice(0, 4).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        /* TODO: Implementer changement d'image */
                      }}
                      className={`w-3 h-3 rounded-full border-2 transition-colors ${
                        index === 0
                          ? "bg-white border-indigo-600"
                          : "bg-white/50 border-gray-300"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Options
              </h2>

              {/* Couleurs */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Couleur
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-lg border-2 transition-colors ${
                          selectedColor === color
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-300 hover:border-indigo-400"
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Tailles */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Taille
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          selectedSize === size
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-gray-300 hover:border-indigo-400 text-gray-700"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantité */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Quantité
                </h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-16 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    product.stock === 0
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.stock === 0
                    ? "Rupture de stock"
                    : "Ajouter au panier"}
                </button>

                <button
                  className="p-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                  title="Ajouter aux favoris"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            {/* Prix et rating */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      {renderStars(product.rating)}
                      <span className="ml-2 text-gray-600">
                        {product.rating} ({product.reviews} avis)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {product.discount && (
                    <span className="text-lg text-gray-500 line-through mr-2">
                      {product.price.toFixed(2)} €
                    </span>
                  )}
                  <span className="text-3xl font-bold text-indigo-600">
                    {(product.discount || product.price).toFixed(2)} €
                  </span>
                  {product.discount && (
                    <span className="ml-2 bg-red-600 text-white px-2 py-1 text-sm font-medium rounded">
                      Économisez {(product.price - product.discount).toFixed(2)}{" "}
                      €
                    </span>
                  )}
                </div>
              </div>

              {/* Stock */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Stock: {product.stock} articles</span>
                <span
                  className={`px-3 py-1 rounded-full font-medium ${
                    product.stock > 10
                      ? "bg-green-100 text-green-800"
                      : product.stock > 0
                        ? "bg-orange-100 text-orange-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock > 10
                    ? "Disponible"
                    : product.stock > 0
                      ? "Stock limité"
                      : "Rupture de stock"}
                </span>
              </div>
            </div>

            {/* Onglets */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`py-4 px-6 border-b-2 font-medium transition-colors ${
                      activeTab === "description"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`py-4 px-6 border-b-2 font-medium transition-colors ${
                      activeTab === "reviews"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Avis ({product.reviews})
                  </button>
                  {product.specifications && (
                    <button
                      onClick={() => setActiveTab("specs")}
                      className={`py-4 px-6 border-b-2 font-medium transition-colors ${
                        activeTab === "specs"
                          ? "border-indigo-600 text-indigo-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Spécifications
                    </button>
                  )}
                </nav>
              </div>

              {/* Contenu des onglets */}
              <div className="p-6">
                {activeTab === "description" && (
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Features */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Truck className="h-5 w-5 text-indigo-600" />
                        <span className="text-sm text-gray-600">
                          Livraison gratuite
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-indigo-600" />
                        <span className="text-sm text-gray-600">
                          Garantie 2 ans
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RefreshCw className="h-5 w-5 text-indigo-600" />
                        <span className="text-sm text-gray-600">
                          Retours faciles
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-indigo-600" />
                        <span className="text-sm text-gray-600">
                          Emballage cadeau
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Avis clients
                    </h3>
                    {/* Mock reviews */}
                    {[1, 2, 3].map((review) => (
                      <div
                        key={review}
                        className="border-b border-gray-200 pb-4 last:border-b-0"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold">JD</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              {renderStars(4)}
                              <span className="ml-2 text-sm text-gray-500">
                                il y a {review * 5} jours
                              </span>
                            </div>
                            <p className="text-gray-700">
                              Excellent produit, correspond parfaitement à la
                              description. Livraison rapide et emballage soigné.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "specs" && product.specifications && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Spécifications techniques
                    </h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="border-b border-gray-200 pb-2"
                          >
                            <dt className="text-sm font-medium text-gray-500">
                              {key}
                            </dt>
                            <dd className="text-sm text-gray-900">{value}</dd>
                          </div>
                        )
                      )}
                    </dl>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
