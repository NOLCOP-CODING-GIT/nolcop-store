import React from "react";
import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: "Électronique", slug: "electronics" },
    { name: "Mode", slug: "fashion" },
    { name: "Maison", slug: "home" },
    { name: "Sports", slug: "sports" },
    { name: "Livres", slug: "books" },
  ];

  const usefulLinks = [
    { name: "À propos", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Livraison", href: "/shipping" },
    { name: "Retours", href: "/returns" },
    { name: "Conditions générales", href: "/terms" },
    { name: "Politique de confidentialité", href: "/privacy" },
  ];

  const customerService = [
    { name: "Suivi de commande", href: "/order-tracking" },
    { name: "Guide des tailles", href: "/size-guide" },
    { name: "Moyens de paiement", href: "/payment" },
    { name: "Service client", href: "/customer-service" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/logo.png"
                alt="Nolcop Store"
                className="h-8 w-8 object-contain"
              />
              <span className="text-xl font-bold">Nolcop Store</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Nolcop Store - Votre solution e-commerce sur mesure. Une
              démonstration de notre expertise en développement web pour votre
              future boutique en ligne.
            </p>

            {/* Social Media */}
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-indigo-600 p-2 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-indigo-600 p-2 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-indigo-600 p-2 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 hover:bg-indigo-600 p-2 rounded-lg transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Catégories</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    to={`/category/${category.slug}`}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
            <ul className="space-y-2">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Service client</h3>
            <ul className="space-y-2">
              {customerService.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-indigo-400" />
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p className="text-white">nolcopcoding@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-indigo-400" />
              <div>
                <p className="text-sm text-gray-400">Téléphone</p>
                <p className="text-white">+229 01 44 161 373</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-indigo-400" />
              <div>
                <p className="text-sm text-gray-400">Adresse</p>
                <p className="text-white">Cotonou, Bénin - Segbeya</p>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-2">
              Abonnez-vous à notre newsletter
            </h3>
            <p className="text-gray-300 mb-6">
              Recevez nos dernières offres et nouveautés directement dans votre
              boîte mail
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 px-6 py-2 rounded-lg font-medium transition-colors"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            {currentYear} Nolcop Store. Développé par Nolcop Coding. Tous droits
            réservés. Made with au Bénin
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
