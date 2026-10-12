export default function BrandLogo({ id }: { id: string }) {
  return <span className="brand-logo" aria-label="Build Europe">
    <span className="brand-top"><svg viewBox="0 0 66 62" aria-hidden="true"><defs><linearGradient id={id} x1="0" y1="0" x2=".7" y2="1"><stop stopColor="#335bff"/><stop offset=".35" stopColor="#8f4aee"/><stop offset=".68" stopColor="#ed4bb8"/><stop offset="1" stopColor="#ff9a65"/></linearGradient></defs><path d="M2 2h37c15 0 24 7 24 16s-6 15-16 17L32 20H2z" fill="currentColor"/><path d="M2 30h31l29 17c0 10-10 15-24 15H2z" fill={`url(#${id})`}/></svg><span>UILD</span></span>
    <span className="brand-sub">EUROPE</span>
  </span>;
}
