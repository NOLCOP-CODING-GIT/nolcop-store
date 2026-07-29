import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  RefreshCw,
  Package,
  Headphones,
  Loader2,
} from "lucide-react";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types";
import Lottie from "lottie-react";
import animationBg from "../../public/lottie/welcome.json";
import { supabase } from "../supabaseClient";

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: productsData } = await supabase
          .from("products")
          .select("*, category:categories(name)")
          .order("created_at", { ascending: false });

        if (productsData) {
          const formattedProducts = productsData.map((p) => ({
            id: p.id,
            name: p.name,
            description: p.description,
            price: p.price,
            discount: p.discount,
            category: p.category?.name || "Général",
            images: p.images,
            stock: p.stock,
            rating: p.rating,
            reviews: p.reviews,
            featured: p.featured,
            specifications: p.specifications,
            createdAt: p.created_at,
            updatedAt: p.updated_at,
          }));
          setProducts(formattedProducts as Product[]);
        }

        const { data: categoriesData } = await supabase
          .from("categories")
          .select("*");
        if (categoriesData) {
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 3);
  const newProducts = products.slice(0, 4);

  const features = [
    {
      icon: Shield,
      title: "Paiement sécurisé",
      description: "100% sécurisé et crypté",
    },
    {
      icon: RefreshCw,
      title: "Retours faciles",
      description: "7 jours pour retourner",
    },
    {
      icon: Package,
      title: "Emballage cadeau",
      description: "Option disponible",
    },
    {
      icon: Headphones, // Ajout pour équilibrer la grille de 4
      title: "Assistance Instantanée",
      description: "Toujours à votre écoute",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-blanc flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-bleu-saphir animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blanc">
      {/* Hero Section */}
      <section className="relative bg-linear-to-r from-violet-myrtille-tenebreux to-[#1e1433] text-blanc overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-15">
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
                sérénité grâce à notre assistance instantanée toujours à votre
                écoute.
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-6">
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
