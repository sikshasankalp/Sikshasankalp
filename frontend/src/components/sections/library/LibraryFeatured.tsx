import { Download, ExternalLink, PlayCircle, BookOpen } from 'lucide-react';
import { PlaceholderImage } from '../../common/PlaceholderImage';

export interface EducationalResource {
  id: string;
  title: string;
  categoryId: string;
  categoryName: string;
  description: string;
  resourceType: 'pdf' | 'video' | 'link' | 'book';
  thumbnailUrl?: string; // Optional if we just use an icon/placeholder
  accessUrl: string;
}

const getResourceIcon = (type: EducationalResource['resourceType']) => {
  switch (type) {
    case 'pdf': return <Download className="w-4 h-4" />;
    case 'video': return <PlayCircle className="w-4 h-4" />;
    case 'book': return <BookOpen className="w-4 h-4" />;
    case 'link':
    default: return <ExternalLink className="w-4 h-4" />;
  }
};

export function LibraryFeatured() {
  const featuredResources: EducationalResource[] = [
    {
      id: 'res-1',
      title: 'Class 10 Science Notes (Placeholder)',
      categoryId: 'notes',
      categoryName: 'Notes & Study Material',
      description: 'Comprehensive study notes covering all major chapters to assist with board exam preparation.',
      resourceType: 'pdf',
      accessUrl: '#',
    },
    {
      id: 'res-2',
      title: 'Basic Computer Literacy Course (Placeholder)',
      categoryId: 'digital',
      categoryName: 'Computer & Digital Learning',
      description: 'An introductory video series on operating a computer, using the internet safely, and basic software.',
      resourceType: 'video',
      accessUrl: '#',
    },
    {
      id: 'res-3',
      title: 'NCERT Mathematics Grade 8 (Placeholder)',
      categoryId: 'ncert',
      categoryName: 'NCERT Books',
      description: 'Official mathematics textbook available for free reading and offline download.',
      resourceType: 'book',
      accessUrl: '#',
    }
  ];

  return (
    <section className="section-padding bg-surface-muted border-t border-border/50">
      <div className="container-default max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-h2 mb-4">Featured Resources</h2>
            <p className="text-body-large max-w-2xl">
              A selection of our most accessed educational materials.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {featuredResources.map((resource) => (
            <div key={resource.id} className="flex flex-col bg-background border border-border/60 hover:border-brand-primary/30 transition-colors">
              <div className="relative aspect-[16/10] w-full bg-surface-muted border-b border-border/50 overflow-hidden">
                <PlaceholderImage className="w-full h-full border-none" text="Resource Thumbnail" />
                <div className="absolute top-4 left-4 bg-background/95 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-content-primary rounded">
                  {resource.categoryName}
                </div>
              </div>
              <div className="p-6 md:p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-content-primary mb-3 leading-snug">{resource.title}</h3>
                <p className="text-body text-content-secondary mb-6 flex-grow">
                  {resource.description}
                </p>
                <a 
                  href={resource.accessUrl} 
                  className="inline-flex items-center text-sm font-semibold text-brand-primary hover:text-brand-primary-hover uppercase tracking-wider"
                >
                  {getResourceIcon(resource.resourceType)}
                  <span className="ml-2">Access Resource</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
