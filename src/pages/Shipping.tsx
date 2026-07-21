import React from "react";
import { Truck, RefreshCw, Box } from "lucide-react";

const Shipping: React.FC = () => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-blanc text-gris-canon-de-fusil space-y-12">
      <div className="text-left">
        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Livraisons & Retours
        </h1>
        <p className="text-gris-canon-de-fusil/60 text-sm">
          Tout savoir sur le traitement, l'expédition et la politique d'échange
          de vos colis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Livraison */}
        <div className="bg-blanc p-4 rounded-2xl border border-gris-canon-de-fusil/5 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 text-bleu-saphir">
            <Truck className="h-6 w-6" />
            <h2 className="text-xl font-bold">Modes de Livraison</h2>
          </div>
          <p className="text-sm text-gris-canon-de-fusil/80 leading-relaxed">
            Nolcop Store collabore avec des transporteurs de confiance pour
            garantir la sécurité de vos achats.
          </p>
          <ul className="space-y-2 text-sm text-gris-canon-de-fusil/70 list-disc list-inside">
            <li>
              <strong className="text-gris-canon-de-fusil">
                Colissimo Suivi :
              </strong>{" "}
              2-3 jours ouvrés (1000 Fcfa ou offert dès 100000 Fcfa d'achat).
            </li>
            <li>
              <strong className="text-gris-canon-de-fusil">
                Chronopost Express :
              </strong>{" "}
              Livraison le lendemain avant 13h (1500 Fcfa).
            </li>
          </ul>
        </div>

        {/* Retours */}
        <div className="bg-blanc p-4 rounded-2xl border border-gris-canon-de-fusil/5 shadow-xs space-y-4">
          <div className="flex items-center space-x-3 text-orange-rougi">
            <RefreshCw className="h-6 w-6" />
            <h2 className="text-xl font-bold">Retours & Remboursements</h2>
          </div>
          <p className="text-sm text-gris-canon-de-fusil/80 leading-relaxed">
            Vous avez changé d'avis ? Aucun problème ! Vous disposez de 14 jours
            francs à compter de la réception de votre colis pour initier un
            retour complet.
          </p>
          <p className="text-xs text-gris-canon-de-fusil/60">
            Note : Les frais de retour restent à la charge du client sauf si le
            produit présente un défaut de fabrication avéré à l'ouverture.
          </p>
        </div>
      </div>

      {/* Étapes du colis */}
      <div className="bg-violet-myrtille-tenebreux text-blanc p-8 rounded-2xl space-y-4 text-center">
        <Box className="h-8 w-8 text-bleu-clair mx-auto" />
        <h3 className="text-lg font-bold">Comment effectuer un retour ?</h3>
        <p className="text-sm text-blanc/70 max-w-lg mx-auto text-justify">
          Contactez notre support via votre espace profil, téléchargez votre bon
          de retour, emballez proprement l'article non porté et déposez-le dans
          votre bureau de poste local.
        </p>
      </div>
    </div>
  );
};

export default Shipping;
