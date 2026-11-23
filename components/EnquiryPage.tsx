import InterestForm, { type Interest } from './InterestForm';
import Star from './Star';
const copy = {
  attend: { label: 'ATTEND / FIND YOUR PEOPLE', title: <>Be in the room<span>.</span></>, intro: ['Join Europe’s engineers, developers and technical practitioners for two days of practical learning, real engineering stories and meaningful connections.', 'Register your interest to be first to hear about tickets, speakers, BUILD Labs and programme announcements.'], note: 'This is an expression of interest. No ticket is booked and no payment is taken.' },
  sponsor: { label: 'SPONSOR / BACK THE VISION', title: <>Help make it<br/>possible<span>.</span></>, intro: ['Put your organisation at the heart of Europe’s engineering community.', 'Connect with developers, technical decision-makers and emerging talent. Showcase your technology, build meaningful partnerships and help shape the future of engineering.'], note: 'We’re welcoming sponsorship, community partnerships and in-kind support. Packages and opportunities will be confirmed as the event takes shape.' },
  speak: { label: 'SPEAK / SHARE YOUR PERSPECTIVE', title: <>Your ideas.<br/>Our next chapter<span>.</span></>, intro: ['Have you built something worth sharing?', 'We’re looking for engineers, developers, researchers and technical practitioners with real experiences, challenges and lessons to share. From technical case studies and live demonstrations to hands-on BUILD Labs, we want to hear what you’re working on.'], note: 'First-time speakers and experienced voices are welcome to express interest. Submitting an idea does not confirm a speaking slot.' },
};
export default function EnquiryPage({type}:{type:Interest}) {
  const content = copy[type];
  return <>
    <section className="register section-pad enquiry-page">
      <div className="register-copy">
        <a className="back-link" href="/">← Back to home</a>
        <p className="eyebrow">{content.label}</p>
        <h1 className="page-title">{content.title}</h1>
        {content.intro.map(text => <p key={text}>{text}</p>)}
        <div className="event-details">
          <div><span>PLANNED FOR</span><strong>October 2027</strong><small>Exact dates to be announced</small></div>
          <div><span>PROPOSED LOCATION</span><strong>Amsterdam, Netherlands</strong><small>Venue to be announced</small></div>
        </div>
        <Star className="register-star"/>
      </div>
      <InterestForm key={type} type={type}/>
    </section>
    {type === 'attend' && <section className="section-pad enquiry-information" aria-labelledby="attend-details-title">
      <h2 id="attend-details-title">Practical learning. Real engineering.</h2>
      <div className="home-experience-grid">
        <article><h3>What to expect</h3><p>Two days of engineering case studies, live demonstrations and hands-on BUILD Labs. Explore AI, software, data, cloud, security and technical careers with practitioners from across Europe.</p><a href="/#programme-title" className="text-link">Explore the programme pillars <span>↗</span></a></article>
        <article><h3>What happens next</h3><p>The interest list is where we’ll share ticket, speaker, BUILD Lab and programme announcements. Dates and the Amsterdam venue are being finalised. Registering interest does not reserve a ticket or take payment.</p><a href="/about" className="text-link">More about BUILD Europe <span>↗</span></a></article>
      </div>
    </section>}
    {type === 'sponsor' && <section className="section-pad enquiry-information" aria-labelledby="sponsor-details-title">
      <h2 id="sponsor-details-title">Find your place in Europe’s engineering community.</h2>
      <div className="home-experience-grid">
        <article><h3>Who you can connect with</h3><p>BUILD Europe is being built for engineers, developers, researchers, technical decision-makers and emerging talent. The event champions women in technology and welcomes everyone working towards a more inclusive industry.</p></article>
        <article><h3>Ways to partner</h3><p>Express interest as a Founding Partner, event sponsor, BUILD Labs or technical workshop partner, skills and education partner, exhibitor or community partner. Packages and opportunities will be confirmed as the event takes shape.</p></article>
        <article><h3>Tell us your objectives</h3><p>Share whether you’re exploring brand awareness, developer engagement, talent attraction, product adoption, inclusion or technical education. Include your timing and ideas in the form so we can discuss the right fit.</p></article>
        <article><h3>Technical learning comes first</h3><p>Sessions connected to sponsorship are expected to meet BUILD Europe’s editorial and technical standards. The speaker guide explains the learning formats and the practical value we want participants to take away.</p><a href="/speak/guide" className="text-link">Read the speaker guide <span>↗</span></a></article>
      </div>
    </section>}
    <section className="section-pad enquiry-note"><p>{content.note}</p><a href="/about" className="text-link">Explore the event <span>↗</span></a></section>
  </>;
}
