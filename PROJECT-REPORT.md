# Sift It — Project Report

**Project:** Media Literacy Campaign (Sift It)  
**Report date:** October 28, 2026  
**Project type:** Interactive media-literacy education website  
**Primary audience:** Students, educators, and readers learning to assess online information

## 1. Executive summary

Sift It is an educational website that helps people slow down, investigate sources, compare coverage, and trace claims to their origins. It combines a SIFT learning guide, interactive media-forensics exercises, a local headline-language analyzer, optional web-supported AI research, and a student-powered Campus Claim Radar.

The project is designed as a learning aid, not an automated authority on whether a story is true. AI research is based on retrieved search results, cites only those results, and applies conservative evidence thresholds. Student submissions are private until a moderator reviews them; they are not automatically researched or published.

## 2. Problem and goals

Online claims can use urgency, emotional wording, misleading context, impersonation, altered media, or weak sourcing to encourage rapid sharing. Sift It addresses this by giving learners practical exercises and repeatable questions they can use to:

- Pause and notice emotional or persuasive language.
- Investigate who created a claim and what their credibility may be.
- Find independent coverage rather than relying on one post or publisher.
- Trace quotations, images, statistics, and other evidence to an original source.
- Recognize common forms of misinformation and media manipulation.

The application supports practice and inquiry. It does not claim that a language pattern alone establishes a claim's truth or falsity.

## 3. Users and primary journeys

### Learner or public visitor

1. Explore the SIFT guide or forensic simulations.
2. Enter a headline for local language analysis.
3. Optionally request current search-based research.
4. Review the retrieved sources, evidence assessment, and uncertainty.
5. Browse editor-reviewed Campus Claim Radar learning cards or submit a claim for review.

### Moderator

1. Sign in through Supabase Authentication.
2. Pass the server-side email allowlist check.
3. Review private pending submissions.
4. Optionally research a claim and inspect the results.
5. Edit a student-facing learning card, then publish, reject, merge, or delete the submission.

## 4. Features and scope

### Home page

The home page introduces the campaign and directs visitors to headline analysis, the case lab, and the learning guide. It includes an interactive headline scanner and a bias-comparison component.

### SIFT learning guide (`/learn`)

The guide teaches the four SIFT moves:

- **S — Stop:** pause and notice a strong emotional reaction before sharing.
- **I — Investigate the source:** identify who is behind the information.
- **F — Find better coverage:** look for independent reporting and context.
- **T — Trace to the original:** follow claims, media, and quotations back to their source.

Interactive activities cover SIFT practice, lateral reading, disinformation tactics, decision-making about claims, and inspection of synthetic media. The guide also links to external fact-checking organizations.

### Headline analysis (`/checker`)

The checker combines local wording analysis with optional live research:

- The local analyzer flags wording patterns such as emotional language, unsupported attribution, and other manipulation cues, and offers a more neutral framing.
- The research route searches Tavily using two queries derived from the headline.
- Search results are normalized, deduplicated, and capped before being sent to a configured model provider.
- Model fallback order is **OpenAI → Groq → Gemini**. Any one provider can be used on its own.
- The model receives the headline and bounded search evidence; it does not run an independent search.
- The application validates the model's structured response, limits cited sources to retrieved URLs, and applies evidence sufficiency rules before presenting a conclusion.
- Research progress, sources, result, and errors are delivered as a server-sent event stream.

The headline input is limited to 500 characters. Tavily and model requests have bounded timeouts, and the route declares a 60-second maximum function duration for deployment platforms that support it.

### News Detective (`/quiz`)

The case lab presents eight simulated forensic cases, including examples involving impersonation, health rumors, out-of-context media, deceptive graphs, synthetic media, satire, and selective quotation. Learners inspect clues and simulated forensic tools, choose a verdict, and receive a case-by-case result with a score, experience points, and an investigator rank. Progress is held in the page's client-side state during the session.

### Campus Claim Radar (`/radar`)

