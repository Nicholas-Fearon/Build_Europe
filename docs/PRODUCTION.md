# Production activation

The source code is prepared for hosted Supabase authentication and storage. Live activation still requires the server secret key, applied SQL, an admin account, and the final HTTPS app URL. A passing build alone does not verify those external services.

## 1. Configure the Supabase project

The development environment contains the supplied project URL and publishable key. Add `SUPABASE_SECRET_KEY` in `.env.local` using the project’s server-only secret key (or a legacy service-role key). It must never be exposed in browser code, committed, printed in logs, or pasted into a public deployment setting.

In the Supabase SQL editor, apply these files in order:

1. `supabase/schema.sql`
2. `supabase/production.sql`

The second file adds a server-only paginated dashboard RPC and a shared, atomic rate-limit store. These migrations do not delete existing event submissions. Verify that no previously created policies grant public access to event tables. The provided schema revokes anonymous and ordinary authenticated table privileges; the service role alone reads/writes records.

## 2. Provision the organiser

`ADMIN_EMAIL=nejfearon@gmail.com` identifies the assigned organiser. Run:

```sh
npm run admin:provision
```

After the hidden-input prompt, supply one line of JSON containing the `password` field. Use the chosen admin password. The script creates or updates only that email, sets server-managed admin metadata, confirms the email, and switches local preview settings to Supabase. It does not send an email or store the password. Existing auth users with other emails are left unchanged.

Do not store the password in command-line arguments, shell history, a tracked file, or an environment variable. For a future password change use the same provisioning process or Supabase’s administrator controls. If sign-in recovery email is needed, configure Supabase SMTP and a recovery flow before relying on it; the app does not yet expose self-service recovery.

## 3. Preserve existing enquiries

Once both SQL files are applied:

```sh
npm run migrate:submissions
```

The migration uploads local records using their existing IDs, preserves local files, and skips IDs already in the database. Run it before switching the deployed public forms over to Supabase, then verify the dashboard totals. Local development records are not uploaded automatically.

## 4. Hosting environment

Set these in the deployment platform’s environment settings:

```dotenv
APP_URL=https://your-final-domain.example
ADMIN_EMAIL=nejfearon@gmail.com
ADMIN_AUTH_MODE=supabase
SUBMISSION_STORAGE=supabase
SUPABASE_URL=https://nduiqcchxvzeltbbivnf.supabase.co
SUPABASE_PUBLISHABLE_KEY=<project publishable key>
SUPABASE_SECRET_KEY=<server-only secret key>
```

The `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` aliases are also accepted. Keep the secret server-only. Node.js must be 22+. `npm ci`, `npm run build`, and `npm start` are the standard commands for Node hosting; Next.js-aware providers can use their normal preset. `NODE_ENV=production` always requires Supabase authentication and rejects local submission storage. Set Supabase Auth’s Site URL to the final website URL and disable public signups unless needed for a later feature.

The hosting reverse proxy must overwrite incoming `X-Forwarded-For` values before forwarding requests. The app hashes the resulting IP for rate limiting (10 sign-in attempts per 15 minutes; 20 submissions per 10 minutes), storing no raw IP in the rate-limit table. Do not expose the Node server directly with untrusted forwarding headers. The Supabase Auth provider also has its own limits. Configure your platform’s HTTPS redirect and transport-security settings.

If you have multiple preview domains, set `APP_URL` per deployment. Origin checks accept only the configured app origin, not arbitrary forwarded hosts. Sign-in cookies are HTTP-only, use SameSite protection, and are Secure in production. Supabase session refresh runs only for admin pages and endpoints. The app uses `getUser()` again before privileged reads, rather than trusting cookie claims.

## 5. Validate before publishing

```sh
npm test
npm run build
npm run check:production
```

`check:production` uses production rules even when run locally. Supply the final HTTPS `APP_URL` and `SUBMISSION_STORAGE=supabase` when running it; the local development HTTP settings are deliberately rejected. The check verifies configuration, the dashboard database RPC, and a confirmed admin user with the required role. It does not inspect all hosting/network controls.

On the deployed preview, verify sign-in with the assigned email, rejection of unauthorised users, sign-out, each category and its counts, search, and a new public form submission that appears in the right admin category. Verify an unauthenticated request cannot access registration records. Confirm session refresh after token expiry against the live Supabase project.

## Remaining event decisions

Complete the draft organiser contact details, legal basis and retention periods, hosting region/transfer information, access arrangements, and Code of Conduct reporting channel. Confirm the event date and location before advertising ticket sales. Decide whether email acknowledgements, attendee accounts, payments, MFA, and password recovery are needed; these are not currently implemented. Review Supabase backups, retention, and platform monitoring for your deployment.

## Vercel sign-in troubleshooting

On Vercel, `APP_URL` can be omitted if system environment variables are enabled. Production uses `https://VERCEL_PROJECT_PRODUCTION_URL` (falling back to `VERCEL_URL`); previews use their own `VERCEL_URL`. An explicit `APP_URL` still takes precedence and must be the correct HTTPS site origin. Request Host/forwarded-host headers are never used to select a trusted production origin.

Environment variable changes need a redeployment to affect the running app. Editing an example env file in Git does not set Vercel runtime environment variables. The Supabase aliases `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `SUPABASE_ANON_KEY` and server-only `SUPABASE_SERVICE_ROLE_KEY` are accepted for projects using legacy key names.

Sign-in now includes a safe reference code if the backend is unavailable. Match that reference in Vercel Function Logs:

- `ADMIN_SITE_ORIGIN_CONFIGURATION`: missing/invalid `APP_URL` and no usable Vercel system URL.
- `ADMIN_SUPABASE_PUBLIC_CONFIGURATION`: missing/invalid project URL or public key configuration.
- `ADMIN_SUPABASE_SERVER_CONFIGURATION`: missing server-only Supabase secret/service-role key.
- `ADMIN_RATE_LIMIT`: the production rate-limit database RPC could not run; a safe PostgreSQL/PostgREST code is logged when available.
- `ADMIN_AUTHENTICATION`: an unexpected authentication exception.

Only controlled reference labels and error codes are logged. Passwords, cookies, email addresses, upstream exception messages, and environment values are never included in these diagnostic records.

## Updated registration forms and organiser notifications

Apply `supabase/registration-fields.sql` in the Supabase SQL editor after `schema.sql` and `production.sql`, before deploying the updated forms. It adds optional attendee country and technical interests, and speaker programme area, to existing submissions without rewriting old answers. The same details appear in the protected admin dashboard.

Apply `supabase/optional-speaker-topic.sql` next so speaker enquiries can be saved without a talk topic. An idea description is still required. Sponsorship objectives and speaker contribution type use the existing submission details column.

For sponsor and speaker notifications, set `RESEND_API_KEY` and `ENQUIRY_NOTIFICATION_FROM` (a Resend-verified sender) in Vercel's Production environment, then redeploy. `ENQUIRY_NOTIFICATION_TO` optionally overrides the recipient; otherwise it defaults to `ADMIN_EMAIL`. Attendance does not send notifications. The alert contains a link and reference only, and is sent after the submission is saved. Delivery failures are logged without causing the form to ask the submitter to submit again; enquiries remain accessible in the admin dashboard. These alerts do not send email to the submitter. See the [Resend Send Email API](https://resend.com/docs/api-reference/emails/send-email).
