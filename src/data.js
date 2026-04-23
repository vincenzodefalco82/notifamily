export const TODAY = new Date();
TODAY.setHours(12, 0, 0, 0);

export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const addMonths = (d, n) => { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; };

export const DEMO = {
  tenant: {
    id: 'tenant_rossi_001',
    name: 'Famiglia Rossi',
    plan: 'Famiglia Plus',
    memberCount: 4,
  },
  households: [
    { id: 'hh_001', name: 'Nucleo Rossi', type: 'couple_children', createdAt: '2024-03-12' },
  ],
  members: [
    { id: 'm1', firstName: 'Marco', lastName: 'Rossi', birthDate: '1980-05-12', role: 'owner', relation: 'padre', email: 'marco@rossi.fam', color: 30 },
    { id: 'm2', firstName: 'Giulia', lastName: 'Rossi', birthDate: '1982-11-03', role: 'partner', relation: 'madre', email: 'giulia@rossi.fam', color: 340 },
    { id: 'm3', firstName: 'Sofia', lastName: 'Rossi', birthDate: '2012-07-22', role: 'dependent', relation: 'figlia', color: 80 },
    { id: 'm4', firstName: 'Leo', lastName: 'Rossi', birthDate: '2015-02-18', role: 'dependent', relation: 'figlio', color: 220 },
  ],
  properties: [
    { id: 'p1', name: 'Appartamento famiglia', type: 'home', role: 'residence', address: 'Via Garibaldi 14, Milano', size: 120, rooms: 4, notes: 'Abitazione principale, mutuo attivo.' },
    { id: 'p2', name: 'Ufficio Marco', type: 'office', role: 'rented', address: 'Corso Italia 88, Milano', size: 55, rooms: 2, notes: 'Affittato, sede attività professionale.' },
  ],
  vehicles: [
    { id: 'v1', ownerId: 'm1', brand: 'Volkswagen', model: 'Golf', plate: 'FR 123 YZ', insuranceEnd: addDays(TODAY, 82).toISOString() },
    { id: 'v2', ownerId: 'm2', brand: 'Fiat', model: '500', plate: 'FN 456 AB', insuranceEnd: addDays(TODAY, 24).toISOString() },
  ],
  contracts: [
    { id: 'c1', type: 'utility_power', category: 'util', propertyId: 'p1', provider: 'Enel Energia', clientCode: 'IT001E12345678', amountMonthly: 148, billingCycle: 'monthly', nextDue: addDays(TODAY, 8).toISOString(), status: 'active', autopay: true, paymentMethod: 'SEPA · IBAN *3421' },
    { id: 'c2', type: 'utility_gas', category: 'util', propertyId: 'p1', provider: 'Eni Plenitude', clientCode: 'IT002G98765432', amountMonthly: 92, billingCycle: 'monthly', nextDue: addDays(TODAY, 15).toISOString(), status: 'active', autopay: true, paymentMethod: 'SEPA · IBAN *3421' },
    { id: 'c3', type: 'utility_internet', category: 'util', propertyId: 'p1', provider: 'Fastweb', clientCode: 'FW-8832-11', amountMonthly: 34, billingCycle: 'monthly', nextDue: addDays(TODAY, 18).toISOString(), status: 'active', autopay: true, paymentMethod: 'Carta *1199' },
    { id: 'c4', type: 'utility_water', category: 'util', propertyId: 'p1', provider: 'MM Milano', clientCode: 'MM-7711-03', amountMonthly: 28, billingCycle: 'bimonthly', nextDue: addDays(TODAY, 41).toISOString(), status: 'active', autopay: false, paymentMethod: 'Bollettino postale' },
    { id: 'c5', type: 'utility_power', category: 'util', propertyId: 'p2', provider: 'A2A Energia', clientCode: 'A2A-5544', amountMonthly: 98, billingCycle: 'monthly', nextDue: addDays(TODAY, 11).toISOString(), status: 'active', autopay: true, paymentMethod: 'SEPA · IBAN *3421' },
    { id: 'c6', type: 'utility_gas', category: 'util', propertyId: 'p2', provider: 'Eni Plenitude', clientCode: 'IT002G55667788', amountMonthly: 62, billingCycle: 'monthly', nextDue: addDays(TODAY, 22).toISOString(), status: 'active', autopay: true, paymentMethod: 'SEPA · IBAN *3421' },
    { id: 'c7', type: 'mortgage', category: 'rent', propertyId: 'p1', provider: 'Intesa Sanpaolo', clientCode: 'MUT-22119988', amountMonthly: 1180, billingCycle: 'monthly', nextDue: addDays(TODAY, 5).toISOString(), status: 'active', autopay: true, paymentMethod: 'Addebito c/c *3421', endDate: '2038-06-30' },
    { id: 'c8', type: 'rent', category: 'rent', propertyId: 'p2', provider: 'Immobiliare Colombo (locatore)', clientCode: 'LOC-0042', amountMonthly: 780, billingCycle: 'monthly', nextDue: addDays(TODAY, 3).toISOString(), status: 'active', autopay: false, paymentMethod: 'Bonifico manuale', endDate: '2027-08-31' },
    { id: 'c9', type: 'insurance', category: 'insurance', vehicleId: 'v1', provider: 'Generali', clientCode: 'POL-AU-778812', amountMonthly: 58, billingCycle: 'yearly', nextDue: addDays(TODAY, 82).toISOString(), status: 'active', autopay: false, paymentMethod: 'Carta *1199', label: 'RC Auto · Golf' },
    { id: 'c10', type: 'insurance', category: 'insurance', vehicleId: 'v2', provider: 'Unipol', clientCode: 'POL-AU-119934', amountMonthly: 44, billingCycle: 'yearly', nextDue: addDays(TODAY, 24).toISOString(), status: 'active', autopay: false, paymentMethod: 'Bonifico', label: 'RC Auto · 500' },
    { id: 'c11', type: 'insurance', category: 'insurance', propertyId: 'p1', provider: 'Allianz', clientCode: 'POL-CS-442211', amountMonthly: 22, billingCycle: 'yearly', nextDue: addDays(TODAY, 132).toISOString(), status: 'active', autopay: true, paymentMethod: 'SEPA · IBAN *3421', label: 'Casa · Appartamento' },
  ],
  workers: [
    {
      id: 'w1', firstName: 'Ana', lastName: 'Lopes',
      role: 'colf', contractType: 'part_time_indeterminato',
      hoursWeek: 20, hourlyGross: 9.50, monthlyNet: 760, inpsMonthly: 148, tfrAccrual: 63,
      startDate: '2023-09-01', propertyId: 'p1',
      nextSalaryDue: addDays(TODAY, 13).toISOString(),
      nextInpsDue: addDays(TODAY, 28).toISOString(),
      paymentMethod: 'Bonifico · IBAN *3421',
    },
  ],
  deadlines: [
    { id: 'd_imu', title: 'Acconto IMU', category: 'tax', amount: 480, date: addDays(TODAY, 34).toISOString(), recurring: 'semiannual', linkedTo: 'p1' },
    { id: 'd_tari', title: 'TARI rata 2', category: 'tax', amount: 180, date: addDays(TODAY, 47).toISOString(), recurring: 'semiannual', linkedTo: 'p1' },
    { id: 'd_bollo1', title: 'Bollo auto · Golf', category: 'tax', amount: 268, date: addDays(TODAY, 55).toISOString(), recurring: 'yearly', linkedTo: 'v1' },
    { id: 'd_rev', title: 'Revisione · Fiat 500', category: 'tax', amount: 80, date: addDays(TODAY, 72).toISOString(), recurring: 'biennial', linkedTo: 'v2' },
    { id: 'd_pass1', title: 'Passaporto Marco', category: 'doc', amount: 0, date: addDays(TODAY, 180).toISOString(), recurring: 'one-time', linkedTo: 'm1' },
    { id: 'd_pass2', title: 'Passaporto Sofia', category: 'doc', amount: 0, date: addDays(TODAY, 62).toISOString(), recurring: 'one-time', linkedTo: 'm3' },
    { id: 'd_netflix', title: 'Netflix', category: 'subscription', amount: 17.99, date: addDays(TODAY, 9).toISOString(), recurring: 'monthly' },
    { id: 'd_spotify', title: 'Spotify Family', category: 'subscription', amount: 17.99, date: addDays(TODAY, 19).toISOString(), recurring: 'monthly' },
    { id: 'd_gym', title: 'Palestra Marco', category: 'subscription', amount: 65, date: addDays(TODAY, 27).toISOString(), recurring: 'monthly' },
    { id: 'd_dent', title: 'Visita dentista Leo', category: 'health', amount: 80, date: addDays(TODAY, 16).toISOString(), recurring: 'one-time', linkedTo: 'm4' },
    { id: 'd_compl', title: 'Compleanno Sofia', category: 'family', amount: 0, date: addDays(TODAY, 48).toISOString(), recurring: 'yearly', linkedTo: 'm3' },
    { id: 'd_condo', title: 'Spese condominiali', category: 'tax', amount: 220, date: addDays(TODAY, 6).toISOString(), recurring: 'monthly', linkedTo: 'p1' },
  ],
  documents: [
    { id: 'doc1', name: 'Contratto Enel - Via Garibaldi.pdf', type: 'contract', size: 842, uploadedAt: '2024-03-20', linkedTo: 'c1' },
    { id: 'doc2', name: 'Polizza Allianz Casa 2025.pdf', type: 'insurance', size: 1204, uploadedAt: '2025-01-10', linkedTo: 'c11' },
    { id: 'doc3', name: 'Contratto locazione ufficio.pdf', type: 'contract', size: 968, uploadedAt: '2024-09-01', linkedTo: 'c8' },
    { id: 'doc4', name: 'Busta paga Ana - Marzo.pdf', type: 'payslip', size: 312, uploadedAt: '2026-03-28', linkedTo: 'w1' },
    { id: 'doc5', name: 'Atto mutuo Intesa.pdf', type: 'contract', size: 2241, uploadedAt: '2018-06-15', linkedTo: 'c7' },
    { id: 'doc6', name: 'Libretto Golf.pdf', type: 'vehicle', size: 488, uploadedAt: '2022-05-02', linkedTo: 'v1' },
  ],
  notifications: [
    { id: 'n1', type: 'warning', title: 'Affitto ufficio in scadenza', body: 'Pagamento di €780 dovuto in 3 giorni — modalità: Bonifico manuale.', at: new Date(TODAY).toISOString(), unread: true, ref: 'c8' },
    { id: 'n2', type: 'info', title: 'Rata mutuo addebitata tra 5 giorni', body: 'Intesa Sanpaolo · €1.180 · addebito automatico.', at: addDays(TODAY, 0).toISOString(), unread: true, ref: 'c7' },
    { id: 'n3', type: 'info', title: 'Scadenza spese condominiali', body: 'Tra 6 giorni · €220', at: addDays(TODAY, -1).toISOString(), unread: false, ref: 'd_condo' },
    { id: 'n4', type: 'warning', title: 'Assicurazione Fiat 500 in scadenza', body: 'Unipol · RC Auto · tra 24 giorni · €528 annuali', at: addDays(TODAY, -2).toISOString(), unread: false, ref: 'c10' },
    { id: 'n5', type: 'success', title: 'Stipendio Ana pagato', body: 'Febbraio 2026 · €760 · Bonifico', at: addDays(TODAY, -3).toISOString(), unread: false, ref: 'w1' },
  ],
  services: [
    { id: 'svc-identity', name: 'identity-service', ok: true, version: '1.4.2', latency: 42 },
    { id: 'svc-tenant', name: 'tenant-service', ok: true, version: '2.0.1', latency: 38 },
    { id: 'svc-household', name: 'household-service', ok: true, version: '1.2.8', latency: 51 },
    { id: 'svc-property', name: 'property-service', ok: true, version: '1.3.0', latency: 47 },
    { id: 'svc-contract', name: 'contract-service', ok: true, version: '1.5.4', latency: 58 },
    { id: 'svc-worker', name: 'worker-service', ok: true, version: '1.1.0', latency: 44 },
    { id: 'svc-deadline', name: 'deadline-service', ok: true, version: '1.8.0', latency: 39 },
    { id: 'svc-budget', name: 'budget-service', ok: true, version: '1.2.0', latency: 61 },
    { id: 'svc-calendar', name: 'calendar-service', ok: true, version: '1.0.5', latency: 72 },
    { id: 'svc-document', name: 'document-service', ok: true, version: '1.1.2', latency: 88 },
    { id: 'svc-notification', name: 'notification-service', ok: true, version: '2.1.0', latency: 33 },
  ],
};

