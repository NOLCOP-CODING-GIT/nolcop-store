import React from "react";
import { CreditCard, ShieldCheck, Lock, Smartphone } from "lucide-react";

const Payment: React.FC = () => {
  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-blanc text-gris-canon-de-fusil text-center space-y-8">
      <div className="max-w-xl mx-auto space-y-3">
        <Lock className="h-12 w-12 text-bleu-saphir mx-auto" />
        <h1 className="text-3xl font-bold tracking-tight">
          Paiement 100% Sécurisé
        </h1>
        <p className="text-sm text-gris-canon-de-fusil/60">
          Achetez l'esprit serein grâce à nos protocoles d'encaissement cryptés
          de dernière génération.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
        {/* Cartes Bancaires */}
        <div className="p-6 border border-gris-canon-de-fusil/10 rounded-2xl bg-blanc space-y-3">
          <CreditCard className="h-6 w-6 text-orange-rougi" />
          <h3 className="font-semibold text-base">Cartes Bancaires</h3>
          <p className="text-xs text-gris-canon-de-fusil/70">
            Nous acceptons la majorité des cartes bancaires nationales et
            internationales : Visa, MasterCard et American Express via nos
            passerelles sécurisées.
          </p>
        </div>

        {/* Mobile Money Bénin */}
        <div className="p-6 border border-gris-canon-de-fusil/10 rounded-2xl bg-blanc space-y-3">
          <Smartphone className="h-6 w-6 text-bleu-saphir" />
          <h3 className="font-semibold text-base">Mobile Money (Bénin)</h3>
          <p className="text-xs text-gris-canon-de-fusil/70">
            Payez instantanément et en toute sécurité via vos réseaux locaux
            préférés :
            <strong className="text-gris-canon-de-fusil">
              {" "}
              MTN Mobile Money (Momo)
            </strong>
            {", "}
            <strong className="text-gris-canon-de-fusil"> Moov Money</strong> et
            <strong className="text-gris-canon-de-fusil"> Celtiis Cash</strong>.
          </p>
        </div>

        {/* Sécurité SSL */}
        <div className="p-6 border border-gris-canon-de-fusil/10 rounded-2xl bg-blanc space-y-3">
          <ShieldCheck className="h-6 w-6 text-green-600" />
          <h3 className="font-semibold text-base">Protocole SSL & Securité</h3>
          <p className="text-xs text-gris-canon-de-fusil/70">
            Toutes les transactions financières (par carte ou Mobile Money)
            transitent par un tunnel de chiffrement SSL. Vos informations
            sensibles sont totalement protégées.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;
