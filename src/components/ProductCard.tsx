// Remplacez tout le contenu de ProductCard.tsx par ce code :
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Eye, Check } from "lucide-react";
import type { Product } from "../types";
import { useCart } from "../hooks/useCart";
import { useIsMobile } from "../hooks/useIsMobile";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const isMobile = useIsMobile();
  const { state, addToCart } = useCart();

  const isAlreadyInCart = state.items.some(
    (item) => item.product.id === product.id,
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAlreadyInCart && product.stock > 0) {
      addToCart(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const discountPercentage = product.discount || 0;
  const displayPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;
  const originalPrice = product.price;

  if (product.stock === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-blanc rounded-xl border border-gris-canon-de-fusil/5 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden relative group flex flex-col h-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        to={`/products/${product.id}`}
        className="block flex-1 focus:outline-hidden"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-gris-canon-de-fusil/5 flex items-center justify-center">
          <img
            src={
              product.images && product.images[selectedImage]
                ? product.images[selectedImage]
                : "/categories/electronics.jfif"
            }
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />

          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.featured && (
              <span className="bg-bleu-saphir text-blanc px-1.5 py-0.5 text-[10px] font-medium rounded">
                Vedette
              </span>
            )}
            {discountPercentage > 0 && (
              <span className="bg-orange-rougi text-blanc px-1.5 py-0.5 text-[10px] font-medium rounded">
                -{discountPercentage}%
              </span>
            )}
          </div>
        </div>

        <div className="p-2.5 sm:p-4 pb-0 flex-1">
          <div className="flex items-center justify-between gap-1 mb-1">
            <p className="text-xs sm:text-sm text-blanc font-bold bg-orange-rougi px-2 py-1.5 rounded-xl">
              {product.category}
            </p>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-1 shrink-0">
                {product.images.slice(0, 3).map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedImage(index);
                    }}
                    className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-colors cursor-pointer ${
                      selectedImage === index
                        ? "bg-bleu-saphir"
                        : "bg-gris-canon-de-fusil/30"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <h3 className="text-[13px] sm:text-sm md:text-base my-2 font-semibold text-gris-canon-de-fusil mb-1 line-clamp-2 group-hover:text-bleu-saphir transition-colors leading-snug">
            {product.name}
          </h3>
          {!isMobile ? (
            <p className="text-[11px] sm:text-xs text-gris-canon-de-fusil/70 line-clamp-2 mb-2">
              {product.description}
            </p>
          ) : null}
        </div>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-2 right-2 flex flex-col gap-1.5 z-20 sm:flex"
      >
        <button
          onClick={handleQuickView}
          className="bg-blanc p-1.5 rounded-full shadow-md hover:bg-gris-canon-de-fusil/10 text-gris-canon-de-fusil transition-colors cursor-pointer"
          aria-label="Aperçu rapide"
        >
          <Eye className="h-3.5 w-3.5" />
        </button>
        <button
          className="bg-blanc p-1.5 rounded-full shadow-md hover:bg-gris-canon-de-fusil/10 text-gris-canon-de-fusil transition-colors cursor-pointer"
          aria-label="Ajouter aux favoris"
        >
          <Heart className="h-3.5 w-3.5" />
        </button>
      </motion.div>

      <div className="p-2.5 sm:p-4 pt-0 mt-auto">
        <div className="flex items-center justify-between gap-1 mt-2">
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5 min-w-0">
            <span className="text-sm sm:text-base md:text-lg font-bold text-gris-canon-de-fusil truncate">
              {formatPrice(displayPrice)}
            </span>
            {discountPercentage > 0 && (
              <span className="text-[10px] sm:text-xs text-gris-canon-de-fusil/40 line-through truncate">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAlreadyInCart}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors shrink-0 z-20 ${
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
              <Check className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
