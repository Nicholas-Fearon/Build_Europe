'use client';

import { useEffect, useRef } from 'react';
import { programme } from '@/lib/programme.mjs';

const topics: Record<string, string> = {
  ai: 'Explore how teams build AI applications and agents, evaluate their behaviour and put them to work in real products.',
  software: 'Explore architecture decisions, how teams evolve existing systems and what they learn from shipping software.',
  data: 'Explore how data teams design pipelines and platforms that make reliable data available to the people who need it.',
  cloud: 'Explore cloud infrastructure, developer platforms and how site reliability teams keep services running.',
  secure: 'Explore how teams protect applications and cloud systems, assess risk and build security into everyday engineering.',
  career: 'Explore ways to grow as a technical practitioner, take on leadership and find the right next step.',
};

export default function ProgrammePillars() {
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function openPillar(hash: string) {
      const target = document.getElementById(hash.slice(1));
      if (target instanceof HTMLDetailsElement && grid.current?.contains(target)) {
        target.open = true;
      }
    }

    function openLinkedPillar() {
      openPillar(window.location.hash);
    }

    function openFromBanner(event: MouseEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element && event.target.closest<HTMLAnchorElement>('a');
      if (link) openPillar(link.hash);
    }

    const banner = document.querySelector<HTMLElement>('.pillar-banner');
    openLinkedPillar();
    banner?.addEventListener('click', openFromBanner);
    window.addEventListener('hashchange', openLinkedPillar);
    return () => {
      banner?.removeEventListener('click', openFromBanner);
      window.removeEventListener('hashchange', openLinkedPillar);
    };
  }, []);

  return (
    <div ref={grid} className="home-programme-grid">
      {programme.map(({ id, title, description }) => (
        <details id={`pillar-${id}`} key={id} tabIndex={-1}>
          <summary>
            <span className="programme-pillar-title">{title}</span>
            <span className="programme-pillar-description">{description}</span>
            <span className="programme-pillar-indicator" aria-hidden="true" />
          </summary>
          <p>{topics[id]}</p>
        </details>
      ))}
    </div>
  );
}
