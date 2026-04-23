import { tFn, formatCurrency } from './i18n.js';
import { getData } from './data.js';
import { Icon } from './icons.jsx';
import { Card, Button, Badge } from './ui.jsx';
import { PageHeader } from './household.jsx';

function SecRow({ title, sub, on }) {
  return (
    <div className="hstack" style={{ padding: '10px 0', borderBottom: '1px solid var(--divider)' }}>
      <div className="flex-1">
        <div style={{ fontSize: 13, fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{sub}</div>
      </div>
      {on ? <Badge kind="success">ON</Badge> : <Button size="sm">Configura</Button>}
    </div>
  );
}

export function SettingsPage({ state }) {
  const t = tFn(state.lang);
  const lang = state.lang;
  const data = getData(state.empty);

  return (
    <div className="page">
      <PageHeader
        title={t('nav.settings')}
        sub={lang === 'it' ? 'Gestione tenant, fatturazione, sicurezza, integrazioni.' : 'Tenant, billing, security, integrations.'}
      />

      <div className="grid grid-12">
        <div className="col-8">
          <Card title="Tenant" subtitle={lang === 'it' ? 'Piattaforma multi-tenant · ogni tenant gestisce infiniti nuclei' : 'Multi-tenant platform · unlimited households per tenant'} service="tenant-service">
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="field"><label className="field-label">{lang === 'it' ? 'Nome tenant' : 'Tenant name'}</label><input className="input" defaultValue={data.tenant.name} /></div>
              <div className="field"><label className="field-label">Tenant ID</label><input className="input mono" defaultValue={data.tenant.id} readOnly /></div>
              <div className="field"><label className="field-label">{lang === 'it' ? 'Piano' : 'Plan'}</label><input className="input" defaultValue={data.tenant.plan} /></div>
              <div className="field"><label className="field-label">{lang === 'it' ? 'Nuclei attivi' : 'Active households'}</label><input className="input mono" defaultValue={data.households.length} readOnly /></div>
              <div className="field"><label className="field-label">{lang === 'it' ? 'Regione dati' : 'Data region'}</label><select className="select"><option>EU (Francoforte)</option><option>IT (Milano)</option></select></div>
              <div className="field"><label className="field-label">{lang === 'it' ? 'Retention documenti' : 'Document retention'}</label><select className="select"><option>10 anni</option><option>5 anni</option></select></div>
            </div>
          </Card>

          <div style={{ marginTop: 'var(--gap)' }} />
          <Card
            title={lang === 'it' ? 'Nuclei in questo tenant' : 'Households in this tenant'}
            service="household-service"
            action={<Button size="sm" icon="plus">{lang === 'it' ? 'Nuovo nucleo' : 'New household'}</Button>}
          >
            <div className="list">
              {data.households.map(h => (
                <div key={h.id} className="row">
                  <div className="row-icon"><Icon name="users" size={14} /></div>
                  <div className="row-main">
                    <div className="row-title">{h.name}</div>
                    <div className="row-meta">{data.members.length} {lang === 'it' ? 'membri' : 'members'} · {data.properties.length} {lang === 'it' ? 'immobili' : 'properties'} · {lang === 'it' ? 'creato' : 'created'} {h.createdAt}</div>
                  </div>
                  <Badge kind="success">{t('common.active')}</Badge>
                </div>
              ))}
              <div className="row">
                <div className="row-icon" style={{ background: 'transparent', border: '1.5px dashed var(--border)' }}><Icon name="plus" size={14} /></div>
                <div className="row-main"><div className="row-title text-muted">{lang === 'it' ? 'Aggiungi un altro nucleo (es. genitori anziani, proprietà condivise)' : 'Add another household (e.g. elderly parents, shared property)'}</div></div>
              </div>
            </div>
          </Card>

          <div style={{ marginTop: 'var(--gap)' }} />
          <Card title={lang === 'it' ? 'Sicurezza' : 'Security'} service="identity-service">
            <div className="vstack" style={{ gap: 10 }}>
              <SecRow title={lang === 'it' ? 'Autenticazione a due fattori' : '2-factor authentication'} sub={lang === 'it' ? 'Tramite app autenticatore · Attiva' : 'Via authenticator app · Enabled'} on />
              <SecRow title={lang === 'it' ? 'Sessioni attive' : 'Active sessions'} sub="3 · Mac Milano, iPhone Marco, iPad Giulia" />
              <SecRow title="Single Sign-On" sub={lang === 'it' ? 'Accedi con Apple · Google' : 'Sign in with Apple · Google'} on />
              <SecRow title={lang === 'it' ? 'Backup codici' : 'Backup codes'} sub={lang === 'it' ? '10 codici generati il 12/03/2026' : '10 codes generated 12/03/2026'} />
            </div>
          </Card>
        </div>

        <div className="col-4">
          <Card title={lang === 'it' ? 'Fatturazione' : 'Billing'} service="tenant-service">
            <div className="stat-value">{formatCurrency(9, lang)}</div>
            <div className="stat-label">Famiglia Plus · {lang === 'it' ? 'fatturato mensilmente' : 'billed monthly'}</div>
            <div className="sep" />
            <div className="vstack" style={{ gap: 6, fontSize: 13 }}>
              <div className="hstack" style={{ justifyContent: 'space-between' }}><span className="text-muted">{lang === 'it' ? 'Prossimo addebito' : 'Next charge'}</span><span className="mono">15 mag 2026</span></div>
              <div className="hstack" style={{ justifyContent: 'space-between' }}><span className="text-muted">{lang === 'it' ? 'Metodo' : 'Method'}</span><span className="mono">Visa *1199</span></div>
              <div className="hstack" style={{ justifyContent: 'space-between' }}><span className="text-muted">{lang === 'it' ? 'Fatture' : 'Invoices'}</span><a style={{ color: 'var(--accent-text)', fontWeight: 500, cursor: 'pointer' }}>{lang === 'it' ? 'Vedi tutte' : 'View all'} →</a></div>
            </div>
          </Card>

          <div style={{ marginTop: 'var(--gap)' }} />
          <Card title={lang === 'it' ? 'Integrazioni' : 'Integrations'}>
            {['Google Calendar', 'Apple iCloud', 'Open Banking (CBI)', 'Agenzia Entrate', 'SPID', 'PagoPA'].map(i => (
              <div key={i} className="hstack" style={{ padding: '8px 0', borderBottom: '1px solid var(--divider)' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--bg-subtle)', display: 'grid', placeItems: 'center' }}><Icon name="link" size={12} /></div>
                <span className="flex-1" style={{ marginLeft: 10, fontSize: 13 }}>{i}</span>
                <Badge kind={['Google Calendar', 'Apple iCloud'].includes(i) ? 'success' : 'neutral'}>{['Google Calendar', 'Apple iCloud'].includes(i) ? 'ON' : '—'}</Badge>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
