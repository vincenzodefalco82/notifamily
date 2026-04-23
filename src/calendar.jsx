import { useState } from 'react';
import { tFn, formatCurrency, formatDate } from './i18n.js';
import { Icon } from './icons.jsx';
import { Card, Button, Badge, Seg, Drawer } from './ui.jsx';
import { useEvents } from './api/hooks.js';
import { EventForm } from './forms/index.jsx';

export function CalendarPage({ state, setState }) {
  const t = tFn(state.lang);
  const lang = state.lang;
  const { data: events = [] } = useEvents();
  const [view, setView] = useState('month');
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d; });
  const [selected, setSelected] = useState(null);
  const [formItem, setFormItem] = useState(false);

  const months = lang === 'it'
    ? ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']
    : ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const navigate = (dir) => {
    const d = new Date(cursor);
    if (view === 'month') d.setMonth(d.getMonth() + dir);
    if (view === 'week') d.setDate(d.getDate() + dir * 7);
    if (view === 'day') d.setDate(d.getDate() + dir);
    setCursor(d);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('nav.calendar')}</h1>
          <p className="page-subtitle">{lang === 'it' ? 'Tutte le scadenze in un colpo d\u2019occhio, sincronizzate con i tuoi calendari.' : 'All your deadlines at a glance, synced with your calendars.'}</p>
        </div>
        <div className="page-actions">
          <Seg value={view} onChange={setView} options={[
            { value: 'day', label: t('common.day') },
            { value: 'week', label: t('common.week') },
            { value: 'month', label: t('common.month') },
          ]} />
          <Button icon="link">{lang === 'it' ? 'Sincronizza' : 'Sync'}</Button>
          <Button variant="primary" icon="plus" onClick={() => setFormItem(null)}>{lang === 'it' ? 'Nuovo evento' : 'New event'}</Button>
        </div>
      </div>

      <div className="grid grid-12">
        <div className="col-9">
          <Card service="calendar-service">
            <div className="card-header">
              <div className="hstack gap-2">
                <button className="icon-btn" onClick={() => navigate(-1)}><Icon name="chevronLeft" size={16} /></button>
                <div className="card-title" style={{ minWidth: 180, textAlign: 'center' }}>
                  {view === 'month' && `${months[cursor.getMonth()]} ${cursor.getFullYear()}`}
                  {view === 'week' && `${lang === 'it' ? 'Settimana' : 'Week'} · ${formatDate(cursor, lang, { day: 'numeric', month: 'short' })}`}
                  {view === 'day' && formatDate(cursor, lang, { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
                <button className="icon-btn" onClick={() => navigate(1)}><Icon name="chevronRight" size={16} /></button>
                <Button size="sm" variant="ghost" onClick={() => setCursor(new Date())}>{t('common.today')}</Button>
              </div>
              <div className="chart-legend">
                <div className="chart-legend-item"><span className="chart-legend-dot" style={{ background: 'var(--cat-util)' }} />{lang === 'it' ? 'Utenze' : 'Utilities'}</div>
                <div className="chart-legend-item"><span className="chart-legend-dot" style={{ background: 'var(--cat-rent)' }} />{lang === 'it' ? 'Affitti' : 'Rent'}</div>
                <div className="chart-legend-item"><span className="chart-legend-dot" style={{ background: 'var(--cat-tax)' }} />{lang === 'it' ? 'Tasse' : 'Taxes'}</div>
                <div className="chart-legend-item"><span className="chart-legend-dot" style={{ background: 'var(--cat-worker)' }} />{lang === 'it' ? 'Lavoratori' : 'Workers'}</div>
              </div>
            </div>

            {view === 'month' && <MonthView cursor={cursor} events={events} lang={lang} onSelect={setSelected} />}
            {view === 'week' && <WeekView cursor={cursor} events={events} lang={lang} onSelect={setSelected} />}
            {view === 'day' && <DayView cursor={cursor} events={events} lang={lang} onSelect={setSelected} />}
          </Card>

          <div style={{ marginTop: 'var(--gap)' }} />
          <Card title={lang === 'it' ? 'Timeline anno' : 'Year timeline'} subtitle={lang === 'it' ? 'Densità scadenze mese per mese' : 'Month-by-month density'} service="deadline-service">
            <MiniTimeline events={events} cursor={cursor} onMonth={(m) => { const d = new Date(cursor); d.setMonth(m); setCursor(d); }} />
          </Card>
        </div>

        <div className="col-3">
          <Card title={lang === 'it' ? 'Sincronizzazione' : 'Sync providers'} subtitle={lang === 'it' ? 'Bidirezionale con il tuo calendario' : 'Two-way with your calendar'} service="calendar-service">
            <SyncProvider name="Google Calendar" status="connected" account="marco@rossi.fam" />
            <SyncProvider name="Apple iCloud" status="connected" account="marco@icloud.com" />
            <SyncProvider name="Microsoft Outlook" status="disconnected" />
            <div style={{ marginTop: 12, padding: 12, background: 'var(--bg-subtle)', borderRadius: 10, fontSize: 12, color: 'var(--text-3)', display: 'flex', gap: 8 }}>
              <Icon name="refresh" size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>{lang === 'it' ? 'Ultima sincronizzazione 6 minuti fa · 32 eventi aggiornati' : 'Last sync 6 minutes ago · 32 events updated'}</div>
            </div>
          </Card>

          <div style={{ marginTop: 'var(--gap)' }} />

          <Card title={lang === 'it' ? 'Filtri' : 'Filters'}>
            <FilterCheck label={lang === 'it' ? 'Utenze' : 'Utilities'} color="var(--cat-util)" defaultChecked />
            <FilterCheck label={lang === 'it' ? 'Affitti e mutui' : 'Rent & mortgage'} color="var(--cat-rent)" defaultChecked />
            <FilterCheck label={lang === 'it' ? 'Tasse' : 'Taxes'} color="var(--cat-tax)" defaultChecked />
            <FilterCheck label={lang === 'it' ? 'Assicurazioni' : 'Insurance'} color="var(--cat-insurance)" defaultChecked />
            <FilterCheck label={lang === 'it' ? 'Lavoratori' : 'Workers'} color="var(--cat-worker)" defaultChecked />
            <FilterCheck label={lang === 'it' ? 'Abbonamenti' : 'Subscriptions'} color="var(--cat-subscription)" defaultChecked />
            <FilterCheck label={lang === 'it' ? 'Famiglia' : 'Family'} color="var(--cat-family)" defaultChecked />
            <FilterCheck label={lang === 'it' ? 'Salute' : 'Health'} color="var(--cat-health)" defaultChecked />
          </Card>
        </div>
      </div>

      {selected && (
        <Drawer open title={selected.title} service="deadline-service" onClose={() => setSelected(null)}
          footer={
            <>
              <Button onClick={() => { setSelected(null); setFormItem(selected); }}>{t('common.edit')}</Button>
              <Button onClick={() => setSelected(null)}>{t('common.close')}</Button>
            </>
          }>
          <EventDetail ev={selected} lang={lang} />
        </Drawer>
      )}
      {formItem !== false && <EventForm initial={formItem} lang={lang} onClose={() => setFormItem(false)} />}
    </div>
  );
}

function MonthView({ cursor, events, lang, onSelect }) {
  const start = new Date(cursor);
  start.setDate(1);
  const startDow = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - startDow);

  const days = [];
  for (let i = 0; i < 42; i++) { const d = new Date(start); d.setDate(d.getDate() + i); days.push(d); }

  const dowLabels = lang === 'it' ? ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'] : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const today = new Date(); today.setHours(0,0,0,0);

  return (
    <div className="cal-grid">
      {dowLabels.map(l => <div key={l} className="cal-dow">{l}</div>)}
      {days.map((d, i) => {
        const inMonth = d.getMonth() === cursor.getMonth();
        const isToday = d.toDateString() === today.toDateString();
        const dayEvents = events.filter(e => {
          const ed = new Date(e.date); ed.setHours(0,0,0,0);
          return ed.toDateString() === d.toDateString();
        });
        return (
          <div key={i} className={`cal-day ${inMonth ? '' : 'out-of-month'} ${isToday ? 'today' : ''}`}>
            <div className="cal-daynum">{d.getDate()}</div>
            {dayEvents.slice(0,3).map(e => (
              <div key={e.id} className="cal-event" onClick={() => onSelect(e)}
                style={{ background: `color-mix(in oklch, var(--cat-${e.category}) 18%, transparent)`, color: `var(--cat-${e.category})` }}>
                {e.amount > 0 ? `${formatCurrency(e.amount, lang)} · ` : ''}{e.title}
              </div>
            ))}
            {dayEvents.length > 3 && <div style={{ fontSize: 10, color: 'var(--text-3)', paddingLeft: 6 }}>+{dayEvents.length - 3} {lang === 'it' ? 'altro' : 'more'}</div>}
          </div>
        );
      })}
    </div>
  );
}

