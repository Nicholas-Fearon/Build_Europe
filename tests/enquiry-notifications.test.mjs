import test from 'node:test';
import assert from 'node:assert/strict';
import { notifyEnquiry } from '../lib/enquiry-notifications.mjs';
const env = { RESEND_API_KEY: 'test-key', ENQUIRY_NOTIFICATION_FROM: 'events@example.com', ADMIN_EMAIL: 'organiser@example.com', APP_URL: 'https://events.example.com' };

test('organiser alerts distinguish sponsor and speaker and omit submission data', async () => {
  for (const type of ['sponsor', 'speak']) {
    const result = await notifyEnquiry({ id: 'test-id', type, email: 'attendee@example.com', message: 'private outline' }, env, async (url, options) => {
      assert.equal(url, 'https://api.resend.com/emails');
      assert.equal(options.headers['Idempotency-Key'], 'build-europe-enquiry-test-id');
      const body = JSON.parse(options.body);
      assert.deepEqual(body.to, ['organiser@example.com']);
      assert.ok(body.text.includes(`https://events.example.com/admin?type=${type}`));
      assert.ok(!options.body.includes('attendee@example.com'));
      assert.ok(!options.body.includes('private outline'));
      return new Response(null, { status: 200 });
    });
    assert.equal(result, 'sent');
  }
});

test('no alerts are sent for attendance or without credentials; provider errors are handled', async () => {
  const neverSend = () => { throw new Error('Should not send'); };
  assert.equal(await notifyEnquiry({ type: 'attend' }, env, neverSend), 'not-needed');
  assert.equal(await notifyEnquiry({ type: 'speak' }, {}, neverSend), 'not-configured');
  assert.equal(await notifyEnquiry({ id: 'test-id', type: 'sponsor' }, env, async () => new Response(null, { status: 502 })), 'failed');
});
