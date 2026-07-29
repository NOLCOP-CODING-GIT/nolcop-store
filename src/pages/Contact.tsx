import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabaseClient";

const Contact: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        setFormData((prev) => ({
          ...prev,
          email: user.email || "",
        }));

        try {
          const { data } = await supabase
            .from("users")
            .select("name")
            .eq("id", user.id)
            .single();

          if (data?.name) {
            setFormData((prev) => ({
              ...prev,
              name: data.name,
            }));
          }
        } catch (err) {
          console.error("Erreur récupération nom contact :", err);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom complet est obligatoire.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'adresse email est obligatoire.";
    }
    if (!formData.subject.trim()) {
      newErrors.subject = "Le sujet du message est obligatoire.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Votre message ne peut pas être vide.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("contacts").insert([
        {
          user_id: user?.id || null,
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
      ]);

      if (error) throw error;
      setSuccessMessage("Votre message a été envoyé avec succès !");
      setFormData({ ...formData, subject: "", message: "" });
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err);
      setErrors({ form: "Une erreur est survenue lors de l'envoi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-blanc text-gris-canon-de-fusil">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          Contactez{" "}
          <span className="bg-linear-to-r from-bleu-clair to-bleu-saphir bg-clip-text text-transparent">
            Nolcop Store
          </span>
        </h1>
        <p className="text-gris-canon-de-fusil/70">
          Une question, une suggestion ou besoin d'assistance ? Notre équipe
          vous répond sous 24h ouvrées.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-violet-myrtille-tenebreux text-blanc p-8 rounded-2xl shadow-lg space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-bleu-saphir/10 rounded-full blur-2xl -mr-10 -mt-10" />

            <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-bleu-clair" />
              Nos coordonnées
            </h2>

            <div className="flex items-start space-x-4">
              <Mail className="h-5 w-5 text-bleu-clair shrink-0 mt-1" />
              <div>
                <p className="text-xs text-blanc/60 uppercase tracking-wider font-semibold">
                  Email
                </p>
                <p className="text-sm font-medium">nolcopcoding@gmail.com</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="h-5 w-5 text-bleu-clair shrink-0 mt-1" />
              <div>
                <p className="text-xs text-blanc/60 uppercase tracking-wider font-semibold">
                  Téléphone
                </p>
                <p className="text-sm font-medium">+229 01 40 58 58 35</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin className="h-5 w-5 text-bleu-clair shrink-0 mt-1" />
              <div>
                <p className="text-xs text-blanc/60 uppercase tracking-wider font-semibold">
                  Adresse
                </p>
                <p className="text-sm font-medium text-blanc/90">
                  Cotonou, Bénin - Sègbèya
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl shadow-sm p-4 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gris-canon-de-fusil/80 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  disabled
                  readOnly
                  value={formData.name}
                  className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/20 rounded-xl bg-gris-canon-de-fusil/5 text-sm text-gris-canon-de-fusil/70 cursor-not-allowed focus:outline-none"
                  placeholder="Jean Dupont"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gris-canon-de-fusil/80 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  disabled
                  readOnly
                  value={formData.email}
                  className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/20 rounded-xl bg-gris-canon-de-fusil/5 text-sm text-gris-canon-de-fusil/70 cursor-not-allowed focus:outline-none"
                  placeholder="jean.dupont@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gris-canon-de-fusil/80 mb-2">
                Sujet du message *
              </label>
              <input
                type="text"
                minLength={5}
                value={formData.subject}
                onChange={(e) => {
                  setFormData({ ...formData, subject: e.target.value });
                  if (errors.subject) setErrors({ ...errors, subject: "" });
                }}
                className={`w-full px-4 py-2.5 bg-blanc border rounded-xl text-sm text-gris-canon-de-fusil focus:outline-none transition-colors ${
                  errors.subject
                    ? "border-rouge-ecarlate focus:border-rouge-ecarlate"
                    : "border-gris-canon-de-fusil/20 focus:border-bleu-saphir"
                }`}
                placeholder="Ex : Suivi de commande, Question produit..."
              />
              {errors.subject && (
                <p className="text-rouge-ecarlate text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" /> {errors.subject}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gris-canon-de-fusil/80 mb-2">
                Votre message *
              </label>
              <textarea
                rows={5}
                minLength={5}
                maxLength={500}
                value={formData.message}
                onChange={(e) => {
                  setFormData({ ...formData, message: e.target.value });
                  if (errors.message) setErrors({ ...errors, message: "" });
                }}
                className={`w-full px-4 py-2.5 bg-blanc border rounded-xl text-sm text-gris-canon-de-fusil resize-none focus:outline-none transition-colors ${
                  errors.message
                    ? "border-rouge-ecarlate focus:border-rouge-ecarlate"
                    : "border-gris-canon-de-fusil/20 focus:border-bleu-saphir"
                }`}
                placeholder="Écrivez votre message ici..."
              />
              {errors.message && (
                <p className="text-rouge-ecarlate text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" /> {errors.message}
                </p>
              )}
            </div>

            {successMessage && (
              <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-xl font-bold text-center">
                {successMessage}
              </div>
            )}
            {errors.form && (
              <div className="p-4 mb-4 text-sm text-rouge-ecarlate bg-red-50 rounded-xl font-bold text-center">
                {errors.form}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-6 py-3 lg:w-[30%] w-full bg-bleu-saphir text-blanc font-semibold text-sm rounded-xl hover:opacity-90 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
              {!isSubmitting && <Send className="h-4 w-4 ml-2" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
