import { API_URL } from '../../../config/env';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../buttons/Button';
import { createDonationOrder, verifyDonationPayment } from '../../../services/api/donation';
import { Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useLanguage } from "../../../context/LanguageContext";

const PRESET_AMOUNTS = [500, 1000, 2500];

export function DonateMain() {
    const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [amountSelection, setAmountSelection] = useState<number | 'custom'>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    pan: '',
    address: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [successData, setSuccessData] = useState<{
    receiptNumber: string;
    receiptToken: string;
    amount: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  

  useEffect(() => {
    if (user && formData.name === '' && formData.email === '') {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const activeAmount = amountSelection === 'custom' 
    ? (parseInt(customAmount) || 0) 
    : amountSelection;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAmount <= 0) return;
    
    setErrorMsg(null);
    setIsProcessing(true);
    
    try {
      // 1. Create order
      const order = await createDonationOrder({
        amount: activeAmount,
        donorName: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        pan: formData.pan,
        address: formData.address
      });
      
      // 2. Setup Razorpay options
      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Shiksha Sankalp Foundation',
        description: 'Donation',
        order_id: order.razorpayOrderId,
        handler: async function (response: any) {
          try {
            // 3. Verify payment on success callback
            setIsProcessing(true);
            const verificationResult = await verifyDonationPayment(
              response.razorpay_order_id,
              response.razorpay_payment_id,
              response.razorpay_signature
            );
            setSuccessData({
              receiptNumber: verificationResult.receiptNumber,
              receiptToken: verificationResult.receiptToken,
              amount: verificationResult.amount,
            });
          } catch (err: any) {
            setErrorMsg(err.message || 'Payment verification failed.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: '#16a34a', // Using brand-primary color
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };
      
      // 4. Open Razorpay Checkout
      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        setErrorMsg(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();
      
    } catch (error: any) {
      console.error('Failed to initialize donation', error);
      setErrorMsg(error.message || 'Failed to initialize payment.');
      setIsProcessing(false);
    }
  };

  if (!user) {
    return (
      <section className="section-padding bg-background border-b border-border/50 text-center">
        <div className="container-default max-w-lg mx-auto py-16 bg-surface border border-border rounded-xl shadow-sm px-6">
          <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-4 text-content-primary">{t('donate.donateMain.text1')}</h2>
          <p className="text-content-secondary mb-8">
            {t('donate.donateMain.text2')}
                              </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/login?redirect=/donate')} variant="primary">
              {t('donate.donateMain.text3')}
                                    </Button>
            <Button onClick={() => navigate('/register?redirect=/donate')} variant="outline">
              {t('donate.donateMain.text4')}
                                    </Button>
          </div>
        </div>
      </section>
    );
  }

  if (successData) {
    return (
      <section className="section-padding bg-background border-b border-border/50">
        <div className="container-default max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">✓</div>
          <h2 className="text-h2 mb-4">{t('donate.donateMain.text5')}</h2>
          <p className="text-body-large text-content-secondary mb-8">
            {t('donate.donateMain.text6')}<br/>
            {t('donate.donateMain.text7')}
                              </p>
          
          <div className="bg-surface border border-border/60 rounded-xl p-6 max-w-sm mx-auto mb-8 text-left">
            <div className="flex justify-between items-center mb-4">
              <span className="text-content-secondary font-medium">{t('donate.donateMain.text8')}</span>
              <span className="text-content-primary font-bold">{successData.receiptNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-content-secondary font-medium">{t('donate.donateMain.text9')}</span>
              <span className="text-brand-primary font-bold text-xl">₹{successData.amount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href={`${API_URL}/donations/receipt/${successData.receiptToken}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary-dark transition-colors"
            >
              {t('donate.donateMain.text10')}
                                    </a>
            <Button onClick={() => navigate('/account/donations')} variant="outline">
              {t('donate.donateMain.text11')}
                                    </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background border-b border-border/50">
      <div className="container-default max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[6fr_4fr] gap-12 lg:gap-16">
          
          {/* Left: Form */}
          <div>
            <form id="donation-form" onSubmit={handleSubmit} className="space-y-10">
              
              {/* Amount Selection */}
              <div>
                <h3 className="text-xl font-bold text-content-primary mb-6">{t('donate.donateMain.text12')}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {PRESET_AMOUNTS.map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setAmountSelection(amt)}
                      className={`py-3 px-4 rounded-lg font-bold border transition-all ${
                        amountSelection === amt 
                        ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' 
                        : 'border-border bg-surface text-content-secondary hover:border-brand-primary/40'
                      }`}
                    >
                      ₹{amt.toLocaleString()}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAmountSelection('custom')}
                    className={`py-3 px-4 rounded-lg font-bold border transition-all ${
                      amountSelection === 'custom' 
                      ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' 
                      : 'border-border bg-surface text-content-secondary hover:border-brand-primary/40'
                    }`}
                  >
                    {t('donate.donateMain.text13')}
                                                        </button>
                </div>
                
                {amountSelection === 'custom' && (
                  <div className="relative max-w-[200px] mt-4">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-content-secondary font-bold">₹</span>
                    <input 
                      type="number" 
                      min="1"
                      required
                      className="w-full pl-8 pr-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-bold text-content-primary"
                      placeholder="Amount"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Donor Details */}
              <div>
                <h3 className="text-xl font-bold text-content-primary mb-6">{t('donate.donateMain.text14')}</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-bold text-content-primary">
                      {t('donate.donateMain.text15')} <span className="text-brand-primary">*</span>
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      required 
                      className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary transition-all text-content-primary"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="mobile" className="text-sm font-bold text-content-primary">
                      {t('donate.donateMain.text16')} <span className="text-brand-primary">*</span>
                    </label>
                    <input 
                      type="tel" 
                      id="mobile" 
                      required 
                      className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary transition-all text-content-primary"
                      value={formData.mobile}
                      onChange={e => setFormData(prev => ({...prev, mobile: e.target.value}))}
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="email" className="text-sm font-bold text-content-primary">
                      {t('donate.donateMain.text17')} <span className="text-brand-primary">*</span>
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary transition-all text-content-primary"
                      value={formData.email}
                      onChange={e => setFormData(prev => ({...prev, email: e.target.value}))}
                    />
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="pan" className="text-sm font-bold text-content-primary">
                      {t('donate.donateMain.text18')} <span className="text-brand-primary">*</span>
                    </label>
                    <input 
                      type="text" 
                      id="pan"
                      required
                      maxLength={10}
                      className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary transition-all text-content-primary uppercase"
                      value={formData.pan}
                      onChange={e => setFormData(prev => ({...prev, pan: e.target.value.replace(/\s+/g, '').toUpperCase()}))}
                    />
                    <p className="text-xs text-content-muted mt-1">
                      {t('donate.donateMain.text19')}
                                                              </p>
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="address" className="text-sm font-bold text-content-primary">
                      {t('donate.donateMain.text20')} <span className="text-content-muted font-normal ml-1">(Optional)</span>
                    </label>
                    <textarea 
                      id="address" 
                      rows={2}
                      className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary transition-all text-content-primary resize-y"
                      value={formData.address}
                      onChange={e => setFormData(prev => ({...prev, address: e.target.value}))}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Right: Summary Panel */}
          <div>
            <div className="bg-surface-muted/50 border border-border/80 rounded-xl p-8 sticky top-24">
              <h3 className="text-xl font-bold text-content-primary mb-6 border-b border-border/60 pb-4">{t('donate.donateMain.text21')}</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-content-secondary">{t('donate.donateMain.text22')}</span>
                  <span className="font-bold text-content-primary">₹{activeAmount.toLocaleString()}</span>
                </div>
                {formData.name && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-content-secondary">{t('donate.donateMain.text23')}</span>
                    <span className="font-medium text-content-primary">{formData.name}</span>
                  </div>
                )}
                {formData.email && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-content-secondary">{t('donate.donateMain.text24')}</span>
                    <span className="font-medium text-content-primary break-all max-w-[60%] text-right">{formData.email}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm border-t border-border/60 pt-4 mt-4">
                  <span className="text-content-secondary">{t('donate.donateMain.text25')}</span>
                  <span className="font-medium text-content-primary">{t('donate.donateMain.text26')}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t border-border/60 pt-4 mt-4">
                  <span className="text-content-primary">{t('donate.donateMain.text27')}</span>
                  <span className="text-brand-primary">₹{activeAmount.toLocaleString()}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                form="donation-form" 
                variant="primary" 
                size="lg" 
                className="w-full flex items-center justify-center gap-2"
                disabled={isProcessing || activeAmount <= 0}
              >
                <Lock className="w-4 h-4" />
                {isProcessing ? 'Processing...' : 'Proceed to Donate'}
              </Button>
              
              {errorMsg && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{errorMsg}</p>
                </div>
              )}
              
              <p className="text-xs text-center text-content-muted mt-4">
                {t('donate.donateMain.text28')}
                                            </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
