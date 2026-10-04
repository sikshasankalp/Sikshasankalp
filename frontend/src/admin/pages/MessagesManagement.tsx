import { useState, useEffect } from 'react';
import { Trash2, X, Eye, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { fetchContactsAdmin, updateContactStatus, deleteContact } from '../../services/api/contact';
import type { ContactMessage } from '../../services/api/contact';

export default function MessagesManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = { page, limit };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      
      const res = await fetchContactsAdmin(params);
      setMessages(res.data);
      if (res.meta) {
        setMeta(res.meta);
      }
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [page, limit, statusFilter, search]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      setUpdatingId(id);
      await updateContactStatus(id, newStatus);
      
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status: newStatus as any } : m));
      
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus as any });
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await deleteContact(id);
      if (selectedMessage?.id === id) setSelectedMessage(null);
      loadMessages();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to delete message.');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-brand-primary/10 text-brand-primary font-bold';
      case 'READ': return 'bg-info/10 text-info';
      case 'REPLIED': return 'bg-success/10 text-success';
      case 'CLOSED': return 'bg-content-secondary/10 text-content-secondary';
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
        <h1 className="text-2xl font-bold">Messages & Enquiries</h1>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-border mb-6 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2 relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, email, or subject..."
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
          <option value="READ">Read</option>
          <option value="REPLIED">Replied</option>
          <option value="CLOSED">Closed</option>
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
                <th className="p-4 font-semibold text-content-primary">Sender</th>
                <th className="p-4 font-semibold text-content-primary">Subject / Message</th>
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
                      <span>Loading messages...</span>
                    </div>
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-content-secondary">No messages found matching the criteria.</td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className={`border-b border-border last:border-0 hover:bg-surface-muted/50 transition-colors ${msg.status === 'NEW' ? 'bg-brand-primary/5' : ''}`}>
                    <td className="p-4 text-sm text-content-secondary whitespace-nowrap">
                      {formatDate(msg.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-content-primary">{msg.name}</div>
                      <div className="text-sm text-content-secondary">{msg.mobile} • {msg.email || '-'}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-content-primary max-w-[200px] truncate" title={msg.subject}>{msg.subject || 'No Subject'}</div>
                      <div className="text-sm text-content-secondary max-w-[200px] truncate" title={msg.message}>{msg.message}</div>
                    </td>
                    <td className="p-4">
                      {updatingId === msg.id ? (
                        <span className="text-xs text-content-secondary animate-pulse">Updating...</span>
                      ) : (
                        <select
                          value={msg.status}
                          onChange={(e) => handleStatusChange(msg.id, e.target.value)}
                          className={`text-xs px-2 py-1 rounded-full font-bold focus:outline-none cursor-pointer ${getStatusBadgeClass(msg.status)}`}
                        >
                          <option value="NEW" className="bg-white text-content-primary">New</option>
                          <option value="READ" className="bg-white text-content-primary">Read</option>
                          <option value="REPLIED" className="bg-white text-content-primary">Replied</option>
                          <option value="CLOSED" className="bg-white text-content-primary">Closed</option>
                        </select>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedMessage(msg);
                            if (msg.status === 'NEW') {
                              handleStatusChange(msg.id, 'READ');
                            }
                          }}
                          className="p-2 text-content-secondary hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
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
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-border shrink-0">
              <h2 className="text-xl font-bold">Contact Message</h2>
              <button onClick={() => setSelectedMessage(null)} className="text-content-secondary hover:text-content-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-6">
                
                {/* Sender Info */}
                <div>
                  <h3 className="text-sm font-bold text-content-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Sender Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Name</p>
                      <p className="font-medium text-content-primary">{selectedMessage.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Email</p>
                      <p className="font-medium text-content-primary">{selectedMessage.email || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Mobile</p>
                      <p className="font-medium text-content-primary">{selectedMessage.mobile}</p>
                    </div>
                  </div>
                </div>

                {/* Status Info */}
                <div>
                  <h3 className="text-sm font-bold text-content-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Message Status</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Current Status</p>
                      <select
                          value={selectedMessage.status}
                          onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value)}
                          className={`text-sm px-3 py-1.5 rounded-lg border font-bold focus:outline-none cursor-pointer border-border`}
                        >
                          <option value="NEW">New</option>
                          <option value="READ">Read</option>
                          <option value="REPLIED">Replied</option>
                          <option value="CLOSED">Closed</option>
                      </select>
                    </div>
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Received On</p>
                      <p className="font-medium text-content-primary">{formatDate(selectedMessage.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-content-secondary mb-1">Last Updated</p>
                      <p className="font-medium text-content-primary">{formatDate(selectedMessage.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <h3 className="text-sm font-bold text-content-primary uppercase tracking-wider mb-4 border-b border-border pb-2">Message Body</h3>
                <div className="mb-4">
                  <p className="text-xs text-content-secondary mb-1">Subject</p>
                  <p className="font-medium text-content-primary">{selectedMessage.subject || 'No Subject'}</p>
                </div>
                <div>
                  <p className="text-xs text-content-secondary mb-1">Message</p>
                  <div className="p-4 bg-surface-muted rounded-lg text-sm whitespace-pre-wrap text-content-primary min-h-[100px]">
                    {selectedMessage.message}
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-4 border-t border-border bg-surface flex justify-end gap-3 shrink-0">
              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="px-4 py-2 text-error hover:bg-error/10 rounded-lg transition-colors font-medium"
              >
                Delete Message
              </button>
              <button
                onClick={() => setSelectedMessage(null)}
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
