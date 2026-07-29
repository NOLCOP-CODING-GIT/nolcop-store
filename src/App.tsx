import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { WifiOff } from "lucide-react";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { NotificationContainer } from "./components/Notifications";
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
import ForgotPassword from "./pages/ForgotPassword";
import NotFoundLayout from "./components/NotFoundLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Nouveau MainLayout utilisant <Outlet /> (Recommandé par React Router)
const MainLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-blanc">
    <Header />
    <main className="grow">
      <Outlet /> {/* Les routes enfants s'injectent ici */}
    </main>
    <Footer />
  </div>
);

function App() {
  const [isOnline, setIsOnline] = useState(true);

  // 🔥 GESTION CONNEXION INTERNET
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Affichage en cas de coupure internet
  if (!isOnline) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-blanc text-center p-6">
        <div className="w-16 h-16 bg-rose-600/10 text-rose-600 rounded-full flex items-center justify-center mb-4">
          <WifiOff className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-black text-gris-canon-de-fusil mb-2">
          Connexion perdue
        </h2>
        <p className="text-xs text-gris-canon-de-fusil/60 max-w-xs mb-6 leading-relaxed font-medium">
          Nolcop Store requiert une connexion Internet active pour charger les
          produits, accéder à votre panier et finaliser vos commandes.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-bleu-saphir text-blanc font-bold rounded-xl text-sm transition-all shadow-xs hover:bg-bleu-saphir/90 active:scale-[0.99] cursor-pointer"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Router>
              <NotificationContainer />
              <Routes>
                {/* 1. Routes d'authentification (Sans MainLayout) */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                </Route>

                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* 2. Routes principales de l'application (Toutes avec MainLayout automatique) */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/faq" element={<Faq />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route
                    path="/customer-service"
                    element={<CustomerService />}
                  />

                  {/* Routes Protégées (Avec MainLayout) */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/orders" element={<Orders />} />
                  </Route>
                </Route>
                <Route element={<ProtectedRoute requireAdmin />}>
                  <Route path="/admin" element={<Admin />} />
                </Route>

                {/* 3. Capture globale 404 (S'affiche dans NotFoundLayout, sans Header ni Footer) */}
                <Route
                  path="*"
                  element={
                    <NotFoundLayout>
                      <NotFound />
                    </NotFoundLayout>
                  }
                />
              </Routes>
            </Router>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
