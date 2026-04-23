import { useState } from 'react';
import { tFn, formatCurrency, formatDate } from './i18n.js';
import { Icon } from './icons.jsx';
import { Card, EmptyState, Button, Badge } from './ui.jsx';
import { PageHeader } from './household.jsx';
import { useProperties, useVehicles, useMembers } from './api/hooks.js';
import { PropertyForm, VehicleForm } from './forms/index.jsx';

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
  const { data: properties = [], isLoading } = useProperties();
  const { data: vehicles = [] } = useVehicles();
  const { data: members = [] } = useMembers();
  const [propForm, setPropForm] = useState(false);
  const [vehForm, setVehForm] = useState(false);

  if (isLoading) return <div className="page"><div className="text-muted" style={{ padding: 32 }}>Caricamento…</div></div>;

  const catColor = (type) => type === 'home' ? 'var(--cat-rent)' : type === 'office' ? 'var(--cat-subscription)' : 'var(--cat-family)';

  if (!properties.length && !vehicles.length) {
    return (
      <div className="page">
        <PageHeader title={t('nav.properties')} sub={lang === 'it' ? 'Case, uffici, case vacanza.' : 'Homes, offices, vacation houses.'} />
        <Card>
          <EmptyState icon="building"
            title={lang === 'it' ? 'Nessun immobile' : 'No property yet'}
            desc={lang === 'it' ? 'Aggiungi il primo immobile per collegare contratti e scadenze.' : 'Add your first property to link contracts and deadlines.'}
            cta={<Button variant="primary" icon="plus" onClick={() => setPropForm(null)}>{lang === 'it' ? 'Aggiungi immobile' : 'Add property'}</Button>}
          />
        </Card>
        {propForm !== false && <PropertyForm initial={propForm} lang={lang} onClose={() => setPropForm(false)} />}
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader
        title={t('nav.properties')}
        sub={lang === 'it' ? `${properties.length} immobili registrati` : `${properties.length} registered properties`}
        actions={<Button variant="primary" icon="plus" onClick={() => setPropForm(null)}>{lang === 'it' ? 'Aggiungi immobile' : 'Add property'}</Button>}
      />

      <div className="grid grid-12">
        {properties.map(p => {
          const color = catColor(p.type);
          return (
            <div key={p.id} className="col-6">
              <Card className="card-hover" service="property-service" style={{ cursor: 'pointer' }}>
                <div style={{ height: 140, borderRadius: 12, background: `linear-gradient(135deg, color-mix(in oklch, ${color} 18%, var(--bg-elev)), var(--bg-subtle))`, marginBottom: 16, position: 'relative', overflow: 'hidden' }}>
                  <svg viewBox="0 0 200 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
                    <rect x="20" y="40" width="40" height="60" fill={color} />
                    <rect x="70" y="20" width="60" height="80" fill={color} />
                    <rect x="140" y="55" width="40" height="45" fill={color} />
                  </svg>
                  <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <Badge kind="neutral" dot={color}>{t(`propertyTypes.${p.type}`) || p.type}</Badge>
                  </div>
                  {p.address && (
                    <div style={{ position: 'absolute', bottom: 12, left: 12, color: 'var(--text-2)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon name="mapPin" size={12} /> {p.address}
                    </div>
                  )}
                </div>
                <div className="hstack" style={{ justifyContent: 'space-between', marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.015em' }}>{p.name}</div>
                    {(p.size || p.rooms) && (
                      <div style={{ fontSize: 12, color: 'var(--text-3)' }}>
                        {p.size && `${p.size} m²`}{p.size && p.rooms && ' · '}{p.rooms && `${p.rooms} ${lang === 'it' ? 'locali' : 'rooms'}`}
                      </div>
                    )}
                  </div>
                  <button className="icon-btn" onClick={(e) => { e.stopPropagation(); setPropForm(p); }}><Icon name="more" /></button>
                </div>
              </Card>
            </div>
          );
        })}

        <div className="col-6">
          <button
            onClick={() => setPropForm(null)}
            style={{
              width: '100%', border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: 32,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
              color: 'var(--text-3)', background: 'transparent', minHeight: 240, cursor: 'pointer',
            }}>
            <Icon name="plus" size={24} />
            <div style={{ fontSize: 14, fontWeight: 500 }}>{lang === 'it' ? 'Aggiungi immobile' : 'Add property'}</div>
          </button>
        </div>
      </div>

      <div style={{ marginTop: 'var(--section-gap)' }} />
      <Card
        title={lang === 'it' ? 'Auto del nucleo' : 'Household vehicles'}
        service="property-service"
        action={<Button size="sm" icon="plus" onClick={() => setVehForm(null)}>{lang === 'it' ? 'Aggiungi' : 'Add'}</Button>}
      >
        {vehicles.length === 0 ? (
          <div className="text-muted" style={{ fontSize: 13, padding: '8px 0' }}>
            {lang === 'it' ? 'Nessun veicolo.' : 'No vehicles.'}
          </div>
        ) : (
          <div className="list">
            {vehicles.map(v => {
              const owner = members.find(m => m.id === v.ownerId);
              const days = v.insuranceEnd ? Math.round((new Date(v.insuranceEnd) - new Date()) / 86400000) : null;
              return (
                <div key={v.id} className="row">
                  <div className="row-icon"><Icon name="car" size={16} /></div>
                  <div className="row-main">
                    <div className="row-title">{v.brand} {v.model} · <span className="mono">{v.plate}</span></div>
                    {owner && <div className="row-meta">{lang === 'it' ? 'Proprietario' : 'Owner'}: {owner.firstName} {owner.lastName}</div>}
                  </div>
                  {days !== null && <Badge kind={days < 30 ? 'warning' : 'neutral'}>{lang === 'it' ? 'Ass.' : 'Ins.'}: {days}g</Badge>}
                  <button className="icon-btn" onClick={() => setVehForm(v)}><Icon name="more" /></button>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {propForm !== false && <PropertyForm initial={propForm} lang={lang} onClose={() => setPropForm(false)} />}
      {vehForm !== false && <VehicleForm initial={vehForm} members={members} lang={lang} onClose={() => setVehForm(false)} />}
    </div>
  );
}
