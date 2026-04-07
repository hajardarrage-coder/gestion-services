import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loader2, ShieldCheck } from 'lucide-react';
import {
  getOtpCooldownRemaining,
  getResetEmail,
  setOtpCooldown,
  setResetEmail,
  setResetOtp,
} from '../../utils/passwordResetSession';
import logo from '../../assets/university_logo.png';

const VerifyCode = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const persistedEmail = getResetEmail();
  const [email] = useState(() => location.state?.email || persistedEmail);
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cooldown, setCooldown] = useState(() => getOtpCooldownRemaining());

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCooldown(getOtpCooldownRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerify = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/password/verify`, {
        email,
        otp_code: otpCode,
      });

      setSuccess(response.data.message || 'OTP verified successfully.');
      setResetEmail(email);
      setResetOtp(otpCode);

      setTimeout(() => {
        navigate('/reset-password', { state: { email, otpCode } });
      }, 600);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || !email) {
      return;
    }

    setResendLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/password/forgot`, { email });
      setSuccess(response.data.message || 'OTP sent successfully.');
      setOtpCooldown(60);
      setCooldown(getOtpCooldownRemaining());
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to resend OTP.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-md card-minimal shadow-[0_10px_30px_rgba(0,0,0,0.1)] rounded-2xl p-8">
        <div className="text-center mb-8">
          <img src={logo} alt="USMBA Logo" className="h-14 mx-auto mb-4 object-contain" />
          <h1 className="text-2xl font-bold text-slate-900">Verify OTP Code</h1>
          <p className="text-sm text-slate-500 mt-2">We sent a code to <span className="font-semibold">{email}</span></p>
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

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative">
            <ShieldCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={otpCode}
              onChange={(event) => setOtpCode(event.target.value.replace(/\D/g, '').slice(0, 5))}
              className="input-minimal pl-10 tracking-[0.35em]"
              placeholder="00000"
              inputMode="numeric"
              maxLength={5}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || otpCode.length !== 5}
            className="btn-minimal w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Verifying...' : 'Verify'}
          </button>
          <button
            type="button"
            onClick={() => {
              setOtpCode('');
              setError('');
              setSuccess('');
            }}
            className="w-full rounded-xl border border-amber-200 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-amber-700 hover:bg-amber-50"
            disabled={loading}
          >
            Effacer
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendLoading || cooldown > 0}
            className="text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resendLoading ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
          </button>
          <Link to="/forgot-password" className="text-xs font-bold text-slate-500 hover:text-slate-700 uppercase tracking-wide">
            Change email
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;

