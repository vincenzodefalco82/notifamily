import { tFn, formatDate } from './i18n.js';
import { Icon } from './icons.jsx';
import { Card, EmptyState, Button, Badge } from './ui.jsx';
import { PageHeader } from './household.jsx';
import { useDocuments } from './api/hooks.js';
import { DocumentUploadForm, DeleteDocumentButton } from './forms/index.jsx';
import { useState } from 'react';

export function DocumentsPage({ state }) {
  const t = tFn(state.lang);
  const lang = state.lang;
  const { data: documents = [], isLoading } = useDocuments();
  const [formOpen, setFormOpen] = useState(false);

  const it = lang === 'it';

  const types = {
    contract: { label: it ? 'Contratto' : 'Contract', color: 'var(--cat-rent)' },
    insurance: { label: it ? 'Assicurazione' : 'Insurance', color: 'var(--cat-insurance)' },
    payslip: { label: it ? 'Busta paga' : 'Payslip', color: 'var(--cat-worker)' },
    vehicle: { label: it ? 'Veicolo' : 'Vehicle', color: 'var(--cat-subscription)' },
    other: { label: it ? 'Altro' : 'Other', color: 'var(--text-3)' },
  };

  if (isLoading) return <div className="page"><div className="text-muted" style={{ padding: 32 }}>Caricamento…</div></div>;

  if (!documents.length) {
    return (
      <div className="page">
        <PageHeader title={t('nav.documents')} />
        <Card>
          <EmptyState icon="folder"
            title={it ? 'Nessun documento' : 'No documents'}
            desc={it ? 'Carica contratti, polizze, bollette.' : 'Upload contracts, policies, bills.'}
            cta={<Button variant="primary" icon="upload" onClick={() => setFormOpen(true)}>{it ? 'Carica documenti' : 'Upload'}</Button>}
          />
        </Card>
        {formOpen && <DocumentUploadForm lang={lang} onClose={() => setFormOpen(false)} />}
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader
        title={t('nav.documents')}
        sub={it ? `${documents.length} file` : `${documents.length} files`}
        actions={<Button variant="primary" icon="upload" onClick={() => setFormOpen(true)}>{it ? 'Carica' : 'Upload'}</Button>}
      />

      <div className="grid grid-12">
        {documents.map(doc => {
          const tp = types[doc.type] || types.other;
          const sizeKb = doc.size ? (doc.size / 1024).toFixed(0) : null;
          return (
            <div key={doc.id} className="col-4">
              <Card className="card-hover" service="document-service" style={{ cursor: 'default' }}>
                <div style={{ height: 100, background: 'var(--bg-subtle)', borderRadius: 10, display: 'grid', placeItems: 'center', color: tp.color, marginBottom: 12, position: 'relative' }}>
                  <Icon name="file" size={36} stroke={1.3} />
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    <Badge kind="neutral" dot={tp.color}>{tp.label}</Badge>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name || doc.originalName}</div>
                <div className="hstack" style={{ fontSize: 11, color: 'var(--text-3)', justifyContent: 'space-between' }}>
                  {sizeKb && <span className="mono">{sizeKb < 1024 ? `${sizeKb} KB` : `${(sizeKb / 1024).toFixed(1)} MB`}</span>}
                  {doc.uploadedAt && <span>{formatDate(new Date(doc.uploadedAt), lang, { day: 'numeric', month: 'short', year: 'numeric' })}</span>}
                  <DeleteDocumentButton id={doc.id} lang={lang} />
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {formOpen && <DocumentUploadForm lang={lang} onClose={() => setFormOpen(false)} />}
    </div>
  );
}
