import React from "react";
const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-blanc text-gris-canon-de-fusil">
      <div className="mb-8 border-b border-gris-canon-de-fusil/10 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Conditions Générales de Vente (CGV)
        </h1>
      </div>

      <div className="prose prose-sm max-w-none text-gris-canon-de-fusil/80 space-y-6 leading-relaxed">
        <p className="text-xs text-gris-canon-de-fusil/50">
          Dernière mise à jour : Juillet 2026
        </p>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-orange-rougi">
            1. Objet
          </h2>
          <p className="text-justify">
            Les présentes Conditions Générales de Vente régissent de manière
            exclusive les relations contractuelles entre la plateforme
            e-commerce Nolcop Store et toute personne effectuant un achat sur le
            site.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-orange-rougi">
            2. Prix et Produits
          </h2>
          <p className="text-justify">
            Tous les prix affichés sur notre store sont indiqués en FCFA et
            incluent la Taxe sur la Valeur Ajoutée (TVA) légale applicable au
            jour de la commande. Nolcop Store se réserve le droit de modifier
            ses prix à tout moment mais les produits seront facturés sur la base
            des tarifs en vigueur au moment de la validation finale du panier.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-bold text-orange-rougi">
            3. Clause de Réserve de Propriété
          </h2>
          <p className="text-justify">
            Les produits demeurent la propriété exclusive de Nolcop Store
            jusqu'au paiement complet et effectif du prix par l'acheteur.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;
