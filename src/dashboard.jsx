import { useState } from 'react';
import { tFn, formatCurrency, formatDate } from './i18n.js';
import { getData, getEvents } from './data.js';
import { Icon, CategoryIcon } from './icons.jsx';
import { Card, Button, Badge, EmptyState, Drawer, Donut } from './ui.jsx';
import { InfoItem } from './calendar.jsx';

export function DashboardPage({ state, setState }) {
  const t = tFn(state.lang);
  const data = getData(state.empty);
  const events = getEvents(state.empty);
  const lang = state.lang;

  if (state.empty) {
    return (
      <div className="page">
        <div className="page-header">
          <div>
            <h1 className="page-title">{t('app.name')}</h1>
            <p className="page-subtitle">{t('app.tagline')}</p>
          </div>
        </div>
        <Card>
          <EmptyState
            icon="users"
            title={t('empty.title')}
            desc={t('empty.desc')}
            cta={<Button variant="primary" icon="plus">{t('empty.cta')}</Button>}
          />
        </Card>
      </div>
    );
  }

  const now = new Date();
  const next30 = events.filter(e => {
    const diff = (new Date(e.date) - now) / (1000*60*60*24);
    return diff >= -1 && diff <= 30;
  });
  const totalNext30 = next30.reduce((s, e) => s + (e.amount || 0), 0);

  const monthSpend = 3780;
  const monthPrev = 4120;
  const delta = ((monthSpend - monthPrev) / monthPrev) * 100;

  const hour = now.getHours();
  const greet = hour < 12 ? t('dashboard.greetingMorning') : hour < 18 ? t('dashboard.greetingAfternoon') : t('dashboard.greetingEvening');

  const byCat = {};
  next30.forEach(e => { byCat[e.category] = (byCat[e.category] || 0) + (e.amount || 0); });
  const catColors = {
    util: 'var(--cat-util)', rent: 'var(--cat-rent)', worker: 'var(--cat-worker)',
    tax: 'var(--cat-tax)', insurance: 'var(--cat-insurance)', subscription: 'var(--cat-subscription)',
    health: 'var(--cat-health)', family: 'var(--cat-family)', doc: 'var(--cat-doc)',
  };
  const catLabels = lang === 'it'
    ? { util: 'Utenze', rent: 'Affitti/Mutui', worker: 'Lavoratori', tax: 'Tasse', insurance: 'Assicurazioni', subscription: 'Abbonamenti', health: 'Salute', family: 'Famiglia', doc: 'Documenti' }
    : { util: 'Utilities', rent: 'Rent/Mortgage', worker: 'Workers', tax: 'Taxes', insurance: 'Insurance', subscription: 'Subscriptions', health: 'Health', family: 'Family', doc: 'Documents' };

  const donutSegs = Object.entries(byCat)
    .sort((a,b) => b[1]-a[1])
    .map(([k, v]) => ({ value: v, color: catColors[k] || 'var(--text-3)', label: catLabels[k] }));

  const [weekCursor, setWeekCursor] = useState(() => new Date());
  const navWeek = (dir) => { const d = new Date(weekCursor); d.setDate(d.getDate() + dir * 7); setWeekCursor(d); };

  const weekMonday = new Date(weekCursor);
  weekMonday.setDate(weekMonday.getDate() - ((weekMonday.getDay() + 6) % 7));
  const weekSunday = new Date(weekMonday); weekSunday.setDate(weekSunday.getDate() + 6);
  const weekEvents = events.filter(e => {
    const d = new Date(e.date);
    return d >= weekMonday && d <= new Date(weekSunday.getFullYear(), weekSunday.getMonth(), weekSunday.getDate(), 23, 59, 59);
  });
  const weekTotal = weekEvents.reduce((s, e) => s + (e.amount || 0), 0);

  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{greet}, Marco</h1>
          <p className="page-subtitle">
            {lang === 'it'
              ? `${next30.length} scadenze nei prossimi 30 giorni · ${weekEvents.length} questa settimana · ${formatCurrency(totalNext30, lang)} totali`
              : `${next30.length} deadlines in the next 30 days · ${weekEvents.length} this week · ${formatCurrency(totalNext30, lang)} total`
            }
          </p>
        </div>
        <div className="page-actions">
          <Button icon="download">{lang === 'it' ? 'Esporta' : 'Export'}</Button>
          <Button variant="primary" icon="plus">{lang === 'it' ? 'Nuova scadenza' : 'New deadline'}</Button>
        </div>
      </div>

      <div className="grid grid-12">
        <div className="col-12">
          <Card service="calendar-service">
            <div className="card-header">
              <div>
                <div className="card-title">{lang === 'it' ? 'Settimana' : 'This week'}</div>
                <div className="card-subtitle">
                  {formatDate(weekMonday, lang, { day: 'numeric', month: 'short' })} – {formatDate(weekSunday, lang, { day: 'numeric', month: 'short', year: 'numeric' })}
                  {weekTotal > 0 && <> · <span className="mono" style={{ color: 'var(--text-2)', fontWeight: 600 }}>{formatCurrency(weekTotal, lang)}</span></>}
                </div>
              </div>
              <div className="hstack gap-2">
                <button className="icon-btn" onClick={() => navWeek(-1)}><Icon name="chevronLeft" size={16} /></button>
                <Button size="sm" variant="ghost" onClick={() => setWeekCursor(new Date())}>{t('common.today')}</Button>
                <button className="icon-btn" onClick={() => navWeek(1)}><Icon name="chevronRight" size={16} /></button>
                <div style={{ width: 1, height: 20, background: 'var(--divider)', margin: '0 4px' }} />
                <Button size="sm" variant="ghost" onClick={() => setState(s => ({ ...s, page: 'calendar' }))}>
                  {lang === 'it' ? 'Apri calendario' : 'Open calendar'} →
                </Button>
              </div>
            </div>
            <DashboardWeekStrip monday={weekMonday} events={events} lang={lang} onSelect={setSelectedEvent} />
          </Card>
        </div>

        <div className="col-7">
          <Card
            title={lang === 'it' ? 'Prossime scadenze' : 'Upcoming deadlines'}
            subtitle={lang === 'it' ? `Ordinate per data · ${next30.length} in arrivo` : `Sorted by date · ${next30.length} upcoming`}
            service="deadline-service"
            action={<Button size="sm" variant="ghost" onClick={() => setState(s => ({ ...s, page: 'deadlines' }))}>{t('dashboard.viewAll')} →</Button>}
          >
            <div className="hstack" style={{ gap: 12, marginBottom: 12, padding: '8px 10px', background: 'var(--bg-subtle)', borderRadius: 10 }}>
              <div style={{ flex: 1 }}>
                <div className="stat-label">{lang === 'it' ? 'Totale 30 giorni' : 'Next 30 days'}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.01em' }}>{formatCurrency(totalNext30, lang)}</div>
              </div>
              <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--divider)' }} />
              <div style={{ flex: 1 }}>
                <div className="stat-label">{lang === 'it' ? 'Programmate' : 'Scheduled'}</div>
                <div className="hstack" style={{ gap: 8, alignItems: 'baseline' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{next30.filter(e => e.autopay).length}</div>
                  <div className="stat-label">/ {next30.length}</div>
                </div>
              </div>
              <div style={{ width: 1, alignSelf: 'stretch', background: 'var(--divider)' }} />
              <div style={{ flex: 1 }}>
                <div className="stat-label">{lang === 'it' ? 'Da gestire' : 'Needs attention'}</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--warning, oklch(0.55 0.15 55))' }}>{next30.filter(e => !e.autopay).length}</div>
              </div>
            </div>
            <div className="list">
              {next30.slice(0, 6).map(e => <DeadlineRow key={e.id} ev={e} lang={lang} onClick={() => setSelectedEvent(e)} />)}
            </div>
          </Card>
        </div>

        <div className="col-5">
          <Card
            title={t('dashboard.expenses')}
            subtitle={t('dashboard.expensesSub')}
            service="budget-service"
            action={<Button size="sm" variant="ghost" onClick={() => setState(s => ({ ...s, page: 'budget' }))}>{lang === 'it' ? 'Dettagli' : 'Details'} →</Button>}
          >
            <div className="hstack" style={{ justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div className="stat-value" style={{ fontSize: 28 }}>{formatCurrency(monthSpend, lang)}</div>
                <div className="hstack" style={{ gap: 8, marginTop: 4 }}>
                  <span className={`stat-delta ${delta > 0 ? 'up' : 'down'}`}>
                    <Icon name={delta > 0 ? 'arrowUp' : 'arrowDown'} size={10} stroke={2.5} />
                    {Math.abs(delta).toFixed(1)}%
                  </span>
                  <span className="stat-label">vs {formatCurrency(monthPrev, lang)}</span>
                </div>
              </div>
              <Donut segments={donutSegs} size={108} stroke={16} />
            </div>
            <div className="sep" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
              {donutSegs.slice(0, 6).map((s, i) => (
                <div key={i} className="hstack" style={{ fontSize: 12, gap: 6 }}>
                  <span className="chart-legend-dot" style={{ background: s.color, width: 8, height: 8, borderRadius: 2, flexShrink: 0 }} />
                  <span className="text-muted" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
                  <span className="spacer" />
                  <span className="mono" style={{ color: 'var(--text-2)', fontWeight: 500 }}>{formatCurrency(s.value, lang)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {selectedEvent && (
        <Drawer open title={selectedEvent.title} service="deadline-service" onClose={() => setSelectedEvent(null)}
          footer={<><Button onClick={() => setSelectedEvent(null)}>{t('common.close')}</Button><Button variant="primary">{t('common.edit')}</Button></>}>
          <InfoItem ev={selectedEvent} lang={lang} asDetail />
        </Drawer>
      )}
    </div>
  );
}

export function DashboardWeekStrip({ monday, events, lang, onSelect }) {
  const days = Array.from({length: 7}, (_, i) => { const d = new Date(monday); d.setDate(d.getDate() + i); return d; });
  const dowLabels = lang === 'it' ? ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'] : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const today = new Date(); today.setHours(0,0,0,0);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
      {days.map((d, i) => {
        const dayEvents = events.filter(e => new Date(e.date).toDateString() === d.toDateString());
        const isToday = d.toDateString() === today.toDateString();
        const isWeekend = i >= 5;
        const dayTotal = dayEvents.reduce((s, e) => s + (e.amount || 0), 0);
        return (
          <div key={i} style={{
            border: `1px solid ${isToday ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 10, overflow: 'hidden', minHeight: 180,
            background: isToday ? 'var(--accent-soft)' : 'var(--bg-elev)',
            display: 'flex', flexDirection: 'column',
          }}>
            <div style={{
              padding: '8px 10px', borderBottom: '1px solid var(--divider)',
              background: isToday ? 'color-mix(in oklch, var(--accent) 12%, transparent)' : (isWeekend ? 'var(--bg-subtle)' : 'transparent'),
            }}>
              <div className="hstack" style={{ justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: 10, color: isToday ? 'var(--accent-text)' : 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{dowLabels[i]}</div>
                {dayEvents.length > 0 && <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: isToday ? 'var(--accent-text)' : 'var(--text-3)', fontWeight: 500 }}>{dayEvents.length}</div>}
              </div>
              <div className="hstack" style={{ justifyContent: 'space-between', alignItems: 'baseline', marginTop: 2 }}>
                <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, color: isToday ? 'var(--accent-text)' : 'var(--text)', letterSpacing: '-0.02em' }}>{d.getDate()}</div>
                {dayTotal > 0 && <div className="mono" style={{ fontSize: 10, color: isToday ? 'var(--accent-text)' : 'var(--text-muted)', fontWeight: 500 }}>{dayTotal >= 1000 ? `${(dayTotal/1000).toFixed(1)}k` : `€${Math.round(dayTotal)}`}</div>}
              </div>
            </div>
            <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
              {dayEvents.length === 0 && <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '8px 4px', textAlign: 'center', opacity: 0.6 }}>—</div>}
              {dayEvents.slice(0, 4).map(e => (
                <div key={e.id} className="cal-event" onClick={() => onSelect(e)} style={{
                  background: `color-mix(in oklch, var(--cat-${e.category}) 16%, transparent)`,
                  color: `var(--cat-${e.category})`,
                  padding: '5px 7px', borderLeft: `2px solid var(--cat-${e.category})`,
                  borderRadius: 5, cursor: 'pointer', fontSize: 11, fontWeight: 600, lineHeight: 1.25,
                  overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                }} title={e.title}>{e.title}</div>
              ))}
              {dayEvents.length > 4 && <div style={{ fontSize: 10, color: 'var(--text-3)', padding: '2px 4px', fontWeight: 500 }}>+{dayEvents.length - 4} {lang === 'it' ? 'altro' : 'more'}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function DeadlineRow({ ev, lang, onClick }) {
  const date = new Date(ev.date);
  const now = new Date();
  const diffDays = Math.round((date - now) / (1000*60*60*24));
  const dateLabel = diffDays === 0 ? (lang === 'it' ? 'Oggi' : 'Today')
    : diffDays === 1 ? (lang === 'it' ? 'Domani' : 'Tomorrow')
    : diffDays > 0 && diffDays < 7 ? (lang === 'it' ? `Tra ${diffDays} giorni` : `In ${diffDays} days`)
    : formatDate(date, lang, { day: 'numeric', month: 'short' });

  const urgent = diffDays <= 3;
  const catColor = `var(--cat-${ev.category})`;

  return (
    <div className="row" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="row-icon" style={{ background: `color-mix(in oklch, ${catColor} 14%, transparent)`, color: catColor }}>
        <CategoryIcon cat={ev.category} size={16} />
      </div>
      <div className="row-main">
        <div className="row-title">{ev.title}</div>
        <div className="row-meta">
          <span>{dateLabel}</span>
          {ev.autopay && <><span>·</span><Badge kind="success">{lang === 'it' ? 'Auto' : 'Auto'}</Badge></>}
          {urgent && !ev.autopay && <><span>·</span><Badge kind="danger">{lang === 'it' ? 'Urgente' : 'Urgent'}</Badge></>}
        </div>
      </div>
      {ev.amount > 0 && <div className="row-amount">{formatCurrency(ev.amount, lang)}</div>}
      <Icon name="chevronRight" size={14} style={{ color: 'var(--text-muted)' }} />
    </div>
  );
}