The public board displays only editor-reviewed, published learning cards. Visitors can filter the board by topic and follow source links. The board does not publicly expose pending or rejected submissions.

### Anonymous claim submission (`/radar/submit`)

Visitors may submit a claim, select a topic, and optionally provide an HTTPS source URL. The server validates the submission and stores it in the pending state. The submission flow does not collect a student account or identity.

### Moderator workspace (`/admin`)

The moderator workspace is protected by Supabase Authentication and a server-side `MODERATOR_EMAILS` allowlist. Authorized moderators can work with the private queue, research claims, prepare learning cards, and publish, reject, merge, or delete records. AI-generated research remains subject to human review.

## 5. Technology stack

| Area | Technologies |
|---|---|
| Application framework | Next.js 16 App Router |
| UI | React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 and project CSS design tokens |
| Icons and content rendering | Lucide React, `react-markdown`, `remark-gfm` |
| Data and authentication | Supabase PostgreSQL, Supabase Auth, `@supabase/ssr`, `@supabase/supabase-js` |
| Search and AI | Tavily, OpenAI, Groq, Gemini |
| Abuse protection | Cloudflare Turnstile and a Supabase-backed HMAC burst limiter |
| Hosting target | Vercel |
| Quality tools | ESLint 9 and Node.js built-in test runner |

The visual system uses a restrained editorial layout, design tokens in `app/tokens.css`, and Epilogue and Geist Mono fonts loaded using `next/font/google`.

## 6. Architecture

The application uses the Next.js App Router. Page and layout components live under `app/`; interactive experiences are implemented as React components, and server-side API endpoints are implemented as route handlers.

### Request and data flow

```text
Browser
  ├─ Next.js pages and interactive React components
  ├─ /api/analyze ── Turnstile + burst limit ── Tavily search
  │                                      └──── OpenAI → Groq → Gemini
  ├─ /api/submissions ── Turnstile + burst limit ── Supabase
  ├─ /api/radar ── publish-only query ── Supabase (RLS)
  └─ /api/admin/* ── Supabase session + moderator allowlist ── Supabase
```

### Main API routes

| Route | Method | Purpose |
|---|---|---|
| `/api/analyze` | `POST` | Validates and researches a headline; streams progress, sources, and the result. |
| `/api/submissions` | `POST` | Validates and creates a private pending student claim submission. |
| `/api/radar` | `GET` | Returns published learning cards, optionally filtered by topic. |
| `/api/admin/claims` | `GET` | Returns the moderator's pending review queue. |
| `/api/admin/claims/[id]` | `PATCH`, `DELETE` | Allows authorized moderators to update, publish, reject, merge, or delete a claim. |

## 7. Data model and moderation lifecycle

The Supabase migration creates two principal tables:

### `claim_submissions`

Stores the claim text, optional source URL, topic, workflow status, moderation fields, evidence summary, reviewed sources, and timestamps. Supported statuses are:

```text
pending → published
pending → rejected
pending → merged
```

A published row must include a card title, evidence summary, bias notes, SIFT prompt, and review timestamp. Database checks constrain claim length, topic values, status values, source JSON shape, and merge metadata.

### `api_rate_limits`

Stores a keyed request identifier, time bucket, count, and update timestamp for short-window request throttling. The identifier is an HMAC of the client address and action rather than the raw address. Inactive rows are cleaned up by the database function after 24 hours.

### Access boundaries

- Row-level security is enabled for both tables.
- Public and authenticated roles can select only published claim cards.
- Pending submissions and rate-limit rows are not readable by those roles.
- Submission and moderation writes use the server-side Supabase service-role client only after validation or moderator authorization.

## 8. Security, privacy, and responsible use

