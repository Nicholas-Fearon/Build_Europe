import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { siteDescription, siteUrl } from '@/lib/seo';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'BUILD Europe 2027 | Engineering Conference in Amsterdam',
  description: siteDescription,
};

const organisation = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organiser`,
      name: 'Pioneers of Tomorrow Ltd',
      legalName: 'Pioneers of Tomorrow Ltd',
      email: 'info@buildeurope.io',
      url: siteUrl,
      description: 'Operator of BUILD Europe, a European engineering conference championing women in technology.',
      logo: { '@type': 'ImageObject', url: `${siteUrl}/build-europe-logo.svg`, width: 256, height: 256 },
      identifier: { '@type': 'PropertyValue', propertyID: 'Companies House', value: '16661745' },
      brand: { '@id': `${siteUrl}/#brand` },
    },
    { '@type': 'Brand', '@id': `${siteUrl}/#brand`, name: 'BUILD Europe', url: siteUrl, logo: `${siteUrl}/build-europe-logo.svg` },
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: 'BUILD Europe', url: siteUrl, inLanguage: 'en-GB', publisher: { '@id': `${siteUrl}/#organiser` } },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-scroll-behavior="smooth">
    <body>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation).replace(/</g, '\\u003c') }}/>
      <a href="#main" className="skip-link">Skip to content</a>
      <SiteHeader/>
      <main id="main">{children}</main>
      <SiteFooter/>
    </body>
  </html>;
}
