import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Check } from "lucide-react";
import type { Product } from "../types";
import { useCart } from "../hooks/useCart";
import { useNotification } from "../hooks/useNotification";

interface WishlistCardProps {
  product: Product;
  onRemove: (id: string) => void;
}

const WishlistCard: React.FC<WishlistCardProps> = ({ product, onRemove }) => {
  const { state: cartState, addToCart } = useCart();
  const { showNotification } = useNotification();

  const isAlreadyInCart = cartState.items.some(
    (item) => item.product.id === product.id,
  );
  const inStock = product.stock !== undefined ? product.stock > 0 : true;

  const discount = product.discount ?? 0;
  const finalPrice =
    discount > 0 ? product.price * (1 - discount / 100) : product.price;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-blanc rounded-2xl border border-gris-canon-de-fusil/5 shadow-xs overflow-hidden group hover:border-gris-canon-de-fusil/10 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Conteneur Image & Badges */}
        <div className="relative aspect-square w-full overflow-hidden bg-gris-canon-de-fusil/5">
          <Link to={`/products/${product.id}`}>
            <img
              src={
                product.selectedImage ||
                product.images?.[0] ||
                "/images/placeholder.png"
              }
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>

          {/* Badges sur l'image (Vedette & Réduction) */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
            {product.featured && (
              <span className="bg-bleu-saphir text-blanc text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">
                Vedette
              </span>
            )}
            {discount > 0 && (
              <span className="bg-rouge-ecarlate text-blanc text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow-xs">
                -{discount}%
              </span>
            )}
          </div>

          {/* Bouton de suppression */}
          <button
            onClick={() => {
              onRemove(product.id);
              showNotification(`"${product.name}" retiré des favoris`, "error");
            }}
            className="absolute top-2.5 right-2.5 p-2 bg-blanc/90 backdrop-blur-md text-rouge-ecarlate rounded-xl shadow-xs border border-gris-canon-de-fusil/5 hover:bg-rouge-ecarlate hover:text-blanc transition-all cursor-pointer z-10"
            title="Supprimer des favoris"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Détails du produit */}
        <div className="p-4 space-y-2">
          {/* Nom complet */}
          <Link to={`/products/${product.id}`}>
            <h3 className="text-sm font-bold text-gris-canon-de-fusil hover:text-bleu-saphir transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          {/* Prix calculé en fonction du discount */}
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-2">
            <span className="text-base sm:text-lg font-black text-bleu-saphir">
              {formatPrice(finalPrice)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-gris-canon-de-fusil/40 line-through font-semibold">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bouton Panier */}
      <div className="p-4 pt-0">
        <button
          disabled={isAlreadyInCart || !inStock}
          onClick={() => {
            addToCart(product, 1);
            showNotification(`"${product.name}" ajouté au panier !`, "success");
          }}
          className={`w-full flex items-center justify-center px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs ${
            !inStock
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : isAlreadyInCart
                ? "bg-green-100 text-green-600 border border-green-200 cursor-not-allowed"
                : "bg-bleu-saphir text-blanc hover:bg-bleu-saphir/90 cursor-pointer"
          }`}
        >
          {isAlreadyInCart ? (
            <>
              <Check className="h-4 w-4 mr-1.5" />
              Au panier
            </>
          ) : !inStock ? (
            "En rupture"
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-1.5" />
              Ajouter
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WishlistCard;
