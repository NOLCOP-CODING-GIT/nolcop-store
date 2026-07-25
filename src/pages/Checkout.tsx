import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabaseClient";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight,
  Smartphone,
} from "lucide-react";

const Checkout: React.FC = () => {
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = state.total;
  const shipping = 1000;
  const total = subtotal + shipping;

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Vous devez être connecté pour finaliser la commande.");
      navigate("/login");
      return;
    }

    if (state.items.length === 0) {
      alert("Votre panier est vide.");
      return;
    }

    setLoading(true);

    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total: total,
          status: "pending",
          payment_method: paymentMethod,
          shipping_first_name: shippingInfo.firstName,
          shipping_last_name: shippingInfo.lastName,
          shipping_address: shippingInfo.address,
          shipping_city: "Cotonou",
          shipping_phone: shippingInfo.phone,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = state.items.map((item) => {
        const priceAtTime = item.product.discount
          ? item.product.price * (1 - item.product.discount / 100)
          : item.product.price;

        return {
          order_id: orderData.id,
          product_id: item.product.id,
          quantity: item.quantity,
          price_at_time: priceAtTime,
          specifications: {
            color: item.selectedColor,
            size: item.selectedSize,
          },
        };
      });

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();
      alert("Commande effectuée avec succès !");
      navigate("/orders");
    } catch (err) {
      console.error("Erreur lors de la création de la commande :", err);
      alert("Une erreur est survenue lors du traitement de votre commande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-blanc text-gris-canon-de-fusil">
      <h1 className="text-3xl font-bold mb-8 tracking-tight flex items-center">
        Finaliser ma commande
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form
          onSubmit={handlePaymentSubmit}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-blanc border border-gris-canon-de-fusil/5 shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center mb-2">
              <Truck className="h-5 w-5 mr-2 text-bleu-saphir" />
              1. Informations de livraison
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Prénom"
                className="w-full px-3 py-2 border border-gris-canon-de-fusil/20 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm"
                onChange={(e) =>
                  setShippingInfo({
                    ...shippingInfo,
                    firstName: e.target.value,
                  })
                }
              />
              <input
                type="text"
                required
                placeholder="Nom"
                className="w-full px-3 py-2 border border-gris-canon-de-fusil/20 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm"
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, lastName: e.target.value })
                }
              />
            </div>
            <input
              type="text"
              required
              placeholder="Adresse complète"
              className="w-full px-3 py-2 border border-gris-canon-de-fusil/20 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm"
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, address: e.target.value })
              }
            />
            <input
              type="tel"
              required
              placeholder="Téléphone (pour la livraison)"
              className="w-full px-3 py-2 border border-gris-canon-de-fusil/20 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm"
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, phone: e.target.value })
              }
            />
          </div>

          <div className="bg-blanc border border-gris-canon-de-fusil/5 shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <ShieldCheck className="h-5 w-5 mr-2 text-bleu-saphir" />
              2. Méthode de paiement
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("credit_card")}
                className={`p-4 border rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  paymentMethod === "credit_card"
                    ? "border-bleu-saphir bg-bleu-saphir/5 text-bleu-saphir"
                    : "border-gris-canon-de-fusil/10 text-gris-canon-de-fusil hover:border-gris-canon-de-fusil/30"
                }`}
              >
                <CreditCard className="h-5 w-5 mr-2" />
                <span className="font-semibold text-sm">Carte Bancaire</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("mtn_momo")}
                className={`p-4 border rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  paymentMethod === "mtn_momo"
                    ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                    : "border-gris-canon-de-fusil/10 text-gris-canon-de-fusil hover:border-gris-canon-de-fusil/30"
                }`}
              >
                <Smartphone className="h-5 w-5 mr-2" />
                <span className="font-semibold text-sm">MTN MoMo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("moov_money")}
                className={`p-4 border rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  paymentMethod === "moov_money"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gris-canon-de-fusil/10 text-gris-canon-de-fusil hover:border-gris-canon-de-fusil/30"
                }`}
              >
                <Smartphone className="h-5 w-5 mr-2" />
                <span className="font-semibold text-sm">Moov Money</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("celtiis_cash")}
                className={`p-4 border rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                  paymentMethod === "celtiis_cash"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gris-canon-de-fusil/10 text-gris-canon-de-fusil hover:border-gris-canon-de-fusil/30"
                }`}
              >
                <Smartphone className="h-5 w-5 mr-2" />
                <span className="font-semibold text-sm">Celtiis Cash</span>
              </button>
            </div>

            {paymentMethod === "credit_card" && (
              <div className="space-y-3 pt-4 border-t border-gris-canon-de-fusil/5">
                <input
                  type="text"
                  required
                  placeholder="Nom inscrit sur la carte"
                  className="w-full px-3 py-2 border border-gris-canon-de-fusil/20 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm"
                />
                <input
                  type="text"
                  required
                  maxLength={16}
                  placeholder="Numéro de carte (16 chiffres)"
                  className="w-full px-3 py-2 border border-gris-canon-de-fusil/20 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    maxLength={5}
                    placeholder="MM/AA"
                    className="w-full px-3 py-2 border border-gris-canon-de-fusil/20 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm text-center"
                  />
                  <input
                    type="text"
                    required
                    maxLength={3}
                    placeholder="CVV"
                    className="w-full px-3 py-2 border border-gris-canon-de-fusil/20 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm text-center"
                  />
                </div>
              </div>
            )}

            {paymentMethod !== "credit_card" && (
              <div className="space-y-3 pt-4 border-t border-gris-canon-de-fusil/5">
                <p className="text-sm text-gris-canon-de-fusil/70 mb-2">
                  Veuillez entrer le numéro de téléphone associé à votre compte
                  Mobile Money. Vous recevrez une notification sur votre
                  téléphone pour valider le paiement.
                </p>
                <input
                  type="tel"
                  required
                  placeholder="Numéro de téléphone Mobile Money"
                  className="w-full px-3 py-2 border border-gris-canon-de-fusil/20 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-6 py-3.5 bg-bleu-saphir text-blanc rounded-xl font-bold hover:opacity-90 shadow-md transition-all cursor-pointer text-base disabled:opacity-50"
          >
            {loading
              ? "Traitement en cours..."
              : `Procéder au paiement de ${formatPrice(total)}`}
            {!loading && <ArrowRight className="h-5 w-5 ml-2" />}
          </button>
        </form>

        <div className="lg:col-span-1">
          <div className="bg-blanc border border-gris-canon-de-fusil/5 shadow-sm rounded-2xl p-6 sticky top-4 space-y-4">
            <h2 className="text-lg font-semibold">Vos articles</h2>

            <div className="divide-y divide-gris-canon-de-fusil/10 max-h-60 overflow-y-auto pr-1">
              {state.items.map((item, index) => {
                const effectiveUnitPrice = item.product.discount
                  ? item.product.price * (1 - item.product.discount / 100)
                  : item.product.price;

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-cover bg-gris-canon-de-fusil/5"
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-gris-canon-de-fusil line-clamp-1">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gris-canon-de-fusil/50">
                          Qté : {item.quantity} x{" "}
                          {formatPrice(effectiveUnitPrice)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gris-canon-de-fusil/10 pt-4 space-y-2 text-sm">
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
              <div className="border-t border-gris-canon-de-fusil/10 pt-2 flex justify-between text-base font-bold">
                <span>Total à régler</span>
                <span className="text-bleu-saphir">{formatPrice(total)}</span>
              </div>
            </div>

            <div className="bg-gris-canon-de-fusil/5 p-3 rounded-xl flex items-center space-x-2 text-xs text-gris-canon-de-fusil/60 justify-center">
              <ShieldCheck className="h-4 w-4 text-green-600 shrink-0" />
              <span>Garantie SSL cryptée de Nolcop Store</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
