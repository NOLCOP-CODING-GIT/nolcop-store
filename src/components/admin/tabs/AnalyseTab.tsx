import React, { useEffect, useState } from "react";
import { Users, ShoppingCart, DollarSign } from "lucide-react";
import { VentesChart } from "./AnalyseTabGraphes/VentesChart";
import { UtilisateursChart } from "./AnalyseTabGraphes/UtilisateursChart";
import { supabase } from "../../../supabaseClient";

export const AnalyseTab: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: usersCount } = await supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("role", "user");
        const { count: ordersCount } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true });
        const { data: orders } = await supabase
          .from("orders")
          .select("total")
          .eq("status", "delivered");

        const revenue = orders
          ? orders.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0)
          : 0;

        setStats({
          totalUsers: usersCount || 0,
          totalOrders: ordersCount || 0,
          totalRevenue: revenue,
        });
      } catch (error) {
        console.error("Erreur de récupération des stats", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gris-canon-de-fusil">
        Analyses & Statistiques
      </h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blanc  p-6 rounded-2xl border border-gris-canon-de-fusil/10 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gris-canon-de-fusil/60">
              Chiffre d'Affaires Total
            </p>  
            <h4 className="text-2xl font-bold text-gris-canon-de-fusil">
              {formatPrice(stats.totalRevenue)}
            </h4>
          </div>
          <div className="p-3 bg-bleu-saphir/10 rounded-xl">
            <DollarSign className="h-6 w-6 text-bleu-saphir" />
          </div>
        </div>

        <div className="bg-blanc  p-6 rounded-2xl border border-gris-canon-de-fusil/10 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gris-canon-de-fusil/60">
              Commandes Enregistrées
            </p>
            <h4 className="text-2xl font-bold text-gris-canon-de-fusil">
              {stats.totalOrders}
            </h4>
          </div>
          <div className="p-3 bg-rouge-ecarlate/10 rounded-xl">
            <ShoppingCart className="h-6 w-6 text-rouge-ecarlate" />
          </div>
        </div>

        <div className="bg-blanc  p-6 rounded-2xl border border-gris-canon-de-fusil/10 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gris-canon-de-fusil/60">
              Comptes Clients
            </p>
            <h4 className="text-2xl font-bold text-gris-canon-de-fusil">
              {stats.totalUsers}
            </h4>
          </div>
          <div className="p-3 bg-vert-jungle/10 rounded-xl">
            <Users className="h-6 w-6 text-vert-jungle" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <VentesChart />
        <UtilisateursChart />
      </div>
    </div>
  );
};
