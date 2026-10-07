import { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, X, RefreshCw, AlertCircle, 
  Package, Eye, EyeOff 
} from 'lucide-react';
import { 
  fetchNeedsAdmin, 
  createNeed, 
  updateNeed, 
  deleteNeed 
} from '../../services/api/need';
import type { NgoNeed } from '../../services/api/need';

export default function NeedsManagement() {
  const [needs, setNeeds] = useState<NgoNeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [urgency, setUrgency] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [isActive, setIsActive] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadNeeds();
  }, []);

  const loadNeeds = async () => {
    try {
      setLoading(true);
      const data = await fetchNeedsAdmin();
      setNeeds(data || []);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load NGO requirements list.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Education');
    setQuantity('');
    setUrgency('HIGH');
    setDescription('');
    setDisplayOrder('0');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: NgoNeed) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category || '');
    setQuantity(item.quantity || '');
    setUrgency(item.urgency);
    setDescription(item.description || '');
    setDisplayOrder(item.displayOrder.toString());
    setIsActive(item.isActive);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (item: NgoNeed) => {
    try {
      const updated = await updateNeed(item.id, { isActive: !item.isActive });
      setNeeds((prev) => prev.map((n) => (n.id === item.id ? updated : n)));
    } catch (err) {
      console.error('Failed to toggle active status:', err);
      alert('Failed to update status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Requirement Title is required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: title.trim(),
        category: category.trim() || undefined,
        quantity: quantity.trim() || undefined,
        urgency,
        description: description.trim() || undefined,
        displayOrder: parseInt(displayOrder, 10) || 0,
        isActive,
      };

      if (editingId) {
        const updated = await updateNeed(editingId, payload);
        setNeeds((prev) => prev.map((n) => (n.id === editingId ? updated : n)));
      } else {
        const created = await createNeed(payload);
        setNeeds((prev) => [created, ...prev]);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from requirements?`)) return;

    try {
      await deleteNeed(id);
      setNeeds((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete item.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-content-primary">NGO Requirements & Needs</h1>
          <p className="text-sm text-content-secondary mt-1">
            Manage live supplies & equipment needed by the NGO. Active items continuously scroll on the homepage ticker and appear on the /needs page.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover font-medium text-sm transition shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Need</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-surface rounded-xl border border-border shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-content-muted">
            <RefreshCw className="w-6 h-6 animate-spin text-brand-primary mb-2" />
            <span className="text-sm">Loading NGO requirements...</span>
          </div>
        ) : needs.length === 0 ? (
          <div className="py-16 text-center text-content-muted">
            <Package className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No requirements added yet.</p>
            <p className="text-xs text-content-muted mt-1">
              Click &quot;Add New Need&quot; above to add supplies needed for the children.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-muted/60 text-content-secondary font-semibold border-b border-border text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Title & Quantity</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Urgency</th>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {needs.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-content-primary">{item.title}</div>
                      {item.quantity && (
                        <div className="text-xs text-brand-primary font-medium mt-0.5">
                          Qty: {item.quantity}
                        </div>
                      )}
                      {item.description && (
                        <div className="text-xs text-content-muted truncate max-w-xs mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-surface-muted text-content-secondary">
                        {item.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          item.urgency === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : item.urgency === 'HIGH'
                            ? 'bg-amber-100 text-amber-800'
                            : item.urgency === 'MEDIUM'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {item.urgency}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-content-muted font-mono text-xs">
                      {item.displayOrder}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(item)}
                        title="Click to toggle active status on homepage ticker"
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition ${
                          item.isActive
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {item.isActive ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-content-secondary hover:text-brand-primary hover:bg-surface-muted rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 text-content-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-surface rounded-2xl max-w-lg w-full border border-border shadow-elevated overflow-hidden animate-in fade-in">
            <div className="flex items-center justify-between p-5 border-b border-border bg-surface-muted/40">
              <h3 className="font-bold text-base text-content-primary">
                {editingId ? 'Edit NGO Requirement' : 'Add New NGO Requirement'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-content-muted hover:text-content-primary p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-content-secondary mb-1">
                  Title / Item Required <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 150 Notebook & Stationery Kits"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-content-secondary mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Education, Winter Relief"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-content-secondary mb-1">
                    Quantity / Target
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 150 Kits, 80 Sets"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-content-secondary mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition"
                  >
                    <option value="CRITICAL">CRITICAL (Immediate)</option>
                    <option value="HIGH">HIGH (This Month)</option>
                    <option value="MEDIUM">MEDIUM (Upcoming)</option>
                    <option value="LOW">LOW (Ongoing)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-content-secondary mb-1">
                    Display Priority Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-secondary mb-1">
                  Description / Details (Why & What is included)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. For children attending class daily. Each kit includes 4 single-line notebooks, pencils, eraser, scale, and crayons."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-primary border-border focus:ring-brand-primary"
                />
                <label htmlFor="isActiveCheck" className="text-sm font-medium text-content-primary cursor-pointer">
                  Active (Show on homepage live moving ticker and /needs list)
                </label>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-content-secondary hover:bg-surface-muted transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white transition shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingId ? 'Update Requirement' : 'Create Requirement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
