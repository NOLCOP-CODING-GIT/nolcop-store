import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import type { Product } from "../types";
import { useCart } from "../hooks/useCart";

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
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick view modal
  };

  const discountPercentage = product.discount
    ? Math.round(((product.price - product.discount) / product.price) * 100)
    : 0;

  const displayPrice = product.discount || product.price;
  const originalPrice = product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative">
          {/* Product Images */}
          <div className="relative h-64 overflow-hidden bg-gray-100">
            <img
              src={product.images?.[selectedImage] || product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300"
              style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-2">
              {product.featured && (
                <span className="bg-indigo-600 text-white px-2 py-1 text-xs font-medium rounded">
                  Vedette
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="bg-red-600 text-white px-2 py-1 text-xs font-medium rounded">
                  -{discountPercentage}%
                </span>
              )}
              {product.stock < 10 && product.stock > 0 && (
                <span className="bg-orange-600 text-white px-2 py-1 text-xs font-medium rounded">
                  Plus que {product.stock} articles
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-2 right-2 flex flex-col gap-2"
            >
              <button
                onClick={handleQuickView}
                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Aperçu rapide"
              >
                <Eye className="h-4 w-4 text-gray-700" />
              </button>
              <button
                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
                aria-label="Ajouter aux favoris"
              >
                <Heart className="h-4 w-4 text-gray-700" />
              </button>
            </motion.div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="absolute bottom-2 left-2 flex gap-1">
                {product.images.slice(0, 3).map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedImage(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      selectedImage === index ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Category */}
            <p className="text-sm text-indigo-600 font-medium mb-1">
              {product.category}
            </p>

            {/* Product Name */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
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
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews} avis)
              </span>
            </div>

            {/* Price and Add to Cart */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {displayPrice.toFixed(2)} €
                </span>
                {product.discount && (
                  <span className="text-sm text-gray-500 line-through">
                    {originalPrice.toFixed(2)} €
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`p-2 rounded-lg transition-colors ${
                  product.stock === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
                aria-label="Ajouter au panier"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>
            </div>

            {/* Stock Status */}
            {product.stock === 0 && (
              <p className="text-red-600 text-sm font-medium mt-2">
                Rupture de stock
              </p>
            )}

            {/* Color Options */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-sm text-gray-600">Couleurs:</span>
                <div className="flex gap-1">
                  {product.colors.slice(0, 4).map((color, index) => (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                  {product.colors.length > 4 && (
                    <span className="text-xs text-gray-500">
                      +{product.colors.length - 4}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
