import BrandLogo from './BrandLogo';
const groups = [
  {title:'Explore',links:[['Home','/'],['About the event','/about'],['Contact','/contact']]},
  {title:'Get involved',links:[['Register to attend','/attend'],['Become a sponsor','/sponsor'],['Apply to speak','/speak']]},
  {title:'Information',links:[['Privacy Policy','/privacy'],['Terms of Use','/terms'],['Cookie Policy','/cookies'],['Accessibility','/accessibility'],['Code of Conduct','/code-of-conduct']]},
];
export default function SiteFooter() { return <footer className="footer site-footer"><div className="footer-main"><div className="footer-brand"><a className="wordmark" href="/" aria-label="Build Europe home"><BrandLogo id="footer-brand"/></a><p>A future with more of us in it.</p><p className="footer-description">Women in tech.<br/>Ideas and community across Europe.</p></div>{groups.map(group=><nav key={group.title} aria-label={`${group.title} footer links`}><h2>{group.title}</h2>{group.links.map(([label,href])=><a key={href} href={href}>{label}</a>)}</nav>)}</div><div className="footer-bottom"><span>© {new Date().getFullYear()} Build Europe. All rights reserved.</span><span>People building a brighter tomorrow.</span><a href="#main">Back to top ↑</a></div></footer>; }
