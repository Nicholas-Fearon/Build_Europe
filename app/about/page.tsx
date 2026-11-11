import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'About — BUILD Europe' };
export default function AboutPage() { return <>
      <section id="about" className="about section-pad">
        <div><p className="eyebrow">01 / THE IDEA</p><h1 className="page-title">Different journeys.<br/>A shared ambition.</h1></div>
        <div className="about-copy">
          <p className="large-copy">Tech moves forward when more of us have a hand in building it.</p>
          <p>BUILD Europe brings together engineers, developers and technical practitioners from across Europe to share what they’re building, tackle real challenges and learn from one another.</p>
          <p>From software engineering and AI to cloud, data and cybersecurity, we’re creating a space where technical expertise, fresh perspectives and new ideas come together.</p>
          <p>We’re committed to championing women in technology while welcoming everyone who wants to be part of a more inclusive industry. Whether you’re writing code, building systems, solving complex challenges or leading technical teams, there’s a place for you here.</p>
          <a href="/attend" className="text-link">Register your interest <span>↗</span></a>
        </div>
      </section>
      <section className="experience section-pad"><div className="section-heading"><p className="eyebrow">ROOM FOR IDEAS. ROOM FOR YOU.</p><span>What we’re building towards ↘</span></div><div className="experience-grid">{[{n:'01',symbol:'↗',title:'Ideas worth exploring.',copy:'Get closer to the technologies shaping our future. Hear from people building real solutions, sharing practical lessons and tackling the challenges that matter.'},{n:'02',symbol:'✳',title:'Connections that last.',copy:'Meet engineers, developers and technical leaders from across Europe. Exchange ideas, discover opportunities and build relationships that go beyond the event.'},{n:'03',symbol:'⌘',title:'Get hands-on',copy:'Go beyond listening. Explore new tools, tackle practical challenges and learn from engineers who are building and solving problems every day.'}].map(item => <article key={item.n}><div className="experience-top"><span>{item.n}</span><span className="experience-symbol">{item.symbol}</span></div><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div></section>
      <section className="section-pad" aria-labelledby="founder-title">
        <h2 id="founder-title" className="mb-5">A new event. Built on years of experience.</h2>
        <p className="home-section-intro">BUILD Europe is founded by the creator of the Women in Technology World Series, bringing over a decade of experience building international technology events, connecting communities and creating opportunities for people across the industry.</p>
        <p className="home-section-intro mt-3">Now we’re bringing that experience to a new kind of engineering event, one shaped by the people building technology every day.</p>
      </section>
      <section className="faq section-pad">
        <p className="eyebrow">A FEW THINGS YOU MIGHT BE WONDERING</p><h2>Good questions.</h2>
        <div>
          <details><summary>Who is BUILD Europe for?<span>+</span></summary><p>BUILD Europe is for engineers, developers, technical practitioners and leaders working across AI, software, data, cloud, cybersecurity and beyond. We’re passionate about championing women in technology, but everyone is welcome. Whether you’re early in your career or have years of experience, there’s something here for you.</p></details>
          <details><summary>Are the date and venue confirmed?<span>+</span></summary><p>We’re planning BUILD Europe for Amsterdam in October 2027. We’re currently finalising the exact dates and venue. Register your interest to be the first to hear when they’re announced, along with programme and ticket details.</p></details>
          <details><summary>Does registering guarantee a ticket?<span>+</span></summary><p>This form joins the interest list. It does not book a ticket or take payment. Ticket availability and registration details will be shared when confirmed.</p></details>
          <details>
            <summary>Can I apply to speak or become a sponsor?<span>+</span></summary>
            <p>Absolutely. We’re looking for technical practitioners with real experiences to share, alongside organisations that want to connect with Europe’s technology community and champion greater inclusion. Visit our <a href="/speak" className="underline">Speak</a> or <a href="/sponsor" className="underline">Sponsor</a> pages to get involved. Submitting an enquiry doesn’t guarantee a speaking slot or sponsorship.</p>
          </details>
        </div>
      </section>
<section className="section-pad page-cta"><h2>Find your people.<br/>Build what’s next.</h2><a href="/attend" className="button dark">Register your interest <span>↗</span></a></section></>; }
