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
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabaseClient";

interface ReviewItem {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  user?: {
    name?: string;
    email?: string;
  };
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [reviewsList, setReviewsList] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "description" | "reviews" | "specs"
  >("description");

  // État du formulaire d'avis
  const [newRating, setNewRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [newComment, setNewComment] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewMessage, setReviewMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { addToCart } = useCart();
  const { user } = useAuth();

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || !product?.images || product.images.length <= 1)
      return;

    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;
    const swipeThreshold = 55;

    if (diffX > swipeThreshold) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    } else if (diffX < -swipeThreshold) {
      setSelectedImage(
        (prev) => (prev - 1 + product.images.length) % product.images.length,
      );
    }
    setTouchStartX(null);
  };

  function formatCurrency(amount: number) {
    const validAmount = Number(amount) || 0;
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(validAmount);
  }

  const fetchReviews = async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select(
          `
          id,
          rating,
          comment,
          created_at,
          user:users(name, email)
        `,
        )
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setReviewsList(data as unknown as ReviewItem[]);
      }
    } catch (err) {
      console.error("Erreur chargement des avis:", err);
    }
  };

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

      if (data) {
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
          price: Number(data.price) || 0,
          discount: data.discount ? Number(data.discount) : 0,
          category: Array.isArray(data.category)
            ? (data.category[0] as any)?.name || "Général"
            : (data.category as any)?.name || "Général",
          images:
            parsedImages.length > 0
              ? parsedImages
              : ["/images/placeholder.png"],
          stock: Number(data.stock) || 0,
          rating: Number(data.rating) || 0,
          reviewsCount: Number(data.reviews) || 0,
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

        await fetchReviews(formattedProduct.id);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du produit:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchProduct();
    }
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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewMessage(null);

    if (!newComment.trim()) {
      setReviewMessage({
        type: "error",
        text: "Veuillez saisir un commentaire avant de valider.",
      });
      return;
    }

    setSubmittingReview(true);

    try {
      const sessionUserId = sessionStorage.getItem("nolcop_session");
      const currentUserId = user?.id || sessionUserId;

      if (!currentUserId) {
        setReviewMessage({
          type: "error",
          text: "Vous devez être connecté pour soumettre un avis.",
        });
        setSubmittingReview(false);
        return;
      }

      const { error } = await supabase.from("reviews").insert({
        product_id: product.id,
        user_id: currentUserId,
        rating: newRating,
        comment: newComment.trim(),
      });

      if (error) throw error;

      setReviewMessage({
        type: "success",
        text: "Votre avis a été enregistré avec succès !",
      });
      setNewComment("");
      setNewRating(5);

      await fetchProduct();
    } catch (err: any) {
      console.error("Erreur lors de la soumission de l'avis:", err);
      setReviewMessage({
        type: "error",
        text:
          err.message ||
          "Une erreur s'est produite lors de la publication de l'avis.",
      });
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating: number, interactive = false) => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isFilled = interactive
        ? starValue <= (hoverRating || newRating)
        : starValue <= Math.round(rating);

      return (
        <Star
          key={i}
          onClick={() => interactive && setNewRating(starValue)}
          onMouseEnter={() => interactive && setHoverRating(starValue)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          className={`h-5 w-5 transition-colors ${
            interactive ? "cursor-pointer" : ""
          } ${
            isFilled
              ? "text-amber-500 fill-current"
              : "text-gris-canon-de-fusil/20"
          }`}
        />
      );
    });
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
      <div className="min-h-screen flex items-center justify-center bg-blanc px-4">
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

  const finalPrice =
    product.discount > 0 && product.discount < product.price
      ? product.discount
      : product.price;

  const discountPercentage =
    product.discount > 0 && product.discount < product.price
      ? Math.round(((product.price - product.discount) / product.price) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-blanc">
      {/* Fil d'Ariane */}
      <div className="bg-blanc border-b border-gris-canon-de-fusil/5">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center space-x-2 text-xs sm:text-sm text-gris-canon-de-fusil/50 font-medium overflow-x-auto whitespace-nowrap">
            <Link
              to="/"
              className="flex items-center hover:text-bleu-saphir transition-colors duration-200"
            >
              <Home className="h-4 w-4 mr-1 shrink-0" />
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
                  to={`/category/${product.category
                    .toLowerCase()
                    .trim()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[\s\W-]+/g, "-")}`}
                  className="hover:text-bleu-saphir transition-colors duration-200 capitalize"
                >
                  {product.category}
                </Link>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
              </>
            )}
            <span className="text-gris-canon-de-fusil font-bold truncate max-w-45 sm:max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visualiseur d'images */}
          <div className="lg:col-span-6 space-y-4">
            <div
              className="relative overflow-hidden touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <img
                src={
                  product.images && product.images[selectedImage]
                    ? product.images[selectedImage]
                    : "/images/placeholder.png"
                }
                alt={product.name}
                className="w-full h-full object-contain rounded-2xl transition-all duration-300 pointer-events-none select-none"
              />

              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.featured && (
                  <span className="bg-bleu-saphir text-blanc px-3 py-1 text-xs font-bold rounded-full shadow-xs">
                    Vedette
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="bg-rose-600 text-blanc px-3 py-1 text-xs font-bold rounded-full shadow-xs">
                    -{discountPercentage}%
                  </span>
                )}
              </div>

              {product.images && product.images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-blanc/80 backdrop-blur-md px-3 py-1.5 rounded-full shadow-xs z-10">
                  {product.images.map((_: string, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        index === selectedImage
                          ? "bg-bleu-saphir w-5"
                          : "bg-gris-canon-de-fusil/30 w-2"
                      }`}
                      aria-label={`Image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Miniatures */}
            {product.images && product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === idx
                        ? "border-bleu-saphir shadow-xs"
                        : "border-gris-canon-de-fusil/10 hover:border-gris-canon-de-fusil/30"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} miniature ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Actions Produit */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl p-5 sm:p-6 shadow-xs">
              <span className="inline-block text-[10px] font-black uppercase tracking-wider text-bleu-saphir bg-bleu-saphir/5 px-2.5 py-1 rounded-md mb-3">
                {product.category}
              </span>

              <h1 className="text-xl sm:text-3xl font-black text-gris-canon-de-fusil mb-3 leading-snug">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center text-amber-500">
                  {renderStars(product.rating)}
                </div>
                <span className="text-xs font-bold text-gris-canon-de-fusil/60">
                  {Number(product.rating || 0).toFixed(1)} (
                  {product.reviewsCount} avis)
                </span>
              </div>

              <div className="flex items-baseline gap-3 pt-2 border-t border-gris-canon-de-fusil/5">
                <span className="text-2xl sm:text-3xl font-black text-bleu-saphir tracking-tight">
                  {formatCurrency(finalPrice)}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-sm sm:text-base text-gris-canon-de-fusil/40 line-through font-semibold">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>
            </div>

            {/* Commande & Quantités */}
            <div className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gris-canon-de-fusil/60 uppercase tracking-wider">
                  Quantité :
                </span>
                <div className="flex items-center bg-gris-canon-de-fusil/5 rounded-xl border border-gris-canon-de-fusil/10 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-blanc text-gris-canon-de-fusil hover:bg-gris-canon-de-fusil/10 font-bold flex items-center justify-center transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-black text-sm text-gris-canon-de-fusil">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(
                        Math.min(
                          product.stock > 0 ? product.stock : 99,
                          quantity + 1,
                        ),
                      )
                    }
                    className="w-8 h-8 rounded-lg bg-blanc text-gris-canon-de-fusil hover:bg-gris-canon-de-fusil/10 font-bold flex items-center justify-center transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-xs ${
                    product.stock === 0
                      ? "bg-gris-canon-de-fusil/10 text-gris-canon-de-fusil/30 cursor-not-allowed"
                      : "bg-bleu-saphir text-blanc hover:bg-bleu-saphir/90 active:scale-[0.99] cursor-pointer"
                  }`}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {product.stock === 0
                    ? "Rupture de stock"
                    : "Ajouter au panier"}
                </button>

                <button
                  className="p-3.5 rounded-xl border border-gris-canon-de-fusil/10 text-gris-canon-de-fusil/40 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-colors cursor-pointer"
                  title="Ajouter aux favoris"
                >
                  <Heart className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Onglets d'informations */}
            <div className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl overflow-hidden shadow-xs">
              <div className="border-b border-gris-canon-de-fusil/5 bg-gris-canon-de-fusil/5/30 px-3 flex items-center gap-4">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                    activeTab === "description"
                      ? "border-bleu-saphir text-bleu-saphir"
                      : "border-transparent text-gris-canon-de-fusil/40 hover:text-gris-canon-de-fusil"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                    activeTab === "reviews"
                      ? "border-bleu-saphir text-bleu-saphir"
                      : "border-transparent text-gris-canon-de-fusil/40 hover:text-gris-canon-de-fusil"
                  }`}
                >
                  Avis ({reviewsList.length})
                </button>
                {product.specifications && (
                  <button
                    onClick={() => setActiveTab("specs")}
                    className={`py-3.5 text-xs font-black uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
                      activeTab === "specs"
                        ? "border-bleu-saphir text-bleu-saphir"
                        : "border-transparent text-gris-canon-de-fusil/40 hover:text-gris-canon-de-fusil"
                    }`}
                  >
                    Spécifications
                  </button>
                )}
              </div>

              <div className="p-5 sm:p-6">
                {/* Description */}
                {activeTab === "description" && (
                  <div className="space-y-6">
                    <p className="text-xs sm:text-sm text-gris-canon-de-fusil/70 leading-relaxed whitespace-pre-line">
                      {product.description ||
                        "Aucune description fournie pour ce produit."}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gris-canon-de-fusil/5">
                      <div className="flex items-center space-x-3">
                        <Truck className="h-5 w-5 text-bleu-saphir shrink-0" />
                        <span className="text-xs font-bold text-gris-canon-de-fusil/70">
                          Livraison rapide
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5 text-bleu-saphir shrink-0" />
                        <span className="text-xs font-bold text-gris-canon-de-fusil/70">
                          Garantie Qualité
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <RefreshCw className="h-5 w-5 text-bleu-saphir shrink-0" />
                        <span className="text-xs font-bold text-gris-canon-de-fusil/70">
                          Retours simples
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Package className="h-5 w-5 text-bleu-saphir shrink-0" />
                        <span className="text-xs font-bold text-gris-canon-de-fusil/70">
                          Service client réactif
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Avis */}
                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    {/* Soumission d'Avis */}
                    <div className="bg-gris-canon-de-fusil/5 rounded-xl p-4 border border-gris-canon-de-fusil/10">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-gris-canon-de-fusil mb-3">
                        Donner votre avis sur ce produit
                      </h4>
                      {reviewMessage && (
                        <div
                          className={`mb-4 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between text-xs font-semibold gap-3 ${
                            reviewMessage.type === "success"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 border border-rose-200"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {reviewMessage.type === "success" ? (
                              <CheckCircle className="h-4 w-4 shrink-0" />
                            ) : (
                              <AlertCircle className="h-4 w-4 shrink-0" />
                            )}
                            <span>{reviewMessage.text}</span>
                          </div>

                          {reviewMessage.text.includes("connecté") && (
                            <Link
                              to="/login"
                              className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-[11px] font-bold hover:bg-rose-700 transition-colors shrink-0 text-center"
                            >
                              Se connecter
                            </Link>
                          )}
                        </div>
                      )}
                      <form onSubmit={handleReviewSubmit} className="space-y-3">
                        <div>
                          <label className="block text-[11px] font-bold text-gris-canon-de-fusil/60 mb-1">
                            Note par étoiles :
                          </label>
                          <div className="flex items-center gap-1">
                            {renderStars(newRating, true)}
                          </div>
                        </div>

                        <div>
                          <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Partagez votre avis sur la qualité, la taille ou l'utilisation du produit..."
                            rows={3}
                            className="w-full text-xs p-3 rounded-xl border border-gris-canon-de-fusil/10 bg-blanc focus:outline-none focus:ring-2 focus:ring-bleu-saphir"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={submittingReview}
                          className="px-4 py-2 bg-bleu-saphir text-blanc rounded-lg text-xs font-bold hover:bg-bleu-saphir/90 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                          <Send className="h-3.5 w-3.5" />
                          {submittingReview ? "Envoi..." : "Publier mon avis"}
                        </button>
                      </form>
                    </div>

                    {/* Liste des Avis */}
                    <div className="space-y-4 pt-2">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-gris-canon-de-fusil">
                        Avis clients ({reviewsList.length})
                      </h4>

                      {reviewsList.length > 0 ? (
                        reviewsList.map((rev) => {
                          const authorName =
                            rev.user?.name ||
                            rev.user?.email?.split("@")[0] ||
                            "Client Anonyme";
                          const initials = authorName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2);

                          return (
                            <div
                              key={rev.id}
                              className="border-b border-gris-canon-de-fusil/5 pb-4 last:border-b-0 last:pb-0"
                            >
                              <div className="flex items-start space-x-3">
                                <div className="w-8 h-8 bg-bleu-saphir/10 border border-bleu-saphir/20 rounded-full flex items-center justify-center text-[10px] font-black text-bleu-saphir shrink-0">
                                  {initials}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1">
                                    <span className="text-xs font-bold text-gris-canon-de-fusil">
                                      {authorName}
                                    </span>
                                    <span className="text-[10px] font-semibold text-gris-canon-de-fusil/40">
                                      {rev.created_at
                                        ? new Date(
                                            rev.created_at,
                                          ).toLocaleDateString("fr-BJ")
                                        : "Récemment"}
                                    </span>
                                  </div>
                                  <div className="flex items-center text-amber-500 mb-1.5">
                                    {renderStars(rev.rating)}
                                  </div>
                                  <p className="text-xs text-gris-canon-de-fusil/70 leading-relaxed">
                                    {rev.comment}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-xs text-gris-canon-de-fusil/50 italic py-2">
                          Aucun avis n'a encore été laissé. Soyez le premier à
                          donner votre avis !
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Spécifications */}
                {activeTab === "specs" && product.specifications && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-extrabold text-gris-canon-de-fusil uppercase tracking-wider mb-3">
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
