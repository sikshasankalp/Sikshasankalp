import { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, X, RefreshCw, AlertCircle, 
  Package, Eye, EyeOff, RotateCcw, Check, Sparkles, UploadCloud 
} from 'lucide-react';
import { 
  fetchNeedsAdmin, 
  createNeed, 
  updateNeed, 
  deleteNeed,
  seedNeeds
} from '../../services/api/need';
import type { NgoNeed } from '../../services/api/need';

// Hardcoded default requirements that match the ticker and screenshot
const DEFAULT_NEEDS_LIST: NgoNeed[] = [
  {
    id: 'f1',
    title: 'Notebook & Stationery Kits',
    quantity: '150 Kits',
    category: 'Education',
    urgency: 'HIGH',
    description: 'Ruled notebooks, pencil boxes, erasers, sharpeners, and scale sets for foundational literacy batches in open ground classrooms.',
    displayOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'f2',
    title: 'Winter Sweaters & Warm Wear',
    quantity: '80 Sets',
    category: 'Winter Relief',
    urgency: 'CRITICAL',
    description: 'Warm woollen sweaters and shoes to protect children learning in open-air ground classes during harsh winter months.',
    displayOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'f3',
    title: 'Refurbished Laptops for Computer Class',
    quantity: '3 Laptops',
    category: 'Digital Literacy',
    urgency: 'HIGH',
    description: 'Working laptops or Android tablets for digital library sessions, educational videos, and basic computer literacy.',
    displayOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'f4',
    title: 'Healthy Snack & Nutrition Packs',
    quantity: '200 Packs / Month',
    category: 'Nutrition',
    urgency: 'HIGH',
    description: 'Nutritious biscuits, fruits, and milk packets to ensure children study with energy and nutrition.',
    displayOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'f5',
    title: 'School Bags & Water Bottles',
    quantity: '60 Bags',
    category: 'Education',
    urgency: 'MEDIUM',
    description: 'Durable school bags for children transitioning from footpath classes to mainstream partner schools.',
    displayOrder: 5,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function NeedsManagement() {
  const [needs, setNeeds] = useState<NgoNeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NgoNeed | null>(null);

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
      if (data && data.length > 0) {
        setNeeds(data);
      } else {
        // If DB has no items yet, show defaults so admin can see and edit them immediately
        setNeeds(DEFAULT_NEEDS_LIST);
      }
      setError(null);
    } catch (err: any) {
      console.warn('Could not load live needs, using default items:', err);
      setNeeds(DEFAULT_NEEDS_LIST);
    } finally {
      setLoading(false);
    }
  };

  const hasUnsavedDefaults = needs.some((item) => item.id.startsWith('f'));

  const handleSaveAllToDatabase = async () => {
    try {
      setSubmitting(true);
      const seeded = await seedNeeds();
      if (seeded && seeded.length > 0) {
        setNeeds(seeded);
      } else {
        // Fallback individual creation
        const savedList: NgoNeed[] = [];
        for (const item of needs) {
          if (item.id.startsWith('f')) {
            const created = await createNeed({
              title: item.title,
              category: item.category || undefined,
              quantity: item.quantity || undefined,
              urgency: item.urgency,
              description: item.description || undefined,
              displayOrder: item.displayOrder,
              isActive: item.isActive,
            });
            savedList.push(created);
          } else {
            savedList.push(item);
          }
        }
        setNeeds(savedList);
      }
      setSuccessMsg('All items successfully synced & saved to live database!');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to sync items to database');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (!window.confirm('Reset all requirements to the 5 default items shown in the marquee ticker?')) {
      return;
    }

    try {
      setSubmitting(true);
      try {
        const seeded = await seedNeeds();
        setNeeds(seeded || DEFAULT_NEEDS_LIST);
      } catch {
        setNeeds(DEFAULT_NEEDS_LIST);
      }
      setSuccessMsg('Reset to default requirements successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setCategory('Education');
    setQuantity('');
    setUrgency('HIGH');
    setDescription('');
    setDisplayOrder((needs.length + 1).toString());
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (item: NgoNeed) => {
    setEditingItem(item);
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
    const newStatus = !item.isActive;
    // Optimistic UI update
    setNeeds((prev) => prev.map((n) => (n.id === item.id ? { ...n, isActive: newStatus } : n)));

    try {
      if (item.id.startsWith('f')) {
        // Save as real DB item with toggled status
        const created = await createNeed({
          title: item.title,
          category: item.category || undefined,
          quantity: item.quantity || undefined,
          urgency: item.urgency,
          description: item.description || undefined,
          displayOrder: item.displayOrder,
          isActive: newStatus,
        });
        setNeeds((prev) => prev.map((n) => (n.id === item.id ? created : n)));
      } else {
        await updateNeed(item.id, { isActive: newStatus });
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
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

      if (editingItem) {
        if (editingItem.id.startsWith('f')) {
          // Fallback item converted into real DB item
          try {
            const created = await createNeed(payload);
            setNeeds((prev) => prev.map((n) => (n.id === editingItem.id ? created : n)));
          } catch {
            setNeeds((prev) =>
              prev.map((n) =>
                n.id === editingItem.id ? { ...n, ...payload, updatedAt: new Date().toISOString() } : n
              )
            );
          }
        } else {
          // Real DB item update
          const updated = await updateNeed(editingItem.id, payload);
          setNeeds((prev) => prev.map((n) => (n.id === editingItem.id ? updated : n)));
        }
      } else {
        // Create new need
        try {
          const created = await createNeed(payload);
          setNeeds((prev) => [created, ...prev]);
        } catch {
          const mockNew: NgoNeed = {
            id: 'f-' + Date.now(),
            ...payload,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setNeeds((prev) => [mockNew, ...prev]);
        }
      }

      setIsModalOpen(false);
      setSuccessMsg('Requirement saved successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from requirements?`)) return;

    // Immediately remove from UI
    setNeeds((prev) => prev.filter((n) => n.id !== id));

    try {
      if (!id.startsWith('f')) {
        await deleteNeed(id);
      }
      setSuccessMsg(`"${name}" removed successfully.`);
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      console.error(err);
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
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleResetToDefaults}
            disabled={submitting}
            title="Reset requirements to the 5 default items"
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-surface border border-border/80 text-content-secondary hover:text-content-primary rounded-lg text-sm font-medium hover:bg-surface-muted transition shadow-xs"
          >
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover font-medium text-sm transition shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Need</span>
          </button>
        </div>
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

      {/* Defaults sync banner if applicable */}
      {hasUnsavedDefaults && (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 text-sm">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Live Display Active:</strong> The 5 items currently displayed on the website ticker are ready for you to edit, delete, or sync permanently to the database.
            </span>
          </div>
          <button
            onClick={handleSaveAllToDatabase}
            disabled={submitting}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white hover:bg-amber-700 rounded-lg text-xs font-semibold shrink-0 transition"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Sync All to DB</span>
          </button>
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
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-surface-muted text-content-secondary border border-border/50">
                        {item.category || 'General'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
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
                    <td className="py-3.5 px-4 text-content-secondary font-mono text-xs">
                      {item.displayOrder}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleActive(item)}
                        title={item.isActive ? 'Active (Click to hide from ticker)' : 'Hidden (Click to show in ticker)'}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                          item.isActive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
                        }`}
                      >
                        {item.isActive ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Active in Ticker</span>
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
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          title="Edit this item"
                          className="p-1.5 text-content-secondary hover:text-brand-primary hover:bg-surface-muted rounded-md transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          title="Delete this item"
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-content-primary/40 backdrop-blur-xs">
          <div className="bg-surface rounded-2xl border border-border shadow-elevated w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-display font-bold text-lg text-content-primary">
                {editingItem ? 'Edit Requirement' : 'Add New Requirement'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-content-muted hover:text-content-primary p-1 rounded-md transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-content-secondary mb-1.5">
                  Item / Requirement Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Winter Sweaters & Warm Wear"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-content-primary text-sm focus:border-brand-primary outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-content-secondary mb-1.5">
                    Quantity Needed
                  </label>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="e.g. 80 Sets or 3 Laptops"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-content-primary text-sm focus:border-brand-primary outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-content-secondary mb-1.5">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Winter Relief, Nutrition"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-content-primary text-sm focus:border-brand-primary outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-content-secondary mb-1.5">
                    Urgency Level
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-content-primary text-sm focus:border-brand-primary outline-none transition"
                  >
                    <option value="CRITICAL">CRITICAL (Red)</option>
                    <option value="HIGH">HIGH (Amber)</option>
                    <option value="MEDIUM">MEDIUM (Blue)</option>
                    <option value="LOW">LOW (Stone)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-content-secondary mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-content-primary text-sm focus:border-brand-primary outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-content-secondary mb-1.5">
                  Detailed Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional context about why this is needed and who it benefits..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-content-primary text-sm focus:border-brand-primary outline-none transition resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-brand-primary focus:ring-brand-primary w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-content-primary cursor-pointer select-none">
                  Display in live marquee ticker and /needs page
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-content-secondary hover:bg-surface-muted transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-brand-primary text-white rounded-lg text-sm font-medium hover:bg-brand-primary-hover transition shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
