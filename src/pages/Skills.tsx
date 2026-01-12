import { useState } from "react";
import React from "react";
import {
  Code2,
  Database,
  Globe,
  Palette,
  Server,
  Smartphone,
  Cpu,
  Cloud,
  GitBranch,
  Zap,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { motion } from "framer-motion";

const Skills = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const { theme } = useTheme();

  const categories = [
    { id: "all", label: "Toutes", icon: Code2 },
    { id: "frontend", label: "Frontend", icon: Globe },
    { id: "backend", label: "Backend", icon: Server },
    { id: "tools", label: "Outils", icon: Zap },
  ];

  const skills = [
    {
      name: "React",
      level: 95,
      category: "frontend",
      icon: Globe,
      color: "from-blue-400 to-blue-600",
      description: "Hooks, Context API, Redux",
    },
    {
      name: "TypeScript",
      level: 90,
      category: "frontend",
      icon: Code2,
      color: "from-blue-600 to-blue-800",
      description: "Types avancés, Generics",
    },
    {
      name: "Node.js",
      level: 85,
      category: "backend",
      icon: Server,
      color: "from-green-400 to-green-600",
      description: "Express, REST API, GraphQL",
    },
    {
      name: "Python",
      level: 80,
      category: "backend",
      icon: Cpu,
      color: "from-yellow-400 to-yellow-600",
      description: "Django, FastAPI, Data Science",
    },
    {
      name: "TailwindCSS",
      level: 95,
      category: "frontend",
      icon: Palette,
      color: "from-cyan-400 to-cyan-600",
      description: "Responsive Design, Animations",
    },
    {
      name: "MongoDB",
      level: 75,
      category: "backend",
      icon: Database,
      color: "from-green-600 to-green-800",
      description: "Mongoose, Aggregations",
    },
    {
      name: "PostgreSQL",
      level: 80,
      category: "backend",
      icon: Database,
      color: "from-blue-600 to-blue-800",
      description: "SQL, Optimisation, Index",
    },
    {
      name: "Docker",
      level: 70,
      category: "tools",
      icon: Cloud,
      color: "from-blue-500 to-blue-700",
      description: "Containers, Docker Compose",
    },
    {
      name: "Git",
      level: 90,
      category: "tools",
      icon: GitBranch,
      color: "from-orange-400 to-orange-600",
      description: "Git Flow, GitHub Actions",
    },
    {
      name: "AWS",
      level: 65,
      category: "tools",
      icon: Cloud,
      color: "from-yellow-500 to-orange-600",
      description: "EC2, S3, Lambda, RDS",
    },
    {
      name: "React Native",
      level: 75,
      category: "frontend",
      icon: Smartphone,
      color: "from-purple-400 to-purple-600",
      description: "iOS, Android, Expo",
    },
    {
      name: "Next.js",
      level: 85,
      category: "frontend",
      icon: Globe,
      color: "from-gray-700 to-gray-900",
      description: "SSR, SSG, API Routes",
    },
  ];

  const filteredSkills =
    activeCategory === "all"
      ? skills
      : skills.filter((skill) => skill.category === activeCategory);

  return (
    <motion.section
      id="skills"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`py-20 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
          >
            Compétences Techniques
          </h2>
          <p
            className={`text-xl max-w-3xl mx-auto ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
          >
            Ensemble de compétences modernes et polyvalentes pour créer des
            applications web complètes et performantes.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex justify-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className={`rounded-lg p-1 flex flex-wrap justify-center gap-2 ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}
          >
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                    activeCategory === category.id
                      ? "bg-blue-600 text-white shadow-md"
                      : theme === "dark"
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.label}</span>
                  {activeCategory !== category.id && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 h-0.5 bg-blue-600"
                      initial={{ width: 0, x: "-50%" }}
                      whileHover={{ width: "100%", x: "-50%" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-gray-50 border-gray-200"} border`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-lg bg-linear-to-r ${skill.color} text-white`}
                >
                  {React.createElement(skill.icon, {
                    className: "w-6 h-6",
                  })}
                </div>
                <div className="text-right">
                  <div
                    className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                  >
                    {skill.level}%
                  </div>
                  <div
                    className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Niveau
                  </div>
                </div>
              </div>

              <h3
                className={`text-xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
              >
                {skill.name}
              </h3>

              <p
                className={`text-sm mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
              >
                {skill.description}
              </p>

              {/* Progress Bar */}
              <div
                className={`w-full rounded-full h-3 mb-2 ${theme === "dark" ? "bg-gray-700" : "bg-gray-200"}`}
              >
                <div
                  className={`bg-linear-to-r ${skill.color} h-3 rounded-full transition-all duration-1000 ease-out`}
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              {/* Skill Level Badge */}
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}
                >
                  {skill.level < 50
                    ? "Débutant"
                    : skill.level < 75
                      ? "Intermédiaire"
                      : skill.level < 90
                        ? "Avancé"
                        : "Expert"}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    skill.category === "frontend"
                      ? theme === "dark"
                        ? "bg-blue-900 text-blue-200"
                        : "bg-blue-100 text-blue-800"
                      : skill.category === "backend"
                        ? theme === "dark"
                          ? "bg-green-900 text-green-200"
                          : "bg-green-100 text-green-800"
                        : theme === "dark"
                          ? "bg-purple-900 text-purple-200"
                          : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {skill.category}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div
              className={`text-4xl font-bold mb-2 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`}
            >
              {skills.length}+
            </div>
            <div className={theme === "dark" ? "text-gray-300" : "text-black"}>
              Technologies maîtrisées
            </div>
          </div>
          <div className="text-center">
            <div
              className={`text-4xl font-bold mb-2 ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
            >
              5+
            </div>
            <div className={theme === "dark" ? "text-gray-300" : "text-black"}>
              Années d'expérience
            </div>
          </div>
          <div className="text-center">
            <div
              className={`text-4xl font-bold mb-2 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}
            >
              50+
            </div>
            <div className={theme === "dark" ? "text-gray-300" : "text-black"}>
              Projets complétés
            </div>
          </div>
          <div className="text-center">
            <div
              className={`text-4xl font-bold mb-2 ${theme === "dark" ? "text-orange-400" : "text-orange-600"}`}
            >
              100%
            </div>
            <div className={theme === "dark" ? "text-gray-300" : "text-black"}>
              Satisfaction client
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Skills;
