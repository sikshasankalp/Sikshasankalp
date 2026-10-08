import { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, X, RefreshCw, AlertCircle, Eye, EyeOff, Sparkles, 
  RotateCcw, Check, HeartHandshake, Smartphone 
} from 'lucide-react';
import { 
  fetchImpactMetricsAdmin, 
  createImpactMetric, 
  updateImpactMetric, 
  deleteImpactMetric 
} from '../../services/api/impact';
import type { ImpactMetric } from '../../services/api/impact';
import {
  fetchBenefitsAdmin,
  createBenefit,
  updateBenefit,
  deleteBenefit,
  seedBenefits,
} from '../../services/api/benefit';
import type { SupportBenefit } from '../../services/api/benefit';

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

const INITIAL_FALLBACK_BENEFITS: SupportBenefit[] = [
  { id: 'b1', title: 'Foundational Education & Learning', displayOrder: 1, isActive: true },
  { id: 'b2', title: 'School Admission & Transition Support', displayOrder: 2, isActive: true },
  { id: 'b3', title: 'Essential Educational Materials', displayOrder: 3, isActive: true },
  { id: 'b4', title: 'Free Digital Siksha & Library Access', displayOrder: 4, isActive: true },
  { id: 'b5', title: 'Health Checkups & Hygiene Initiatives', displayOrder: 5, isActive: true },
  { id: 'b6', title: 'Direct Family & Community Support', displayOrder: 6, isActive: true },
];

