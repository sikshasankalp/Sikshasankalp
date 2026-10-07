import { useState, useEffect } from 'react';
import { Download, ExternalLink, PlayCircle, BookOpen, Search } from 'lucide-react';
import { PlaceholderImage } from '../../common/PlaceholderImage';
import { SmoothInput } from '../../common/SmoothInput';
import { fetchLibrary } from '../../../services/api/library';
import type { LibraryResource } from '../../../services/api/library';
import { useLanguage } from "../../../context/LanguageContext";

const getResourceIcon = (type?: string) => {
  const t = type?.toLowerCase() || '';
  if (t.includes('pdf')) return <Download className="w-4 h-4" />;
  if (t.includes('video') || t.includes('mp4')) return <PlayCircle className="w-4 h-4" />;
  if (t.includes('book')) return <BookOpen className="w-4 h-4" />;
  return <ExternalLink className="w-4 h-4" />;
};

const LIBRARY_CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'NCERT_BOOK', label: 'NCERT Book' },
  { value: 'NOTES', label: 'Notes' },
  { value: 'STUDY_MATERIAL', label: 'Study Material' },
  { value: 'EDUCATIONAL_VIDEO', label: 'Educational Video' },
  { value: 'PDF', label: 'PDF' },
  { value: 'DIGITAL_LEARNING', label: 'Digital Learning' },
  { value: 'COMPETITIVE_EXAM', label: 'Competitive Exam' },
  { value: 'OTHER', label: 'Other' },
];

export function LibraryFeatured() {
    const { t } = useLanguage();
  const [resources, setResources] = useState<LibraryResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    const loadResources = async () => {
      setLoading(true);
      try {
        const res = await fetchLibrary({ 
          limit: 100,
          search: searchTerm,
          category: category
        });
        setResources(res.data || []);
      } catch (err) {
        console.error('Failed to load library resources:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(loadResources, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, category]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return null;
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <section className="section-padding bg-surface-muted border-t border-border/50">
      <div className="container-default max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-h2 mb-4">{t('library.libraryFeatured.text1')}</h2>
            <p className="text-body-large max-w-2xl">
              {t('library.libraryFeatured.text2')}
                                      </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="w-full sm:w-64">
              <SmoothInput
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftElement={<Search className="w-4 h-4 text-content-secondary" />}
                className="py-2 text-sm"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full sm:w-48 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary bg-white"
            >
              {LIBRARY_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-content-secondary">{t('library.libraryFeatured.text3')}</div>
        ) : resources.length === 0 ? (
          <div className="py-12 text-center text-content-secondary">{t('library.libraryFeatured.text4')}</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((resource) => (
              <div key={resource.id} className="flex flex-col bg-background border border-border/60 hover:border-brand-primary/30 transition-colors">
                <div className="relative aspect-[16/10] w-full bg-surface-muted border-b border-border/50 overflow-hidden">
                  {resource.thumbnailUrl ? (
                    <img src={resource.thumbnailUrl} alt={resource.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                  ) : (
                    <PlaceholderImage className="w-full h-full border-none" text="Resource Thumbnail" />
                  )}
                  {resource.category && (
                    <div className="absolute top-4 left-4 bg-background/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-content-primary rounded">
                      {LIBRARY_CATEGORIES.find(c => c.value === resource.category)?.label || resource.category}
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-content-primary mb-3 leading-snug">{resource.title}</h3>
                  {resource.description && (
                    <p className="text-body text-content-secondary mb-6 flex-grow">
                      {resource.description}
                    </p>
                  )}
                  
                  <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-border/50">
                    {resource.fileSize && (
                      <p className="text-xs text-content-secondary">{t('library.libraryFeatured.text5')} {formatFileSize(resource.fileSize)}</p>
                    )}
                    <a 
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-primary-hover uppercase tracking-wider"
                    >
                      {getResourceIcon(resource.fileType)}
                      <span className="ml-2">{t('library.libraryFeatured.text6')}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
