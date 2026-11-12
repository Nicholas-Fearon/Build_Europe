import { contributionTypes, partnershipTimingOptions, programme, sessionLevels, sponsorshipObjectives } from './programme.mjs';
const areaIds = new Set(programme.map(area => area.id));
const acceptedContributionTypes = new Set([
  ...contributionTypes, 'Technical talk', 'BUILD Lab / workshop', 'Panel / discussion', 'Open to ideas',
]);

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
  if (input.consent !== true) {
    return { error: value.type === 'attend' ? 'Please agree to receive BUILD Europe event updates.' : 'Please agree to be contacted about your enquiry.' };
  }
  if (value.type === 'sponsor' && (!value.company || !value.topic)) return { error: 'Please add your organisation and partnership interest.' };
  if (value.type === 'speak' && !value.message) return { error: 'Please tell us about your idea.' };
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
    const contribution = input.contribution_type ?? input.details?.contribution_type;
    const sessionLevel = input.session_level ?? input.details?.session_level;
    if (area !== undefined && area !== '' && area !== 'other' && !areaIds.has(area)) return { error: 'Please choose a valid talk area.' };
    if (contribution !== undefined && contribution !== '' && !acceptedContributionTypes.has(contribution)) return { error: 'Please choose a valid contribution type.' };
    if (sessionLevel !== undefined && sessionLevel !== '' && !sessionLevels.includes(sessionLevel)) return { error: 'Please choose a valid session level.' };
    if (area) details.talk_area = area;
    if (contribution) details.contribution_type = contribution;
    if (sessionLevel) details.session_level = sessionLevel;
  }
  if (value.type === 'sponsor') {
    const objectives = input.sponsorship_objectives ?? input.details?.sponsorship_objectives;
    const partnershipTiming = input.partnership_timing ?? input.details?.partnership_timing;
    if (objectives !== undefined && (!Array.isArray(objectives) || objectives.length > sponsorshipObjectives.length || objectives.some(item => !sponsorshipObjectives.includes(item)))) {
      return { error: 'Please select valid sponsorship objectives.' };
    }
    if (partnershipTiming !== undefined && partnershipTiming !== '' && !partnershipTimingOptions.includes(partnershipTiming)) return { error: 'Please choose a valid partnership timeframe.' };
    if (objectives?.length) details.sponsorship_objectives = [...new Set(objectives)];
    if (partnershipTiming) details.partnership_timing = partnershipTiming;
  }
  if (Object.keys(details).length) value.details = details;
  value.email = value.email.toLowerCase();
  return { value: { ...value, consent: true } };
}
