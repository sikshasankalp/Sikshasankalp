import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import { fetchImpactMetricsAdmin, createImpactMetric, updateImpactMetric, deleteImpactMetric } from '../../services/api/impact';
import type { ImpactMetric } from '../../services/api/impact';

export default function ImpactManagement() {
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [value, setValue] = useState('');
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [isPublished, setIsPublished] = useState(true);
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetchImpactMetricsAdmin();
      setMetrics(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load impact metrics.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setValue('');
    setLabel('');
    setDescription('');
    setDisplayOrder('0');
    setIsPublished(true);
    setIsModalOpen(true);
  };

  const openEditModal = (metric: ImpactMetric) => {
    setEditingId(metric.id);
    setValue(metric.value.toString());
    setLabel(metric.label);
    setDescription(metric.description || '');
    setDisplayOrder(metric.displayOrder.toString());
    setIsPublished(metric.isPublished);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || !label) {
      alert('Value and Label are required.');
      return;
    }

    try {
      setSubmitting(true);
      const data = {
        value: parseInt(value, 10),
        label,
        description,
        displayOrder: parseInt(displayOrder, 10),
        isPublished,
      };

      if (editingId) {
        await updateImpactMetric(editingId, data);
      } else {
        await createImpactMetric(data);
      }
      
      setIsModalOpen(false);
      loadMetrics();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to save metric.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this impact metric?')) return;
    
    try {
      await deleteImpactMetric(id);
      loadMetrics();
    } catch (err) {
      console.error(err);
      alert('Failed to delete metric.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Impact Metrics Management</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Metric
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-error/10 text-error rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-muted border-b border-border">
              <th className="p-4 font-semibold text-content-primary w-24">Order</th>
              <th className="p-4 font-semibold text-content-primary w-32">Value</th>
              <th className="p-4 font-semibold text-content-primary">Label & Description</th>
              <th className="p-4 font-semibold text-content-primary">Status</th>
              <th className="p-4 font-semibold text-content-primary text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-content-secondary">Loading...</td>
              </tr>
            ) : metrics.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-content-secondary">No metrics found.</td>
              </tr>
            ) : (
              metrics.map((metric) => (
                <tr key={metric.id} className="border-b border-border last:border-0 hover:bg-surface-muted/50 transition-colors">
                  <td className="p-4 text-content-secondary font-medium">{metric.displayOrder}</td>
                  <td className="p-4">
                    <span className="text-2xl font-bold text-brand-primary">{metric.value}</span>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-content-primary mb-1">{metric.label}</p>
                    {metric.description && (
                      <p className="text-sm text-content-secondary">{metric.description}</p>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full w-max ${metric.isPublished ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                      {metric.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(metric)}
                        className="p-2 text-content-secondary hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(metric.id)}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg my-8">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Metric' : 'Add Metric'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-content-secondary hover:text-content-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-content-primary mb-1">Value (Number) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                  placeholder="e.g. 42"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-content-primary mb-1">Label *</label>
                <input
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                  placeholder="e.g. Children Supported"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-content-primary mb-1">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none"
                  placeholder="e.g. Guided and supported toward school admission..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-content-primary mb-1">Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
              </div>

              <div className="flex gap-8 py-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${isPublished ? 'bg-brand-primary' : 'bg-border'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isPublished ? 'translate-x-4' : ''}`}></div>
                  </div>
                  <span className="text-sm font-medium text-content-primary">Published (Publicly Visible)</span>
                </label>
              </div>

              <div className="mt-4 flex justify-end gap-3 pt-6 border-t border-border">
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
                  {editingId ? 'Save Changes' : 'Add Metric'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
