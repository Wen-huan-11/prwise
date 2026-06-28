# PRwise (Next.js App) — Agent Guide

Project root: `C:\Users\温焕\Desktop\AI-IDE\PRwise\next-app`

## Commands

- `npx next dev -p 3456` — dev server (must use `cmd.exe /c` wrapper via Start-Process on Windows to keep it alive; Start-Job gets killed on timeout)
- `npx next build` — production build
- `npx next start -p 3456` — production server
- `npx prisma generate` — regen Prisma client to `src/generated/prisma`
- `npx prisma db push` — sync schema to SQLite (creates `prisma/dev.db`)
- No test framework installed yet

## Framework & Toolchain

- **Next.js 16.2.9** (App Router, Turbopack), **React 19.2.4**, **TypeScript** (strict, bundler module resolution)
- **Tailwind CSS v4** with `@theme inline` custom colors in `globals.css` (brand-50..950)
- Custom CSS classes: `.gradient-text`, `.glow`, `.code-bg`, `.diff-add`, `.diff-remove`, `.review-item`
- Fonts: Inter (sans), JetBrains Mono (mono) — loaded from Google Fonts in `layout.tsx`
- Path alias `@/*` → `./src/*`
- `next.config.ts` only has `images: { unoptimized: true }` — do not add `output: 'export'` (breaks API routes)

## Auth (next-auth v4)

- **v4.24.14** (NOT v5 beta; v5 crashes with `ERR_MODULE_NOT_FOUND` on `'next/server'` in Next.js 16)
- GitHub OAuth provider; config exported as `authOptions` from `src/auth.ts`
- **No PrismaAdapter** — user upsert happens manually in the `signIn` callback
- `session.user.id` = `token.sub` = GitHub user ID (string); lookup via `prisma.user.findUnique({ where: { githubId: parseInt(userId, 10) } })`
- `pages.signIn: '/'` — sign-in stays on home page
- Handler at `src/app/api/auth/[...nextauth]/route.ts`

## Database (Prisma + SQLite)

- **SQLite** via `@prisma/adapter-libsql` — adapter constructor takes `{ url: string }`, NOT a Client object
- Prisma client singleton at `src/lib/prisma.ts`; models: User, Repository, Review, Finding
- User `email` is `String?` (optional, not unique); use `githubId` (Int, `@unique`) for lookups
- Generated to `src/generated/prisma` (not default `node_modules/.prisma`)

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handler |
| `/api/auth/register` | POST | Stub (501) |
| `/api/github/webhook` | POST | Receives PR events from GitHub |
| `/api/repositories` | GET | Stub (empty array) |
| `/api/repositories` | POST | Stub (501) |
| `/api/reviews` | GET | Stub (empty array) |
| `/api/reviews` | POST | Manual trigger: `{ prUrl: "https://github.com/owner/repo/pull/123" }` |
| `/api/stats` | GET | Returns `{ users, repositories, reviews, findings }` |

- `/api/reviews` POST requires auth; looks up user by `parseInt(session.user.id, 10)` against `githubId`
- `/api/github/webhook` verifies `x-hub-signature-256` against `GITHUB_WEBHOOK_SECRET`

## i18n

- Custom system (not next-intl): `LangContext` + `useLang()` hook at `src/context/LangContext.tsx`
- Dictionary: `src/lib/i18n.ts` — flat key → `{ zh: "中文", en: "English" }` (190 keys)
- Usage: `const { t } = useLang()` then `t('nav_features')`
- Language persisted in `localStorage('prwise_lang')`

## Environment Variables (`.env`)

```ini
DATABASE_URL="file:./dev.db"
GITHUB_CLIENT_ID=         # GitHub OAuth App
GITHUB_CLIENT_SECRET=     # GitHub OAuth App
AUTH_SECRET=              # npx auth secret
NEXTAUTH_URL=http://localhost:3456
GITHUB_TOKEN=             # Fine-grained PAT for API calls
GITHUB_WEBHOOK_SECRET=    # For webhook signature verification
```

## Development Flow

1. Start server: `Start-Process -NoNewWindow cmd.exe '/c npx next dev -p 3456'` (keeps running after timeout)
2. Must use port **3456** (matches NEXTAUTH_URL, GitHub OAuth callback, webhook URL)
3. GitHub OAuth callback must be `http://localhost:3456/api/auth/callback/github`

## Page Structure

- Home (`/`): 13 section components (Hero → BottomCTA)
- `/dashboard`: Protected page with stats display; redirects to `/` if unauthenticated
- `/demo`, `/pricing`, `/docs`, `/privacy`, `/terms`: Static content pages

## Important Constraints

- **DO NOT** modify files outside the `next-app/` directory
- **DO NOT** add `output: 'export'` to next.config.ts
- `*.pem` files in `.gitignore` (was used for GitHub App JWT, now deprecated; use `GITHUB_TOKEN` instead)
- ESLint: uses flat config (`eslint.config.mjs`) with `@typescript-eslint/parser`; `@typescript-eslint/eslint-plugin` is installed but takes ~4.5s to load on this machine — omitted from config to avoid hanging; re-enable if performance improves
- `npm run lint` works; TypeScript checking in the build step (`npx next build`) is the primary type check

## Known Quirks

- Dev server background job on Windows gets killed by shell tool timeout; use `Start-Process -NoNewWindow cmd.exe '/c npx next dev -p 3456'` to persist
- `jose` package is available as transitive dep of next-auth but not as top-level; prefer Node.js built-in `crypto` for JWT signing if needed
- GitHub App could not be installed on localhost (GitHub blocks it); development uses a fine-grained PAT (`GITHUB_TOKEN`) instead