export default function ImpactManagement() {
  const [activeTab, setActiveTab] = useState<'metrics' | 'benefits'>('benefits');

  // --- TAB 1: Metrics State ---
  const [metrics, setMetrics] = useState<ImpactMetric[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
  const [editingMetricId, setEditingMetricId] = useState<string | null>(null);
  const [metricValue, setMetricValue] = useState('');
  const [metricLabel, setMetricLabel] = useState('');
  const [metricDescription, setMetricDescription] = useState('');
  const [metricOrder, setMetricOrder] = useState('1');
  const [metricPublished, setMetricPublished] = useState(true);

  // --- TAB 2: Benefits State ("What Your Support Enables") ---
  const [benefits, setBenefits] = useState<SupportBenefit[]>([]);
  const [loadingBenefits, setLoadingBenefits] = useState(true);
  const [isBenefitModalOpen, setIsBenefitModalOpen] = useState(false);
  const [editingBenefit, setEditingBenefit] = useState<SupportBenefit | null>(null);
  const [benefitTitle, setBenefitTitle] = useState('');
  const [benefitOrder, setBenefitOrder] = useState('1');
  const [benefitActive, setBenefitActive] = useState(true);

  // Common UI State
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMetrics();
    loadBenefits();
  }, []);

  // --- LOAD METRICS ---
  const loadMetrics = async () => {
    try {
      setLoadingMetrics(true);
      const res = await fetchImpactMetricsAdmin();
      if (res?.data && res.data.length > 0) {
        setMetrics(res.data);
      } else {
        setMetrics(INITIAL_FALLBACK_METRICS);
      }
      setError(null);
    } catch (err: any) {
      console.warn('API error loading admin metrics, using fallback metrics:', err);
      setMetrics(INITIAL_FALLBACK_METRICS);
    } finally {
      setLoadingMetrics(false);
    }
  };

  // --- LOAD BENEFITS ---
  const loadBenefits = async () => {
    try {
      setLoadingBenefits(true);
      const data = await fetchBenefitsAdmin();
      if (data && data.length > 0) {
        setBenefits(data);
      } else {
        setBenefits(INITIAL_FALLBACK_BENEFITS);
      }
      setError(null);
    } catch (err: any) {
      console.warn('API error loading benefits, using defaults:', err);
      setBenefits(INITIAL_FALLBACK_BENEFITS);
      setError(err?.message || null);
    } finally {
      setLoadingBenefits(false);
    }
  };

  // --- METRIC HANDLERS ---
  const handleQuickUpdateMetric = async (id: string, newValue: number) => {
    if (newValue < 0) return;
    setMetrics((prev) => prev.map((m) => (m.id === id ? { ...m, value: newValue } : m)));
    try {
      await updateImpactMetric(id, { value: newValue });
    } catch (err: any) {
      console.error('Failed to update value:', err);
    }
  };

  const handleToggleMetricPublished = async (id: string, newStatus: boolean) => {
    setMetrics((prev) => prev.map((m) => (m.id === id ? { ...m, isPublished: newStatus } : m)));
    try {
      await updateImpactMetric(id, { isPublished: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  const openAddMetricModal = () => {
    setEditingMetricId(null);
    setMetricValue('');
    setMetricLabel('');
    setMetricDescription('');
    setMetricOrder((metrics.length + 1).toString());
    setMetricPublished(true);
    setIsMetricModalOpen(true);
  };

  const openEditMetricModal = (metric: ImpactMetric) => {
    setEditingMetricId(metric.id);
    setMetricValue(metric.value.toString());
    setMetricLabel(metric.label);
    setMetricDescription(metric.description || '');
    setMetricOrder(metric.displayOrder.toString());
    setMetricPublished(metric.isPublished);
    setIsMetricModalOpen(true);
  };

  const handleSubmitMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!metricValue || !metricLabel.trim()) {
      alert('Value and Label are required.');
      return;
    }

    try {
      setSubmitting(true);
      const data = {
        value: parseInt(metricValue, 10),
        label: metricLabel.trim(),
        description: metricDescription.trim() || undefined,
        displayOrder: parseInt(metricOrder, 10) || 0,
        isPublished: metricPublished,
      };

      if (editingMetricId) {
        const res = await updateImpactMetric(editingMetricId, data);
        setMetrics((prev) => prev.map((m) => (m.id === editingMetricId ? res.data : m)));
      } else {
        const res = await createImpactMetric(data);
        setMetrics((prev) => [...prev, res.data]);
      }
      setIsMetricModalOpen(false);
      setSuccessMsg('Impact metric saved successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMetric = async (id: string, label: string) => {
    if (!window.confirm(`Delete metric "${label}"?`)) return;
    setMetrics((prev) => prev.filter((m) => m.id !== id));
    try {
      await deleteImpactMetric(id);
      setSuccessMsg(`Metric "${label}" deleted.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  // --- BENEFITS HANDLERS ("What Your Support Enables") ---
  const openAddBenefitModal = () => {
    setEditingBenefit(null);
    setBenefitTitle('');
    setBenefitOrder((benefits.length + 1).toString());
    setBenefitActive(true);
    setIsBenefitModalOpen(true);
  };

  const openEditBenefitModal = (item: SupportBenefit) => {
    setEditingBenefit(item);
    setBenefitTitle(item.title);
    setBenefitOrder(item.displayOrder.toString());
    setBenefitActive(item.isActive);
    setIsBenefitModalOpen(true);
  };

  const handleToggleBenefitActive = async (item: SupportBenefit) => {
    const newStatus = !item.isActive;
    setBenefits((prev) => prev.map((b) => (b.id === item.id ? { ...b, isActive: newStatus } : b)));
    try {
      if (item.id.startsWith('b')) {
        const created = await createBenefit({
          title: item.title,
          displayOrder: item.displayOrder,
          isActive: newStatus,
        });
        setBenefits((prev) => prev.map((b) => (b.id === item.id ? created : b)));
      } else {
        await updateBenefit(item.id, { isActive: newStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitBenefit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!benefitTitle.trim()) {
      alert('Benefit Title / Point is required.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: benefitTitle.trim(),
        displayOrder: parseInt(benefitOrder, 10) || 0,
        isActive: benefitActive,
      };

      if (editingBenefit) {
        if (editingBenefit.id.startsWith('b')) {
          try {
            const created = await createBenefit(payload);
            setBenefits((prev) => prev.map((b) => (b.id === editingBenefit.id ? created : b)));
          } catch {
            setBenefits((prev) =>
              prev.map((b) => (b.id === editingBenefit.id ? { ...b, ...payload } : b))
            );
          }
        } else {
          const updated = await updateBenefit(editingBenefit.id, payload);
          setBenefits((prev) => prev.map((b) => (b.id === editingBenefit.id ? updated : b)));
        }
      } else {
        try {
          const created = await createBenefit(payload);
          setBenefits((prev) => [...prev, created]);
        } catch {
          const mockNew: SupportBenefit = {
            id: 'b-' + Date.now(),
            ...payload,
          };
          setBenefits((prev) => [...prev, mockNew]);
        }
      }

      setIsBenefitModalOpen(false);
      setSuccessMsg('Benefit point saved successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBenefit = async (id: string, title: string) => {
    if (!window.confirm(`Delete benefit point: "${title}"?`)) return;
    setBenefits((prev) => prev.filter((b) => b.id !== id));
    try {
      if (!id.startsWith('b')) {
        await deleteBenefit(id);
      }
      setSuccessMsg(`"${title}" removed from donation points.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetDefaultBenefits = async () => {
    if (!window.confirm('Reset "What Your Support Enables" to the 6 default benefit points?')) return;
    try {
      setSubmitting(true);
      try {
        const seeded = await seedBenefits();
        setBenefits(seeded || INITIAL_FALLBACK_BENEFITS);
      } catch {
        setBenefits(INITIAL_FALLBACK_BENEFITS);
      }
      setSuccessMsg('Reset to 6 default benefit points successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-content-primary">
            Impact & Support Management
          </h1>
          <p className="text-sm text-content-secondary mt-1">
            Manage live numbers, counters, and the &quot;What Your Support Enables&quot; benefits points displayed on the donation page.
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-2">
        <button
          onClick={() => setActiveTab('benefits')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'benefits'
              ? 'bg-brand-primary text-white shadow-xs'
              : 'text-content-secondary hover:bg-surface hover:text-content-primary'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>What Your Support Enables ({benefits.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
            activeTab === 'metrics'
              ? 'bg-brand-primary text-white shadow-xs'
              : 'text-content-secondary hover:bg-surface hover:text-content-primary'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Live Counters & Numbers ({metrics.length})</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-2 shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: WHAT YOUR SUPPORT ENABLES (BENEFIT POINTS)                          */}
      {/* ========================================================================= */}
      {activeTab === 'benefits' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-surface p-4 rounded-xl border border-border">
            <div>
              <h2 className="font-bold text-base text-content-primary flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-brand-primary" />
                <span>&quot;What Your Support Enables&quot; Donation Benefits List</span>
              </h2>
              <p className="text-xs text-content-secondary mt-0.5">
                These benefit points appear in the mobile unified card on the <code className="bg-surface-muted px-1.5 py-0.5 rounded text-brand-primary">/donate</code> page. Add, edit, reorder or delete points.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetDefaultBenefits}
                disabled={submitting}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface-muted hover:bg-border/60 text-content-secondary hover:text-content-primary rounded-lg text-xs font-medium transition cursor-pointer"
                title="Reset to 6 default benefit items"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>
              <button
                onClick={openAddBenefitModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Benefit Point</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Editable List Table */}
            <div className="lg:col-span-2 bg-surface rounded-xl border border-border shadow-soft overflow-hidden">
              {loadingBenefits ? (
                <div className="py-20 flex flex-col items-center justify-center text-content-muted">
                  <RefreshCw className="w-6 h-6 animate-spin text-brand-primary mb-2" />
                  <span className="text-sm">Loading benefit points...</span>
                </div>
              ) : benefits.length === 0 ? (
                <div className="py-16 text-center text-content-muted">
                  <HeartHandshake className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">No benefit points found.</p>
                  <button
                    onClick={openAddBenefitModal}
                    className="mt-3 px-4 py-2 text-xs font-semibold bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition"
                  >
                    Add First Point
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-muted/60 text-content-secondary font-semibold border-b border-border text-xs uppercase tracking-wider">
                      <tr>
                        <th className="py-3.5 px-4 w-16">Order</th>
                        <th className="py-3.5 px-4">Benefit Point Text</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {benefits.map((item) => (
                        <tr key={item.id} className="hover:bg-surface-muted/30 transition-colors">
                          <td className="py-3.5 px-4 text-content-muted font-mono font-medium">
                            #{item.displayOrder}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <span className="w-2 h-2 rounded-full bg-brand-primary shrink-0 opacity-80" />
                              <span className="font-semibold text-content-primary text-sm leading-snug">
                                {item.title}
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleBenefitActive(item)}
                              title={item.isActive ? 'Active (Visible on /donate)' : 'Hidden (Not shown)'}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                                item.isActive
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
                              }`}
                            >
                              {item.isActive ? (
                                <>
                                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Shown</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3.5 h-3.5 text-stone-400" />
                                  <span>Hidden</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditBenefitModal(item)}
                                title="Edit point"
                                className="p-1.5 text-content-secondary hover:text-brand-primary hover:bg-surface-muted rounded-md transition"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBenefit(item.id, item.title)}
                                title="Delete point"
                                className="p-1.5 text-content-secondary hover:text-red-600 hover:bg-red-50 rounded-md transition"
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

            {/* Right 1 Col: Live Card Mockup Preview */}
            <div className="bg-[#F6F1E8] rounded-[24px] border border-[#E8DFCFC0] p-5 sm:p-6 shadow-soft flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DFCFC0] mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-content-secondary flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-brand-primary" />
                  Live Mobile View Preview
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border/60 text-content-muted">
                  /donate
                </span>
              </div>

              <div className="text-center font-display font-extrabold text-base text-content-primary mb-4">
                What Your Support Enables
              </div>

              <div className="space-y-3.5 flex-1">
                {benefits
                  .filter((b) => b.isActive)
                  .map((b) => (
                    <div
                      key={b.id}
                      className="flex items-start gap-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C87055] shrink-0 mt-1" />
                      <span className="text-xs font-semibold text-content-primary/90 leading-snug">
                        {b.title}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: LIVE COUNTERS & NUMBERS                                             */}
      {/* ========================================================================= */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-surface p-4 rounded-xl border border-border">
            <div>
              <h2 className="font-bold text-base text-content-primary flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>Live Impact Counters & Metrics</span>
              </h2>
              <p className="text-xs text-content-secondary mt-0.5">
                Update the numbers displayed with count-up animations on the Homepage and Impact page.
              </p>
            </div>
            <button
              onClick={openAddMetricModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg text-xs font-semibold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Metric</span>
            </button>
          </div>

          <div className="bg-surface rounded-xl border border-border shadow-soft overflow-hidden">
            {loadingMetrics ? (
              <div className="py-20 flex flex-col items-center justify-center text-content-muted">
                <RefreshCw className="w-6 h-6 animate-spin text-brand-primary mb-2" />
                <span className="text-sm">Loading impact metrics...</span>
              </div>
            ) : metrics.length === 0 ? (
              <div className="py-16 text-center text-content-muted">
                <Sparkles className="w-10 h-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">No impact sections created yet.</p>
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
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleQuickUpdateMetric(metric.id, Math.max(0, metric.value - 1))}
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
                              onClick={() => handleQuickUpdateMetric(metric.id, metric.value + 1)}
                              className="w-7 h-7 rounded-md bg-surface-muted hover:bg-border text-content-primary flex items-center justify-center font-bold text-sm transition select-none cursor-pointer"
                              title="Increase +1"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => handleQuickUpdateMetric(metric.id, metric.value + 10)}
                              className="px-2 h-7 rounded-md bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary text-xs font-bold transition select-none cursor-pointer ml-1"
                              title="Quick Add +10"
                            >
                              +10
                            </button>
                          </div>
                        </td>
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
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleMetricPublished(metric.id, !metric.isPublished)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                              metric.isPublished
                                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }`}
                          >
                            {metric.isPublished ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-stone-400" />}
                            <span>{metric.isPublished ? 'Published' : 'Hidden'}</span>
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditMetricModal(metric)}
                              className="p-1.5 text-content-secondary hover:text-brand-primary hover:bg-surface-muted rounded-md transition"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMetric(metric.id, metric.label)}
                              className="p-1.5 text-content-secondary hover:text-red-600 hover:bg-red-50 rounded-md transition"
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
        </div>
      )}

      {/* ========================================================================= */}
      {/* BENEFIT POINT MODAL                                                       */}
      {/* ========================================================================= */}
      {isBenefitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-content-primary/40 backdrop-blur-xs">
          <div className="bg-surface rounded-2xl border border-border shadow-elevated w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-display font-bold text-lg text-content-primary">
                {editingBenefit ? 'Edit Benefit Point' : 'Add New Benefit Point'}
              </h3>
              <button
                onClick={() => setIsBenefitModalOpen(false)}
                className="text-content-muted hover:text-content-primary p-1 rounded-md transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitBenefit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-content-secondary mb-1.5">
                  Benefit Title / Description *
                </label>
                <input
                  type="text"
                  required
                  value={benefitTitle}
                  onChange={(e) => setBenefitTitle(e.target.value)}
                  placeholder="e.g. Free Digital Siksha & Library Access"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-content-primary text-sm focus:border-brand-primary outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-content-secondary mb-1.5">
                  Display Order Priority
                </label>
                <input
                  type="number"
                  value={benefitOrder}
                  onChange={(e) => setBenefitOrder(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-content-primary text-sm focus:border-brand-primary outline-none transition"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="benefitActiveCheck"
                  checked={benefitActive}
                  onChange={(e) => setBenefitActive(e.target.checked)}
                  className="rounded text-brand-primary focus:ring-brand-primary w-4 h-4 cursor-pointer"
                />
                <label htmlFor="benefitActiveCheck" className="text-sm font-medium text-content-primary cursor-pointer select-none">
                  Display this point on /donate mobile card
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsBenefitModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-content-secondary hover:bg-surface-muted transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary-hover transition shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingBenefit ? 'Update Point' : 'Add Point'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* METRIC MODAL                                                              */}
      {/* ========================================================================= */}
      {isMetricModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-content-primary/40 backdrop-blur-xs">
          <div className="bg-surface rounded-2xl border border-border shadow-elevated w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-bold text-base text-content-primary">
                {editingMetricId ? 'Edit Impact Section' : 'Add New Impact Section'}
              </h3>
              <button
                onClick={() => setIsMetricModalOpen(false)}
                className="text-content-muted hover:text-content-primary p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitMetric} className="p-6 space-y-4">
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
                    value={metricValue}
                    onChange={(e) => setMetricValue(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition font-display font-bold text-lg"
                  />
                  <span className="text-[11px] text-content-muted mt-1 block">
                    (&quot;+&quot; is automatically appended, e.g. {metricValue ? `${metricValue}+` : '42+'})
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-content-secondary mb-1">
                    Display Priority Order
                  </label>
                  <input
                    type="number"
                    value={metricOrder}
                    onChange={(e) => setMetricOrder(e.target.value)}
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
                  placeholder="e.g. Children Supported"
                  value={metricLabel}
                  onChange={(e) => setMetricLabel(e.target.value)}
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
                  value={metricDescription}
                  onChange={(e) => setMetricDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface rounded-lg border border-border focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none transition"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPublishedCheck"
                  checked={metricPublished}
                  onChange={(e) => setMetricPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-primary border-border focus:ring-brand-primary"
                />
                <label htmlFor="isPublishedCheck" className="text-sm font-medium text-content-primary cursor-pointer select-none">
                  Publish (Show on homepage live impact section)
                </label>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsMetricModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-content-secondary hover:bg-surface-muted transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg text-sm font-semibold bg-brand-primary hover:bg-brand-primary-hover text-white transition shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingMetricId ? 'Update Section' : 'Create Section'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
