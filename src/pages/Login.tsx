import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useAuthRedirect } from "../hooks/useAuthRedirect";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  // Utiliser le hook de redirection automatique
  useAuthRedirect();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const result = await login(email);

    if (result.success) {
      // La redirection sera gérée par le hook useAuthRedirect
      navigate("/");
    } else {
      setError(result.error || "Une erreur est survenue");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center bg-blanc px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          {/* Remplacement de bg-indigo-100 par bg-bleu-clair/20 */}
          <div className="mx-auto h-auto w-25 flex items-center justify-center rounded-full bg-bleu-clair/20">
            <img
              src="/logo.png"
              alt="Nolcop Store"
              className="object-contain rounded-full"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gris-canon-de-fusil">
            Connexion à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gris-canon-de-fusil/70">
            Ou{" "}
            <Link
              to="/register"
              className="font-medium text-bleu-saphir hover:text-bleu-saphir/80 transition-colors"
            >
              créez un nouveau compte
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {message && (
            <div className="rounded-md bg-vert-jungle/10 p-4 mb-4">
              <div className="flex">
                <div className="shrink-0">
                  <CheckCircle className="h-5 w-5 text-vert-jungle" />
                </div>
                <div className="ml-3">
                  <div className="text-sm text-vert-jungle font-medium">
                    {message}
                  </div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-rouge-ecarlate/10 p-4">
              <div className="flex">
                <div className="shrink-0">
                  <AlertCircle className="h-5 w-5 text-rouge-ecarlate" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-rouge-ecarlate">
                    Erreur de connexion
                  </h3>
                  <div className="mt-2 text-sm text-rouge-ecarlate/90">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
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
                  autoComplete="current-password"
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
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-bleu-saphir focus:ring-bleu-saphir border-gris-canon-de-fusil/20 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gris-canon-de-fusil"
              >
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-bleu-saphir hover:text-bleu-saphir/80 transition-colors"
              >
                Mot de passe oublié?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-blanc bg-bleu-saphir hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bleu-saphir disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blanc"></div>
              ) : (
                "Se connecter"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
