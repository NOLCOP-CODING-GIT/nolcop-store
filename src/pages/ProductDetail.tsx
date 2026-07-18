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
import { useCart } from "../hooks/useCart";
import { supabase } from "../supabaseClient";

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "reviews" | "specs"
  >("description");

  const { addToCart } = useCart();

  const productColors =
    product?.specifications?.colors || product?.specifications?.Colors;
  const productSizes =
    product?.specifications?.sizes || product?.specifications?.Sizes;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select(
            `
            id, 
            name, 
            description, 
            price, 
            discount, 
            images, 
            stock, 
            rating, 
            reviews, 
            reviews_list,
            featured, 
            specifications, 
            created_at, 
            updated_at,
            category:categories(name)
          `,
          )
          .eq("id", id)
          .single();

        if (error) throw error;

        if (data && isMounted) {
          let parsedImages: string[] = [];
          try {
            if (Array.isArray(data.images)) {
              parsedImages = data.images;
            } else if (typeof data.images === "string") {
              if (data.images.startsWith("[")) {
                parsedImages = JSON.parse(data.images);
              } else {
                parsedImages = data.images
                  .split(",")
                  .map((img: string) => img.trim());
              }
            }
          } catch (e) {
            console.error("Erreur parsing images:", e);
          }

          const formattedProduct = {
            id: data.id,
            name: data.name,
            description: data.description,
            price: data.price,
            discount: data.discount,
            category: Array.isArray(data.category)
              ? (data.category[0] as any)?.name || "Général"
              : (data.category as any)?.name || "Général",
            images: parsedImages,
            stock: data.stock,
            rating: data.rating,
            reviews: data.reviews,
            reviews_list: data.reviews_list,
            featured: data.featured,
            specifications: data.specifications,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
          };

          setProduct(formattedProduct);

          const colors =
            formattedProduct.specifications?.colors ||
            formattedProduct.specifications?.Colors;
          const sizes =
            formattedProduct.specifications?.sizes ||
            formattedProduct.specifications?.Sizes;
          if (colors && colors.length > 0) setSelectedColor(colors[0]);
          if (sizes && sizes.length > 0) setSelectedSize(sizes[0]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du produit:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      isMounted = false;
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
          <div className="absolute h-12 w-12 rounded-full border-4 border-gris-canon-de-fusil/5"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-bleu-saphir"></div>
        </div>
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
      <div className="bg-blanc border-b border-gris-canon-de-fusil/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gris-canon-de-fusil/50 font-medium">
            <Link
              to="/"
              className="flex items-center hover:text-bleu-saphir transition-colors duration-200"
            >
              <Home className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Accueil</span>
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
            <Link
              to="/products"
              className="hover:text-bleu-saphir transition-colors duration-200"
            >
              Produits
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0" />
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
            <span className="text-gris-canon-de-fusil font-bold truncate max-w-[150px] sm:max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-gris-canon-de-fusil/5 border border-gris-canon-de-fusil/5">
              <img
                src={
                  product.images && product.images[selectedImage]
                    ? product.images[selectedImage]
                    : "/images/placeholder.png"
                }
                alt={product.name}
                className="w-full h-96 object-cover transition-all duration-300"
              />

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

              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {product.images
                    .slice(0, 4)
                    .map((_: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`w-3 h-3 rounded-full border-2 transition-colors ${
                          index === selectedImage
                            ? "bg-blanc border-bleu-saphir"
                            : "bg-blanc/50 border-gris-canon-de-fusil/20"
                        }`}
                        aria-label={`Afficher l'image ${index + 1}`}
                      />
                    ))}
                </div>
              )}
            </div>

            <div className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl p-6 shadow-xs">
              <h2 className="text-lg font-bold text-gris-canon-de-fusil mb-4">
                Options
              </h2>

              {productColors && productColors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gris-canon-de-fusil/50 uppercase tracking-wider mb-3">
                    Couleur
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {productColors.map((color: string) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl border-2 transition-colors flex items-center gap-2 ${
                          selectedColor === color
                            ? "border-bleu-saphir bg-bleu-saphir text-blanc"
                            : "border-gris-canon-de-fusil/10 hover:border-bleu-saphir/40 text-gris-canon-de-fusil/70"
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-current"
                          style={{ backgroundColor: color.toLowerCase() }}
                        />
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {productSizes && productSizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xs font-bold text-gris-canon-de-fusil/50 uppercase tracking-wider mb-3">
                    Taille
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {productSizes.map((size: string) => (
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

          <div className="space-y-6">
            <div className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h1 className="text-left text-2xl sm:text-3xl font-black text-gris-canon-de-fusil mb-4 leading-tight">
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

                <div className="text-left sm:text-right shrink-0 flex flex-col items-start sm:items-end justify-center">
                  <div className="flex items-baseline gap-2">
                    {product.discount && (
                      <span className="text-sm text-gris-canon-de-fusil/40 line-through font-semibold whitespace-nowrap">
                        {formatCurrency(product.price)}
                      </span>
                    )}
                    <span className="text-2xl sm:text-3xl font-black text-bleu-saphir whitespace-nowrap tracking-tight">
                      {formatCurrency(product.discount || product.price)}
                    </span>
                  </div>
                  {product.discount && (
                    <span className="bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 text-xs font-bold rounded mt-1 whitespace-nowrap">
                      Économisez{" "}
                      {formatCurrency(product.price - product.discount)}
                    </span>
                  )}
                </div>
              </div>
            </div>

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

              <div className="p-6">
                {activeTab === "description" && (
                  <div className="space-y-6">
                    <p className="text-sm text-gris-canon-de-fusil/70 leading-relaxed">
                      {product.description}
                    </p>

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
                    {product.reviews_list &&
                    Array.isArray(product.reviews_list) &&
                    product.reviews_list.length > 0 ? (
                      product.reviews_list.map((rev: any, index: number) => {
                        const clientName =
                          rev.user_name || rev.client || "Client Anonyme";
                        const initials = clientName
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2);
                        return (
                          <div
                            key={rev.id || index}
                            className="border-b border-gris-canon-de-fusil/5 pb-4 last:border-b-0 last:pb-0"
                          >
                            <div className="flex items-start space-x-4">
                              <div className="w-9 h-9 bg-gris-canon-de-fusil/5 border border-gris-canon-de-fusil/10 rounded-full flex items-center justify-center text-xs font-black text-gris-canon-de-fusil/60 shrink-0">
                                {initials}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
                                  <div className="flex items-center text-amber-500">
                                    {renderStars(rev.rating || 5)}
                                  </div>
                                  <span className="text-[10px] font-semibold text-gris-canon-de-fusil/40">
                                    {rev.created_at
                                      ? new Date(
                                          rev.created_at,
                                        ).toLocaleDateString("fr-BJ")
                                      : "Récemment"}
                                  </span>
                                </div>
                                <p className="text-xs text-gris-canon-de-fusil/70 leading-relaxed">
                                  {rev.comment ||
                                    rev.text ||
                                    "Aucun commentaire laissé."}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-gris-canon-de-fusil/50 italic py-2">
                        Aucun avis n'a encore été laissé pour ce produit.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "specs" && product.specifications && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-gris-canon-de-fusil mb-4">
                      Spécifications techniques
                    </h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Array.isArray(product.specifications)
                        ? product.specifications
                            .filter(
                              (item: any) =>
                                item &&
                                ![
                                  "colors",
                                  "Colors",
                                  "sizes",
                                  "Sizes",
                                ].includes(item.name),
                            )
                            .map((item: any, index: number) => (
                              <div
                                key={index}
                                className="border-b border-gris-canon-de-fusil/5 pb-2"
                              >
                                <dt className="text-[10px] font-bold text-gris-canon-de-fusil/40 uppercase tracking-wider">
                                  {item.name}
                                </dt>
                                <dd className="text-xs font-extrabold text-gris-canon-de-fusil/80 mt-0.5">
                                  {item.description}
                                </dd>
                              </div>
                            ))
                        : Object.entries(product.specifications)
                            .filter(
                              ([key]) =>
                                ![
                                  "colors",
                                  "Colors",
                                  "sizes",
                                  "Sizes",
                                ].includes(key),
                            )
                            .map(([key, value]) => (
                              <div
                                key={key}
                                className="border-b border-gris-canon-de-fusil/5 pb-2"
                              >
                                <dt className="text-[10px] font-bold text-gris-canon-de-fusil/40 uppercase tracking-wider">
                                  {key}
                                </dt>
                                <dd className="text-xs font-extrabold text-gris-canon-de-fusil/80 mt-0.5">
                                  {value && typeof value === "object"
                                    ? (value as any).description ||
                                      JSON.stringify(value)
                                    : String(value)}
                                </dd>
                              </div>
                            ))}
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
