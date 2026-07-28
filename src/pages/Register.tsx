import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  MapPin,
  AlertCircle,
  CheckCircle,
  Phone,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register } = useAuth();
  const navigate = useNavigate();

  // Utiliser le hook de redirection automatique
  useAuthRedirect();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // 1. Nom complet
    if (!name.trim()) {
      newErrors.name = "Le nom complet est obligatoire.";
    } else if (name.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères.";
    }

    // 2. Adresse au format : Pays, Ville, Quartier/rue
    const addressParts = address.split(",").map((item) => item.trim());
    if (!address.trim()) {
      newErrors.address = "L'adresse est obligatoire.";
    } else if (
      addressParts.length < 3 ||
      addressParts.some((p) => p.length === 0)
    ) {
      newErrors.address =
        "L'adresse doit suivre le format : Pays, Ville, Quartier/rue (séparés par des virgules).";
    }

    // 3. Téléphone au format indicatif + numéro (ex: +22901XXXXXXXX)
    const phoneRegex = /^\+\d{1,4}\d{6,14}$/;
    if (!phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est obligatoire.";
    } else if (!phoneRegex.test(phone.replace(/\s+/g, ""))) {
      newErrors.phone =
        "Le téléphone doit inclure l'indicatif du pays (ex: +22901020304).";
    }

    // 4. Adresse email conforme
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "L'adresse email est obligatoire.";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Veuillez entrer une adresse email valide.";
    }

    // 5. Mot de passe : min 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

    if (!password) {
      newErrors.password = "Le mot de passe est obligatoire.";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Min. 8 caractères avec au moins une majuscule, un chiffre et un caractère spécial.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword =
        "La confirmation du mot de passe est obligatoire.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }

    // 6. Conditions CGU
    if (!agreeTerms) {
      newErrors.terms = "Vous devez accepter les conditions d'utilisation.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setMessage("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = await register(email, password, name, address, phone);

    if (result.success) {
      setSuccess(true);
      navigate("/login");
    } else {
      const errorMsg = result.error || "";
      const lowerError = errorMsg.toLowerCase();

      if (
        lowerError.includes("already registered") ||
        lowerError.includes("déjà") ||
        lowerError.includes("already in use") ||
        lowerError.includes("unique constraint")
      ) {
        setErrors((prev) => ({
          ...prev,
          email: "Cette adresse email est déjà utilisée.",
        }));
      } else {
        setError(errorMsg || "Une erreur est survenue lors de l'inscription.");
      }
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="py-12 flex items-center justify-center bg-blanc px-4">
        <div className="max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-vert-jungle/10">
              <CheckCircle className="h-6 w-6 text-vert-jungle" />
            </div>

            <h2 className="mt-6 text-3xl font-extrabold text-gris-canon-de-fusil">
              Inscription réussie !
            </h2>

            {message ? (
              <>
                <p className="mt-2 text-sm text-gris-canon-de-fusil/70">
                  {message}
                </p>

                <div className="mt-6 p-4 bg-bleu-clair/20 rounded-lg">
                  <p className="text-sm text-bleu-saphir font-medium mb-3">
                    Étapes suivantes :
                  </p>
                  <ol className="text-left text-sm text-gris-canon-de-fusil/80 space-y-2">
                    <li>1. Vérifiez votre boîte de réception</li>
                    <li>
                      2. Cliquez sur le bouton "Confirmer mon email" dans
                      l'email
                    </li>
                    <li>3. Attendez la popup de confirmation</li>
                    <li>4. Connectez-vous à votre compte</li>
                  </ol>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => (window.location.href = `mailto:${email}`)}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blanc bg-bleu-saphir hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bleu-saphir transition-all"
                  >
                    Ouvrir ma boîte mail
                  </button>

                  <Link
                    to="/login"
                    className="w-full flex justify-center py-2 px-4 border border-gris-canon-de-fusil/20 rounded-md shadow-sm text-sm font-medium text-gris-canon-de-fusil bg-blanc hover:bg-gris-canon-de-fusil/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bleu-saphir transition-colors"
                  >
                    J'ai déjà confirmé mon email
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-gris-canon-de-fusil/70">
                  Votre compte a été créé avec succès. Vous allez être redirigé
                  vers la page de connexion.
                </p>
                <div className="mt-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bleu-saphir mx-auto"></div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-blanc py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-auto w-25 flex items-center justify-center rounded-full bg-bleu-clair/20">
            <img
              src="/logo.png"
              alt="Nolcop Store"
              className="object-contain rounded-full"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gris-canon-de-fusil">
            Créer votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gris-canon-de-fusil/70">
            Ou{" "}
            <Link
              to="/login"
              className="font-medium text-bleu-saphir hover:text-bleu-saphir/80 transition-colors"
            >
              connectez-vous à votre compte existant
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="rounded-md bg-rouge-ecarlate/10 p-4">
              <div className="flex">
                <div className="shrink-0">
                  <AlertCircle className="h-5 w-5 text-rouge-ecarlate" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-rouge-ecarlate">
                    Erreur d'inscription
                  </h3>
                  <div className="mt-2 text-sm text-rouge-ecarlate/90">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* Champ : Nom complet */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gris-canon-de-fusil"
              >
                Nom complet
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gris-canon-de-fusil/40" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name)
                      setErrors((prev) => ({ ...prev, name: "" }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-blanc border rounded-xl focus:outline-none text-xs font-semibold text-gris-canon-de-fusil transition-all ${
                    errors.name
                      ? "border-rouge-ecarlate focus:border-rouge-ecarlate focus:ring-2 focus:ring-rouge-ecarlate/10"
                      : "border-gris-canon-de-fusil/10 focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5"
                  }`}
                  placeholder="Jean Dupont"
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-xs font-bold text-rouge-ecarlate flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Champ : Adresse (Pays, Ville, Quartier/rue) */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gris-canon-de-fusil"
              >
                Adresse (Pays, Ville, Quartier/rue)
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gris-canon-de-fusil/40" />
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address)
                      setErrors((prev) => ({ ...prev, address: "" }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-blanc border rounded-xl focus:outline-none text-xs font-semibold text-gris-canon-de-fusil transition-all ${
                    errors.address
                      ? "border-rouge-ecarlate focus:border-rouge-ecarlate focus:ring-2 focus:ring-rouge-ecarlate/10"
                      : "border-gris-canon-de-fusil/10 focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5"
                  }`}
                  placeholder="Bénin, Cotonou, Cadjehoun"
                />
              </div>
              {errors.address && (
                <p className="mt-1.5 text-xs font-bold text-rouge-ecarlate flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.address}
                </p>
              )}
            </div>

            {/* Champ : Téléphone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gris-canon-de-fusil"
              >
                Téléphone (ex: +22901XXXXXXXX)
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gris-canon-de-fusil/40" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone)
                      setErrors((prev) => ({ ...prev, phone: "" }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-blanc border rounded-xl focus:outline-none text-xs font-semibold text-gris-canon-de-fusil transition-all ${
                    errors.phone
                      ? "border-rouge-ecarlate focus:border-rouge-ecarlate focus:ring-2 focus:ring-rouge-ecarlate/10"
                      : "border-gris-canon-de-fusil/10 focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5"
                  }`}
                  placeholder="+22901020304"
                />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-xs font-bold text-rouge-ecarlate flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Champ : Adresse email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gris-canon-de-fusil"
              >
                Adresse email
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gris-canon-de-fusil/40" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-blanc border rounded-xl focus:outline-none text-xs font-semibold text-gris-canon-de-fusil transition-all ${
                    errors.email
                      ? "border-rouge-ecarlate focus:border-rouge-ecarlate focus:ring-2 focus:ring-rouge-ecarlate/10"
                      : "border-gris-canon-de-fusil/10 focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5"
                  }`}
                  placeholder="vous@exemple.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs font-bold text-rouge-ecarlate flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Champ : Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gris-canon-de-fusil"
              >
                Mot de passe
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gris-canon-de-fusil/40" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-blanc border rounded-xl focus:outline-none text-xs font-semibold text-gris-canon-de-fusil transition-all ${
                    errors.password
                      ? "border-rouge-ecarlate focus:border-rouge-ecarlate focus:ring-2 focus:ring-rouge-ecarlate/10"
                      : "border-gris-canon-de-fusil/10 focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5"
                  }`}
                  placeholder="•••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gris-canon-de-fusil/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-gris-canon-de-fusil/40" />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className="mt-1.5 text-xs font-bold text-rouge-ecarlate flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.password}
                </p>
              ) : (
                <p className="mt-1 text-xs text-gris-canon-de-fusil/60">
                  Min. 8 caractères, 1 majuscule, 1 chiffre, 1 caractère spécial
                </p>
              )}
            </div>

            {/* Champ : Confirmer le mot de passe */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gris-canon-de-fusil"
              >
                Confirmer le mot de passe
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gris-canon-de-fusil/40" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword)
                      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                  className={`w-full pl-10 pr-4 py-2.5 bg-blanc border rounded-xl focus:outline-none text-xs font-semibold text-gris-canon-de-fusil transition-all ${
                    errors.confirmPassword
                      ? "border-rouge-ecarlate focus:border-rouge-ecarlate focus:ring-2 focus:ring-rouge-ecarlate/10"
                      : "border-gris-canon-de-fusil/10 focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5"
                  }`}
                  placeholder="•••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gris-canon-de-fusil/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-gris-canon-de-fusil/40" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs font-bold text-rouge-ecarlate flex items-center gap-1">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Cases à cocher : CGU & Confidentialité */}
          <div>
            <div className="flex items-center">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (errors.terms)
                    setErrors((prev) => ({ ...prev, terms: "" }));
                }}
                className="h-4 w-4 text-bleu-saphir focus:ring-bleu-saphir border-gris-canon-de-fusil/20 rounded cursor-pointer"
              />
              <label
                htmlFor="agree-terms"
                className="ml-2 block text-sm text-gris-canon-de-fusil/80 cursor-pointer"
              >
                J'accepte les{" "}
                <Link
                  to="/terms"
                  className="text-bleu-saphir hover:text-bleu-saphir/80 font-medium transition-colors"
                >
                  conditions d'utilisation
                </Link>{" "}
                et la{" "}
                <Link
                  to="/privacy"
                  className="text-bleu-saphir hover:text-bleu-saphir/80 font-medium transition-colors"
                >
                  politique de confidentialité
                </Link>
              </label>
            </div>
            {errors.terms && (
              <p className="mt-1.5 text-xs font-bold text-rouge-ecarlate flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errors.terms}
              </p>
            )}
          </div>

          {/* Bouton de soumission principal */}
          <div>
            <button
              type="submit"
              disabled={loading || !agreeTerms}
              className="w-full flex items-center justify-center px-4 py-3 bg-bleu-saphir text-blanc rounded-xl text-xs font-bold hover:bg-bleu-saphir/90 disabled:opacity-50 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blanc"></div>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
