import React from "react";

interface TableProps {
  headers: string[];
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, children }) => {
  return (
    <div className="bg-blanc rounded-2xl border border-gris-canon-de-fusil/5 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gris-canon-de-fusil/5 border-b border-gris-canon-de-fusil/5">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-sm font-bold text-gris-canon-de-fusil/60"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gris-canon-de-fusil/5">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
};
