import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, Package, Sparkles, CheckCircle2, 
  MapPin, Phone, MessageSquare, Copy, Check,
  Filter, Search, RefreshCw, X, Box
} from 'lucide-react';
import { fetchNeeds } from '../../services/api/need';
import type { NgoNeed } from '../../services/api/need';

export default function NeedsPage() {
  const [needs, setNeeds] = useState<NgoNeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeedForFulfill, setSelectedNeedForFulfill] = useState<NgoNeed | null>(null);
  const [copied, setCopied] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchNeeds();
      setNeeds(data || []);
    } catch (err) {
      console.error('Failed to load needs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Extract unique categories
  const categories = ['ALL', ...Array.from(new Set(needs.map((n) => n.category).filter(Boolean) as string[]))];

  const filteredNeeds = needs.filter((item) => {
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesSearch = 
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency?.toUpperCase()) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse" />
            Critical Urgent
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            High Priority
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            Ongoing Need
          </span>
        );
    }
  };

  const copyCourierAddress = () => {
    const address = `Siksha Sankalp Learning Center\nOpposite Shiv Mandir Community Ground, Outer Ring Road, Delhi - 110041, India\nContact: +91 98765 43210`;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-b from-[#1c1917] via-[#24201c] to-[#1c1917] text-white py-14 sm:py-20 border-b border-[#38332d]">
        <div className="container-default">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Direct Community Impact
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display tracking-tight text-white mb-4">
              Current Requirements & NGO Needs
            </h1>
            <p className="text-base sm:text-lg text-stone-300 leading-relaxed">
              Every book, sweater, and meal directly touches the life of an underprivileged child. 
              Here is our live wishlist of everyday essentials required at our open-air learning centers. 
              You can fulfill these in-kind by sending supplies or sponsoring them financially.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-stone-300">
              <div className="flex items-center gap-2 bg-[#2d2822] px-3.5 py-2 rounded-lg border border-[#423b32]">
                <Package className="w-4 h-4 text-amber-300" />
                <span><strong>{needs.length}</strong> Total Active Requests</span>
              </div>
              <div className="flex items-center gap-2 bg-[#2d2822] px-3.5 py-2 rounded-lg border border-[#423b32]">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% In-Kind Verified Distribution</span>
              </div>
              <a
                href="#courier-guide"
                className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 underline underline-offset-4 font-medium"
              >
                Drop-off & Courier Info &darr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Content Section */}
      <section className="py-10 sm:py-14">
        <div className="container-default">
          {/* Controls bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              <Filter className="w-4 h-4 text-content-muted shrink-0 mr-1" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'bg-surface-muted text-content-secondary hover:bg-border/60'
                  }`}
                >
                  {cat === 'ALL' ? 'All Items' : cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <Search className="w-4 h-4 text-content-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search supplies or needs..."
                className="w-full pl-9 pr-4 py-2 text-sm bg-surface rounded-lg border border-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-content-muted hover:text-content-primary"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-content-muted">
              <RefreshCw className="w-8 h-8 animate-spin text-brand-primary mb-3" />
              <p className="text-sm">Fetching verified needs list...</p>
            </div>
          ) : filteredNeeds.length === 0 ? (
            <div className="py-20 text-center bg-surface rounded-2xl border border-border p-8 max-w-lg mx-auto">
              <Box className="w-12 h-12 text-content-muted mx-auto mb-3" />
              <h3 className="text-lg font-bold text-content-primary mb-1">No matching needs found</h3>
              <p className="text-sm text-content-muted mb-4">
                Try resetting your search query or selecting a different category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-sm font-medium bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNeeds.map((need) => (
                <div
                  key={need.id}
                  className="bg-surface rounded-2xl border border-border/80 shadow-soft hover:shadow-elevated transition-all flex flex-col p-6 hover:-translate-y-0.5"
                >
                  {/* Card Header Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {getUrgencyBadge(need.urgency)}
                    {need.category && (
                      <span className="text-[11px] font-semibold text-content-muted uppercase tracking-wider bg-surface-muted px-2 py-0.5 rounded">
                        {need.category}
                      </span>
                    )}
                  </div>

                  {/* Title & Quantity */}
                  <h3 className="text-lg font-bold text-content-primary mb-2 line-clamp-2">
                    {need.title}
                  </h3>

                  {need.quantity && (
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-md w-fit mb-3">
                      <Package className="w-3.5 h-3.5" />
                      <span>Target Quantity: {need.quantity}</span>
                    </div>
                  )}

                  {/* Description */}
                  {need.description ? (
                    <p className="text-sm text-content-secondary line-clamp-3 mb-6 flex-grow leading-relaxed">
                      {need.description}
                    </p>
                  ) : (
                    <p className="text-sm text-content-muted italic mb-6 flex-grow">
                      Required for ongoing children education and daily welfare sessions.
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-border/60 flex items-center gap-2.5">
                    <button
                      onClick={() => setSelectedNeedForFulfill(need)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold bg-brand-primary text-white hover:bg-brand-primary-hover transition-colors shadow-sm"
                    >
                      <Package className="w-4 h-4" />
                      <span>Fulfill In-Kind</span>
                    </button>
                    <Link
                      to={`/donate?purpose=${encodeURIComponent(need.title)}`}
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold bg-surface-muted hover:bg-border text-content-primary border border-border transition-colors"
                      title="Sponsor financially"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Sponsor</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* In-Kind Courier & Drop-Off Guide Section */}
      <section id="courier-guide" className="py-14 sm:py-20 bg-surface-muted/60 border-t border-border">
        <div className="container-default">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-2 block">
                How It Works
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-content-primary">
                Sending In-Kind Donations Directly
              </h2>
              <p className="text-sm sm:text-base text-content-secondary mt-2 max-w-xl mx-auto">
                You can courier items directly, send via Amazon/Flipkart/Blinkit, or hand them over personally at our Delhi teaching location.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Courier Address Card */}
              <div className="bg-surface rounded-2xl border border-border p-6 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-brand-primary font-bold text-sm mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>Drop-Off & Courier Postal Address</span>
                  </div>
                  <div className="bg-surface-muted p-4 rounded-xl border border-border/70 text-sm text-content-primary font-mono leading-relaxed mb-4">
                    <strong>Siksha Sankalp Community Learning Center</strong><br />
                    Opposite Shiv Mandir Open Ground,<br />
                    Outer Ring Road, Delhi - 110041, India<br />
                    <span className="text-xs text-content-secondary font-sans block mt-2">
                      Drop-Off Hours: Mon - Sat (9:00 AM - 5:00 PM)
                    </span>
                  </div>
                </div>

                <button
                  onClick={copyCourierAddress}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-surface border border-border hover:bg-surface-muted text-content-primary transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Address Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Full Address for Courier / Order</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Coordinator Contact Card */}
              <div className="bg-surface rounded-2xl border border-border p-6 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-3">
                    <MessageSquare className="w-4 h-4" />
                    <span>Talk to In-Kind Coordinator</span>
                  </div>
                  <p className="text-sm text-content-secondary leading-relaxed mb-4">
                    Have questions regarding packaging, bulk items, or transport? Let us know what you plan to send so our field volunteers are ready to receive and acknowledge your parcel.
                  </p>
                  <div className="space-y-2 text-xs sm:text-sm text-content-primary mb-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-content-muted" />
                      <span>Coordinator Helpline: <strong>+91 98765 43210</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>We provide photo proof of distribution for every donation</span>
                    </div>
                  </div>
                </div>

                <a
                  href="https://wa.me/919876543210?text=Hi%20Siksha%20Sankalp,%20I%20would%20like%20to%20send%20supplies%20for%20your%20NGO%20needs."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp In-Kind Coordinator</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal: Fulfill In-Kind Popup */}
      {selectedNeedForFulfill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-surface rounded-2xl max-w-lg w-full border border-border shadow-elevated overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border bg-surface-muted/40">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-brand-primary" />
                <h3 className="font-bold text-base text-content-primary">Fulfill This Requirement</h3>
              </div>
              <button
                onClick={() => setSelectedNeedForFulfill(null)}
                className="text-content-muted hover:text-content-primary p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-surface-muted/60 p-4 rounded-xl border border-border/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-primary block mb-1">
                  Selected Item
                </span>
                <h4 className="font-bold text-base text-content-primary">{selectedNeedForFulfill.title}</h4>
                {selectedNeedForFulfill.quantity && (
                  <p className="text-xs text-content-secondary mt-1">
                    Needed: <strong>{selectedNeedForFulfill.quantity}</strong>
                  </p>
                )}
              </div>

              <div className="text-xs sm:text-sm text-content-secondary space-y-2">
                <p>
                  <strong>Option A: Courier / Deliver Directly:</strong> You can send the parcel via India Post, DTDC, Amazon, or Blinkit to:
                </p>
                <div className="bg-surface p-3 rounded-lg border border-border text-xs font-mono text-content-primary">
                  Siksha Sankalp Learning Center<br />
                  Opposite Shiv Mandir Open Ground,<br />
                  Outer Ring Road, Delhi - 110041 (Phone: +91 98765 43210)
                </div>
                <p className="pt-1">
                  <strong>Option B: Let our coordinator know on WhatsApp:</strong> We will track the parcel and send you photos once received!
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <a
                  href={`https://wa.me/919876543210?text=Hi%20Siksha%20Sankalp,%20I%20would%20like%20to%20fulfill%20the%20need:%20${encodeURIComponent(
                    selectedNeedForFulfill.title
                  )}%20(${encodeURIComponent(selectedNeedForFulfill.quantity || 'supplies')})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Notify via WhatsApp</span>
                </a>
                <Link
                  to={`/donate?purpose=${encodeURIComponent(selectedNeedForFulfill.title)}`}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  <span>Sponsor ₹ Fund Instead</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
