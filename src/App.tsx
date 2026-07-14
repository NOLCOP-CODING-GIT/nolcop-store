import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
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
import Products from "./pages/Products";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./components/NotFound";
import Checkout from "./pages/Checkout";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Payment from "./pages/Payment";
import CustomerService from "./pages/CustomerService";
import About from "./pages/About";
import Faq from "./pages/Faq";
import Shipping from "./pages/Shipping";
import Terms from "./pages/Terms";

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
              path="/products"
              element={
                <MainLayout>
                  <Products />
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
              path="/products/:id"
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
              path="/checkout"
              element={
                <MainLayout>
                  <Checkout />
                </MainLayout>
              }
            />
            <Route
              path="/contact"
              element={
                <MainLayout>
                  <Contact />
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
            <Route
              path="/about"
              element={
                <MainLayout>
                  <About />
                </MainLayout>
              }
            />
            <Route
              path="/faq"
              element={
                <MainLayout>
                  <Faq />
                </MainLayout>
              }
            />
            <Route
              path="/shipping"
              element={
                <MainLayout>
                  <Shipping />
                </MainLayout>
              }
            />
            <Route
              path="/terms"
              element={
                <MainLayout>
                  <Terms />
                </MainLayout>
              }
            />
            <Route
              path="/privacy"
              element={
                <MainLayout>
                  <Privacy />
                </MainLayout>
              }
            />
            <Route
              path="/payment"
              element={
                <MainLayout>
                  <Payment />
                </MainLayout>
              }
            />
            <Route
              path="/customer-service"
              element={
                <MainLayout>
                  <CustomerService />
                </MainLayout>
              }
            />

            {/* Routes Protégées (Avec MainLayout) */}
            <Route
              path="/profile"
              element={
                // <ProtectedRoute>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                // </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                // <ProtectedRoute>
                  <MainLayout>
                    <Orders />
                  </MainLayout>
                // </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                // <ProtectedRoute requireAdmin>
                  <MainLayout>
                    <Admin />
                  </MainLayout>
                // </ProtectedRoute>
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
