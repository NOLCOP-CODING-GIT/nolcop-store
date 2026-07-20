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

  const { state, addToCart } = useCart();

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
  };

  const discountPercentage = product.discount || 0;

  const displayPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  const originalPrice = product.price;

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
      <Link
        to={`/products/${product.id}`}
        className="block focus:outline-hidden"
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
          <div className="flex items-center justify-between">
            <p className="text-sm text-bleu-saphir font-medium mb-1">
              {product.category}
            </p>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-1">
                {product.images.slice(0, 3).map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedImage(index);
                    }}
                    className={`w-5 h-5 rounded-full transition-colors cursor-pointer ${
                      selectedImage === index
                        ? "bg-bleu-saphir"
                        : "bg-gris-canon-de-fusil/30"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-gris-canon-de-fusil mb-2 line-clamp-2 group-hover:text-bleu-saphir transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gris-canon-de-fusil/70 mb-3 line-clamp-2">
            {product.description}
          </p>

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
