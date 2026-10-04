import { API_URL } from '../config/env';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '../components/buttons/Button';
import { fetchWithAuth } from '../services/apiClient';
import { useLanguage } from "../context/LanguageContext";

export default function MyDonations() {
    const { t } = useLanguage();
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  

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
