import { publicPageMetadata } from '@/lib/seo';
import EnquiryPage from '@/components/EnquiryPage';
export const metadata = publicPageMetadata(
  "/speak",
  "Speak at BUILD Europe 2027 | Call for Speakers",
  "Share an engineering case study, live demonstration or hands-on workshop at BUILD Europe. Read the speaker guide and submit your session idea.",
);
export default function SpeakPage() { return <EnquiryPage type="speak"/>; }
