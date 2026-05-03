# Indonesia System — Roadmap App: Project Context

> Paste this at the start of your Claude Code session to continue where we left off.

---

## What We're Building

A **public product roadmap** for **Indonesia System** — a long-term vision for a national corporate OS for Indonesia (think: simpler than Odoo, powerful enough to replace SAP, natively integrated with Indonesian government infrastructure).

The roadmap app is a standalone project, separate from the two other products (Supapark, Jurna) being built under the same PT entity.

---

## Core Requirements

### Views
- **Map view** — pannable/zoomable canvas like a map. Core module at center, features radiate outward. Users can drag to explore.
- **List view** — same data, rendered as a structured list. Toggle between views.

### AI Chat Panel
- Side panel where users can chat with Claude to ask about features, phases, and roadmap updates.
- Claude API calls must go through a **serverless function** (API key never exposed to frontend).

### Data
- Single source of truth: `data/features.json`
- Updating this file updates both map and list views automatically.
- No database needed — flat JSON is enough for now.

### Deployment
- **Vercel** (static frontend + serverless API route for Claude proxy)
- Domain will be connected later (custom domain purchase pending)
- Repo should be **public on GitHub**

### Language
- English only for now (no i18n needed yet)

---

## Tech Stack Decisions

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 (App Router) | Vercel-native, serverless functions built-in |
| Runtime | React 19 | Latest stable |
| Styling | CSS Modules or inline styles | No Tailwind — keep it simple |
| Data | `data/features.json` | Single source of truth, easy to edit |
| AI | Claude API via `/api/chat` serverless route | API key protected server-side |
| Hosting | Vercel | Best DX for Next.js, generous free tier |
| Repo | GitHub (public) | Required for Vercel deployment |

---

## Project Structure

```
indonesia-system-roadmap/
├── app/
│   ├── layout.tsx          # Root layout, metadata
│   ├── globals.css         # Global styles + CSS variables
│   ├── page.tsx            # Main page (to be built)
│   └── api/
│       └── chat/
│           └── route.ts    # Claude API proxy (serverless)
├── data/
│   └── features.json       # All feature nodes — source of truth
├── public/
│   └── (logo, favicon — pending design)
├── next.config.js
└── package.json
```

---

## features.json Structure

Each node in the map has this shape:

```json
{
  "id": "hr",
  "label": "HR & Employees",
  "description": "Employee management, attendance, payroll, BPJS & Ketenagakerjaan integration",
  "type": "module",        // "root" | "module" | "feature" | "infrastructure"
  "status": "planned",     // "planned" | "in-progress" | "done"
  "phase": 1,              // 0 = core, 1-3 = phases
  "parent": "core",        // id of parent node
  "x": -420,               // canvas position
  "y": -220
}
```

**Current nodes already defined (20 total):**
- 1 root: `core` (Indonesia System)
- 9 Phase 1 modules: HR, Finance, CRM, Procurement, Inventory, Projects, Documents, Chat, + 2 cross-module features (Instant Search, AI Access Rights)
- 4 Phase 2 modules: Email & Workspace, Meetings, Omnichannel, Workflow Automation
- 3 Phase 3 modules: AI Marketing, Public Sector, B2B Connectivity
- 2 infrastructure/feature nodes: Update System, Roadmap Mind Map

**Phase color coding (suggested):**
- Phase 1 → Indigo `#3B4FC4`
- Phase 2 → Teal `#0F7B6C`
- Phase 3 → Amber `#B35A00`
- Core/Root → Navy `#1A2B5A`

---

## Design Language (CSS Variables)

```css
--navy: #1A2B5A;
--indigo: #3B4FC4;
--indigo-light: #E8EBFA;
--teal: #0F7B6C;
--teal-light: #E0F4F1;
--amber: #B35A00;
--amber-light: #FEF3E2;
--slate: #4A4A5A;
--muted: #6B7280;
--border: #E5E7EB;
--bg: #F8F9FB;
```

Font: system-ui / -apple-system stack. No external font dependencies.

---

## What Still Needs to Be Built

### Priority order:

1. **`app/page.tsx`** — main shell with toolbar (Map/List toggle, title, version badge)
2. **Map canvas component** — SVG or Canvas-based, pan with mouse drag, zoom with scroll wheel. Nodes connected by lines to parent. Click node = show detail panel.
3. **List view component** — grouped by phase, shows all nodes in a scannable list with status badges.
4. **Node detail panel** — slides in from right when a node is clicked. Shows label, description, type, status, phase.
5. **`app/api/chat/route.ts`** — POST endpoint that proxies to Claude API using `ANTHROPIC_API_KEY` env variable. Returns streaming response.
6. **Chat panel component** — collapsible side panel. User can ask questions about the roadmap. Claude has `features.json` as context in system prompt.

### Nice to have (later):
- Minimap for orientation on the canvas
- Filter by phase or status
- URL hash to deep-link to a specific node
- Admin password-protected page to edit features.json via UI

---

## Environment Variables (Vercel)

```
ANTHROPIC_API_KEY=sk-ant-...
```

Set this in Vercel dashboard under Project Settings → Environment Variables.
Never commit to repo.

---

## Deployment Steps (when ready)

1. Push repo to GitHub (public)
2. Connect repo to Vercel
3. Add `ANTHROPIC_API_KEY` in Vercel env vars
4. Deploy — Vercel auto-detects Next.js
5. Connect custom domain when purchased

---

## Indonesia System Context (for Claude chat system prompt)

When building the `/api/chat` route, use this as the Claude system prompt:

```
You are the AI assistant for Indonesia System's public product roadmap.
Indonesia System is a long-term vision for a national corporate operating system for Indonesia —
simpler than Odoo, powerful enough to replace SAP, natively integrated with Indonesian
government infrastructure (BPJS, Ketenagakerjaan, taxation, national identifiers).

You have access to the full feature list and roadmap. Answer questions about features,
phases, status, and product direction. Be concise and helpful.
Keep responses short — this is a chat panel, not a document.
```

---

*Generated from conversation context — Claude.ai chat session, May 2026.*
