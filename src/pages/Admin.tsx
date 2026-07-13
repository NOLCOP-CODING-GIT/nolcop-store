import React, { useState } from "react";
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
} from "lucide-react";

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard"); //[cite: 6]

  // Formateur de prix FCFA (XOF) adapté pour le Bénin
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Données simulées adaptées en Francs CFA (FCFA)
  const [stats] = useState({
    totalUsers: 1234, //[cite: 6]
    totalOrders: 567, //[cite: 6]
    totalRevenue: 29850000, // Ajusté à ~29,8 Millions FCFA
    totalProducts: 89, //[cite: 6]
  });

  const [recentOrders] = useState([
    {
      id: "ORD-001", //[cite: 6]
      customer: "Jean Dupont", //[cite: 6]
      total: 650000, // iPhone 15 Pro en FCFA
      status: "delivered", //[cite: 6]
      date: "2024-01-15", //[cite: 6]
    },
    {
      id: "ORD-002", //[cite: 6]
      customer: "Marie Martin", //[cite: 6]
      total: 130000, // AirPods / Accessoires en FCFA
      status: "shipped", //[cite: 6]
      date: "2024-01-20", //[cite: 6]
    },
    {
      id: "ORD-003", //[cite: 6]
      customer: "Pierre Durand", //[cite: 6]
      total: 590000, // Galaxy S24 en FCFA
      status: "processing", //[cite: 6]
      date: "2024-01-22", //[cite: 6]
    },
  ]);

  const [products] = useState([
    {
      id: "1", //[cite: 6]
      name: "iPhone 15 Pro", //[cite: 6]
      price: 650000, //[cite: 6]
      stock: 45, //[cite: 6]
      category: "Électronique", //[cite: 6]
      image:
        "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=300", //[cite: 6]
    },
    {
      id: "2", //[cite: 6]
      name: "MacBook Air M2", //[cite: 6]
      price: 850000, //[cite: 6]
      stock: 12, //[cite: 6]
      category: "Électronique", //[cite: 6]
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300", //[cite: 6]
    },
    {
      id: "3", //[cite: 6]
      name: "Apple Watch Series 9", //[cite: 6]
      price: 295000, //[cite: 6]
      stock: 0, //[cite: 6]
      category: "Électronique", //[cite: 6]
      image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=300", //[cite: 6]
    },
  ]);

  // Écran d'accès refusé si l'utilisateur n'est pas Admin
  // if (!user || user.role !== "admin") {
  //   //[cite: 6]
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-blanc">
  //       <div className="text-center">
  //         <Settings className="h-12 w-12 text-gris-canon-de-fusil/30 mx-auto mb-4" />
  //         <h2 className="text-2xl font-bold text-gris-canon-de-fusil mb-2">
  //           Accès non autorisé
  //         </h2>
  //         <p className="text-gris-canon-de-fusil/60 mb-6">
  //           Vous n'avez pas les permissions nécessaires pour accéder à cette
  //           page
  //         </p>
  //         <Link
  //           to="/"
  //           className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-blanc bg-bleu-saphir hover:bg-bleu-saphir/90 transition-colors shadow-xs"
  //         >
  //           Retour à l'accueil
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blanc rounded-2xl border border-gris-canon-de-fusil/5 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gris-canon-de-fusil/50">
                Utilisateurs
              </p>
              <p className="text-2xl font-black text-gris-canon-de-fusil mt-1">
                {stats.totalUsers}
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-blanc rounded-2xl border border-gris-canon-de-fusil/5 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gris-canon-de-fusil/50">
                Commandes
              </p>
              <p className="text-2xl font-black text-gris-canon-de-fusil mt-1">
                {stats.totalOrders}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
              <ShoppingCart className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-blanc rounded-2xl border border-gris-canon-de-fusil/5 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gris-canon-de-fusil/50">
                Revenus
              </p>
              <p className="text-2xl font-black text-gris-canon-de-fusil mt-1">
                {formatPrice(stats.totalRevenue)}
              </p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-blanc rounded-2xl border border-gris-canon-de-fusil/5 p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gris-canon-de-fusil/50">
                Produits
              </p>
              <p className="text-2xl font-black text-gris-canon-de-fusil mt-1">
                {stats.totalProducts}
              </p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-500 rounded-xl">
              <Package className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-blanc rounded-2xl border border-gris-canon-de-fusil/5 p-6 shadow-xs">
        <h2 className="text-xl font-bold text-gris-canon-de-fusil mb-4">
          Commandes récentes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gris-canon-de-fusil/5">
                <th className="pb-3 text-sm font-bold text-gris-canon-de-fusil/60">
                  Commande
                </th>
                <th className="pb-3 text-sm font-bold text-gris-canon-de-fusil/60">
                  Client
                </th>
                <th className="pb-3 text-sm font-bold text-gris-canon-de-fusil/60">
                  Total
                </th>
                <th className="pb-3 text-sm font-bold text-gris-canon-de-fusil/60">
                  Statut
                </th>
                <th className="pb-3 text-sm font-bold text-gris-canon-de-fusil/60">
                  Date
                </th>
                <th className="pb-3 text-sm font-bold text-gris-canon-de-fusil/60">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-canon-de-fusil/5">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="py-3.5 text-sm font-bold text-gris-canon-de-fusil">
                    {order.id}
                  </td>
                  <td className="py-3.5 text-sm text-gris-canon-de-fusil/80">
                    {order.customer}
                  </td>
                  <td className="py-3.5 text-sm font-black text-bleu-saphir">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        order.status === "delivered"
                          ? "bg-emerald-50 text-emerald-700"
                          : order.status === "shipped"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {order.status === "delivered"
                        ? "Livré"
                        : order.status === "shipped"
                          ? "Expédié"
                          : "En traitement"}
                    </span>
                  </td>
                  <td className="py-3.5 text-sm text-gris-canon-de-fusil/60">
                    {order.date}
                  </td>
                  <td className="py-3.5">
                    <button className="text-bleu-saphir hover:text-bleu-saphir/80 transition-colors p-1 hover:bg-bleu-saphir/5 rounded-lg">
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gris-canon-de-fusil">
          Gestion des produits
        </h2>
        <button className="flex items-center px-4 py-2.5 bg-bleu-saphir text-blanc rounded-xl hover:bg-bleu-saphir/90 transition-colors shadow-xs font-semibold text-sm cursor-pointer self-start sm:self-auto">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un produit
        </button>
      </div>

      <div className="bg-blanc rounded-2xl border border-gris-canon-de-fusil/5 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gris-canon-de-fusil/5 border-b border-gris-canon-de-fusil/5">
                <th className="px-6 py-4 text-sm font-bold text-gris-canon-de-fusil/60">
                  Produit
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gris-canon-de-fusil/60">
                  Catégorie
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gris-canon-de-fusil/60">
                  Prix
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gris-canon-de-fusil/60">
                  Stock
                </th>
                <th className="px-6 py-4 text-sm font-bold text-gris-canon-de-fusil/60">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gris-canon-de-fusil/5">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gris-canon-de-fusil/10 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-xl shrink-0"
                      />
                      <span className="text-sm font-bold text-gris-canon-de-fusil">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gris-canon-de-fusil/60">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-bleu-saphir">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        product.stock === 0
                          ? "bg-rose-50 text-rose-700"
                          : product.stock < 10
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {product.stock === 0
                        ? "Rupture"
                        : `${product.stock} dispo`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button className="text-bleu-saphir hover:text-bleu-saphir/80 transition-colors p-1.5 hover:bg-bleu-saphir/5 rounded-lg">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-rose-600 hover:text-rose-800 transition-colors p-1.5 hover:bg-rose-50 rounded-lg">
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
    <div className="min-h-screen bg-blanc">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-black text-gris-canon-de-fusil mb-8">
          Administration
        </h1>

        {/* Navigation Tabs */}
        <div className="border-b border-gris-canon-de-fusil/10 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-4 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "dashboard"
                  ? "border-bleu-saphir text-bleu-saphir"
                  : "border-transparent text-gris-canon-de-fusil/40 hover:text-gris-canon-de-fusil/70"
              }`}
            >
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Tableau de bord</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`py-4 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "products"
                  ? "border-bleu-saphir text-bleu-saphir"
                  : "border-transparent text-gris-canon-de-fusil/40 hover:text-gris-canon-de-fusil/70"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Produits</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`py-4 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "orders"
                  ? "border-bleu-saphir text-bleu-saphir"
                  : "border-transparent text-gris-canon-de-fusil/40 hover:text-gris-canon-de-fusil/70"
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Commandes</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap cursor-pointer ${
                activeTab === "users"
                  ? "border-bleu-saphir text-bleu-saphir"
                  : "border-transparent text-gris-canon-de-fusil/40 hover:text-gris-canon-de-fusil/70"
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
          <div className="text-center py-16 bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl shadow-xs">
            <ShoppingCart className="h-16 w-16 text-gris-canon-de-fusil/20 mx-auto mb-4" />
            <p className="text-sm font-semibold text-gris-canon-de-fusil/60">
              Gestion des commandes en cours de développement...
            </p>
          </div>
        )}
        {activeTab === "users" && (
          <div className="text-center py-16 bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl shadow-xs">
            <Users className="h-16 w-16 text-gris-canon-de-fusil/20 mx-auto mb-4" />
            <p className="text-sm font-semibold text-gris-canon-de-fusil/60">
              Gestion des utilisateurs en cours de développement...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
