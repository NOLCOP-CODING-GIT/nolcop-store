import React from "react";

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-blanc text-gris-canon-de-fusil">
      <div className="flex items-center space-x-3 mb-8 border-b border-gris-canon-de-fusil/10 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Politique de Confidentialité
        </h1>
      </div>

      <div className="prose prose-sm max-w-none text-gris-canon-de-fusil/80 space-y-6 leading-relaxed">
        <p className="text-xs text-gris-canon-de-fusil/50">
          Respect de la vie privée - Conformité RGPD 2026
        </p>

        <p className="text-justify">
          Chez Nolcop Store, nous accordons une importance primordiale à la
          protection de vos données personnelles. Cette page détaille les
          informations que nous collectons et l'usage strict qui en est fait.
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-orange-rougi">
            1. Collecte des Données
          </h2>
          <p className="text-justify">
            Lors de votre inscription ou d'un processus d'achat, nous collectons
            les données indispensables au bon acheminement de votre commande :
            Nom, prénom, adresse e-mail, adresse postale de livraison et numéro
            de téléphone.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-orange-rougi">
            2. Vos Droits
          </h2>
          <p className="text-justify">
            Conformément à la réglementation européenne sur la protection des
            données (RGPD), vous disposez d'un droit permanent d'accès, de
            rectification, de portabilité et de suppression intégrale de vos
            données nominatives sur simple demande écrite à notre équipe
            technique.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
