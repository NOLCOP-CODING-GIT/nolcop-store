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
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  // Utiliser le hook de redirection automatique
  useAuthRedirect();

  const validateForm = () => {
    if (!name || name.length < 2) {
      return "Le nom doit contenir au moins 2 caractères";
    }

    if (!email || !email.includes("@")) {
      return "Veuillez entrer une adresse email valide";
    }

    if (!password || password.length < 6) {
      return "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (password !== confirmPassword) {
      return "Les mots de passe ne correspondent pas";
    }

    if (!address || address.length < 5) {
      return "Veuillez entrer une adresse valide";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setMessage("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    const result = await register(email, password, name, address);

    if (result.success) {
      if (result.message) {
        setMessage(result.message);
        setSuccess(true);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } else {
      setError(result.error || "Une erreur est survenue");
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="py-12 flex items-center justify-center bg-blanc px-4">
        <div className="max-w-md w-full">
          <div className="text-center">
            {/* Remplacement des couleurs vertes par vert-jungle */}
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

                {/* Remplacement de la boîte bleue générique par bleu-clair/20 et bleu-saphir */}
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
                  {/* Bouton principal en bleu-saphir */}
                  <button
                    onClick={() => (window.location.href = `mailto:${email}`)}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blanc bg-bleu-saphir hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bleu-saphir transition-all"
                  >
                    Ouvrir ma boîte mail
                  </button>

                  {/* Bouton secondaire avec vos bordures et texte gris-canon-de-fusil */}
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
                  {/* Loader utilisant bleu-saphir */}
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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Alerte Erreur avec rouge-ecarlate */}
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
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gris-canon-de-fusil/20 bg-blanc text-gris-canon-de-fusil rounded-md placeholder-gris-canon-de-fusil/40 focus:outline-none focus:ring-2 focus:ring-bleu-saphir focus:border-transparent sm:text-sm"
                  placeholder="Jean Dupont"
                />
              </div>
            </div>

            {/* Champ : Adresse */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gris-canon-de-fusil"
              >
                Adresse
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
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gris-canon-de-fusil/20 bg-blanc text-gris-canon-de-fusil rounded-md placeholder-gris-canon-de-fusil/40 focus:outline-none focus:ring-2 focus:ring-bleu-saphir focus:border-transparent sm:text-sm"
                  placeholder="123 Rue de la République, 75001 Paris"
                />
              </div>
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
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gris-canon-de-fusil/20 bg-blanc text-gris-canon-de-fusil rounded-md placeholder-gris-canon-de-fusil/40 focus:outline-none focus:ring-2 focus:ring-bleu-saphir focus:border-transparent sm:text-sm"
                  placeholder="vous@exemple.com"
                />
              </div>
            </div>
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
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gris-canon-de-fusil/20 bg-blanc text-gris-canon-de-fusil rounded-md placeholder-gris-canon-de-fusil/40 focus:outline-none focus:ring-2 focus:ring-bleu-saphir focus:border-transparent sm:text-sm"
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
              <p className="mt-1 text-xs text-gris-canon-de-fusil/60">
                Minimum 6 caractères
              </p>
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
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gris-canon-de-fusil/20 bg-blanc text-gris-canon-de-fusil rounded-md placeholder-gris-canon-de-fusil/40 focus:outline-none focus:ring-2 focus:ring-bleu-saphir focus:border-transparent sm:text-sm"
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
            </div>
          </div>

          {/* Cases à cocher : CGU & Confidentialité */}
          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              required
              className="h-4 w-4 text-bleu-saphir focus:ring-bleu-saphir border-gris-canon-de-fusil/20 rounded"
            />
            <label
              htmlFor="agree-terms"
              className="ml-2 block text-sm text-gris-canon-de-fusil/80"
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

          {/* Bouton de soumission principal */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blanc bg-bleu-saphir hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bleu-saphir disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
