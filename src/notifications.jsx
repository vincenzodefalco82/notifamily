import { useState } from 'react';
import { tFn, formatDate } from './i18n.js';
import { getData } from './data.js';
import { Icon } from './icons.jsx';
import { Card, EmptyState, Button, Badge } from './ui.jsx';
import { PageHeader } from './household.jsx';

function ChannelRow({ icon, label, on }) {
  const [v, setV] = useState(!!on);
  return (
    <div className="hstack" style={{ justifyContent: 'space-between', padding: '8px 0' }}>
      <div className="hstack gap-2">
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--bg-subtle)', display: 'grid', placeItems: 'center' }}>
          <Icon name={icon} size={14} />
        </div>
        <span style={{ fontSize: 13 }}>{label}</span>
      </div>
      <button onClick={() => setV(!v)} style={{
        width: 36, height: 22, borderRadius: 11, background: v ? 'var(--accent)' : 'var(--border-strong)',
        position: 'relative', transition: 'background 0.15s', flexShrink: 0,
      }}>
        <span style={{ position: 'absolute', top: 2, left: v ? 16 : 2, width: 18, height: 18, background: 'white', borderRadius: '50%', transition: 'left 0.15s', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
      </button>
    </div>
  );
}

export function NotificationsPage({ state, setState }) {
  const t = tFn(state.lang);
  const lang = state.lang;
  const data = getData(state.empty);

  if (state.empty || data.notifications.length === 0) {
    return (
      <div className="page">
        <PageHeader title={t('nav.notifications')} />
        <Card><EmptyState icon="bell" title={lang === 'it' ? 'Nessuna notifica' : 'No notifications'} desc={lang === 'it' ? 'Quando ci sarà una scadenza o un pagamento, te lo diremo qui.' : "We'll notify you here about upcoming deadlines and payments."} /></Card>
      </div>
    );
  }

  const typeIcons = { info: 'info', warning: 'alert', success: 'check' };
  const typeColors = { info: 'var(--info)', warning: 'var(--warning)', success: 'var(--success)' };

  return (
    <div className="page">
      <PageHeader
        title={t('nav.notifications')}
        sub={lang === 'it' ? `${data.notifications.filter(n => n.unread).length} non lette` : `${data.notifications.filter(n => n.unread).length} unread`}
        actions={<><Button>{lang === 'it' ? 'Segna tutte come lette' : 'Mark all read'}</Button><Button icon="settings">{lang === 'it' ? 'Preferenze' : 'Preferences'}</Button></>}
      />

      <div className="grid grid-12">
        <div className="col-8">
          <Card service="notification-service" style={{ padding: 0 }}>
            <div className="list" style={{ padding: '0 20px' }}>
              {data.notifications.map(n => (
                <div key={n.id} className="row" style={{ padding: '16px 4px', opacity: n.unread ? 1 : 0.72 }}>
                  <div className="row-icon" style={{ background: `color-mix(in oklch, ${typeColors[n.type]} 14%, transparent)`, color: typeColors[n.type] }}>
                    <Icon name={typeIcons[n.type]} size={16} />
                  </div>
                  <div className="row-main">
                    <div className="hstack gap-2">
                      <div className="row-title" style={{ fontWeight: n.unread ? 600 : 500 }}>{n.title}</div>
                      {n.unread && <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%' }} />}
                    </div>
                    <div className="row-meta" style={{ marginTop: 4, color: 'var(--text-2)', fontSize: 13, lineHeight: 1.5 }}>{n.body}</div>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{formatDate(new Date(n.at), lang, { day: 'numeric', month: 'short' })}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="col-4">
          <Card title={lang === 'it' ? 'Canali di notifica' : 'Notification channels'} service="notification-service">
            <div className="vstack" style={{ gap: 10 }}>
              <ChannelRow icon="bell" label={lang === 'it' ? 'Push browser/app' : 'Browser/app push'} on />
              <ChannelRow icon="info" label="Email" on />
              <ChannelRow icon="info" label="SMS" />
              <ChannelRow icon="info" label="WhatsApp" on />
            </div>
            <div className="sep" />
            <div className="card-title" style={{ fontSize: 13, marginBottom: 10 }}>{lang === 'it' ? 'Preavviso scadenze' : 'Deadline reminders'}</div>
            <div className="vstack" style={{ gap: 6 }}>
              {['30', '14', '7', '3', '1'].map(d => (
                <label key={d} className="hstack gap-2" style={{ fontSize: 13 }}>
                  <input type="checkbox" defaultChecked={['14', '3', '1'].includes(d)} style={{ accentColor: 'var(--accent)' }} />
                  {lang === 'it' ? `${d} giorni prima` : `${d} days before`}
                </label>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
