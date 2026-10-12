import type { Metadata } from 'next';
import EnquiryPage from '@/components/EnquiryPage';
export const metadata: Metadata = { title: 'Sponsor — Build Europe' };
export default function SponsorPage() { return <EnquiryPage type="sponsor"/>; }
