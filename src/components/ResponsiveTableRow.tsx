import React from "react";

interface ResponsiveTableRowProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveTableRow: React.FC<ResponsiveTableRowProps> = ({
  children,
  className = "",
}) => {
  return <tr className={`hover:bg-gray-50 ${className}`}>{children}</tr>;
};

interface ResponsiveTableCellProps {
  children: React.ReactNode;
  className?: string;
  header?: string;
  maxWidth?: string;
  nowrap?: boolean;
}

export const ResponsiveTableCell: React.FC<ResponsiveTableCellProps> = ({
  children,
  className = "",
  header,
  maxWidth,
  nowrap = false,
}) => {
  const cellClass = nowrap ? "whitespace-nowrap" : "whitespace-normal";

  const style = maxWidth ? { maxWidth } : {};

  return (
    <>
      {/* Mobile view with header */}
      <td className="block sm:hidden px-4 py-3 border-b border-gray-100">
        {header && (
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            {header}
          </div>
        )}
        <div className="text-sm text-gray-900 wrap-break-words">{children}</div>
      </td>

      {/* Desktop view */}
      <td
        className={`hidden sm:table-cell px-4 sm:px-6 py-4 text-sm text-gray-900 border-b border-gray-100 ${cellClass} ${className}`}
        style={style}
      >
        <div className="wrap-break-words">{children}</div>
      </td>
    </>
  );
};

export default ResponsiveTableRow;
