import { useState } from 'react';
import { Drawer, Button } from '../ui.jsx';
import {
  useCreateMember, useUpdateMember, useDeleteMember,
  useCreateProperty, useUpdateProperty, useDeleteProperty,
  useCreateVehicle, useUpdateVehicle, useDeleteVehicle,
  useCreateContract, useUpdateContract, useDeleteContract,
  useCreateWorker, useUpdateWorker, useDeleteWorker,
  useCreateEvent, useUpdateEvent, useDeleteEvent,
  useCreateTransaction, useDeleteTransaction,
  useUploadDocument, useDeleteDocument,
} from '../api/hooks.js';

function Field({ label, children }) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      {children}
    </div>
  );
}

function useForm(initial) {
  const [v, setV] = useState(initial);
  const set = (k) => (e) => setV(f => ({ ...f, [k]: e.target.value }));
  const setVal = (k, val) => setV(f => ({ ...f, [k]: val }));
  return [v, set, setVal];
}

// ─── Member ──────────────────────────────────────────────────────────────────
export function MemberForm({ initial, lang, onClose }) {
  const isEdit = !!initial?.id;
  const [v, set] = useForm({
    firstName: initial?.firstName || '',
    lastName: initial?.lastName || '',
    birthDate: initial?.birthDate ? initial.birthDate.slice(0, 10) : '',
    relation: initial?.relation || 'partner',
    role: initial?.role || 'member',
    email: initial?.email || '',
    phone: initial?.phone || '',
  });
  const create = useCreateMember();
  const update = useUpdateMember();
  const del = useDeleteMember();
  const it = lang === 'it';

  async function save() {
    if (isEdit) await update.mutateAsync({ id: initial.id, ...v });
    else await create.mutateAsync(v);
    onClose();
  }
  async function remove() {
    if (!confirm(it ? 'Eliminare questo membro?' : 'Delete this member?')) return;
    await del.mutateAsync(initial.id);
    onClose();
  }

  const pending = create.isPending || update.isPending;

  return (
    <Drawer open title={isEdit ? (it ? 'Modifica membro' : 'Edit member') : (it ? 'Nuovo membro' : 'New member')} onClose={onClose}
      footer={
        <>
          {isEdit && <Button variant="danger" onClick={remove} disabled={del.isPending}>{it ? 'Elimina' : 'Delete'}</Button>}
          <span style={{ flex: 1 }} />
          <Button onClick={onClose}>{it ? 'Annulla' : 'Cancel'}</Button>
          <Button variant="primary" onClick={save} disabled={pending}>{pending ? '…' : it ? 'Salva' : 'Save'}</Button>
        </>
      }>
      <div className="vstack" style={{ gap: 14 }}>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label={it ? 'Nome' : 'First name'}><input className="input" value={v.firstName} onChange={set('firstName')} required /></Field>
          <Field label={it ? 'Cognome' : 'Last name'}><input className="input" value={v.lastName} onChange={set('lastName')} required /></Field>
        </div>
        <Field label={it ? 'Data di nascita' : 'Birth date'}><input className="input" type="date" value={v.birthDate} onChange={set('birthDate')} /></Field>
        <Field label={it ? 'Relazione' : 'Relation'}>
          <select className="select" value={v.relation} onChange={set('relation')}>
            {['partner','adult_child','child','parent','other'].map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Ruolo">
          <select className="select" value={v.role} onChange={set('role')}>
            <option value="owner">Owner</option>
            <option value="member">Member</option>
            <option value="advisor">Advisor</option>
          </select>
        </Field>
        <Field label="Email"><input className="input" type="email" value={v.email} onChange={set('email')} /></Field>
        <Field label="Telefono"><input className="input" type="tel" value={v.phone} onChange={set('phone')} /></Field>
        {(create.error || update.error) && <div style={{ color: 'var(--danger)', fontSize: 13 }}>{(create.error || update.error)?.message}</div>}
      </div>
    </Drawer>
  );
}

// ─── Property ─────────────────────────────────────────────────────────────────
export function PropertyForm({ initial, lang, onClose }) {
  const isEdit = !!initial?.id;
  const [v, set] = useForm({
    name: initial?.name || '',
    type: initial?.type || 'home',
    address: initial?.address || '',
    size: initial?.size || '',
    rooms: initial?.rooms || '',
  });
  const create = useCreateProperty();
  const update = useUpdateProperty();
  const del = useDeleteProperty();
  const it = lang === 'it';

  async function save() {
    const payload = { ...v, size: v.size ? Number(v.size) : undefined, rooms: v.rooms ? Number(v.rooms) : undefined };
    if (isEdit) await update.mutateAsync({ id: initial.id, ...payload });
    else await create.mutateAsync(payload);
    onClose();
  }
  async function remove() {
    if (!confirm(it ? 'Eliminare questo immobile?' : 'Delete this property?')) return;
    await del.mutateAsync(initial.id);
    onClose();
  }

  const pending = create.isPending || update.isPending;
  return (
    <Drawer open title={isEdit ? (it ? 'Modifica immobile' : 'Edit property') : (it ? 'Nuovo immobile' : 'New property')} onClose={onClose}
      footer={
        <>
          {isEdit && <Button variant="danger" onClick={remove}>{it ? 'Elimina' : 'Delete'}</Button>}
          <span style={{ flex: 1 }} />
          <Button onClick={onClose}>{it ? 'Annulla' : 'Cancel'}</Button>
          <Button variant="primary" onClick={save} disabled={pending}>{pending ? '…' : it ? 'Salva' : 'Save'}</Button>
        </>
      }>
      <div className="vstack" style={{ gap: 14 }}>
        <Field label={it ? 'Nome' : 'Name'}><input className="input" value={v.name} onChange={set('name')} required /></Field>
        <Field label={it ? 'Tipo' : 'Type'}>
          <select className="select" value={v.type} onChange={set('type')}>
            <option value="home">{it ? 'Abitazione' : 'Home'}</option>
            <option value="office">{it ? 'Ufficio' : 'Office'}</option>
            <option value="vacation">{it ? 'Casa vacanza' : 'Vacation home'}</option>
            <option value="rental">{it ? 'In affitto' : 'Rental'}</option>
          </select>
        </Field>
        <Field label={it ? 'Indirizzo' : 'Address'}><input className="input" value={v.address} onChange={set('address')} /></Field>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="m²"><input className="input" type="number" value={v.size} onChange={set('size')} /></Field>
          <Field label={it ? 'Locali' : 'Rooms'}><input className="input" type="number" value={v.rooms} onChange={set('rooms')} /></Field>
        </div>
        {(create.error || update.error) && <div style={{ color: 'var(--danger)', fontSize: 13 }}>{(create.error || update.error)?.message}</div>}
      </div>
    </Drawer>
  );
}

// ─── Vehicle ──────────────────────────────────────────────────────────────────
export function VehicleForm({ initial, members, lang, onClose }) {
  const isEdit = !!initial?.id;
  const [v, set] = useForm({
    brand: initial?.brand || '',
    model: initial?.model || '',
    plate: initial?.plate || '',
    year: initial?.year || new Date().getFullYear(),
    fuelType: initial?.fuelType || 'petrol',
    ownerId: initial?.ownerId || '',
    insuranceEnd: initial?.insuranceEnd ? initial.insuranceEnd.slice(0, 10) : '',
  });
  const create = useCreateVehicle();
  const update = useUpdateVehicle();
  const del = useDeleteVehicle();
  const it = lang === 'it';

  async function save() {
    const payload = { ...v, year: Number(v.year) };
    if (isEdit) await update.mutateAsync({ id: initial.id, ...payload });
    else await create.mutateAsync(payload);
    onClose();
  }
  async function remove() {
    if (!confirm(it ? 'Eliminare questo veicolo?' : 'Delete this vehicle?')) return;
    await del.mutateAsync(initial.id);
    onClose();
  }

  const pending = create.isPending || update.isPending;
  return (
    <Drawer open title={isEdit ? (it ? 'Modifica veicolo' : 'Edit vehicle') : (it ? 'Nuovo veicolo' : 'New vehicle')} onClose={onClose}
      footer={
        <>
          {isEdit && <Button variant="danger" onClick={remove}>{it ? 'Elimina' : 'Delete'}</Button>}
          <span style={{ flex: 1 }} />
          <Button onClick={onClose}>{it ? 'Annulla' : 'Cancel'}</Button>
          <Button variant="primary" onClick={save} disabled={pending}>{pending ? '…' : it ? 'Salva' : 'Save'}</Button>
        </>
      }>
      <div className="vstack" style={{ gap: 14 }}>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label={it ? 'Marca' : 'Brand'}><input className="input" value={v.brand} onChange={set('brand')} /></Field>
          <Field label={it ? 'Modello' : 'Model'}><input className="input" value={v.model} onChange={set('model')} /></Field>
        </div>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Targa"><input className="input" value={v.plate} onChange={set('plate')} /></Field>
          <Field label={it ? 'Anno' : 'Year'}><input className="input" type="number" value={v.year} onChange={set('year')} /></Field>
        </div>
        <Field label={it ? 'Carburante' : 'Fuel'}>
          <select className="select" value={v.fuelType} onChange={set('fuelType')}>
            <option value="petrol">{it ? 'Benzina' : 'Petrol'}</option>
            <option value="diesel">Diesel</option>
            <option value="hybrid">{it ? 'Ibrido' : 'Hybrid'}</option>
            <option value="electric">{it ? 'Elettrico' : 'Electric'}</option>
          </select>
        </Field>
        {members?.length > 0 && (
          <Field label={it ? 'Proprietario' : 'Owner'}>
            <select className="select" value={v.ownerId} onChange={set('ownerId')}>
              <option value="">—</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>)}
            </select>
          </Field>
        )}
        <Field label={it ? 'Scadenza assicurazione' : 'Insurance end'}><input className="input" type="date" value={v.insuranceEnd} onChange={set('insuranceEnd')} /></Field>
        {(create.error || update.error) && <div style={{ color: 'var(--danger)', fontSize: 13 }}>{(create.error || update.error)?.message}</div>}
      </div>
    </Drawer>
  );
}

