import React, { useEffect, useState } from 'react';
import { fetchGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem } from '../../services/api/gallery';
import type { GalleryItem } from '../../services/api/gallery';
import { fetchMedia, createMediaItem, updateMediaItem, deleteMediaItem } from '../../services/api/media';
import type { MediaCoverageItem } from '../../services/api/media';
import { Plus, Edit2, Trash2, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';

type UnifiedMedia = {
  id: string;
  type: 'IMAGE' | 'EXTERNAL_ARTICLE';
  title: string;
  thumbnailUrl: string;
  category: string;
  displayLocation: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  original: GalleryItem | MediaCoverageItem;
};

export const DISPLAY_LOCATIONS = [
  { value: 'HOME_HERO', label: 'Homepage – Main Hero' },
  { value: 'HOME_IMPACT', label: 'Homepage – Photo Story 1 Large (Children Learning)' },
  { value: 'HOME_PROGRAMS', label: 'Homepage – Photo Story 2 Small (School Admission)' },
  { value: 'HOME_FAMILY', label: 'Homepage – Photo Story 3 Small (Family Support)' },
  { value: 'HOME_MEDIA', label: 'Homepage – Media Coverage Screenshots' },
  { value: 'HOME_LIBRARY', label: 'Homepage – Digital Library Section' },
  { value: 'STORY_MAIN', label: 'Homepage Teaser & Our Story – Main Hero Photo' },
  { value: 'STORY_TIMELINE', label: 'Our Story – Timeline Milestones' },
  { value: 'ABOUT_MAIN', label: 'About Us – Main Hero' },
  { value: 'PROGRAMS', label: 'Programs – Main Hero' },
  { value: 'PROGRAMS_FEATURED', label: 'Programs – Featured Card (Digital Siksha)' },
  { value: 'IMPACT', label: 'Impact – Main Hero' },
  { value: 'IMPACT_STORIES', label: 'Impact – Beneficiary Real Photo' },
  { value: 'IMPACT_EDUCATION', label: 'Impact – Education Real Photo' },
  { value: 'DIGITAL_LIBRARY', label: 'Digital Library – Main Hero' },
  { value: 'GALLERY', label: 'Gallery Page – Main Hero' },
  { value: 'PARTNER', label: 'Partner With Us – Main Hero' },
  { value: 'VOLUNTEER', label: 'Get Involved / Volunteers – Main Hero' },
  { value: 'TRANSPARENCY', label: 'Transparency – Main Hero' },
  { value: 'TEAM', label: 'Team Page – Main Hero Photo' },
  { value: 'CONTACT', label: 'Contact Us – Main Hero Photo' },
  { value: 'DONATE', label: 'Donate Page – Hero Photo' },
  { value: 'MEDIA_HERO', label: 'Media Page – Main Hero Photo' },
  { value: 'MEDIA_COVERAGE', label: 'Media Page – Press Coverage' }
];

export default function MediaManagement() {
  const [mediaList, setMediaList] = useState<UnifiedMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UnifiedMedia | null>(null);

  // Form State
  const [type, setType] = useState<'IMAGE' | 'EXTERNAL_ARTICLE'>('IMAGE');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [externalUrl, setExternalUrl] = useState('');
  const [publication, setPublication] = useState('');
  const [category, setCategory] = useState('');
  const [displayLocation, setDisplayLocation] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadMedia = async () => {
    setIsLoading(true);
    try {
      const [galleries, medias] = await Promise.all([
        fetchGallery({ admin: true }),
        fetchMedia({ admin: true })
      ]);

      const unified: UnifiedMedia[] = [
        ...galleries.map(g => ({
          id: g.id,
          type: 'IMAGE' as const,
          title: g.title || 'Untitled Image',
          thumbnailUrl: g.imageUrl,
          category: g.category || '',
          displayLocation: g.displayLocation || '',
          isPublished: g.isPublished,
          isFeatured: g.isFeatured,
          createdAt: g.createdAt,
          original: g
        })),
        ...medias.map(m => ({
          id: m.id,
          type: 'EXTERNAL_ARTICLE' as const,
          title: m.title,
          thumbnailUrl: m.thumbnailUrl || m.externalUrl,
          category: m.category || '',
          displayLocation: m.displayLocation || '',
          isPublished: m.isPublished,
          isFeatured: m.isFeatured,
          createdAt: m.createdAt,
          original: m
        }))
      ];

      // Sort by newest
      unified.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMediaList(unified);
    } catch (error) {
      console.error('Failed to load media', error);
      alert('Failed to load media');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const openModal = (item?: UnifiedMedia) => {
    setEditingItem(item || null);
    if (item) {
      setType(item.type);
      setTitle(item.title);
      setCategory(item.category);
      setDisplayLocation(item.displayLocation);
      setIsPublished(item.isPublished);
      setIsFeatured(item.isFeatured);
      if (item.type === 'EXTERNAL_ARTICLE') {
        const orig = item.original as MediaCoverageItem;
        setExternalUrl(orig.externalUrl);
        setPublication(orig.publication);
        setDescription(orig.description || '');
      } else {
        const orig = item.original as GalleryItem;
        setDescription(orig.description || '');
      }
    } else {
      setType('IMAGE');
      setTitle('');
      setDescription('');
      setExternalUrl('');
      setPublication('');
      setCategory('');
      setDisplayLocation('');
      setIsPublished(true);
      setIsFeatured(false);
    }
    setFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'IMAGE' && !editingItem && !file) {
      return alert('Please select an image file');
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', title);
    if (description) formData.append('description', description);
    if (category) formData.append('category', category);
    if (displayLocation) formData.append('displayLocation', displayLocation);
    formData.append('isPublished', isPublished ? 'true' : 'false');
    formData.append('isFeatured', isFeatured ? 'true' : 'false');
    if (file) {
      formData.append('image', file);
    }

    try {
      if (type === 'IMAGE') {
        if (editingItem) {
          await updateGalleryItem(editingItem.id, formData);
        } else {
          await createGalleryItem(formData);
        }
      } else {
        formData.append('externalUrl', externalUrl);
        formData.append('publication', publication);
        if (editingItem) {
          await updateMediaItem(editingItem.id, formData);
        } else {
          await createMediaItem(formData);
        }
      }
      setIsModalOpen(false);
      loadMedia();
    } catch (error: any) {
      alert(error.message || 'Failed to save media');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, type: 'IMAGE' | 'EXTERNAL_ARTICLE') => {
    if (!window.confirm('Are you sure you want to delete this?')) return;
    try {
      if (type === 'IMAGE') await deleteGalleryItem(id);
      else await deleteMediaItem(id);
      loadMedia();
    } catch (error: any) {
      alert(error.message || 'Failed to delete');
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading media...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-content-primary">Media Management</h2>
        <button
          onClick={() => openModal()}
          className="bg-brand-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-brand-primary/90"
        >
          <Plus className="w-4 h-4" /> Add Media
        </button>
      </div>

      <div className="bg-background border border-border/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-muted/30 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-semibold text-content-secondary">Media</th>
                <th className="px-6 py-4 font-semibold text-content-secondary">Type</th>
                <th className="px-6 py-4 font-semibold text-content-secondary">Location</th>
                <th className="px-6 py-4 font-semibold text-content-secondary">Status</th>
                <th className="px-6 py-4 font-semibold text-content-secondary text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mediaList.map((item) => (
                <tr key={item.id} className="hover:bg-surface-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {item.type === 'IMAGE' ? (
                         <img src={item.thumbnailUrl} className="w-16 h-12 object-cover rounded" alt="thumb" />
                      ) : (
                         <div className="w-16 h-12 bg-gray-100 flex items-center justify-center rounded">
                           {item.thumbnailUrl && item.thumbnailUrl.startsWith('http') ? <img src={item.thumbnailUrl} className="w-full h-full object-cover rounded" /> : <LinkIcon className="w-6 h-6 text-gray-400" />}
                         </div>
                      )}
                      <div>
                        <p className="font-medium text-content-primary line-clamp-1">{item.title}</p>
                        <p className="text-xs text-content-secondary mt-0.5">{item.category || '-'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-surface-muted/50 text-content-secondary">
                      {item.type === 'IMAGE' ? <ImageIcon className="w-3.5 h-3.5" /> : <LinkIcon className="w-3.5 h-3.5" />}
                      {item.type === 'IMAGE' ? 'Image' : 'Article'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-content-secondary">{item.displayLocation || 'Unassigned'}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {item.isPublished ? (
                        <span className="text-green-600 text-xs font-medium">Published</span>
                      ) : (
                        <span className="text-gray-500 text-xs font-medium">Draft</span>
                      )}
                      {item.isFeatured && (
                        <span className="text-brand-primary text-xs font-medium">Featured</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openModal(item)} className="p-2 text-content-secondary hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id, item.type)} className="p-2 text-content-secondary hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {mediaList.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-content-secondary">
                    No media items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
            {isSubmitting && (
              <div className="absolute inset-0 bg-background/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center rounded-xl animate-fadeIn">
                <div className="w-14 h-14 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-4" />
                <h4 className="text-lg font-bold text-content-primary">
                  {file ? 'Uploading image to Cloudinary...' : 'Saving changes...'}
                </h4>
                <p className="text-sm text-content-secondary max-w-xs mt-1">
                  Please wait a moment while your media is being processed.
                </p>
              </div>
            )}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-content-primary">
                {editingItem ? 'Edit Media' : 'Add New Media'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-content-secondary hover:text-content-primary">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!editingItem && (
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-1">Media Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'IMAGE' | 'EXTERNAL_ARTICLE')}
                    className="w-full px-4 py-2 bg-surface-muted/30 border border-border/50 rounded-lg focus:outline-none focus:border-brand-primary text-content-primary"
                  >
                    <option value="IMAGE">Image</option>
                    <option value="EXTERNAL_ARTICLE">External Article Link</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-content-primary mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-surface-muted/30 border border-border/50 rounded-lg focus:outline-none focus:border-brand-primary text-content-primary"
                  placeholder="Enter title"
                />
              </div>

              {type === 'EXTERNAL_ARTICLE' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-content-primary mb-1">External Article URL *</label>
                    <input
                      type="url"
                      required
                      value={externalUrl}
                      onChange={e => setExternalUrl(e.target.value)}
                      className="w-full px-4 py-2 bg-surface-muted/30 border border-border/50 rounded-lg focus:outline-none focus:border-brand-primary text-content-primary"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-content-primary mb-1">Publication Name *</label>
                    <input
                      type="text"
                      required
                      value={publication}
                      onChange={e => setPublication(e.target.value)}
                      className="w-full px-4 py-2 bg-surface-muted/30 border border-border/50 rounded-lg focus:outline-none focus:border-brand-primary text-content-primary"
                      placeholder="e.g. The Times of India"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-content-primary mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-surface-muted/30 border border-border/50 rounded-lg focus:outline-none focus:border-brand-primary text-content-primary resize-none"
                  placeholder="Enter description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-surface-muted/30 border border-border/50 rounded-lg focus:outline-none focus:border-brand-primary text-content-primary"
                    placeholder="e.g. EDUCATION"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-content-primary mb-1">Display Location</label>
                  <select
                    value={displayLocation}
                    onChange={(e) => setDisplayLocation(e.target.value)}
                    className="w-full px-4 py-2 bg-surface-muted/30 border border-border/50 rounded-lg focus:outline-none focus:border-brand-primary text-content-primary"
                  >
                    <option value="">-- None / General Gallery --</option>
                    {DISPLAY_LOCATIONS.map(loc => (
                      <option key={loc.value} value={loc.value}>{loc.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-content-primary mb-1">
                  {type === 'IMAGE' ? 'Upload Image' : 'Upload Thumbnail (Optional)'} {type === 'IMAGE' && !editingItem && '*'}
                </label>
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={e => setFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-content-secondary
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-brand-primary/10 file:text-brand-primary
                    hover:file:bg-brand-primary/20
                  "
                />
                {editingItem && <p className="text-xs text-content-secondary mt-1">Leave empty to keep current image</p>}
              </div>

              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={e => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-brand-primary border-border/50 rounded focus:ring-brand-primary"
                  />
                  <span className="text-sm font-medium text-content-primary">Published</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={e => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-brand-primary border-border/50 rounded focus:ring-brand-primary"
                  />
                  <span className="text-sm font-medium text-content-primary">Featured</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-medium text-content-secondary hover:bg-surface-muted/50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-lg font-medium bg-brand-primary text-white hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmitting
                    ? (editingItem ? 'Updating...' : 'Saving...')
                    : (editingItem ? 'Update Media' : 'Save Media')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
