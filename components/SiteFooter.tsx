import BrandLogo from './BrandLogo';
export default function SiteFooter() { return <footer className="footer"><a className="wordmark" href="/"><BrandLogo id="footer-brand"/></a><p>A future with more of us in it.</p><span>© {new Date().getFullYear()} Build Europe</span><a href="/privacy">Privacy ↗</a></footer>; }
