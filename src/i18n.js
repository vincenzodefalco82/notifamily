export const TRANSLATIONS = {
  it: {
    app: { name: 'Notifamily', tagline: 'Gestione scadenze e bilancio familiare' },
    nav: {
      overview: 'Panoramica',
      dashboard: 'Dashboard',
      calendar: 'Calendario',
      deadlines: 'Scadenze',
      notifications: 'Notifiche',
      manage: 'Gestione',
      household: 'Nucleo familiare',
      properties: 'Immobili',
      contracts: 'Contratti',
      workers: 'Lavoratori',
      budget: 'Bilancio',
      documents: 'Documenti',
      settings: 'Impostazioni',
      developer: 'Sviluppo',
      api: 'API & Microservizi',
    },
    common: {
      today: 'Oggi', yesterday: 'Ieri', tomorrow: 'Domani',
      add: 'Aggiungi', edit: 'Modifica', delete: 'Elimina', save: 'Salva', cancel: 'Annulla', close: 'Chiudi',
      search: 'Cerca', filter: 'Filtra', all: 'Tutti', none: 'Nessuno',
      month: 'Mese', week: 'Settimana', day: 'Giorno', year: 'Anno',
      active: 'Attivo', expired: 'Scaduto', pending: 'In attesa', paid: 'Pagato',
      upcoming: 'In arrivo', amount: 'Importo', due: 'Scadenza', category: 'Categoria', status: 'Stato', notes: 'Note',
      newItem: 'Nuovo', export: 'Esporta', import: 'Importa',
      monthly: 'Mensile', yearly: 'Annuale', quarterly: 'Trimestrale', oneTime: 'Una tantum',
    },
    dashboard: {
      greetingMorning: 'Buongiorno', greetingAfternoon: 'Buon pomeriggio', greetingEvening: 'Buonasera',
      next30: 'Prossime scadenze',
      next30sub: 'nei prossimi 30 giorni',
      expenses: 'Spese del mese',
      expensesSub: 'rispetto al mese scorso',
      cashflow: 'Cashflow mensile',
      cashflowSub: 'entrate vs uscite',
      quickActions: 'Azioni rapide',
      recent: 'Attività recente',
      viewAll: 'Vedi tutto',
      household: 'Nucleo',
      properties: 'Immobili',
      contracts: 'Contratti attivi',
    },
    roles: {
      owner: 'Proprietario',
      partner: 'Coniuge / Partner',
      adult_child: 'Figlio adulto',
      dependent: 'Familiare dipendente',
      advisor: 'Consulente',
      property_manager: 'Property manager',
    },
    propertyTypes: {
      home: 'Abitazione', office: 'Ufficio', vacation: 'Casa vacanza', rental: 'Affittata', other: 'Altro',
    },
    contractTypes: {
      utility_power: 'Luce', utility_gas: 'Gas', utility_water: 'Acqua', utility_internet: 'Internet',
      rent: 'Affitto', mortgage: 'Mutuo', insurance: 'Assicurazione',
    },
    empty: {
      title: 'Nessun nucleo ancora',
      desc: 'Crea il tuo primo nucleo familiare per iniziare a tracciare immobili, contratti e scadenze.',
      cta: 'Crea nucleo familiare',
    },
  },
  en: {
    app: { name: 'Notifamily', tagline: 'Family deadlines & budget' },
    nav: {
      overview: 'Overview',
      dashboard: 'Dashboard',
      calendar: 'Calendar',
      deadlines: 'Deadlines',
      notifications: 'Notifications',
      manage: 'Manage',
      household: 'Household',
      properties: 'Properties',
      contracts: 'Contracts',
      workers: 'Workers',
      budget: 'Budget',
      documents: 'Documents',
      settings: 'Settings',
      developer: 'Developer',
      api: 'API & Microservices',
    },
    common: {
      today: 'Today', yesterday: 'Yesterday', tomorrow: 'Tomorrow',
      add: 'Add', edit: 'Edit', delete: 'Delete', save: 'Save', cancel: 'Cancel', close: 'Close',
      search: 'Search', filter: 'Filter', all: 'All', none: 'None',
      month: 'Month', week: 'Week', day: 'Day', year: 'Year',
      active: 'Active', expired: 'Expired', pending: 'Pending', paid: 'Paid',
      upcoming: 'Upcoming', amount: 'Amount', due: 'Due', category: 'Category', status: 'Status', notes: 'Notes',
      newItem: 'New', export: 'Export', import: 'Import',
      monthly: 'Monthly', yearly: 'Yearly', quarterly: 'Quarterly', oneTime: 'One-time',
    },
    dashboard: {
      greetingMorning: 'Good morning', greetingAfternoon: 'Good afternoon', greetingEvening: 'Good evening',
      next30: 'Upcoming deadlines',
      next30sub: 'in the next 30 days',
      expenses: 'This month\u2019s spend',
      expensesSub: 'vs last month',
      cashflow: 'Monthly cashflow',
      cashflowSub: 'income vs outflow',
      quickActions: 'Quick actions',
      recent: 'Recent activity',
      viewAll: 'View all',
      household: 'Household',
      properties: 'Properties',
      contracts: 'Active contracts',
    },
    roles: {
      owner: 'Owner', partner: 'Partner', adult_child: 'Adult child',
      dependent: 'Dependent', advisor: 'Advisor', property_manager: 'Property manager',
    },
    propertyTypes: {
      home: 'Home', office: 'Office', vacation: 'Vacation home', rental: 'Rented out', other: 'Other',
    },
    contractTypes: {
      utility_power: 'Electricity', utility_gas: 'Gas', utility_water: 'Water', utility_internet: 'Internet',
      rent: 'Rent', mortgage: 'Mortgage', insurance: 'Insurance',
    },
    empty: {
      title: 'No household yet',
      desc: 'Create your first household to start tracking properties, contracts and deadlines.',
      cta: 'Create household',
    },
  },
};

export function tFn(lang) {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.it;
  return (path) => {
    const parts = path.split('.');
    let v = dict;
    for (const p of parts) v = v?.[p];
    return v ?? path;
  };
}

export function formatCurrency(n, lang = 'it') {
  const locale = lang === 'it' ? 'it-IT' : 'en-GB';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
}

export function formatCurrencyFull(n, lang = 'it') {
  const locale = lang === 'it' ? 'it-IT' : 'en-GB';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(n);
}

export function formatDate(d, lang = 'it', opts = {}) {
  const locale = lang === 'it' ? 'it-IT' : 'en-GB';
  return new Intl.DateTimeFormat(locale, opts).format(d);
}
