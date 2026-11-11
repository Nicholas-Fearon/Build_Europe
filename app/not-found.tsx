import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Page not found — BUILD Europe' };

export default function NotFound() {
  return (
    <section className="section-pad">
      <p className="eyebrow">404</p>
      <h1 className="page-title">Page not found.</h1>
      <p className="home-section-intro mb-6">
        This page may have moved. Head back to the homepage to find event information.
      </p>
      <Link href="/" className="button dark">
        Back to home <span aria-hidden="true">↗</span>
      </Link>
    </section>
  );
}
