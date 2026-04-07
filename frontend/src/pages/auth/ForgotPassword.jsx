import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, Lock, Mail, ShieldCheck, Undo2 } from 'lucide-react';
import logo from '../../assets/university_logo.png';
import { secureClient } from '../../api/secureClient';
import { loadPasswordResetSession, savePasswordResetSession, clearPasswordResetSession } from '../../utils/passwordResetSession';

const STEP = {
  EMAIL: 'email',
  OTP: 'otp',
  RESET: 'reset',
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const persisted = loadPasswordResetSession();

  const [step, setStep] = useState(persisted?.step || STEP.EMAIL);
  const [email, setEmail] = useState(persisted?.email || '');
  const [otpDigits, setOtpDigits] = useState(persisted?.otpDigits || Array(5).fill(''));
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState(persisted?.message || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(persisted?.resendIn || 0);
  const [otpVerified, setOtpVerified] = useState(false);

  const otpInputsRef = useRef([]);

  useEffect(() => {
    savePasswordResetSession({ step, email, otpDigits, message, resendIn });
  }, [step, email, otpDigits, message, resendIn]);

  useEffect(() => {
    if (step !== STEP.OTP || resendIn <= 0) return undefined;
    const timer = setInterval(() => {
      setResendIn((value) => (value > 0 ? value - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, resendIn]);

  const otpCode = useMemo(() => otpDigits.join(''), [otpDigits]);
  const otpComplete = otpCode.length === 5;
  const canVerify = otpComplete && !loading;
  const canReset =
    otpComplete &&
    password.length >= 8 &&
    password === passwordConfirmation &&
    otpVerified &&
    !loading;

  const handleSendOtp = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const normalizedEmail = email.trim().toLowerCase();
      await secureClient.post('/password/forgot', { email: normalizedEmail });
      setMessage('Un code � 5 chiffres vient d��tre envoy� si le compte existe.');
      setOtpVerified(false);
      setStep(STEP.OTP);
      setResendIn(60);
      setOtpDigits(Array(5).fill(''));
    } catch (requestError) {
      setError(requestError.friendlyMessage || 'Envoi impossible pour le moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otpDigits];
    next[index] = digit || '';
    setOtpDigits(next);

    if (digit && index < otpInputsRef.current.length - 1) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    if (!canVerify) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await secureClient.post('/password/verify', {
        email: email.trim().toLowerCase(),
        otp_code: otpCode,
      });
      setMessage('Code v�rifi�. Choisissez un nouveau mot de passe.');
      setOtpVerified(true);
      setStep(STEP.RESET);
    } catch (requestError) {
      setError(requestError.friendlyMessage || 'Code invalide ou expir�.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();
    if (!canReset) return;

    setLoading(true);
    setError('');
    setMessage('');

    try {
      await secureClient.post('/password/reset', {
        email: email.trim().toLowerCase(),
        otp_code: otpCode,
        password,
        password_confirmation: passwordConfirmation,
      });
      clearPasswordResetSession();
      navigate('/login', {
        replace: true,
        state: { passwordResetSuccess: 'Mot de passe mis � jour. Connectez-vous.' },
      });
    } catch (requestError) {
      setError(requestError.friendlyMessage || 'R�initialisation impossible.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0 || loading) return;
    await handleSendOtp(new Event('submit'));
  };

  const maskedEmail = useMemo(() => {
    if (!email) return '';
    const [user, domain] = email.split('@');
    if (!domain) return email;
    const safeUser = user.length <= 2 ? `${user[0]}*` : `${user[0]}***${user.slice(-1)}`;
    return `${safeUser}@${domain}`;
  }, [email]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-10 font-inter relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -right-16 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.95fr] gap-10 items-center">
        <div className="hidden lg:block">
          <div className="hero-surface space-y-7">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center shadow-lg shadow-slate-900/30">
                <img src={logo} alt="USMBA Logo" className="h-9 w-9 object-contain brightness-200" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-400">S�curit�</p>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display">
                  R�initialisation s�curis�e
                </h1>
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Mot de passe oubli� ? Nous v�rifions votre identit� via un code � 5 chiffres valable quelques minutes.
              Limitation des tentatives et hachage c�t� serveur prot�gent vos acc�s.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Dur�e du code', value: '10 min' },
                { label: 'Tentatives OTP', value: '5 max' },
                { label: 'Hash', value: 'bcrypt + rate limit' },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/70 bg-white/70 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{item.label}</p>
                  <p className="text-xl font-black text-slate-900 mt-1">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Les codes expir�s sont nettoy�s et invalid�s automatiquement
            </div>
          </div>
        </div>

        <div className="w-full max-w-xl lg:ml-auto">
          <div className="card-minimal rounded-[28px] p-9 shadow-[0_22px_60px_rgba(15,23,42,0.12)]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <ShieldCheck className="text-white" size={24} />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.26em] text-slate-400">Mot de passe</p>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Processus en 3 �tapes</h2>
                </div>
              </div>
              <Link to="/login" className="text-[11px] font-bold text-slate-500 hover:text-slate-700 flex items-center gap-1">
                <Undo2 size={14} />
                Retour
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6 text-[11px] font-semibold text-slate-500">
              {[
                { id: STEP.EMAIL, label: 'Email' },
                { id: STEP.OTP, label: 'Code' },
                { id: STEP.RESET, label: 'Nouveau mot de passe' },
              ].map((item, index) => {
                const active = step === item.id;
                const passed = index < Object.values(STEP).indexOf(step);
                return (
                  <div
                    key={item.id}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2 ${ active ? "border-indigo-500 bg-indigo-50 text-indigo-700" : passed ? "border-emerald-200 bg-emerald-50 text-emerald-600" : "border-slate-100 bg-slate-50" }`}
                  >
                    <span className="h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-black bg-white border border-current">
                      {index + 1}
                    </span>
                    <span>{item.label}</span>
                  </div>
                );
              })}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold border border-red-100 mb-4 text-center">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-xs font-bold border border-emerald-100 mb-4 text-center">
                {message}
              </div>
            )}

            {step === STEP.EMAIL && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="input-minimal pl-10"
                    placeholder="votre.email@usmba.ac.ma"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-semibold">
                  Nous n�indiquons jamais si un compte existe ou non. Vous pouvez renvoyer le code apr�s 60 secondes.
                </p>
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="btn-minimal w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Envoyer le code'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('');
                    setError('');
                    setMessage('');
                  }}
                  className="w-full rounded-xl border border-amber-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-700 hover:bg-amber-50"
                  disabled={loading}
                >
                  Effacer
                </button>
              </form>
            )}

            {step === STEP.OTP && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-600">Code envoy� � {maskedEmail}</p>
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendIn > 0 || loading}
                    className="text-[11px] font-bold text-primary-600 hover:text-primary-700 disabled:text-slate-400"
                  >
                    {resendIn > 0 ? Renvoyer (s) : 'Renvoyer le code'}
                  </button>
                </div>

                <div className="flex justify-between gap-2">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(element) => {
                        otpInputsRef.current[index] = element;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(event) => handleOtpChange(index, event.target.value)}
                      onKeyDown={(event) => handleOtpKeyDown(index, event)}
                      className="w-14 h-14 text-center text-lg font-black tracking-widest input-minimal focus:ring-2 focus:ring-indigo-200"
                    />
                  ))}
                </div>

                <div className="text-[11px] text-slate-500 font-semibold space-y-1">
                  <p>Le code expire dans 10 minutes. 5 tentatives maximum avant blocage temporaire.</p>
                  <p>Ne partagez jamais ce code.</p>
                </div>

                <button
                  type="submit"
                  disabled={!canVerify}
                  className="btn-minimal w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'V�rifier le code'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtpDigits(Array(5).fill(''));
                    setError('');
                    setMessage('');
                  }}
                  className="w-full rounded-xl border border-amber-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-700 hover:bg-amber-50"
                  disabled={loading}
                >
                  Effacer
                </button>
              </form>
            )}

            {step === STEP.RESET && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="input-minimal pl-10"
                    placeholder="Nouveau mot de passe"
                    required
                  />
                </div>
                <div className="relative">
                  <CheckCircle2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={passwordConfirmation}
                    onChange={(event) => setPasswordConfirmation(event.target.value)}
                    className="input-minimal pl-10"
                    placeholder="Confirmer le mot de passe"
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-500 font-semibold">
                  Minimum 8 caract�res, majuscules, minuscules, chiffres et symboles. Les tokens API existants seront
                  r�voqu�s apr�s la r�initialisation.
                </p>
                <button
                  type="submit"
                  disabled={!canReset}
                  className="btn-minimal w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : 'Mettre � jour le mot de passe'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPassword('');
                    setPasswordConfirmation('');
                    setError('');
                    setMessage('');
                  }}
                  className="w-full rounded-xl border border-amber-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-700 hover:bg-amber-50"
                  disabled={loading}
                >
                  Effacer
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;