// ─── Contract ─────────────────────────────────────────────────────────────────
export function ContractForm({ initial, properties, vehicles, lang, onClose }) {
  const isEdit = !!initial?.id;
  const [v, set] = useForm({
    type: initial?.type || 'electricity',
    provider: initial?.provider || '',
    clientCode: initial?.clientCode || '',
    label: initial?.label || '',
    category: initial?.category || 'util',
    amountMonthly: initial?.amountMonthly || '',
    billingCycle: initial?.billingCycle || 'monthly',
    nextDue: initial?.nextDue ? initial.nextDue.slice(0, 10) : '',
    autopay: initial?.autopay ? 'true' : 'false',
    paymentMethod: initial?.paymentMethod || '',
    propertyId: initial?.propertyId || '',
    vehicleId: initial?.vehicleId || '',
  });
  const create = useCreateContract();
  const update = useUpdateContract();
  const del = useDeleteContract();
  const it = lang === 'it';

  async function save() {
    const payload = {
      ...v,
      amountMonthly: Number(v.amountMonthly),
      autopay: v.autopay === 'true',
      propertyId: v.propertyId || undefined,
      vehicleId: v.vehicleId || undefined,
    };
    if (isEdit) await update.mutateAsync({ id: initial.id, ...payload });
    else await create.mutateAsync(payload);
    onClose();
  }
  async function remove() {
    if (!confirm(it ? 'Eliminare questo contratto?' : 'Delete this contract?')) return;
    await del.mutateAsync(initial.id);
    onClose();
  }

  const pending = create.isPending || update.isPending;
  return (
    <Drawer open title={isEdit ? (it ? 'Modifica contratto' : 'Edit contract') : (it ? 'Nuovo contratto' : 'New contract')} onClose={onClose}
      footer={
        <>
          {isEdit && <Button variant="danger" onClick={remove}>{it ? 'Elimina' : 'Delete'}</Button>}
          <span style={{ flex: 1 }} />
          <Button onClick={onClose}>{it ? 'Annulla' : 'Cancel'}</Button>
          <Button variant="primary" onClick={save} disabled={pending}>{pending ? '…' : it ? 'Salva' : 'Save'}</Button>
        </>
      }>
      <div className="vstack" style={{ gap: 14 }}>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label={it ? 'Tipo' : 'Type'}>
            <select className="select" value={v.type} onChange={set('type')}>
              <option value="electricity">{it ? 'Luce' : 'Electricity'}</option>
              <option value="gas">Gas</option>
              <option value="water">{it ? 'Acqua' : 'Water'}</option>
              <option value="internet">Internet</option>
              <option value="phone">{it ? 'Telefono' : 'Phone'}</option>
              <option value="rent">{it ? 'Affitto' : 'Rent'}</option>
              <option value="mortgage">{it ? 'Mutuo' : 'Mortgage'}</option>
              <option value="insurance">{it ? 'Assicurazione' : 'Insurance'}</option>
              <option value="subscription">{it ? 'Abbonamento' : 'Subscription'}</option>
              <option value="other">{it ? 'Altro' : 'Other'}</option>
            </select>
          </Field>
          <Field label={it ? 'Categoria' : 'Category'}>
            <select className="select" value={v.category} onChange={set('category')}>
              <option value="util">{it ? 'Utenza' : 'Utility'}</option>
              <option value="rent">{it ? 'Affitto/Mutuo' : 'Rent/Mortgage'}</option>
              <option value="insurance">{it ? 'Assicurazione' : 'Insurance'}</option>
              <option value="subscription">{it ? 'Abbonamento' : 'Subscription'}</option>
            </select>
          </Field>
        </div>
        <Field label={it ? 'Fornitore' : 'Provider'}><input className="input" value={v.provider} onChange={set('provider')} /></Field>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label={it ? 'Codice cliente' : 'Client code'}><input className="input" value={v.clientCode} onChange={set('clientCode')} /></Field>
          <Field label={it ? 'Etichetta' : 'Label'}><input className="input" value={v.label} onChange={set('label')} /></Field>
        </div>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label={it ? 'Importo' : 'Amount (€)'}><input className="input" type="number" step="0.01" value={v.amountMonthly} onChange={set('amountMonthly')} /></Field>
          <Field label={it ? 'Frequenza' : 'Cycle'}>
            <select className="select" value={v.billingCycle} onChange={set('billingCycle')}>
              <option value="monthly">{it ? 'Mensile' : 'Monthly'}</option>
              <option value="bimonthly">{it ? 'Bimestrale' : 'Bimonthly'}</option>
              <option value="quarterly">{it ? 'Trimestrale' : 'Quarterly'}</option>
              <option value="annual">{it ? 'Annuale' : 'Annual'}</option>
            </select>
          </Field>
        </div>
        <Field label={it ? 'Prossima scadenza' : 'Next due date'}><input className="input" type="date" value={v.nextDue} onChange={set('nextDue')} /></Field>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label={it ? 'Pagamento' : 'Payment method'}><input className="input" value={v.paymentMethod} onChange={set('paymentMethod')} placeholder="RID, Bonifico…" /></Field>
          <Field label={it ? 'Automatico' : 'Autopay'}>
            <select className="select" value={v.autopay} onChange={set('autopay')}>
              <option value="true">{it ? 'Sì' : 'Yes'}</option>
              <option value="false">No</option>
            </select>
          </Field>
        </div>
        {properties?.length > 0 && (
          <Field label={it ? 'Immobile' : 'Property'}>
            <select className="select" value={v.propertyId} onChange={set('propertyId')}>
              <option value="">—</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
        )}
        {vehicles?.length > 0 && (
          <Field label={it ? 'Veicolo' : 'Vehicle'}>
            <select className="select" value={v.vehicleId} onChange={set('vehicleId')}>
              <option value="">—</option>
              {vehicles.map(v2 => <option key={v2.id} value={v2.id}>{v2.brand} {v2.model} · {v2.plate}</option>)}
            </select>
          </Field>
        )}
        {(create.error || update.error) && <div style={{ color: 'var(--danger)', fontSize: 13 }}>{(create.error || update.error)?.message}</div>}
      </div>
    </Drawer>
  );
}

