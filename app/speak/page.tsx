import type { Metadata } from 'next';
import EnquiryPage from '@/components/EnquiryPage';
export const metadata: Metadata = { title: 'Speak — Build Europe' };
export default function SpeakPage() { return <EnquiryPage type="speak"/>; }
