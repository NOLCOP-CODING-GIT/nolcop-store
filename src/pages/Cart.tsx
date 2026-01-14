import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "../hooks/useCart";

const Cart: React.FC = () => {
  const { state, updateQuantity, removeFromCart, addToCart } = useCart();
  const [promoCode, setPromoCode] = useState("");

  // Ajouter des produits de démo au panier s'il est vide
  useEffect(() => {
    if (state.items.length === 0) {
      // Produits de démo
      const demoProducts = [
        {
          id: "1",
          name: "iPhone 15 Pro",
          price: 999.99,
          image:
            "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=300",
          category: "Électronique",
          rating: 4.5,
          reviews: 234,
          description: "Le dernier iPhone avec processeur A17 Pro",
          stock: 15,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "MacBook Air M2",
          price: 1299.99,
          image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300",
          category: "Électronique",
          rating: 4.8,
          reviews: 156,
          description: "Ordinateur portable ultra-fin avec puce M2",
          stock: 8,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      // Ajouter les produits au panier
      demoProducts.forEach((product, index) => {
        addToCart(product, index === 0 ? 2 : 1); // 2 iPhones, 1 MacBook
      });
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
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.2; // TVA 20%
  const total = subtotal + shipping + tax;

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Votre panier est vide
          </h2>
          <p className="text-gray-600 mb-6">
            Ajoutez des articles pour commencer vos achats
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        <ShoppingCart className="h-8 w-8 mr-3 text-indigo-600" />
        Mon Panier
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {state.items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedColor || ""}-${item.selectedSize || ""}`}
                className="flex items-center space-x-4 py-4 border-b last:border-b-0"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-md"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {item.product.category}
                  </p>
                  {item.selectedColor && (
                    <p className="text-sm text-gray-500">
                      Couleur: {item.selectedColor}
                    </p>
                  )}
                  {item.selectedSize && (
                    <p className="text-sm text-gray-500">
                      Taille: {item.selectedSize}
                    </p>
                  )}
                  <p className="text-lg font-bold text-indigo-600 mt-1">
                    {item.product.price} €
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.product.id, item.quantity - 1)
                    }
                    className="p-1 rounded-md hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.product.id, item.quantity + 1)
                    }
                    className="p-1 rounded-md hover:bg-gray-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {(item.product.price * item.quantity).toFixed(2)} €
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-500 hover:text-red-700 mt-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Résumé de la commande
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                <span>
                  {shipping === 0 ? "Gratuite" : `${shipping.toFixed(2)} €`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>TVA (20%)</span>
                <span>{tax.toFixed(2)} €</span>
              </div>
              {shipping === 0 && (
                <div className="text-green-600 text-sm">
                  🎉 Livraison offerte offerte !
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code promo
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Entrez votre code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                  Appliquer
                </button>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              to="/checkout"
              className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Passer la commande
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>

            {/* Security Info */}
            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Paiement sécurisé et crypté</p>
              <p>Livraison sous 2-3 jours ouvrés</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
