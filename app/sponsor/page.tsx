import { publicPageMetadata } from '@/lib/seo';
import EnquiryPage from '@/components/EnquiryPage';
export const metadata = publicPageMetadata(
  "/sponsor",
  "Sponsor BUILD Europe 2027 | Engineering Partnerships",
  "Explore BUILD Europe partnerships, technical workshops, product showcases and community opportunities. Connect with Europe\u2019s engineering community.",
);
export default function SponsorPage() { return <EnquiryPage type="sponsor"/>; }
