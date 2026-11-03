import type { Metadata } from "next";
import { headers } from "next/headers";
import { isAdmin } from "@/lib/admin";
import { getAdminCredentials } from "@/lib/admin-auth.mjs";
import { getSubmissions } from "@/lib/submissions";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";
export const metadata: Metadata = {
  title: "Admin — Build Europe",
  robots: { index: false, follow: false },
};
export const runtime = "nodejs";
export default async function AdminPage() {
  const host = (await headers()).get("host") || "";
  if (!/^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host))
    return (
      <section className="section-pad">
        <h1 className="page-title">Local admin only.</h1>
        <p>Open this area on the computer running Build Europe.</p>
      </section>
    );
  try {
    if (!(await isAdmin())) {
      await getAdminCredentials();
      return <AdminLogin />;
    }
    const records = await getSubmissions();
    return <AdminDashboard records={records} />;
  } catch {
    return (
      <section className="section-pad">
        <h1 className="page-title">Unable to load admin.</h1>
        <p>
          Check local file permissions and storage configuration, then try
          again. No submission data has been changed.
        </p>
        <a href="/admin" className="text-link">
          Try again ↻
        </a>
      </section>
    );
  }
}
