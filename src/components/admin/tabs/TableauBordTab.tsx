// Fichier : src/components/admin/tabs/TableauBordTab.tsx
import React, { useState, useEffect } from "react";
import { Users, ShoppingCart, DollarSign, Package, Eye } from "lucide-react";
import { supabase } from "../../../supabaseClient";
import { Card } from "../Card";
import { Table } from "../Table";

export const TableauBordTab: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Utilisateurs avec le rôle 'user'
      const { count: usersCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("role", "user");

      // Total des commandes
      const { count: ordersCount } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      // Revenus (commandes livrées)
      const { data: revenueData } = await supabase
        .from("orders")
        .select("total")
        .eq("status", "delivered");
      const revTotal =
        revenueData?.reduce((acc, curr) => acc + (curr.total || 0), 0) || 0;

      // Total des produits
      const { count: productsCount } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true });

      // 5 dernières commandes
      const { data: oData } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        totalUsers: usersCount || 0,
        totalOrders: ordersCount || 0,
        totalRevenue: revTotal,
        totalProducts: productsCount || 0,
      });

      if (oData) setRecentOrders(oData);
    } catch (error) {
      console.error("Erreur de chargement du dashboard", error);
    }
  };

  return (
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
              {order.id.slice(0, 8)}...
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
  );
};
