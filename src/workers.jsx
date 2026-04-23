import { tFn, formatCurrency, formatCurrencyFull, formatDate } from './i18n.js';
import { getData } from './data.js';
import { Icon } from './icons.jsx';
import { Card, EmptyState, Button, Badge, Avatar } from './ui.jsx';
import { PageHeader } from './household.jsx';

export function SumRow({ label, value, bold }) {
  return (
    <div className="hstack" style={{ justifyContent: 'space-between', fontSize: 14, fontWeight: bold ? 600 : 400 }}>
      <span className={bold ? '' : 'text-muted'}>{label}</span>
      <span className="mono">{value}</span>
    </div>
  );
}

export function WorkersPage({ state }) {
  const t = tFn(state.lang);
  const lang = state.lang;
  const data = getData(state.empty);

  if (state.empty) {
    return (
      <div className="page">
        <PageHeader title={t('nav.workers')} />
        <Card><EmptyState icon="briefcase" title={lang === 'it' ? 'Nessun lavoratore' : 'No workers'} desc={lang === 'it' ? 'Aggiungi colf, baby-sitter o badanti e gestisci stipendi e contributi.' : 'Add workers and manage salaries and contributions.'} cta={<Button variant="primary" icon="plus">{lang === 'it' ? 'Aggiungi lavoratore' : 'Add worker'}</Button>} /></Card>
      </div>
    );
  }

  const totMonthly = data.workers.reduce((s, w) => s + w.monthlyNet + w.inpsMonthly, 0);

  return (
    <div className="page">
      <PageHeader
        title={t('nav.workers')}
        sub={lang === 'it' ? `${data.workers.length} collaboratori · ${formatCurrency(totMonthly, lang)}/mese incluso INPS` : `${data.workers.length} workers · ${formatCurrency(totMonthly, lang)}/month including contributions`}
        actions={<Button variant="primary" icon="plus">{lang === 'it' ? 'Aggiungi lavoratore' : 'Add worker'}</Button>}
      />

      <div className="grid grid-12">
        {data.workers.map(w => {
          const daysToSalary = Math.round((new Date(w.nextSalaryDue) - new Date()) / 86400000);
          const daysToInps = Math.round((new Date(w.nextInpsDue) - new Date()) / 86400000);
          const prop = data.properties.find(p => p.id === w.propertyId);
          return (
            <div key={w.id} className="col-6">
              <Card service="worker-service">
                <div className="hstack gap-3">
                  <Avatar name={`${w.firstName} ${w.lastName}`} color={300} size="lg" />
                  <div className="flex-1">
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{w.firstName} {w.lastName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>Colf · {lang === 'it' ? 'Part-time indeterminato' : 'Part-time permanent'} · {w.hoursWeek}h/{lang === 'it' ? 'sett' : 'wk'}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{lang === 'it' ? 'Presso' : 'At'}: {prop?.name}</div>
                  </div>
                  <button className="icon-btn"><Icon name="more" /></button>
                </div>

                <div className="sep" />

                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <div className="stat-label">{lang === 'it' ? 'Paga oraria' : 'Hourly'}</div>
                    <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>{formatCurrencyFull(w.hourlyGross, lang)}</div>
                  </div>
                  <div>
                    <div className="stat-label">{lang === 'it' ? 'Netto mensile' : 'Monthly net'}</div>
                    <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>{formatCurrency(w.monthlyNet, lang)}</div>
                  </div>
                  <div>
                    <div className="stat-label">TFR</div>
                    <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>{formatCurrency(w.tfrAccrual, lang)}</div>
                  </div>
                </div>

                <div className="sep" />

                <div className="vstack" style={{ gap: 8 }}>
                  <div className="hstack" style={{ padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 10, justifyContent: 'space-between' }}>
                    <div className="hstack gap-2">
                      <Icon name="wallet" size={14} style={{ color: 'var(--cat-worker)' }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{lang === 'it' ? 'Prossimo stipendio' : 'Next salary'}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{formatDate(new Date(w.nextSalaryDue), lang, { day: 'numeric', month: 'long' })}</div>
                      </div>
                    </div>
                    <div className="hstack gap-2">
                      <Badge kind={daysToSalary < 7 ? 'warning' : 'neutral'}>{daysToSalary}g</Badge>
                      <span className="mono" style={{ fontWeight: 600 }}>{formatCurrency(w.monthlyNet, lang)}</span>
                    </div>
                  </div>

                  <div className="hstack" style={{ padding: '10px 12px', background: 'var(--bg-subtle)', borderRadius: 10, justifyContent: 'space-between' }}>
                    <div className="hstack gap-2">
                      <Icon name="receipt" size={14} style={{ color: 'var(--cat-tax)' }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{lang === 'it' ? 'Contributi INPS' : 'INPS contributions'}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{formatDate(new Date(w.nextInpsDue), lang, { day: 'numeric', month: 'long' })}</div>
                      </div>
                    </div>
                    <div className="hstack gap-2">
                      <Badge kind={daysToInps < 7 ? 'warning' : 'neutral'}>{daysToInps}g</Badge>
                      <span className="mono" style={{ fontWeight: 600 }}>{formatCurrency(w.inpsMonthly, lang)}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          );
        })}

        <div className="col-6">
          <Card title={lang === 'it' ? 'Riepilogo annuo' : 'Yearly summary'} service="budget-service">
            <div className="vstack" style={{ gap: 10 }}>
              <SumRow label={lang === 'it' ? 'Stipendi lordi' : 'Gross salaries'} value={formatCurrency(9120, lang)} />
              <SumRow label={lang === 'it' ? 'Contributi INPS' : 'INPS contributions'} value={formatCurrency(1776, lang)} />
              <SumRow label="TFR" value={formatCurrency(756, lang)} />
              <SumRow label="13a / 14a" value={formatCurrency(1520, lang)} />
              <div className="sep" />
              <SumRow bold label={lang === 'it' ? 'Costo annuo totale' : 'Total yearly cost'} value={formatCurrency(13172, lang)} />
            </div>
          </Card>
          <div style={{ marginTop: 'var(--gap)' }} />
          <Card title={lang === 'it' ? 'Scadenze INPS prossime' : 'Upcoming INPS deadlines'}>
            <div className="list">
              <div className="row">
                <div className="row-icon" style={{ color: 'var(--cat-tax)' }}><Icon name="receipt" size={14} /></div>
                <div className="row-main"><div className="row-title">Q2 2026 · Trimestre aprile-giugno</div><div className="row-meta">{lang === 'it' ? 'Entro 10 luglio 2026' : 'By July 10, 2026'}</div></div>
                <div className="row-amount mono">{formatCurrency(444, lang)}</div>
              </div>
              <div className="row">
                <div className="row-icon" style={{ color: 'var(--cat-tax)' }}><Icon name="receipt" size={14} /></div>
                <div className="row-main"><div className="row-title">Q3 2026</div><div className="row-meta">{lang === 'it' ? 'Entro 10 ottobre 2026' : 'By October 10, 2026'}</div></div>
                <div className="row-amount mono">{formatCurrency(444, lang)}</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
