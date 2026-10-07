import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, RefreshCw, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';
import { 
  fetchImpactMetricsAdmin, 
  createImpactMetric, 
  updateImpactMetric, 
  deleteImpactMetric 
} from '../../services/api/impact';
import type { ImpactMetric } from '../../services/api/impact';

const INITIAL_FALLBACK_METRICS: ImpactMetric[] = [
  {
    id: 'seed-metric-1',
    value: 42,
    label: 'Children Supported',
    description: 'Guided and supported toward school admission and mainstream education.',
    displayOrder: 1,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'seed-metric-2',
    value: 35,
    label: 'Families Supported',
    description: 'Provided with portable bath tents, helping improve privacy, hygiene, and dignity.',
    displayOrder: 2,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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
  const [displayOrder, setDisplayOrder] = useState('1');
  const [isPublished, setIsPublished] = useState(true);
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const res = await fetchImpactMetricsAdmin();
      if (res?.data && res.data.length > 0) {
        setMetrics(res.data);
      } else {
        // If DB returned empty, populate with standard metrics
        setMetrics(INITIAL_FALLBACK_METRICS);
      }
      setError(null);
    } catch (err: any) {
      console.warn('API error loading admin metrics, using fallback metrics:', err);
      setMetrics(INITIAL_FALLBACK_METRICS);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickUpdate = async (id: string, newValue: number) => {
    if (newValue < 0) return;
    // Optimistic UI update
    setMetrics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, value: newValue } : m))
    );

    try {
      await updateImpactMetric(id, { value: newValue });
    } catch (err: any) {
      console.error('Failed to update value:', err);
      // If updating a fallback id that isn't in DB yet, create it
      const current = metrics.find((m) => m.id === id);
      if (current) {
        try {
          const created = await createImpactMetric({
            value: newValue,
            label: current.label,
            description: current.description,
            displayOrder: current.displayOrder,
            isPublished: current.isPublished,
          });
          setMetrics((prev) =>
            prev.map((m) => (m.id === id ? created.data : m))
          );
        } catch (cErr) {
          console.error(cErr);
        }
      }
    }
  };

  const handleTogglePublished = async (id: string, newStatus: boolean) => {
    setMetrics((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isPublished: newStatus } : m))
    );

    try {
      await updateImpactMetric(id, { isPublished: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setValue('');
    setLabel('');
    setDescription('');
    setDisplayOrder((metrics.length + 1).toString());
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
    if (!value || !label.trim()) {
      alert('Value (number) and Label are required.');
      return;
    }

    try {
      setSubmitting(true);
      const data = {
        value: parseInt(value, 10),
        label: label.trim(),
        description: description.trim() || undefined,
        displayOrder: parseInt(displayOrder, 10) || 0,
        isPublished,
      };

      if (editingId) {
        const res = await updateImpactMetric(editingId, data);
        setMetrics((prev) =>
          prev.map((m) => (m.id === editingId ? res.data : m))
        );
      } else {
        const res = await createImpactMetric(data);
        setMetrics((prev) => [...prev, res.data]);
      }
      
      setIsModalOpen(false);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to save metric.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, metricLabel: string) => {
    if (!window.confirm(`Are you sure you want to remove "${metricLabel}" from impact numbers?`)) return;
    
    try {
      setMetrics((prev) => prev.filter((m) => m.id !== id));
      await deleteImpactMetric(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-content-primary">Impact Numbers & Statistics</h1>
          <p className="text-sm text-content-secondary mt-1">
            Manage live numbers shown on the Homepage and /impact page. You can increase/decrease numbers anytime, add new sections, or edit titles.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover font-medium text-sm transition shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Impact Section</span>
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
            <span className="text-sm">Loading impact metrics...</span>
          </div>
        ) : metrics.length === 0 ? (
          <div className="py-16 text-center text-content-muted">
            <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No impact sections created yet.</p>
            <button
              onClick={openAddModal}
              className="mt-3 px-4 py-2 text-xs font-semibold bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition"
            >
              Add First Metric
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface-muted/60 text-content-secondary font-semibold border-b border-border text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-16">Order</th>
                  <th className="py-3.5 px-4">Number / Value</th>
                  <th className="py-3.5 px-4">Label & Description</th>
                  <th className="py-3.5 px-4">Visibility</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {metrics.map((metric) => (
                  <tr key={metric.id} className="hover:bg-surface-muted/30 transition-colors">
                    <td className="py-3.5 px-4 text-content-muted font-mono font-medium">
                      #{metric.displayOrder}
                    </td>

                    {/* Quick Stepper Value Controls */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickUpdate(metric.id, Math.max(0, metric.value - 1))}
                          className="w-7 h-7 rounded-md bg-surface-muted hover:bg-border text-content-primary flex items-center justify-center font-bold text-sm transition select-none cursor-pointer"
                          title="Decrease -1"
                        >
                          -
                        </button>
                        <span className="text-xl sm:text-2xl font-bold font-display text-brand-primary min-w-[3.5rem] text-center px-1">
                          {metric.value}+
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuickUpdate(metric.id, metric.value + 1)}
                          className="w-7 h-7 rounded-md bg-surface-muted hover:bg-border text-content-primary flex items-center justify-center font-bold text-sm transition select-none cursor-pointer"
                          title="Increase +1"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickUpdate(metric.id, metric.value + 10)}
                          className="px-2 h-7 rounded-md bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs font-bold transition select-none cursor-pointer ml-1"
                          title="Quick Add +10"
                        >
                          +10
                        </button>
                      </div>
                    </td>

                    {/* Label & Description */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-content-primary text-base">
                        {metric.label}
                      </div>
                      {metric.description && (
                        <div className="text-xs text-content-secondary mt-0.5 max-w-md leading-relaxed">
                          {metric.description}
                        </div>
                      )}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleTogglePublished(metric.id, !metric.isPublished)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                          metric.isPublished
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {metric.isPublished ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Live on Site</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Draft (Hidden)</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(metric)}
                          className="p-1.5 text-content-secondary hover:text-brand-primary hover:bg-surface-muted rounded-lg transition"
                          title="Edit Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(metric.id, metric.label)}
                          className="p-1.5 text-content-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete Metric"
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

      {/* Modal: Add or Edit Metric */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-surface rounded-2xl max-w-lg w-full border border-border shadow-elevated overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-border bg-surface-muted/40">
              <h3 className="font-bold text-base text-content-primary">
                {editingId ? 'Edit Impact Section' : 'Add New Impact Section'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-content-muted hover:text-content-primary p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-content-secondary mb-1">
                    Value / Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 42 or 2000"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition font-display font-bold text-lg"
                  />
                  <span className="text-[11px] text-content-muted mt-1 block">
                    (Note: &quot;+&quot; will be automatically shown on the website, e.g. {value ? `${value}+` : '42+'})
                  </span>
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
                  Section Title / Label <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Children Supported or Families Helped"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-content-secondary mb-1">
                  Description / Subtitle
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Guided and supported toward school admission and mainstream education."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPublishedCheck"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-primary border-border focus:ring-brand-primary"
                />
                <label htmlFor="isPublishedCheck" className="text-sm font-medium text-content-primary cursor-pointer">
                  Publish (Show on homepage live impact section)
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
                  {submitting ? 'Saving...' : editingId ? 'Update Section' : 'Create Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
