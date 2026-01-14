import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Package className="h-8 w-8 mr-3 text-indigo-600" />
          Mes Commandes
        </h1>
        <p className="text-gray-600">
          {orders.length} {orders.length === 1 ? "commande" : "commandes"}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Vous n'avez pas encore de commandes
          </h2>
          <p className="text-gray-600 mb-6">
            Découvrez nos produits et passez votre première commande
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Découvrir des produits
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;

            return (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Commande {order.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Passée le{" "}
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                      >
                        <StatusIcon className="h-4 w-4 mr-1" />
                        {statusInfo.label}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-gray-600">
                        <Eye className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="border-t pt-4">
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div
                          key={`${item.product.id}-${index}`}
                          className="flex items-center space-x-4"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {item.product.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              Quantité: {item.quantity} ×{" "}
                              {item.product.price.toFixed(2)} €
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {(item.product.price * item.quantity).toFixed(2)}{" "}
                              €
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="border-t mt-4 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {order.items.length}{" "}
                        {order.items.length === 1 ? "article" : "articles"}
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        Total: {order.total.toFixed(2)} €
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-3">
                      <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
                        Suivre la commande
                      </button>
                      <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                        Contacter le support
                      </button>
                    </div>
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
