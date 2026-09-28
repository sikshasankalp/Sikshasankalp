import { ArrowRight, Tv } from 'lucide-react';
import { PlaceholderImage } from '../../common/PlaceholderImage';

type MediaType = 'Article' | 'Video' | 'TV';

interface MediaItem {
  id: string;
  publication: string;
  title: string;
  date: string;
  mediaType: MediaType;
  externalUrl: string;
  thumbnailUrl: string;
}

const SHOW_MEDIA_PLACEHOLDERS = true;

// Mock list
const mockListItems: MediaItem[] = SHOW_MEDIA_PLACEHOLDERS ? [
  { id: 'item-1', publication: 'News18', title: 'Media Title Placeholder', date: 'Date Placeholder', mediaType: 'Article', externalUrl: '#', thumbnailUrl: '' },
  { id: 'item-2', publication: 'ABP News', title: 'Media Title Placeholder', date: 'Date Placeholder', mediaType: 'TV', externalUrl: '#', thumbnailUrl: '' },
  { id: 'item-3', publication: 'India Today', title: 'Media Title Placeholder', date: 'Date Placeholder', mediaType: 'Video', externalUrl: '#', thumbnailUrl: '' },
] : [];

export function MediaGrid() {
  const items = mockListItems;

  return (
    <section className="section-padding bg-surface-muted">
      <div className="container-default max-w-5xl mx-auto">
        <h2 className="text-h2 mb-12">More Coverage</h2>
        
        {items.length > 0 ? (
          <div className="flex flex-col">
            {items.map((item) => (
              <a 
                key={item.id} 
                href={item.externalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex flex-col md:flex-row gap-6 md:gap-10 py-8 border-t border-border/60 hover:bg-background/50 transition-colors -mx-4 px-4 md:mx-0 md:px-6 rounded-lg"
              >
                <div className="relative aspect-video w-full md:w-[240px] shrink-0 rounded overflow-hidden bg-background border border-border/50">
                  {item.thumbnailUrl ? (
                    <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <PlaceholderImage className="w-full h-full border-none transition-transform duration-500 group-hover:scale-105" text="Thumbnail" />
                  )}
                </div>
                
                <div className="flex flex-col justify-center flex-grow">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold tracking-wider uppercase text-content-primary">
                      {item.publication}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-border"></span>
                    <span className="text-xs text-content-muted font-medium">
                      {item.date}
                    </span>
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-content-primary mb-3 group-hover:text-brand-primary transition-colors">
                    {item.title}
                  </h3>
                  
                  <div className="mt-auto flex items-center text-sm font-semibold text-brand-primary uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                    View Coverage <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-border bg-background rounded-xl shadow-soft">
            <Tv className="w-12 h-12 text-content-muted mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-content-primary mb-2">Coverage Archive In Development</h3>
            <p className="text-body text-content-secondary max-w-md mx-auto">
              We are currently compiling external media coverage links, videos, and articles. 
              Verified links will be added here shortly.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
