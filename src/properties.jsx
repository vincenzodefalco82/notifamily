import { useState } from 'react';
import { tFn, formatCurrency, formatDate } from './i18n.js';
import { getData } from './data.js';
import { Icon } from './icons.jsx';
import { Card, EmptyState, Button, Badge } from './ui.jsx';
import { PageHeader } from './household.jsx';

function StatMini({ icon, label, value }) {
  return (
    <div className="vstack" style={{ gap: 2, alignItems: 'center' }}>
      <Icon name={icon} size={13} style={{ color: 'var(--text-3)' }} />
      <div className="mono" style={{ fontSize: 13, fontWeight: 600 }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{label}</div>
    </div>
  );
}

export function PropertiesPage({ state }) {
  const t = tFn(state.lang);
  const lang = state.lang;
  const data = getData(state.empty);

  if (state.empty) {
    return (
      <div className="page">
        <PageHeader title={t('nav.properties')} sub={lang === 'it' ? 'Case, uffici, case vacanza.' : 'Homes, offices, vacation houses.'} />
        <Card><EmptyState icon="building" title={lang === 'it' ? 'Nessun immobile' : 'No property yet'} desc={lang === 'it' ? 'Aggiungi il primo immobile per collegare contratti e scadenze.' : 'Add your first property to link contracts and deadlines.'} cta={<Button variant="primary" icon="plus">{lang === 'it' ? 'Aggiungi immobile' : 'Add property'}</Button>} /></Card>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader
        title={t('nav.properties')}
        sub={lang === 'it' ? `${data.properties.length} immobili registrati` : `${data.properties.length} registered properties`}
        actions={<Button variant="primary" icon="plus">{lang === 'it' ? 'Aggiungi immobile' : 'Add property'}</Button>}
      />

      <div className="grid grid-12">
        {data.properties.map(p => {
          const contracts = data.contracts.filter(c => c.propertyId === p.id);
          const monthly = contracts.reduce((s, c) => s + c.amountMonthly, 0);
          const catColor = p.type === 'home' ? 'var(--cat-rent)' : p.type === 'office' ? 'var(--cat-subscription)' : 'var(--cat-family)';
          return (
            <div key={p.id} className="col-6">
              <Card className="card-hover" service="property-service" style={{ cursor: 'pointer' }}>
                <div style={{ height: 140, borderRadius: 12, background: `linear-gradient(135deg, color-mix(in oklch, ${catColor} 18%, var(--bg-elev)), var(--bg-subtle))`, marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
                  <svg viewBox="0 0 200 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
                    <rect x="20" y="40" width="40" height="60" fill={catColor} />
                    <rect x="70" y="20" width="60" height="80" fill={catColor} />
                    <rect x="140" y="55" width="40" height="45" fill={catColor} />
                  </svg>
                  <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <Badge kind="neutral" dot={catColor}>{t(`propertyTypes.${p.type}`)}</Badge>
                  </div>
                  <div style={{ position: 'absolute', bottom: 12, left: 12, color: 'var(--text-2)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon name="mapPin" size={12} /> {p.address}
                  </div>
                </div>
                <div className="hstack" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.015em' }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{p.size} m² · {p.rooms} {lang === 'it' ? 'locali' : 'rooms'}</div>
                  </div>
                  <button className="icon-btn"><Icon name="more" /></button>
                </div>
                <div className="sep" />
                <div className="hstack" style={{ justifyContent: 'space-between' }}>
                  <StatMini icon="file" label={lang === 'it' ? 'Contratti' : 'Contracts'} value={contracts.length} />
                  <StatMini icon="wallet" label={lang === 'it' ? 'Mensile' : 'Monthly'} value={formatCurrency(monthly, lang)} />
                  <StatMini icon="clock" label={lang === 'it' ? 'Scadenze 30gg' : '30d due'} value={contracts.filter(c => (new Date(c.nextDue) - new Date()) < 30 * 86400000).length} />
                </div>
              </Card>
            </div>
          );
        })}

        <div className="col-6">
          <button style={{
            width: '100%', border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: 32,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
            color: 'var(--text-3)', background: 'transparent', minHeight: 300, cursor: 'pointer',
          }}>
            <Icon name="plus" size={24} />
            <div style={{ fontSize: 14, fontWeight: 500 }}>{lang === 'it' ? 'Aggiungi immobile' : 'Add property'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{lang === 'it' ? 'Casa, ufficio, casa vacanza, affitto…' : 'Home, office, vacation, rental…'}</div>
          </button>
        </div>
      </div>

      <div style={{ marginTop: 'var(--section-gap)' }} />
      <Card title={lang === 'it' ? 'Auto del nucleo' : 'Household vehicles'} service="property-service">
        <div className="list">
          {data.vehicles.map(v => {
            const owner = data.members.find(m => m.id === v.ownerId);
            const days = Math.round((new Date(v.insuranceEnd) - new Date()) / 86400000);
            return (
              <div key={v.id} className="row">
                <div className="row-icon"><Icon name="car" size={16} /></div>
                <div className="row-main">
                  <div className="row-title">{v.brand} {v.model} · <span className="mono">{v.plate}</span></div>
                  <div className="row-meta">{lang === 'it' ? 'Proprietario' : 'Owner'}: {owner.firstName} {owner.lastName}</div>
                </div>
                <Badge kind={days < 30 ? 'warning' : 'neutral'}>{lang === 'it' ? 'Assicurazione' : 'Insurance'}: {days}g</Badge>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
