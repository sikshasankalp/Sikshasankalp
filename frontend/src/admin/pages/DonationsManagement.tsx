import { useState, useEffect } from 'react';
import { RefreshCw, Search, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchDonationsAdmin } from '../../services/api/donation';
import type { Donation } from '../../services/api/donation';

export default function DonationsManagement() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [status, setStatus] = useState<string>('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 12, totalPages: 1 });

  // Details Modal
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  const loadDonations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: Record<string, string | number> = { page, limit };
      if (status) params.status = status;
      if (search) params.search = search;
      
      const res = await fetchDonationsAdmin(params);
      setDonations(res.data);
      if (res.meta) {
        setMeta(res.meta);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load donations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, [page, limit, status, search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const getStatusBadgeClass = (statusStr: string) => {
    switch (statusStr) {
      case 'SUCCESS': return 'bg-success/10 text-success';
      case 'PENDING': return 'bg-warning/10 text-warning';
      case 'FAILED': return 'bg-error/10 text-error';
      case 'REFUNDED': return 'bg-content-secondary/10 text-content-secondary';
      default: return 'bg-brand-primary/10 text-brand-primary';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(dateStr));
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Donations Management</h1>
        <button
          onClick={() => loadDonations()}
          className="flex items-center gap-2 px-4 py-2 bg-surface border border-border text-content-primary rounded-lg hover:bg-surface-muted transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-border mb-6 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2 relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, email, phone, or payment ID..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
          <Search className="w-5 h-5 text-content-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors">
            Search
          </button>
        </form>

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary min-w-[160px]"
        >
          <option value="">All Statuses</option>
          <option value="SUCCESS">Success</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
          <option value="CREATED">Created</option>
        </select>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 text-error rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => loadDonations()} className="underline text-sm font-medium">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-border flex-1 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-muted border-b border-border whitespace-nowrap">
                <th className="p-4 font-semibold text-content-primary">Date</th>
                <th className="p-4 font-semibold text-content-primary">Donor</th>
                <th className="p-4 font-semibold text-content-primary">PAN</th>
                <th className="p-4 font-semibold text-content-primary">Amount</th>
                <th className="p-4 font-semibold text-content-primary">Status</th>
                <th className="p-4 font-semibold text-content-primary">Receipt / Order ID</th>
                <th className="p-4 font-semibold text-content-primary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-content-secondary">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
                      <span>Loading donations...</span>
                    </div>
                  </td>
                </tr>
              ) : donations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-content-secondary">
                    No donations found matching the criteria.
                  </td>
                </tr>
              ) : (
                donations.map((donation) => (
                  <tr key={donation.id} className="border-b border-border last:border-0 hover:bg-surface-muted/50 transition-colors">
                    <td className="p-4 text-sm text-content-secondary whitespace-nowrap">
                      {formatDate(donation.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-content-primary">{donation.donorName}</div>
                      <div className="text-sm text-content-secondary">{donation.email || donation.mobile}</div>
                    </td>
                    <td className="p-4 text-sm text-content-secondary font-mono">
                      {donation.pan || '-'}
                    </td>
                    <td className="p-4 font-bold text-content-primary">
                      {formatCurrency(donation.amount, donation.currency)}
                    </td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeClass(donation.status)}`}>
                        {donation.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-content-secondary">
                      {donation.receiptNumber ? (
                        <span className="block font-mono">{donation.receiptNumber}</span>
                      ) : (
                        <span className="block font-mono truncate max-w-[120px]" title={donation.razorpayOrderId}>{donation.razorpayOrderId}</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedDonation(donation)}
                        className="p-2 text-content-secondary hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!loading && meta.totalPages > 1 && (
          <div className="p-4 border-t border-border bg-surface-muted flex items-center justify-between mt-auto">
            <span className="text-sm text-content-secondary">
              Showing page {meta.page} of {meta.totalPages} ({meta.total} total)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-border rounded-lg bg-white hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
                className="p-2 border border-border rounded-lg bg-white hover:bg-surface disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-border shrink-0">
              <h2 className="text-xl font-bold">Donation Details</h2>
              <button onClick={() => setSelectedDonation(null)} className="text-content-secondary hover:text-content-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Donor Info */}
                <div>
                  <h3 className="text-sm font-bold text-content-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Donor Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Name</p>
                      <p className="font-medium text-content-primary">{selectedDonation.donorName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Email</p>
                      <p className="font-medium text-content-primary">{selectedDonation.email || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Mobile</p>
                      <p className="font-medium text-content-primary">{selectedDonation.mobile}</p>
                    </div>
                    <div>
                      <p className="text-xs text-content-secondary mb-1">PAN Number</p>
                      <p className="font-medium text-content-primary">{selectedDonation.pan || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Address</p>
                      <p className="font-medium text-content-primary">{selectedDonation.address || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div>
                  <h3 className="text-sm font-bold text-content-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Payment Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Amount</p>
                      <p className="font-bold text-xl text-brand-primary">
                        {formatCurrency(selectedDonation.amount, selectedDonation.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Status</p>
                      <span className={`inline-block text-xs px-2 py-1 rounded-full font-medium ${getStatusBadgeClass(selectedDonation.status)}`}>
                        {selectedDonation.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Receipt Number</p>
                      <p className="font-mono text-sm text-content-primary">{selectedDonation.receiptNumber || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Razorpay Order ID</p>
                      <p className="font-mono text-sm text-content-primary">{selectedDonation.razorpayOrderId || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Razorpay Payment ID</p>
                      <p className="font-mono text-sm text-content-primary">{selectedDonation.razorpayPaymentId || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-4 border-t border-border flex flex-col md:flex-row gap-4 justify-between text-sm text-content-secondary">
                <p>Created: {formatDate(selectedDonation.createdAt)}</p>
                <p>Updated: {formatDate(selectedDonation.updatedAt)}</p>
              </div>
            </div>
            
            <div className="p-4 border-t border-border bg-surface flex justify-end shrink-0">
              <button
                onClick={() => setSelectedDonation(null)}
                className="px-4 py-2 border border-border rounded-lg text-content-primary hover:bg-surface-muted transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
