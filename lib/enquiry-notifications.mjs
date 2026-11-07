import { adminEmail } from './runtime-config.mjs';

// Notifications contain no attendee contact details; organisers open the protected dashboard.
export async function notifyEnquiry(record, env = process.env, send = fetch) {
  if (record.type !== 'sponsor' && record.type !== 'speak') return 'not-needed';
  const key = env.RESEND_API_KEY?.trim();
  const from = env.ENQUIRY_NOTIFICATION_FROM?.trim();
  if (!key || !from) return 'not-configured';
  const to = env.ENQUIRY_NOTIFICATION_TO?.trim() || adminEmail(env);
  const label = record.type === 'sponsor' ? 'sponsorship enquiry' : 'speaking submission';
  const link = new URL(`/admin?type=${record.type}`, env.APP_URL || 'https://build-europe.vercel.app').href;
  try {
    const response = await send('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'Idempotency-Key': `build-europe-enquiry-${record.id}` },
      body: JSON.stringify({ from, to: [to], subject: `BUILD Europe: new ${label}`, text: `A new ${label} has been saved.\n\nReview it in the admin dashboard: ${link}\n\nReference: ${record.id}` }),
      signal: AbortSignal.timeout(4500),
    });
    if (!response.ok) return 'failed';
    return 'sent';
  } catch { return 'failed'; }
}
