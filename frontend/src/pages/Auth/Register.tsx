import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/buttons/Button';
import { SmoothInput } from '../../components/common/SmoothInput';
import { signup } from '../../services/auth';
import { useLanguage } from "../../context/LanguageContext";
import { API_URL } from '../../config/env';

export default function Register() {
    const { t } = useLanguage();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      await signup({ name, email, password });
      setSuccess(true);
      // Wait for 3 seconds then redirect
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4 py-12">
        <div className="w-full max-w-md bg-background border border-border/50 rounded-xl shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">✓</div>
          <h1 className="text-2xl font-display font-bold text-content-primary mb-2">{t('auth.register.text1')}</h1>
          <p className="text-sm text-content-secondary mb-6">
            {t('auth.register.text2')}
                              </p>
          <Button to="/login" variant="primary" className="w-full">
            {t('auth.register.text3')}
                              </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-md bg-background border border-border/50 rounded-xl shadow-sm p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-content-primary mb-2">{t('auth.register.text4')}</h1>
          <p className="text-sm text-content-secondary">
            {t('auth.register.text5')}
                                </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-100">
            {error}
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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-bold text-content-primary">
              {t('auth.register.text6')}
            </label>
            <SmoothInput 
              type="text" 
              id="name" 
              required 
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-bold text-content-primary">
              {t('auth.register.text7')}
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
            <label htmlFor="password" className="text-sm font-bold text-content-primary">
              {t('auth.register.text8')}
            </label>
            <SmoothInput 
              type={showPassword ? 'text' : 'password'}
              id="password" 
              required 
              minLength={8}
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

          <div className="flex flex-col gap-1.5 relative">
            <label htmlFor="confirmPassword" className="text-sm font-bold text-content-primary">
              {t('auth.register.text9')}
            </label>
            <SmoothInput 
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword" 
              required 
              minLength={8}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              rightElement={
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-content-muted hover:text-content-primary transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </div>

          <Button type="submit" variant="primary" className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <div className="text-center mt-6">
            <span className="text-sm text-content-secondary">
              {t('auth.register.text10')}{' '}
            </span>
            <Link to="/login" className="text-sm font-bold text-brand-primary hover:underline">
              {t('auth.register.text11')}
                                      </Link>
          </div>
        </form>

      </div>
    </div>
  );
}
