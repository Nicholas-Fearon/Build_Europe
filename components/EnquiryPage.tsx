import InterestForm, { type Interest } from './InterestForm';
import Star from './Star';
const copy = {
  attend: { label: 'ATTEND / FIND YOUR PEOPLE', title: <>Be in the room<span>.</span></>, intro: 'Join the interest list for Build Europe. Be first to hear when the date, location, programme and ticket details are announced.', note: 'This is an expression of interest. No ticket is booked and no payment is taken.' },
  sponsor: { label: 'SPONSOR / BACK THE VISION', title: <>Help make it<br/>possible<span>.</span></>, intro: 'Connect your organisation with women shaping the future of tech. Tell us what a meaningful partnership looks like for you.', note: 'We’re welcoming sponsorship, community partnerships and in-kind support. Packages and opportunities will be confirmed as the event takes shape.' },
  speak: { label: 'SPEAK / SHARE YOUR PERSPECTIVE', title: <>Your ideas.<br/>Our next chapter<span>.</span></>, intro: 'Bring a fresh perspective, a practical lesson, or a story worth sharing. Help shape the Build Europe conversation.', note: 'First-time speakers and experienced voices are welcome to express interest. Submitting an idea does not confirm a speaking slot.' },
};
export default function EnquiryPage({type}:{type:Interest}) {
  const content = copy[type];
  return <><section className="register section-pad enquiry-page"><div className="register-copy"><a className="back-link" href="/">← Back to home</a><p className="eyebrow">{content.label}</p><h1 className="page-title">{content.title}</h1><p>{content.intro}</p><div className="event-details"><div><span>WHEN</span><strong>Date to be announced</strong></div><div><span>WHERE</span><strong>European location to be announced</strong></div></div><Star className="register-star"/></div><InterestForm key={type} type={type}/></section><section className="section-pad enquiry-note"><p>{content.note}</p><a href="/about" className="text-link">Explore the event <span>↗</span></a></section></>;
}
