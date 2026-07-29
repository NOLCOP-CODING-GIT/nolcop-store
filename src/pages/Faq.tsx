import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const Faq: React.FC = () => {
  const faqs = [
    {
      q: "Quels sont vos délais de livraison ?",
      a: "Nos délais standards sont de 1 à 3 jours ouvrés pour Cotonou et de 5 à 7 jours pour le reste du Benin.",
    },
    {
      q: "Comment puis-je suivre mon colis ?",
      a: "Dès l'expédition de votre commande, un message SMS contenant un lien de suivi personnalisé de votre transporteur vous sera automatiquement envoyé.",
    },
    {
      q: "Puis-je modifier ou annuler ma commande ?",
      a: "Tant que votre commande n'est pas traitée par notre entrepôt (généralement dans les 30 minutes suivant la commande), vous pouvez demander son annulation auprès du service client.",
    },
    {
      q: "Quelle est votre politique de retour ?",
      a: "Vous disposez d'un délai légal et étendu de 7 jours après réception de votre colis pour nous renvoyer un article s'il ne vous convient pas. Les articles doivent être neufs et dans leur emballage d'origine.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-blanc text-gris-canon-de-fusil">
      <div className="text-center mb-12">
        <HelpCircle className="h-12 w-12 text-bleu-saphir mx-auto mb-3" />
        <h1 className="text-3xl font-bold tracking-tight">
          Questions Fréquentes
        </h1>
        <p className="text-gris-canon-de-fusil/60 mt-2">
          Trouvez des réponses immédiates à vos questions les plus courantes.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gris-canon-de-fusil/10 rounded-xl overflow-hidden bg-blanc shadow-xs"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center p-5 text-left font-medium text-base hover:bg-gris-canon-de-fusil/5 transition-colors"
            >
              <span>{faq.q}</span>
              {openIndex === index ? (
                <ChevronUp className="h-5 w-5 text-bleu-saphir" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gris-canon-de-fusil/40" />
              )}
            </button>
            {openIndex === index && (
              <div className="p-5 bg-gris-canon-de-fusil/5 border-t border-gris-canon-de-fusil/10 text-sm text-gris-canon-de-fusil/80 leading-relaxed">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
