import { useState } from 'react';
import { tFn, formatCurrency } from './i18n.js';
import { Card, EmptyState, Button, Badge, Seg, CashflowChart, Donut } from './ui.jsx';
import { PageHeader } from './household.jsx';
import { SumRow } from './workers.jsx';
import { useTransactions, useBudgetSummary, useDeleteTransaction } from './api/hooks.js';
import { TransactionForm } from './forms/index.jsx';
import { Icon } from './icons.jsx';

const CAT_COLORS = {
  salary: 'var(--success)',
  util: 'var(--cat-util)',
  rent: 'var(--cat-rent)',
  worker: 'var(--cat-worker)',
  tax: 'var(--cat-tax)',
  insurance: 'var(--cat-insurance)',
  subscription: 'var(--cat-subscription)',
  health: 'var(--cat-health)',
  family: 'var(--cat-family)',
  other: 'var(--text-3)',
};

export function BudgetPage({ state }) {
  const t = tFn(state.lang);
  const lang = state.lang;
  const [period, setPeriod] = useState('month');
  const { data: transactions = [], isLoading } = useTransactions(period);
  const { data: summary } = useBudgetSummary();
  const [formOpen, setFormOpen] = useState(false);
  const delTx = useDeleteTransaction();

  const it = lang === 'it';

  if (isLoading) return <div className="page"><div className="text-muted" style={{ padding: 32 }}>Caricamento…</div></div>;

  const income = summary?.income ?? transactions.filter(tx => tx.type === 'income').reduce((s, tx) => s + (tx.amount || 0), 0);
  const outflow = summary?.outflow ?? transactions.filter(tx => tx.type === 'expense').reduce((s, tx) => s + (tx.amount || 0), 0);
  const balance = (summary?.balance ?? (income - outflow));

  const expenseTxs = transactions.filter(tx => tx.type === 'expense');
  const byCat = {};
  expenseTxs.forEach(tx => { byCat[tx.category] = (byCat[tx.category] || 0) + (tx.amount || 0); });
  const catLabels = it
    ? { salary: 'Stipendio', util: 'Utenze', rent: 'Affitto/Mutuo', worker: 'Lavoratori', tax: 'Tasse', insurance: 'Assicurazioni', subscription: 'Abbonamenti', health: 'Salute', family: 'Famiglia', other: 'Altro' }
    : { salary: 'Salary', util: 'Utilities', rent: 'Rent/Mortgage', worker: 'Workers', tax: 'Taxes', insurance: 'Insurance', subscription: 'Subscriptions', health: 'Health', family: 'Family', other: 'Other' };
  const categories = Object.entries(byCat).map(([k, v]) => ({ k, v, c: CAT_COLORS[k] || 'var(--text-3)', l: catLabels[k] || k }));

  const now = new Date();
  const monthName = now.toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-US', { month: 'long', year: 'numeric' });

  if (!transactions.length) {
    return (
      <div className="page">
        <PageHeader title={t('nav.budget')}
          actions={<Button variant="primary" icon="plus" onClick={() => setFormOpen(true)}>{it ? 'Registra movimento' : 'Log transaction'}</Button>}
        />
        <Card><EmptyState icon="wallet" title={it ? 'Bilancio vuoto' : 'Empty budget'} desc={it ? "Registra entrate e spese per vedere l'andamento del nucleo." : 'Add income and expenses to see trends.'} /></Card>
        {formOpen && <TransactionForm lang={lang} onClose={() => setFormOpen(false)} />}
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader
        title={t('nav.budget')}
        sub={it ? `Bilancio familiare · ${monthName}` : `Family budget · ${monthName}`}
        actions={
          <>
            <Seg value={period} onChange={setPeriod} options={[{ value: 'month', label: t('common.month') }, { value: 'year', label: t('common.year') }]} />
            <Button variant="primary" icon="plus" onClick={() => setFormOpen(true)}>{it ? 'Registra movimento' : 'Log transaction'}</Button>
          </>
        }
      />

      <div className="grid grid-12">
        <div className="col-4">
          <Card title={it ? 'Entrate' : 'Income'} service="budget-service">
            <div className="stat-value" style={{ color: 'var(--success)' }}>{formatCurrency(income, lang)}</div>
            <div className="stat-label">{transactions.filter(tx => tx.type === 'income').length} {it ? 'movimenti' : 'transactions'}</div>
            <div className="sep" />
            {transactions.filter(tx => tx.type === 'income').slice(0, 3).map(tx => (
              <SumRow key={tx.id} label={tx.description || (catLabels[tx.category] || tx.category)} value={formatCurrency(tx.amount, lang)} />
            ))}
          </Card>
        </div>
        <div className="col-4">
          <Card title={it ? 'Uscite' : 'Outflow'} service="budget-service">
            <div className="stat-value" style={{ color: 'var(--accent)' }}>{formatCurrency(outflow, lang)}</div>
            <div className="stat-label">{expenseTxs.length} {it ? 'movimenti' : 'transactions'}</div>
            <div className="sep" />
            {categories.slice(0, 3).map(c => (
              <SumRow key={c.k} label={c.l} value={formatCurrency(c.v, lang)} />
            ))}
          </Card>
        </div>
        <div className="col-4">
          <Card title={it ? 'Saldo' : 'Balance'} service="budget-service">
            <div className="stat-value" style={{ color: balance >= 0 ? 'var(--success)' : 'var(--danger)' }}>{formatCurrency(balance, lang)}</div>
            <div className="hstack gap-2">
              <Badge kind={balance >= 0 ? 'success' : 'danger'}>{balance >= 0 ? '+' : ''}{income > 0 ? Math.round((balance / income) * 100) : 0}%</Badge>
              <span className="stat-label">{it ? 'del reddito' : 'of income'}</span>
            </div>
            {income > 0 && (
              <>
                <div className="sep" />
                <div className="meter"><div className="meter-bar" style={{ width: `${Math.min(100, Math.round((outflow / income) * 100))}%`, background: outflow > income ? 'var(--danger)' : 'var(--accent)' }} /></div>
                <div className="hstack" style={{ justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--text-3)' }}>
                  <span>{it ? 'Spese vs entrate' : 'Expenses vs income'}</span>
                  <span className="mono">{Math.round((outflow / income) * 100)}%</span>
                </div>
              </>
            )}
          </Card>
        </div>

        {categories.length > 0 && (
          <div className="col-4">
            <Card title={it ? 'Ripartizione spese' : 'Expense breakdown'} service="budget-service">
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
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        <div className={categories.length > 0 ? 'col-8' : 'col-12'}>
          <Card title={it ? 'Movimenti recenti' : 'Recent transactions'} service="budget-service">
            <div className="list">
              {transactions.slice(0, 20).map(tx => (
                <div key={tx.id} className="row">
                  <div className="row-icon" style={{ color: tx.type === 'income' ? 'var(--success)' : 'var(--accent)' }}>
                    <Icon name={tx.type === 'income' ? 'check' : 'receipt'} size={14} />
                  </div>
                  <div className="row-main">
                    <div className="row-title">{tx.description || (catLabels[tx.category] || tx.category)}</div>
                    <div className="row-meta">{tx.date ? new Date(tx.date).toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-US', { day: 'numeric', month: 'short' }) : ''}</div>
                  </div>
                  <div className="row-amount mono" style={{ color: tx.type === 'income' ? 'var(--success)' : undefined }}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, lang)}
                  </div>
                  <button className="icon-btn" style={{ color: 'var(--text-3)' }} onClick={() => { if (confirm(it ? 'Eliminare?' : 'Delete?')) delTx.mutate(tx.id); }}>
                    <Icon name="x" size={14} />
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {formOpen && <TransactionForm lang={lang} onClose={() => setFormOpen(false)} />}
    </div>
  );
}
