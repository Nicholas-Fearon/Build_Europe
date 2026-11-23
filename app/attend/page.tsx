import { publicPageMetadata } from '@/lib/seo';
import EnquiryPage from '@/components/EnquiryPage';
export const metadata = publicPageMetadata(
  "/attend",
  "Register Your Interest | BUILD Europe 2027 Amsterdam",
  "Join the BUILD Europe interest list for tickets, speakers, BUILD Labs and programme updates. Planned for Amsterdam in October 2027.",
);
export default function AttendPage() { return <EnquiryPage type="attend"/>; }
