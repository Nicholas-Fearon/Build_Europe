import { programme } from './programme.mjs';
const areaIds = new Set(programme.map(area => area.id));

export function validateSubmission(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Please send valid form details.' };
  if (!['attend', 'sponsor', 'speak'].includes(input.type)) return { error: 'Please choose Attend, Sponsor, or Speak.' };
  if (input.website) return { error: 'Please leave the website field empty.' };
  const limits = { name: 100, email: 254, company: 150, topic: 200, message: 3000 };
  const value = { type: input.type };
  for (const [field, max] of Object.entries(limits)) {
    if (input[field] !== undefined && typeof input[field] !== 'string') return { error: `Please provide a valid ${field}.` };
    value[field] = (input[field] || '').trim();
    if (value[field].length > max) return { error: `The ${field} field is too long.` };
  }
  if (!value.name) return { error: 'Please enter your name.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) return { error: 'Please enter a valid email address.' };
  if (input.consent !== true) return { error: 'Please agree to be contacted about your enquiry.' };
  if (value.type === 'sponsor' && (!value.company || !value.topic)) return { error: 'Please add your organisation and partnership interest.' };
  if (value.type === 'speak' && (!value.topic || !value.message)) return { error: 'Please add your talk topic and a short outline.' };
  // The details object also accepts existing saved records during local migration.
  const details = {};
  if (value.type === 'attend') {
    const country = input.country ?? input.details?.country;
    const interests = input.interests ?? input.details?.interests;
    if (country !== undefined && (typeof country !== 'string' || country.trim().length > 100)) return { error: 'Please enter a valid country.' };
    if (interests !== undefined && (!Array.isArray(interests) || interests.length > areaIds.size || interests.some(item => !areaIds.has(item)))) return { error: 'Please select valid technical interests.' };
    if (country?.trim()) details.country = country.trim();
    if (interests?.length) details.interests = [...new Set(interests)];
  }
  if (value.type === 'speak') {
    const area = input.talk_area ?? input.details?.talk_area;
    if (area !== undefined && area !== '' && area !== 'other' && !areaIds.has(area)) return { error: 'Please choose a valid talk area.' };
    if (area) details.talk_area = area;
  }
  if (Object.keys(details).length) value.details = details;
  value.email = value.email.toLowerCase();
  return { value: { ...value, consent: true } };
}
