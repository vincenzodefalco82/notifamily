import { useState } from 'react';
import { tFn } from './i18n.js';
import { Icon } from './icons.jsx';
import { Card, EmptyState, Button, Badge, Avatar } from './ui.jsx';
import { useMembers, useHousehold } from './api/hooks.js';
import { MemberForm } from './forms/index.jsx';

export function PageHeader({ title, sub, actions }) {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {sub && <p className="page-subtitle">{sub}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

function PermRow({ role, perms }) {
  const map = { full: { k: 'success', l: 'Completo' }, read: { k: 'neutral', l: 'Lettura' }, none: { k: 'danger', l: '—' } };
  return (
    <tr>
      <td style={{ fontWeight: 500 }}>{role}</td>
      {perms.map((p, i) => <td key={i}><Badge kind={map[p].k}>{map[p].l}</Badge></td>)}
    </tr>
  );
}

export function HouseholdPage({ state }) {
  const t = tFn(state.lang);
  const lang = state.lang;
  const { data: members = [], isLoading } = useMembers();
  const { data: household } = useHousehold();
  const [formItem, setFormItem] = useState(false);

  if (isLoading) return <div className="page"><div className="text-muted" style={{ padding: 32 }}>Caricamento…</div></div>;

  if (!members.length) {
    return (
      <div className="page">
        <PageHeader title={t('nav.household')} sub={lang === 'it' ? 'Gestisci il nucleo familiare e i permessi.' : 'Manage household members and roles.'} />
        <Card>
          <EmptyState icon="users" title={t('empty.title')} desc={t('empty.desc')}
            cta={<Button variant="primary" icon="plus" onClick={() => setFormItem(null)}>{t('empty.cta')}</Button>}
          />
        </Card>
        {formItem !== false && <MemberForm initial={formItem} lang={lang} onClose={() => setFormItem(false)} />}
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader
        title={household?.name || t('nav.household')}
        sub={lang === 'it' ? `Nucleo principale · ${members.length} membri` : `Main household · ${members.length} members`}
        actions={<><Button variant="primary" icon="plus" onClick={() => setFormItem(null)}>{lang === 'it' ? 'Nuovo membro' : 'New member'}</Button></>}
      />

      <div className="grid grid-12">
        <div className="col-8">
          <Card title={lang === 'it' ? 'Membri del nucleo' : 'Household members'} service="household-service">
            <div className="list">
              {members.map(m => {
                const age = m.birthDate ? new Date().getFullYear() - new Date(m.birthDate).getFullYear() : null;
                return (
                  <div key={m.id} className="row">
                    <Avatar name={`${m.firstName} ${m.lastName}`} size="lg" />
                    <div className="row-main" style={{ marginLeft: 4 }}>
                      <div className="row-title" style={{ fontSize: 15 }}>{m.firstName} {m.lastName}</div>
                      <div className="row-meta">
                        {m.relation && <><span style={{ textTransform: 'capitalize' }}>{m.relation}</span><span>·</span></>}
                        {age !== null && <span>{age} {lang === 'it' ? 'anni' : 'yrs'}</span>}
                        {m.email && <><span>·</span><span className="mono">{m.email}</span></>}
                      </div>
                    </div>
                    <Badge kind={m.role === 'owner' ? 'success' : 'neutral'}>{t(`roles.${m.role}`) || m.role}</Badge>
                    <button className="icon-btn" onClick={() => setFormItem(m)}><Icon name="more" /></button>
                  </div>
                );
              })}
            </div>
          </Card>

          <div style={{ marginTop: 'var(--gap)' }} />
          <Card title={lang === 'it' ? 'Permessi e ruoli' : 'Permissions & roles'} service="identity-service">
            <table className="data-table">
              <thead><tr>
                <th>{lang === 'it' ? 'Ruolo' : 'Role'}</th>
                <th>Dashboard</th>
                <th>{lang === 'it' ? 'Contratti' : 'Contracts'}</th>
                <th>{lang === 'it' ? 'Pagamenti' : 'Payments'}</th>
                <th>{lang === 'it' ? 'Impostazioni' : 'Settings'}</th>
              </tr></thead>
              <tbody>
                <PermRow role={t('roles.owner')} perms={['full', 'full', 'full', 'full']} />
                <PermRow role={t('roles.partner')} perms={['full', 'full', 'full', 'read']} />
                <PermRow role={t('roles.adult_child')} perms={['read', 'read', 'none', 'none']} />
                <PermRow role={t('roles.dependent')} perms={['read', 'none', 'none', 'none']} />
                <PermRow role={t('roles.advisor')} perms={['read', 'full', 'read', 'none']} />
                <PermRow role={t('roles.property_manager')} perms={['read', 'full', 'full', 'none']} />
              </tbody>
            </table>
          </Card>
        </div>

        <div className="col-4">
          <Card title={lang === 'it' ? 'Aggiungi membro' : 'Add member'} service="identity-service">
            <div className="vstack" style={{ gap: 12 }}>
              <p style={{ fontSize: 13, color: 'var(--text-3)' }}>
                {lang === 'it' ? 'Aggiungi un nuovo membro al nucleo familiare.' : 'Add a new member to the household.'}
              </p>
              <Button variant="primary" icon="plus" onClick={() => setFormItem(null)}>
                {lang === 'it' ? 'Nuovo membro' : 'New member'}
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {formItem !== false && <MemberForm initial={formItem} lang={lang} onClose={() => setFormItem(false)} />}
    </div>
  );
}
