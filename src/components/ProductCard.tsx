import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye, Check } from "lucide-react";
import type { Product } from "../types";
import { useCart } from "../hooks/useCart";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const [isHovered, setIsHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Récupération de l'état (state) et de l'action d'ajout
  const { state, addToCart } = useCart();

  // Vérification si le produit est déjà présent dans le panier
  const isAlreadyInCart = state.items.some(
    (item) => item.product.id === product.id,
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAlreadyInCart) {
      addToCart(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick view modal
  };

  // 1. Le pourcentage est directement la valeur du discount
  const discountPercentage = product.discount || 0;

  // 2. Le prix affiché (prix final payé par le client) après réduction
  const displayPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  // 3. Le prix d'origine reste inchangé
  const originalPrice = product.price;

  // Extraction propre des couleurs depuis les spécifications
  const productColors = product.specifications?.colors;

  if (product.stock === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-blanc rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ZONE CLIQUABLE : Enveloppe uniquement le contenu visuel */}
      <Link
        to={`/products/${product.id}`}
        className="block focus:outline-hidden"
      >
        <div className="relative h-64 overflow-hidden bg-gris-canon-de-fusil/5">
          <img
            src={
              product.images[selectedImage] || "/categories/electronics.jfif"
            }
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
            {product.featured && (
              <span className="bg-bleu-saphir text-blanc px-2 py-1 text-xs font-medium rounded">
                Vedette
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-orange-rougi text-blanc px-2 py-1 text-xs font-medium rounded">
                -{discountPercentage}%
              </span>
            )}
          </div>
        </div>

        <div className="p-4 pb-0">
          <p className="text-sm text-bleu-saphir font-medium mb-1">
            {product.category}
          </p>
          <h3 className="text-lg font-semibold text-gris-canon-de-fusil mb-2 line-clamp-2 group-hover:text-bleu-saphir transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gris-canon-de-fusil/70 mb-3 line-clamp-2">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gris-canon-de-fusil/20"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gris-canon-de-fusil/60">
              {product.rating} ({product.reviews} avis)
            </span>
          </div>
        </div>
      </Link>

      {/* ZONE DES BOUTONS INTERACTIFS : Sortis du Link, positionnés de manière absolue ou relative */}

      {/* Action Buttons (Sur l'image) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-2 right-2 flex flex-col gap-2 z-20"
      >
        <button
          onClick={handleQuickView}
          className="bg-blanc p-2 rounded-full shadow-md hover:bg-gris-canon-de-fusil/10 text-gris-canon-de-fusil transition-colors cursor-pointer"
          aria-label="Aperçu rapide"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          className="bg-blanc p-2 rounded-full shadow-md hover:bg-gris-canon-de-fusil/10 text-gris-canon-de-fusil transition-colors cursor-pointer"
          aria-label="Ajouter aux favoris"
        >
          <Heart className="h-4 w-4" />
        </button>
      </motion.div>

      {/* Image Thumbnails (Sur l'image) */}
      {product.images && product.images.length > 1 && (
        <div className="absolute top-56 left-2 flex gap-1 z-20">
          {product.images.slice(0, 3).map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedImage(index);
              }}
              className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                selectedImage === index ? "bg-blanc" : "bg-blanc/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Bas de carte : Prix, Panier, Couleurs */}
      <div className="p-4 pt-0">
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gris-canon-de-fusil">
              {formatPrice(displayPrice)}
            </span>
            {discountPercentage > 0 && (
              <span className="text-sm text-gris-canon-de-fusil/40 line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAlreadyInCart}
            className={`p-2 rounded-lg transition-colors z-20 ${
              product.stock === 0
                ? "bg-gris-canon-de-fusil/10 text-gris-canon-de-fusil/30 cursor-not-allowed"
                : isAlreadyInCart
                  ? "bg-green-100 text-green-600 border border-green-200 cursor-not-allowed"
                  : "bg-bleu-saphir text-blanc hover:opacity-90 cursor-pointer"
            }`}
            aria-label={
              isAlreadyInCart ? "Déjà dans le panier" : "Ajouter au panier"
            }
          >
            {isAlreadyInCart ? (
              <Check className="h-5 w-5" />
            ) : (
              <ShoppingCart className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Color Options */}
        {productColors && productColors.length > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm text-gris-canon-de-fusil/60">
              Couleurs :
            </span>
            <div className="flex gap-1">
              {productColors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gris-canon-de-fusil/20"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
              {productColors.length > 4 && (
                <span className="text-xs text-gris-canon-de-fusil/60">
                  +{productColors.length - 4}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
