import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'About — BUILD Europe' };
export default function AboutPage() { return <>
      <section id="about" className="about section-pad">
        <div><p className="eyebrow">01 / THE IDEA</p><h1 className="page-title">Different journeys.<br/>A shared ambition.</h1></div>
        <div className="about-copy">
          <p className="large-copy">Tech moves forward when more of us have a hand in building it.</p>
          <p>Technology is advancing at extraordinary speed, but progress depends on the people designing, building and improving it.</p>
          <p>We believe the most valuable conversations happen when different disciplines, experiences and perspectives come together. When engineers learn from researchers, when emerging talent meets experienced practitioners, and when ideas are challenged by people who see problems differently.</p>
          <p>BUILD Europe was created to make more of those connections possible. We’re committed to championing women in technology, welcoming different perspectives and creating opportunities for more people to contribute to the future of engineering.</p>
          <a href="/attend" className="text-link">Register your interest <span>↗</span></a>
        </div>
      </section>
      <section className="experience section-pad"><div className="section-heading"><p className="eyebrow">ROOM FOR IDEAS. ROOM FOR YOU.</p><span>What we’re building towards ↘</span></div><div className="experience-grid">{[{n:'01',symbol:'↗',title:'Ideas worth exploring.',copy:'Progress starts with curiosity. We believe the best ideas emerge when people are encouraged to question assumptions, share knowledge and explore different approaches to solving problems.'},{n:'02',symbol:'✳',title:'Connections that last.',copy:'Great technology is rarely built in isolation. We believe in creating relationships across disciplines, organisations and backgrounds that continue long after an event ends.'},{n:'03',symbol:'⌘',title:'Get hands-on.',copy:'Learning is most powerful when it’s put into practice. We believe in creating opportunities for people to experiment, challenge themselves and develop confidence through doing.'}].map(item => <article key={item.n}><div className="experience-top"><span>{item.n}</span><span className="experience-symbol">{item.symbol}</span></div><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div></section>
      <section className="section-pad" aria-labelledby="founder-title">
        <h2 id="founder-title" className="mb-5">A new event. Built on years of experience.</h2>
        <p className="home-section-intro">BUILD Europe was founded by Michaela Fearon, creator of the Women in Technology World Series.</p>
        <p className="home-section-intro mt-3">Over more than a decade, Michaela has built international technology events, brought together thousands of professionals and worked with organisations across Europe and the US to create spaces for learning, connection and opportunity.</p>
        <p className="home-section-intro mt-3">BUILD Europe builds on that experience, with a new ambition: to create an inclusive European engineering community where technical achievement is celebrated, knowledge is shared and more people have the opportunity to shape what’s next.</p>
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
