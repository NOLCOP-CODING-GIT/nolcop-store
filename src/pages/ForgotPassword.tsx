import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowLeft, AlertCircle, KeyRound, Lock } from "lucide-react";
import emailjs from "@emailjs/browser";
import { supabase } from "../supabaseClient";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Countdown state
  const [timeLeft, setTimeLeft] = useState(25);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (step === 2 && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (step === 2 && timeLeft === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, step]);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setError(null);

    if (!email.trim()) {
      setEmailError("L'adresse email est obligatoire pour continuer.");
      return;
    }

    setLoading(true);
    try {
      const { data, error: rpcError } = await supabase.rpc(
        "request_password_reset_otp",
        {
          p_email: email,
        },
      );

      if (rpcError) throw new Error(rpcError.message);

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          otp_code: data.otp_code,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      setOtp("");
      setStep(2);
      setTimeLeft(25);
      setCanResend(false);
    } catch (err: any) {
      console.error("Erreur d'envoi EmailJS :", err);
      setError(
        err.text ||
          err.message ||
          "Erreur lors de l'envoi du code. Veuillez réessayer.",
      );
    } finally {
      setLoading(false);
    }
  };

  const executeVerifyOtp = async (codeToVerify: string) => {
    if (codeToVerify.length !== 8) return;
    setLoading(true);
    setError(null);
    try {
      const { error: rpcError } = await supabase.rpc(
        "verify_password_reset_otp",
        {
          p_email: email,
          p_otp_code: codeToVerify,
        },
      );

      if (rpcError) throw new Error(rpcError.message);

      setError(null);
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Code OTP invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    executeVerifyOtp(otp);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setOtp(val);
    if (error) setError(null);

    if (val.length === 8 && !loading) {
      executeVerifyOtp(val);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { error: rpcError } = await supabase.rpc(
        "reset_password_with_otp",
        {
          p_email: email,
          p_otp_code: otp,
          p_new_password: newPassword,
        },
      );

      if (rpcError) throw new Error(rpcError.message);

      navigate("/login");
    } catch (err: any) {
      setError(
        err.message || "Erreur lors de la réinitialisation du mot de passe.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc(
        "request_password_reset_otp",
        {
          p_email: email,
        },
      );

      if (rpcError) throw new Error(rpcError.message);

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          to_email: email,
          otp_code: data.otp_code,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );

      setOtp("");
      setTimeLeft(25);
      setCanResend(false);
    } catch (err: any) {
      console.error("Erreur de renvoi EmailJS :", err);
      setError(err.text || err.message || "Erreur lors du renvoi du code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blanc px-4 py-12">
      <div className="max-w-md w-full">
        <div className="mx-auto h-auto w-25 flex items-center justify-center rounded-full bg-bleu-clair/20">
          <img
            src="/logo.png"
            alt="Nolcop Store"
            className="object-contain rounded-full"
          />
        </div>

        <div className="px-4 sm:p-8">
          {error && (
            <div className="mb-6 rounded-xl p-4 border border-rose-500/10 bg-rose-500/20 text-rose-800 text-xs sm:text-sm font-semibold flex items-start">
              <AlertCircle className="h-5 w-5 text-rose-500 shrink-0 mr-3 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 && (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-xl sm:text-2xl font-black text-gris-canon-de-fusil mb-2 leading-tight">
                  Mot de passe oublié ?
                </h1>
                <p className="text-xs sm:text-sm text-gris-canon-de-fusil/50 font-medium leading-relaxed">
                  Entrez votre adresse e-mail pour recevoir un code OTP à 8
                  chiffres de réinitialisation.
                </p>
              </div>
              <form onSubmit={handleSendEmail} className="space-y-5" noValidate>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-gris-canon-de-fusil/70 mb-1.5"
                  >
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gris-canon-de-fusil/30">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(null);
                      }}
                      placeholder="exemple@domaine.com"
                      className={`w-full pl-10 pr-4 py-2.5 bg-blanc border rounded-xl focus:outline-none text-xs font-semibold text-gris-canon-de-fusil transition-all ${
                        emailError
                          ? "border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                          : "border-gris-canon-de-fusil/10 focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5"
                      }`}
                    />
                  </div>
                  {emailError && (
                    <p className="mt-1.5 text-xs font-bold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {emailError}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 bg-bleu-saphir text-blanc rounded-xl text-xs font-bold hover:bg-bleu-saphir/90 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blanc"></div>
                  ) : (
                    "Envoyer le code OTP"
                  )}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <div className="mb-6 text-center">
                <div className="mx-auto h-12 w-12 mb-4 flex items-center justify-center rounded-2xl bg-bleu-saphir/5 border border-bleu-saphir/10 text-bleu-saphir">
                  <KeyRound className="h-6 w-6" />
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-gris-canon-de-fusil mb-2 leading-tight">
                  Vérification OTP
                </h1>
                <p className="text-xs sm:text-sm text-gris-canon-de-fusil/50 font-medium leading-relaxed">
                  Entrez le code à 8 chiffres envoyé à{" "}
                  <strong className="text-gris-canon-de-fusil font-bold">
                    {email}
                  </strong>
                </p>
              </div>
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-xs font-bold text-gris-canon-de-fusil/70 mb-1.5"
                  >
                    Code OTP (8 chiffres)
                  </label>
                  <input
                    id="otp"
                    type="text"
                    required
                    maxLength={8}
                    value={otp}
                    disabled={loading}
                    onChange={handleOtpChange}
                    placeholder="12345678"
                    className="w-full px-4 py-2.5 text-center tracking-widest bg-blanc border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5 text-lg font-black text-gris-canon-de-fusil transition-all disabled:opacity-50"
                  />
                </div>

                <div className="text-center text-xs font-medium text-gris-canon-de-fusil/60">
                  {!canResend ? (
                    <p>
                      Renvoyer le code dans{" "}
                      <span className="font-bold text-bleu-saphir">
                        00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                      </span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="font-bold text-bleu-saphir hover:underline cursor-pointer"
                    >
                      Renvoyer le code maintenant
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 8}
                  className="w-full flex items-center justify-center px-4 py-3 bg-bleu-saphir text-blanc rounded-xl text-xs font-bold hover:bg-bleu-saphir/90 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blanc"></div>
                  ) : (
                    "Vérifier le code"
                  )}
                </button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <div className="mb-6 text-center">
                <h1 className="text-xl sm:text-2xl font-black text-gris-canon-de-fusil mb-2 leading-tight">
                  Nouveau mot de passe
                </h1>
                <p className="text-xs sm:text-sm text-gris-canon-de-fusil/50 font-medium leading-relaxed">
                  Créez un nouveau mot de passe sécurisé pour votre compte.
                </p>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label
                    htmlFor="new-password"
                    className="block text-xs font-bold text-gris-canon-de-fusil/70 mb-1.5"
                  >
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gris-canon-de-fusil/30">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="new-password"
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-blanc border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5 text-xs font-semibold text-gris-canon-de-fusil transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-xs font-bold text-gris-canon-de-fusil/70 mb-1.5"
                  >
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gris-canon-de-fusil/30">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="confirm-password"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 bg-blanc border border-gris-canon-de-fusil/10 rounded-xl focus:outline-none focus:border-bleu-saphir focus:ring-2 focus:ring-bleu-saphir/5 text-xs font-semibold text-gris-canon-de-fusil transition-all"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-3 bg-bleu-saphir text-blanc rounded-xl text-xs font-bold hover:bg-bleu-saphir/90 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blanc"></div>
                  ) : (
                    "Enregistrer le mot de passe"
                  )}
                </button>
              </form>
            </>
          )}

          <div className="mt-6 pt-6 border-t border-gris-canon-de-fusil/5 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-xs font-bold text-gris-canon-de-fusil/60 hover:text-bleu-saphir transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-2" />
              Retour à la page de connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
