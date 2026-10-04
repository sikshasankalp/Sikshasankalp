import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/buttons/Button';
import { signup } from '../../services/auth';
import { useLanguage } from "../../context/LanguageContext";

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

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-bold text-content-primary">
              {t('auth.register.text6')}
                                      </label>
            <input 
              type="text" 
              id="name" 
              required 
              className="px-4 py-2.5 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary text-sm"
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-bold text-content-primary">
              {t('auth.register.text7')}
                                      </label>
            <input 
              type="email" 
              id="email" 
              required 
              className="px-4 py-2.5 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary text-sm"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <label htmlFor="password" className="text-sm font-bold text-content-primary">
              {t('auth.register.text8')}
                                      </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                id="password" 
                required 
                minLength={8}
                className="w-full pl-4 pr-10 py-2.5 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary text-sm"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <label htmlFor="confirmPassword" className="text-sm font-bold text-content-primary">
              {t('auth.register.text9')}
                                      </label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword" 
                required 
                minLength={8}
                className="w-full pl-4 pr-10 py-2.5 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary text-sm"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
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
