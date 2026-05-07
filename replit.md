# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### `artifacts/pamyat` — Память
Russian-language mobile-first web app for digital family legacy. React + Vite + Tailwind + Zustand + Wouter + Framer Motion + lucide-react + qrcode + html2canvas + jspdf.

**Flow**: `/` → Intro slides (3) → `/login` (pre-filled `anna.ivanova@pamyat.ru` / `demo1234`) → `/dashboard`.

**Bottom nav (5 tabs)**: Главная (`/dashboard`), Древо (`/tree`), Стена (`/wall`), Истории (`/stories`), Ещё (`/menu`).

**Pages**:
- `Dashboard` — stats pills, stories bar, family tree CTA, weekly challenge, quick actions, achievements, recent stories, Pro upsell. Two top quick-action buttons: «Мой профиль» + «Добавить родственника» (open MemberFormModal).
- `Tree` — draggable blocks with custom pointer handlers. Scroll fix: `.mobile-app` uses `h-[100dvh]` (was `min-h`) so `flex-1` inside Tree gets proper height. The canvas uses `absolute inset-0 / overflow-auto` + spacer div at `CANVAS_W*scale × CANVAS_H*scale` for correct scrollable area. Right-click/long-press → context menu (edit, add connection, manage connections, delete). Modals: edit card, add connection, manage connections (with type change + delete), PDF export (A3/A2/A1). 4 backgrounds.
- `Wall` — Pinterest-style masonry feed with type filters.
- `Capsules` — time-capsule list with create form and unlock-date countdown.
- `Menu` — sectioned settings/links with Pro subscription badge and logout.
- `Profile/:id` — hero photo, bio, gallery, timeline. QR button opens modal with 2 templates: «Простой QR» (canvas) and «С оформлением» (branded card with photo/name/dates/bio/logo), both downloadable as PNG. Edit button opens MemberFormModal.
- Other: `Memorial/:id` (public QR target), `Stories`, `Dates`, `Relatives`, `Settings`.

**Shared Component**: `src/components/MemberFormModal.tsx` — add/edit family member (avatar picker, relation chips, dates, deceased toggle, profession, bio). Used in Dashboard, Tree, Profile.

**State**: zustand `useAppStore` with persist (`pamyat-storage`). Fields: `isLoggedIn`, `currentUser`, `family`, `stories`, `treeBlocks/Connections`, `capsules`, `wallItems`, `achievements`. Store actions: `updateFamilyMember`, `deleteFamilyMember`, `addTreeBlock`, `deleteTreeBlock`, `addConnection`, `updateConnection`, `deleteConnection`, `addCapsule`, `addWallItem`.

**Design**: warm cream/amber base + vibrant coral/orange/rose gradients. Playfair Display serif + Plus Jakarta Sans. Mobile container max-w-[430px] h-[100dvh]. No emojis in UI.

**Member portraits**: stored in `artifacts/pamyat/public/images/` (anna, ivan, maria, elena, dmitry, intro1-3, etc.).

**FamilyMember fields**: id, name, birthYear, birthDate (dd.mm.yyyy), deathYear, deathDate, relation, avatar, bio, profession, hobbies, places, isDeceased, candlesLit, timeline, privacy.
