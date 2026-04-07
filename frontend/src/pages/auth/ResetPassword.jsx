import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Loader2, Lock, Mail } from 'lucide-react';
import logo from '../../assets/university_logo.png';

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const tokenFromUrl = searchParams.get('token') || '';
  const emailFromUrl = searchParams.get('email') || '';

  const [token] = useState(tokenFromUrl);
  const [email, setEmail] = useState(emailFromUrl);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isStrongPassword = useMemo(() => STRONG_PASSWORD_REGEX.test(password), [password]);

  const handleReset = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!token) {
      setError('Lien invalide ou expiré. Veuillez redemander un email de réinitialisation.');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('La confirmation ne correspond pas.');
      return;
    }

    if (!isStrongPassword) {
      setError('Mot de passe trop faible (8+ caractères, Maj, min, chiffre, symbole).');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/reset-password`, {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });

      setSuccess(response.data.message || 'Mot de passe réinitialisé.');

      setTimeout(() => {
        navigate('/login', {
          replace: true,
          state: { passwordResetSuccess: 'Votre mot de passe a été réinitialisé.' },
        });
      }, 900);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Impossible de réinitialiser.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md card-minimal shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-2xl p-8">
        <div className="text-center mb-8">
          <img src={logo} alt="USMBA Logo" className="h-14 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
          <p className="text-sm text-slate-500 mt-2">Set your new password securely.</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold border border-red-100 mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-xs font-bold border border-emerald-100 mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div className="relative">
            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="input-minimal pl-10"
              placeholder="Email"
              required
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="input-minimal pl-10"
              placeholder="New password"
              required
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="password"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              className="input-minimal pl-10"
              placeholder="Confirm password"
              required
            />
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            8+ caractères avec majuscule, minuscule, chiffre et symbole. Le code expire rapidement pour votre sécurité.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="btn-minimal w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
          <button
            type="button"
            onClick={() => {
              setEmail(emailFromUrl);
              setPassword('');
              setPasswordConfirmation('');
              setError('');
              setSuccess('');
            }}
            className="w-full rounded-xl border border-amber-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-700 hover:bg-amber-50"
            disabled={loading}
          >
            Effacer
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wide">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
