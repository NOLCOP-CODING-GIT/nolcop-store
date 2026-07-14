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
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface Order {
  id: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  total: number;
  createdAt: string;
  items: Array<{
    product: {
      id: string;
      name: string;
      image: string;
      price: number;
    };
    quantity: number;
  }>;
}

const Orders: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Simuler des données pour la démo
  React.useEffect(() => {
    setTimeout(() => {
      setOrders([
        {
          id: "ORD-001",
          status: "delivered",
          total: 1299.99,
          createdAt: "2024-01-15",
          items: [
            {
              product: {
                id: "1",
                name: "MacBook Air M2",
                image:
                  "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300",
                price: 1299.99,
              },
              quantity: 1,
            },
          ],
        },
        {
          id: "ORD-002",
          status: "shipped",
          total: 199.99,
          createdAt: "2024-01-20",
          items: [
            {
              product: {
                id: "2",
                name: "iPhone 15 Pro",
                image:
                  "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=300",
                price: 999.99,
              },
              quantity: 1,
            },
            {
              product: {
                id: "3",
                name: "AirPods Pro",
                image:
                  "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=300",
                price: 249.99,
              },
              quantity: 1,
            },
          ],
        },
        {
          id: "ORD-003",
          status: "processing",
          total: 89.99,
          createdAt: "2024-01-22",
          items: [
            {
              product: {
                id: "4",
                name: "Apple Watch Series 9",
                image:
                  "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=300",
                price: 449.99,
              },
              quantity: 1,
            },
          ],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusInfo = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return {
          label: "En attente",
          color: "text-yellow-600 bg-yellow-100",
          icon: Clock,
        };
      case "processing":
        return {
          label: "En traitement",
          color: "text-blue-600 bg-blue-100",
          icon: Package,
        };
      case "shipped":
        return {
          label: "Expédié",
          color: "text-indigo-600 bg-indigo-100",
          icon: Truck,
        };
      case "delivered":
        return {
          label: "Livré",
          color: "text-green-600 bg-green-100",
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          label: "Annulé",
          color: "text-red-600 bg-red-100",
          icon: AlertCircle,
        };
      default:
        return {
          label: status,
          color: "text-gray-600 bg-gray-100",
          icon: Package,
        };
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connectez-vous pour voir vos commandes
          </h2>
          <p className="text-gray-600 mb-6">
            Vous devez être connecté pour accéder à l'historique de vos
            commandes
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blanc px-4">
        <div className="text-center max-w-md w-full bg-blanc border border-gris-canon-de-fusil/5 p-8 rounded-2xl shadow-xs">
          {/* Icône de cadenas ou d'alerte stylisée avec un fond doux */}
          <div className="h-16 w-16 bg-bleu-saphir/5 text-bleu-saphir rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="h-8 w-8" />
          </div>

          <h2 className="text-2xl font-black text-gris-canon-de-fusil mb-3 tracking-tight">
            Espace sécurisé
          </h2>

          <p className="text-sm text-gris-canon-de-fusil/60 leading-relaxed mb-8">
            Vous devez être connecté à votre compte Nolcop Coding pour accéder à
            l'historique et au suivi en temps réel de vos commandes.
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
          {/* Rail extérieur discret */}
          <div className="absolute h-12 w-12 rounded-full border-4 border-gris-canon-de-fusil/5"></div>
          {/* Spinner actif */}
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-bleu-saphir"></div>
        </div>

        {/* Message de chargement avec pulsation douce */}
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-blanc">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gris-canon-de-fusil/5 mb-8 gap-4">
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
        <div className="text-center py-16 bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl shadow-xs max-w-md mx-auto">
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
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-bleu-saphir hover:bg-bleu-saphir/90 text-blanc text-sm font-bold rounded-xl transition-all duration-200 cursor-pointer shadow-xs gap-2"
          >
            <span>Découvrir nos produits</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        /* Orders List */
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
                        Référence #{order.id.slice(0, 8).toUpperCase()}
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
                      <button className="p-2 text-gris-canon-de-fusil/40 hover:text-bleu-saphir hover:bg-bleu-saphir/5 rounded-xl transition-colors cursor-pointer">
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="py-4 my-2 space-y-4">
                    {order.items.map((item, index) => (
                      <div
                        key={`${item.product.id}-${index}`}
                        className="flex items-center space-x-4"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 object-cover rounded-xl border border-gris-canon-de-fusil/5 shrink-0 bg-gris-canon-de-fusil/5"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gris-canon-de-fusil truncate">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-gris-canon-de-fusil/50 mt-0.5">
                            Quantité: {item.quantity} ×{" "}
                            {formatPrice(item.product.price)}
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

                  {/* Order Footer */}
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

                  {/* Actions Buttons */}
                  <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <button className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/10 text-gris-canon-de-fusil/70 hover:bg-gris-canon-de-fusil/5 font-bold text-sm rounded-xl transition-colors cursor-pointer text-center">
                      Détails du suivi
                    </button>
                    <button className="w-full px-4 py-2.5 bg-bleu-saphir text-blanc hover:bg-bleu-saphir/90 font-bold text-sm rounded-xl transition-colors cursor-pointer text-center shadow-xs">
                      Besoin d'aide ?
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
