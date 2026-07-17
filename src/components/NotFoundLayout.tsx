import React from "react";

interface NotFoundProps {
  children: React.ReactNode;
}

const NotFoundLayout: React.FC<NotFoundProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
};

export default NotFoundLayout;
