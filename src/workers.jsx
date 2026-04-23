import { useState } from 'react';
import { tFn, formatCurrency, formatCurrencyFull, formatDate } from './i18n.js';
import { Icon } from './icons.jsx';
import { Card, EmptyState, Button, Badge, Avatar } from './ui.jsx';
import { PageHeader } from './household.jsx';
import { useWorkers, useProperties } from './api/hooks.js';
import { WorkerForm } from './forms/index.jsx';

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
  const { data: workers = [], isLoading } = useWorkers();
  const { data: properties = [] } = useProperties();
  const [formItem, setFormItem] = useState(false);

  if (isLoading) return <div className="page"><div className="text-muted" style={{ padding: 32 }}>Caricamento…</div></div>;

  if (!workers.length) {
    return (
      <div className="page">
        <PageHeader title={t('nav.workers')} />
        <Card>
          <EmptyState icon="briefcase"
            title={lang === 'it' ? 'Nessun lavoratore' : 'No workers'}
            desc={lang === 'it' ? 'Aggiungi colf, baby-sitter o badanti e gestisci stipendi e contributi.' : 'Add workers and manage salaries and contributions.'}
            cta={<Button variant="primary" icon="plus" onClick={() => setFormItem(null)}>{lang === 'it' ? 'Aggiungi lavoratore' : 'Add worker'}</Button>}
          />
        </Card>
        {formItem !== false && <WorkerForm initial={formItem} properties={properties} lang={lang} onClose={() => setFormItem(false)} />}
      </div>
    );
  }

  const totMonthly = workers.reduce((s, w) => s + (w.monthlyNet || 0) + (w.inpsMonthly || 0), 0);
  const totAnnual = workers.reduce((s, w) => s + (w.monthlyNet || 0) * 12 + (w.inpsMonthly || 0) * 12 + (w.tfrAccrual || 0), 0);

  return (
    <div className="page">
      <PageHeader
        title={t('nav.workers')}
        sub={lang === 'it' ? `${workers.length} collaboratori · ${formatCurrency(totMonthly, lang)}/mese incluso INPS` : `${workers.length} workers · ${formatCurrency(totMonthly, lang)}/month including contributions`}
        actions={<Button variant="primary" icon="plus" onClick={() => setFormItem(null)}>{lang === 'it' ? 'Aggiungi lavoratore' : 'Add worker'}</Button>}
      />

      <div className="grid grid-12">
        {workers.map(w => {
          const daysToSalary = w.nextSalaryDue ? Math.round((new Date(w.nextSalaryDue) - new Date()) / 86400000) : null;
          const daysToInps = w.nextInpsDue ? Math.round((new Date(w.nextInpsDue) - new Date()) / 86400000) : null;
          const prop = properties.find(p => p.id === w.propertyId);
          return (
            <div key={w.id} className="col-6">
              <Card service="worker-service">
                <div className="hstack gap-3">
                  <Avatar name={`${w.firstName} ${w.lastName}`} size="lg" />
                  <div className="flex-1">
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{w.firstName} {w.lastName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{w.role || 'Colf'}{w.hoursWeek ? ` · ${w.hoursWeek}h/${lang === 'it' ? 'sett' : 'wk'}` : ''}</div>
                    {prop && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{lang === 'it' ? 'Presso' : 'At'}: {prop.name}</div>}
                  </div>
                  <button className="icon-btn" onClick={() => setFormItem(w)}><Icon name="more" /></button>
                </div>

                <div className="sep" />

                <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  {w.hourlyGross != null && (
                    <div>
                      <div className="stat-label">{lang === 'it' ? 'Paga oraria' : 'Hourly'}</div>
                      <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>{formatCurrencyFull(w.hourlyGross, lang)}</div>
                    </div>
                  )}
                  {w.monthlyNet != null && (
                    <div>
                      <div className="stat-label">{lang === 'it' ? 'Netto mensile' : 'Monthly net'}</div>
                      <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>{formatCurrency(w.monthlyNet, lang)}</div>
                    </div>
                  )}
                  {w.tfrAccrual != null && (
                    <div>
                      <div className="stat-label">TFR</div>
                      <div className="mono" style={{ fontSize: 15, fontWeight: 600 }}>{formatCurrency(w.tfrAccrual, lang)}</div>
                    </div>
                  )}
                </div>

                {(daysToSalary !== null || daysToInps !== null) && (
                  <>
                    <div className="sep" />
                    <div className="vstack" style={{ gap: 8 }}>
                      {daysToSalary !== null && (
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
                            {w.monthlyNet != null && <span className="mono" style={{ fontWeight: 600 }}>{formatCurrency(w.monthlyNet, lang)}</span>}
                          </div>
                        </div>
                      )}
                      {daysToInps !== null && (
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
                            {w.inpsMonthly != null && <span className="mono" style={{ fontWeight: 600 }}>{formatCurrency(w.inpsMonthly, lang)}</span>}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </Card>
            </div>
          );
        })}

        <div className="col-6">
          <Card title={lang === 'it' ? 'Riepilogo annuo' : 'Yearly summary'} service="budget-service">
            <div className="vstack" style={{ gap: 10 }}>
              <SumRow label={lang === 'it' ? 'Stipendi netti × 12' : 'Net salaries × 12'} value={formatCurrency(workers.reduce((s, w) => s + (w.monthlyNet || 0), 0) * 12, lang)} />
              <SumRow label={lang === 'it' ? 'Contributi INPS' : 'INPS contributions'} value={formatCurrency(workers.reduce((s, w) => s + (w.inpsMonthly || 0), 0) * 12, lang)} />
              <SumRow label="TFR" value={formatCurrency(workers.reduce((s, w) => s + (w.tfrAccrual || 0), 0), lang)} />
              <div className="sep" />
              <SumRow bold label={lang === 'it' ? 'Costo annuo totale' : 'Total yearly cost'} value={formatCurrency(totAnnual, lang)} />
            </div>
          </Card>
        </div>
      </div>

      {formItem !== false && <WorkerForm initial={formItem} properties={properties} lang={lang} onClose={() => setFormItem(false)} />}
    </div>
  );
}
