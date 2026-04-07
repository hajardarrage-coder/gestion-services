import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2 } from 'lucide-react';
import axios from 'axios';
import logo from '../assets/university_logo.png';

const Login = () => {
  const { state } = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const showDevCredentialHint = import.meta.env.DEV;

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setError('Email et mot de passe sont requis.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, {
        email: normalizedEmail,
        password,
      });
      const { user, token } = response.data;

      login(user);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);

      navigate(`/${user.role}/dashboard`);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Identifiants invalides');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 font-inter">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 -right-10 h-80 w-80 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      <div className="max-w-4xl w-full flex justify-center">
        <div className="w-full max-w-[480px]">
          <div className="card-minimal rounded-[32px] p-10 shadow-[0_22px_60px_rgba(15,23,42,0.14)]">
            <div className="text-center mb-8 space-y-3">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <img src={logo} alt="USMBA Logo" className="h-12 w-12 object-contain drop-shadow" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Connexion sécurisée</h2>
                <p className="text-slate-500 text-sm mt-1">Accédez à votre espace personnalisé</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {state?.passwordResetSuccess && (
                <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg text-xs font-bold border border-emerald-100 text-center">
                  {state.passwordResetSuccess}
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs font-bold border border-red-100 text-center">
                  {error}
                </div>
              )}
              {showDevCredentialHint && error === 'Identifiants invalides' && (
                <div className="bg-sky-50 text-sky-700 p-3 rounded-lg text-xs font-semibold border border-sky-100 text-center">
                  Compte test: admin@gmail.com / admin123
                </div>
              )}

              <div className="space-y-3">
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="username"
                    className="input-minimal pl-10"
                    placeholder="Votre email institutionnel"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    className="input-minimal pl-10"
                    placeholder="Mot de passe"
                    required
                  />
                </div>

                <div className="flex justify-between items-center px-1 text-[11px] font-semibold text-slate-500">
                  <span>Accès réservé aux personnels autorisés</span>
                  <Link
                    to="/forgot-password"
                    className="font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wider"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-minimal w-full mt-2"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Se connecter'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail('');
                  setPassword('');
                  setError('');
                }}
                className="w-full rounded-xl border border-amber-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-700 hover:bg-amber-50"
                disabled={loading}
              >
                Effacer
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-slate-100">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.24em]">
                Université Sidi Mohamed Ben Abdellah
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
