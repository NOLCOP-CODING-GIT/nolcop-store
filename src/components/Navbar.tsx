import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Home,
  User,
  Briefcase,
  Code,
  Mail,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { icon: Home, label: "Accueil", href: "/" },
    { icon: User, label: "À propos", href: "/about" },
    { icon: Briefcase, label: "Projets", href: "/projects" },
    { icon: Code, label: "Compétences", href: "/skills" },
    { icon: Mail, label: "Contact", href: "/contact" },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    navigate(href);
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl text-gray-900 dark:text-white border-b border-gray-200/50 dark:border-gray-800/50 shadow-lg"
          : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl text-gray-900 dark:text-white border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <img
                src="/public/profile-photo.png"
                alt="Logo"
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="font-bold text-xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Portfolio
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  location.pathname === item.href
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
                whileHover={{
                  scale: 1.02,
                  borderBottomColor:
                    location.pathname !== item.href ? "#2563eb" : "transparent",
                }}
                whileTap={{ scale: 0.98 }}
                style={{
                  borderBottom:
                    location.pathname !== item.href
                      ? "2px solid transparent"
                      : "none",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Actions à droite */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 group"
              aria-label="Toggle theme"
            >
              <div className="relative w-6 h-6">
                <Sun
                  className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
                    theme === "dark"
                      ? "opacity-100 rotate-0"
                      : "opacity-0 rotate-90"
                  }`}
                />
                <Moon
                  className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${
                    theme === "light"
                      ? "opacity-100 rotate-0"
                      : "opacity-0 -rotate-90"
                  }`}
                />
              </div>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <div
              className={`fixed top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-all duration-300 ${
                isMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="px-4 py-6 space-y-4">
                {/* Logo dans menu mobile */}
                <div className="flex items-center justify-center mb-6">
                  <Link
                    to="/"
                    className="flex items-center space-x-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-10 h-10 bg-linear-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xl">P</span>
                    </div>
                    <span className="font-bold text-xl bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Portfolio
                    </span>
                  </Link>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-2">
                  {navItems.map((item) => (
                    <motion.div
                      key={item.label}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                          location.pathname === item.href
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
