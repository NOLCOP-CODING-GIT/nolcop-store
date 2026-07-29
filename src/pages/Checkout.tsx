import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useNotification } from "../hooks/useNotification";
import { supabase } from "../supabaseClient";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight,
  Smartphone,
  MapPin,
  Plus,
  X,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";

interface Address {
  id: string;
  street: string;
  city: string;
  country: string;
  is_default: boolean;
}

const Checkout: React.FC = () => {
  const { state, clearCart } = useCart();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [paymentMethod, setPaymentMethod] = useState<
    "credit_card" | "mtn_momo" | "moov_money" | "celtiis_cash"
  >("credit_card");

  const [cardInfo, setCardInfo] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [momoPhone, setMomoPhone] = useState("");

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    street: "",
    city: "",
    country: "",
  });
  const [savingNewAddress, setSavingNewAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculatedSubtotal = state.items.reduce((acc, item) => {
    const unitPrice = item.product.discount
      ? item.product.price * (1 - item.product.discount / 100)
      : item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const shipping = 1000;
  const total = calculatedSubtotal + shipping;

  useEffect(() => {
    if (user) {
      fetchUserDataAndAddresses();
    }
  }, [user]);

  const fetchUserDataAndAddresses = async () => {
    if (!user) return;
    try {
      const { data: userData } = await supabase
        .from("users")
        .select("name, telephone")
        .eq("id", user.id)
        .single();

      const { data: addrData } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });

      if (addrData) setAddresses(addrData);

      const defaultAddr = addrData?.find((a) => a.is_default) || addrData?.[0];
      const formattedAddress = defaultAddr
        ? `${defaultAddr.street}, ${defaultAddr.city}, ${defaultAddr.country}`
        : "";

      setShippingInfo({
        name: userData?.name || "",
        phone: userData?.telephone || "",
        address: formattedAddress,
      });

      if (userData?.telephone) {
        setMomoPhone(userData.telephone);
      }
    } catch (err) {
      console.error("Erreur chargement informations utilisateur :", err);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!shippingInfo.name.trim()) {
      newErrors.name = "Le nom complet est obligatoire.";
    }
    if (!shippingInfo.address.trim()) {
      newErrors.address = "L'adresse de livraison est obligatoire.";
    }
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est obligatoire.";
    }

    if (paymentMethod === "credit_card") {
      if (!cardInfo.cardName.trim())
        newErrors.cardName = "Nom sur la carte obligatoire.";
      if (!cardInfo.cardNumber.trim())
        newErrors.cardNumber = "Numéro de carte obligatoire.";
      if (!cardInfo.expiry.trim()) newErrors.expiry = "Expiration obligatoire.";
      if (!cardInfo.cvv.trim()) newErrors.cvv = "CVV obligatoire.";
    } else {
      if (!momoPhone.trim()) {
        newErrors.momoPhone = "Numéro Mobile Money obligatoire.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user) {
      showNotification(
        "Vous devez être connecté pour finaliser la commande.",
        "error",
      );
      navigate("/login");
      return;
    }

    if (state.items.length === 0) {
      showNotification("Votre panier est vide.", "error");
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
          shipping_name: shippingInfo.name,
          shipping_address: shippingInfo.address,
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
          selected_image: item.selectedImage || item.product.images[0] || null,
          specifications: {},
        };
      });

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      for (const item of state.items) {
        const newStock = Math.max(0, item.product.stock - item.quantity);
        await supabase
          .from("products")
          .update({ stock: newStock })
          .eq("id", item.product.id);
      }

      clearCart();
      showNotification("Commande effectuée avec succès !", "success");
      navigate("/orders");
    } catch (err: any) {
      console.error(
        "Erreur détaillée lors de la création de la commande :",
        err,
      );
      showNotification(
        `Erreur : ${err.message || err.details || "Une erreur est survenue"}`,
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!newAddressForm.street.trim() || !newAddressForm.city.trim()) return;

    setSavingNewAddress(true);
    try {
      if (editingAddressId) {
        const { error } = await supabase
          .from("addresses")
          .update({
            street: newAddressForm.street,
            city: newAddressForm.city,
            country: newAddressForm.country,
          })
          .eq("id", editingAddressId);

        if (error) throw error;

        const formatted = `${newAddressForm.street}, ${newAddressForm.city}`;
        setShippingInfo((prev) => ({ ...prev, address: formatted }));
        setAddresses((prev) =>
          prev.map((a) =>
            a.id === editingAddressId ? { ...a, ...newAddressForm } : a,
          ),
        );
      } else {
        const { data, error } = await supabase
          .from("addresses")
          .insert([
            {
              user_id: user.id,
              street: newAddressForm.street,
              city: newAddressForm.city,
              country: newAddressForm.country,
              is_default: addresses.length === 0,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        const formatted = `${data.street}, ${data.city}`;
        setShippingInfo((prev) => ({ ...prev, address: formatted }));
        setAddresses((prev) => [data, ...prev]);
      }
      showNotification(
        editingAddressId
          ? "Adresse mise à jour avec succès"
          : "Nouvelle adresse ajoutée",
        "success",
      );
      setIsAddressModalOpen(false);
      setNewAddressForm({ street: "", city: "", country: "Bénin" });
      setEditingAddressId(null);
      setErrors((prev) => ({ ...prev, address: "" }));
    } catch (err) {
      console.error("Erreur enregistrement adresse :", err);
      showNotification("Erreur lors de l'enregistrement de l'adresse", "error");
    } finally {
      setSavingNewAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { error } = await supabase.from("addresses").delete().eq("id", id);
      if (error) throw error;
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      showNotification("Adresse supprimée", "success");
    } catch (err) {
      console.error("Erreur suppression adresse :", err);
      showNotification("Erreur lors de la suppression de l'adresse", "error");
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
            <h2 className="text-lg font-semibold flex items-center mb-2 text-gris-canon-de-fusil">
              <Truck className="h-5 w-5 mr-2 text-bleu-saphir" />
              1. Informations de livraison
            </h2>

            <div>
              <input
                type="text"
                value={shippingInfo.name}
                placeholder="Nom complet *"
                className={`w-full px-3 py-2 bg-blanc border rounded-xl focus:outline-none text-sm transition-colors ${
                  errors.name
                    ? "border-rouge-ecarlate focus:border-rouge-ecarlate"
                    : "border-gris-canon-de-fusil/20 focus:border-bleu-saphir"
                }`}
                onChange={(e) => {
                  setShippingInfo({ ...shippingInfo, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: "" });
                }}
              />
              {errors.name && (
                <p className="text-rouge-ecarlate text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <input
                  type="text"
                  value={shippingInfo.address}
                  placeholder="Adresse complète (ex: Cadjehoun, Cotonou) *"
                  onChange={(e) => {
                    setShippingInfo({
                      ...shippingInfo,
                      address: e.target.value,
                    });
                    if (errors.address) setErrors({ ...errors, address: "" });
                  }}
                  className={`w-full px-3 py-2 pr-10 bg-blanc border rounded-xl focus:outline-none text-sm cursor-pointer transition-colors ${
                    errors.address
                      ? "border-rouge-ecarlate focus:border-rouge-ecarlate"
                      : "border-gris-canon-de-fusil/20 focus:border-bleu-saphir"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-bleu-saphir p-1 hover:bg-bleu-saphir/5 rounded-lg"
                  title="Choisir ou ajouter une adresse"
                >
                  <MapPin className="h-4 w-4" />
                </button>
              </div>
              {errors.address && (
                <p className="text-rouge-ecarlate text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> {errors.address}
                </p>
              )}
            </div>

            <div>
              <input
                type="tel"
                value={shippingInfo.phone}
                placeholder="Téléphone (pour la livraison) *"
                className={`w-full px-3 py-2 bg-blanc border rounded-xl focus:outline-none text-sm transition-colors ${
                  errors.phone
                    ? "border-rouge-ecarlate focus:border-rouge-ecarlate"
                    : "border-gris-canon-de-fusil/20 focus:border-bleu-saphir"
                }`}
                onChange={(e) => {
                  setShippingInfo({ ...shippingInfo, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: "" });
                }}
              />
              {errors.phone && (
                <p className="text-rouge-ecarlate text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div className="bg-blanc border border-gris-canon-de-fusil/5 shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center mb-4 text-gris-canon-de-fusil">
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

            {paymentMethod === "credit_card" ? (
              <div className="space-y-3 pt-4 border-t border-gris-canon-de-fusil/5">
                <div>
                  <input
                    type="text"
                    value={cardInfo.cardName}
                    placeholder="Nom inscrit sur la carte *"
                    className={`w-full px-3 py-2 bg-blanc border rounded-xl focus:outline-none text-sm ${
                      errors.cardName
                        ? "border-rouge-ecarlate"
                        : "border-gris-canon-de-fusil/20 focus:border-bleu-saphir"
                    }`}
                    onChange={(e) => {
                      setCardInfo({ ...cardInfo, cardName: e.target.value });
                      if (errors.cardName)
                        setErrors({ ...errors, cardName: "" });
                    }}
                  />
                  {errors.cardName && (
                    <p className="text-rouge-ecarlate text-xs mt-1">
                      {errors.cardName}
                    </p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    maxLength={16}
                    value={cardInfo.cardNumber}
                    placeholder="Numéro de carte (16 chiffres) *"
                    className={`w-full px-3 py-2 bg-blanc border rounded-xl focus:outline-none text-sm ${
                      errors.cardNumber
                        ? "border-rouge-ecarlate"
                        : "border-gris-canon-de-fusil/20 focus:border-bleu-saphir"
                    }`}
                    onChange={(e) => {
                      setCardInfo({ ...cardInfo, cardNumber: e.target.value });
                      if (errors.cardNumber)
                        setErrors({ ...errors, cardNumber: "" });
                    }}
                  />
                  {errors.cardNumber && (
                    <p className="text-rouge-ecarlate text-xs mt-1">
                      {errors.cardNumber}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      maxLength={5}
                      value={cardInfo.expiry}
                      placeholder="MM/AA *"
                      className={`w-full px-3 py-2 bg-blanc border rounded-xl focus:outline-none text-sm text-center ${
                        errors.expiry
                          ? "border-rouge-ecarlate"
                          : "border-gris-canon-de-fusil/20 focus:border-bleu-saphir"
                      }`}
                      onChange={(e) => {
                        setCardInfo({ ...cardInfo, expiry: e.target.value });
                        if (errors.expiry) setErrors({ ...errors, expiry: "" });
                      }}
                    />
                    {errors.expiry && (
                      <p className="text-rouge-ecarlate text-xs mt-1">
                        {errors.expiry}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      maxLength={3}
                      value={cardInfo.cvv}
                      placeholder="CVV *"
                      className={`w-full px-3 py-2 bg-blanc border rounded-xl focus:outline-none text-sm text-center ${
                        errors.cvv
                          ? "border-rouge-ecarlate"
                          : "border-gris-canon-de-fusil/20 focus:border-bleu-saphir"
                      }`}
                      onChange={(e) => {
                        setCardInfo({ ...cardInfo, cvv: e.target.value });
                        if (errors.cvv) setErrors({ ...errors, cvv: "" });
                      }}
                    />
                    {errors.cvv && (
                      <p className="text-rouge-ecarlate text-xs mt-1">
                        {errors.cvv}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-4 border-t border-gris-canon-de-fusil/5">
                <p className="text-sm text-gris-canon-de-fusil/70 mb-2">
                  Veuillez entrer le numéro de téléphone associé à votre compte
                  Mobile Money.
                </p>
                <input
                  type="tel"
                  value={momoPhone}
                  placeholder="Numéro de téléphone Mobile Money *"
                  className={`w-full px-3 py-2 bg-blanc border rounded-xl focus:outline-none text-sm ${
                    errors.momoPhone
                      ? "border-rouge-ecarlate"
                      : "border-gris-canon-de-fusil/20 focus:border-bleu-saphir"
                  }`}
                  onChange={(e) => {
                    setMomoPhone(e.target.value);
                    if (errors.momoPhone)
                      setErrors({ ...errors, momoPhone: "" });
                  }}
                />
                {errors.momoPhone && (
                  <p className="text-rouge-ecarlate text-xs mt-1">
                    {errors.momoPhone}
                  </p>
                )}
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
                        src={item.selectedImage || item.product.images[0]}
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
                  {formatPrice(calculatedSubtotal)}
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

      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-blanc rounded-2xl p-6 w-full max-w-md border border-gris-canon-de-fusil/10 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gris-canon-de-fusil/5">
              <h3 className="text-base font-black text-gris-canon-de-fusil">
                Adresse de livraison
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddressModalOpen(false);
                  setEditingAddressId(null);
                  setNewAddressForm({ street: "", city: "", country: "Bénin" });
                }}
                className="p-1 rounded-lg hover:bg-gris-canon-de-fusil/5 text-gris-canon-de-fusil/60 hover:text-gris-canon-de-fusil transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {addresses.length > 0 && (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                <p className="text-xs font-bold text-gris-canon-de-fusil/60 uppercase">
                  Choisir une adresse existante :
                </p>
                {addresses.map((addr) => {
                  const full = `${addr.street}, ${addr.city}`;
                  const isSelected = shippingInfo.address === full;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => {
                        setShippingInfo((prev) => ({ ...prev, address: full }));
                        if (errors.address)
                          setErrors({ ...errors, address: "" });
                        setIsAddressModalOpen(false);
                      }}
                      className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? "border-bleu-saphir bg-bleu-saphir/5 text-bleu-saphir font-bold"
                          : "border-gris-canon-de-fusil/10 hover:border-gris-canon-de-fusil/30 text-gris-canon-de-fusil"
                      }`}
                    >
                      <div>
                        <p>{addr.street}</p>
                        <p className="text-[11px] text-gris-canon-de-fusil/60">
                          {addr.city}, {addr.country}
                        </p>
                        {addr.is_default && (
                          <span className="px-2 py-0.5 text-[9px] bg-bleu-saphir/10 text-bleu-saphir rounded-md font-bold mt-1 inline-block">
                            Par défaut
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddressId(addr.id);
                            setNewAddressForm({
                              street: addr.street,
                              city: addr.city,
                              country: addr.country,
                            });
                          }}
                          className="p-1.5 text-bleu-saphir hover:bg-bleu-saphir/10 rounded-md transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteAddress(addr.id, e)}
                          className="p-1.5 text-rouge-ecarlate hover:bg-rouge-ecarlate/10 rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <form
              onSubmit={handleSaveAddress}
              className="space-y-3 pt-3 border-t border-gris-canon-de-fusil/5"
            >
              <p className="text-xs font-bold text-gris-canon-de-fusil/60 uppercase">
                {editingAddressId
                  ? "Modifier l'adresse :"
                  : "Ou ajouter une nouvelle adresse :"}
              </p>
              <input
                type="text"
                required
                value={newAddressForm.street}
                placeholder="Rue / Quartier (ex: Cadjehoun, Rue 12) *"
                onChange={(e) =>
                  setNewAddressForm({
                    ...newAddressForm,
                    street: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-blanc border border-gris-canon-de-fusil/20 rounded-xl text-xs focus:outline-none focus:border-bleu-saphir"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  value={newAddressForm.city}
                  placeholder="Ville (ex: Cotonou) *"
                  onChange={(e) =>
                    setNewAddressForm({
                      ...newAddressForm,
                      city: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-blanc border border-gris-canon-de-fusil/20 rounded-xl text-xs focus:outline-none focus:border-bleu-saphir"
                />
                <input
                  type="text"
                  required
                  value={newAddressForm.country}
                  placeholder="Pays *"
                  onChange={(e) =>
                    setNewAddressForm({
                      ...newAddressForm,
                      country: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-blanc border border-gris-canon-de-fusil/20 rounded-xl text-xs focus:outline-none focus:border-bleu-saphir"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddressModalOpen(false);
                    setEditingAddressId(null);
                    setNewAddressForm({
                      street: "",
                      city: "",
                      country: "Bénin",
                    });
                  }}
                  className="px-3 py-2 bg-gris-canon-de-fusil/5 hover:bg-gris-canon-de-fusil/10 text-xs font-bold rounded-xl text-gris-canon-de-fusil/70"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={savingNewAddress}
                  className="px-4 py-2 bg-bleu-saphir text-blanc text-xs font-bold rounded-xl hover:bg-bleu-saphir/90 transition-all flex items-center"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  {savingNewAddress
                    ? "Enregistrement..."
                    : editingAddressId
                      ? "Mettre à jour"
                      : "Utiliser cette adresse"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
