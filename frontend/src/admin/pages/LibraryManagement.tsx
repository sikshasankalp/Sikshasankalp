import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, X, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { fetchLibraryAdmin, createLibraryResource, updateLibraryResource, deleteLibraryResource } from '../../services/api/library';
import type { LibraryResource } from '../../services/api/library';

const LIBRARY_CATEGORIES = [
  { value: 'NCERT_BOOK', label: 'NCERT Book' },
  { value: 'NOTES', label: 'Notes' },
  { value: 'STUDY_MATERIAL', label: 'Study Material' },
  { value: 'EDUCATIONAL_VIDEO', label: 'Educational Video' },
  { value: 'PDF', label: 'PDF' },
  { value: 'DIGITAL_LEARNING', label: 'Digital Learning' },
  { value: 'COMPETITIVE_EXAM', label: 'Competitive Exam' },
  { value: 'OTHER', label: 'Other' },
];

export default function LibraryManagement() {
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(LIBRARY_CATEGORIES[0].value);
  const [fileUrl, setFileUrl] = useState('');
  const [fileType, setFileType] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      setLoading(true);
      const res = await fetchLibraryAdmin({ limit: 100 });
      setResources(res.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to load library resources.');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setCategory(LIBRARY_CATEGORIES[0].value);
    setFileUrl('');
    setFileType('');
    setFileSize('');
    setIsPublished(true);
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsModalOpen(true);
  };

  const openEditModal = (resource: LibraryResource) => {
    setEditingId(resource.id);
    setTitle(resource.title);
    setDescription(resource.description || '');
    setCategory(resource.category || LIBRARY_CATEGORIES[0].value);
    setFileUrl(resource.fileUrl);
    setFileType(resource.fileType || '');
    setFileSize(resource.fileSize ? resource.fileSize.toString() : '');
    setIsPublished(resource.isPublished);
    setSelectedFile(null);
    setPreviewUrl(resource.thumbnailUrl || null);
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
    if (!title || !fileUrl) {
      alert('Title and Resource URL are required.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('fileUrl', fileUrl);
      if (description) formData.append('description', description);
      if (fileType) formData.append('fileType', fileType);
      if (fileSize) formData.append('fileSize', fileSize);
      formData.append('isPublished', String(isPublished));

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      if (editingId) {
        await updateLibraryResource(editingId, formData);
      } else {
        await createLibraryResource(formData);
      }
      
      setIsModalOpen(false);
      loadResources();
    } catch (err: any) {
      console.error(err);
      alert(err?.message || 'Failed to save resource.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      await deleteLibraryResource(id);
      loadResources();
    } catch (err) {
      console.error(err);
      alert('Failed to delete resource.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Digital Library Management</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Resource
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
              <th className="p-4 font-semibold text-content-primary w-24">Thumbnail</th>
              <th className="p-4 font-semibold text-content-primary">Title & Category</th>
              <th className="p-4 font-semibold text-content-primary">Resource Link</th>
              <th className="p-4 font-semibold text-content-primary">Status</th>
              <th className="p-4 font-semibold text-content-primary text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-content-secondary">Loading...</td>
              </tr>
            ) : resources.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-content-secondary">No resources found.</td>
              </tr>
            ) : (
              resources.map((resource) => (
                <tr key={resource.id} className="border-b border-border last:border-0 hover:bg-surface-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="w-16 h-16 rounded overflow-hidden bg-surface-muted border border-border flex items-center justify-center">
                      {resource.thumbnailUrl ? (
                        <img src={resource.thumbnailUrl} alt={resource.title} className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="w-6 h-6 text-content-secondary/50" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-medium text-content-primary mb-1">{resource.title}</p>
                    <span className="text-xs px-2 py-1 bg-surface-muted border border-border rounded-md text-content-secondary">
                      {LIBRARY_CATEGORIES.find(c => c.value === resource.category)?.label || resource.category || 'Uncategorized'}
                    </span>
                  </td>
                  <td className="p-4">
                    <a 
                      href={resource.fileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-brand-primary hover:underline text-sm flex items-center gap-1 w-max max-w-[200px] truncate"
                      title={resource.fileUrl}
                    >
                      <ExternalLink className="w-3 h-3 shrink-0" />
                      <span className="truncate">{resource.fileUrl}</span>
                    </a>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full w-max ${resource.isPublished ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                      {resource.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(resource)}
                        className="p-2 text-content-secondary hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(resource.id)}
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Resource' : 'Add Resource'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-content-secondary hover:text-content-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Thumbnail Upload Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-content-primary mb-2">Thumbnail Image (Optional)</label>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-32 shrink-0 rounded-xl overflow-hidden bg-surface-muted border border-border">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-content-secondary gap-2">
                          <ImageIcon className="w-8 h-8" />
                          <span className="text-xs">No image</span>
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
                        className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-surface-muted transition-colors"
                      >
                        Select Thumbnail
                      </button>
                      <p className="text-xs text-content-secondary max-w-[200px]">
                        Recommended size: 800x600px. JPG, PNG or WebP. Max 5MB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-content-primary mb-1">Resource Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    placeholder="e.g. NCERT Science Book Class 10"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-content-primary mb-1">Resource URL / Link *</label>
                  <input
                    type="url"
                    required
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    placeholder="https://..."
                  />
                  <p className="text-xs text-content-secondary mt-1">Link to Google Drive, YouTube, external PDF, or any educational resource.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-content-primary mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white"
                  >
                    {LIBRARY_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-content-primary mb-1">File Type (Optional)</label>
                  <input
                    type="text"
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                    placeholder="e.g. PDF, MP4, Website"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-content-primary mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary resize-none"
                    placeholder="Brief description of the resource"
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
                    <span className="text-sm font-medium text-content-primary">Published (Publicly Visible)</span>
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
                  {editingId ? 'Save Changes' : 'Add Resource'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
