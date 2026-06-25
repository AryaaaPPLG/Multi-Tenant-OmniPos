<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/badb89ad-b7fe-43c6-836a-467371e085c7

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## OmniPOS backend setup

The backend reference implementation lives in:

- `lib/prisma.ts` — warm-runtime Prisma singleton for Vercel
- `lib/auth.ts` — verified Supabase Auth user plus database-owned tenant/role
- `actions/transaction.ts` — tenant-safe atomic checkout Server Action
- `prisma/schema.prisma` — tenant, product, transaction, and immutable line-item models

Copy `.env.example` to `.env.local`, replace the Supabase placeholders, then run:

```bash
npx prisma migrate dev --name init_omnipos_backend
npx prisma generate
```

`DATABASE_URL` is for runtime traffic through the Supabase transaction pooler.
`DIRECT_URL` bypasses the pooler and is only for Prisma migrations. Each local
`User.id` must equal its corresponding Supabase `auth.users.id` UUID.