// ─── Worker ───────────────────────────────────────────────────────────────────
export function WorkerForm({ initial, properties, lang, onClose }) {
  const isEdit = !!initial?.id;
  const [v, set] = useForm({
    firstName: initial?.firstName || '',
    lastName: initial?.lastName || '',
    fiscalCode: initial?.fiscalCode || '',
    role: initial?.role || 'colf',
    hoursWeek: initial?.hoursWeek || '',
    hourlyGross: initial?.hourlyGross || '',
    monthlyNet: initial?.monthlyNet || '',
    inpsMonthly: initial?.inpsMonthly || '',
    tfrAccrual: initial?.tfrAccrual || '',
    propertyId: initial?.propertyId || '',
    nextSalaryDue: initial?.nextSalaryDue ? initial.nextSalaryDue.slice(0, 10) : '',
    nextInpsDue: initial?.nextInpsDue ? initial.nextInpsDue.slice(0, 10) : '',
  });
  const create = useCreateWorker();
  const update = useUpdateWorker();
  const del = useDeleteWorker();
  const it = lang === 'it';

  async function save() {
    const payload = {
      ...v,
      hoursWeek: Number(v.hoursWeek),
      hourlyGross: Number(v.hourlyGross),
      monthlyNet: Number(v.monthlyNet),
      inpsMonthly: Number(v.inpsMonthly),
      tfrAccrual: Number(v.tfrAccrual),
      propertyId: v.propertyId || undefined,
    };
    if (isEdit) await update.mutateAsync({ id: initial.id, ...payload });
    else await create.mutateAsync(payload);
    onClose();
  }
  async function remove() {
    if (!confirm(it ? 'Eliminare questo lavoratore?' : 'Delete this worker?')) return;
    await del.mutateAsync(initial.id);
    onClose();
  }

  const pending = create.isPending || update.isPending;
  return (
    <Drawer open title={isEdit ? (it ? 'Modifica lavoratore' : 'Edit worker') : (it ? 'Nuovo lavoratore' : 'New worker')} onClose={onClose}
      footer={
        <>
          {isEdit && <Button variant="danger" onClick={remove}>{it ? 'Elimina' : 'Delete'}</Button>}
          <span style={{ flex: 1 }} />
          <Button onClick={onClose}>{it ? 'Annulla' : 'Cancel'}</Button>
          <Button variant="primary" onClick={save} disabled={pending}>{pending ? '…' : it ? 'Salva' : 'Save'}</Button>
        </>
      }>
      <div className="vstack" style={{ gap: 14 }}>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label={it ? 'Nome' : 'First name'}><input className="input" value={v.firstName} onChange={set('firstName')} /></Field>
          <Field label={it ? 'Cognome' : 'Last name'}><input className="input" value={v.lastName} onChange={set('lastName')} /></Field>
        </div>
        <Field label={it ? 'Codice fiscale' : 'Fiscal code'}><input className="input" value={v.fiscalCode} onChange={set('fiscalCode')} /></Field>
        <Field label="Ruolo">
          <select className="select" value={v.role} onChange={set('role')}>
            <option value="colf">Colf</option>
            <option value="babysitter">Baby-sitter</option>
            <option value="badante">Badante</option>
            <option value="giardiniere">Giardiniere</option>
            <option value="altro">{it ? 'Altro' : 'Other'}</option>
          </select>
        </Field>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label={it ? 'Ore/sett.' : 'Hours/week'}><input className="input" type="number" value={v.hoursWeek} onChange={set('hoursWeek')} /></Field>
          <Field label={it ? 'Paga oraria lorda (€)' : 'Hourly gross (€)'}><input className="input" type="number" step="0.01" value={v.hourlyGross} onChange={set('hourlyGross')} /></Field>
        </div>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <Field label={it ? 'Netto mese (€)' : 'Monthly net (€)'}><input className="input" type="number" step="0.01" value={v.monthlyNet} onChange={set('monthlyNet')} /></Field>
          <Field label={it ? 'INPS mese (€)' : 'INPS/month (€)'}><input className="input" type="number" step="0.01" value={v.inpsMonthly} onChange={set('inpsMonthly')} /></Field>
          <Field label="TFR (€)"><input className="input" type="number" step="0.01" value={v.tfrAccrual} onChange={set('tfrAccrual')} /></Field>
        </div>
        {properties?.length > 0 && (
          <Field label={it ? 'Immobile' : 'Property'}>
            <select className="select" value={v.propertyId} onChange={set('propertyId')}>
              <option value="">—</option>
              {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </Field>
        )}
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label={it ? 'Prossimo stipendio' : 'Next salary date'}><input className="input" type="date" value={v.nextSalaryDue} onChange={set('nextSalaryDue')} /></Field>
          <Field label={it ? 'Prossimo INPS' : 'Next INPS date'}><input className="input" type="date" value={v.nextInpsDue} onChange={set('nextInpsDue')} /></Field>
        </div>
        {(create.error || update.error) && <div style={{ color: 'var(--danger)', fontSize: 13 }}>{(create.error || update.error)?.message}</div>}
      </div>
    </Drawer>
  );
}

// ─── Event ────────────────────────────────────────────────────────────────────
export function EventForm({ initial, lang, onClose }) {
  const isEdit = !!initial?.id;
  const [v, set] = useForm({
    title: initial?.title || '',
    date: initial?.date ? initial.date.slice(0, 10) : '',
    time: initial?.time || '',
    category: initial?.category || 'family',
    amount: initial?.amount || '',
    note: initial?.note || '',
  });
  const create = useCreateEvent();
  const update = useUpdateEvent();
  const del = useDeleteEvent();
  const it = lang === 'it';

  async function save() {
    const payload = { ...v, amount: v.amount ? Number(v.amount) : undefined };
    if (isEdit) await update.mutateAsync({ id: initial.id, ...payload });
    else await create.mutateAsync(payload);
    onClose();
  }
  async function remove() {
    if (!confirm(it ? 'Eliminare questo evento?' : 'Delete this event?')) return;
    await del.mutateAsync(initial.id);
    onClose();
  }

  const pending = create.isPending || update.isPending;
  return (
    <Drawer open title={isEdit ? (it ? 'Modifica evento' : 'Edit event') : (it ? 'Nuovo evento' : 'New event')} onClose={onClose}
      footer={
        <>
          {isEdit && <Button variant="danger" onClick={remove}>{it ? 'Elimina' : 'Delete'}</Button>}
          <span style={{ flex: 1 }} />
          <Button onClick={onClose}>{it ? 'Annulla' : 'Cancel'}</Button>
          <Button variant="primary" onClick={save} disabled={pending}>{pending ? '…' : it ? 'Salva' : 'Save'}</Button>
        </>
      }>
      <div className="vstack" style={{ gap: 14 }}>
        <Field label={it ? 'Titolo' : 'Title'}><input className="input" value={v.title} onChange={set('title')} required /></Field>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label={it ? 'Data' : 'Date'}><input className="input" type="date" value={v.date} onChange={set('date')} required /></Field>
          <Field label={it ? 'Ora' : 'Time'}><input className="input" type="time" value={v.time} onChange={set('time')} /></Field>
        </div>
        <Field label={it ? 'Categoria' : 'Category'}>
          <select className="select" value={v.category} onChange={set('category')}>
            <option value="util">{it ? 'Utenza' : 'Utility'}</option>
            <option value="rent">{it ? 'Affitto/Mutuo' : 'Rent/Mortgage'}</option>
            <option value="worker">{it ? 'Lavoratore' : 'Worker'}</option>
            <option value="tax">{it ? 'Tassa' : 'Tax'}</option>
            <option value="insurance">{it ? 'Assicurazione' : 'Insurance'}</option>
            <option value="subscription">{it ? 'Abbonamento' : 'Subscription'}</option>
            <option value="health">{it ? 'Salute' : 'Health'}</option>
            <option value="family">{it ? 'Famiglia' : 'Family'}</option>
          </select>
        </Field>
        <Field label={it ? 'Importo (€)' : 'Amount (€)'}><input className="input" type="number" step="0.01" value={v.amount} onChange={set('amount')} placeholder="0.00" /></Field>
        <Field label="Note"><textarea className="input" value={v.note} onChange={set('note')} rows={3} style={{ resize: 'vertical' }} /></Field>
        {(create.error || update.error) && <div style={{ color: 'var(--danger)', fontSize: 13 }}>{(create.error || update.error)?.message}</div>}
      </div>
    </Drawer>
  );
}

// ─── Transaction ──────────────────────────────────────────────────────────────
export function TransactionForm({ lang, onClose }) {
  const [v, set] = useForm({
    type: 'expense',
    category: 'family',
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  });
  const create = useCreateTransaction();
  const it = lang === 'it';

  async function save() {
    await create.mutateAsync({ ...v, amount: Number(v.amount) });
    onClose();
  }

  return (
    <Drawer open title={it ? 'Registra movimento' : 'Log transaction'} onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{it ? 'Annulla' : 'Cancel'}</Button>
          <Button variant="primary" onClick={save} disabled={create.isPending}>{create.isPending ? '…' : it ? 'Salva' : 'Save'}</Button>
        </>
      }>
      <div className="vstack" style={{ gap: 14 }}>
        <Field label={it ? 'Tipo' : 'Type'}>
          <select className="select" value={v.type} onChange={set('type')}>
            <option value="income">{it ? 'Entrata' : 'Income'}</option>
            <option value="expense">{it ? 'Uscita' : 'Expense'}</option>
          </select>
        </Field>
        <Field label={it ? 'Categoria' : 'Category'}>
          <select className="select" value={v.category} onChange={set('category')}>
            <option value="salary">{it ? 'Stipendio' : 'Salary'}</option>
            <option value="util">{it ? 'Utenza' : 'Utility'}</option>
            <option value="rent">{it ? 'Affitto/Mutuo' : 'Rent/Mortgage'}</option>
            <option value="worker">{it ? 'Lavoratore' : 'Worker'}</option>
            <option value="tax">{it ? 'Tasse' : 'Taxes'}</option>
            <option value="insurance">{it ? 'Assicurazione' : 'Insurance'}</option>
            <option value="subscription">{it ? 'Abbonamento' : 'Subscription'}</option>
            <option value="health">{it ? 'Salute' : 'Health'}</option>
            <option value="family">{it ? 'Famiglia' : 'Family'}</option>
            <option value="other">{it ? 'Altro' : 'Other'}</option>
          </select>
        </Field>
        <Field label={it ? 'Descrizione' : 'Description'}><input className="input" value={v.description} onChange={set('description')} /></Field>
        <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label={it ? 'Importo (€)' : 'Amount (€)'}><input className="input" type="number" step="0.01" value={v.amount} onChange={set('amount')} /></Field>
          <Field label={it ? 'Data' : 'Date'}><input className="input" type="date" value={v.date} onChange={set('date')} /></Field>
        </div>
        {create.error && <div style={{ color: 'var(--danger)', fontSize: 13 }}>{create.error.message}</div>}
      </div>
    </Drawer>
  );
}

