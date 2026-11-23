import test from 'node:test';
import assert from 'node:assert/strict';
import { notifyEnquiry } from '../lib/enquiry-notifications.mjs';
const env = { RESEND_API_KEY: 'test-key', ENQUIRY_NOTIFICATION_FROM: 'events@example.com', ADMIN_EMAIL: 'organiser@example.com', APP_URL: 'https://events.example.com' };

test('all enquiry types email the submitted details to Michaela by default', async () => {
  for (const type of ['attend', 'sponsor', 'speak']) {
    const details = { country: 'Netherlands', interests: ['ai'], sponsorship_objectives: ['Inclusion'], partnership_timing: 'Exploring opportunities', contribution_type: 'Hands-on BUILD Lab', talk_area: 'cloud', session_level: 'Intermediate' };
    const result = await notifyEnquiry({ id: 'test-id', type, name: 'Alex', email: 'attendee@example.com', message: 'A practical outline', consent: true, details }, env, async (url, options) => {
      assert.equal(url, 'https://api.resend.com/emails');
      assert.equal(options.headers['Idempotency-Key'], 'build-europe-enquiry-test-id');
      const body = JSON.parse(options.body);
      assert.deepEqual(body.to, ['michaela@buildeurope.io']);
      assert.equal(body.reply_to, 'attendee@example.com');
      assert.ok(body.text.includes(`https://events.example.com/admin?type=${type}`));
      assert.ok(body.text.includes('Alex'));
      assert.ok(body.text.includes('attendee@example.com'));
      assert.ok(body.text.includes('A practical outline'));
      assert.ok(body.text.includes('Contact consent: Agreed'));
      if (type === 'attend') assert.ok(body.text.includes('Netherlands') && body.text.includes('AI & Machine Learning'));
      if (type === 'sponsor') assert.ok(body.text.includes('Inclusion') && body.text.includes('Exploring opportunities'));
      if (type === 'speak') assert.ok(body.text.includes('Hands-on BUILD Lab') && body.text.includes('BUILD CLOUD') && body.text.includes('Intermediate'));
      return new Response(null, { status: 200 });
    });
    assert.equal(result, 'sent');
  }
});

test('missing credentials and unknown types do not send; provider errors are handled', async () => {
  const neverSend = () => { throw new Error('Should not send'); };
  assert.equal(await notifyEnquiry({ type: '__proto__' }, env, neverSend), 'not-needed');
  assert.equal(await notifyEnquiry({ type: 'speak' }, {}, neverSend), 'not-configured');
  assert.equal(await notifyEnquiry({ id: 'test-id', type: 'sponsor' }, env, async () => new Response(null, { status: 502 })), 'failed');
  assert.equal(await notifyEnquiry({ id: 'test-id', type: 'attend' }, env, async () => { throw new Error('Network failure'); }), 'failed');
});

test('configured recipient and canonical production domain are respected', async () => {
  const settings = { ...env, APP_URL: '', ENQUIRY_NOTIFICATION_TO: ' michaela@buildeurope.io ' };
  assert.equal(await notifyEnquiry({ id: 'test-id', type: 'speak', email: 'speaker@example.com' }, settings, async (_, options) => {
    const body = JSON.parse(options.body);
    assert.deepEqual(body.to, ['michaela@buildeurope.io']);
    assert.ok(body.text.includes('https://www.buildeurope.io/admin?type=speak'));
    assert.ok(body.text.includes('Not provided'));
    return new Response(null, { status: 200 });
  }), 'sent');
});
