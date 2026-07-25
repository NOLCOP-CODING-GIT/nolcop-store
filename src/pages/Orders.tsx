import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Lock,
  X,
  MapPin,
  Calendar,
  Trash2,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import type { Order } from "../types";
import { supabase } from "../supabaseClient";

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // État pour gérer le modal de suivi de commande
  const [selectedOrderForTracking, setSelectedOrderForTracking] =
    useState<Order | null>(null);

  // État pour la suppression de commande
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(price);
  };

  React.useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      if (!user?.id) return;

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            *,
            order_items (
              quantity,
              price_at_time,
              product:products (
                id,
                name,
                description,
                category:categories(name),
                images,
                price,
                stock,
                rating,
                reviews,
                created_at,
                updated_at
              )
            )
          `,
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data && isMounted) {
          const formattedOrders: Order[] = data.map((order: any) => ({
            id: order.id,
            userId: order.user_id,
            status: order.status,
            total: Number(order.total),
            paymentMethod: order.payment_method,
            shippingAddress: {
              id: order.id,
              street: order.shipping_address,
              city: order.shipping_city,
              country: "Bénin",
              isDefault: false,
            },
            createdAt: order.created_at,
            updatedAt: order.updated_at,
            items: order.order_items.map((item: any) => ({
              product: {
                id: item.product.id,
                name: item.product.name,
                description: item.product.description,
                category: item.product.category?.name || "Général",
                images: item.product.images,
                price: Number(item.price_at_time),
                stock: item.product.stock,
                rating: item.product.rating,
                reviews: item.product.reviews,
                createdAt: item.product.created_at,
                updatedAt: item.product.updated_at,
              },
              quantity: item.quantity,
            })),
          }));

          setOrders(formattedOrders);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleDeleteOrder = async () => {
    if (!deletingOrderId) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from("orders")
        .delete()
        .eq("id", deletingOrderId);

      if (error) throw error;

      setOrders((prev) => prev.filter((o) => o.id !== deletingOrderId));
      setDeletingOrderId(null);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Impossible de supprimer cette commande.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusInfo = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return {
          label: "En attente",
          color: "text-yellow-600 bg-yellow-100",
          icon: Clock,
          step: 1,
        };
      case "processing":
        return {
          label: "En traitement",
          color: "text-blue-600 bg-blue-100",
          icon: Package,
          step: 2,
        };
      case "shipped":
        return {
          label: "Expédié",
          color: "text-indigo-600 bg-indigo-100",
          icon: Truck,
          step: 3,
        };
      case "delivered":
        return {
          label: "Livré",
          color: "text-green-600 bg-green-100",
          icon: CheckCircle,
          step: 4,
        };
      case "cancelled":
        return {
          label: "Annulé",
          color: "text-red-600 bg-red-100",
          icon: AlertCircle,
          step: 0,
        };
      default:
        return {
          label: status,
          color: "text-gray-600 bg-gray-100",
          icon: Package,
          step: 1,
        };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blanc px-4">
        <div className="text-center max-w-md w-full bg-blanc border border-gris-canon-de-fusil/5 p-8 rounded-2xl shadow-xs">
          <div className="h-16 w-16 bg-bleu-saphir/5 text-bleu-saphir rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-black text-gris-canon-de-fusil mb-3 tracking-tight">
            Espace sécurisé
          </h2>
          <p className="text-sm text-gris-canon-de-fusil/60 leading-relaxed mb-8">
            Vous devez être connecté à votre compte pour accéder à l'historique
            et au suivi en temps réel de vos commandes.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full px-6 py-3.5 bg-bleu-saphir hover:bg-bleu-saphir/90 text-blanc text-sm font-bold rounded-xl transition-all duration-200 shadow-xs cursor-pointer"
          >
            Se connecter à mon compte
          </Link>
          <p className="text-xs text-gris-canon-de-fusil/40 mt-4">
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              className="text-bleu-saphir hover:underline font-semibold"
            >
              Créez-en un ici
            </Link>
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blanc gap-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-12 w-12 rounded-full border-4 border-gris-canon-de-fusil/5"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-bleu-saphir"></div>
        </div>
        <div className="text-center animate-pulse">
          <h5 className="text-sm font-bold text-gris-canon-de-fusil">
            Chargement de vos commandes...
          </h5>
          <p className="text-xs text-gris-canon-de-fusil/50 mt-1">
            Récupération de votre historique sécurisé
          </p>
        </div>
      </div>
    );
  }

  const trackingSteps = [
    { label: "Validée", desc: "Commande reçue" },
    { label: "Préparation", desc: "Emballage en cours" },
    { label: "Expédiée", desc: "En route vers chez vous" },
    { label: "Livrée", desc: "Remise en main propre" },
  ];

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-blanc">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 gap-4">
        <div className="flex items-center">
          <div className="h-12 w-12 bg-bleu-saphir/5 text-bleu-saphir rounded-xl flex items-center justify-center mr-4 shrink-0">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gris-canon-de-fusil tracking-tight">
              Mes Commandes
            </h1>
            <p className="text-xs text-gris-canon-de-fusil/50 mt-0.5">
              Suivi en temps réel de vos achats sécurisés
            </p>
          </div>
        </div>
        <div className="bg-gris-canon-de-fusil/5 px-4 py-2 rounded-xl text-sm font-bold text-gris-canon-de-fusil/70 self-start sm:self-center">
          {orders.length} {orders.length === 1 ? "commande" : "commandes"}
        </div>
      </div>

      {/* Empty State */}
      {orders.length === 0 ? (
        <div className="text-center py-16 bg-blanc rounded-2xl shadow-xs max-w-md mx-auto">
          <div className="h-16 w-16 bg-gris-canon-de-fusil/5 text-gris-canon-de-fusil/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-bold text-gris-canon-de-fusil mb-1">
            Vous n'avez pas encore de commandes
          </h2>
          <p className="text-sm text-gris-canon-de-fusil/50 max-w-xs mx-auto mb-6 leading-relaxed">
            Découvrez nos produits exclusifs et passez votre première commande
            dès aujourd'hui.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-bleu-saphir hover:bg-bleu-saphir/90 text-blanc text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-xs gap-2"
          >
            <span>Découvrir nos produits</span>
          </Link>
        </div>
      ) : (
        /* List */
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={order.id}
                className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gris-canon-de-fusil/5 gap-3">
                    <div>
                      <h3 className="text-base font-extrabold text-gris-canon-de-fusil">
                        Référence {order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <p className="text-xs text-gris-canon-de-fusil/40 mt-0.5">
                        Achat effectué le{" "}
                        {new Date(order.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end space-x-3 w-full sm:w-auto">
                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${statusInfo.color}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5 mr-1.5 shrink-0" />
                        {statusInfo.label}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setSelectedOrderForTracking(order)}
                          className="p-2 text-gris-canon-de-fusil/40 hover:text-bleu-saphir hover:bg-bleu-saphir/5 rounded-xl transition-colors cursor-pointer"
                          title="Détails"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setDeletingOrderId(order.id)}
                          className="p-2 text-gris-canon-de-fusil/40 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Supprimer la commande"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="py-4 my-2 space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={`${item.product.id}-${index}`}
                        className="flex items-center space-x-4"
                      >
                        <img
                          src={
                            item.product.images[0] ||
                            "/categories/electronics.jfif"
                          }
                          alt={item.product.name}
                          className="w-14 h-14 object-cover rounded-xl border border-gris-canon-de-fusil/5 shrink-0 bg-gris-canon-de-fusil/5"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gris-canon-de-fusil truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-gris-canon-de-fusil/50 mt-0.5">
                            Quantité: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-extrabold text-gris-canon-de-fusil">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gris-canon-de-fusil/5 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="text-xs font-semibold text-gris-canon-de-fusil/50 order-2 sm:order-1">
                      {order.items.reduce(
                        (acc, item) => acc + item.quantity,
                        0,
                      )}{" "}
                      {order.items.reduce(
                        (acc, item) => acc + item.quantity,
                        0,
                      ) === 1
                        ? "article"
                        : "articles"}
                      {` • Livré à ${order.shippingAddress.city} via ${order.paymentMethod}`}
                    </div>
                    <div className="text-right order-1 sm:order-2">
                      <span className="text-xs text-gris-canon-de-fusil/40 mr-2">
                        Montant total :
                      </span>
                      <span className="text-xl font-black text-bleu-saphir">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Buttons Actifs */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => setSelectedOrderForTracking(order)}
                      className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/10 text-gris-canon-de-fusil/70 hover:bg-gris-canon-de-fusil/5 font-bold text-sm rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Détails du suivi
                    </button>
                    <Link
                      to="/contact"
                      className="w-full px-4 py-2.5 bg-bleu-saphir text-blanc hover:bg-bleu-saphir/90 font-bold text-sm rounded-xl transition-colors cursor-pointer text-center shadow-xs block"
                    >
                      Besoin d'aide ?
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DE SUIVI DE COMMANDE */}
      {selectedOrderForTracking &&
        (() => {
          const currentStep = getStatusInfo(
            selectedOrderForTracking.status,
          ).step;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-300">
              <div className="bg-blanc max-w-lg w-full rounded-2xl shadow-xl border border-gris-canon-de-fusil/5 overflow-hidden transform transition-all duration-300">
                {/* Header Modal */}
                <div className="p-6 border-b border-gris-canon-de-fusil/5 flex items-center justify-between bg-gris-canon-de-fusil/2">
                  <div>
                    <h3 className="text-lg font-black text-gris-canon-de-fusil tracking-tight">
                      Suivi de Commande
                    </h3>
                    <p className="text-xs text-gris-canon-de-fusil/50 mt-0.5">
                      Réf : #{selectedOrderForTracking.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrderForTracking(null)}
                    className="p-2 hover:bg-gris-canon-de-fusil/10 text-gris-canon-de-fusil/50 hover:text-gris-canon-de-fusil rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Contenu Modal */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-4 bg-gris-canon-de-fusil/5 p-4 rounded-xl text-xs">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-bleu-saphir shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-gris-canon-de-fusil">
                          Destination
                        </p>
                        <p className="text-gris-canon-de-fusil/60 mt-0.5">
                          {selectedOrderForTracking.shippingAddress.street},{" "}
                          {selectedOrderForTracking.shippingAddress.city}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-bleu-saphir shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-gris-canon-de-fusil">
                          Date d'achat
                        </p>
                        <p className="text-gris-canon-de-fusil/60 mt-0.5">
                          {new Date(
                            selectedOrderForTracking.createdAt,
                          ).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {selectedOrderForTracking.status === "cancelled" ? (
                    <div className="flex items-center gap-3 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                      <AlertCircle className="h-5 w-5 shrink-0" />
                      <div className="text-xs font-bold">
                        Cette commande a été annulée. Veuillez contacter notre
                        service client si nécessaire.
                      </div>
                    </div>
                  ) : (
                    <div className="relative pl-6 space-y-6 before:absolute before:bottom-2 before:top-2 before:left-2.75 before:w-0.5 before:bg-gris-canon-de-fusil/10">
                      {trackingSteps.map((step, idx) => {
                        const stepNum = idx + 1;
                        const isCompleted = currentStep >= stepNum;
                        const isCurrent = currentStep === stepNum;

                        return (
                          <div
                            key={idx}
                            className="relative flex items-start gap-4 text-xs"
                          >
                            <div
                              className={`absolute -left-5.25 h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all duration-300 bg-blanc z-10 ${
                                isCompleted
                                  ? "border-bleu-saphir bg-bleu-saphir text-blanc"
                                  : "border-gris-canon-de-fusil/20"
                              }`}
                            >
                              {isCompleted && (
                                <div className="h-1.5 w-1.5 bg-blanc rounded-full" />
                              )}
                            </div>

                            <div className="flex-1">
                              <h4
                                className={`font-bold ${isCurrent ? "text-bleu-saphir text-sm" : isCompleted ? "text-gris-canon-de-fusil" : "text-gris-canon-de-fusil/40"}`}
                              >
                                {step.label} {isCurrent && "— En cours"}
                              </h4>
                              <p className="text-gris-canon-de-fusil/50 mt-0.5">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-gris-canon-de-fusil/5 bg-gris-canon-de-fusil/2 flex justify-end">
                  <button
                    onClick={() => setSelectedOrderForTracking(null)}
                    className="px-5 py-2 bg-gris-canon-de-fusil text-blanc text-xs font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      {/* MODAL DE CONFIRMATION DE SUPPRESSION */}
      {deletingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity duration-300">
          <div className="bg-blanc max-w-sm w-full rounded-2xl shadow-xl border border-gris-canon-de-fusil/5 overflow-hidden p-6 space-y-6">
            <div className="flex flex-col items-center text-center">
              <div className="h-12 w-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gris-canon-de-fusil mb-2">
                Supprimer cette commande ?
              </h3>
              <p className="text-xs text-gris-canon-de-fusil/60 leading-relaxed">
                Cette action supprime définitivement l'historique de cette
                commande.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setDeletingOrderId(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteOrder}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-rose-600 text-white text-xs font-bold rounded-xl hover:bg-rose-700 transition-colors cursor-pointer flex justify-center items-center"
              >
                {isDeleting ? "Suppression..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
