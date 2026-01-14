import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, User, Menu, X, Heart } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { state } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsMenuOpen(false);
  };

  const categories = [
    { name: "Électronique", slug: "electronics" },
    { name: "Mode", slug: "fashion" },
    { name: "Maison", slug: "home" },
    { name: "Sports", slug: "sports" },
    { name: "Logiciels", slug: "software" },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="Nolcop Store"
              className="h-8 w-8 object-contain"
            />
            <span className="text-xl font-bold text-gray-900">
              Nolcop Store
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-lg mx-8"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des produits..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative group">
              <button className="text-gray-700 hover:text-indigo-600 font-medium">
                Catégories
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/wishlist"
              className="text-gray-700 hover:text-indigo-600"
            >
              <Heart className="h-6 w-6" />
            </Link>

            <Link
              to="/cart"
              className="relative text-gray-700 hover:text-indigo-600"
            >
              <ShoppingCart className="h-6 w-6" />
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600">
                  <User className="h-6 w-6" />
                  <span className="font-medium">{user.name}</span>
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 first:rounded-t-lg"
                  >
                    Mon profil
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    Mes commandes
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Administration
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 last:rounded-b-lg"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Connexion</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-700"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Search Bar - Mobile */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher des produits..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="px-4 py-2 space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg"
                >
                  {category.name}
                </Link>
              ))}

              <div className="border-t pt-2 mt-2">
                <Link
                  to="/wishlist"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg"
                >
                  <Heart className="h-5 w-5" />
                  <span>Favoris</span>
                </Link>

                <Link
                  to="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Panier ({state.itemCount})</span>
                </Link>

                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg"
                    >
                      Mon profil
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg"
                    >
                      Mes commandes
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg"
                      >
                        Administration
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>Connexion</span>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
