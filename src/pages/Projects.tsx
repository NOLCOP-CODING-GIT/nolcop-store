import { useState } from "react";
import {
  Github,
  Code,
  Smartphone,
  Globe,
  Star,
  Calendar,
  ExternalLink as LinkIcon,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { motion } from "framer-motion";

const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const { theme } = useTheme();

  const filters = [
    { id: "all", label: "Tous", icon: Globe },
    { id: "web", label: "Web", icon: Code },
    { id: "mobile", label: "Mobile", icon: Smartphone },
  ];

  const projects = [
    {
      id: 1,
      title: "Portfolio Personnel",
      description:
        "Site portfolio moderne avec animations fluides, mode sombre/clair et optimisation SEO complet. Interface responsive et accessible.",
      image: "/project1.jpg",
      technologies: ["React", "TypeScript", "TailwindCSS", "Framer Motion"],
      category: "web",
      github: "https://github.com",
      demo: "https://portfolio-demo.com",
      featured: true,
      stats: { stars: 45, forks: 12, issues: 3 },
    },
    {
      id: 2,
      title: "Application E-Commerce",
      description:
        "Boutique en ligne avec panier, paiement sécurisé, gestion des stocks et dashboard admin pour les vendeurs.",
      image: "/project2.jpg",
      technologies: ["Next.js", "Node.js", "MongoDB", "Stripe"],
      category: "web",
      github: "https://github.com",
      demo: "https://ecommerce-demo.com",
      featured: true,
      stats: { stars: 32, forks: 8, issues: 2 },
    },
    {
      id: 3,
      title: "App Mobile de Todo",
      description:
        "Application mobile de gestion de tâches avec synchronisation cloud, notifications push et mode hors-ligne.",
      image: "/project3.jpg",
      technologies: ["React Native", "Firebase", "Redux", "Expo"],
      category: "mobile",
      github: "https://github.com",
      demo: "https://todo-demo.com",
      featured: false,
      stats: { stars: 28, forks: 6, issues: 1 },
    },
    {
      id: 4,
      title: "Dashboard Analytics",
      description:
        "Tableau de bord analytique avec graphiques en temps réel, export PDF et visualisation de données complexes.",
      image: "/project4.jpg",
      technologies: ["Vue.js", "Chart.js", "Node.js", "PostgreSQL"],
      category: "web",
      github: "https://github.com",
      demo: "https://dashboard-demo.com",
      featured: false,
      stats: { stars: 67, forks: 15, issues: 0 },
    },
    {
      id: 5,
      title: "App Météo Bénin",
      description:
        "Application météo spécialisée pour le Bénin avec prévisions locales, alertes et interface en français.",
      image: "/project5.jpg",
      technologies: ["React", "TypeScript", "OpenWeather API", "TailwindCSS"],
      category: "web",
      github: "https://github.com",
      demo: "https://meteo-benin-demo.com",
      featured: false,
      stats: { stars: 89, forks: 23, issues: 5 },
    },
    {
      id: 6,
      title: "Plateforme de Réservation",
      description:
        "Système de réservation en ligne avec calendrier, paiement et gestion des disponibilités en temps réel.",
      image: "/project6.jpg",
      technologies: ["React", "Node.js", "Express", "MongoDB"],
      category: "web",
      github: "https://github.com",
      demo: "https://reservation-demo.com",
      featured: true,
      stats: { stars: 156, forks: 34, issues: 8 },
    },
  ];

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <motion.section
      id="projects"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`min-h-screen py-20 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Mes Projets
          </h2>
          <p
            className={`text-xl max-w-3xl mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Découvrez mes réalisations récentes. Chaque projet est une
            opportunité d'apprendre et d'innover avec les technologies modernes.
          </p>
        </motion.div>

        {/* Featured Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex items-center justify-center mb-8"
          >
            <Star className="w-6 h-6 text-yellow-500 mr-2" />
            <h3
              className={`text-2xl font-bold mr-2 ml-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Projets Vedettes
            </h3>
            <Star className="w-6 h-6 text-yellow-500 ml-2" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="grid sm:grid-cols-1 md:grid-cols-2 gap-8"
          >
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3, ease: "easeInOut" },
                }}
                className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg ${
                  theme === "dark"
                    ? "border border-gray-700"
                    : "border border-gray-200"
                }`}
              >
                <div className="relative h-48 bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-white text-2xl font-bold relative z-10">
                    {project.title}
                  </span>
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span className="text-white text-xs font-medium">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {project.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{project.stats.stars}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Github className="w-4 h-4" />
                      <span>{project.stats.forks}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Updated</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                          theme === "dark"
                            ? "bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white"
                            : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-900 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>Code</span>
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <LinkIcon className="w-4 h-4" />
                      <span>Demo</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex justify-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`inline-flex rounded-lg p-1 ${
              theme === "dark"
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            } shadow-lg`}
          >
            {filters.map((filter, index) => {
              const Icon = filter.icon;
              return (
                <motion.button
                  key={filter.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 1.4 + index * 0.1,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                    activeFilter === filter.id
                      ? theme === "dark"
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-blue-500 text-white shadow-md"
                      : theme === "dark"
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: "easeOut",
              }}
              whileHover={{
                y: -5,
                transition: { duration: 0.3, ease: "easeInOut" },
              }}
              className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg ${
                theme === "dark"
                  ? "border border-gray-700"
                  : "border border-gray-200"
              }`}
            >
              <div className="relative h-48 bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span
                  className={`text-lg font-medium relative z-10 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {project.title}
                </span>
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                  <div
                    className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1`}
                  >
                    <span
                      className={`text-xs font-medium ${
                        theme === "dark" ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {project.category === "web" ? "Web" : "Mobile"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h4
                  className={`text-xl font-bold mb-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {project.title}
                </h4>
                <p
                  className={`mb-4 text-sm line-clamp-2 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {project.description}
                </p>

                {/* Mini Stats */}
                <div
                  className={`flex items-center space-x-3 mb-4 text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3" />
                    <span>{project.stats.stars}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Github className="w-3 h-3" />
                    <span>{project.stats.forks}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        theme === "dark"
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        theme === "dark"
                          ? "bg-gray-700 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      +{project.technologies.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <Github className="w-4 h-4" />
                    <span className="text-sm">Code</span>
                  </a>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span className="text-sm">Demo</span>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
              <Globe className="w-8 h-8 text-gray-400" />
            </div>
            <p
              className={`text-lg mb-2 ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Aucun projet trouvé dans cette catégorie.
            </p>
            <p
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Essayez de sélectionner une autre catégorie ou revenir à "Tous".
            </p>
          </div>
        )}
      </motion.div>
    </motion.section>
  );
};

export default Projects;
