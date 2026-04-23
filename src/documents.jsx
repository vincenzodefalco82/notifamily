import { tFn, formatDate } from './i18n.js';
import { getData } from './data.js';
import { Icon } from './icons.jsx';
import { Card, EmptyState, Button, Badge } from './ui.jsx';
import { PageHeader } from './household.jsx';

export function DocumentsPage({ state }) {
  const t = tFn(state.lang);
  const lang = state.lang;
  const data = getData(state.empty);

  if (state.empty) {
    return (
      <div className="page">
        <PageHeader title={t('nav.documents')} />
        <Card><EmptyState icon="folder" title={lang === 'it' ? 'Nessun documento' : 'No documents'} desc={lang === 'it' ? 'Carica contratti, polizze, bollette.' : 'Upload contracts, policies, bills.'} cta={<Button variant="primary" icon="upload">{lang === 'it' ? 'Carica documenti' : 'Upload'}</Button>} /></Card>
      </div>
    );
  }

  const types = {
    contract: { label: lang === 'it' ? 'Contratto' : 'Contract', color: 'var(--cat-rent)' },
    insurance: { label: lang === 'it' ? 'Assicurazione' : 'Insurance', color: 'var(--cat-insurance)' },
    payslip: { label: lang === 'it' ? 'Busta paga' : 'Payslip', color: 'var(--cat-worker)' },
    vehicle: { label: lang === 'it' ? 'Veicolo' : 'Vehicle', color: 'var(--cat-subscription)' },
  };

  return (
    <div className="page">
      <PageHeader
        title={t('nav.documents')}
        sub={lang === 'it' ? `${data.documents.length} file · archivio cifrato` : `${data.documents.length} files · encrypted vault`}
        actions={<Button variant="primary" icon="upload">{lang === 'it' ? 'Carica' : 'Upload'}</Button>}
      />

      <div className="grid grid-12">
        {data.documents.map(doc => {
          const tp = types[doc.type] || types.contract;
          return (
            <div key={doc.id} className="col-4">
              <Card className="card-hover" service="document-service" style={{ cursor: 'pointer' }}>
                <div style={{ height: 100, background: 'var(--bg-subtle)', borderRadius: 10, display: 'grid', placeItems: 'center', color: tp.color, marginBottom: 12, position: 'relative' }}>
                  <Icon name="file" size={36} stroke={1.3} />
                  <div style={{ position: 'absolute', top: 8, right: 8 }}>
                    <Badge kind="neutral" dot={tp.color}>{tp.label}</Badge>
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
                <div className="hstack" style={{ fontSize: 11, color: 'var(--text-3)', justifyContent: 'space-between' }}>
                  <span className="mono">{(doc.size / 1024).toFixed(1)} MB</span>
                  <span>{formatDate(new Date(doc.uploadedAt), lang, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
