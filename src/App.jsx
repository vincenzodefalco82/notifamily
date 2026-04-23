import { useState, useEffect } from 'react';
import { tFn } from './i18n.js';
import { Shell } from './shell.jsx';
import { TweaksPanel, TWEAK_DEFAULTS } from './tweaks.jsx';
import { Login } from './Login.jsx';
import { DashboardPage } from './dashboard.jsx';
import { CalendarPage } from './calendar.jsx';
import { DeadlinesPage } from './deadlines.jsx';
import { NotificationsPage } from './notifications.jsx';
import { HouseholdPage } from './household.jsx';
import { PropertiesPage } from './properties.jsx';
import { ContractsPage } from './contracts.jsx';
import { WorkersPage } from './workers.jsx';
import { BudgetPage } from './budget.jsx';
import { DocumentsPage } from './documents.jsx';
import { SettingsPage } from './settings.jsx';
import { ApiPage } from './api.jsx';

export default function App() {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('nf_user');
    const t = localStorage.getItem('nf_token');
    return u && t ? JSON.parse(u) : null;
  });

  const [state, setState] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('notifamily_state') || '{}');
    return {
      page: 'dashboard',
      lang: TWEAK_DEFAULTS.lang,
      theme: TWEAK_DEFAULTS.theme,
      density: TWEAK_DEFAULTS.density,
      empty: TWEAK_DEFAULTS.empty,
      notifCount: 0,
      ...saved,
    };
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    document.documentElement.setAttribute('data-density', state.density);
    document.documentElement.setAttribute('lang', state.lang);
    localStorage.setItem('notifamily_state', JSON.stringify({
      page: state.page, lang: state.lang, theme: state.theme, density: state.density, empty: state.empty,
    }));
  }, [state.theme, state.density, state.lang, state.page, state.empty]);

  if (!user) {
    return <Login onAuth={setUser} />;
  }

  const t = tFn(state.lang);

  const pageMeta = {
    dashboard: { title: t('nav.dashboard'), svc: null },
    calendar: { title: t('nav.calendar'), svc: 'calendar-service' },
    deadlines: { title: t('nav.deadlines'), svc: 'deadline-service' },
    notifications: { title: t('nav.notifications'), svc: 'notification-service' },
    household: { title: t('nav.household'), svc: 'household-service' },
    properties: { title: t('nav.properties'), svc: 'property-service' },
    contracts: { title: t('nav.contracts'), svc: 'contract-service' },
    workers: { title: t('nav.workers'), svc: 'worker-service' },
    budget: { title: t('nav.budget'), svc: 'budget-service' },
    documents: { title: t('nav.documents'), svc: 'document-service' },
    settings: { title: t('nav.settings'), svc: 'tenant-service' },
    api: { title: t('nav.api'), svc: null },
  }[state.page] || { title: '', svc: null };

  const pages = {
    dashboard: DashboardPage,
    calendar: CalendarPage,
    deadlines: DeadlinesPage,
    notifications: NotificationsPage,
    household: HouseholdPage,
    properties: PropertiesPage,
    contracts: ContractsPage,
    workers: WorkersPage,
    budget: BudgetPage,
    documents: DocumentsPage,
    settings: SettingsPage,
    api: ApiPage,
  };

  const Page = pages[state.page] || DashboardPage;

  function logout() {
    localStorage.removeItem('nf_token');
    localStorage.removeItem('nf_user');
    setUser(null);
  }

  return (
    <>
      <Shell
        state={state}
        setState={setState}
        currentPageTitle={pageMeta.title}
        headerService={pageMeta.svc}
        user={user}
        onLogout={logout}
      >
        <Page state={state} setState={setState} user={user} />
      </Shell>
      <TweaksPanel state={state} setState={setState} />
    </>
  );
}
