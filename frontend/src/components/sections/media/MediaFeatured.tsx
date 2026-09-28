import { ArrowRight, PlayCircle, FileText, Tv } from 'lucide-react';
import { PlaceholderImage } from '../../common/PlaceholderImage';

type MediaType = 'Article' | 'Video' | 'TV';

interface MediaItem {
  id: string;
  publication: string;
  title: string;
  description?: string;
  date: string;
  mediaType: MediaType;
  externalUrl: string;
  thumbnailUrl: string;
}

const getMediaIcon = (type: MediaType) => {
  switch (type) {
    case 'Video': return <PlayCircle className="w-4 h-4" />;
    case 'TV': return <Tv className="w-4 h-4" />;
    case 'Article':
    default: return <FileText className="w-4 h-4" />;
  }
};

// Set to true to show structural placeholders, false to view empty state
const SHOW_MEDIA_PLACEHOLDERS = true;

const mockMediaItems: MediaItem[] = SHOW_MEDIA_PLACEHOLDERS ? [
  {
    id: 'feat-1',
    publication: 'Aaj Tak',
    title: 'Featured Coverage Title Placeholder',
    description: 'A brief description of the featured media coverage, outlining the focus of the report and the specific initiative highlighted. This area will be populated by data from the backend.',
    date: 'Publication Date Placeholder',
    mediaType: 'TV',
    externalUrl: '#',
    thumbnailUrl: '',
  }
] : [];

export function MediaFeatured() {
  const featuredItem = mockMediaItems[0];

  if (!featuredItem) return null;

  return (
    <section className="section-padding bg-background border-b border-border/50">
      <div className="container-default max-w-6xl mx-auto">
        <h2 className="text-h2 mb-8 md:mb-12">Featured Report</h2>
        
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
          <a href={featuredItem.externalUrl} target="_blank" rel="noopener noreferrer" className="relative aspect-video w-full rounded-lg overflow-hidden bg-surface-muted border border-border/50 group block">
            {featuredItem.thumbnailUrl ? (
              <img src={featuredItem.thumbnailUrl} alt={featuredItem.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <PlaceholderImage className="w-full h-full border-none transition-transform duration-500 group-hover:scale-105" text="Featured Media Thumbnail" />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
            {featuredItem.mediaType !== 'Article' && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-brand-primary/90 rounded-full flex items-center justify-center text-white backdrop-blur-sm shadow-lg group-hover:scale-110 transition-transform">
                <PlayCircle className="w-8 h-8 ml-1" />
              </div>
            )}
          </a>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-semibold tracking-wider uppercase text-brand-primary border border-brand-primary/30 px-3 py-1 rounded">
                {featuredItem.publication}
              </span>
              <span className="text-sm text-content-muted font-medium flex items-center gap-1">
                {getMediaIcon(featuredItem.mediaType)} {featuredItem.mediaType}
              </span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-display font-bold text-content-primary mb-4 leading-snug">
              {featuredItem.title}
            </h3>
            
            <p className="text-body-large text-content-secondary mb-6 leading-relaxed">
              {featuredItem.description}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/60">
              <span className="text-sm text-content-muted font-medium">{featuredItem.date}</span>
              <a href={featuredItem.externalUrl} target="_blank" rel="noopener noreferrer" className="text-brand-primary font-semibold text-sm uppercase tracking-wider flex items-center hover:text-brand-primary-hover transition-colors">
                View Full Report <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
