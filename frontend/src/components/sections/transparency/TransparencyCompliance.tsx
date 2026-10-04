import { Download, FileText } from 'lucide-react';
import type { TransparencyDocument } from '../../../services/api/transparency';
import { useLanguage } from "../../../context/LanguageContext";

interface Props {
  documents: TransparencyDocument[];
  loading: boolean;
  error: string | null;
}

export function TransparencyCompliance({ documents, loading, error }: Props) {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-surface-muted">
      <div className="container-default max-w-5xl mx-auto">
        <h2 className="text-h2 mb-12">{t('transparency.transparencyCompliance.text1')}</h2>
        
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {loading ? (
            <div className="col-span-1 md:col-span-2 py-12 text-center text-content-secondary flex flex-col items-center">
              <span className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p>{t('transparency.transparencyCompliance.text2')}</p>
            </div>
          ) : error ? (
            <div className="col-span-1 md:col-span-2 py-12 text-center text-error">
              {error}
            </div>
          ) : documents.length === 0 ? (
            <div className="col-span-1 md:col-span-2 py-16 text-center text-content-secondary flex flex-col items-center">
              <FileText className="w-12 h-12 text-content-muted mb-4 opacity-50" />
              <p className="text-lg">{t('transparency.transparencyCompliance.text3')}</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="flex flex-col bg-background border border-border/60 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                  <h3 className="text-lg font-bold text-content-primary">{doc.title}</h3>
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded uppercase tracking-wider">{t('transparency.transparencyCompliance.text4')}</span>
                </div>
                
                {doc.description && (
                  <p className="text-sm text-content-secondary mb-6 flex-grow leading-relaxed">
                    {doc.description}
                  </p>
                )}
                
                <div className="flex flex-col space-y-4 mt-auto pt-2">
                  <div className="text-sm text-content-secondary">
                    {doc.documentType && <div className="mb-1"><span className="font-semibold text-content-primary">{t('transparency.transparencyCompliance.text5')}</span> {doc.documentType}</div>}
                    {doc.documentNumber && <div className="mb-1"><span className="font-semibold text-content-primary">{t('transparency.transparencyCompliance.text6')}</span> {doc.documentNumber}</div>}
                    {doc.issuedDate && <div><span className="font-semibold text-content-primary">{t('transparency.transparencyCompliance.text7')}</span> {new Date(doc.issuedDate).toLocaleDateString()}</div>}
                  </div>
                  <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-brand-primary font-semibold text-sm uppercase tracking-wider hover:text-brand-primary-hover transition-colors">
                    <Download className="w-4 h-4 mr-2" /> {t('transparency.transparencyCompliance.text8')}
                                              </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
