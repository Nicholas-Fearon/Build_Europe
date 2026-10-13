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
