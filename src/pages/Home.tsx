import { useState, useEffect, useCallback, useMemo } from "react";
import { Download, Star, Users, Code2, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { motion } from "framer-motion";

const Home = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const { theme } = useTheme();

  const roles = useMemo(
    () => ["Développeur Full Stack", "Designer UI/UX", "Créatif Digital"],
    []
  );

  const nextRole = useCallback(() => {
    setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    setIsTyping(true);
  }, [roles.length]);

  useEffect(() => {
    const currentRole = roles[currentRoleIndex];

    if (isTyping) {
      if (text.length < currentRole.length) {
        const timeout = setTimeout(() => {
          setText(currentRole.slice(0, text.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (text.length > 0) {
        const timeout = setTimeout(() => {
          setText(text.slice(0, -1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        // Utiliser requestAnimationFrame pour éviter l'appel synchrone
        requestAnimationFrame(() => {
          nextRole();
        });
      }
    }
  }, [text, isTyping, currentRoleIndex, roles, nextRole]);

  const stats = [
    { label: "Projets complétés", value: "6+", icon: Star },
    { label: "Clients satisfaits", value: "20+", icon: Users },
    { label: "Années d'expérience", value: "4+", icon: Code2 },
    { label: "Technologies maîtrisées", value: "10+", icon: Zap },
  ];

  return (
    <motion.section
      id="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`min-h-screen flex items-center justify-center pt-16 ${
        theme === "dark"
          ? "bg-linear-to-br from-gray-900 to-gray-800"
          : "bg-linear-to-br from-blue-50 to-purple-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenu texte */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8 text-center lg:text-left"
          >
            {/* Titre principal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-7xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Bonjour, je suis
              </h1>
              <h2
                className={`text-4xl md:text-6xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                ZINSOU M. Jean O.
              </h2>
            </motion.div>

            {/* Texte animé */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="h-20 flex items-center justify-center lg:justify-start"
            >
              <p className="text-2xl md:text-3xl text-gray-600 dark:text-gray-300">
                <span className="text-blue-600 dark:text-blue-400">{text}</span>
                <span className="animate-pulse">|</span>
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className={`text-lg md:text-xl ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              } max-w-2xl mx-auto lg:mx-0`}
            >
              Passionné par la création d'expériences web modernes et
              intuitives. Je transforme vos idées en applications élégantes et
              fonctionnelles.
            </motion.p>

            {/* Statistiques */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-2">
                    <stat.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div
                    className={
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }
                  >
                    {stat.value}
                  </div>
                  <div
                    className={`text-sm ${
                      theme === "dark" ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Boutons d'action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/projects"
                  className={`px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${
                    theme === "dark"
                      ? "bg-gray-800 text-white hover:bg-gray-700"
                      : "bg-linear-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  }`}
                >
                  Voir mes projets
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/contact"
                  className={`px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${
                    theme === "dark"
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  }`}
                >
                  Me contacter
                </Link>
              </motion.div>
            </motion.div>

            {/* Télécharger CV */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="flex justify-center lg:justify-start"
            >
              <motion.a
                href="/cv.pdf"
                download
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg hover:shadow-lg transition-colors ${
                  theme === "dark"
                    ? "bg-gray-900 text-gray-300 hover:bg-gray-800 hover:text-white"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                <Download className="w-5 h-5" />
                <span>Télécharger mon CV</span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Photo profil */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Éléments décoratifs farfelus */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -left-4 w-8 h-8"
              >
                <div className="w-full h-full bg-linear-to-r from-yellow-400 to-orange-500 rounded-full opacity-80"></div>
              </motion.div>

              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -top-2 -right-6 w-6 h-6"
              >
                <div className="w-full h-full bg-linear-to-r from-pink-400 to-purple-500 rotate-45 opacity-80"></div>
              </motion.div>

              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-3 -left-3 w-5 h-5"
              >
                <div className="w-full h-full bg-linear-to-r from-blue-400 to-cyan-500 rounded-lg opacity-80"></div>
              </motion.div>

              <motion.div
                animate={{ rotate: [0, 180, 360] }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-2 -right-4 w-7 h-7"
              >
                <div className="w-full h-full bg-linear-to-r from-green-400 to-teal-500 rounded-full opacity-80"></div>
              </motion.div>

              {/* Bordure créative principale */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative w-64 h-64 md:w-80 md:h-80"
              >
                {/* Bordure extérieure animée */}
                <motion.div
                  animate={{
                    background: [
                      "linear-gradient(45deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B, #10B981, #3B82F6)",
                      "linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B, #10B981, #3B82F6)",
                      "linear-gradient(135deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B, #10B981, #3B82F6)",
                      "linear-gradient(180deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B, #10B981, #3B82F6)",
                      "linear-gradient(225deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B, #10B981, #3B82F6)",
                      "linear-gradient(270deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B, #10B981, #3B82F6)",
                      "linear-gradient(315deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B, #10B981, #3B82F6)",
                      "linear-gradient(360deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B, #10B981, #3B82F6)",
                    ],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full p-1"
                >
                  <div className="w-full h-full rounded-full bg-gray-900 dark:bg-gray-100"></div>
                </motion.div>

                {/* Formes géométriques décoratives */}
                <motion.div
                  animate={{ rotate: 45 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute top-2 left-2 w-4 h-4 bg-yellow-400 rounded-full opacity-60"
                />
                <motion.div
                  animate={{ rotate: -45 }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute top-2 right-2 w-3 h-3 bg-pink-400 rounded-lg opacity-60"
                />
                <motion.div
                  animate={{ rotate: 90 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-2 left-2 w-5 h-5 bg-blue-400 rotate-45 opacity-60"
                />
                <motion.div
                  animate={{ rotate: -90 }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full opacity-60"
                />

                {/* Photo avec ombre créative */}
                <motion.div
                  whileHover={{ scale: 1.02, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-2 rounded-full overflow-hidden shadow-2xl"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-full"></div>
                  <img
                    src="/profile-photo.png"
                    alt="ZINSOU M. Jean O."
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </motion.div>

              {/* Badge de statut amélioré */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.2 }}
                className="absolute bottom-6 right-6"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  <div className="w-8 h-8 bg-green-500 rounded-full border-3 border-white dark:border-gray-900"></div>
                  <div className="absolute inset-0 w-8 h-8 bg-green-400 rounded-full animate-ping opacity-75"></div>
                </motion.div>
              </motion.div>

              {/* Étincelles flottantes */}
              {[
                {
                  color: "bg-yellow-400",
                  top: "25%",
                  left: "15%",
                  xRange: 5,
                  duration: 3,
                  delay: 0,
                },
                {
                  color: "bg-pink-400",
                  top: "35%",
                  left: "25%",
                  xRange: -3,
                  duration: 4,
                  delay: 0.5,
                },
                {
                  color: "bg-blue-400",
                  top: "45%",
                  left: "65%",
                  xRange: 8,
                  duration: 3.5,
                  delay: 1,
                },
                {
                  color: "bg-green-400",
                  top: "65%",
                  left: "75%",
                  xRange: -6,
                  duration: 4.5,
                  delay: 1.5,
                },
                {
                  color: "bg-purple-400",
                  top: "75%",
                  left: "35%",
                  xRange: 4,
                  duration: 5,
                  delay: 0.8,
                },
                {
                  color: "bg-orange-400",
                  top: "55%",
                  left: "85%",
                  xRange: -7,
                  duration: 3.2,
                  delay: 0.3,
                },
              ].map((sparkle, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -20, 0],
                    x: [0, sparkle.xRange, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: sparkle.duration,
                    repeat: Infinity,
                    delay: sparkle.delay,
                    ease: "easeInOut",
                  }}
                  className={`absolute w-2 h-2 rounded-full ${sparkle.color}`}
                  style={{
                    top: sparkle.top,
                    left: sparkle.left,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Home;
