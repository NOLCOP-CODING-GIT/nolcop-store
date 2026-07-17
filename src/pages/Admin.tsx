import React, { useState, useEffect } from "react";
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
import { supabase } from "../supabaseClient"; // Ajuste le chemin vers ton client Supabase
import { Card } from "../components/admin/Card";
import { Table } from "../components/admin/Table";
import { Modal } from "../components/admin/Modal";
import type { Product } from "../types";

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });

  // État du formulaire d'ajout
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    image_url: "",
  });

  // Formateur monétaire global XOF
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Chargement initial des données depuis Supabase
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // 1. Fetch produits
      const { data: pData } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (pData) setProducts(pData);

      // 2. Fetch commandes récentes
      const { data: oData } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      if (oData) setRecentOrders(oData);

      // 3. Calcul / Récupération des statistiques réelles
      const { count: usersCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });
      const { count: ordersCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      // Somme des revenus totaux payés
      const { data: revenueData } = await supabase
        .from("orders")
        .select("total")
        .eq("status", "delivered");
      const revTotal =
        revenueData?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;

      setStats({
        totalUsers: usersCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue: revTotal,
        totalProducts: pData?.length || 0,
      });
    } catch (error) {
      console.error("Erreur de chargement Supabase", error);
    }
  };

  // Soumission du formulaire d'ajout
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        category: newProduct.category,
        description: newProduct.description,
        images: [
          newProduct.image_url ||
            "https://images.unsplash.com/photo-1592286115803-a1c3b552ee43?w=300",
        ], // Fallback image
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("products").insert([payload]);

      if (error) throw error;

      // Reset et rafraîchissement
      setNewProduct({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        image_url: "",
      });
      setIsModalOpen(false);
      fetchAdminData();
    } catch (error) {
      console.error("Erreur lors de l'ajout", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      await supabase.from("products").delete().eq("id", id);
      fetchAdminData();
    }
  };

  return (
    <div className="min-h-screen bg-blanc">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-black text-gris-canon-de-fusil mb-8">
          Administration
        </h1>

        {/* Barre d'onglets */}
        <div className="border-b border-gris-canon-de-fusil/10 mb-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-none">
            {[
              {
                id: "dashboard",
                label: "Tableau de bord",
                icon: <BarChart3 className="h-4 w-4" />,
              },
              {
                id: "products",
                label: "Produits",
                icon: <Package className="h-4 w-4" />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-bold text-sm transition-all whitespace-nowrap cursor-pointer flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? "border-bleu-saphir text-bleu-saphir"
                    : "border-transparent text-gris-canon-de-fusil/40 hover:text-gris-canon-de-fusil/70"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Dashboard View */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card
                title="Utilisateurs"
                value={stats.totalUsers}
                icon={<Users className="h-6 w-6" />}
                iconBg="bg-blue-50 text-blue-500"
              />
              <Card
                title="Commandes"
                value={stats.totalOrders}
                icon={<ShoppingCart className="h-6 w-6" />}
                iconBg="bg-emerald-50 text-emerald-500"
              />
              <Card
                title="Revenus"
                value={formatPrice(stats.totalRevenue)}
                icon={<DollarSign className="h-6 w-6" />}
                iconBg="bg-amber-50 text-amber-500"
              />
              <Card
                title="Produits"
                value={stats.totalProducts}
                icon={<Package className="h-6 w-6" />}
                iconBg="bg-purple-50 text-purple-500"
              />
            </div>

            <h2 className="text-xl font-bold text-gris-canon-de-fusil mt-8 mb-4">
              Commandes récentes
            </h2>
            <Table headers={["Commande", "Total", "Statut", "Actions"]}>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 text-sm font-bold text-gris-canon-de-fusil">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-bleu-saphir">
                    {formatPrice(order.total)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-bleu-saphir hover:bg-bleu-saphir/5 p-1 rounded-lg">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        )}

        {/* Products View */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gris-canon-de-fusil">
                Gestion des produits
              </h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center px-4 py-2.5 bg-bleu-saphir text-blanc rounded-xl hover:bg-bleu-saphir/90 transition-all font-semibold text-sm cursor-pointer shadow-xs"
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter un produit
              </button>
            </div>

            <Table
              headers={["Produit", "Catégorie", "Prix", "Stock", "Actions"]}
            >
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gris-canon-de-fusil/2 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center space-x-3">
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg shrink-0 bg-gray-100"
                    />
                    <span className="text-sm font-bold text-gris-canon-de-fusil">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gris-canon-de-fusil/60">
                    {product.category}
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-bleu-saphir">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">
                    {product.stock} dispo
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button className="text-bleu-saphir p-1.5 hover:bg-bleu-saphir/5 rounded-lg">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="text-rose-600 p-1.5 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        )}
      </div>

      {/* Modal d'ajout de produit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Ajouter un nouveau produit"
      >
        <form onSubmit={handleAddProduct} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase mb-1">
              Nom du produit
            </label>
            <input
              type="text"
              required
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir text-xs font-semibold"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase mb-1">
                Prix (XOF)
              </label>
              <input
                type="number"
                required
                value={newProduct.price}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase mb-1">
                Stock disponible
              </label>
              <input
                type="number"
                required
                value={newProduct.stock}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, stock: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir text-xs font-semibold"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase mb-1">
              Catégorie
            </label>
            <input
              type="text"
              required
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir text-xs font-semibold"
              placeholder="Ex: Électronique, Mode"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase mb-1">
              URL de l'image
            </label>
            <input
              type="url"
              value={newProduct.image_url}
              onChange={(e) =>
                setNewProduct({ ...newProduct, image_url: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir text-xs font-semibold"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gris-canon-de-fusil/60 uppercase mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({ ...newProduct, description: e.target.value })
              }
              className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir text-xs font-semibold resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-bleu-saphir text-blanc text-xs font-bold rounded-xl hover:bg-bleu-saphir/90 shadow-sm transition-all flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blanc border-t-transparent" />
            ) : (
              "Créer le produit"
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Admin;
