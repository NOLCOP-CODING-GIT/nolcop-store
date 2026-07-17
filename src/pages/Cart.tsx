import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../hooks/useCart";

const Cart: React.FC = () => {
  const { state, updateQuantity, removeFromCart, addToCart } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Ajouter des produits de démo au panier s'il est vide
  useEffect(() => {
    if (state.items.length === 0) {
      // Ajouter les produits au panier
    }
  }, [state.items.length, addToCart]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity);
    } else {
      removeFromCart(id);
    }
  };

  const subtotal = state.total;
  const shipping = 1000;
  const total = subtotal + shipping;

  if (state.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-blanc">
        <div className="text-center max-w-sm px-4">
          <ShoppingCart className="h-16 w-16 text-gris-canon-de-fusil/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gris-canon-de-fusil mb-2">
            Votre panier est vide
          </h2>
          <p className="text-sm text-gris-canon-de-fusil/70 mb-6">
            Ajoutez des articles pour commencer vos achats sur Nolcop Store.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 rounded-lg text-sm font-medium text-blanc bg-bleu-saphir hover:opacity-90 shadow-md transition-all cursor-pointer"
          >
            Commencer mes achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-blanc text-gris-canon-de-fusil">
      <h1 className="text-3xl font-bold mb-8 flex items-center tracking-tight text-gris-canon-de-fusil">
        <ShoppingCart className="h-8 w-8 mr-3 text-bleu-saphir" />
        Mon Panier
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedColor || ""}-${item.selectedSize || ""}`}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gris-canon-de-fusil/5 hover:border-gris-canon-de-fusil/10 transition-all gap-4 bg-blanc"
            >
              {/* Partie Gauche : Image + Infos Médias */}
              <div className="flex items-center space-x-4 flex-1">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-24 h-24 sm:w-20 sm:h-20 object-cover rounded-lg bg-gris-canon-de-fusil/5 shrink-0"
                />

                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-gris-canon-de-fusil line-clamp-1">
                    {item.product.name}
                  </h3>
                  <p className="text-xs font-medium text-bleu-clair">
                    {item.product.category}
                  </p>

                  {/* Options (Taille/Couleur) disposées en badges horizontaux */}
                  {(item.selectedColor || item.selectedSize) && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.selectedColor && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gris-canon-de-fusil/5 text-gris-canon-de-fusil/80 border border-gris-canon-de-fusil/10">
                          Couleur : {item.selectedColor}
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gris-canon-de-fusil/5 text-gris-canon-de-fusil/80 border border-gris-canon-de-fusil/10">
                          Taille : {item.selectedSize}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-sm font-bold text-bleu-saphir sm:hidden pt-1">
                    {formatPrice(item.product.price)}
                  </p>
                </div>
              </div>

              {/* Partie Droite : Actions (Quantité + Prix Total + Poubelle) */}
              <div className="flex items-center justify-between sm:justify-end sm:space-x-8 border-t sm:border-t-0 pt-3 sm:pt-0 border-gris-canon-de-fusil/5">
                {/* Prix unitaire caché sur mobile car déjà affiché en haut, visible sur Desktop */}
                <div className="hidden sm:block text-center min-w-[70px]">
                  <p className="text-xs text-gris-canon-de-fusil/40">Prix</p>
                  <p className="text-sm font-semibold text-gris-canon-de-fusil">
                    {formatPrice(item.product.price)}
                  </p>
                </div>

                {/* Sélecteur de quantité stylisé */}
                <div className="flex items-center bg-gris-canon-de-fusil/5 rounded-lg p-1 border border-gris-canon-de-fusil/5">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.product.id, item.quantity - 1)
                    }
                    className="p-1 rounded-md hover:bg-blanc text-gris-canon-de-fusil hover:shadow-xs transition-all"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-gris-canon-de-fusil">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.product.id, item.quantity + 1)
                    }
                    className="p-1 rounded-md hover:bg-blanc text-gris-canon-de-fusil hover:shadow-xs transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Prix Total pour la ligne */}
                <div className="text-right min-w-[80px]">
                  <p className="text-xs sm:hidden text-gris-canon-de-fusil/40">
                    Sous-total
                  </p>
                  <p className="text-base font-bold text-gris-canon-de-fusil">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>

                {/* Bouton de suppression */}
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-gris-canon-de-fusil/40 hover:text-orange-rougi p-2 rounded-lg hover:bg-orange-rougi/5 transition-all"
                  aria-label="Supprimer l'article"
                >
                  <Trash2 className="h-4 text-rouge-ecarlate w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-blanc rounded-lg shadow-md p-6 sticky top-4 border border-gris-canon-de-fusil/5">
            <h2 className="text-xl font-semibold text-gris-canon-de-fusil mb-4">
              Résumé de la commande
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gris-canon-de-fusil/70">
                <span>Sous-total</span>
                <span className="font-medium text-gris-canon-de-fusil">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-gris-canon-de-fusil/70">
                <span>Livraison</span>
                <span className="font-medium text-gris-canon-de-fusil">
                  {formatPrice(shipping)}
                </span>
              </div>

              <div className="border-t border-gris-canon-de-fusil/10 pt-3">
                <div className="flex justify-between text-lg font-bold text-gris-canon-de-fusil">
                  <span>Total</span>
                  <span className="text-bleu-saphir">{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gris-canon-de-fusil/80 mb-2">
                Code promo
              </label>
              <div className="flex w-full items-center justify-between">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Entrez votre code..."
                  className="p-2 w-10/18 border border-gris-canon-de-fusil/20 rounded-md focus:outline-none focus:border-bleu-saphir focus:ring-1 focus:ring-bleu-saphir bg-blanc text-gris-canon-de-fusil text-sm placeholder:text-gris-canon-de-fusil/40"
                />
                <button className="p-2 bg-gris-canon-de-fusil/10 text-gris-canon-de-fusil rounded-md hover:bg-gris-canon-de-fusil/20 transition-colors font-medium">
                  Appliquer
                </button>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              to="/checkout"
              className="w-full flex items-center justify-center px-6 py-3 bg-bleu-saphir text-blanc rounded-lg font-semibold hover:opacity-90 shadow-md transition-all mb-4"
            >
              Passer la commande
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>

            {/* Security Info */}
            <div className="text-left text-xs text-gris-canon-de-fusil/50 space-y-1 pt-2 border-t border-gris-canon-de-fusil/5">
              <p>🔒 Paiement sécurisé et crypté</p>
              <p>📦 Livraison sous 2-3 jours ouvrés</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
