import { useState } from 'react';
import { Button } from '../../buttons/Button';
import { createDonationOrder } from '../../../services/api/donation';
import { Lock } from 'lucide-react';

const PRESET_AMOUNTS = [500, 1000, 2500];

export function DonateMain() {
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
  const [success, setSuccess] = useState(false);

  const activeAmount = amountSelection === 'custom' 
    ? (parseInt(customAmount) || 0) 
    : amountSelection;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeAmount <= 0) return;
    
    setIsProcessing(true);
    try {
      // Create order via our separated API service
      await createDonationOrder({
        amount: activeAmount,
        donorName: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        pan: formData.pan,
        address: formData.address
      });
      
      // In the future:
      // 1. Initialize Razorpay with order.orderId
      // 2. Handle success callback -> verifyDonationPayment() -> setSuccess(true)
      
      // For now, simulate success immediately after order creation to demonstrate architecture
      setSuccess(true);
    } catch (error) {
      console.error('Failed to initialize donation', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <section className="section-padding bg-background border-b border-border/50">
        <div className="container-default max-w-2xl mx-auto text-center py-12">
          <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">✓</div>
          <h2 className="text-h2 mb-4">Payment Prepared</h2>
          <p className="text-body-large text-content-secondary mb-8">
            The frontend architecture is ready. In a production environment, this is where the secure Razorpay checkout would launch.
          </p>
          <Button onClick={() => setSuccess(false)} variant="outline">
            Return to Form
          </Button>
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
                <h3 className="text-xl font-bold text-content-primary mb-6">1. Select Amount</h3>
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
                    Custom
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
                <h3 className="text-xl font-bold text-content-primary mb-6">2. Donor Details</h3>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="text-sm font-bold text-content-primary">
                      Full Name <span className="text-brand-primary">*</span>
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
                      Mobile Number <span className="text-brand-primary">*</span>
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
                      Email Address <span className="text-brand-primary">*</span>
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
                      PAN Number <span className="text-content-muted font-normal ml-1">(Optional)</span>
                    </label>
                    <input 
                      type="text" 
                      id="pan"
                      maxLength={10}
                      className="px-4 py-3 bg-surface border border-border rounded-lg focus:outline-none focus:border-brand-primary transition-all text-content-primary uppercase"
                      value={formData.pan}
                      onChange={e => setFormData(prev => ({...prev, pan: e.target.value.toUpperCase()}))}
                    />
                    <p className="text-xs text-content-muted mt-1">
                      Note: PAN and 80G documentation are only relevant where applicable. Providing a PAN does not guarantee tax exemption unless official certification is available.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 md:col-span-2">
                    <label htmlFor="address" className="text-sm font-bold text-content-primary">
                      Address <span className="text-content-muted font-normal ml-1">(Optional)</span>
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
              <h3 className="text-xl font-bold text-content-primary mb-6 border-b border-border/60 pb-4">Donation Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-content-secondary">Amount</span>
                  <span className="font-bold text-content-primary">₹{activeAmount.toLocaleString()}</span>
                </div>
                {formData.name && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-content-secondary">Name</span>
                    <span className="font-medium text-content-primary">{formData.name}</span>
                  </div>
                )}
                {formData.email && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-content-secondary">Email</span>
                    <span className="font-medium text-content-primary break-all max-w-[60%] text-right">{formData.email}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm border-t border-border/60 pt-4 mt-4">
                  <span className="text-content-secondary">Payment Method</span>
                  <span className="font-medium text-content-primary">Secure Checkout</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold border-t border-border/60 pt-4 mt-4">
                  <span className="text-content-primary">Total</span>
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
                {isProcessing ? 'Preparing Payment...' : 'Proceed to Donate'}
              </Button>
              
              <p className="text-xs text-center text-content-muted mt-4">
                You will be redirected to a secure payment gateway. No payment information is stored on our servers.
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
