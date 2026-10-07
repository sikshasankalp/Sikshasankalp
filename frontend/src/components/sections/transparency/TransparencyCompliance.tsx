import { useState } from 'react';
import { Download, FileText, Eye, ExternalLink, X, ShieldCheck } from 'lucide-react';
import type { TransparencyDocument } from '../../../services/api/transparency';
import { useLanguage } from "../../../context/LanguageContext";

interface Props {
  documents: TransparencyDocument[];
  loading: boolean;
  error: string | null;
}

const DEFAULT_DOCUMENTS: TransparencyDocument[] = [
  {
    id: 'doc-80g',
    title: '80G Tax Exemption Certificate',
    documentType: 'TAX_EXEMPTION_80G',
    documentNumber: 'ABOTS8425NE20261',
    documentUrl: '/documents/80G_Certificate.pdf',
    description: 'Income Tax 80G Approval Certificate. Donations made to Siksha Sankalp Foundation are eligible for 50% tax deduction under Section 80G of the Income Tax Act, 1961.',
    issuedDate: '2026-06-03',
    isPublished: true,
    createdAt: '2026-06-03',
    updatedAt: '2026-06-03'
  },
  {
    id: 'doc-12a',
    title: '12A / 12AB Registration Certificate',
    documentType: 'REGISTRATION_12A',
    documentNumber: 'ABOTS8425NE20261',
    documentUrl: '/documents/12A_Certificate.pdf',
    description: 'Income Tax Department registration under Section 12A / 12AB recognizing Siksha Sankalp Foundation as a non-profit charitable trust.',
    issuedDate: '2026-06-03',
    isPublished: true,
    createdAt: '2026-06-03',
    updatedAt: '2026-06-03'
  },
  {
    id: 'doc-gst',
    title: 'GST Registration Certificate',
    documentType: 'GST_CERTIFICATE',
    documentNumber: '09AAETS8425N1Z8',
    documentUrl: '/documents/GST_Registration.pdf',
    description: 'Official Goods and Services Tax (GST) Registration Certificate issued by the Government of India.',
    issuedDate: '2026-06-03',
    isPublished: true,
    createdAt: '2026-06-03',
    updatedAt: '2026-06-03'
  },
  {
    id: 'doc-pan',
    title: 'Trust Permanent Account Number (PAN Card)',
    documentType: 'PAN_CARD',
    documentNumber: 'AAETS8425N',
    documentUrl: '/documents/PAN_Card.pdf',
    description: 'Official Permanent Account Number (PAN) Card of Siksha Sankalp Foundation issued by the Income Tax Department.',
    issuedDate: '2026-06-03',
    isPublished: true,
    createdAt: '2026-06-03',
    updatedAt: '2026-06-03'
  }
];

const DRIVE_LINKS: Record<string, string> = {
  '80G Tax Exemption Certificate': 'https://drive.google.com/file/d/1lzgNZbaUfDU3G7FtgHNxOv214oYe9J5y/view?usp=sharing',
  '12A / 12AB Registration Certificate': 'https://drive.google.com/file/d/1AHY1F0fIUxdMf_ao3JwJEyY6T8aUEe3T/view?usp=sharing',
  'GST Registration Certificate': 'https://drive.google.com/file/d/11EQzteYCUENTMA4eFlefhNf7mdBYbHhh/view?usp=sharing',
  'Trust Permanent Account Number (PAN Card)': 'https://drive.google.com/file/d/1VFxbzodAFJ0AdV3ETFcpPAVCq78fM1zZ/view?usp=sharing',
};

