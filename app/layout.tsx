import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import './globals.css';
export const metadata: Metadata = { title: 'Build Europe — Women shaping what comes next', description: 'A meeting place for women in tech across Europe. Register your interest in attending, speaking, or sponsoring Build Europe.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><a href="#main" className="skip-link">Skip to content</a><SiteHeader/><main id="main">{children}</main><SiteFooter/></body></html>; }
