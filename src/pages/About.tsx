import { useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { motion } from "framer-motion";

const About = () => {
  const [activeTab, setActiveTab] = useState("experience");
  const { theme } = useTheme();

  const experiences = [
    {
      title: "Développeur Full Stack Senior",
      company: "Tech Company",
      period: "2022 - Présent",
      location: "Cotonou, Bénin",
      description:
        "Développement d'applications web modernes avec React, Node.js et TypeScript. Leadership technique et mentorat d'équipe.",
      technologies: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"],
    },
    {
      title: "Développeur Frontend",
      company: "Digital Agency",
      period: "2020 - 2022",
      location: "Porto-Novo, Bénin",
      description:
        "Création d'interfaces utilisateur responsives et interactives. Collaboration avec les designers pour implémenter des maquettes.",
      technologies: ["Vue.js", "JavaScript", "Sass", "Git", "Agile"],
    },
    {
      title: "Développeur Junior",
      company: "Startup Tech",
      period: "2019 - 2020",
      location: "Abomey-Calavi, Bénin",
      description:
        "Participation au développement de la plateforme principale. Apprentissage des bonnes pratiques et des méthodes agiles.",
      technologies: ["HTML", "CSS", "JavaScript", "React", "Firebase"],
    },
  ];

  const education = [
    {
      degree: "Licence Professionnelle en Informatique",
      school: "UATM GASA FORMATION",
      schoolUrl: "https://uatm-gasa.com/",
      period: "2024 - 2027",
      location: "Cotonou, Bénin",
      description:
        "Formation professionnelle en informatique avec spécialisation en développement web et gestion de bases de données. Stage en entreprise sur la création d'applications web.",
    },
  ];

  const skills = [
    {
      category: "Frontend",
      items: ["React", "Vue.js", "TypeScript", "TailwindCSS", "Next.js"],
      level: 95,
    },
    {
      category: "Backend",
      items: ["Node.js", "Express", "Python", "PostgreSQL", "MongoDB"],
      level: 85,
    },
    {
      category: "Tools",
      items: ["Git", "Docker", "AWS", "CI/CD", "Agile"],
      level: 80,
    },
    {
      category: "Design",
      items: ["Figma", "Photoshop", "UI/UX", "Responsive Design"],
      level: 75,
    },
  ];

  return (
    <section
      id="about"
      className={`min-h-screen py-20 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className={`text-4xl md:text-5xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            } mb-4`}
          >
            À Propos de Moi
          </h2>
          <p
            className={`text-xl max-w-3xl mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Développeur passionné avec plus de 5 ans d'expérience dans la
            création d'applications web modernes et performantes. Toujours en
            quête d'apprentissage et de nouveaux défis techniques.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className={`inline-flex rounded-lg p-1 ${
              theme === "dark"
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            } shadow-lg`}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("experience")}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "experience"
                  ? theme === "dark"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-blue-500 text-white shadow-md"
                  : theme === "dark"
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Expérience</span>
            </motion.button>
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab("education")}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "education"
                  ? theme === "dark"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-blue-500 text-white shadow-md"
                  : theme === "dark"
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Formation</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {activeTab === "experience" && (
            <div className="space-y-8">
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow ${
                    theme === "dark"
                      ? "border border-gray-700"
                      : "border border-gray-200"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4">
                    <div className="mb-4 lg:mb-0">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {exp.title}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium">
                        {exp.company}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 lg:flex-col lg:items-end">
                      <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-2 sm:mb-0 lg:mb-2 p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Calendar className="w-4 h-4 mr-2 transition-colors text-gray-600" />
                        <span className="transition-colors text-gray-600">
                          {exp.period}
                        </span>
                      </div>
                      <div
                        className={`flex items-center text-gray-600 dark:text-gray-300 text-sm p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700`}
                      >
                        <MapPin
                          className={`w-4 h-4 mr-2 transition-colors ${
                            theme === "dark" ? "text-gray-400" : "text-gray-600"
                          }`}
                        />
                        <span
                          className={`transition-colors ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {exp.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "education" && (
            <div className="space-y-8">
              {education.map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-shadow ${
                    theme === "dark"
                      ? "border border-gray-700"
                      : "border border-gray-200"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className={`text-xl font-bold "text-gray-900" mb-4`}>
                        {edu.degree}
                      </h3>
                      <p
                        className={`text-blue-600 dark:text-blue-400 font-medium`}
                      >
                        <a
                          href={edu.schoolUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline transition-colors"
                        >
                          {edu.school}
                        </a>
                      </p>
                    </div>
                    <div className="flex flex-col md:items-end mt-2 md:mt-0">
                      <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-2 p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Calendar className="w-4 h-4 mr-2 transition-colors text-gray-600" />
                        <span className="transition-colors text-gray-600">
                          {edu.period}
                        </span>
                      </div>
                      <div
                        className={`flex items-center text-gray-600 dark:text-gray-300 text-sm p-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700`}
                      >
                        <MapPin className="w-4 h-4 mr-2 transition-colors text-gray-600" />
                        <span className="transition-colors text-gray-600">
                          {edu.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {edu.description}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-8">
              {skills.map((skillGroup, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className={`bg-gray-50 dark:bg-gray-800 rounded-xl p-6 ${
                    theme === "dark"
                      ? "border border-gray-700"
                      : "border border-gray-200"
                  }`}
                >
                  <h3
                    className={`text-xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    } mb-4`}
                  >
                    {skillGroup.category}
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 dark:text-gray-300">
                        Niveau global
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {skillGroup.level}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-linear-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${skillGroup.level}%` }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {skillGroup.items.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default About;
