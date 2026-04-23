import { tFn } from './i18n.js';
import { getData } from './data.js';
import { Icon } from './icons.jsx';
import { Avatar, ServiceChip } from './ui.jsx';

export function Shell({ state, setState, children, currentPageTitle, currentPageSub, crumb, headerService }) {
  const t = tFn(state.lang);
  const navGroups = [
    {
      label: t('nav.overview'),
      items: [
        { id: 'dashboard', icon: 'dashboard', label: t('nav.dashboard') },
        { id: 'calendar', icon: 'calendar', label: t('nav.calendar') },
        { id: 'deadlines', icon: 'clock', label: t('nav.deadlines') },
        { id: 'notifications', icon: 'bell', label: t('nav.notifications'), badge: state.notifCount },
      ]
    },
    {
      label: t('nav.manage'),
      items: [
        { id: 'household', icon: 'users', label: t('nav.household') },
        { id: 'properties', icon: 'building', label: t('nav.properties') },
        { id: 'contracts', icon: 'file', label: t('nav.contracts') },
        { id: 'workers', icon: 'briefcase', label: t('nav.workers') },
        { id: 'budget', icon: 'wallet', label: t('nav.budget') },
        { id: 'documents', icon: 'folder', label: t('nav.documents') },
      ]
    },
    {
      label: t('nav.developer'),
      items: [
        { id: 'api', icon: 'database', label: t('nav.api') },
        { id: 'settings', icon: 'settings', label: t('nav.settings') },
      ]
    }
  ];

  const data = getData(state.empty);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-mark">N</div>
          <div className="logo-wordmark">Notifamily</div>
          <div className="spacer" />
          <button className="icon-btn" title="Ricerca globale (⌘K)"><Icon name="sparkle" size={14} /></button>
        </div>

        <div className="tenant-switcher" role="button">
          <div className="tenant-avatar">{(data.tenant.name || 'T').split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
          <div className="tenant-info">
            <div className="tenant-name">{data.tenant.name}</div>
            <div className="tenant-role">{data.tenant.plan} · {data.tenant.memberCount} {state.lang === 'it' ? 'membri' : 'members'}</div>
          </div>
          <Icon name="chevronDown" size={14} style={{ color: 'var(--text-3)' }} />
        </div>

        <nav className="nav-section">
          {navGroups.map(group => (
            <div key={group.label}>
              <div className="nav-group-label">{group.label}</div>
              {group.items.map(item => (
                <button
                  key={item.id}
                  className={`nav-item ${state.page === item.id ? 'active' : ''}`}
                  onClick={() => setState(s => ({ ...s, page: item.id }))}
                >
                  <Icon name={item.icon} size={16} className="nav-icon" />
                  <span>{item.label}</span>
                  {item.badge > 0 && <span className="nav-badge">{item.badge}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <Avatar name="Marco Rossi" color={30} />
            <div className="flex-1" style={{ minWidth: 0 }}>
              <div className="user-name">Marco Rossi</div>
              <div className="user-role">{t('roles.owner')}</div>
            </div>
            <Icon name="more" size={14} style={{ color: 'var(--text-3)' }} />
          </div>
        </div>
      </aside>

      <main className="main-area">
        <div className="topbar">
          <div>
            <div className="topbar-title">{currentPageTitle}</div>
            {crumb && <span className="topbar-breadcrumb"> · {crumb}</span>}
          </div>
          <div className="search-bar" style={{ marginLeft: 16 }}>
            <Icon name="search" size={14} className="search-icon" />
            <input className="search-input" placeholder={state.lang === 'it' ? 'Cerca contratti, scadenze, membri…' : 'Search contracts, deadlines, members…'} />
            <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)' }}>
              <span className="kbd">⌘K</span>
            </div>
          </div>
          <div className="spacer" />
          {headerService && <ServiceChip name={headerService} />}
          <button className="icon-btn" onClick={() => setState(s => ({ ...s, page: 'notifications' }))}>
            <Icon name="bell" size={16} />
            {state.notifCount > 0 && <span className="notif-dot" />}
          </button>
          <button className="icon-btn" title={state.lang === 'it' ? 'Nuovo' : 'New'}>
            <Icon name="plus" size={16} />
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}
