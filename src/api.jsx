import { useState } from 'react';
import { getData } from './data.js';
import { Icon } from './icons.jsx';
import { Card, Button, ServiceChip } from './ui.jsx';
import { PageHeader } from './household.jsx';

export function ApiPage({ state }) {
  const lang = state.lang;
  const [open, setOpen] = useState({});
  const data = getData(state.empty);

  const services = [
    {
      id: 'identity',
      name: 'identity-service',
      desc: lang === 'it' ? 'Autenticazione, SSO, MFA, sessioni, ruoli globali.' : 'Auth, SSO, MFA, sessions, global roles.',
      endpoints: [
        { m: 'POST', p: '/v1/auth/login', d: 'Login email+password o SSO' },
        { m: 'POST', p: '/v1/auth/mfa/verify', d: 'Conferma codice MFA' },
        { m: 'POST', p: '/v1/auth/sessions/revoke', d: 'Revoca sessione' },
        { m: 'GET', p: '/v1/users/me', d: 'Utente corrente' },
        { m: 'PATCH', p: '/v1/users/me', d: 'Aggiorna profilo' },
      ],
      schema: `User {\n  id: string // uuid\n  email: string\n  firstName: string\n  lastName: string\n  roles: ('owner'|'partner'|'adult_child'|'dependent'|'advisor'|'property_manager')[]\n  mfaEnabled: boolean\n  createdAt: ISO8601\n}`,
    },
    {
      id: 'tenant',
      name: 'tenant-service',
      desc: lang === 'it' ? 'Gestione multi-tenant, piani, billing.' : 'Multi-tenancy, plans, billing.',
      endpoints: [
        { m: 'GET', p: '/v1/tenants/:tenantId', d: 'Dettagli tenant' },
        { m: 'POST', p: '/v1/tenants', d: 'Crea tenant' },
        { m: 'PATCH', p: '/v1/tenants/:tenantId', d: 'Aggiorna tenant' },
        { m: 'GET', p: '/v1/tenants/:tenantId/billing', d: 'Piano & fatturazione' },
        { m: 'POST', p: '/v1/tenants/:tenantId/invites', d: 'Invita utente' },
      ],
      schema: `Tenant {\n  id: string\n  name: string\n  plan: 'Base'|'Famiglia Plus'|'Advisor'\n  region: 'eu'|'it'\n  households: string[] // hh ids\n}`,
    },
    {
      id: 'household',
      name: 'household-service',
      desc: lang === 'it' ? 'Nuclei, membri, ruoli locali, relazioni.' : 'Households, members, roles, relations.',
      endpoints: [
        { m: 'GET', p: '/v1/tenants/:tenantId/households', d: 'Lista nuclei' },
        { m: 'POST', p: '/v1/tenants/:tenantId/households', d: 'Crea nucleo' },
        { m: 'GET', p: '/v1/households/:id', d: 'Dettagli nucleo' },
        { m: 'POST', p: '/v1/households/:id/members', d: 'Aggiungi membro' },
        { m: 'DELETE', p: '/v1/households/:id/members/:memberId', d: 'Rimuovi membro' },
      ],
      schema: `Member {\n  id: string\n  householdId: string\n  firstName: string\n  lastName: string\n  birthDate: date\n  role: enum\n  relation: string // 'padre'|'madre'|'figlio'|'nonno'|...\n}`,
    },
    {
      id: 'property',
      name: 'property-service',
      desc: lang === 'it' ? 'Immobili + veicoli associati al nucleo.' : 'Properties + vehicles per household.',
      endpoints: [
        { m: 'GET', p: '/v1/households/:hhId/properties', d: 'Lista immobili' },
        { m: 'POST', p: '/v1/households/:hhId/properties', d: 'Nuovo immobile' },
        { m: 'PATCH', p: '/v1/properties/:id', d: 'Aggiorna' },
        { m: 'GET', p: '/v1/households/:hhId/vehicles', d: 'Lista veicoli' },
      ],
      schema: `Property {\n  id: string\n  householdId: string\n  name: string\n  type: 'home'|'office'|'vacation'|'rental'|'other'\n  role: 'residence'|'rented'|'owned_rented_out'\n  address: string\n  size: number // m2\n  rooms: number\n}`,
    },
    {
      id: 'contract',
      name: 'contract-service',
      desc: lang === 'it' ? 'Utenze, affitti, mutui, assicurazioni, subs.' : 'Utilities, rent, mortgages, insurance, subs.',
      endpoints: [
        { m: 'GET', p: '/v1/households/:hhId/contracts', d: 'Lista contratti' },
        { m: 'POST', p: '/v1/households/:hhId/contracts', d: 'Nuovo contratto' },
        { m: 'GET', p: '/v1/contracts/:id', d: 'Dettagli' },
        { m: 'PATCH', p: '/v1/contracts/:id', d: 'Aggiorna' },
        { m: 'POST', p: '/v1/contracts/:id/payments', d: 'Registra pagamento' },
      ],
      schema: `Contract {\n  id: string\n  householdId: string\n  type: 'utility_power'|'utility_gas'|'utility_water'|'utility_internet'|'rent'|'mortgage'|'insurance'|'subscription'\n  provider: string\n  clientCode: string\n  amountMonthly: number\n  billingCycle: 'monthly'|'bimonthly'|'quarterly'|'yearly'\n  nextDue: ISO8601\n  autopay: boolean\n  paymentMethod: string\n  propertyId?: string\n  vehicleId?: string\n}`,
    },
    {
      id: 'worker',
      name: 'worker-service',
      desc: lang === 'it' ? 'Colf, baby-sitter, badanti: stipendi, INPS, TFR.' : 'Domestic workers: salaries, contributions, TFR.',
      endpoints: [
        { m: 'GET', p: '/v1/households/:hhId/workers', d: 'Lista lavoratori' },
        { m: 'POST', p: '/v1/households/:hhId/workers', d: 'Nuovo lavoratore' },
        { m: 'POST', p: '/v1/workers/:id/payslips', d: 'Genera busta paga' },
        { m: 'POST', p: '/v1/workers/:id/inps', d: 'Registra contributo' },
      ],
      schema: `Worker {\n  id: string\n  householdId: string\n  firstName: string, lastName: string\n  role: 'colf'|'babysitter'|'badante'|'other'\n  contractType: 'part_time_indeterminato'|'full_time_indeterminato'|'determinato'\n  hoursWeek: number\n  hourlyGross: number\n  monthlyNet: number\n  inpsMonthly: number\n  tfrAccrual: number\n  startDate: date\n  propertyId?: string\n}`,
    },
    {
      id: 'deadline',
      name: 'deadline-service',
      desc: lang === 'it' ? 'Calcolo e orchestrazione scadenze (aggrega contratti + worker + tasse).' : 'Deadline orchestration (aggregates contracts + workers + taxes).',
      endpoints: [
        { m: 'GET', p: '/v1/households/:hhId/deadlines?from=&to=&category=', d: 'Query scadenze' },
        { m: 'POST', p: '/v1/households/:hhId/deadlines', d: 'Crea custom' },
        { m: 'POST', p: '/v1/deadlines/:id/complete', d: 'Segna completata' },
        { m: 'POST', p: '/v1/deadlines/:id/snooze', d: 'Rimanda di N giorni' },
      ],
      schema: `Deadline {\n  id: string\n  householdId: string\n  title: string\n  category: 'util'|'rent'|'worker'|'tax'|'insurance'|'subscription'|'health'|'family'|'doc'\n  amount: number\n  date: ISO8601\n  recurring: 'monthly'|'quarterly'|'yearly'|'one-time'|'biennial'|'semiannual'\n  autopay: boolean\n  sourceType: 'contract'|'worker'|'custom'\n  sourceId?: string\n}`,
    },
    {
      id: 'budget',
      name: 'budget-service',
      desc: lang === 'it' ? 'Bilancio familiare, categorie, trend, previsioni.' : 'Budget, categories, trends, forecasts.',
      endpoints: [
        { m: 'GET', p: '/v1/households/:hhId/budget/summary?period=month', d: 'Riepilogo' },
        { m: 'GET', p: '/v1/households/:hhId/budget/cashflow?months=6', d: 'Serie storica' },
        { m: 'POST', p: '/v1/households/:hhId/transactions', d: 'Registra movimento' },
      ],
      schema: `Transaction {\n  id: string\n  householdId: string\n  kind: 'income'|'outflow'\n  amount: number\n  category: string\n  linkedTo?: string // contract/worker/deadline\n  date: ISO8601\n  note?: string\n}`,
    },
    {
      id: 'calendar',
      name: 'calendar-service',
      desc: lang === 'it' ? 'Integrazione Google/Apple/Outlook · webhook bidirezionali.' : 'Google/Apple/Outlook integration · 2-way webhooks.',
      endpoints: [
        { m: 'POST', p: '/v1/calendar/providers/:provider/connect', d: 'OAuth start' },
        { m: 'POST', p: '/v1/calendar/webhook/:provider', d: 'Webhook ingress' },
        { m: 'POST', p: '/v1/calendar/sync/:hhId', d: 'Sync forzato' },
        { m: 'GET', p: '/v1/calendar/events?from=&to=', d: 'Eventi aggregati' },
      ],
      schema: `CalendarLink {\n  provider: 'google'|'apple'|'outlook'\n  accountEmail: string\n  status: 'connected'|'disconnected'|'error'\n  lastSync: ISO8601\n  scopes: string[]\n}`,
    },
    {
      id: 'document',
      name: 'document-service',
      desc: lang === 'it' ? 'Archivio cifrato AES-256, OCR, linking a entità.' : 'Encrypted vault AES-256, OCR, entity linking.',
      endpoints: [
        { m: 'POST', p: '/v1/documents', d: 'Upload multipart' },
        { m: 'GET', p: '/v1/documents/:id/download', d: 'Download firmato' },
        { m: 'POST', p: '/v1/documents/:id/ocr', d: 'Trigger OCR' },
      ],
      schema: `Document {\n  id: string\n  householdId: string\n  name: string\n  type: 'contract'|'insurance'|'payslip'|'vehicle'|'tax'|'other'\n  size: number\n  uploadedAt: ISO8601\n  linkedTo?: string\n  encrypted: boolean\n}`,
    },
    {
      id: 'notification',
      name: 'notification-service',
      desc: lang === 'it' ? 'Push, email, SMS, WhatsApp · orchestrato su regole.' : 'Push, email, SMS, WhatsApp · rules engine.',
      endpoints: [
        { m: 'GET', p: '/v1/notifications?unread=true', d: 'Lista notifiche' },
        { m: 'POST', p: '/v1/notifications/:id/read', d: 'Marca come letta' },
        { m: 'GET', p: '/v1/notifications/preferences', d: 'Canali + preavvisi' },
        { m: 'PATCH', p: '/v1/notifications/preferences', d: 'Aggiorna preferenze' },
      ],
      schema: `NotificationRule {\n  channel: 'push'|'email'|'sms'|'whatsapp'\n  enabled: boolean\n  reminderOffsetsDays: number[] // es. [30,14,7,3,1]\n}`,
    },
  ];

  return (
    <div className="page">
      <PageHeader
        title={lang === 'it' ? 'API & Microservizi' : 'API & Microservices'}
        sub={lang === 'it' ? 'Contratti REST per handoff al backend · base URL: https://api.notifamily.app' : 'REST contracts for backend handoff · base URL: https://api.notifamily.app'}
        actions={<><Button icon="download">OpenAPI 3.1</Button><Button icon="download">Postman</Button></>}
      />

      <Card title={lang === 'it' ? 'Architettura' : 'Architecture'} subtitle={lang === 'it' ? 'Comunicazione via REST/JSON · autenticazione JWT + tenant-id header · event bus interno Kafka.' : 'REST/JSON · JWT + tenant-id header · internal Kafka event bus.'}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
          {data.services.map(s => (
            <div key={s.id} style={{ padding: 12, background: 'var(--bg-subtle)', borderRadius: 10, border: '1px solid var(--border)' }}>
              <div className="hstack gap-2" style={{ justifyContent: 'space-between' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
                <span className="mono" style={{ fontSize: 10, color: 'var(--text-3)' }}>v{s.version}</span>
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--text)', marginTop: 8, wordBreak: 'break-word' }}>{s.name}</div>
              <div className="mono" style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 4 }}>{s.latency}ms p50</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ marginTop: 'var(--section-gap)' }}>
        {services.map(s => (
          <Card key={s.id} style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div>
                <div className="card-title mono">{s.name}</div>
                <div className="card-subtitle">{s.desc}</div>
              </div>
              <ServiceChip name={s.name} />
            </div>
            <div>
              {s.endpoints.map((ep, i) => (
                <div key={i} className="api-endpoint">
                  <div className="api-line" onClick={() => setOpen(o => ({ ...o, [s.id + i]: !o[s.id + i] }))}>
                    <span className={`api-method ${ep.m}`}>{ep.m}</span>
                    <span className="api-path">{ep.p}</span>
                    <span className="api-desc">{ep.d}</span>
                    <Icon name={open[s.id + i] ? 'chevronUp' : 'chevronDown'} size={14} style={{ color: 'var(--text-3)' }} />
                  </div>
                  {open[s.id + i] && (
                    <div className="api-body">{s.schema}</div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
