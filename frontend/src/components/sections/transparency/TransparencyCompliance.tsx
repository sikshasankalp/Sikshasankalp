import { Download, Clock } from 'lucide-react';

type DocStatus = 'Available' | 'Pending/Unavailable';

interface ComplianceDoc {
  title: string;
  status: DocStatus;
  documentNumber?: string;
  issueDate?: string;
  downloadUrl?: string;
  description: string;
}

const complianceDocs: ComplianceDoc[] = [
  {
    title: 'Trust Registration Deed',
    status: 'Available',
    documentNumber: 'IN-UP97748090951454Y',
    issueDate: '03 June 2026',
    downloadUrl: '#',
    description: 'The official trust deed registering the foundation.',
  },
  {
    title: 'PAN',
    status: 'Pending/Unavailable',
    description: 'Permanent Account Number issued by the Income Tax Department. (Note: PAN does not automatically provide any tax exemption benefits to donors).',
  },
  {
    title: '12A Registration',
    status: 'Pending/Unavailable',
    description: 'Income Tax exemption registration for charitable trusts.',
  },
  {
    title: '80G Certification',
    status: 'Pending/Unavailable',
    description: 'Certification allowing donors to claim tax deductions. (Currently pending/unavailable. No tax deductions can be claimed at this time).',
  },
  {
    title: 'NGO Darpan ID',
    status: 'Pending/Unavailable',
    description: 'Unique ID issued by the NITI Aayog portal for NGOs.',
  }
];

export function TransparencyCompliance() {
  return (
    <section className="section-padding bg-surface-muted">
      <div className="container-default max-w-5xl mx-auto">
        <h2 className="text-h2 mb-12">Compliance & Certifications</h2>
        
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {complianceDocs.map((doc, index) => (
            <div key={index} className="flex flex-col bg-background border border-border/60 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
                <h3 className="text-lg font-bold text-content-primary">{doc.title}</h3>
                {doc.status === 'Available' ? (
                  <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded uppercase tracking-wider">Available</span>
                ) : (
                  <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded uppercase tracking-wider">Pending</span>
                )}
              </div>
              
              <p className="text-sm text-content-secondary mb-6 flex-grow leading-relaxed">
                {doc.description}
              </p>
              
              {doc.status === 'Available' ? (
                <div className="flex flex-col space-y-4">
                  <div className="text-sm text-content-secondary">
                    {doc.documentNumber && <div className="mb-1"><span className="font-semibold text-content-primary">No:</span> {doc.documentNumber}</div>}
                    {doc.issueDate && <div><span className="font-semibold text-content-primary">Date:</span> {doc.issueDate}</div>}
                  </div>
                  <a href={doc.downloadUrl} className="inline-flex items-center text-brand-primary font-semibold text-sm uppercase tracking-wider hover:text-brand-primary-hover transition-colors">
                    <Download className="w-4 h-4 mr-2" /> View Document
                  </a>
                </div>
              ) : (
                <div className="flex items-center text-content-muted text-sm font-medium mt-auto pt-4 border-t border-border/30">
                  <Clock className="w-4 h-4 mr-2" /> Document will be available here
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
