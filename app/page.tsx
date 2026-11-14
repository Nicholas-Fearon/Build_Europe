import { programme, workshopLevels } from '@/lib/programme.mjs';

const experiences = [
  ["Hear how it’s built", 'Real engineers sharing the systems, decisions and lessons behind their work.'],
  ['Get hands-on', 'Practical BUILD Labs to explore tools, tackle challenges and try something new.'],
  ['Find your people', 'Meet engineers, developers and technical leaders from across Europe.'],
  ['Grow your career', 'Learn from people navigating technical leadership, progression and what’s next.'],
];
export default function Home() {
  return <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot"/> ENGINEERING. COMMUNITY. POSSIBILITY.</p>
          <h1>The future<br/>is ours<br/>to <span className="build-word">build.</span></h1>
          <p className="hero-intro">A new European conference bringing together engineers, developers and technical practitioners for real engineering stories, hands-on learning and meaningful connections.</p>
          <p className="hero-summary">Built for everyone passionate about technology, with a commitment to championing women and creating a more inclusive engineering community.</p>
          <a className="button dark" href="/attend">Register your interest <span>↗</span></a>
          <p className="hero-note">Be the first to hear about tickets, speakers, BUILD Labs and launch announcements.</p>
        </div>
      <div className="hero-art brand-art" role="img" aria-label="Sculptural Build Europe symbol in blue, violet, pink and orange"><div className="brand-glow"/><span className="brand-art-label">PEOPLE BUILDING<br/>A BRIGHTER TOMORROW</span><svg className="hero-symbol" viewBox="0 0 500 540" aria-hidden="true"><defs><linearGradient id="hero-gradient" x1=".1" y1="0" x2=".8" y2="1"><stop stopColor="#335bff"/><stop offset=".32" stopColor="#8243ef"/><stop offset=".64" stopColor="#ed4bb8"/><stop offset="1" stopColor="#ff9a65"/></linearGradient><linearGradient id="hero-top" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f4f2ed"/><stop offset="1" stopColor="#c5c3d3"/></linearGradient></defs><path d="M72 70h204c108 0 163 46 163 111 0 50-32 88-81 104L247 178H72z" fill="url(#hero-top)"/><path d="M72 253h167l195 130c0 68-60 108-159 108H72z" fill="url(#hero-gradient)"/><path d="M72 253h167l-167 238z" fill="#ffffff" opacity=".07"/></svg><span className="brand-art-footer">IDEAS. COMMUNITY. POSSIBILITY.</span><span className="brand-art-arrow">↗</span></div></section>
      <section className="event-strip" aria-label="Event information">
        <div><strong>AMSTERDAM</strong><span>Netherlands</span></div>
        <div><strong>2027</strong><span>October</span></div>
        <div><strong>2 DAYS</strong><span>Technical learning &amp; community</span></div>
      </section>
      <section id="about" className="about section-pad">
        <div><p className="eyebrow">01 / THE IDEA</p><h2>Different journeys.<br/>A shared ambition.</h2></div>
        <div className="about-copy">
          <p className="large-copy">Technology moves forward when more of us have a hand in building it.</p>
          <p>The most exciting breakthroughs happen when different disciplines, experiences and perspectives come together.</p>
          <p>BUILD Europe creates space for those exchanges; bringing fresh thinking, practical expertise and new possibilities into the same room.</p>
          <p>Because the future of technology shouldn’t just be something we talk about. It should be something more of us have the opportunity to build.</p>
          <a href="/about" className="text-link">More about BUILD Europe <span>↗</span></a>
        </div>
      </section>
      <section className="section-pad home-experience" aria-labelledby="experience-title">
        <p className="eyebrow">02 / THE EXPERIENCE</p>
        <h2 id="experience-title">Come curious. Leave knowing more.</h2>
        <p className="home-section-intro">Two days of real engineering case studies, live demonstrations and hands-on learning.</p>
        <p className="home-section-intro">Go behind the scenes of the technologies being built across Europe. Discover the architecture, decisions, challenges and lessons behind real products and systems, with practical ideas you can take back to work.</p>
        <p className="home-section-intro">Whether you’re here to develop your skills, discover new technologies or meet people solving similar challenges, you’ll leave with something valuable.</p>
        <div className="home-experience-grid">{experiences.map(([title, description], index) => <article key={title}>
          <span className="home-card-number" aria-hidden="true">0{index + 1} /</span><h3>{title}</h3><p>{description}</p>
        </article>)}</div>
      </section>
      <section className="section-pad home-programme" aria-labelledby="programme-title">
        <p className="eyebrow">03 / THE PROGRAMME</p>
        <h2 id="programme-title">What we’ll explore</h2>
        <p className="home-section-intro">From building AI applications to securing complex systems, BUILD Europe will explore the technologies, challenges and ideas shaping modern engineering.</p>
        <div className="home-programme-grid">{programme.map(({id, title, description}) => <article key={id}>
          <h3>{title}</h3><p>{description}</p>
        </article>)}</div>
      </section>
      <section className="section-pad home-labs" aria-labelledby="labs-title">
        <div className="home-labs-copy">
          <p className="eyebrow">HANDS-ON WORKSHOPS</p>
          <h2 id="labs-title">BUILD Labs. Less watching. More doing.</h2>
          <p className="home-labs-lead">Bring your laptop and get involved.</p>
          <p>Work through practical engineering challenges alongside experienced practitioners, experiment with new tools and develop skills you can apply immediately.</p>
          <p>From AI applications and software development to cloud infrastructure, data and security, BUILD Labs are designed for people who want to learn by doing.</p>
        </div>
        <div className="home-labs-levels">
          <h3 className="eyebrow" id="labs-levels-title">Planned workshop levels</h3>
          <ul aria-labelledby="labs-levels-title">
            {workshopLevels.map(level => <li key={level}>{level}</li>)}
          </ul>
        </div>
      </section>
      <section id="involved" className="involved section-pad">
        <div className="section-heading"><div><p className="eyebrow">04 / MAKE IT YOURS</p><h2>There’s more than<br/>one way to build.</h2></div><p>Show up. Share a perspective.<br/>Help make it possible.</p></div>
        <div className="involvement-grid">
          <article>
            <span className="small-label">FOR THE BUILDERS</span>
            <h3>Be part of it.</h3>
            <p>Join engineers, developers and technical practitioners from across Europe for practical learning, fresh ideas and meaningful connections.</p>
            <a className="text-link" href="/attend">Register your interest <span>↗</span></a>
          </article>
          <article className="orange-card">
            <span className="small-label">FOR THE PARTNERS</span>
            <h3>Help shape what’s next.</h3>
            <p>Put your technology in front of Europe’s engineers, developers and technical decision-makers. Showcase real products, build meaningful relationships, engage technical talent and help shape the future of engineering.</p>
            <a className="text-link" href="/sponsor">Explore sponsorship <span>↗</span></a>
          </article>
          <article className="lilac-card">
            <span className="small-label">FOR THE TECHNICAL VOICES</span>
            <h3>Share what you’re building.</h3>
            <p>Have a real engineering story, technical challenge or practical skill to share? We’re looking for speakers and BUILD Lab contributors who can help others learn.</p>
            <a className="text-link" href="/speak">Get involved as a speaker <span>↗</span></a>
          </article>
        </div>
      </section>

  </>;
}
