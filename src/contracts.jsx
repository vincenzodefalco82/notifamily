import { useState } from 'react';
import { tFn, formatCurrency, formatCurrencyFull, formatDate } from './i18n.js';
import { getData } from './data.js';
import { Icon } from './icons.jsx';
import { ContractTypeIcon } from './icons.jsx';
import { Card, EmptyState, Button, Badge, Drawer } from './ui.jsx';
import { PageHeader } from './household.jsx';
import { InfoItem } from './calendar.jsx';

function ContractDetail({ c, data, lang }) {
  const t = tFn(lang);
  const prop = data.properties.find(p => p.id === c.propertyId);
  return (
    <div className="vstack" style={{ gap: 16 }}>
      <div className="hstack gap-3">
        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--accent-soft)', color: 'var(--accent-text)', display: 'grid', placeItems: 'center' }}>
          <ContractTypeIcon type={c.type} size={22} />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{c.provider}</div>
          <div className="mono" style={{ fontSize: 12, color: 'var(--text-3)' }}>{c.clientCode}</div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <InfoItem label={lang === 'it' ? 'Importo' : 'Amount'} value={<span className="mono" style={{ fontWeight: 600 }}>{formatCurrencyFull(c.amountMonthly, lang)}/{c.billingCycle === 'monthly' ? (lang === 'it' ? 'mese' : 'month') : c.billingCycle}</span>} />
        <InfoItem label={lang === 'it' ? 'Prossima scadenza' : 'Next due'} value={formatDate(new Date(c.nextDue), lang, { day: 'numeric', month: 'long', year: 'numeric' })} />
        <InfoItem label={lang === 'it' ? 'Immobile' : 'Property'} value={prop?.name || '—'} />
        <InfoItem label={lang === 'it' ? 'Pagamento' : 'Payment'} value={c.paymentMethod} />
        <InfoItem label={lang === 'it' ? 'Modalità' : 'Mode'} value={c.autopay ? (lang === 'it' ? 'Automatico' : 'Automatic') : (lang === 'it' ? 'Manuale' : 'Manual')} />
        <InfoItem label={lang === 'it' ? 'Stato' : 'Status'} value={<Badge kind="success">{t('common.active')}</Badge>} />
      </div>

      <div className="sep" />
      <div className="card-title">{lang === 'it' ? 'Storico pagamenti' : 'Payment history'}</div>
      <div className="list">
        {[-1, -2, -3, -4].map(m => {
          const d = new Date(); d.setMonth(d.getMonth() + m);
          return (
            <div key={m} className="row">
              <div className="row-icon" style={{ color: 'var(--success)' }}><Icon name="check" size={14} /></div>
              <div className="row-main">
                <div className="row-title">{formatDate(d, lang, { month: 'long', year: 'numeric' })}</div>
                <div className="row-meta">{c.paymentMethod}</div>
              </div>
              <div className="row-amount mono">{formatCurrency(c.amountMonthly, lang)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ContractsPage({ state }) {
  const t = tFn(state.lang);
  const lang = state.lang;
  const data = getData(state.empty);
  const [tab, setTab] = useState('all');
  const [selected, setSelected] = useState(null);

  if (state.empty) {
    return (
      <div className="page">
        <PageHeader title={t('nav.contracts')} sub={lang === 'it' ? 'Utenze, affitti, mutui, assicurazioni.' : 'Utilities, rent, mortgages, insurance.'} />
        <Card><EmptyState icon="file" title={lang === 'it' ? 'Nessun contratto' : 'No contracts'} desc={lang === 'it' ? 'Aggiungi il primo contratto.' : 'Add your first contract.'} cta={<Button variant="primary" icon="plus">{lang === 'it' ? 'Nuovo contratto' : 'New contract'}</Button>} /></Card>
      </div>
    );
  }

  const tabs = [
    { id: 'all', label: lang === 'it' ? 'Tutti' : 'All' },
    { id: 'util', label: lang === 'it' ? 'Utenze' : 'Utilities' },
    { id: 'rent', label: lang === 'it' ? 'Affitti e mutui' : 'Rent & mortgage' },
    { id: 'insurance', label: lang === 'it' ? 'Assicurazioni' : 'Insurance' },
  ];
  const filtered = data.contracts.filter(c => tab === 'all' || c.category === tab);
  const totalMonthly = filtered.reduce((s, c) => s + c.amountMonthly, 0);

  return (
    <div className="page">
      <PageHeader
        title={t('nav.contracts')}
        sub={lang === 'it' ? `${filtered.length} contratti · ${formatCurrency(totalMonthly, lang)}/mese` : `${filtered.length} contracts · ${formatCurrency(totalMonthly, lang)}/month`}
        actions={<><Button icon="filter">{lang === 'it' ? 'Filtra' : 'Filter'}</Button><Button variant="primary" icon="plus">{lang === 'it' ? 'Nuovo contratto' : 'New contract'}</Button></>}
      />

      <div className="tab-bar">
        {tabs.map(x => <button key={x.id} className={tab === x.id ? 'active' : ''} onClick={() => setTab(x.id)}>{x.label}</button>)}
      </div>

      <Card service="contract-service" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead><tr>
            <th>{lang === 'it' ? 'Contratto' : 'Contract'}</th>
            <th>{lang === 'it' ? 'Fornitore' : 'Provider'}</th>
            <th>{lang === 'it' ? 'Immobile/Asset' : 'Asset'}</th>
            <th>{lang === 'it' ? 'Frequenza' : 'Cycle'}</th>
            <th style={{ textAlign: 'right' }}>{lang === 'it' ? 'Importo' : 'Amount'}</th>
            <th>{lang === 'it' ? 'Prossima' : 'Next'}</th>
            <th>{lang === 'it' ? 'Pagamento' : 'Payment'}</th>
            <th></th>
          </tr></thead>
          <tbody>
            {filtered.map(c => {
              const prop = data.properties.find(p => p.id === c.propertyId);
              const veh = data.vehicles.find(v => v.id === c.vehicleId);
              const days = Math.round((new Date(c.nextDue) - new Date()) / 86400000);
              return (
                <tr key={c.id} onClick={() => setSelected(c)} style={{ cursor: 'pointer' }}>
                  <td>
                    <div className="hstack gap-2">
                      <div className="row-icon" style={{ width: 30, height: 30, borderRadius: 8 }}>
                        <ContractTypeIcon type={c.type} size={14} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 500 }}>{t(`contractTypes.${c.type}`)}{c.label ? ` · ${c.label.split('·')[1]?.trim() || ''}` : ''}</div>
                        <div className="mono" style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.clientCode}</div>
                      </div>
                    </div>
                  </td>
                  <td>{c.provider}</td>
                  <td>{prop?.name || veh?.model || '—'}</td>
                  <td><Badge kind="neutral">{c.billingCycle}</Badge></td>
                  <td className="mono" style={{ textAlign: 'right', fontWeight: 600 }}>{formatCurrency(c.amountMonthly, lang)}</td>
                  <td>
                    <div className="hstack gap-2">
                      <span className="mono" style={{ fontSize: 12 }}>{formatDate(new Date(c.nextDue), lang, { day: 'numeric', month: 'short' })}</span>
                      <Badge kind={days < 7 ? 'danger' : days < 30 ? 'warning' : 'neutral'}>{days}g</Badge>
                    </div>
                  </td>
                  <td>{c.autopay ? <Badge kind="success">Auto</Badge> : <Badge kind="neutral">{lang === 'it' ? 'Manuale' : 'Manual'}</Badge>}</td>
                  <td><button className="icon-btn"><Icon name="chevronRight" size={14} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {selected && (
        <Drawer open title={`${t(`contractTypes.${selected.type}`)} · ${selected.provider}`} service="contract-service" onClose={() => setSelected(null)}
          footer={<><Button onClick={() => setSelected(null)}>{t('common.close')}</Button><Button variant="primary">{t('common.edit')}</Button></>}>
          <ContractDetail c={selected} data={data} lang={lang} />
        </Drawer>
      )}
    </div>
  );
}
