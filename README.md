# Media-Literacy-Campaign

Sift It is a student media-literacy campaign with an interactive SIFT guide, case studies, a headline research tool, and the Campus Claim Radar.

See [TECHNOLOGY.md](./TECHNOLOGY.md) for the application technology stack.
See [PROJECT-REPORT.md](./PROJECT-REPORT.md) for the detailed project report.

## Campus Claim Radar

Students can anonymously suggest a claim or headline they encountered. Reports are private until a moderator reviews them. Only reviewed learning cards appear at `/radar`; a submission never triggers AI research or becomes public automatically.

The moderator can optionally research a selected report with the existing search/AI flow, review the source links and explanation, edit the student-facing learning card, then publish or reject/delete the report. AI output is an educational aid, not a definitive fact-check.

### Supabase setup

1. Create a Supabase project.
2. In the SQL Editor, run [`supabase/migrations/20261025000000_campus_claim_radar.sql`](./supabase/migrations/20261025000000_campus_claim_radar.sql).
3. Create a moderator user in Supabase Authentication. Disable public sign-ups after creating the moderator account(s).
4. Set the environment variables listed in [`.env.example`](./.env.example). `MODERATOR_EMAILS` is a comma-separated allowlist; API routes verify the signed-in user and allowlisted email server-side.
5. Keep `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`, and `RATE_LIMIT_SECRET` server-only. Never use a `NEXT_PUBLIC_` prefix for these secrets.
6. Add the application URL to Supabase Auth's allowed redirect URLs and Cloudflare Turnstile's allowed hostnames.

The public board queries Supabase with the anon key and is protected by row-level security: it can read only `published` rows. Pending submissions and rate-limit records are not available to public or authenticated end users. Moderation routes use the service-role key only after server-side moderator authorization.

No student account or identity is collected with a submission. Do not ask students to include names, private messages, or confidential material. Pending reports remain private until reviewed; moderators should routinely reject or permanently delete reports that are unsuitable or no longer needed. Published learning cards remain available until a moderator deletes them.

## AI Headline Research

The headline checker keeps its local wording analysis and can also search current web coverage through Tavily. Tavily retrieves search results; OpenAI is tried first to assess those results, followed by Groq and then Gemini if earlier providers are unavailable. Any configured model provider can run on its own. Models receive the same bounded search evidence, and none performs a separate web search in this flow.

Set up provider keys in `.env.local` for local development. Add `OPENAI_API_KEY` to enable OpenAI (using `gpt-4o-mini` by default); optionally set `OPENAI_MODEL` to use another compatible model. Keep the key server-side and do not prefix it with `NEXT_PUBLIC_`. On Vercel, add the key to the target deployment environment (Production and, if needed, Preview), then redeploy. The analysis stream reports which configured providers it will try. Each search/model request has a bounded timeout so the fallback chain can continue within the Vercel function's 60-second maximum duration. The AI API remains available to normal visitors without a daily or monthly application quota. It uses Cloudflare Turnstile and a short-window shared burst limiter to deter automated abuse; this is not a daily usage allowance. Provider pricing, provider-imposed rate limits, and availability still depend on the Tavily/Gemini/Groq/OpenAI plans you select. Configure billing alerts at the providers.

AI analysis sends the headline and search queries to Tavily and sends the headline plus retrieved snippets to the selected model provider. Avoid submitting sensitive or private content. The research output is an educational aid, not a definitive fact-check; it reports evidence strength and only links sources returned by Tavily. “Unverified” does not mean false.

## Environment variables

Copy `.env.example` to `.env.local` and replace the placeholders:

- `TAVILY_API_KEY`: server-side search provider key.
- `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENAI_API_KEY`: server-side AI provider keys; at least one model key is required. Optional model overrides are `GEMINI_MODEL`, `GROQ_MODEL`, and `OPENAI_MODEL`.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: public Supabase project configuration.
- `SUPABASE_SERVICE_ROLE_KEY`: private server-side key for protected submission and moderation operations.
- `MODERATOR_EMAILS`: comma-separated emails allowed to moderate.
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`: browser challenge key and private verification key.
- `RATE_LIMIT_SECRET`: long random server-side secret used to hash client addresses before storing short-lived burst counters.

For local development, Turnstile and the shared rate limiter may be absent; production routes fail closed if abuse protection is not configured. To exercise all production protections locally, configure Supabase and Turnstile as well. Deploy behind a trusted proxy that supplies `x-real-ip` (or a trusted `x-forwarded-for`) so the app can apply privacy-preserving shared burst throttles. The database stores an HMAC of the address, not the raw address, and removes inactive counters after 24 hours.

The analysis endpoint accepts at most 500 characters and applies a 30-request-per-minute per-address burst threshold. Anonymous submissions use a 30-per-15-minute per-address burst threshold to reduce spam while accounting for students who share a campus network. Neither is a daily/monthly AI feature quota; limits should be tuned for the deployment's trusted proxy and expected shared campus traffic.

## Development

```bash
npm install
npm run dev
```

Run checks:

```bash
npm test
npm run lint
npm run build
```
