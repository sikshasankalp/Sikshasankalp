import { useState, useEffect } from 'react';
import { TransparencyHero } from '../../components/sections/transparency/TransparencyHero';
import { TransparencyCompliance } from '../../components/sections/transparency/TransparencyCompliance';
import { TransparencyCTA } from '../../components/sections/transparency/TransparencyCTA';
import { fetchTransparencyDocs } from '../../services/api/transparency';
import type { TransparencyDocument } from '../../services/api/transparency';

export default function Transparency() {
  const [documents, setDocuments] = useState<TransparencyDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransparencyDocs({ limit: 100 })
      .then(res => {
        setDocuments(res.data);
        setError(null);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load transparency documents.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col w-full">
      <TransparencyHero />
      <TransparencyCompliance documents={documents} loading={loading} error={error} />
      <TransparencyCTA />
    </div>
  );
}
