import React from "react";
import { ShieldCheck, Users, Target } from "lucide-react";

const About: React.FC = () => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-blanc text-gris-canon-de-fusil">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">
          À propos de{" "}
          <span className="bg-linear-to-r from-bleu-saphir via-orange-rougi to-bleu-saphir bg-clip-text text-transparent">
            Nolcop Store
          </span>
        </h1>
        <p className="text-gris-canon-de-fusil/70 text-lg text-justify">
          Découvrez notre histoire, nos valeurs et notre engagement à redéfinir
          l'expérience shopping en ligne.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Notre Mission</h2>
        <p className="text-gris-canon-de-fusil/80 leading-relaxed mb-4 text-justify">
          Fondé avec la volonté de proposer le meilleur des tendances actuelles,
          Nolcop Store s'efforce de combiner des produits d'exception avec un
          parcours utilisateur d'une fluidité absolue.
        </p>
        <p className="text-gris-canon-de-fusil/80 leading-relaxed text-justify">
          Nous sélectionnons rigoureusement chacun de nos articles pour vous
          garantir une qualité sans compromis, un style affirmé et une
          durabilité éprouvée.
        </p>
      </div>

      <hr className="border-gris-canon-de-fusil/10 my-12" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div className="p-6">
          <ShieldCheck className="h-10 w-10 text-bleu-saphir mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Qualité Premium</h3>
          <p className="text-sm text-gris-canon-de-fusil/70">
            Des matériaux certifiés et un contrôle qualité strict à chaque
            étape.
          </p>
        </div>
        <div className="p-6">
          <Users className="h-10 w-10 text-bleu-clair mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Communauté d'abord</h3>
          <p className="text-sm text-gris-canon-de-fusil/70">
            À l'écoute constante de vos retours pour faire évoluer nos
            collections.
          </p>
        </div>
        <div className="p-6">
          <Target className="h-10 w-10 text-orange-rougi mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Vision Moderne</h3>
          <p className="text-sm text-gris-canon-de-fusil/70">
            Un design d'interface propre pour un shopping zen et sécurisé.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
