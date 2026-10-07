import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, CheckCircle2, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '../../components/buttons/Button';
import { SmoothInput } from '../../components/common/SmoothInput';
import { useLanguage } from "../../context/LanguageContext";
import { API_URL } from '../../config/env';
import { verifyAdminOtp, resendAdminOtp } from '../../services/auth';

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const isVerifiedParam = searchParams.get('verified') === 'true';
  const fromTarget = (location.state as any)?.from || searchParams.get('redirect') || '/';

  const { login, setUser } = useAuth();
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  const [tempToken, setTempToken] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const digitRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (step !== 'otp' || resendCountdown <= 0) return;
    const interval = setInterval(() => {
      setResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step, resendCountdown]);

  const handleResendVerification = async () => {
    if (!email) {
      setError('Please enter your email address to resend verification link.');
      return;
    }
    setIsResending(true);
    setResendSuccess('');
    try {
      const res = await fetch(`${API_URL}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setResendSuccess('Verification email sent! Please check your inbox and spam folder.');
        setError('');
      } else {
        setError(data.message || 'Failed to resend verification link.');
      }
    } catch {
      setError('Network error while resending verification email.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setResendSuccess('');

    try {
      const res = await login({ email, password });
      if (res.requireOtp) {
        setStep('otp');
        setTempToken(res.tempToken);
        setMaskedEmail(res.email);
        setOtpDigits(['', '', '', '', '', '']);
        setResendCountdown(45);
        setError('');
        setOtpError('');
        setOtpSuccess('');
        setTimeout(() => {
          digitRefs.current[0]?.focus();
        }, 150);
      } else {
        if (res.user.role !== 'PUBLIC_USER') {
          navigate('/admin');
        } else {
          navigate(fromTarget);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const next = [...otpDigits];
      next[index] = '';
      setOtpDigits(next);
      return;
    }

    const next = [...otpDigits];
    next[index] = cleaned[cleaned.length - 1];
    setOtpDigits(next);

    if (index < 5) {
      digitRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!paste) return;
    const next = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      next[i] = paste[i] || '';
    }
    setOtpDigits(next);
    const nextFocusIndex = Math.min(paste.length, 5);
    digitRefs.current[nextFocusIndex]?.focus();
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join('');
    if (code.length !== 6) {
      setOtpError('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsVerifyingOtp(true);
    setOtpError('');
    setOtpSuccess('');

    try {
      const verifiedUser = await verifyAdminOtp({
        tempToken,
        otp: code
      });
      setUser(verifiedUser);
      if (verifiedUser.role !== 'PUBLIC_USER') {
        navigate('/admin');
      } else {
        navigate(fromTarget);
      }
    } catch (err: any) {
      setOtpError(err?.message || 'Verification failed. Please check the code and try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || isResendingOtp) return;
    setIsResendingOtp(true);
    setOtpError('');
    setOtpSuccess('');

    try {
      const res = await resendAdminOtp({ tempToken });
      setOtpSuccess(res.message || 'A new verification code has been sent.');
      setResendCountdown(45);
      setOtpDigits(['', '', '', '', '', '']);
      digitRefs.current[0]?.focus();
    } catch (err: any) {
      setOtpError(err?.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsResendingOtp(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-md bg-background border border-border/50 rounded-xl shadow-sm p-8">

        {step === 'otp' ? (
          <div>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-primary/20 shadow-sm">
                <ShieldCheck className="w-7 h-7 text-brand-primary" />
              </div>
              <h1 className="text-2xl font-display font-bold text-content-primary mb-2">Two-Factor Authentication</h1>
              <p className="text-sm text-content-secondary max-w-xs mx-auto">
                A 6-digit verification code has been sent to your admin email address:
              </p>
              <div className="mt-2.5 inline-flex items-center px-3 py-1 rounded-full bg-surface-muted border border-border text-xs font-mono font-semibold text-content-primary">
                {maskedEmail}
              </div>
            </div>

            {otpSuccess && (
              <div className="bg-green-50 text-green-700 p-3.5 rounded-lg text-sm mb-5 border border-green-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
                <span>{otpSuccess}</span>
              </div>
            )}

            {otpError && (
              <div className="bg-red-50 text-red-600 p-3.5 rounded-lg text-sm mb-5 border border-red-100">
                {otpError}
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-between items-center gap-2 max-w-sm mx-auto" onPaste={handlePaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => {
                      digitRefs.current[idx] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-xl font-bold font-mono rounded-xl border border-border bg-surface text-content-primary shadow-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:outline-none transition-all"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full py-3"
                disabled={isVerifyingOtp || otpDigits.join('').length !== 6}
              >
                {isVerifyingOtp ? 'Verifying Code...' : 'Verify & Sign In'}
              </Button>

              <div className="flex items-center justify-between text-xs pt-4 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => {
                    setStep('credentials');
                    setError('');
                  }}
                  className="inline-flex items-center gap-1.5 text-content-secondary hover:text-content-primary font-medium transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to sign in</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCountdown > 0 || isResendingOtp}
                  className="inline-flex items-center gap-1.5 text-brand-primary hover:underline font-semibold disabled:opacity-50 disabled:no-underline cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResendingOtp ? 'animate-spin' : ''}`} />
                  <span>
                    {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : (isResendingOtp ? 'Sending...' : 'Resend Code')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-display font-bold text-content-primary mb-2">{t('auth.login.text1')}</h1>
              <p className="text-sm text-content-secondary">
                {t('auth.login.text2')}
              </p>
            </div>

            {isVerifiedParam && (
              <div className="bg-green-50 text-green-700 p-3.5 rounded-lg text-sm mb-6 border border-green-200 flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <span className="font-medium">Email verified successfully! You can now sign in below.</span>
              </div>
            )}

            {resendSuccess && (
              <div className="bg-blue-50 text-blue-700 p-3.5 rounded-lg text-sm mb-6 border border-blue-200">
                {resendSuccess}
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 p-3.5 rounded-lg text-sm mb-6 border border-red-100">
                <p>{error}</p>
                {error.toLowerCase().includes('verify your email') && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={isResending}
                    className="text-xs font-semibold text-brand-primary underline hover:text-brand-secondary disabled:opacity-50 block mt-2"
                  >
                    {isResending ? 'Sending verification link...' : 'Resend Verification Email'}
                  </button>
                )}
              </div>
            )}

            <div className="mb-6">
              <button 
                type="button" 
                onClick={() => {
                  window.location.href = `${API_URL}/auth/google`;
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-surface border border-border hover:border-slate-300 hover:bg-neutral-50/80 rounded-xl text-content-primary font-medium text-sm sm:text-base shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="font-semibold text-content-primary">{t('auth.login.text3')}</span>
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-content-muted">{t('auth.login.text4')}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-bold text-content-primary">
                  {t('auth.login.text5')}
                </label>
                <SmoothInput 
                  type="email" 
                  id="email" 
                  required 
                  placeholder="name@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5 relative">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-bold text-content-primary">
                    {t('auth.login.text6')}
                  </label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-brand-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <SmoothInput 
                  type={showPassword ? 'text' : 'password'}
                  id="password" 
                  required 
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  rightElement={
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-content-muted hover:text-content-primary transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
              </div>

              <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Authenticating...' : 'Sign In'}
              </Button>

              <div className="text-center mt-6">
                <span className="text-sm text-content-secondary">
                  {t('auth.login.text7')}{' '}
                </span>
                <Link to="/register" className="text-sm font-bold text-brand-primary hover:underline">
                  {t('auth.login.text8')}
                </Link>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
