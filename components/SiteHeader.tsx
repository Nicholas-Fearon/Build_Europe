import BrandLogo from './BrandLogo';
const links = [{href:'/about',label:'About'},{href:'/sponsor',label:'Sponsor'},{href:'/speak',label:'Speak'}];
export default function SiteHeader() {
  return <header className="site-header">
    <a href="/" className="wordmark" aria-label="Build Europe home"><BrandLogo id="header-brand"/></a>
    <nav className="desktop-nav" aria-label="Main navigation">{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}<a href="/attend" className="nav-cta">Register interest <span>↗</span></a></nav>
    <details className="mobile-nav"><summary>Menu <span>+</span></summary><nav aria-label="Mobile navigation">{links.map(link => <a key={link.href} href={link.href}>{link.label}</a>)}<a href="/attend">Register interest ↗</a></nav></details>
  </header>;
}
