const RESET_EMAIL_KEY = 'password_reset_email';
const RESET_OTP_KEY = 'password_reset_otp';
const OTP_COOLDOWN_UNTIL_KEY = 'password_reset_otp_cooldown_until';
const RESET_STATE_KEY = 'password_reset_state_v2';

export const setResetEmail = (email) => {
  const normalized = email.trim().toLowerCase();
  sessionStorage.setItem(RESET_EMAIL_KEY, normalized);
  savePasswordResetSession({ email: normalized });
};

export const getResetEmail = () => sessionStorage.getItem(RESET_EMAIL_KEY) || '';

export const setResetOtp = (otpCode) => {
  const normalized = otpCode.trim();
  sessionStorage.setItem(RESET_OTP_KEY, normalized);
  const current = loadPasswordResetSession();
  savePasswordResetSession({ ...(current || {}), otpDigits: normalized.split('') });
};

export const getResetOtp = () => sessionStorage.getItem(RESET_OTP_KEY) || '';

export const setOtpCooldown = (seconds = 60) => {
  const cooldownUntil = Date.now() + seconds * 1000;
  sessionStorage.setItem(OTP_COOLDOWN_UNTIL_KEY, String(cooldownUntil));
};

export const getOtpCooldownRemaining = () => {
  const rawCooldownUntil = sessionStorage.getItem(OTP_COOLDOWN_UNTIL_KEY);
  if (!rawCooldownUntil) return 0;

  const remainingSeconds = Math.ceil((Number(rawCooldownUntil) - Date.now()) / 1000);
  if (remainingSeconds <= 0) {
    sessionStorage.removeItem(OTP_COOLDOWN_UNTIL_KEY);
    return 0;
  }

  return remainingSeconds;
};

export const savePasswordResetSession = (state) => {
  if (!state) {
    sessionStorage.removeItem(RESET_STATE_KEY);
    return;
  }
  sessionStorage.setItem(RESET_STATE_KEY, JSON.stringify(state));
};

export const loadPasswordResetSession = () => {
  const raw = sessionStorage.getItem(RESET_STATE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    sessionStorage.removeItem(RESET_STATE_KEY);
    return null;
  }
};

export const clearPasswordResetSession = () => {
  sessionStorage.removeItem(RESET_EMAIL_KEY);
  sessionStorage.removeItem(RESET_OTP_KEY);
  sessionStorage.removeItem(OTP_COOLDOWN_UNTIL_KEY);
  sessionStorage.removeItem(RESET_STATE_KEY);
};
