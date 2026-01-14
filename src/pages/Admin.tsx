import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  BarChart3,
  Settings,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Données simulées pour la démo
  const [stats] = useState({
    totalUsers: 1234,
    totalOrders: 567,
    totalRevenue: 45678.9,
    totalProducts: 89,
  });

  const [recentOrders] = useState([
    {
      id: "ORD-001",
      customer: "Jean Dupont",
      total: 1299.99,
      status: "delivered",
      date: "2024-01-15",
    },
    {
      id: "ORD-002",
      customer: "Marie Martin",
      total: 199.99,
      status: "shipped",
      date: "2024-01-20",
    },
    {
      id: "ORD-003",
      customer: "Pierre Durand",
      total: 89.99,
      status: "processing",
      date: "2024-01-22",
    },
  ]);

  const [products] = useState([
    {
      id: "1",
      name: "iPhone 15 Pro",
      price: 999.99,
      stock: 45,
      category: "Électronique",
      image:
        "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=300",
    },
    {
      id: "2",
      name: "MacBook Air M2",
      price: 1299.99,
      stock: 12,
      category: "Électronique",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300",
    },
    {
      id: "3",
      name: "Apple Watch Series 9",
      price: 449.99,
      stock: 0,
      category: "Électronique",
      image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=300",
    },
  ]);

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Accès non autorisé
          </h2>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette
            page
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalUsers}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Commandes</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalOrders}
              </p>
            </div>
            <ShoppingCart className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Revenus</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalRevenue.toFixed(2)} €
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Produits</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalProducts}
              </p>
            </div>
            <Package className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Commandes récentes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-3 text-sm font-medium text-gray-600">
                  Commande
                </th>
                <th className="pb-3 text-sm font-medium text-gray-600">
                  Client
                </th>
                <th className="pb-3 text-sm font-medium text-gray-600">
                  Total
                </th>
                <th className="pb-3 text-sm font-medium text-gray-600">
                  Statut
                </th>
                <th className="pb-3 text-sm font-medium text-gray-600">Date</th>
                <th className="pb-3 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b">
                  <td className="py-3 text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="py-3 text-sm text-gray-600">
                    {order.customer}
                  </td>
                  <td className="py-3 text-sm font-medium text-gray-900">
                    {order.total.toFixed(2)} €
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status === "delivered"
                        ? "Livré"
                        : order.status === "shipped"
                          ? "Expédié"
                          : "En traitement"}
                    </span>
                  </td>
                  <td className="py-3 text-sm text-gray-600">{order.date}</td>
                  <td className="py-3">
                    <button className="text-indigo-600 hover:text-indigo-800">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Gestion des produits
        </h2>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un produit
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-3 text-sm font-medium text-gray-600">
                  Produit
                </th>
                <th className="pb-3 text-sm font-medium text-gray-600">
                  Catégorie
                </th>
                <th className="pb-3 text-sm font-medium text-gray-600">Prix</th>
                <th className="pb-3 text-sm font-medium text-gray-600">
                  Stock
                </th>
                <th className="pb-3 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="py-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-md"
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-gray-600">
                    {product.category}
                  </td>
                  <td className="py-3 text-sm font-medium text-gray-900">
                    {product.price.toFixed(2)} €
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock === 0
                          ? "bg-red-100 text-red-800"
                          : product.stock < 10
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {product.stock === 0 ? "Rupture" : product.stock}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center space-x-2">
                      <button className="text-indigo-600 hover:text-indigo-800">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Administration
        </h1>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "dashboard"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Tableau de bord</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "products"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Produits</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "orders"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Commandes</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "users"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Utilisateurs</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "products" && renderProducts()}
        {activeTab === "orders" && (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              Gestion des commandes en cours de développement...
            </p>
          </div>
        )}
        {activeTab === "users" && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              Gestion des utilisateurs en cours de développement...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