function WeekView({ cursor, events, lang, onSelect }) {
  const monday = new Date(cursor);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  const days = Array.from({length: 7}, (_, i) => { const d = new Date(monday); d.setDate(d.getDate() + i); return d; });
  const dowLabels = lang === 'it' ? ['Lun','Mar','Mer','Gio','Ven','Sab','Dom'] : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 10 }}>
      {days.map((d, i) => {
        const dayEvents = events.filter(e => new Date(e.date).toDateString() === d.toDateString());
        const isToday = d.toDateString() === new Date().toDateString();
        return (
          <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden', minHeight: 320 }}>
            <div style={{ padding: '10px 12px', background: isToday ? 'var(--accent-soft)' : 'var(--bg-subtle)', borderBottom: '1px solid var(--divider)' }}>
              <div style={{ fontSize: 10, color: isToday ? 'var(--accent-text)' : 'var(--text-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{dowLabels[i]}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: isToday ? 'var(--accent-text)' : 'var(--text)' }}>{d.getDate()}</div>
            </div>
            <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {dayEvents.length === 0 && <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: 8 }}>{lang === 'it' ? 'Libero' : 'Free'}</div>}
              {dayEvents.map(e => (
                <div key={e.id} className="cal-event" onClick={() => onSelect(e)}
                  style={{ background: `color-mix(in oklch, var(--cat-${e.category}) 18%, transparent)`, color: `var(--cat-${e.category})`, padding: '6px 8px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</div>
                  {e.amount > 0 && <div className="mono" style={{ fontSize: 10, opacity: 0.8 }}>{formatCurrency(e.amount, lang)}</div>}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DayView({ cursor, events, lang, onSelect }) {
  const dayEvents = events.filter(e => new Date(e.date).toDateString() === cursor.toDateString());
  const hours = Array.from({length: 12}, (_, i) => i + 7);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: 0, border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
      {hours.map(h => (
        <>
          <div key={`h${h}`} style={{ padding: '14px 12px', borderBottom: '1px solid var(--divider)', fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-mono)', background: 'var(--bg-subtle)' }}>{String(h).padStart(2,'0')}:00</div>
          <div key={`e${h}`} style={{ padding: 6, borderBottom: '1px solid var(--divider)', minHeight: 44, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {h === 9 && dayEvents.map(e => (
              <div key={e.id} className="cal-event" onClick={() => onSelect(e)}
                style={{ background: `color-mix(in oklch, var(--cat-${e.category}) 18%, transparent)`, color: `var(--cat-${e.category})`, padding: '8px 10px', fontSize: 12 }}>
                <div style={{ fontWeight: 600 }}>{e.title}</div>
                {e.amount > 0 && <div className="mono" style={{ fontSize: 10, opacity: 0.8 }}>{formatCurrency(e.amount, lang)}</div>}
              </div>
            ))}
          </div>
        </>
      ))}
    </div>
  );
}

function MiniTimeline({ events, cursor, onMonth }) {
  const months = ['G','F','M','A','M','G','L','A','S','O','N','D'];
  const year = cursor.getFullYear();
  const now = new Date();
  const byMonth = Array.from({length: 12}, (_, i) => events.filter(e => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === i;
  }));
  const max = Math.max(...byMonth.map(arr => arr.length), 1);
  return (
    <div className="mini-timeline">
      {months.map((m, i) => {
        const evs = byMonth[i];
        const intensity = evs.length / max;
        const isCur = i === cursor.getMonth();
        const isNow = i === now.getMonth() && year === now.getFullYear();
        return (
          <button key={i} onClick={() => onMonth(i)} className={`mini-tl-month ${evs.length > 0 ? 'has-event' : ''} ${isCur ? 'current' : ''}`}
            style={{ background: evs.length > 0 ? `color-mix(in oklch, var(--accent) ${10 + intensity*25}%, transparent)` : undefined, cursor: 'pointer' }}>
            <div style={{ fontWeight: isNow ? 700 : 500 }}>{m}</div>
            <div className="mini-tl-dots">
              {evs.slice(0, 4).map((e, j) => <span key={j} className="mini-tl-dot" style={{ background: `var(--cat-${e.category})` }} />)}
            </div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', marginTop: 2, opacity: 0.7 }}>{evs.length || ''}</div>
          </button>
        );
      })}
    </div>
  );
}

function SyncProvider({ name, status, account }) {
  return (
    <div className="hstack" style={{ padding: '10px 0', borderBottom: '1px solid var(--divider)' }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-subtle)', display: 'grid', placeItems: 'center', color: 'var(--text-2)' }}>
        <Icon name="calendar" size={14} />
      </div>
      <div className="flex-1" style={{ marginLeft: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{account || 'Non connesso'}</div>
      </div>
      {status === 'connected'
        ? <Badge kind="success" dot="var(--success)">ON</Badge>
        : <Button size="sm">Connetti</Button>}
    </div>
  );
}

function FilterCheck({ label, color, defaultChecked }) {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <button onClick={() => setOn(!on)} className="hstack" style={{ width: '100%', padding: '6px 8px', borderRadius: 8, background: 'transparent', cursor: 'pointer' }}>
      <div style={{ width: 14, height: 14, borderRadius: 4, border: `1.5px solid ${color}`, background: on ? color : 'transparent', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
        {on && <Icon name="check" size={10} stroke={3} style={{ color: 'white' }} />}
      </div>
      <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{label}</span>
    </button>
  );
}

export function EventDetail({ ev, lang }) {
  const d = new Date(ev.date);
  return (
    <div className="vstack" style={{ gap: 16 }}>
      <div>
        <div className="stat-label">{lang === 'it' ? 'Importo' : 'Amount'}</div>
        <div className="stat-value">{ev.amount > 0 ? formatCurrency(ev.amount, lang) : '—'}</div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <InfoItem label={lang === 'it' ? 'Data' : 'Date'} value={formatDate(d, lang, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
        <InfoItem label={lang === 'it' ? 'Categoria' : 'Category'} value={<Badge kind="neutral" dot={`var(--cat-${ev.category})`}>{ev.category}</Badge>} />
        <InfoItem label={lang === 'it' ? 'Ricorrenza' : 'Recurrence'} value={ev.recurring || '—'} />
        <InfoItem label={lang === 'it' ? 'Pagamento' : 'Payment'} value={ev.autopay ? (lang === 'it' ? 'Automatico' : 'Automatic') : (lang === 'it' ? 'Manuale' : 'Manual')} />
      </div>
    </div>
  );
}

export function InfoItem({ label, value, ev, lang, asDetail }) {
  if (asDetail && ev) return <EventDetail ev={ev} lang={lang} />;
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, color: 'var(--text)' }}>{value}</div>
    </div>
  );
}
