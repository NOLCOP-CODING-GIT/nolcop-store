import React from "react";
import { Outlet } from "react-router-dom";

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children ? children : <Outlet />}
    </div>
  );
};

export default AuthLayout;
