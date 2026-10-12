'use client';
import { useState, type FormEvent } from 'react';
export type Interest = 'attend' | 'sponsor' | 'speak';
const labels = { attend: 'Attend', sponsor: 'Sponsor', speak: 'Speak' };
export default function InterestForm({ type }: { type: Interest }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; setStatus('loading');
    const fields = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch('/api/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...fields, type, consent: fields.consent === 'on' }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'We could not save your details. Please try again.');
      form.reset(); setStatus('success'); setMessage(type === 'attend' ? 'You’re on the interest list. Your details have been saved; this is not a confirmed ticket.' : 'Your interest has been saved. Thank you for helping shape Build Europe.');
    } catch (error) { setStatus('error'); setMessage(error instanceof Error ? error.message : 'Please try again.'); }
  }
  return <div className="form-card">
    <div className="form-tabs" aria-label="Choose how to get involved">{(Object.keys(labels) as Interest[]).map(item => <a key={item} href={`/${item}`} aria-current={type === item ? 'page' : undefined} className={type === item ? 'active' : ''}>{labels[item]} <span>↗</span></a>)}</div>
    {status === 'success' ? <div className="success" role="status"><span className="success-mark">✓</span><h3>You’re part of what’s next.</h3><p>{message}</p><button className="text-link" onClick={() => setStatus('idle')}>Send another enquiry ↗</button></div> : <form key={type} onSubmit={submit}>
      <h3>{type === 'attend' ? 'Save your spot on the interest list.' : type === 'sponsor' ? 'Let’s build a partnership.' : 'Bring your perspective to the stage.'}</h3>
      <p className="form-description">{type === 'attend' ? 'Be first to hear when dates, location and registration are announced.' : type === 'sponsor' ? 'Tell us a little about your organisation and how you’d like to get involved.' : 'Big ideas, practical lessons, honest stories. We’d love to hear yours.'}</p>
      <div className="field-grid"><label>Full name <span>*</span><input name="name" autoComplete="name" placeholder="Alex Morgan" required maxLength={100}/></label><label>Email address <span>*</span><input name="email" type="email" autoComplete="email" placeholder="alex@example.com" required maxLength={254}/></label></div>
      <div className="field-grid"><label>{type === 'sponsor' ? 'Organisation *' : 'Company / organisation'}<input name="company" autoComplete="organization" placeholder="Where you build" required={type === 'sponsor'} maxLength={150}/></label><label>{type === 'attend' ? 'Your role' : type === 'sponsor' ? 'Partnership interest *' : 'Talk topic *'}{type === 'sponsor' ? <select name="topic" required defaultValue=""><option value="" disabled>Select an option</option><option>Event sponsorship</option><option>Community partnership</option><option>In-kind support</option><option>Let’s explore together</option></select> : <input name="topic" placeholder={type === 'attend' ? 'e.g. Software engineer' : 'What would you like to share?'} required={type === 'speak'} maxLength={200}/>}</label></div>
      {type !== 'attend' && <label>{type === 'speak' ? 'Tell us about your idea *' : 'Anything else we should know?'}<textarea name="message" placeholder={type === 'speak' ? 'A short outline of your talk and what people will take away…' : 'Your goals, ideas, or questions…'} required={type === 'speak'} maxLength={3000} rows={3}/></label>}
      <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
      <label className="consent"><input type="checkbox" name="consent" required/><span>I agree to be contacted about my Build Europe enquiry. <a href="/privacy">How we use your details</a>.</span></label>
      {status === 'error' && <p className="error" role="alert">{message}</p>}
      <button className="button dark form-submit" disabled={status === 'loading'}>{status === 'loading' ? 'Saving your details…' : type === 'attend' ? 'Register my interest' : type === 'sponsor' ? 'Send sponsorship enquiry' : 'Submit my speaking idea'}<span>↗</span></button>
      <p className="form-note">{type === 'attend' ? 'No payment. No commitment. Just possibility.' : 'Good things begin with a conversation.'}</p>
    </form>}
  </div>;
}
