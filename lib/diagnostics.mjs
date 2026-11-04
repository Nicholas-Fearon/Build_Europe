// Report controlled labels only. Never log exception messages, request bodies,
// cookie values, email addresses, or environment variable values.
import { ConfigurationError } from './runtime-config.mjs';
export function reportFailure(scope, stage, error) {
  const knownScopes = ['ADMIN', 'SUBMISSION'];
  const knownStages = ['ORIGIN', 'RATE_LIMIT', 'AUTHENTICATION', 'SIGN_OUT', 'PAGE', 'STORAGE'];
  const safeScope = knownScopes.includes(scope) ? scope : 'SERVER';
  const safeStage = knownStages.includes(stage) ? stage : 'REQUEST';
  const configurationCode = error instanceof ConfigurationError ? error.code : undefined;
  const code = typeof error?.code === 'string' && /^[A-Z0-9_]{1,60}$/.test(error.code) ? error.code : undefined;
  const reference = `${safeScope}_${configurationCode || safeStage}`;
  console.error(JSON.stringify({ event: 'build_europe_failure', reference, stage: safeStage, ...(code ? {code} : {}) }));
  return reference;
}
