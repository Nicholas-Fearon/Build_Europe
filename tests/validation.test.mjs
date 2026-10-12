import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSubmission } from '../lib/validation.mjs';
const valid = { type: 'attend', name: ' Alex ', email: 'Alex@Example.com', consent: true };
test('attendee details are normalized and unknown fields discarded', () => { const { value } = validateSubmission({ ...valid, secret: 'discard' }); assert.equal(value.name, 'Alex'); assert.equal(value.email, 'alex@example.com'); assert.equal(value.secret, undefined); });
test('rejects malformed payloads and missing consent', () => { for (const input of [null, [], {}, { ...valid, email: 'bad' }, { ...valid, consent: false }, { ...valid, name: 123 }, { ...valid, name: 'a'.repeat(101) }, { ...valid, website: 'bot' }]) assert.ok(validateSubmission(input).error); });
test('sponsor requires an organisation and partnership interest', () => { assert.ok(validateSubmission({ ...valid, type: 'sponsor' }).error); assert.ok(validateSubmission({ ...valid, type: 'sponsor', company: 'Example', topic: 'Community partnership' }).value); });
test('speaker requires both a topic and an outline', () => { assert.ok(validateSubmission({ ...valid, type: 'speak', topic: 'AI' }).error); assert.ok(validateSubmission({ ...valid, type: 'speak', topic: 'AI', message: 'A practical workshop' }).value); });
