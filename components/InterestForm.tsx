'use client';
import { useState, type FormEvent } from 'react';
import {
  contributionTypes, partnershipOptions, partnershipTimingOptions, programme, sessionLevels, sponsorshipObjectives,
} from '@/lib/programme.mjs';
export type Interest = 'attend' | 'sponsor' | 'speak';
const labels = { attend: 'Attend', sponsor: 'Sponsor', speak: 'Speak' };
const thankYou = {
  attend: 'Thanks for your interest in BUILD Europe! You’re on the list. We’ll be in touch as soon as we have more to share.',
  sponsor: 'Thanks for getting in touch! We’ve received your enquiry and will be in contact soon.',
  speak: 'Thanks for sharing your idea! We’ve received your submission and will be in touch if we’d like to explore it further.',
};
export default function InterestForm({ type }: { type: Interest }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = event.currentTarget; setStatus('loading');
    const data = new FormData(form);
    const fields = Object.fromEntries(data);
    try {
      const payload = {
        ...fields,
        type,
        interests: data.getAll('interests'),
        sponsorship_objectives: data.getAll('sponsorship_objectives'),
        consent: fields.consent === 'on',
      };
      const response = await fetch('/api/submissions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'We could not save your details. Please try again.');
      form.reset(); setStatus('success'); setMessage(thankYou[type]);
    } catch (error) { setStatus('error'); setMessage(error instanceof Error ? error.message : 'Please try again.'); }
  }
  return <div className="form-card">
    <div className="form-tabs" aria-label="Choose how to get involved">{(Object.keys(labels) as Interest[]).map(item => <a key={item} href={`/${item}`} aria-current={type === item ? 'page' : undefined} className={type === item ? 'active' : ''}>{labels[item]} <span>↗</span></a>)}</div>
    {status === 'success' ? <div className="success" role="status"><span className="success-mark">✓</span><h3>You’re part of what’s next.</h3><p>{message}</p><button className="text-link" onClick={() => setStatus('idle')}>Send another enquiry ↗</button></div> : <form key={type} onSubmit={submit}>
      <h3>{type === 'attend' ? 'Be first to hear about BUILD Europe.' : type === 'sponsor' ? 'Let’s build a partnership.' : 'Share what you’re building.'}</h3>
      <p className="form-description">{type === 'attend' ? 'Get updates on tickets, speakers, BUILD Labs and launch announcements.' : type === 'sponsor' ? 'Tell us a little about your organisation and how you’d like to get involved.' : 'Real engineering stories, practical lessons and honest experiences. Tell us what you’d like to share.'}</p>
      <div className="field-grid"><label>Full name <span>*</span><input name="name" autoComplete="name" placeholder="Alex Morgan" required maxLength={100}/></label><label>Email address <span>*</span><input name="email" type="email" autoComplete="email" placeholder="alex@example.com" required maxLength={254}/></label></div>
      <div className="field-grid">
        <label>{type === 'sponsor' ? 'Organisation *' : 'Company / organisation'}<input name="company" autoComplete="organization" placeholder="Where you build" required={type === 'sponsor'} maxLength={150}/></label>
        <label>
          {type === 'attend' ? 'Your role' : type === 'sponsor' ? 'Partnership interest *' : 'Talk topic (optional)'}
          {type === 'sponsor' ? <select name="topic" required defaultValue=""><option value="" disabled>Select an option</option>{partnershipOptions.map(option => <option key={option}>{option}</option>)}</select> : <input name="topic" placeholder={type === 'attend' ? 'e.g. Software engineer' : 'What would you like to share?'} maxLength={200}/>}
        </label>
      </div>
      {type === 'attend' && <>
        <label>Country<input name="country" autoComplete="country-name" maxLength={100} placeholder="e.g. Netherlands"/></label>
        <fieldset className="form-interests"><legend>What are you most interested in? <span>(optional)</span></legend>
          <div className="form-interest-options">{programme.map(area => <label key={area.id}><input type="checkbox" name="interests" value={area.id}/>{area.interest}</label>)}</div>
        </fieldset>
      </>}
      {type === 'sponsor' && <>
        <fieldset className="form-interests">
          <legend>What are your sponsorship objectives? <span>(optional)</span></legend>
          <div className="form-interest-options">
            {sponsorshipObjectives.map(objective => <label key={objective}><input type="checkbox" name="sponsorship_objectives" value={objective}/>{objective}</label>)}
          </div>
        </fieldset>
        <label>When are you considering partnership involvement? <span>(optional)</span>
          <select name="partnership_timing" defaultValue="">
            <option value="">Select a timeframe</option>
            {partnershipTimingOptions.map(timing => <option key={timing}>{timing}</option>)}
          </select>
        </label>
      </>}
      {type === 'speak' && <>
        <label>Contribution type<select name="contribution_type" defaultValue="">
          <option value="">Select a contribution type</option>
          {contributionTypes.map(contribution => <option key={contribution}>{contribution}</option>)}
        </select></label>
        <label>Which area best fits your contribution?<select name="talk_area" defaultValue=""><option value="">Select an area</option>{programme.map(area => <option key={area.id} value={area.id}>{area.title}</option>)}</select></label>
        <label>What level is your proposed session aimed at? <span>(optional)</span>
          <select name="session_level" defaultValue="">
            <option value="">Select a level</option>
            {sessionLevels.map(level => <option key={level}>{level}</option>)}
          </select>
        </label>
      </>}
      {type === 'speak' && <label>Tell us what you’ve built, learned or would like to share. <span>*</span>
        <textarea name="message" placeholder="Tell us about the technical challenge, project, research or practical lesson you’d like to bring to BUILD Europe. A fully developed session proposal isn’t necessary at this stage." required maxLength={3000} rows={4}/>
      </label>}
      {type === 'sponsor' && <label>Anything else we should know?
        <textarea name="message" placeholder="Your goals, ideas, or questions…" maxLength={3000} rows={3}/>
      </label>}
      <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
      <label className="consent"><input type="checkbox" name="consent" required/>
        {type === 'attend'
          ? <span>I agree to receive BUILD Europe event updates by email. Read our <a href="/privacy">privacy notice</a>.</span>
          : <span>I agree to be contacted about my BUILD Europe enquiry. <a href="/privacy">How we use your details</a>.</span>}
      </label>
      {status === 'error' && <p className="error" role="alert">{message}</p>}
      <button className="button dark form-submit" disabled={status === 'loading'}>{status === 'loading' ? 'Saving your details…' : type === 'attend' ? 'Register my interest' : type === 'sponsor' ? 'Send sponsorship enquiry' : 'Submit my speaking idea'}<span>↗</span></button>
      <p className="form-note">{type === 'attend' ? 'No payment. No commitment. Just possibility.' : 'Good things begin with a conversation.'}</p>
    </form>}
  </div>;
}
