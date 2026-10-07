import { API_URL } from '../config/env';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Download, Loader2, KeyRound, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/buttons/Button';
import { SmoothInput } from '../components/common/SmoothInput';
import { fetchWithAuth } from '../services/apiClient';
import { setPassword as apiSetPassword } from '../services/auth';
import { useLanguage } from "../context/LanguageContext";

export default function MyDonations() {
    const { t } = useLanguage();
  const { user, isLoading: isAuthLoading, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  // Password Setup / Change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  

  useEffect(() => {
    if (!user) return;

    const fetchDonations = async () => {
      try {
        const res = await fetchWithAuth(`${API_URL}/donations/my`);
        
        const data = await res.json();
        
        if (data.success) {
          setDonations(data.data);
        } else {
          setError(data.message || 'Failed to fetch donations');
        }
      } catch (err) {
        setError('Error fetching donations');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, [user]);

  const handleDownload = async (id: string, receiptNumber: string) => {
    try {
      setDownloadingId(id);
      const res = await fetchWithAuth(`${API_URL}/donations/${id}/receipt`);
      
      if (!res.ok) {
        throw new Error('Failed to download receipt');
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${receiptNumber?.replace(/\//g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download failed', err);
      alert('Could not download receipt. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await apiSetPassword({
        password: newPassword,
        confirmPassword
      });
      setPasswordSuccess(res.message || 'Password saved successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
      await refreshUser();
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to update password.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (isAuthLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (!user) {
    return <Navigate to="/login?redirect=/account/donations" replace />;
  }

  return (
    <div className="section-padding min-h-screen bg-background pt-24">
      <div className="container-default max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-content-primary">{t('pages.myDonations.text1')}</h1>

        {/* Account Security / Password Setup Section */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 mt-0.5">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-content-primary">
                  {user.hasPassword ? 'Password & Security' : 'Set Account Password'}
                </h3>
                <p className="text-sm text-content-secondary mt-0.5">
                  {user.hasPassword
                    ? 'Your account has a password configured. You can update it anytime.'
                    : 'You currently sign in via Google. Set a password to also sign in directly with your email and password.'}
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant={user.hasPassword ? 'outline' : 'primary'}
              size="sm"
              onClick={() => {
                setShowPasswordForm(!showPasswordForm);
                setPasswordError(null);
                setPasswordSuccess(null);
              }}
              className="shrink-0 text-sm"
            >
              {showPasswordForm ? 'Cancel' : user.hasPassword ? 'Change Password' : 'Set Password'}
            </Button>
          </div>

          {passwordSuccess && (
            <div className="mt-4 p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
              {passwordError}
            </div>
          )}

          {showPasswordForm && (
            <form onSubmit={handlePasswordSubmit} className="mt-6 pt-6 border-t border-border/60 max-w-md space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-content-primary">
                  {user.hasPassword ? 'New Password' : 'Password'}
                </label>
                <SmoothInput
                  type="password"
                  required
                  minLength={8}
                  placeholder="At least 8 characters"
                  className="py-2 text-sm"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-content-primary">
                  Confirm Password
                </label>
                <SmoothInput
                  type="password"
                  required
                  minLength={8}
                  placeholder="Re-enter password"
                  className="py-2 text-sm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" variant="primary" size="sm" disabled={isSavingPassword}>
                  {isSavingPassword ? 'Saving...' : 'Save Password'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-brand-primary" /></div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">{error}</div>
        ) : donations.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-12 text-center shadow-sm">
            <h3 className="text-xl font-bold mb-2 text-content-primary">{t('pages.myDonations.text2')}</h3>
            <p className="text-content-secondary mb-6 max-w-md mx-auto">{t('pages.myDonations.text3')}</p>
            <Button onClick={() => navigate('/donate')} variant="primary">
              {t('pages.myDonations.text4')}
                                              </Button>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-background text-content-secondary text-sm border-b border-border">
                    <th className="px-6 py-4 font-semibold">{t('pages.myDonations.text5')}</th>
                    <th className="px-6 py-4 font-semibold">{t('pages.myDonations.text6')}</th>
                    <th className="px-6 py-4 font-semibold">{t('pages.myDonations.text7')}</th>
                    <th className="px-6 py-4 font-semibold">{t('pages.myDonations.text8')}</th>
                    <th className="px-6 py-4 font-semibold text-right">{t('pages.myDonations.text9')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {donations.map((d) => (
                    <tr key={d.id} className="hover:bg-background/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-content-primary whitespace-nowrap">
                        {new Date(d.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 text-sm text-content-secondary whitespace-nowrap">
                        {d.receiptNumber || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-content-primary">
                        ₹{d.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-full ${
                          d.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                          d.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {d.status === 'SUCCESS' && (
                          <button
                            onClick={() => handleDownload(d.id, d.receiptNumber)}
                            disabled={downloadingId === d.id}
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-primary hover:text-brand-primary-dark transition-colors disabled:opacity-50"
                          >
                            {downloadingId === d.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            {t('pages.myDonations.text10')}
                                                                </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
