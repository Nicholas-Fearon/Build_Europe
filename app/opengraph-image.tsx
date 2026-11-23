import { ImageResponse } from 'next/og';

export const alt = 'BUILD Europe — Engineering. Community. Possibility. Planned for Amsterdam in October 2027.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: 'flex', width: '100%', height: '100%', background: '#090d12', color: '#f4f2ed', padding: 64, position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 750 }}>
        <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, letterSpacing: 5 }}>BUILD EUROPE</div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 1.12 }}>
          <span>Engineering.</span>
          <span>Community.</span>
          <span style={{ color: '#b6a1ff' }}>Possibility.</span>
        </div>
        <div style={{ display: 'flex', fontSize: 23, color: '#c9c7d1' }}>Planned for Amsterdam · October 2027</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 330 }}>
        <svg width="320" height="310" viewBox="0 0 66 64">
          <defs>
            <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="70%" y2="100%">
              <stop stopColor="#335bff"/>
              <stop offset="35%" stopColor="#8f4aee"/>
              <stop offset="68%" stopColor="#ed4bb8"/>
              <stop offset="100%" stopColor="#ff9a65"/>
            </linearGradient>
          </defs>
          <path d="M2 2h37c15 0 24 7 24 16s-6 15-16 17L32 20H2z" fill="#f4f2ed"/>
          <path d="M2 30h31l29 17c0 10-10 15-24 15H2z" fill="url(#brand-gradient)"/>
        </svg>
      </div>
      <div style={{ position: 'absolute', display: 'flex', bottom: 0, left: 0, right: 0, height: 8, background: 'linear-gradient(90deg,#335bff,#8f4aee,#ed4bb8,#ff9a65)' }}/>
    </div>,
    size,
  );
}
