import type { ReactNode } from 'react';
export type PolicySection = { id: string; title: string; content: ReactNode };
export default function PolicyPage({ title, intro, sections }: { title: string; intro: string; sections: PolicySection[] }) {
  return <article className="policy-page section-pad">
    <header className="policy-heading"><p className="eyebrow">BUILD EUROPE / INFORMATION</p><h1 className="page-title">{title}</h1><p className="policy-intro">{intro}</p><p className="policy-date">Draft copy · Updated 13 October 2026</p></header>
    <div className="policy-layout"><aside className="policy-toc"><nav aria-label="On this page"><p className="eyebrow">ON THIS PAGE</p>{sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}</nav><a href="/contact" className="text-link">Have a question? <span>↗</span></a></aside>
    <div className="policy-content"><div className="policy-draft">These pages contain generic draft copy. Organiser details, contact channels, and final arrangements will be confirmed before the event opens for bookings.</div>{sections.map((section, index) => <section id={section.id} key={section.id}><p className="eyebrow">{String(index + 1).padStart(2, '0')}</p><h2>{section.title}</h2>{section.content}</section>)}<p className="policy-help">For related information, see our <a href="/privacy">Privacy Policy</a>, <a href="/terms">Terms of Use</a>, and <a href="/contact">Contact page</a>.</p></div></div>
  </article>;
}
