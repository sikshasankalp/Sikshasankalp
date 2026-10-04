import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchTransparencyAdmin, createTransparency, updateTransparency, deleteTransparency } from '../../services/api/transparency';
import type { TransparencyDocument } from '../../services/api/transparency';

const DOCUMENT_TYPES = [
  'ANNUAL_REPORT',
  'AUDIT_REPORT',
  'TAX_RETURN',
  'LEGAL_DOCUMENT',
  'BOARD_MINUTES',
  'IMPACT_REPORT'
];

export default function TransparencyManagement() {
  const [documents, setDocuments] = useState<TransparencyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0]);
  const [documentNumber, setDocumentNumber] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [issuedDate, setIssuedDate] = useState('');
  const [description, setDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  
  const [submitting, setSubmitting] = useState(false);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const res = await fetchTransparencyAdmin({ page, limit });
      setDocuments(res.data);
      if (res.meta) {
        setMeta(res.meta);
      }
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load documents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [page, limit]);

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setDocumentType(DOCUMENT_TYPES[0]);
    setDocumentNumber('');
    setDocumentUrl('');
    setIssuedDate(new Date().toISOString().split('T')[0]);
    setDescription('');
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (doc: TransparencyDocument) => {
    setEditingId(doc.id);
    setTitle(doc.title);
    setDocumentType(doc.documentType);
    setDocumentNumber(doc.documentNumber || '');
    setDocumentUrl(doc.documentUrl);
    setIssuedDate(doc.issuedDate ? new Date(doc.issuedDate).toISOString().split('T')[0] : '');
    setDescription(doc.description || '');
    setIsPublished(doc.isPublished);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !documentType || !documentUrl || !issuedDate) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      
      const payload = {
        title,
        documentType,
        documentNumber: documentNumber || undefined,
        documentUrl,
        issuedDate: new Date(issuedDate).toISOString(),
        description: description || undefined,
        isPublished,
      };

      if (editingId) {
        await updateTransparency(editingId, payload);
      } else {
        await createTransparency(payload);
      }
      
      setIsModalOpen(false);
      loadDocuments();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to save document.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await deleteTransparency(id);
      loadDocuments();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to delete document.');
    }
  };

  const formatDocType = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateStr));
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transparency Documents</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Document
        </button>
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
                <th className="p-4 font-semibold text-content-primary">Document</th>
                <th className="p-4 font-semibold text-content-primary">Type</th>
                <th className="p-4 font-semibold text-content-primary">Issued Date</th>
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
                      <span>Loading documents...</span>
                    </div>
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-content-secondary">No documents found.</td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="border-b border-border last:border-0 hover:bg-surface-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-content-primary">{doc.title}</div>
                          {doc.documentNumber && (
                            <div className="text-xs text-content-secondary">No: {doc.documentNumber}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-content-secondary">{formatDocType(doc.documentType)}</td>
                    <td className="p-4 text-sm text-content-secondary">{doc.issuedDate ? formatDate(doc.issuedDate) : '-'}</td>
                    <td className="p-4">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold ${doc.isPublished ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                        {doc.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={doc.documentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-content-secondary hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                          title="View Document"
                        >
                          <FileText className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => openEditModal(doc)}
                          className="p-2 text-content-secondary hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Document' : 'Add Document'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-content-secondary hover:text-content-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-content-primary mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    placeholder="e.g. Annual Report 2024-25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-content-primary mb-1">Document Type *</label>
                  <select
                    required
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                  >
                    {DOCUMENT_TYPES.map(type => (
                      <option key={type} value={type}>{formatDocType(type)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-content-primary mb-1">Document Number</label>
                  <input
                    type="text"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    placeholder="e.g. 12A/80G/2024"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-content-primary mb-1">Document URL (PDF/Link) *</label>
                  <input
                    type="url"
                    required
                    value={documentUrl}
                    onChange={(e) => setDocumentUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    placeholder="https://..."
                  />
                  <p className="text-xs text-content-secondary mt-1">Provide a link to the document (e.g. Google Drive link or hosted PDF).</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-content-primary mb-1">Issued/Relevant Date *</label>
                  <input
                    type="date"
                    required
                    value={issuedDate}
                    onChange={(e) => setIssuedDate(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-content-primary mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none"
                    placeholder="Brief description of the document"
                  />
                </div>

                {/* Toggles */}
                <div className="md:col-span-2 flex gap-8 py-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${isPublished ? 'bg-brand-primary' : 'bg-border'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isPublished ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="text-sm font-medium text-content-primary">Published</span>
                  </label>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-lg text-content-primary hover:bg-surface-muted transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  {editingId ? 'Save Changes' : 'Add Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
