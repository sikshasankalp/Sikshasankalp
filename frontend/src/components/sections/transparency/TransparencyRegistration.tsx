import { ShieldCheck, FileText } from 'lucide-react';
import { useLanguage } from "../../../context/LanguageContext";

export function TransparencyRegistration() {
    const { t } = useLanguage();
  return (
    <section className="section-padding bg-background border-b border-border/50">
      <div className="container-default max-w-4xl mx-auto">
        <h2 className="text-h2 mb-10 text-center md:text-left">{t('transparency.transparencyRegistration.text1')}</h2>
        
        <div className="bg-surface-muted border border-border rounded-xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-brand-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-content-primary mb-2">{t('transparency.transparencyRegistration.text2')}</h3>
              <p className="text-body text-content-secondary mb-1">
                <span className="font-semibold text-content-primary">{t('transparency.transparencyRegistration.text3')}</span> {t('transparency.transparencyRegistration.text4')}
                                            </p>
              <p className="text-body text-content-secondary">
                <span className="font-semibold text-content-primary">{t('transparency.transparencyRegistration.text5')}</span> {t('transparency.transparencyRegistration.text6')}
                                            </p>
            </div>
          </div>
          
          <div className="flex flex-col md:text-right pt-6 md:pt-0 border-t border-border/60 md:border-t-0 md:border-l md:pl-8 w-full md:w-auto">
            <p className="text-sm text-content-muted font-medium uppercase tracking-wider mb-1">{t('transparency.transparencyRegistration.text7')}</p>
            <p className="text-xl font-bold text-content-primary mb-2">{t('transparency.transparencyRegistration.text8')}</p>
            <a
              href="/documents/Trust_Deed.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-start md:justify-end gap-1.5 text-xs font-bold text-brand-primary hover:underline mt-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>View Registered Trust Deed &rarr;</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
