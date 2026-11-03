import test from "node:test";
import assert from "node:assert/strict";
import {
  createSession,
  validSession,
  passwordMatches,
  SESSION_SECONDS,
} from "../lib/admin-auth.mjs";
const secret = "test-only-secret";
test("sessions expire and cannot be forged or reused under a different secret", () => {
  const now = 100000;
  const token = createSession(secret, now);
  assert.equal(validSession(token, secret, now), true);
  assert.equal(
    validSession(token, secret, now + SESSION_SECONDS * 1000),
    false,
  );
  assert.equal(validSession(token, "different-secret", now), false);
  assert.equal(validSession(token + "x", secret, now), false);
  assert.equal(validSession("invalid", secret, now), false);
  assert.equal(validSession(undefined, secret, now), false);
});
test("password check rejects incorrect and invalid inputs", () => {
  assert.equal(passwordMatches("correct-password", "correct-password"), true);
  for (const candidate of ["wrong", null, {}, "a".repeat(257)])
    assert.equal(passwordMatches(candidate, "correct-password"), false);
});
