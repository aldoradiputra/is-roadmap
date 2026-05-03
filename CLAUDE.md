# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A **public product roadmap** for **Indonesia System** — a long-term vision for a national corporate OS for Indonesia (simpler than Odoo, powerful enough to replace SAP, natively integrated with Indonesian government infrastructure like BPJS, Ketenagakerjaan, taxation, and national identifiers).

The roadmap app is standalone — separate from sister products Supapark and Jurna under the same PT entity.

## Commands

```bash
npm run dev      # Start dev server (Next.js App Router)
npm run build    # Production build
npm run start    # Start production server
```

No test runner or linter is configured yet.

## Architecture

**Next.js 15 App Router** deployed on Vercel. No database — `data/features.json` is the single source of truth for all nodes displayed in both the map and list views.

### Target project structure (partially built):

```
app/
  layout.tsx          # Root layout — exists
  globals.css         # CSS variables + resets — exists
  page.tsx            # Main shell (Map/List toggle, toolbar) — TO BUILD
  api/
    chat/
      route.ts        # Claude API proxy via ANTHROPIC_API_KEY — TO BUILD
data/
  features.json       # All roadmap nodes — exists (20 nodes defined)
```

Currently `layout.tsx` and `globals.css` are at the project root (not inside `app/`) — move them into `app/` when building out the full Next.js structure.

### `features.json` node schema

```json
{
  "id": "hr",
  "label": "HR & Employees",
  "description": "...",
  "type": "module",        // "root" | "module" | "feature" | "infrastructure"
  "status": "planned",     // "planned" | "in-progress" | "done"
  "phase": 1,              // 0 = core/root, 1–3 = phases
  "parent": "core",        // id of parent node (absent on root)
  "x": -420,               // canvas position for map view
  "y": -220
}
```

### Phase color coding (use CSS variables from `globals.css`):
- Phase 0 / root → `--navy` `#1A2B5A`
- Phase 1 → `--indigo` `#3B4FC4`
- Phase 2 → `--teal` `#0F7B6C`
- Phase 3 → `--amber` `#B35A00`

### What still needs to be built (priority order):

1. **`app/page.tsx`** — main shell with toolbar (Map/List toggle, title, version badge)
2. **Map canvas component** — SVG or Canvas-based, pannable (mouse drag) and zoomable (scroll wheel); nodes connected by lines to parent; click = show detail panel
3. **List view component** — grouped by phase, status badges
4. **Node detail panel** — slides in from right on node click; shows label, description, type, status, phase
5. **`app/api/chat/route.ts`** — POST endpoint proxying to Claude API via `ANTHROPIC_API_KEY`; streams response; injects `features.json` into system prompt
6. **Chat panel component** — collapsible side panel for Q&A about the roadmap

### `/api/chat` system prompt (use verbatim):

```
You are the AI assistant for Indonesia System's public product roadmap.
Indonesia System is a long-term vision for a national corporate operating system for Indonesia —
simpler than Odoo, powerful enough to replace SAP, natively integrated with Indonesian
government infrastructure (BPJS, Ketenagakerjaan, taxation, national identifiers).

You have access to the full feature list and roadmap. Answer questions about features,
phases, status, and product direction. Be concise and helpful.
Keep responses short — this is a chat panel, not a document.
```

## Styling Rules

- Use CSS Modules or inline styles only — **no Tailwind**
- All design tokens are CSS variables in `globals.css` — use them, don't hardcode colors
- Font: system-ui / -apple-system stack (no external fonts)
- `html, body` are `overflow: hidden` — the map canvas takes full viewport

## Environment Variables

```
ANTHROPIC_API_KEY=sk-ant-...   # Set in Vercel dashboard, never commit
```

## Deployment

Vercel (auto-detects Next.js). Push to GitHub → connect repo in Vercel → add env var → deploy.

## Nice-to-haves (post-MVP)

- Minimap for canvas orientation
- Filter by phase or status
- URL hash deep-linking to a specific node
- Admin page (password-protected) to edit `features.json` via UI
