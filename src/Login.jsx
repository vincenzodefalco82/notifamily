import { useState } from 'react';
import { api } from './api/client.js';

export function Login({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', name: '', householdName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = mode === 'login'
        ? await api.post('/auth/login', { email: form.email, password: form.password })
        : await api.post('/auth/register', { email: form.email, password: form.password, name: form.name, householdName: form.householdName });
      localStorage.setItem('nf_token', res.token);
      localStorage.setItem('nf_user', JSON.stringify(res.user));
      onAuth(res.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg-base)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 32, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>NotiFamily</div>
        <div style={{ fontSize: 14, color: 'var(--text-3)', marginBottom: 24 }}>
          {mode === 'login' ? 'Accedi al tuo nucleo familiare' : 'Crea il tuo nucleo familiare'}
        </div>

        <div className="tab-bar" style={{ marginBottom: 24 }}>
          <button className={mode === 'login' ? 'active' : ''} onClick={() => setMode('login')}>Accedi</button>
          <button className={mode === 'register' ? 'active' : ''} onClick={() => setMode('register')}>Registrati</button>
        </div>

        <form onSubmit={submit} className="vstack" style={{ gap: 14 }}>
          {mode === 'register' && (
            <>
              <div className="field">
                <label className="field-label">Nome completo</label>
                <input className="input" value={form.name} onChange={set('name')} required placeholder="Mario Rossi" />
              </div>
              <div className="field">
                <label className="field-label">Nome nucleo familiare</label>
                <input className="input" value={form.householdName} onChange={set('householdName')} required placeholder="Famiglia Rossi" />
              </div>
            </>
          )}
          <div className="field">
            <label className="field-label">Email</label>
            <input className="input" type="email" value={form.email} onChange={set('email')} required placeholder="mario@email.it" />
          </div>
          <div className="field">
            <label className="field-label">Password</label>
            <input className="input" type="password" value={form.password} onChange={set('password')} required minLength={6} placeholder="••••••••" />
          </div>
          {error && (
            <div style={{ background: 'color-mix(in oklch, var(--danger) 12%, transparent)', border: '1px solid color-mix(in oklch, var(--danger) 30%, transparent)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--danger)' }}>
              {error}
            </div>
          )}
          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading}
            style={{ marginTop: 4, justifyContent: 'center' }}
          >
            {loading ? 'Caricamento…' : mode === 'login' ? 'Accedi' : 'Crea account'}
          </button>
        </form>
      </div>
    </div>
  );
}
