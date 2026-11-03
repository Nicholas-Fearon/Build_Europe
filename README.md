# Build Europe

Local MVP for a women in tech event. Next.js App Router, TypeScript, React and Tailwind CSS. No external fonts, image requests, analytics, or email services.

## Run locally

Requires Node.js 20.9+ and npm.

```sh
npm install
npm run dev
```

Open http://localhost:3000. To verify: `npm test` and `npm run build`.

This is a multipage Next.js application with separate routes: `/` (Home), `/about`, `/attend`, `/sponsor`, `/speak`, and `/privacy`. Pages are rendered by Next.js Server Components, with ordinary links for full-page navigation. Only the enquiry form uses client-side state. Each route can be opened directly or refreshed. Date and venue are intentionally unconfirmed. Attendance submissions join an interest list, not a paid ticket booking. No emails are sent.

## Local submissions

The default storage is `data/submissions.jsonl`: one JSON record per line, persisted on the server's local disk and excluded from Git. All three forms save through `POST /api/submissions` with server validation. No credentials or database setup are needed. View the file locally to review enquiries; keep it private. Deleting a line deletes that local record. Browser refresh and server restart do not remove records.

This file storage is suitable for one local MVP process, not a multi-instance deployment. There is no public admin page or export endpoint.

## Connect Supabase / PostgreSQL later

1. Create a local Supabase project using the Supabase CLI, or use a hosted Supabase project when ready.
2. Apply `supabase/schema.sql` in its SQL editor or via psql. It creates the PostgreSQL table with row-level security and no public read/write access. The last grant statements target Supabase roles; on standalone PostgreSQL, adapt those grants to your own application role. The application adapter expects Supabase's REST API.
3. Copy `.env.example` to `.env.local`, set `SUBMISSION_STORAGE=supabase`, `SUPABASE_URL`, and the server-only `SUPABASE_SECRET_KEY` (a Supabase secret API key).
4. Restart Next.js. New submissions then go to the table. Existing local records are not automatically migrated. The app will report a save error if database persistence fails; it never reports success without saving.
5. Update the privacy wording in `app/privacy/page.tsx` if you choose hosted storage. It currently describes local-only operation.

Local Supabase also uses PostgreSQL. The schema is prepared here; a database instance is not installed or started by this MVP.

## Content and next steps

Edit page content in the corresponding `app/*/page.tsx` files and `components/EnquiryPage.tsx`, styling in `app/globals.css`, and form fields in `components/InterestForm.tsx`. Replace the date and venue placeholders once confirmed. Before public launch, add an approved privacy policy with organiser contact and retention details, persistent hosted storage, abuse protection, and any email or ticketing integrations you need.

Framework setup follows the official [Next.js installation guide](https://nextjs.org/docs/app/getting-started/installation) and [Tailwind Next.js guide](https://tailwindcss.com/docs/installation/framework-guides/nextjs).

## Footer and draft information pages

The shared footer links to all event pages plus `/privacy`, `/terms`, `/cookies`, `/accessibility`, `/code-of-conduct`, and `/contact`. These pages have generic draft copy. Complete the marked organiser identity, contact channels, legal basis, retention periods, accessibility arrangements, and incident reporting process before public launch. No fictional email addresses or social profiles are linked. There is no cookie banner because no optional tracking integration has been added; reassess if integrations change.

## Local admin area

Visit `http://localhost:3000/admin`. On first visit, a random local password and session secret are generated in `data/admin-access.json` (permissions 600, ignored by Git). Open this file locally and use its `password` value to sign in. Alternatively set `ADMIN_PASSWORD` (at least 12 characters) in `.env.local` and restart the server. Never share or commit the generated file.

The admin shows attendance interest by default, plus filters for sponsorship and speaking, totals, name/email/organisation/role search, pagination, and full submission details including contact consent. Refresh to load new submissions. It uses existing records, without creating attendee accounts or confirming tickets. A missing submissions file produces an empty state; storage failures are reported without claiming an empty list.

Access is restricted to localhost/loopback hostnames and requires a signed, HTTP-only, SameSite Strict cookie that expires after eight hours. Sign out clears the cookie. Ten failed sign-ins block further attempts for fifteen minutes in the current process. This is a single-organiser local MVP; before a hosted admin launch, replace local access with proper user authentication and role-based authorisation. Existing logged-out session tokens expire naturally; there is no server session revocation list.

When using Supabase, apply the new `grant select on public.event_submissions to service_role;` statement to existing databases too. The admin reader checks authorisation before reading either local records or the database. No public listing/export endpoint exists. The local admin introduces an essential session cookie; public attendee forms remain cookie-free.
