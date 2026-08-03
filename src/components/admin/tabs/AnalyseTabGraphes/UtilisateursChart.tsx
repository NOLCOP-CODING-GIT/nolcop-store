import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
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

export const UtilisateursChart: React.FC = () => {
  const [data, setData] = useState(
    MONTHS.map((m) => ({ name: m, utilisateurs: 0 })),
  );

  useEffect(() => {
    const fetchUsers = async () => {
      // Uniquement les clients
      const { data: users } = await supabase
        .from("users")
        .select("created_at")
        .eq("role", "user");

      if (users && users.length > 0) {
        const newData = MONTHS.map((m) => ({ name: m, utilisateurs: 0 }));

        users.forEach((user) => {
          const date = new Date(user.created_at);
          const monthIndex = date.getMonth();
          newData[monthIndex].utilisateurs += 1;
        });

        setData(newData);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="bg-blanc p-6 rounded-2xl border border-gris-canon-de-fusil/10 shadow-xs">
      <h3 className="text-lg font-bold text-gris-canon-de-fusil mb-6">
        Nouveaux Utilisateurs
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
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
            />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              cursor={{ fill: "#f3f4f6" }}
              labelStyle={{
                color: "#374151",
                fontWeight: "bold",
                marginBottom: "4px",
              }}
            />
            <Bar
              dataKey="utilisateurs"
              fill="#178a3d"
              radius={[4, 4, 0, 0]}
              barSize={32}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
