import { useState } from 'react';
import { tFn, formatDate } from './i18n.js';
import { Icon } from './icons.jsx';
import { Card, EmptyState, Button, Badge } from './ui.jsx';
import { PageHeader } from './household.jsx';
import { useNotifications, useMarkRead, useMarkAllRead } from './api/hooks.js';

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
  const { data: notifications = [], isLoading } = useNotifications();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();
  const it = lang === 'it';

  if (isLoading) return <div className="page"><div className="text-muted" style={{ padding: 32 }}>Caricamento…</div></div>;

  const unread = notifications.filter(n => !n.readAt).length;

  if (!notifications.length) {
    return (
      <div className="page">
        <PageHeader title={t('nav.notifications')} />
        <Card><EmptyState icon="bell" title={it ? 'Nessuna notifica' : 'No notifications'} desc={it ? "Quando ci sarà una scadenza o un pagamento, te lo diremo qui." : "We'll notify you here about upcoming deadlines and payments."} /></Card>
      </div>
    );
  }

  const typeIcons = { info: 'info', warning: 'alert', success: 'check', danger: 'alert' };
  const typeColors = { info: 'var(--info)', warning: 'var(--warning)', success: 'var(--success)', danger: 'var(--danger)' };

  return (
    <div className="page">
      <PageHeader
        title={t('nav.notifications')}
        sub={it ? `${unread} non lette` : `${unread} unread`}
        actions={
          <>
            <Button onClick={() => markAllRead.mutate()} disabled={markAllRead.isPending || unread === 0}>
              {it ? 'Segna tutte come lette' : 'Mark all read'}
            </Button>
          </>
        }
      />

      <div className="grid grid-12">
        <div className="col-8">
          <Card service="notification-service" style={{ padding: 0 }}>
            <div className="list" style={{ padding: '0 20px' }}>
              {notifications.map(n => {
                const isUnread = !n.readAt;
                const type = n.type || 'info';
                return (
                  <div
                    key={n.id}
                    className="row"
                    style={{ padding: '16px 4px', opacity: isUnread ? 1 : 0.72, cursor: isUnread ? 'pointer' : 'default' }}
                    onClick={() => isUnread && markRead.mutate(n.id)}
                  >
                    <div className="row-icon" style={{ background: `color-mix(in oklch, ${typeColors[type] || 'var(--info)'} 14%, transparent)`, color: typeColors[type] || 'var(--info)' }}>
                      <Icon name={typeIcons[type] || 'info'} size={16} />
                    </div>
                    <div className="row-main">
                      <div className="hstack gap-2">
                        <div className="row-title" style={{ fontWeight: isUnread ? 600 : 500 }}>{n.title}</div>
                        {isUnread && <span style={{ width: 6, height: 6, background: 'var(--accent)', borderRadius: '50%' }} />}
                      </div>
                      <div className="row-meta" style={{ marginTop: 4, color: 'var(--text-2)', fontSize: 13, lineHeight: 1.5 }}>{n.body}</div>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                      {n.createdAt ? formatDate(new Date(n.createdAt), lang, { day: 'numeric', month: 'short' }) : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
        <div className="col-4">
          <Card title={it ? 'Canali di notifica' : 'Notification channels'} service="notification-service">
            <div className="vstack" style={{ gap: 10 }}>
              <ChannelRow icon="bell" label={it ? 'Push browser/app' : 'Browser/app push'} on />
              <ChannelRow icon="info" label="Email" on />
              <ChannelRow icon="info" label="SMS" />
              <ChannelRow icon="info" label="WhatsApp" on />
            </div>
            <div className="sep" />
            <div className="card-title" style={{ fontSize: 13, marginBottom: 10 }}>{it ? 'Preavviso scadenze' : 'Deadline reminders'}</div>
            <div className="vstack" style={{ gap: 6 }}>
              {['30', '14', '7', '3', '1'].map(d => (
                <label key={d} className="hstack gap-2" style={{ fontSize: 13 }}>
                  <input type="checkbox" defaultChecked={['14', '3', '1'].includes(d)} style={{ accentColor: 'var(--accent)' }} />
                  {it ? `${d} giorni prima` : `${d} days before`}
                </label>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
