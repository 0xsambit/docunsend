## DosSend (all premium features, free)

Build a full DosSend-equivalent with every premium control unlocked: secure file/link drops, expiries, passcodes, device locks, scheduling, analytics, custom domains, and instant revokes. Auth-gated, Prisma-backed, Vercel-ready.

### Stack

-    Next.js 16 (App Router) + React 19
-    Tailwind v4 (inline theme tokens) + custom dual-theme styling
-    Prisma + PostgreSQL (Vercel Postgres ready)
-    Auth.js (NextAuth v5 beta) for OAuth/email auth

### Core features

-    Unlimited transfers: files or smart links, no throttling
-    Premium security: passcodes, view-once, device fingerprint allow/deny, geo/IP insights, instant revoke
-    Controls: expiries, download caps, scheduled go-live, allow/deny resharing
-    Custom domains + branding presets
-    Analytics: opens/downloads, devices, locations, blocked attempts
-    Dashboard: manage transfers, recipients, devices, domains

### Getting started

1. Install deps

```
npm install
```

2. Copy envs and fill values

```
cp .env.example .env.local
```

    - Set DATABASE_URL (Postgres), NEXTAUTH_SECRET, NEXTAUTH_URL
    - For email login, set AUTH_EMAIL_SERVER and AUTH_EMAIL_FROM
    - Add optional OAuth keys (GitHub/Google)

3. Generate Prisma client and sync schema

```
npm run db:generate
npm run db:push
```

4. Run dev server

```
npm run dev
```

### Deployment (Vercel)

-    Add DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET, and provider secrets to Vercel project envs.
-    Provision Vercel Postgres (or point to external Postgres) and run `npm run db:push` (or migrations) via Vercel CLI.
-    Connect custom domain(s) in app settings; DNS/verification handled per workspace domain model.

### Roadmap (initial cut)

-    Auth wiring (email magic + OAuth)
-    Dashboard UX: transfers, recipients, analytics
-    Upload pipeline (Vercel Blob or S3), passcode hashing, device fingerprinting
-    Rate limiting + background cleanup of expired/revoked artifacts
