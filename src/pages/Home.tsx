import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Shield, RefreshCw, Package } from "lucide-react";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types";
import Lottie from "lottie-react";
import animationBg from "../../public/lottie/welcome.json";

const Home: React.FC = () => {
  const mockProducts: Product[] = [
    {
      id: "1",
      name: 'MacBook Pro 14"',
      description: "Ordinateur portable puissant avec puce M3 Pro",
      price: 574846,
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
  const newProducts = mockProducts.slice(0, 6);

  const categories = [
    {
      name: "Électronique",
      slug: "electronics",
      image: "/categories/electronics.jfif",
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
      icon: Shield,
      title: "Paiement sécurisé",
      description: "100% sécurisé et crypté",
    },
    {
      icon: RefreshCw,
      title: "Retours faciles",
      description: "14 jours pour retourner",
    },
    {
      icon: Package,
      title: "Emballage cadeau",
      description: "Option disponible",
    },
  ];

  return (
    <div className="min-h-screen bg-blanc">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-violet-myrtille-tenebreux to-[#1e1433] text-blanc overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                <span className="block text-3xl md:text-5xl font-extrabold mb-3 text-blanc">
                  Bienvenue chez
                </span>
                <span className="bg-linear-to-r from-bleu-clair via-orange-rougi to-bleu-clair bg-clip-text text-transparent">
                  Nolcop Store
                </span>
                <span className="block text-bleu-clair text-2xl md:text-4xl mt-6 font-semibold tracking-normal">
                  Votre boutique en ligne
                </span>
              </h1>
              <p className="text-xl mb-8 text-blanc/80 leading-relaxed text-justify">
                Explorez une nouvelle façon de faire vos achats en ligne grâce à
                Nolcop Store. De la sélection rigoureuse de nos nouveautés à la
                rapidité de notre service de livraison, nous mettons tout en
                œuvre pour vous offrir des produits de qualité au meilleur prix
                du marché. Faites votre choix en quelques clics, profitez de la
                flexibilité du paiement à la livraison et achetez en toute
                sérénité grâce à notre
                assistance instantanée toujours à votre écoute.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center bg-bleu-saphir text-blanc px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg"
                >
                  Explorer nos produits
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center border-2 border-blanc/40 text-blanc px-8 py-3 rounded-lg font-semibold hover:bg-blanc hover:text-violet-myrtille-tenebreux hover:border-blanc transition-all"
                >
                  Nous contacter
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center items-center"
            >
              {/* Le Lottie remplace ici l'image illustrative du Hero */}
              <Lottie animationData={animationBg} loop={true} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gris-canon-de-fusil/5">
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-bleu-saphir/10 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-bleu-saphir" />
                </div>
                <h3 className="text-lg font-semibold text-gris-canon-de-fusil mb-2">
                  {feature.title}
                </h3>
                <p className="text-gris-canon-de-fusil/70 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-blanc">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gris-canon-de-fusil mb-4">
              Parcourir par catégorie
            </h2>
            <p className="text-lg text-gris-canon-de-fusil/60">
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
                  className="group relative block overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-w-16 aspect-h-12">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-violet-myrtille-tenebreux/80 via-violet-myrtille-tenebreux/30 to-transparent flex items-end">
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-blanc group-hover:text-bleu-clair transition-colors">
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
      <section className="py-16 bg-gris-canon-de-fusil/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12 flex-col md:flex-row text-center md:text-left">
            <div>
              <h2 className="text-3xl  font-bold text-gris-canon-de-fusil mb-2">
                Produits vedettes
              </h2>
              <p className="text-lg text-gris-canon-de-fusil/60">
                Les articles les plus populaires du moment
              </p>
            </div>
            <Link
              to="/products?featured=true"
              className="bg-bleu-saphir/10 px-4 py-2 rounded-lg mt-4 md:mt-0 text-bleu-saphir hover:text-bleu-saphir/80 font-medium flex items-center transition-colors"
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
      <section className="py-16 bg-blanc">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12 flex-col md:flex-row text-center md:text-left">
            <div>
              <h2 className="text-3xl font-bold text-gris-canon-de-fusil mb-2">
                Nouveautés
              </h2>
              <p className="text-lg text-gris-canon-de-fusil/60">
                Découvrez nos derniers arrivages
              </p>
            </div>
            <Link
              to="/products?sort=newest"
              className="bg-bleu-saphir/10 px-4 py-2 rounded-lg mt-4 md:mt-0 text-bleu-saphir hover:text-bleu-saphir/80 font-medium flex items-center transition-colors"
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
    </div>
  );
};

export default Home;
