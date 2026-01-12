import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  User,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [messageLength, setMessageLength] = useState(0);
  const { theme } = useTheme();

  const inputBaseClasses =
    "w-full px-4 py-3 pr-12 rounded-xl focus:ring-2 focus:border-transparent transition-all duration-300 ease-in-out";
  const inputLightClasses =
    "bg-white text-gray-900 border border-gray-200 hover:border-blue-300 focus:ring-blue-400 shadow-sm hover:shadow-md";
  const inputDarkClasses =
    "bg-gray-800 text-white border border-gray-700 hover:border-blue-600 focus:ring-blue-500 shadow-sm hover:shadow-md";
  const inputErrorClasses =
    "border-red-500 focus:ring-red-400 dark:focus:ring-red-500";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Update message length
    if (name === "message") {
      setMessageLength(value.length);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse email valide";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Le sujet est requis";
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = "Le sujet doit contenir au moins 3 caractères";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Le message doit contenir au moins 10 caractères";
    } else if (formData.message.length > 1000) {
      newErrors.message = "Le message ne peut pas dépasser 1000 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Configuration EmailJS - à remplacer avec vos vraies clés
      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_name: "Jean Orland Zinsou", // Votre nom
        to_email: "jeanorlandzinsou@gmail.com", // Votre email
      };

      // Remplacez ces valeurs par vos vraies clés EmailJS
      const serviceId = "service_c61l6pt"; // ID de votre service EmailJS
      const templateId = "template_261l6pt"; // ID de votre template EmailJS
      const publicKey = "WWvP18P3ZpbR-RKmc"; // Votre clé publique EmailJS

      const response = await emailjs.send(
        serviceId,
        templateId,
        templateParams,
        publicKey
      );

      if (response.status === 200) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setMessageLength(0);
        setErrors({});
      } else {
        throw new Error("Erreur lors de l'envoi de l'email");
      }
    } catch (error) {
      console.error("Erreur EmailJS:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);

      // Réinitialiser le statut après 5 secondes
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 5000);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "jeanorlandzinsou@gmail.com",
      href: "mailto:jeanorlandzinsou@gmail.com",
    },
    {
      icon: Phone,
      label: "Téléphone",
      value: "+2290141381577",
      href: "tel:+2290141381577",
    },
    {
      icon: MapPin,
      label: "Localisation",
      value: "Cotonou, Bénin",
      href: "https://www.google.com/maps/place/Cotonou",
    },
  ];
  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className={`py-20 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
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
            className={`text-4xl md:text-5xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            } mb-4`}
          >
            Contactez-moi
          </h2>
          <p
            className={`text-xl max-w-3xl mx-auto ${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Je suis toujours intéressé par de nouveaux projets et
            collaborations. N'hésitez pas à me contacter pour discuter de vos
            idées !
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid lg:grid-cols-2 gap-12 items-start"
        >
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h3
                className={`text-2xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                } mb-6`}
              >
                Restons en contact
              </h3>
              <p
                className={`mb-8 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Que ce soit pour un projet, une collaboration ou simplement pour
                échanger sur la technologie, je serais ravi de vous entendre.
              </p>
            </div>

            {/* Contact Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="space-y-4"
            >
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.a
                    key={index}
                    href={info.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-center space-x-4 p-4 rounded-lg hover:shadow-lg transition-shadow group ${
                      theme === "dark"
                        ? "bg-gray-800 border border-gray-700"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                      <Icon
                        className={`w-6 h-6 transition-colors ${
                          theme === "dark" ? "text-blue-600" : "text-blue-600"
                        }`}
                      />
                    </div>
                    <div>
                      <div
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        {info.label}
                      </div>
                      <div
                        className={`font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}
                      >
                        {info.value}
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>

            {/* Social Links */}
            <div>
              <motion.h4
                className={`text-lg font-semibold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                } mb-4`}
              >
                Envoyez un message
              </motion.h4>
            </div>

            {/* Availability */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-center space-x-3 mb-3">
                <MessageSquare
                  className={`w-6 h-6 transition-colors ${
                    theme === "dark" ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                <h4
                  className={`font-semibold ${
                    theme === "dark" ? "text-blue-600" : "text-blue-600"
                  }`}
                >
                  Disponibilité
                </h4>
              </div>
              <p className={`text-gray-700 dark:text-gray-300`}>
                Actuellement disponible pour des projets freelance et des
                opportunités de collaboration à temps plein.
              </p>
              <div
                className={`mt-3 text-sm font-medium ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              >
                Temps de réponse habituel : 24-48h
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`rounded-xl shadow-lg p-8 ${
              theme === "dark"
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <h3
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              } mb-6`}
            >
              Envoyez un message
            </h3>

            {submitStatus === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 rounded-lg"
              >
                <p className="text-green-800 dark:text-green-200 font-medium">
                  ✅ Message envoyé avec succès ! Je vous répondrai dans les
                  plus brefs délais.
                </p>
              </motion.div>
            )}

            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg"
              >
                <p className="text-red-800 dark:text-red-200 font-medium">
                  ❌ Erreur lors de l'envoi du message. Veuillez réessayer plus
                  tard.
                </p>
              </motion.div>
            )}

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="relative group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Nom *"
                    className={`${inputBaseClasses} ${
                      theme === "dark" ? inputDarkClasses : inputLightClasses
                    } ${errors.name ? inputErrorClasses : ""} peer`}
                  />
                  <div
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                      theme === "dark"
                        ? "group-hover:bg-blue-900/30 group-focus-within:bg-blue-900/50"
                        : "group-hover:bg-blue-50 group-focus-within:bg-blue-100"
                    }`}
                  >
                    <User
                      className={`w-5 h-5 transition-colors ${
                        errors.name
                          ? "text-red-500"
                          : theme === "dark"
                            ? "text-blue-400 group-focus-within:text-blue-300"
                            : "text-blue-500 group-focus-within:text-blue-600"
                      }`}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-500 flex items-center animate-pulse">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Email *"
                    className={`${inputBaseClasses} ${
                      theme === "dark" ? inputDarkClasses : inputLightClasses
                    } ${errors.email ? inputErrorClasses : ""} peer`}
                  />
                  <div
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                      theme === "dark"
                        ? "group-hover:bg-blue-900/30 group-focus-within:bg-blue-900/50"
                        : "group-hover:bg-blue-50 group-focus-within:bg-blue-100"
                    }`}
                  >
                    <Mail
                      className={`w-5 h-5 transition-colors ${
                        errors.email
                          ? "text-red-500"
                          : theme === "dark"
                            ? "text-blue-400 group-focus-within:text-blue-300"
                            : "text-blue-500 group-focus-within:text-blue-600"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-500 flex items-center animate-pulse">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="Sujet *"
                  className={`${inputBaseClasses} ${
                    theme === "dark" ? inputDarkClasses : inputLightClasses
                  } ${errors.subject ? inputErrorClasses : ""} peer`}
                />
                <div
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-300 ${
                    theme === "dark"
                      ? "group-hover:bg-blue-900/30 group-focus-within:bg-blue-900/50"
                      : "group-hover:bg-blue-50 group-focus-within:bg-blue-100"
                  }`}
                >
                  <Mail
                    className={`w-5 h-5 transition-colors ${
                      errors.subject
                        ? "text-red-500"
                        : theme === "dark"
                          ? "text-blue-400 group-focus-within:text-blue-300"
                          : "text-blue-500 group-focus-within:text-blue-600"
                    }`}
                  />
                </div>
                {errors.subject && (
                  <p className="mt-2 text-sm text-red-500 flex items-center animate-pulse">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.subject}
                  </p>
                )}
              </div>

              <div className="relative group">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Message *"
                  className={`w-full px-4 py-3 pr-12 rounded-xl focus:ring-2 focus:border-transparent resize-none transition-all duration-300 ease-in-out ${
                    theme === "dark"
                      ? "bg-gray-800 text-white border border-gray-700 hover:border-blue-600 focus:ring-blue-500 shadow-sm hover:shadow-md"
                      : "bg-white text-gray-900 border border-gray-200 hover:border-blue-300 focus:ring-blue-400 shadow-sm hover:shadow-md"
                  } ${errors.message ? "border-red-500 focus:ring-red-400 dark:focus:ring-red-500" : ""} peer`}
                />
                <div
                  className={`absolute right-3 top-4 p-2 rounded-full transition-all duration-300 ${
                    theme === "dark"
                      ? "group-hover:bg-blue-900/30 group-focus-within:bg-blue-900/50"
                      : "group-hover:bg-blue-50 group-focus-within:bg-blue-100"
                  }`}
                >
                  <MessageSquare
                    className={`w-5 h-5 transition-colors ${
                      errors.message
                        ? "text-red-500"
                        : theme === "dark"
                          ? "text-blue-400 group-focus-within:text-blue-300"
                          : "text-blue-500 group-focus-within:text-blue-600"
                    }`}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  {errors.message && (
                    <p className="text-sm text-red-500 flex items-center animate-pulse">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.message}
                    </p>
                  )}
                  <span
                    className={`text-xs transition-colors ${
                      messageLength > 1000
                        ? "text-red-500 font-semibold"
                        : theme === "dark"
                          ? "text-gray-400"
                          : "text-gray-500"
                    }`}
                  >
                    {messageLength}/1000
                  </span>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                className={`w-full px-6 py-4 rounded-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-center space-x-3 ${
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white border border-blue-400 disabled:bg-gray-400 disabled:cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Envoyer le message</span>
                  </>
                )}
              </motion.button>
            </motion.form>

            <div className="mt-6 text-center text-sm font-medium">
              Les champs marqués d'un * sont obligatoires
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default Contact;
