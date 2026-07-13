import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Gérer l'envoi du formulaire
    console.log("Formulaire soumis :", formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-blanc text-gris-canon-de-fusil">
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
        {/* Informations de contact */}
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
                <p className="text-sm font-medium">+229 01 44 16 13 73</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <MapPin className="h-5 w-5 text-bleu-clair shrink-0 mt-1" />
              <div>
                <p className="text-xs text-blanc/60 uppercase tracking-wider font-semibold">
                  Adresse
                </p>
                <p className="text-sm font-medium text-blanc/90">
                  Cotonou, Bénin - Segbeya
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de Contact */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-blanc border border-gris-canon-de-fusil/5 rounded-2xl shadow-sm p-8 space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gris-canon-de-fusil/80 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/20 rounded-xl focus:outline-none focus:border-bleu-saphir focus:ring-1 focus:ring-bleu-saphir bg-blanc text-sm text-gris-canon-de-fusil"
                  placeholder="Jean Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gris-canon-de-fusil/80 mb-2">
                  Adresse email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/20 rounded-xl focus:outline-none focus:border-bleu-saphir focus:ring-1 focus:ring-bleu-saphir bg-blanc text-sm text-gris-canon-de-fusil"
                  placeholder="jean.dupont@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gris-canon-de-fusil/80 mb-2">
                Sujet du message
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/20 rounded-xl focus:outline-none focus:border-bleu-saphir focus:ring-1 focus:ring-bleu-saphir bg-blanc text-sm text-gris-canon-de-fusil"
                placeholder="Ex : Suivi de commande, Question produit..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gris-canon-de-fusil/80 mb-2">
                Votre message
              </label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full px-4 py-2.5 border border-gris-canon-de-fusil/20 rounded-xl focus:outline-none focus:border-bleu-saphir focus:ring-1 focus:ring-bleu-saphir bg-blanc text-sm text-gris-canon-de-fusil resize-none"
                placeholder="Écrivez votre message ici..."
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center px-6 py-3 lg:w-[30%] w-full bg-bleu-saphir text-blanc font-semibold text-sm rounded-xl hover:opacity-90 shadow-md transition-all cursor-pointer"
            >
              Envoyer le message
              <Send className="h-4 w-4 ml-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
