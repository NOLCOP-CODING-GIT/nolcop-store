import React from "react";

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
}

export const Card: React.FC<CardProps> = ({ title, value, icon, iconBg }) => {
  return (
    <div className="bg-blanc rounded-2xl border border-gris-canon-de-fusil/5 p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gris-canon-de-fusil/50">
            {title}
          </p>
          <p className="text-2xl font-black text-gris-canon-de-fusil mt-1">
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl ${iconBg}`}>{icon}</div>
      </div>
    </div>
  );
};
