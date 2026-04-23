import { tFn, formatCurrency } from './i18n.js';
import { getData } from './data.js';
import { Card, EmptyState, Button, Badge, Seg, CashflowChart, Donut } from './ui.jsx';
import { PageHeader } from './household.jsx';
import { SumRow } from './workers.jsx';

export function BudgetPage({ state }) {
  const t = tFn(state.lang);
  const lang = state.lang;
  const data = getData(state.empty);

  if (state.empty) {
    return (
      <div className="page">
        <PageHeader title={t('nav.budget')} />
        <Card><EmptyState icon="wallet" title={lang === 'it' ? 'Bilancio vuoto' : 'Empty budget'} desc={lang === 'it' ? "Registra entrate e spese per vedere l'andamento del nucleo." : 'Add income and expenses to see trends.'} /></Card>
      </div>
    );
  }

  const categories = [
    { k: 'util', l: lang === 'it' ? 'Utenze' : 'Utilities', v: 412, c: 'var(--cat-util)' },
    { k: 'rent', l: lang === 'it' ? 'Mutuo e affitto' : 'Mortgage & rent', v: 1960, c: 'var(--cat-rent)' },
    { k: 'worker', l: lang === 'it' ? 'Colf & INPS' : 'Worker & INPS', v: 908, c: 'var(--cat-worker)' },
    { k: 'tax', l: lang === 'it' ? 'Tasse' : 'Taxes', v: 220, c: 'var(--cat-tax)' },
    { k: 'subscription', l: lang === 'it' ? 'Abbonamenti' : 'Subscriptions', v: 100, c: 'var(--cat-subscription)' },
    { k: 'insurance', l: lang === 'it' ? 'Assicurazioni' : 'Insurance', v: 124, c: 'var(--cat-insurance)' },
    { k: 'family', l: lang === 'it' ? 'Famiglia e salute' : 'Family & health', v: 56, c: 'var(--cat-family)' },
  ];
  const total = categories.reduce((s, x) => s + x.v, 0);

  return (
    <div className="page">
      <PageHeader
        title={t('nav.budget')}
        sub={lang === 'it' ? 'Bilancio familiare · aprile 2026' : 'Family budget · April 2026'}
        actions={<><Seg value="month" onChange={() => {}} options={[{ value: 'month', label: t('common.month') }, { value: 'year', label: t('common.year') }]} /><Button variant="primary" icon="plus">{lang === 'it' ? 'Registra movimento' : 'Log transaction'}</Button></>}
      />

      <div className="grid grid-12">
        <div className="col-4">
          <Card title={lang === 'it' ? 'Entrate' : 'Income'} service="budget-service">
            <div className="stat-value" style={{ color: 'var(--success)' }}>{formatCurrency(5400, lang)}</div>
            <div className="stat-label">{lang === 'it' ? 'Aprile · 2 fonti' : 'April · 2 sources'}</div>
            <div className="sep" />
            <SumRow label="Stipendio Marco" value={formatCurrency(3200, lang)} />
            <SumRow label="Stipendio Giulia" value={formatCurrency(2200, lang)} />
          </Card>
        </div>
        <div className="col-4">
          <Card title={lang === 'it' ? 'Uscite' : 'Outflow'} service="budget-service">
            <div className="stat-value" style={{ color: 'var(--accent)' }}>{formatCurrency(3780, lang)}</div>
            <div className="stat-label">{lang === 'it' ? '32 movimenti · 7 categorie' : '32 transactions · 7 categories'}</div>
            <div className="sep" />
            <SumRow label={lang === 'it' ? 'Fisse' : 'Fixed'} value={formatCurrency(3280, lang)} />
            <SumRow label={lang === 'it' ? 'Variabili' : 'Variable'} value={formatCurrency(500, lang)} />
          </Card>
        </div>
        <div className="col-4">
          <Card title={lang === 'it' ? 'Saldo' : 'Balance'} service="budget-service">
            <div className="stat-value">{formatCurrency(1620, lang)}</div>
            <div className="hstack gap-2">
              <Badge kind="success">+30%</Badge>
              <span className="stat-label">{lang === 'it' ? 'vs target mensile' : 'vs monthly target'}</span>
            </div>
            <div className="sep" />
            <div className="meter"><div className="meter-bar" style={{ width: '70%', background: 'var(--success)' }} /></div>
            <div className="hstack" style={{ justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--text-3)' }}>
              <span>{lang === 'it' ? 'Risparmio YTD' : 'YTD savings'}</span>
              <span className="mono">{formatCurrency(5480, lang)}</span>
            </div>
          </Card>
        </div>

        <div className="col-8">
          <Card
            title={lang === 'it' ? 'Andamento 6 mesi' : '6-month trend'}
            service="budget-service"
            action={
              <div className="chart-legend">
                <div className="chart-legend-item"><span className="chart-legend-dot" style={{ background: 'var(--success)' }} />{lang === 'it' ? 'Entrate' : 'Income'}</div>
                <div className="chart-legend-item"><span className="chart-legend-dot" style={{ background: 'var(--accent)' }} />{lang === 'it' ? 'Uscite' : 'Outflow'}</div>
              </div>
            }>
            <CashflowChart lang={lang} height={260} />
          </Card>
        </div>
        <div className="col-4">
          <Card title={lang === 'it' ? 'Ripartizione spese' : 'Expense breakdown'} service="budget-service">
            <div style={{ display: 'grid', placeItems: 'center', margin: '8px 0 16px' }}>
              <Donut segments={categories.map(c => ({ value: c.v, color: c.c }))} size={140} stroke={22} />
            </div>
            <div className="vstack" style={{ gap: 6 }}>
              {categories.map(c => (
                <div key={c.k} className="hstack" style={{ fontSize: 13 }}>
                  <span className="chart-legend-dot" style={{ background: c.c, width: 8, height: 8, borderRadius: 2 }} />
                  <span className="text-muted" style={{ marginLeft: 8 }}>{c.l}</span>
                  <span className="spacer" />
                  <span className="mono" style={{ fontWeight: 500 }}>{formatCurrency(c.v, lang)}</span>
                  <span className="text-muted mono" style={{ fontSize: 11, width: 40, textAlign: 'right' }}>{Math.round(c.v / total * 100)}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
