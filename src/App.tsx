import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthLayout from "./components/AuthLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Admin from "./pages/Admin";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./components/NotFound";

// Layout pour les pages avec header et footer harmonisé
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col bg-blanc">
    <Header />
    <main className="grow">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* 1. Routes d'authentification (Sans MainLayout) */}
            <Route
              path="/login"
              element={
                <AuthLayout>
                  <Login />
                </AuthLayout>
              }
            />
            <Route
              path="/register"
              element={
                <AuthLayout>
                  <Register />
                </AuthLayout>
              }
            />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* 2. Routes principales de l'application (Avec MainLayout) */}
            <Route
              path="/"
              element={
                <MainLayout>
                  <Home />
                </MainLayout>
              }
            />
            <Route
              path="/search"
              element={
                <MainLayout>
                  <SearchPage />
                </MainLayout>
              }
            />
            <Route
              path="/category/:slug"
              element={
                <MainLayout>
                  <CategoryPage />
                </MainLayout>
              }
            />
            <Route
              path="/product/:id"
              element={
                <MainLayout>
                  <ProductDetail />
                </MainLayout>
              }
            />
            <Route
              path="/wishlist"
              element={
                <MainLayout>
                  <Wishlist />
                </MainLayout>
              }
            />
            <Route
              path="/cart"
              element={
                <MainLayout>
                  <Cart />
                </MainLayout>
              }
            />

            {/* Routes Protégées (Avec MainLayout) */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <Orders />
                  </MainLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <MainLayout>
                    <Admin />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* 3. Capture globale 404 : S'affichera de manière totalement isolée */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
