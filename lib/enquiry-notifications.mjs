import { programme } from './programme.mjs';

const labels = { attend: 'attendance interest', sponsor: 'sponsorship enquiry', speak: 'speaking submission' };

function enquiryFields(record) {
  const details = record.details || {};
  const fields = [
    ['Name', record.name],
    ['Email', record.email],
    ['Organisation', record.company],
  ];
  if (record.type === 'attend') {
    fields.push(
      ['Role', record.topic],
      ['Country', details.country],
      ['Technical interests', details.interests?.map(id => programme.find(area => area.id === id)?.interest || id).join(', ')],
    );
  }
  if (record.type === 'sponsor') {
    fields.push(
      ['Partnership interest', record.topic],
      ['Sponsorship objectives', details.sponsorship_objectives?.join(', ')],
      ['Partnership timing', details.partnership_timing],
    );
  }
  if (record.type === 'speak') {
    fields.push(
      ['Talk topic', record.topic],
      ['Contribution type', details.contribution_type],
      ['Programme area', programme.find(area => area.id === details.talk_area)?.title || details.talk_area],
      ['Session level', details.session_level],
    );
  }
  fields.push(['Message', record.message], ['Contact consent', record.consent ? 'Agreed' : 'Not recorded'], ['Submitted', record.created_at]);
  return fields.map(([label, value]) => `${label}: ${value || 'Not provided'}`).join('\n\n');
}

export async function notifyEnquiry(record, env = process.env, send = fetch) {
  if (!Object.hasOwn(labels, record.type)) return 'not-needed';
  const label = labels[record.type];
  const key = env.RESEND_API_KEY?.trim();
  const from = env.ENQUIRY_NOTIFICATION_FROM?.trim();
  if (!key || !from) return 'not-configured';
  const to = env.ENQUIRY_NOTIFICATION_TO?.trim() || 'michaela@buildeurope.io';
  const link = new URL(`/admin?type=${record.type}`, env.APP_URL?.trim() || 'https://www.buildeurope.io').href;
  try {
    const response = await send('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `build-europe-enquiry-${record.id}` },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: record.email,
        subject: `BUILD Europe: new ${label}`,
        text: `A new ${label} has been saved.\n\n${enquiryFields(record)}\n\nReview it in the admin dashboard: ${link}\n\nReference: ${record.id}`,
      }),
      signal: AbortSignal.timeout(4500),
    });
    if (!response.ok) return 'failed';
    return 'sent';
  } catch { return 'failed'; }
}
