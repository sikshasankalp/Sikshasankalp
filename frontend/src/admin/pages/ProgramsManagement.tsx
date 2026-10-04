import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProgramsAdmin, createProgram, updateProgram, deleteProgram } from '../../services/api/program';
import type { Program } from '../../services/api/program';

export default function ProgramsManagement() {
  const [programs, setPrograms] = useState<Program[]>([]);
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
  const [slug, setSlug] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState('0');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const res = await fetchProgramsAdmin({ page, limit });
      setPrograms(res.data);
      if (res.meta) {
        setMeta(res.meta);
      }
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load programs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, [page, limit]);

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setShortDescription('');
    setDescription('');
    setDisplayOrder('0');
    setIsFeatured(false);
    setIsPublished(true);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const openEditModal = (program: Program) => {
    setEditingId(program.id);
    setTitle(program.title);
    setSlug(program.slug);
    setShortDescription(program.shortDescription || '');
    setDescription(program.description || '');
    setDisplayOrder(program.displayOrder.toString());
    setIsFeatured(program.isFeatured);
    setIsPublished(program.isPublished);
    setSelectedFile(null);
    setPreviewUrl(program.imageUrl || null);
    setIsModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) {
      alert('Title and Slug are required.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      if (shortDescription) formData.append('shortDescription', shortDescription);
      if (description) formData.append('description', description);
      formData.append('displayOrder', displayOrder);
      formData.append('isFeatured', String(isFeatured));
      formData.append('isPublished', String(isPublished));

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      if (editingId) {
        await updateProgram(editingId, formData);
      } else {
        await createProgram(formData);
      }
      
      setIsModalOpen(false);
      loadPrograms();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to save program.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this program?')) return;
    
    try {
      await deleteProgram(id);
      loadPrograms();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to delete program.');
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Programs Management</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Program
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
                <th className="p-4 font-semibold text-content-primary">Image</th>
                <th className="p-4 font-semibold text-content-primary">Title</th>
                <th className="p-4 font-semibold text-content-primary">Slug</th>
                <th className="p-4 font-semibold text-content-primary">Status</th>
                <th className="p-4 font-semibold text-content-primary">Order</th>
                <th className="p-4 font-semibold text-content-primary text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-content-secondary">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
                      <span>Loading programs...</span>
                    </div>
                  </td>
                </tr>
              ) : programs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-content-secondary">No programs found.</td>
                </tr>
              ) : (
                programs.map((program) => (
                  <tr key={program.id} className="border-b border-border last:border-0 hover:bg-surface-muted/50 transition-colors">
                    <td className="p-4">
                      <div className="w-16 h-12 rounded overflow-hidden bg-surface-muted border border-border flex items-center justify-center">
                        {program.imageUrl ? (
                          <img src={program.imageUrl} alt={program.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-content-muted" />
                        )}
                      </div>
                    </td>
                    <td className="p-4 font-medium max-w-[200px] truncate" title={program.title}>{program.title}</td>
                    <td className="p-4 text-content-secondary font-mono text-sm max-w-[150px] truncate" title={program.slug}>{program.slug}</td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full w-max uppercase tracking-wider font-bold ${program.isPublished ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                          {program.isPublished ? 'Published' : 'Draft'}
                        </span>
                        {program.isFeatured && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full w-max uppercase tracking-wider font-bold bg-brand-primary/10 text-brand-primary">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">{program.displayOrder}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(program)}
                          className="p-2 text-content-secondary hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(program.id)}
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
              <h2 className="text-xl font-bold">{editingId ? 'Edit Program' : 'Add Program'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-content-secondary hover:text-content-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-content-primary mb-2">Program Image</label>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-24 shrink-0 rounded-lg overflow-hidden bg-surface-muted border border-border">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-content-secondary gap-2">
                          <ImageIcon className="w-6 h-6" />
                          <span className="text-[10px]">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface-muted transition-colors w-max"
                      >
                        Select Image
                      </button>
                      <p className="text-xs text-content-secondary max-w-[300px]">
                        Recommended size: 1200x800px. JPG, PNG or WebP. Max 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-content-primary mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingId) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                      }
                    }}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    placeholder="Program Title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-content-primary mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary font-mono text-sm"
                    placeholder="program-slug"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-content-primary mb-1">Short Description</label>
                  <textarea
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none"
                    placeholder="A brief summary for cards and lists"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-content-primary mb-1">Full Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-y"
                    placeholder="Detailed program description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-content-primary mb-1">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
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

                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" className="sr-only" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                      <div className={`block w-10 h-6 rounded-full transition-colors ${isFeatured ? 'bg-brand-primary' : 'bg-border'}`}></div>
                      <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isFeatured ? 'translate-x-4' : ''}`}></div>
                    </div>
                    <span className="text-sm font-medium text-content-primary">Featured</span>
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
                  {editingId ? 'Save Changes' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
