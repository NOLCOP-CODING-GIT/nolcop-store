import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Truck, Shield, RefreshCw, Package } from "lucide-react";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types";

const Home: React.FC = () => {
  const mockProducts: Product[] = [
    {
      id: "1",
      name: 'MacBook Pro 14"',
      description: "Ordinateur portable puissant avec puce M3 Pro",
      price: 1999.99,
      category: "Électronique",
      image:
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
      stock: 15,
      rating: 4.8,
      reviews: 124,
      featured: true,
      colors: ["Space Gray", "Silver"],
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      name: "Nike Air Max 270",
      description: "Chaussures de sport confortables avec amorti maximal",
      price: 150.0,
      discount: 120.0,
      category: "Mode",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
      stock: 8,
      rating: 4.6,
      reviews: 89,
      colors: ["Noir", "Blanc", "Bleu"],
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      createdAt: "2024-01-10T10:00:00Z",
      updatedAt: "2024-01-10T10:00:00Z",
    },
    {
      id: "3",
      name: "Sony WH-1000XM5",
      description:
        "Casque audio sans fil avec réduction de bruit exceptionnelle",
      price: 399.99,
      category: "Électronique",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
      stock: 0,
      rating: 4.9,
      reviews: 256,
      featured: true,
      colors: ["Noir", "Argent"],
      createdAt: "2024-01-20T10:00:00Z",
      updatedAt: "2024-01-20T10:00:00Z",
    },
    {
      id: "4",
      name: "Adidas Ultraboost 22",
      description: "Chaussures de course avec technologie Boost",
      price: 180.0,
      category: "Sports",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
      stock: 25,
      rating: 4.7,
      reviews: 167,
      colors: ["Core Black", "Cloud White", "Solar Red"],
      sizes: ["38", "39", "40", "41", "42", "43", "44", "45"],
      createdAt: "2024-01-25T10:00:00Z",
      updatedAt: "2024-01-25T10:00:00Z",
    },
    {
      id: "5",
      name: "Kindle Paperwhite",
      description: "Liseuse étanche avec écran 300 ppi",
      price: 129.99,
      discount: 99.99,
      category: "Livres",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
      stock: 30,
      rating: 4.5,
      reviews: 203,
      featured: true,
      createdAt: "2024-01-18T10:00:00Z",
      updatedAt: "2024-01-18T10:00:00Z",
    },
    {
      id: "6",
      name: "Dyson V15 Detect",
      description: "Aspirateur sans fil avec laser et détecteur de poussière",
      price: 699.99,
      category: "Maison",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
      stock: 12,
      rating: 4.8,
      reviews: 145,
      colors: ["Gold", "Nickel"],
      createdAt: "2024-01-22T10:00:00Z",
      updatedAt: "2024-01-22T10:00:00Z",
    },
  ];

  const featuredProducts = mockProducts.filter((p) => p.featured);
  const newProducts = mockProducts.slice(0, 4);

  const categories = [
    {
      name: "Électronique",
      slug: "electronics",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500",
    },
    {
      name: "Mode",
      slug: "fashion",
      image:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500",
    },
    {
      name: "Maison",
      slug: "home",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    },
    {
      name: "Sports",
      slug: "sports",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
    },
  ];

  const features = [
    {
      icon: Truck,
      title: "Livraison gratuite",
      description: "À partir de 50€ d'achat",
    },
    {
      icon: Shield,
      title: "Paiement sécurisé",
      description: "100% sécurisé et crypté",
    },
    {
      icon: RefreshCw,
      title: "Retours faciles",
      description: "30 jours pour retourner",
    },
    {
      icon: Package,
      title: "Emballage cadeau",
      description: "Option disponible",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Bienvenue sur Nolcop Store
                <span className="block text-indigo-200">
                  Votre e-commerce sur mesure
                </span>
              </h1>
              <p className="text-xl mb-8 text-indigo-100">
                Découvrez notre démonstration e-commerce. Une solution complète
                développée par Nolcop Coding pour présenter notre expertise en
                développement web.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Explorer la démo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
                >
                  Nous contacter
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600"
                alt="Shopping"
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Parcourir par catégorie
            </h2>
            <p className="text-lg text-gray-600">
              Trouvez exactement ce que vous cherchez
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  to={`/category/${category.slug}`}
                  className="group relative block overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-w-16 aspect-h-12">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end">
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-white">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Produits vedettes
              </h2>
              <p className="text-lg text-gray-600">
                Les articles les plus populaires du moment
              </p>
            </div>
            <Link
              to="/products?featured=true"
              className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
            >
              Voir tout
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Nouveautés
              </h2>
              <p className="text-lg text-gray-600">
                Découvrez nos derniers arrivages
              </p>
            </div>
            <Link
              to="/products?sort=newest"
              className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center"
            >
              Voir tout
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ne manquez aucune offre exclusive
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Abonnez-vous à notre newsletter et recevez -10% sur votre première
            commande
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              S'abonner
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
