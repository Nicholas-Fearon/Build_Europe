import test from "node:test";
import assert from "node:assert/strict";
import { validateSubmission } from "../lib/validation.mjs";
const valid = {
  type: "attend",
  name: " Alex ",
  email: "Alex@Example.com",
  consent: true,
};
test("attendee details are normalized and unknown fields discarded", () => {
  const { value } = validateSubmission({ ...valid, secret: "discard" });
  assert.equal(value.name, "Alex");
  assert.equal(value.email, "alex@example.com");
  assert.equal(value.secret, undefined);
});
test("rejects malformed payloads and missing consent", () => {
  for (const input of [
    null,
    [],
    {},
    { ...valid, email: "bad" },
    { ...valid, consent: false },
    { ...valid, name: 123 },
    { ...valid, name: "a".repeat(101) },
    { ...valid, website: "bot" },
  ])
    assert.ok(validateSubmission(input).error);
});
test("sponsor requires an organisation and partnership interest", () => {
  assert.ok(validateSubmission({ ...valid, type: "sponsor" }).error);
  assert.ok(
    validateSubmission({
      ...valid,
      type: "sponsor",
      company: "Example",
      topic: "Community partnership",
    }).value,
  );
});
test("speaker can omit the topic but must describe the idea", () => {
  assert.ok(validateSubmission({ ...valid, type: "speak", topic: "AI" }).error);
  const { value } = validateSubmission({
    ...valid,
    type: "speak",
    message: "A practical workshop",
    contribution_type: "BUILD Lab / workshop",
  });
  assert.equal(value.topic, "");
  assert.deepEqual(value.details, { contribution_type: "BUILD Lab / workshop" });
  assert.deepEqual(validateSubmission(value).value.details, value.details);
  assert.ok(validateSubmission({ ...value, contribution_type: "Unknown" }).error);
});

test("sponsorship objectives support multiple selections and older enquiries", () => {
  const sponsor = { ...valid, type: "sponsor", company: "Example", topic: "Community partnership" };
  const { value } = validateSubmission({
    ...sponsor,
    sponsorship_objectives: ["Inclusion", "Developer engagement", "Inclusion"],
  });
  assert.deepEqual(value.details, { sponsorship_objectives: ["Inclusion", "Developer engagement"] });
  assert.deepEqual(validateSubmission(value).value.details, value.details);
  assert.equal(validateSubmission(sponsor).value.details, undefined);
  assert.ok(validateSubmission({ ...sponsor, sponsorship_objectives: ["Unknown"] }).error);
});

test('attendee country and multiple interests survive validation and migration', () => {
  const { value } = validateSubmission({ ...valid, country: ' Netherlands ', interests: ['ai', 'cloud', 'ai'] });
  assert.deepEqual(value.details, { country: 'Netherlands', interests: ['ai', 'cloud'] });
  assert.deepEqual(validateSubmission(value).value.details, value.details);
  assert.ok(validateSubmission({ ...valid, interests: ['unknown'] }).error);
  assert.ok(validateSubmission({ ...valid, country: 7 }).error);
});

test('speaker programme areas are restricted to known options, including Other', () => {
  const speaker = { ...valid, type: 'speak', topic: 'Learning systems', message: 'A technical talk' };
  assert.deepEqual(validateSubmission({ ...speaker, talk_area: 'other' }).value.details, { talk_area: 'other' });
  assert.ok(validateSubmission({ ...speaker, talk_area: 'unknown' }).error);
  assert.equal(validateSubmission(speaker).value.details, undefined);
});
