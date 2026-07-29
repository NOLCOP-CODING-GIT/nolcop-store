import React from "react";
import { Headphones, MessageSquare, Mail, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const CustomerService: React.FC = () => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-blanc text-gris-canon-de-fusil space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <Headphones className="h-12 w-12 text-bleu-saphir mx-auto" />
        <h1 className="text-3xl font-bold tracking-tight">
          Centre d'Assistance Client
        </h1>
        <p className="text-sm text-gris-canon-de-fusil/60 text-justify">
          Une question ou une réclamation ? Nous sommes à vos côtés à chaque
          étape de votre commande.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="p-6 border border-gris-canon-de-fusil/10 rounded-2xl bg-blanc space-y-2">
          <Calendar className="h-6 w-6 text-orange-rougi mx-auto" />
          <h3 className="font-semibold text-sm">Disponibilité</h3>
          <p className="text-xs text-gris-canon-de-fusil/60">
            24 h / 24 et 7 jours / 7
          </p>
        </div>
        <div className="p-6 border border-gris-canon-de-fusil/10 rounded-2xl bg-blanc space-y-2">
          <Mail className="h-6 w-6 text-bleu-saphir mx-auto" />
          <h3 className="font-semibold text-sm">Par E-mail</h3>
          <p className="text-xs text-gris-canon-de-fusil/60">
            nolcopcoding@gmail.com
          </p>
        </div>
        <div className="p-6 border border-gris-canon-de-fusil/10 rounded-2xl bg-blanc space-y-2">
          <MessageSquare className="h-6 w-6 text-vert-jungle mx-auto" />
          <h3 className="font-semibold text-sm">Temps de réponse</h3>
          <p className="text-xs text-gris-canon-de-fusil/60">
            Moins de 24 heures ouvrées constatées.
          </p>
        </div>
      </div>

      <div className="bg-gris-canon-de-fusil/5 p-4 rounded-2xl space-y-4 max-w-xl mx-auto border border-gris-canon-de-fusil/5">
        <h4 className="font-bold text-lg text-center">
          Besoin d'ouvrir un ticket d'assistance immédiat ?
        </h4>
        <p className="text-xs text-gris-canon-de-fusil/70 text-justify">
          Pour nous permettre de traiter au mieux votre demande, merci de vous
          munir de votre numéro de commande.
        </p>
        <Link
          to="/contact"
          className="inline-flex px-5 py-2.5 text-xs font-semibold text-blanc bg-bleu-saphir rounded-xl hover:opacity-90 transition-all shadow-xs"
        >
          Ouvrir le formulaire de contact
        </Link>
      </div>
    </div>
  );
};

export default CustomerService;
