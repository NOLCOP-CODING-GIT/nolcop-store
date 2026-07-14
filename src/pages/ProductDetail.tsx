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
  ChevronRight,
  Home,
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
        name: "MacBook Pro 14",
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
        selectedSize || undefined,
      );
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating)
            ? "text-amber-500 fill-current"
            : "text-gris-canon-de-fusil/20"
        }`}
      />
    ));
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
            Chargement du produit...
          </h5>
          <p className="text-xs text-gris-canon-de-fusil/50 mt-1">
            Veuillez patienter un instant...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blanc">
        <div className="text-center">
          <h1 className="text-2xl font-black text-gris-canon-de-fusil mb-4">
            Produit non trouvé
          </h1>
          <Link
            to="/"
            className="text-bleu-saphir hover:text-bleu-saphir/80 font-bold text-sm"
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
    <div className="min-h-screen bg-blanc">
      {/* Header avec breadcrumb */}
      <div className="bg-blanc border-b border-gris-canon-de-fusil/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gris-canon-de-fusil/50 font-medium">
            {/* Accueil */}
            <Link
              to="/"
              className="flex items-center hover:text-bleu-saphir transition-colors duration-200"
            >
              <Home className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Accueil</span>
            </Link>

            <ChevronRight className="h-3.5 w-3.5 shrink-0" />

            {/* Boutique / Produits */}
            <Link
              to="/products"
              className="hover:text-bleu-saphir transition-colors duration-200"
            >
              Produits
            </Link>

            <ChevronRight className="h-3.5 w-3.5 shrink-0" />

            {/* Catégorie dynamique du produit */}
            {product.category && (
              <>
                <Link
                  to={`/category/${product.category.toLowerCase()}`}
                  className="hover:text-bleu-saphir transition-colors duration-200 capitalize"
                >
                  {product.category}
                </Link>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              </>
            )}

            {/* Nom du produit actif */}
            <span className="text-gris-canon-de-fusil font-bold truncate max-w-[150px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Images produit */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-gris-canon-de-fusil/5 border border-gris-canon-de-fusil/5">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover"
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.featured && (
                  <span className="bg-bleu-saphir text-blanc px-3 py-1 text-xs font-bold rounded-full shadow-sm">
                    Vedette
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="bg-rose-600 text-blanc px-3 py-1 text-xs font-bold rounded-full shadow-sm">
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
                          ? "bg-blanc border-bleu-saphir"
                          : "bg-blanc/50 border-gris-canon-de-fusil/20"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl p-6 shadow-xs">
              <h2 className="text-lg font-bold text-gris-canon-de-fusil mb-4">
                Options
              </h2>

              {/* Couleurs */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gris-canon-de-fusil/50 uppercase tracking-wider mb-3">
                    Couleur
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-xl border-2 transition-colors ${
                          selectedColor === color
                            ? "border-bleu-saphir bg-bleu-saphir/5"
                            : "border-gris-canon-de-fusil/10 hover:border-bleu-saphir/40"
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
                  <h3 className="text-xs font-bold text-gris-canon-de-fusil/50 uppercase tracking-wider mb-3">
                    Taille
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border-2 transition-colors ${
                          selectedSize === size
                            ? "border-bleu-saphir bg-bleu-saphir text-blanc"
                            : "border-gris-canon-de-fusil/10 hover:border-bleu-saphir/40 text-gris-canon-de-fusil/70"
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
                <h3 className="text-xs font-bold text-gris-canon-de-fusil/50 uppercase tracking-wider mb-3">
                  Quantité
                </h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl border border-gris-canon-de-fusil/10 hover:border-gris-canon-de-fusil/30 flex items-center justify-center text-gris-canon-de-fusil"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-gris-canon-de-fusil">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(product.stock, quantity + 1))
                    }
                    className="w-10 h-10 rounded-xl border border-gris-canon-de-fusil/10 hover:border-gris-canon-de-fusil/30 flex items-center justify-center text-gris-canon-de-fusil"
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
                  className={`flex-1 flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm transition-colors ${
                    product.stock === 0
                      ? "bg-gris-canon-de-fusil/10 text-gris-canon-de-fusil/30 cursor-not-allowed"
                      : "bg-bleu-saphir text-blanc hover:bg-bleu-saphir/90"
                  }`}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock === 0
                    ? "Rupture de stock"
                    : "Ajouter au panier"}
                </button>

                <button
                  className="p-3.5 rounded-xl border border-gris-canon-de-fusil/10 text-gris-canon-de-fusil/40 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-colors"
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
            <div className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-gris-canon-de-fusil mb-2 leading-tight">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center text-amber-500">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-xs font-bold text-gris-canon-de-fusil/50">
                      {product.rating} ({product.reviews} avis)
                    </span>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  {product.discount && (
                    <span className="text-sm text-gris-canon-de-fusil/40 line-through mr-2 block sm:inline font-semibold">
                      {product.price.toFixed(2)} €
                    </span>
                  )}
                  <span className="text-2xl sm:text-3xl font-black text-bleu-saphir">
                    {(product.discount || product.price).toFixed(2)} €
                  </span>
                  {product.discount && (
                    <span className="ml-2 bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 text-xs font-bold rounded block sm:inline-block mt-1 sm:mt-0">
                      Économisez {(product.price - product.discount).toFixed(2)}{" "}
                      €
                    </span>
                  )}
                </div>
              </div>

              {/* Stock */}
              <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-gris-canon-de-fusil/5">
                <span className="text-gris-canon-de-fusil/50">
                  Stock: {product.stock} articles
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wide ${
                    product.stock > 10
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : product.stock > 0
                        ? "bg-amber-50 text-amber-700 border border-amber-100"
                        : "bg-rose-50 text-rose-700 border border-rose-100"
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
            <div className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl overflow-hidden shadow-xs">
              <div className="border-b border-gris-canon-de-fusil/5 bg-gris-canon-de-fusil/5/30 px-2 flex items-center justify-between">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`p-3 text-[10px] font-black uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === "description"
                      ? "border-bleu-saphir text-bleu-saphir"
                      : "border-transparent text-gris-canon-de-fusil/40 hover:text-gris-canon-de-fusil"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`p-3 text-[10px] font-black uppercase tracking-wider border-b-2 transition-colors ${
                    activeTab === "reviews"
                      ? "border-bleu-saphir text-bleu-saphir"
                      : "border-transparent text-gris-canon-de-fusil/40 hover:text-gris-canon-de-fusil"
                  }`}
                >
                  Avis ({product.reviews})
                </button>
                {product.specifications && (
                  <button
                    onClick={() => setActiveTab("specs")}
                    className={`p-3 text-[10px] font-black uppercase tracking-wider border-b-2 transition-colors ${
                      activeTab === "specs"
                        ? "border-bleu-saphir text-bleu-saphir"
                        : "border-transparent text-gris-canon-de-fusil/40 hover:text-gris-canon-de-fusil"
                    }`}
                  >
                    Spécifications
                  </button>
                )}
              </div>

              {/* Contenu des onglets */}
              <div className="p-6">
                {activeTab === "description" && (
                  <div className="space-y-6">
                    <p className="text-sm text-gris-canon-de-fusil/70 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Features */}
                    <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gris-canon-de-fusil/5">
                      <div className="flex items-center space-x-3">
                        <Truck className="h-5 w-5 text-bleu-saphir" />
                        <span className="text-xs font-bold text-gris-canon-de-fusil/70">
                          Livraison gratuite
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-bleu-saphir" />
                        <span className="text-xs font-bold text-gris-canon-de-fusil/70">
                          Garantie 2 ans
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RefreshCw className="h-5 w-5 text-bleu-saphir" />
                        <span className="text-xs font-bold text-gris-canon-de-fusil/70">
                          Retours faciles
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-bleu-saphir" />
                        <span className="text-xs font-bold text-gris-canon-de-fusil/70">
                          Emballage cadeau
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-gris-canon-de-fusil mb-4">
                      Avis clients
                    </h3>
                    {[1, 2, 3].map((review) => (
                      <div
                        key={review}
                        className="border-b border-gris-canon-de-fusil/5 pb-4 last:border-b-0 last:pb-0"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-9 h-9 bg-gris-canon-de-fusil/5 border border-gris-canon-de-fusil/10 rounded-full flex items-center justify-center text-xs font-black text-gris-canon-de-fusil/60 shrink-0">
                            JD
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
                              <div className="flex items-center text-amber-500">
                                {renderStars(4)}
                              </div>
                              <span className="text-[10px] font-semibold text-gris-canon-de-fusil/40">
                                il y a {review * 5} jours
                              </span>
                            </div>
                            <p className="text-xs text-gris-canon-de-fusil/70 leading-relaxed">
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
                    <h3 className="text-sm font-extrabold text-gris-canon-de-fusil mb-4">
                      Spécifications techniques
                    </h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="border-b border-gris-canon-de-fusil/5 pb-2"
                          >
                            <dt className="text-[10px] font-bold text-gris-canon-de-fusil/40 uppercase tracking-wider">
                              {key}
                            </dt>
                            <dd className="text-xs font-extrabold text-gris-canon-de-fusil/80 mt-0.5">
                              {value as string}
                            </dd>
                          </div>
                        ),
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
