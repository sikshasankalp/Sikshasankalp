import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/buttons/Button';
import { SmoothInput } from '../../components/common/SmoothInput';
import { forgotPassword } from '../../services/auth';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to process request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-md bg-background border border-border/50 rounded-xl shadow-sm p-8">
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-content-secondary hover:text-brand-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to sign in
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-display font-bold text-content-primary mb-2">
            Reset Password
          </h1>
          <p className="text-sm text-content-secondary">
            Enter the email associated with your account and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        {isSubmitted ? (
          <div className="space-y-6">
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg border border-emerald-200 text-sm flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Check your inbox</p>
                <p className="text-emerald-700">
                  If an account exists with that email address, a password reset link has been sent. The link expires in 15 minutes.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
              }}
            >
              Send another link
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-bold text-content-primary">
                Email Address
              </label>
              <SmoothInput
                type="email"
                id="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
