import { ShieldCheck } from 'lucide-react';

export function DonateTrust() {
  return (
    <section className="py-12 bg-surface-muted border-b border-border/50">
      <div className="container-default max-w-4xl mx-auto flex gap-6 items-start">
        <div className="w-12 h-12 rounded-full bg-background border border-border/60 flex items-center justify-center shrink-0 mt-1">
          <ShieldCheck className="w-6 h-6 text-content-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-content-primary mb-2">Transparency & Security</h3>
          <p className="text-body text-content-secondary leading-relaxed">
            All contributions directly support the foundation's educational and community initiatives. Payment processing is handled through secure, encrypted gateways, and sensitive payment data never touches our servers. Official receipts will be generated and emailed to you upon successful completion of the transaction.
          </p>
        </div>
      </div>
    </section>
  );
}
