import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../../../../supabaseClient";

const MONTHS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sept",
  "Oct",
  "Nov",
  "Déc",
];

export const VentesChart: React.FC = () => {
  const [data, setData] = useState(MONTHS.map((m) => ({ name: m, total: 0 })));

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-BJ", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const fetchOrders = async () => {
      // Seules les commandes livrées génèrent du chiffre d'affaires
      const { data: orders } = await supabase
        .from("orders")
        .select("total, created_at")
        .eq("status", "delivered");

      if (orders && orders.length > 0) {
        const newData = MONTHS.map((m) => ({ name: m, total: 0 }));

        orders.forEach((order) => {
          const date = new Date(order.created_at);
          const monthIndex = date.getMonth();
          newData[monthIndex].total += Number(order.total) || 0;
        });

        setData(newData);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="bg-blanc p-6 rounded-2xl border border-gris-canon-de-fusil/10 shadow-xs">
      <h3 className="text-lg font-bold text-gris-canon-de-fusil mb-6">
        Évolution des Ventes
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2041b1" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#2041b1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              formatter={(value: number | undefined) => [
                formatPrice(value || 0),
                "Ventes",
              ]}
              labelStyle={{
                color: "#374151",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#2041b1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
