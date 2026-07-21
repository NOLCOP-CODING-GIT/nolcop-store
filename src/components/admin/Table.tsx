import React from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

export interface HeaderConfig {
  label: string;
  key?: string;
  sortable?: boolean;
}

interface TableProps {
  headers: (string | HeaderConfig)[];
  children: React.ReactNode;
  sortKey?: string | null;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
}

export const Table: React.FC<TableProps> = ({
  headers,
  children,
  sortKey,
  sortDirection,
  onSort,
}) => {
  return (
    <div className="bg-blanc rounded-2xl border border-gris-canon-de-fusil/5 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gris-canon-de-fusil/5 border-b border-gris-canon-de-fusil/5">
              {headers.map((header, index) => {
                const isObject = typeof header === "object";
                const label = isObject ? header.label : header;
                const key = isObject ? header.key : undefined;
                const sortable = isObject ? header.sortable && !!key : false;

                const isActive = sortable && sortKey === key;

                return (
                  <th
                    key={index}
                    className={`px-6 py-4 text-sm font-bold text-gris-canon-de-fusil/60 ${
                      sortable
                        ? "cursor-pointer select-none hover:text-bleu-saphir transition-colors"
                        : ""
                    }`}
                    onClick={() => {
                      if (sortable && key && onSort) {
                        onSort(key);
                      }
                    }}
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>{label}</span>
                      {sortable && (
                        <span className="inline-flex">
                          {isActive ? (
                            sortDirection === "asc" ? (
                              <ArrowUp className="h-3.5 w-3.5 text-bleu-saphir" />
                            ) : (
                              <ArrowDown className="h-3.5 w-3.5 text-bleu-saphir" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3.5 w-3.5 opacity-40 hover:opacity-100 transition-opacity" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
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
