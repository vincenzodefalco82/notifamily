import { tFn } from './i18n.js';
import { getData } from './data.js';
import { Icon } from './icons.jsx';
import { Card, EmptyState, Button, Badge, Avatar } from './ui.jsx';

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

function ActivityItem({ who, what, when, color }) {
  return (
    <div className="hstack gap-2">
      <Avatar name={who} color={color} />
      <div className="flex-1">
        <div style={{ fontSize: 13 }}><b>{who}</b> <span className="text-muted">{what}</span></div>
        <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{when}</div>
      </div>
    </div>
  );
}

export function HouseholdPage({ state }) {
  const t = tFn(state.lang);
  const lang = state.lang;
  const data = getData(state.empty);

  if (state.empty) {
    return (
      <div className="page">
        <PageHeader title={t('nav.household')} sub={lang === 'it' ? 'Gestisci il nucleo familiare e i permessi.' : 'Manage household members and roles.'} />
        <Card><EmptyState icon="users" title={t('empty.title')} desc={t('empty.desc')} cta={<Button variant="primary" icon="plus">{t('empty.cta')}</Button>} /></Card>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader
        title={data.households[0]?.name}
        sub={lang === 'it' ? `Nucleo principale · ${data.members.length} membri` : `Main household · ${data.members.length} members`}
        actions={<><Button icon="upload">{lang === 'it' ? 'Invita' : 'Invite'}</Button><Button variant="primary" icon="plus">{lang === 'it' ? 'Nuovo membro' : 'New member'}</Button></>}
      />

      <div className="grid grid-12">
        <div className="col-8">
          <Card title={lang === 'it' ? 'Membri del nucleo' : 'Household members'} service="household-service">
            <div className="list">
              {data.members.map(m => {
                const age = new Date().getFullYear() - new Date(m.birthDate).getFullYear();
                return (
                  <div key={m.id} className="row">
                    <Avatar name={`${m.firstName} ${m.lastName}`} color={m.color} size="lg" />
                    <div className="row-main" style={{ marginLeft: 4 }}>
                      <div className="row-title" style={{ fontSize: 15 }}>{m.firstName} {m.lastName}</div>
                      <div className="row-meta">
                        <span style={{ textTransform: 'capitalize' }}>{m.relation}</span>
                        <span>·</span>
                        <span>{age} {lang === 'it' ? 'anni' : 'yrs'}</span>
                        {m.email && <><span>·</span><span className="mono">{m.email}</span></>}
                      </div>
                    </div>
                    <Badge kind={m.role === 'owner' ? 'success' : 'neutral'}>{t(`roles.${m.role}`)}</Badge>
                    <button className="icon-btn"><Icon name="more" /></button>
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
                <th>{lang === 'it' ? 'Dashboard' : 'Dashboard'}</th>
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
          <Card title={lang === 'it' ? 'Invita un membro' : 'Invite a member'} service="identity-service">
            <div className="vstack" style={{ gap: 12 }}>
              <div className="field">
                <label className="field-label">Email</label>
                <input className="input" placeholder="familiare@email.it" />
              </div>
              <div className="field">
                <label className="field-label">{lang === 'it' ? 'Ruolo' : 'Role'}</label>
                <select className="select">
                  <option>{t('roles.partner')}</option>
                  <option>{t('roles.adult_child')}</option>
                  <option>{t('roles.dependent')}</option>
                  <option>{t('roles.advisor')}</option>
                </select>
              </div>
              <Button variant="primary" icon="upload">{lang === 'it' ? 'Invia invito' : 'Send invite'}</Button>
            </div>
          </Card>

          <div style={{ marginTop: 'var(--gap)' }} />

          <Card title={lang === 'it' ? 'Attività recente' : 'Recent activity'}>
            <div className="vstack" style={{ gap: 10 }}>
              <ActivityItem who="Giulia" what={lang === 'it' ? 'ha aggiunto un documento' : 'added a document'} when="2h" color={340} />
              <ActivityItem who="Marco" what={lang === 'it' ? 'ha pagato bolletta Enel' : 'paid Enel bill'} when="1g" color={30} />
              <ActivityItem who="Marco" what={lang === 'it' ? 'ha invitato Ana (colf)' : 'invited Ana (worker)'} when="3g" color={30} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
