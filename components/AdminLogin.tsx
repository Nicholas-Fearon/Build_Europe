'use client';
import { useState, type FormEvent } from 'react';
export default function AdminLogin() {
  const [error, setError] = useState(''); const [pending, setPending] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setPending(true);
    const password = new FormData(event.currentTarget).get('password');
    try {
      const response = await fetch('/api/admin/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      window.location.assign('/admin');
    } catch (error) { setError(error instanceof Error ? error.message : 'Could not sign in.'); setPending(false); }
  }
  return <section className="section-pad admin-login"><p className="eyebrow">BUILD EUROPE / ADMIN</p><h1 className="page-title">Your community.<br/>In one place.</h1><p className="policy-intro">Sign in to review registrations and event enquiries.</p><div className="form-card"><form onSubmit={submit}><h2>Admin sign-in</h2><label>Admin password<input name="password" type="password" autoComplete="current-password" required maxLength={256}/></label>{error && <p className="error" role="alert">{error}</p>}<button className="button dark form-submit" disabled={pending}>{pending ? 'Signing in…' : 'Sign in'}<span>↗</span></button><p className="form-description">Use your configured admin password or the generated local password in <code>data/admin-access.json</code>.</p></form></div></section>;
}