- API requests validate JSON shape and size, check same-origin requirements, and validate user input.
- Turnstile is verified server-side for headline analysis and claim submission.
- Production API routes fail closed when required bot-protection or burst-limit configuration is missing.
- Analysis is limited to 30 requests per minute per address; submissions are limited to 30 per 15 minutes per address. These are burst limits, not daily or monthly quotas.
- Moderator authorization checks the signed-in Supabase user and an email allowlist on the server.
- Privileged keys (`SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET_KEY`, provider keys, and `RATE_LIMIT_SECRET`) must remain server-side and must not use a `NEXT_PUBLIC_` prefix.
- AI output is educational support, not a definitive fact-check. “Unverified” does not mean false.
- Headlines and search snippets are sent to external search/model providers during research. Users should not submit sensitive or private material.
- Student reports remain private until reviewed. Moderators should avoid collecting personal information and remove unsuitable reports.

## 9. Configuration and deployment

The application is intended to deploy to Vercel as a Next.js project. Required or feature-specific configuration is documented in [`.env.example`](./.env.example).

### Environment variables

| Variable(s) | Use |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Browser-safe Supabase project configuration. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only database access for protected operations. |
| `MODERATOR_EMAILS` | Comma-separated allowlist of moderator email addresses. |
| `TAVILY_API_KEY` | Enables live headline search. |
| `OPENAI_API_KEY`, `GROQ_API_KEY`, `GEMINI_API_KEY` | Configure one or more AI model providers. |
| `OPENAI_MODEL`, `GROQ_MODEL`, `GEMINI_MODEL` | Optional model-name overrides. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | Browser widget and server verification for Cloudflare Turnstile. |
| `RATE_LIMIT_SECRET` | Long random server-only secret for keyed burst-limit identifiers. |

For production, configure Supabase and run the migration at [`supabase/migrations/20261025000000_campus_claim_radar.sql`](./supabase/migrations/20261025000000_campus_claim_radar.sql). Create a moderator account, disable public sign-ups after moderator accounts are created, and add the deployed domain to Supabase Auth redirect settings and Turnstile's allowed hostnames. Add environment variables in the Vercel project settings and redeploy after changes.

### Local development and checks

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

## 10. Testing and quality

The `npm test` script runs the Node.js test runner against the evidence-processing and API test files. The tests cover evidence-source normalization and independence checks, analysis request handling and provider fallback, public Radar reads, anonymous submissions, and moderator API authorization behavior. ESLint is configured through `npm run lint`; `npm run build` runs the production Next.js build and TypeScript checks.

## 11. Current limitations

- The AI workflow depends on external search and model provider availability, configuration, and billing.
- A model fallback only works if its API key is configured in the environment where the request is running.
- The automated analysis can return an error if all configured providers fail or return unusable output.
- Only retrieved search results are available to the model; incomplete search results can lead to an “Unverified” result.
- Quiz progress is in-memory client state and is not persisted between visits.
- Moderation depends on a configured Supabase project, migration, moderator account, and email allowlist.
- Rate limiting depends on a trusted deployment proxy supplying a usable client IP header.
- The repository includes application-level tests, but these do not replace production monitoring, accessibility review, or classroom evaluation.

## 12. Recommended next steps

These are recommendations, not claims about existing functionality:

1. Run a classroom pilot and gather feedback from students and educators.
2. Evaluate whether the exercises improve source checking, lateral reading, and evidence assessment.
3. Review accessibility across keyboard use, screen readers, contrast, and reduced-motion preferences.
4. Add deployment monitoring for route errors, provider failures, latency, and third-party spend without logging sensitive user submissions.
5. Establish a moderation retention policy for pending and published reports.
6. Review provider models, pricing, and rate limits periodically; test fallback behavior after changing model configuration.
7. Keep deployment environment variables, Supabase redirect URLs, and Turnstile hostnames aligned across Production and Preview deployments.

## 13. Conclusion

Sift It combines an evidence-led learning experience with practical simulations and a review-controlled community contribution workflow. Its strongest architectural principle is that automated analysis supports, but does not replace, independent source checking and human editorial review. The project is structured for deployment on Vercel with Supabase-backed data and moderation, while keeping external AI and search credentials on the server.