function buildAllEvents(data) {
  const events = [];
  data.contracts.forEach(c => {
    events.push({
      id: `ev_${c.id}`,
      sourceId: c.id,
      title: `${c.provider}${c.label ? ' · ' + c.label : ''}`,
      subtype: c.type,
      category: c.category,
      amount: c.billingCycle === 'yearly' ? c.amountMonthly * 12 : c.amountMonthly,
      date: c.nextDue,
      autopay: c.autopay,
      recurring: c.billingCycle,
      propertyId: c.propertyId,
    });
  });
  data.workers.forEach(w => {
    events.push({
      id: `ev_sal_${w.id}`,
      sourceId: w.id,
      title: `Stipendio ${w.firstName} ${w.lastName}`,
      subtype: 'worker_salary',
      category: 'worker',
      amount: w.monthlyNet,
      date: w.nextSalaryDue,
      autopay: false,
      recurring: 'monthly',
    });
    events.push({
      id: `ev_inps_${w.id}`,
      sourceId: w.id,
      title: `Contributi INPS ${w.firstName}`,
      subtype: 'inps',
      category: 'tax',
      amount: w.inpsMonthly,
      date: w.nextInpsDue,
      autopay: false,
      recurring: 'quarterly',
    });
  });
  data.deadlines.forEach(d => {
    events.push({
      id: `ev_${d.id}`,
      sourceId: d.id,
      title: d.title,
      subtype: d.category,
      category: d.category,
      amount: d.amount,
      date: d.date,
      autopay: false,
      recurring: d.recurring,
    });
  });
  return events.sort((a, b) => new Date(a.date) - new Date(b.date));
}

export const DEMO_EVENTS = buildAllEvents(DEMO);

export const EMPTY = {
  tenant: { id: 'tenant_new_001', name: 'Nuovo nucleo', plan: 'Base', memberCount: 0 },
  households: [], members: [], properties: [], vehicles: [], contracts: [], workers: [],
  deadlines: [], documents: [], notifications: [],
  services: DEMO.services,
};

export function getData(empty) { return empty ? EMPTY : DEMO; }
export function getEvents(empty) { return empty ? [] : DEMO_EVENTS; }
