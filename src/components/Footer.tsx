import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { useCategories } from "../hooks/useCategories";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { categories } = useCategories();

  const usefulLinks = [
    { name: "À propos", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Livraison", href: "/shipping" },
    { name: "Conditions générales", href: "/terms" },
    { name: "Politique de confidentialité", href: "/privacy" },
  ];

  const customerService = [
    { name: "Moyens de paiement", href: "/payment" },
    { name: "Service client", href: "/customer-service" },
  ];

  return (
    <footer className="bg-violet-myrtille-tenebreux text-blanc">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="Nolcop Store"
                className="h-10 w-10 object-contain rounded-full"
              />
              <span className="text-xl font-bold bg-linear-to-r from-bleu-saphir via-orange-rougi to-bleu-saphir bg-clip-text text-transparent">
                Nolcop Store
              </span>
            </Link>
            <p className="text-blanc/70 mb-6 max-w-md text-sm leading-relaxed text-justify">
              Nolcop Store - Votre solution e-commerce sur mesure. Une
              démonstration de notre expertise en développement web pour votre
              future boutique en ligne.
            </p>

            {/* Social Media */}
            <div className="flex items-center space-x-3">
              <Link
                to="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <img src="/instagram.png" className="h-auto w-7" />
              </Link>
              <Link
                to="https://wa.me/2290140585835?text=Bonjour%20je%20souhaite%20avoir%20des%20informations"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <img src="/whatsapp.png" className="h-auto w-7" />
              </Link>
              <Link
                to="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <img src="/youtube.png" className="h-auto w-7" />
              </Link>
            </div>
          </div>

          {/* Categories */}
          {categories && categories.length > 1 ? (
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-bleu-clair mb-4">
                Catégories
              </h3>
              <ul className="space-y-2 text-sm">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    to={`/category/${category.slug}`}
                    className="block px-4 py-2 ..."
                  >
                    {category.name}
                  </Link>
                ))}
              </ul>
            </div>
          ) : (
            ""
          )}

          {/* Useful Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-bleu-clair mb-4">
              Liens utiles
            </h3>
            <ul className="space-y-2 text-sm">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-blanc/70 hover:text-blanc transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-bleu-clair mb-4">
              Service client
            </h3>
            <ul className="space-y-2 text-sm">
              {customerService.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-blanc/70 hover:text-blanc transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-blanc/10 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-bleu-clair" />
              <div>
                <p className="text-xs text-blanc/50">Email</p>
                <Link
                  to="mailto:nolcopcoding@gmail.com"
                  className="text-sm text-blanc"
                >
                  nolcopcoding@gmail.com
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-bleu-clair" />
              <div>
                <p className="text-xs text-blanc/50">Téléphone</p>
                <Link to="tel:+2290140585835" className="text-sm text-blanc">
                  +229 01 40 58 58 35
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-bleu-clair" />
              <div>
                <p className="text-xs text-blanc/50">Adresse</p>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  to="https://maps.app.goo.gl/bykr9ajj4ciTZFdq7"
                  className="text-sm text-blanc"
                >
                  Cotonou, Bénin - Segbeya
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-blanc/10 mt-8 pt-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2">
              Abonnez-vous à notre newsletter
            </h3>
            <p className="text-sm text-blanc/70 mb-6">
              Recevez nos dernières offres et nouveautés directement dans votre
              boîte mail
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-2 bg-blanc/5 border border-blanc/10 text-blanc placeholder-blanc/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-bleu-saphir focus:border-transparent text-sm"
                required
              />
              <button
                type="submit"
                className="bg-bleu-saphir hover:opacity-90 px-6 py-2 rounded-lg text-sm font-medium transition-all"
              >
                S'abonner
              </button>
            </form>
          </div>
        </div>

        {/* Bas de page : Copyright & Liens Légaux */}
        <div className="border-t border-blanc/10 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-blanc/50">
          <p className="text-center md:text-left">
            &copy; {currentYear} Nolcop Store. Développé par{" "}
            <Link
              to="https://nolcop.unaux.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-rougi font-bold"
            >
              Nolcop Coding
            </Link>
            . Tous droits réservés.
          </p>

          {/* Nouveaux Menus ajoutés en bas */}
          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="hover:text-blanc transition-colors duration-150"
            >
              Politique de confidentialité
            </Link>
            <Link
              to="/terms"
              className="hover:text-blanc transition-colors duration-150"
            >
              Conditions d'utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
