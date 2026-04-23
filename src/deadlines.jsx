import { useState } from 'react';
import { tFn, formatCurrency } from './i18n.js';
import { Card, EmptyState, Button } from './ui.jsx';
import { DeadlineRow } from './dashboard.jsx';
import { PageHeader } from './household.jsx';
import { useEvents } from './api/hooks.js';
import { EventForm } from './forms/index.jsx';

export function DeadlinesPage({ state, setState }) {
  const t = tFn(state.lang);
  const lang = state.lang;
  const { data: events = [], isLoading } = useEvents();
  const [formItem, setFormItem] = useState(false);

  if (isLoading) return <div className="page"><div className="text-muted" style={{ padding: 32 }}>Caricamento…</div></div>;

  if (!events.length) {
    return (
      <div className="page">
        <PageHeader title={t('nav.deadlines')} />
        <Card>
          <EmptyState icon="clock"
            title={lang === 'it' ? 'Nessuna scadenza' : 'No deadlines'}
            desc={lang === 'it' ? 'Aggiungi eventi o contratti per vedere le scadenze.' : 'Add events or contracts to see deadlines.'}
            cta={<Button variant="primary" icon="plus" onClick={() => setFormItem(null)}>{lang === 'it' ? 'Nuova scadenza' : 'New deadline'}</Button>}
          />
        </Card>
        {formItem !== false && <EventForm initial={formItem} lang={lang} onClose={() => setFormItem(false)} />}
      </div>
    );
  }

  const now = new Date();
  const groups = {
    overdue: events.filter(e => new Date(e.date) < now),
    week: events.filter(e => { const d = (new Date(e.date) - now) / 86400000; return d >= 0 && d <= 7; }),
    month: events.filter(e => { const d = (new Date(e.date) - now) / 86400000; return d > 7 && d <= 30; }),
    later: events.filter(e => { const d = (new Date(e.date) - now) / 86400000; return d > 30; }),
  };

  return (
    <div className="page">
      <PageHeader
        title={t('nav.deadlines')}
        sub={lang === 'it' ? `${events.length} scadenze tracciate` : `${events.length} tracked deadlines`}
        actions={<Button variant="primary" icon="plus" onClick={() => setFormItem(null)}>{lang === 'it' ? 'Nuova scadenza' : 'New deadline'}</Button>}
      />

      <div className="vstack" style={{ gap: 'var(--gap)' }}>
        {groups.overdue.length > 0 && (
          <Card service="deadline-service">
            <div className="card-header">
              <div className="card-title" style={{ color: 'var(--danger)' }}>{lang === 'it' ? 'In ritardo' : 'Overdue'} · {groups.overdue.length}</div>
            </div>
            <div className="list">{groups.overdue.map(e => <DeadlineRow key={e.id} ev={e} lang={lang} />)}</div>
          </Card>
        )}
        <Card service="deadline-service">
          <div className="card-header">
            <div className="card-title">{lang === 'it' ? 'Prossimi 7 giorni' : 'Next 7 days'} · {groups.week.length}</div>
            <span className="mono text-muted" style={{ fontSize: 12 }}>{formatCurrency(groups.week.reduce((s, e) => s + (e.amount || 0), 0), lang)}</span>
          </div>
          <div className="list">{groups.week.map(e => <DeadlineRow key={e.id} ev={e} lang={lang} />)}</div>
        </Card>
        <Card service="deadline-service">
          <div className="card-header">
            <div className="card-title">{lang === 'it' ? 'Entro 30 giorni' : 'Within 30 days'} · {groups.month.length}</div>
            <span className="mono text-muted" style={{ fontSize: 12 }}>{formatCurrency(groups.month.reduce((s, e) => s + (e.amount || 0), 0), lang)}</span>
          </div>
          <div className="list">{groups.month.map(e => <DeadlineRow key={e.id} ev={e} lang={lang} />)}</div>
        </Card>
        <Card service="deadline-service">
          <div className="card-header">
            <div className="card-title">{lang === 'it' ? 'Più avanti' : 'Later'} · {groups.later.length}</div>
          </div>
          <div className="list">{groups.later.slice(0, 8).map(e => <DeadlineRow key={e.id} ev={e} lang={lang} />)}</div>
        </Card>
      </div>

      {formItem !== false && <EventForm initial={formItem} lang={lang} onClose={() => setFormItem(false)} />}
    </div>
  );
}
