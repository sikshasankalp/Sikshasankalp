import { useState, useEffect } from 'react';
import { Trash2, X, Eye, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { fetchPartnersAdmin, updatePartnerStatus, deletePartner } from '../../services/api/partner';
import type { Partner } from '../../services/api/partner';

export default function PartnersManagement() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadPartners = async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = { page, limit };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      
      const res = await fetchPartnersAdmin(params);
      setPartners(res.data);
      if (res.meta) {
        setMeta(res.meta);
      }
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load partners.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, [page, limit, statusFilter, search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      await updatePartnerStatus(id, newStatus);
      
      setPartners(prev => prev.map(p => p.id === id ? { ...p, status: newStatus as any } : p));
      
      if (selectedPartner && selectedPartner.id === id) {
        setSelectedPartner({ ...selectedPartner, status: newStatus as any });
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this partner inquiry?')) return;
    
    try {
      await deletePartner(id);
      if (selectedPartner?.id === id) setSelectedPartner(null);
      loadPartners();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to delete partner.');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-brand-primary/10 text-brand-primary';
      case 'CONTACTED': return 'bg-info/10 text-info';
      case 'IN_PROGRESS': return 'bg-warning/10 text-warning';
      case 'COMPLETED': return 'bg-success/10 text-success';
      case 'REJECTED': return 'bg-error/10 text-error';
      default: return 'bg-content-secondary/10 text-content-secondary';
    }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Partner Inquiries</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-border mb-6 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2 relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by organization, contact person, or email..."
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
          />
          <Search className="w-5 h-5 text-content-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors">
            Search
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary min-w-[160px]"
        >
          <option value="">All Statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 text-error rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-border flex-1 flex flex-col overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-muted border-b border-border whitespace-nowrap">
                <th className="p-4 font-semibold text-content-primary">Date</th>
                <th className="p-4 font-semibold text-content-primary">Organization</th>
                <th className="p-4 font-semibold text-content-primary">Contact Person</th>
                <th className="p-4 font-semibold text-content-primary">Status</th>
                <th className="p-4 font-semibold text-content-primary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-content-secondary">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
                      <span>Loading partner inquiries...</span>
                    </div>
                  </td>
                </tr>
              ) : partners.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-content-secondary">No inquiries found matching the criteria.</td>
                </tr>
              ) : (
                partners.map((partner) => (
                  <tr key={partner.id} className="border-b border-border last:border-0 hover:bg-surface-muted/50 transition-colors">
                    <td className="p-4 text-sm text-content-secondary whitespace-nowrap">
                      {formatDate(partner.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-content-primary">{partner.organizationName}</div>
                      <div className="text-sm text-content-secondary">{partner.organizationType || '-'}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-content-primary">{partner.contactPerson}</div>
                      <div className="text-sm text-content-secondary">{partner.mobile} • {partner.email}</div>
                    </td>
                    <td className="p-4">
                      {updatingId === partner.id ? (
                        <span className="text-xs text-content-secondary animate-pulse">Updating...</span>
                      ) : (
                        <select
                          value={partner.status}
                          onChange={(e) => handleStatusChange(partner.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full font-bold focus:outline-none cursor-pointer ${getStatusBadgeClass(partner.status)}`}
                        >
                          <option value="NEW" className="bg-white text-content-primary">New</option>
                          <option value="CONTACTED" className="bg-white text-content-primary">Contacted</option>
                          <option value="IN_PROGRESS" className="bg-white text-content-primary">In Progress</option>
                          <option value="COMPLETED" className="bg-white text-content-primary">Completed</option>
                          <option value="REJECTED" className="bg-white text-content-primary">Rejected</option>
                        </select>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedPartner(partner)}
                          className="p-2 text-content-secondary hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(partner.id)}
                          className="p-2 text-content-secondary hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-border shrink-0">
              <h2 className="text-xl font-bold">Partner Inquiry</h2>
              <button onClick={() => setSelectedPartner(null)} className="text-content-secondary hover:text-content-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                
                {/* Contact Info */}
                <div>
                  <h3 className="text-sm font-bold text-content-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Organization & Contact</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Organization</p>
                      <p className="font-medium text-content-primary">{selectedPartner.organizationName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Organization Type</p>
                      <p className="font-medium text-content-primary">{selectedPartner.organizationType || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Contact Person</p>
                      <p className="font-medium text-content-primary">{selectedPartner.contactPerson}</p>
                    </div>
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Email</p>
                      <p className="font-medium text-content-primary">{selectedPartner.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Mobile</p>
                      <p className="font-medium text-content-primary">{selectedPartner.mobile}</p>
                    </div>
                  </div>
                </div>

                {/* Status Info */}
                <div>
                  <h3 className="text-sm font-bold text-content-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Inquiry Status</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Current Status</p>
                      <select
                          value={selectedPartner.status}
                          onChange={(e) => handleStatusChange(selectedPartner.id, e.target.value)}
                          className={`text-sm px-3 py-1.5 rounded-lg border font-bold focus:outline-none cursor-pointer border-border`}
                        >
                          <option value="NEW">New</option>
                          <option value="CONTACTED">Contacted</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="REJECTED">Rejected</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Received On</p>
                      <p className="font-medium text-content-primary">{formatDate(selectedPartner.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Last Updated</p>
                      <p className="font-medium text-content-primary">{formatDate(selectedPartner.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h3 className="text-sm font-bold text-content-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Message</h3>
                <div className="p-4 bg-surface-muted rounded-lg text-sm whitespace-pre-wrap text-content-primary min-h-[100px]">
                  {selectedPartner.message || 'No message provided.'}
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-border bg-surface flex justify-end gap-3 shrink-0">
              <button
                onClick={() => handleDelete(selectedPartner.id)}
                className="px-4 py-2 text-error hover:bg-error/10 rounded-lg transition-colors font-medium"
              >
                Delete Inquiry
              </button>
              <button
                onClick={() => setSelectedPartner(null)}
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
