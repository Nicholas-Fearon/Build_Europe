import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Call for Speakers & Speaker Guide — BUILD Europe 2027',
  description: 'Share your engineering experience at BUILD Europe 2027. Explore conference talks, BUILD Labs, Deep Dives, topic ideas and tips for your speaker proposal.',
  alternates: { canonical: 'https://www.buildeurope.io/speak/guide' },
  openGraph: {
    type: 'website',
    title: 'Speaker Guide — BUILD Europe 2027',
    description: 'Explore session formats, engineering topics and practical guidance for your BUILD Europe speaker proposal.',
    url: 'https://www.buildeurope.io/speak/guide',
    siteName: 'BUILD Europe',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary',
    title: 'Speaker Guide — BUILD Europe 2027',
    description: 'Real engineering. Real challenges. Real takeaways. Share your session idea with BUILD Europe.',
  },
};

export default function SpeakerGuidePage() {
  return (
    <article className="speaker-guide section-pad">
      <header className="speaker-guide-header">
        <p className="eyebrow">BUILD THE CONVERSATION</p>
        <h1 className="page-title">Your Guide to Speaking at BUILD Europe 2027</h1>
        <p className="speaker-guide-lead">Real engineering. Real challenges. Real takeaways.</p>
        <div className="speaker-guide-intro">
          <p>Great technology is built by people who ask difficult questions, challenge established thinking, experiment with new approaches and learn from what doesn't work.</p>
          <p>At BUILD Europe, we want to hear from those people.</p>
          <p>We're bringing together software engineers, AI practitioners, developers, architects, cloud and platform specialists, security professionals and technical leaders for two days of meaningful technical learning.</p>
          <p>We're looking for people who have something valuable to share.</p>
          <p>You don't need to be a professional speaker. You don't need an impressive job title. And you certainly don't need a perfectly polished success story.</p>
          <p>If you've built something interesting, solved a difficult problem, learned something the hard way or developed an approach that other engineers could benefit from, we want to hear from you.</p>
        </div>
        <Link className="button dark" href="/speak#speaker-application">Apply to speak <span aria-hidden="true">↗</span>
        </Link>
      </header>
      <nav className="speaker-guide-nav" aria-label="Speaker guide sections">
        <a href="#great-sessions">Great sessions</a>
        <a href="#formats">Session formats</a>
        <a href="#topics">Topic ideas</a>
        <a href="#selection">Selection guidance</a>
        <a href="#who">Who can speak</a>
        <a href="#proposal">Your proposal</a>
      </nav>
      <section className="speaker-guide-section" id="great-sessions" aria-labelledby="great-sessions-title">
        <h2 id="great-sessions-title">What makes a great BUILD session?</h2>
        <p>We believe the best technical sessions leave people thinking differently, working smarter or ready to try something new.</p>
        <p>Our ambition is simple: every BUILD attendee should leave with practical knowledge they can apply.</p>
        <p>Whether that's a new engineering workflow, a better architectural approach, a testing framework, an understanding of emerging technology or a lesson from someone else's experience, we want every session to deliver genuine value.</p>
        <p>We particularly love sessions that:</p>
        <ul>
          <li>Take us behind the scenes of real technology, systems and engineering decisions.</li>
          <li>Explain how something was built, tested, scaled, secured or improved.</li>
          <li>Share genuine challenges, unexpected outcomes and lessons learned.</li>
          <li>Demonstrate technical concepts rather than simply talking about them.</li>
          <li>Explore approaches that could shape engineering in 2027, 2028 and beyond.</li>
          <li>Challenge conventional thinking with evidence and experience.</li>
          <li>Give attendees something practical they can take back to their teams.</li>
        </ul>
        <p>You don't have to have all the answers. Some of the most valuable conversations start with an interesting question.</p>
      </section>
      <section className="speaker-guide-section" id="formats" aria-labelledby="formats-title">
        <h2 id="formats-title">Three ways to contribute</h2>
        <p>BUILD Europe offers three distinct learning experiences, each designed to help our attendees engage with technology in a different way.</p>
        <div className="speaker-guide-formats">
          <article className="speaker-guide-card">
            <h3>The BUILD Conference</h3>
            <p className="speaker-guide-card-intro">Share the thinking. Show the engineering. Start the conversation.</p>
            <p>Our main conference brings the entire BUILD community together in one room for two days of technical presentations, demonstrations, case studies and thought-provoking discussions.</p>
            <p>The programme explores the engineering challenges shaping our industry, from AI-native software development and complex architecture to security, infrastructure, reliability and the future of technical careers.</p>
            <p>Format: Typically, 30-50 minutes, depending on the session.</p>
            <h4>What works well?</h4>
            <ul>
              <li>Technical presentations and engineering case studies</li>
              <li>Live demonstrations and technical walkthroughs</li>
              <li>Behind-the-scenes architecture stories</li>
              <li>Engineering postmortems and lessons learned</li>
              <li>Practitioner discussions and technical debates</li>
              <li>Forward-looking keynotes grounded in real-world experience</li>
            </ul>
            <h4>How to deliver a brilliant conference session</h4>
            <ol>
              <li>Start with a real problem. What were you trying to solve, and why was it difficult?</li>
              <li>Show us what happened. Take attendees through the architecture, decisions, methods, tools or experiments.</li>
              <li>Share the trade-offs. What didn't work? What would you do differently?</li>
              <li>Leave something behind. Give attendees a framework, methodology, checklist or practical insight they can apply themselves.</li>
            </ol>
            <p>We encourage technical diagrams, demonstrations, code examples, real metrics and interactive elements wherever appropriate.</p>
            <p>A compelling engineering story is more important than a famous company name.</p>
          </article>
          <article className="speaker-guide-card">
            <h3>BUILD Labs</h3>
            <p className="speaker-guide-card-intro">Less watching. More doing.</p>
            <p>BUILD Labs are our practical, hands-on learning experiences.</p>
            <p>They're designed for attendees who want to move beyond understanding a concept and actually practise it.</p>
            <p>We want participants to get involved, solve problems, make decisions, test ideas and leave with something they've created or improved.</p>
            <p>Format: 60-minute facilitated workshops, designed for smaller groups of approximately 40-80 participants.</p>
            <p>Selected Labs may be repeated during the event to give more attendees access.</p>
            <h4>What works well?</h4>
            <p>Participants might:</p>
            <ul>
              <li>Fix a deliberately broken AI application.</li>
              <li>Build and test an evaluation framework.</li>
              <li>Identify vulnerabilities in a controlled agent environment.</li>
              <li>Review and improve AI-generated code.</li>
              <li>Respond to a simulated production incident.</li>
              <li>Design an architecture that must survive unexpected constraints.</li>
              <li>Repair a failing data pipeline.</li>
              <li>Create a developer workflow that reduces friction.</li>
              <li>Practise making and defending difficult technical decisions.</li>
            </ul>
            <h4>How to deliver a brilliant BUILD Lab</h4>
            <ol className="speaker-guide-timeline">
              <li>First 5-10 minutes: Introduce the challenge, explain the intended outcome and provide any essential technical context.</li>
              <li>Next 35-40 minutes: Participants work through practical exercises, individually or in small teams, with guidance from the facilitator.</li>
              <li>Final 10-15 minutes: Review the results, discuss different approaches and share practical lessons.</li>
            </ol>
            <p>We're looking for active participation rather than extended presentations.</p>
            <p>Ideally, participants should leave with something useful: working code, a tested solution, a reference architecture, an evaluation framework, a decision record or a practical checklist.</p>
            <p>We'll work with selected facilitators to develop the right exercise format, technical setup and learning objectives.</p>
          </article>
          <article className="speaker-guide-card">
            <h3>BUILD Deep Dives</h3>
            <p className="speaker-guide-card-intro">Go further. Solve harder problems. Build deeper expertise.</p>
            <p>Our BUILD Deep Dives are advanced, 90-minute learning experiences for attendees who want to explore a specific technical challenge in greater depth.</p>
            <p>These sessions are designed for smaller groups and are offered as optional paid learning experiences.</p>
            <p>They're ideal for experienced practitioners who want to work through a complex scenario, apply advanced techniques or explore the trade-offs behind difficult engineering decisions.</p>
            <p>Format: 90-minute facilitated technical workshops, with a working capacity of approximately 20-40 participants.</p>
            <h4>What works well?</h4>
            <ul>
              <li>Taking an AI agent from prototype to controlled production readiness.</li>
              <li>Designing secure and auditable autonomous workflows.</li>
              <li>Responding to simulated infrastructure failures.</li>
              <li>Making high-stakes architecture decisions under cost and regulatory constraints.</li>
              <li>Developing a modernisation strategy for a complex legacy platform.</li>
              <li>Building a detailed implementation plan with expert feedback.</li>
            </ul>
            <h4>How to deliver a brilliant Deep Dive</h4>
            <ol className="speaker-guide-timeline">
              <li>First 15 minutes: Set the scenario, explain the technical challenge and establish the starting point.</li>
              <li>Next 50-55 minutes: Guided practical work, experimentation, scenario changes and expert coaching.</li>
              <li>Final 20-25 minutes: Review decisions, compare solutions, discuss trade-offs and develop actionable next steps.</li>
            </ol>
            <p>We want attendees to leave with a substantial output they can adapt to their own work.</p>
            <p>Deep Dives should offer meaningful depth beyond an introductory workshop.</p>
          </article>
        </div>
      </section>
      <section className="speaker-guide-section" id="topics" aria-labelledby="topics-title">
        <h2 id="topics-title">Looking for inspiration? What could you talk about?</h2>
        <p>Our programme is built around the technology, challenges and skills shaping engineering today and tomorrow.</p>
        <p>Here are some of the conversations we'd love to explore.</p>
        <p>These are suggestions, not restrictions. We welcome different angles, alternative titles and entirely new ideas.</p>
        <div className="speaker-guide-topics">
          <details>
            <summary>AI-NATIVE SOFTWARE ENGINEERING</summary>
            <ul>
              <li>The AI Productivity Paradox: Are We Shipping Better Software or Just More Code?</li>
              <li>AI Made Us Faster. Our Release Process Got Slower.</li>
              <li>Beyond Vibe Coding: Building Production-Ready Software With AI</li>
              <li>Your Agent Passed 99% of Tests. Why Did It Still Fail?</li>
              <li>The Context Engineering Clinic: Why Your Coding Agent Keeps Failing</li>
              <li>The Junior Developer Paradox: Who Learns When AI Does the Easy Work?</li>
              <li>Who Tests the AI? Building Evaluations That Catch Real Failures</li>
            </ul>
            <p>We're particularly interested in practical experience with coding agents, software quality, evaluation, developer workflows and the changing role of engineering judgement.</p>
          </details>
          <details>
            <summary>SOFTWARE ARCHITECTURE &amp; ENGINEERING AT SCALE</summary>
            <ul>
              <li>Architecture Under Fire: Build for 50 Million Users</li>
              <li>The Architecture Courtroom: Defend Your Design</li>
              <li>Monolith, Microservices or Modular? The 2028 Rebuild Decision</li>
              <li>What Broke at 10× Traffic - and the Architecture We Built Next</li>
              <li>The Technical Debt We Chose to Keep</li>
              <li>The €1 Million Architecture Decision</li>
              <li>One Request, Twelve Systems: Tracing a Transaction End to End</li>
            </ul>
            <p>Show us the architecture, the constraints, the decisions and what you learned.</p>
          </details>
          <details>
            <summary>CLOUD, PLATFORMS &amp; DATA ENGINEERING</summary>
            <ul>
              <li>The Golden Path Nobody Used - Until We Changed Three Things</li>
              <li>Platform Engineering: Giving Developers Their Time Back</li>
              <li>The Zero-Downtime Migration Nobody Believed Would Work</li>
              <li>Streaming Under Stress: Repairing a Lagging Data Pipeline</li>
              <li>The Next Infrastructure Battle: Cloud, Sovereignty, Local AI and Cost</li>
              <li>Exit Strategy: Could You Leave Your AI Vendor in 90 Days?</li>
              <li>The €0.01 Inference Decision: Where Should This Model Run?</li>
            </ul>
            <p>We want real engineering experiences involving scale, performance, infrastructure, developer experience, data architecture and cost.</p>
          </details>
          <details>
            <summary>SECURITY, RELIABILITY &amp; PRODUCTION ENGINEERING</summary>
            <ul>
              <li>Your AI Agent Has the Keys: How Autonomous Systems Get Compromised</li>
              <li>Prompt Injection in the Real World: The Attack Chain and the Fix</li>
              <li>The Day Everything Broke: Inside a Real Production Outage</li>
              <li>Our Monitoring Was Green. Customers Were Down.</li>
              <li>When Your AI Agent Fails at 2am</li>
              <li>Kill Switches, Fallbacks and Rollback for Autonomous Systems</li>
              <li>The Incident Timeline: Every Decision in the First 42 Minutes</li>
            </ul>
            <p>We welcome controlled demonstrations, technical postmortems, threat models, incident simulations and hard-won operational lessons.</p>
          </details>
          <details>
            <summary>ENGINEERING LEADERSHIP, SKILLS &amp; THE FUTURE</summary>
            <ul>
              <li>The Software Engineer of 2028: What Will We Still Need Humans For?</li>
              <li>Who Trains the Next Staff Engineer?</li>
              <li>Stay Technical, Gain Influence: The Career Moves That Actually Worked</li>
              <li>The Engineering Decisions That Cost Us Millions</li>
              <li>The Great Engineering Debate: What Should We Stop Doing?</li>
              <li>The Skills Engineers Will Need in 2028</li>
              <li>Building Engineering Teams That Can Learn Faster Than Technology Changes</li>
            </ul>
            <p>We want honest conversations about technical progression, engineering culture, skills, leadership and how the profession is evolving.</p>
          </details>
        </div>
      </section>
      <section className="speaker-guide-section" id="selection" aria-labelledby="selection-title">
        <h2 id="selection-title">What we’re looking for</h2>
        <p>We want to be open to new ideas while protecting the quality of learning for our attendees.</p>
        <p>We'd love to receive:</p>
        <div className="speaker-guide-values">
          <article>
            <h3>Real engineering stories</h3>
            <p>Tell us what you've built, changed, fixed, tested or learned.</p>
          </article>
          <article>
            <h3>Practical demonstrations</h3>
            <p>Show us how something works, where it breaks and how to improve it.</p>
          </article>
          <article>
            <h3>Evidence-led insights</h3>
            <p>Bring real examples, data, measurements or experiences that support your conclusions.</p>
          </article>
          <article>
            <h3>Honest lessons</h3>
            <p>Success stories are welcome, but so are mistakes, failed experiments and difficult decisions.</p>
          </article>
          <article>
            <h3>Fresh thinking</h3>
            <p>Challenge assumptions, introduce emerging approaches or explore what engineers may need to prepare for next.</p>
          </article>
          <article>
            <h3>Interactive learning</h3>
            <p>Give attendees opportunities to participate, question, test, debate or practise.</p>
          </article>
        </div>
      </section>
      <section className="speaker-guide-section" id="selection-guidance" aria-labelledby="selection-guidance-title">
        <h2 id="selection-guidance-title">What is less likely to be selected?</h2>
        <p>To ensure BUILD delivers meaningful technical learning, we're less likely to programme:</p>
        <ul>
          <li>Product sales presentations or promotional pitches.</li>
          <li>Company overviews without substantive technical learning.</li>
          <li>High-level AI predictions without evidence or practical application.</li>
          <li>Generic leadership presentations with little relevance to technical practitioners.</li>
          <li>Sessions that simply repeat widely available information.</li>
          <li>Workshops where attendees spend most of the time watching slides.</li>
          <li>Technical talks that promise a deep dive but offer only an introductory overview.</li>
        </ul>
        <p>This doesn't mean vendors, consultants or technology companies aren't welcome.</p>
        <p>Quite the opposite. Many of the most interesting engineering lessons come from people building products, platforms and services within technology businesses.</p>
        <p>We simply ask that the learning comes first.</p>
        <p>Where a session forms part of a commercial sponsorship arrangement, it will still need to meet BUILD's editorial and technical standards.</p>
      </section>
      <section className="speaker-guide-section" id="who" aria-labelledby="who-title">
        <h2 id="who-title">Who should consider speaking?</h2>
        <p>We're interested in hearing from:</p>
        <ul>
          <li>Software engineers, developers and technical architects</li>
          <li>AI and machine learning engineers</li>
          <li>Cloud, platform, DevOps and site reliability engineers</li>
          <li>Data engineers and infrastructure specialists</li>
          <li>Security engineers and researchers</li>
          <li>Staff and Principal Engineers</li>
          <li>CTOs and senior technical leaders</li>
          <li>Engineering managers and technical mentors</li>
          <li>Researchers, open-source contributors and independent practitioners</li>
          <li>People with unusual engineering experiences or perspectives worth sharing</li>
        </ul>
        <p>We particularly encourage interest from first-time speakers, emerging technical talent and people from backgrounds that are underrepresented on technology stages.</p>
        <p>Your experience matters more than your speaking history.</p>
      </section>
      <section className="speaker-guide-section" id="proposal" aria-labelledby="proposal-title">
        <h2 id="proposal-title">What makes a strong speaker proposal?</h2>
        <p>When preparing your idea, we'd encourage you to think about five things.</p>
        <ol className="speaker-guide-questions">
          <li>
            <h3>What's the challenge?</h3>
            <p>What technical problem, question or opportunity will your session explore?</p>
          </li>
          <li>
            <h3>Why does it matter now?</h3>
            <p>Why should engineers be thinking about this in 2027, and what might change by 2028?</p>
          </li>
          <li>
            <h3>What will attendees learn?</h3>
            <p>Think about three practical takeaways. What should someone understand, apply or do differently afterwards?</p>
          </li>
          <li>
            <h3>What makes your perspective interesting?</h3>
            <p>Perhaps you've built something unusual, encountered a difficult problem, challenged an established approach or discovered something unexpected.</p>
          </li>
          <li>
            <h3>What's the best way to share it?</h3>
            <p>Would it work best as a conference presentation, a hands-on Lab or an advanced Deep Dive?</p>
          </li>
        </ol>
        <p>You don't need to have a finished presentation before expressing interest.</p>
        <p>Our programme team may suggest a different title, format or angle to help your idea deliver the greatest value to attendees.</p>
      </section>
      <section className="speaker-guide-section" id="new-ideas" aria-labelledby="new-ideas-title">
        <h2 id="new-ideas-title">Have an idea we haven’t thought of?</h2>
        <p>Please tell us.</p>
        <p>Our suggested topics are just that - suggestions.</p>
        <p>Technology moves quickly, and some of the most exciting developments in 2027 may be things we're only beginning to explore today.</p>
        <p>If you have a brand-new idea, an emerging technical challenge, an unconventional format or a subject you think the engineering community needs to be talking about, we'd genuinely love to hear it.</p>
        <p>Even if it doesn't neatly fit one of our current programme themes, please get in touch.</p>
        <p>We're always open to feedback, new perspectives and conversations that help make BUILD better.</p>
        <p>Great programmes aren't built by one team. They're built by the community.</p>
      </section>
      <section className="speaker-guide-section" id="apply" aria-labelledby="apply-title">
        <h2 id="apply-title">Ready to BUILD the conversation?</h2>
        <p>We hope this guide has given you a feel for what makes BUILD Europe different, the learning experiences we're creating and the technical conversations we'd love to bring to our community.</p>
        <p>Whether you have a 30-minute technical story, a hands-on challenge or an entirely new idea, we'd love to hear from you.</p>
        <p>When you're ready, head over to our existing Speaker Application Form to share your proposal.</p>
        <p>Let's BUILD something worth learning from.</p>
        <Link className="button dark" href="/speak#speaker-application">Share your session idea <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </article>
  );
}
