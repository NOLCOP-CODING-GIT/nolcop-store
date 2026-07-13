import React, { useState } from "react";
import { useCart } from "../hooks/useCart";
import { CreditCard, Truck, ShieldCheck, ArrowRight } from "lucide-react";

const Checkout: React.FC = () => {
  const { state } = useCart();
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
  });

  // Calculs financiers réutilisés du panier
  const subtotal = state.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  const shipping = subtotal > 100 ? 0 : 4.9;
  const total = subtotal + shipping;

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Intégration passerelle de paiement (Stripe / PayPal)
    console.log("Traitement de commande pour :", shippingInfo);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-blanc text-gris-canon-de-fusil">
      <h1 className="text-3xl font-bold mb-8 tracking-tight flex items-center">
        Finaliser ma commande
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulaires d'expédition et paiement */}
        <form
          onSubmit={handlePaymentSubmit}
          className="lg:col-span-2 space-y-6"
        >
          {/* Section 1 : Livraison */}
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
              placeholder="Adresse postale complète"
              className="w-full px-3 py-2 border border-gris-canon-de-fusil/20 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm"
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, address: e.target.value })
              }
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Code postal"
                className="w-full px-3 py-2 border border-gris-canon-de-fusil/20 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm"
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, zipCode: e.target.value })
                }
              />
              <input
                type="text"
                required
                placeholder="Ville"
                className="w-full px-3 py-2 border border-gris-canon-de-fusil/20 rounded-xl focus:outline-none focus:border-bleu-saphir text-sm"
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, city: e.target.value })
                }
              />
            </div>
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

          {/* Section 2 : Paiement sécurisé factice */}
          <div className="bg-blanc border border-gris-canon-de-fusil/5 shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center mb-2">
              <CreditCard className="h-5 w-5 mr-2 text-bleu-saphir" />
              2. Paiement sécurisé par carte
            </h2>
            <div className="space-y-3">
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
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center px-6 py-3.5 bg-bleu-saphir text-blanc rounded-xl font-bold hover:opacity-90 shadow-md transition-all cursor-pointer text-base"
          >
            Procéder au paiement de {total.toFixed(2)} €
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </form>

        {/* Colonne latérale : Résumé de commande simplifié */}
        <div className="lg:col-span-1">
          <div className="bg-blanc border border-gris-canon-de-fusil/5 shadow-sm rounded-2xl p-6 sticky top-4 space-y-4">
            <h2 className="text-lg font-semibold">Vos articles</h2>

            <div className="divide-y divide-gris-canon-de-fusil/10 max-h-60 overflow-y-auto pr-1">
              {state.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-gris-canon-de-fusil/5"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-gris-canon-de-fusil line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-gris-canon-de-fusil/50">
                        Qté : {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">
                    {(item.product.price * item.quantity).toFixed(2)} €
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gris-canon-de-fusil/10 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gris-canon-de-fusil/70">
                <span>Sous-total</span>
                <span className="font-medium text-gris-canon-de-fusil">
                  {subtotal.toFixed(2)} €
                </span>
              </div>
              <div className="flex justify-between text-gris-canon-de-fusil/70">
                <span>Livraison</span>
                <span className="font-medium text-gris-canon-de-fusil">
                  {shipping === 0 ? "Gratuite" : `${shipping.toFixed(2)} €`}
                </span>
              </div>
              <div className="border-t border-gris-canon-de-fusil/10 pt-2 flex justify-between text-base font-bold">
                <span>Total à régler</span>
                <span className="text-bleu-saphir">{total.toFixed(2)} €</span>
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
