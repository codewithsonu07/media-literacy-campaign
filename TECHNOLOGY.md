# Technology Stack

This document summarizes the technologies used by the Sift It media-literacy campaign.

## Application

- **Next.js 16** — React framework using the App Router for pages, layouts, route handlers, and server-side rendering.
- **React 19** — UI components and interactive learning tools.
- **TypeScript 5** — typed application code.
- **Node.js** — runtime for local development, tests, and server-side API routes.

## Styling and UI

- **Tailwind CSS 4** — utility-based styling, integrated through `@tailwindcss/turbopack`.
- **CSS** — global foundations, design tokens, and page/component styles in the `app` directory.
- **Lucide React** — interface icons.
- **Epilogue and Geist Mono** — fonts loaded through `next/font/google`.

## Data, authentication, and security

- **Supabase** — PostgreSQL database and moderator authentication, accessed through `@supabase/supabase-js` and `@supabase/ssr`.
- **Row-level security (RLS)** — controls access to Campus Claim Radar submissions and published cards.
- **Cloudflare Turnstile** — bot protection for analysis and anonymous submissions.
- **HMAC-based burst limiting** — short-window request limits use a Supabase database function without storing raw client addresses.

## Search and AI research

- **Tavily** — retrieves web search results for headline research.
- **OpenAI, Groq, and Gemini APIs** — assess the same bounded search evidence in this fallback order: OpenAI, then Groq, then Gemini. Configure at least one model provider.
- **Server-side environment variables** — API credentials are read by server routes and should not be exposed with a `NEXT_PUBLIC_` prefix.

## Supporting libraries

- **react-markdown** and **remark-gfm** — render formatted Markdown content.
- **tldts** — identify registrable domains when comparing source independence.

## Hosting and development tools

- **Vercel** — deployment platform for the Next.js application.
- **npm** — dependency management and project scripts.
- **ESLint 9** with **eslint-config-next** — linting.
- **Node.js built-in test runner** — API and evidence-processing tests.

## Common commands

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

See [README.md](./README.md) and [`.env.example`](./.env.example) for setup, service configuration, and deployment requirements.
