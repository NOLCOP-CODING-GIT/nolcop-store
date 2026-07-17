import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-blanc flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Section Animation Chiffre 404 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <h1 className="text-9xl font-extrabold tracking-widest text-violet-myrtille-tenebreux select-none opacity-10">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="animate-pulse bg-linear-to-r from-bleu-clair via-orange-rougi to-bleu-saphir bg-clip-text text-transparent text-5xl md:text-6xl font-black">
              Oups !
            </span>
          </div>
        </motion.div>

        {/* Textes explicatifs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-3"
        >
          <h2 className="text-2xl font-bold text-gris-canon-de-fusil sm:text-3xl">
            Page introuvable
          </h2>
          <p className="text-base text-gris-canon-de-fusil/70">
            Désolé, la page que vous recherchez n'existe pas sur Nolcop Store.
          </p>
        </motion.div>

        {/* Boutons d'actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
        >
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-gris-canon-de-fusil/20 rounded-lg text-sm font-medium text-gris-canon-de-fusil bg-blanc hover:bg-gris-canon-de-fusil/5 transition-all cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retourner
          </button>

          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-blanc bg-bleu-saphir hover:opacity-90 shadow-md transition-all"
          >
            <Home className="mr-2 h-4 w-4" />
            Accueil Nolcop Store
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
