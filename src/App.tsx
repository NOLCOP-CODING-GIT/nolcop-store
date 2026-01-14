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

// Layout pour les pages avec header et footer
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
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
            {/* Routes d'authentification sans header/footer */}
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

            {/* Routes principales avec header/footer */}
            <Route
              path="/*"
              element={
                <MainLayout>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/category/:slug" element={<CategoryPage />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute>
                          <Orders />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requireAdmin>
                          <Admin />
                        </ProtectedRoute>
                      }
                    />
                    {/* Add more routes here */}
                  </Routes>
                </MainLayout>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
