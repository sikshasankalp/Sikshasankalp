import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/auth';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/buttons/Button';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await adminLogin({ email, password });
      localStorage.setItem('admin_token', response.token);
      navigate('/admin/dashboard');
    } catch (_err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-md bg-background border border-border/50 rounded-xl shadow-sm p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-content-primary mb-2">Admin Access</h1>
          <p className="text-sm text-content-secondary">
            Shiksha Sankalp Foundation Operations
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-bold text-content-primary">
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              required 
              className="px-4 py-2.5 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-content-primary text-sm"
              placeholder="admin@shikshasankalp.org"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5 relative">
            <label htmlFor="password" className="text-sm font-bold text-content-primary">
              Password
            </label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                id="password" 
                required 
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

          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </Button>
          
          <p className="text-xs text-center text-content-muted mt-4">
            Frontend-only protection. Actual authentication will be enforced by the backend later.
          </p>
        </form>

      </div>
    </div>
  );
}
