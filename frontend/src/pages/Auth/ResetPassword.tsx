import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/buttons/Button';
import { SmoothInput } from '../../components/common/SmoothInput';
import { resetPassword } from '../../services/auth';
import { CheckCircle2, Eye, EyeOff, Lock } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!token) {
      setError('Invalid or missing password reset token.');
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPassword({
        token,
        newPassword: password
      });
      setIsSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-md bg-background border border-border/50 rounded-xl shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-display font-bold text-content-primary mb-2">
            Set New Password
          </h1>
          <p className="text-sm text-content-secondary">
            Please enter and confirm your new password below.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-6 border border-red-100">
            {error}
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-6 text-center">
            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg border border-emerald-200 text-sm flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              <p className="font-semibold text-base">Password Reset Successfully</p>
              <p className="text-emerald-700">
                You can now sign in using your email and new password.
              </p>
            </div>

            <Button
              variant="primary"
              to="/login"
              className="w-full inline-flex items-center justify-center"
            >
              Sign In Now
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-1.5 relative">
              <label htmlFor="password" className="text-sm font-bold text-content-primary">
                New Password
              </label>
              <SmoothInput
                type={showPassword ? 'text' : 'password'}
                id="password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-bold text-content-primary">
                Confirm New Password
              </label>
              <SmoothInput
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                required
                minLength={8}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
