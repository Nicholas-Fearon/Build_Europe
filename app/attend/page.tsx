import type { Metadata } from 'next';
import EnquiryPage from '@/components/EnquiryPage';
export const metadata: Metadata = { title: 'Register to attend — Build Europe' };
export default function AttendPage() { return <EnquiryPage type="attend"/>; }
