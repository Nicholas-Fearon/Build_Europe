# Build Europe

A multipage Next.js application for a women in tech event, using React, TypeScript, Tailwind CSS, and Supabase/PostgreSQL. Public pages cover the event, attendance interest, sponsorship, speaking, contact, and draft information policies.

## Development

Use Node.js 22 or later and npm:

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Checks: `npm test` and `npm run build`.

`.env.local` is private and ignored by Git. Use `.env.example` as a reference. The existing local preview can use `ADMIN_AUTH_MODE=local` and `SUBMISSION_STORAGE=local`. To configure the development administrator, run `npm run admin:local` and supply one line of JSON with a `password` field on its hidden stdin. The script stores a salted scrypt hash and a random signing secret, never a plaintext password. Set `ADMIN_EMAIL` to the organiser’s email.

Legacy `data/admin-access.json` is no longer used for authentication. Existing local enquiry records in `data/submissions.jsonl` are preserved. Neither file is tracked by Git.

## Admin dashboard

Open `/admin` and sign in with your authorised email and password. The default overview shows all interest submissions, with separate Attending, Sponsorship, and Speakers views. Each category has a total, searchable list, pagination, and detailed records. Counts are submissions: one email address may appear in more than one category. Attendance remains an expression of interest, not a confirmed ticket.

Production authentication uses Supabase Auth, cookie-based server sessions, session refresh through Next.js Proxy, and server-verified users. Access requires all of:

- A valid Supabase session verified with `getUser()`.
- A confirmed email matching `ADMIN_EMAIL`.
- Server-managed `app_metadata.build_europe_admin = true`.

User-editable metadata cannot grant admin access. There is no admin signup endpoint. Database reads and the paginated dashboard RPC use a server-only Supabase secret key after authorisation. Anonymous and ordinary authenticated clients have no direct table or RPC access. Private pages and admin responses use `no-store`.

## Production setup

See [docs/PRODUCTION.md](docs/PRODUCTION.md) for the migration and deployment sequence. Production requires Supabase storage and authentication; development-only credentials and local file storage cannot silently activate there. Never put the admin password or server secret in `NEXT_PUBLIC_*` variables or source control.

Useful commands:

- `npm run admin:provision`: create or update the assigned admin in Supabase; password arrives over hidden stdin and is not written to disk.
- `npm run migrate:submissions`: upload existing local submissions without deleting them or duplicating record IDs.
- `npm run check:production`: verify HTTPS configuration, the database RPC, and the provisioned admin using deployment settings.
- `npm run build` then `npm start`: production server. The host controls the port; `next start` supports standard Node hosting.

## Scope

The site does not sell tickets, confirm attendance, send email campaigns, or create attendee accounts. Policies contain generic draft wording and marked organiser/retention/accessibility details that need completion before public launch. No tracking integrations or public cookie preference banner have been introduced. Authentication cookies are necessary for organiser sign-in.

Official implementation references: [Supabase server-side auth](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [Supabase admin user provisioning](https://supabase.com/docs/reference/javascript/auth-admin-createuser), and [Next.js Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy).
