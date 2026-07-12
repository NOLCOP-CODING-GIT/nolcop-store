import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User, Menu, X, Heart } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { state } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

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
    <header className="bg-blanc/50 backdrop-blur-md border-b border-blanc/20 shadow-sm sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo commun (Desktop & Mobile) */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="Nolcop Store"
              className="h-10 w-10 object-contain rounded-full"
            />
            <span className="text-xl font-bold bg-linear-to-r from-bleu-clair via-orange-rougi to-bleu-clair bg-clip-text text-transparent">
              Nolcop Store
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8 text-gris-canon-de-fusil">
            {/* Catégories */}
            <div className="relative group">
              <button className="hover:text-bleu-saphir font-medium transition-colors">
                Catégories
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-blanc rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    className="block px-4 py-2 text-sm text-gris-canon-de-fusil hover:bg-bleu-clair/20 hover:text-bleu-saphir first:rounded-t-lg last:rounded-b-lg"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="text-gris-canon-de-fusil hover:text-bleu-saphir transition-colors"
            >
              <Heart className="h-6 w-6" />
            </Link>

            {/* Panier */}
            <Link
              to="/cart"
              className="relative text-gris-canon-de-fusil hover:text-bleu-saphir transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-bleu-saphir text-blanc text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Link>

            {/* Profil utilisateur ou Connexion */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gris-canon-de-fusil hover:text-bleu-saphir transition-colors">
                  <User className="h-6 w-6" />
                  <span className="font-medium">{user.name}</span>
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-blanc rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gris-canon-de-fusil hover:bg-bleu-clair/20 hover:text-bleu-saphir first:rounded-t-lg"
                  >
                    Mon profil
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm text-gris-canon-de-fusil hover:bg-bleu-clair/20 hover:text-bleu-saphir"
                  >
                    Mes commandes
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gris-canon-de-fusil hover:bg-bleu-clair/20 hover:text-bleu-saphir"
                    >
                      Administration
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gris-canon-de-fusil hover:bg-bleu-clair/20 hover:text-bleu-saphir last:rounded-b-lg"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 bg-bleu-saphir text-blanc px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <User className="h-5 w-5" />
                <span>Connexion</span>
              </Link>
            )}
          </nav>

          {/* Actions Droite Mobile (Panier + Hamburger) */}
          <div className="flex items-center space-x-4 md:hidden">
            {/* Panier Mobile */}
            <Link
              to="/cart"
              className="relative text-gris-canon-de-fusil hover:text-bleu-saphir transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-bleu-saphir text-blanc text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </Link>

            {/* Bouton Menu Burger Mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gris-canon-de-fusil hover:text-bleu-saphir focus:outline-none transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menu déroulant Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <div ref={menuRef} className="md:hidden fixed inset-x-0 top-16 z-50">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-blanc border-t border-gris-canon-de-fusil/10 w-full shadow-lg"
            >
              <div className="px-4 py-2 space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2 text-gris-canon-de-fusil hover:bg-bleu-clair/20 hover:text-bleu-saphir rounded-lg transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}

                <div className="border-t border-gris-canon-de-fusil/10 pt-2 mt-2">
                  <Link
                    to="/wishlist"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 text-gris-canon-de-fusil hover:bg-bleu-clair/20 hover:text-bleu-saphir rounded-lg transition-colors"
                  >
                    <Heart className="h-5 w-5" />
                    <span>Favoris</span>
                  </Link>

                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-gris-canon-de-fusil hover:bg-bleu-clair/20 hover:text-bleu-saphir rounded-lg transition-colors"
                      >
                        Mon profil
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-2 text-gris-canon-de-fusil hover:bg-bleu-clair/20 hover:text-bleu-saphir rounded-lg transition-colors"
                      >
                        Mes commandes
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setIsMenuOpen(false)}
                          className="block px-4 py-2 text-gris-canon-de-fusil hover:bg-bleu-clair/20 hover:text-bleu-saphir rounded-lg transition-colors"
                        >
                          Administration
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gris-canon-de-fusil hover:bg-bleu-clair/20 hover:text-bleu-saphir rounded-lg transition-colors"
                      >
                        Déconnexion
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 bg-bleu-saphir text-blanc px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <User className="h-5 w-5" />
                      <span>Connexion</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
