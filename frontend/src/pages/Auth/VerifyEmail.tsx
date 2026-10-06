import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { API_URL } from '../../config/env';
import { Button } from '../../components/buttons/Button';

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function verify() {
      if (!token) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage('Verification token is missing.');
        }
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/verify-email/${token}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Verification link is invalid or has expired.');
        }

        if (isMounted) {
          setStatus('success');
          // Automatically redirect to login page after 2.5 seconds with verified flag
          setTimeout(() => {
            navigate('/login?verified=true');
          }, 2500);
        }
      } catch (err: any) {
        if (isMounted) {
          setStatus('error');
          setErrorMessage(err?.message || 'Verification failed. Please request a new link.');
        }
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4 py-12">
      <div className="w-full max-w-md bg-background border border-border/60 rounded-2xl shadow-sm p-8 text-center">
        {status === 'verifying' && (
          <div className="py-8">
            <Loader2 className="w-12 h-12 text-brand-primary animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-bold text-content-primary mb-2">Verifying Your Email</h1>
            <p className="text-sm text-content-secondary">
              Please wait while we confirm your email address...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-content-primary mb-2">Email Verified!</h1>
            <p className="text-sm text-content-secondary mb-6">
              Your email has been verified successfully. Redirecting you to sign in...
            </p>
            <Button
              onClick={() => navigate('/login?verified=true')}
              variant="primary"
              className="w-full flex items-center justify-center gap-2"
            >
              Continue to Sign In <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {status === 'error' && (
          <div className="py-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <XCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl font-bold text-content-primary mb-2">Verification Failed</h1>
            <p className="text-sm text-content-secondary mb-6">
              {errorMessage}
            </p>
            <div className="space-y-3">
              <Link to="/login" className="block">
                <Button variant="primary" className="w-full">
                  Go to Sign In
                </Button>
              </Link>
              <p className="text-xs text-content-muted">
                Need help? Contact support at <a href="mailto:sikshasankalpfoundation@gmail.com" className="text-brand-primary hover:underline">sikshasankalpfoundation@gmail.com</a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