// ─── Document ─────────────────────────────────────────────────────────────────
export function DocumentUploadForm({ lang, onClose }) {
  const [file, setFile] = useState(null);
  const [type, setType] = useState('contract');
  const upload = useUploadDocument();
  const del = useDeleteDocument();
  const it = lang === 'it';

  async function save() {
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', type);
    await upload.mutateAsync(fd);
    onClose();
  }

  return (
    <Drawer open title={it ? 'Carica documento' : 'Upload document'} onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>{it ? 'Annulla' : 'Cancel'}</Button>
          <Button variant="primary" onClick={save} disabled={upload.isPending || !file}>{upload.isPending ? '…' : it ? 'Carica' : 'Upload'}</Button>
        </>
      }>
      <div className="vstack" style={{ gap: 14 }}>
        <Field label={it ? 'File' : 'File'}>
          <input className="input" type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={e => setFile(e.target.files[0])} />
        </Field>
        <Field label={it ? 'Tipo' : 'Type'}>
          <select className="select" value={type} onChange={e => setType(e.target.value)}>
            <option value="contract">{it ? 'Contratto' : 'Contract'}</option>
            <option value="insurance">{it ? 'Assicurazione' : 'Insurance'}</option>
            <option value="payslip">{it ? 'Busta paga' : 'Payslip'}</option>
            <option value="vehicle">{it ? 'Veicolo' : 'Vehicle'}</option>
            <option value="other">{it ? 'Altro' : 'Other'}</option>
          </select>
        </Field>
        {upload.error && <div style={{ color: 'var(--danger)', fontSize: 13 }}>{upload.error.message}</div>}
      </div>
    </Drawer>
  );
}

export function DeleteDocumentButton({ id, lang, onClose }) {
  const del = useDeleteDocument();
  const it = lang === 'it';
  async function remove() {
    if (!confirm(it ? 'Eliminare questo documento?' : 'Delete this document?')) return;
    await del.mutateAsync(id);
    if (onClose) onClose();
  }
  return <Button variant="danger" onClick={remove} disabled={del.isPending}>{it ? 'Elimina' : 'Delete'}</Button>;
}