export function TransparencyCompliance({ documents, loading, error }: Props) {
  const { t } = useLanguage();
  const [previewDoc, setPreviewDoc] = useState<TransparencyDocument | null>(null);

  const displayDocs = (documents && documents.length > 0) ? documents : DEFAULT_DOCUMENTS;

  return (
    <section className="section-padding bg-surface-muted">
      <div className="container-default max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4" /> Official Verifications
            </div>
            <h2 className="text-h2">{t('transparency.transparencyCompliance.text1')}</h2>
          </div>
          <p className="text-sm text-content-secondary max-w-md">
            All legal, regulatory, and tax exemption certificates are publicly accessible for complete trust and donor transparency.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {loading && displayDocs.length === 0 ? (
            <div className="col-span-1 md:col-span-2 py-12 text-center text-content-secondary flex flex-col items-center">
              <span className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p>{t('transparency.transparencyCompliance.text2')}</p>
            </div>
          ) : error && displayDocs.length === 0 ? (
            <div className="col-span-1 md:col-span-2 py-12 text-center text-error">
              {error}
            </div>
          ) : (
            displayDocs.map((doc) => {
              const driveLink = DRIVE_LINKS[doc.title] || doc.documentUrl;
              return (
                <div key={doc.id} className="flex flex-col bg-background border border-border/70 rounded-xl p-6 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex items-start justify-between mb-4 pb-4 border-b border-border/50 gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-brand-primary group-hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-content-primary leading-snug">{doc.title}</h3>
                        {doc.documentNumber && (
                          <p className="text-xs font-mono font-semibold text-content-muted mt-1">
                            Ref / Reg: <span className="text-content-primary">{doc.documentNumber}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                      {t('transparency.transparencyCompliance.text4')}
                    </span>
                  </div>
                  
                  {doc.description && (
                    <p className="text-sm text-content-secondary mb-6 flex-grow leading-relaxed">
                      {doc.description}
                    </p>
                  )}
                  
                  <div className="flex flex-col space-y-4 mt-auto pt-4 border-t border-border/40">
                    <div className="flex flex-wrap items-center justify-between text-xs text-content-secondary gap-2">
                      {doc.documentType && (
                        <div>
                          <span className="font-semibold text-content-primary">Type:</span> {doc.documentType}
                        </div>
                      )}
                      {doc.issuedDate && (
                        <div>
                          <span className="font-semibold text-content-primary">Date:</span> {new Date(doc.issuedDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </div>
                      )}
                    </div>

                    {/* Dual Action: View & Download */}
                    <div className="flex items-center gap-2.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-brand-primary text-white text-xs font-bold rounded-lg hover:bg-brand-primary-hover transition-colors shadow-sm cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Document</span>
                      </button>

                      <a 
                        href={doc.documentUrl} 
                        download
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center justify-center gap-1 px-3 py-2.5 bg-surface-muted text-content-primary border border-border text-xs font-semibold rounded-lg hover:bg-border/60 transition-colors"
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Download</span>
                      </a>

                      <a 
                        href={driveLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center justify-center p-2.5 bg-surface-muted text-content-secondary border border-border rounded-lg hover:text-brand-primary hover:border-brand-primary transition-colors"
                        title="Open in Google Drive"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Document Viewer */}
        {previewDoc && (
          <div className="fixed inset-0 z-50 bg-content-primary/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-surface-muted/40 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-content-primary text-base sm:text-lg leading-tight">
                      {previewDoc.title}
                    </h3>
                    {previewDoc.documentNumber && (
                      <p className="text-xs text-content-secondary font-mono">
                        Ref: {previewDoc.documentNumber}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <a
                    href={DRIVE_LINKS[previewDoc.title] || previewDoc.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Google Drive</span>
                  </a>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="p-1.5 text-content-secondary hover:text-content-primary rounded-lg hover:bg-surface transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content - PDF / Image Viewer */}
              <div className="flex-1 bg-surface-muted min-h-[450px] p-2 sm:p-4 overflow-hidden">
                <iframe
                  src={previewDoc.documentUrl}
                  title={previewDoc.title}
                  className="w-full h-full min-h-[450px] sm:min-h-[550px] rounded-lg border border-border shadow-inner bg-white"
                />
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-3 border-t border-border bg-background flex items-center justify-between text-xs text-content-secondary shrink-0">
                <span>Official verified certificate &copy; Siksha Sankalp Foundation</span>
                <a
                  href={previewDoc.documentUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-brand-primary hover:underline"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
