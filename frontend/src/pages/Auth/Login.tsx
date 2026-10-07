import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/buttons/Button';
import { SmoothInput } from '../../components/common/SmoothInput';
import { useLanguage } from "../../context/LanguageContext";
import { API_URL } from '../../config/env';

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isVerifiedParam = searchParams.get('verified') === 'true';

  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');
  const [isResending, setIsResending] = useState(false);

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
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-md bg-background border border-border/50 rounded-xl shadow-sm p-8">
        
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
          <Button 
            type="button" 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => {
              window.location.href = `${API_URL}/auth/google`;
            }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {t('auth.login.text3')}
                                </Button>
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
    </div>
  );
}
