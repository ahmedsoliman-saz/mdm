# Quickstart: Sazience MDM React Prototype

**Branch**: `001-mdm-react-prototype`
**Date**: 2026-04-06

## Prerequisites

- Node.js 20+ (LTS)
- npm 10+
- A modern browser (Chrome or Edge recommended)

## Setup

```bash
# 1. Clone the repository and switch to the feature branch
git checkout 001-mdm-react-prototype

# 2. Install dependencies
npm install

# If you see peer dependency warnings about React 19 + Ant Design:
npm install --legacy-peer-deps
```

## Run the Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The app opens directly at `/dashboard`.

## Build for Production

```bash
npm run build      # Type-check + Vite production build
npm run preview    # Serve the production build locally
```

## Lint

```bash
npm run lint
```

## Key Dependencies to Install

The following packages are not yet installed and must be added:

```bash
npm install antd @ant-design/v5-patch-for-react-19 @ant-design/cssinjs
npm install react-router-dom
npm install recharts
npm install --save-dev @types/recharts
```

Add to `package.json` if peer dep errors persist:
```json
{
  "overrides": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

## Entry Points

| File | Purpose |
|------|---------|
| `src/main.tsx` | App entry — import React 19 patch here, before any Ant Design import |
| `src/App.tsx` | Root component — wraps app with `StyleProvider` and `RouterProvider` |
| `src/routes.tsx` | All route definitions using `createBrowserRouter` |
| `src/components/AppLayout.tsx` | Persistent shell (header + sidebar + breadcrumb + `<Outlet>`) |
| `src/types/index.ts` | All TypeScript interfaces |
| `src/data/` | All mock data arrays |

## Required Import Order in main.tsx

```typescript
// 1. React 19 patch MUST be first
import '@ant-design/v5-patch-for-react-19';
// 2. Then React
import React from 'react';
import ReactDOM from 'react-dom/client';
// 3. Then app
import App from './App';
```

## StyleProvider Setup in App.tsx

```typescript
import { StyleProvider } from '@ant-design/cssinjs';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

export default function App() {
  return (
    <StyleProvider hashPriority="high">
      <RouterProvider router={router} />
    </StyleProvider>
  );
}
```

## Project Navigation Map

| Sidebar Group | Item | Route |
|---------------|------|-------|
| Home | Dashboard | `/dashboard` |
| Data | Entity Browse | `/entities/spare-parts` |
| Governance | Task Inbox | `/governance/tasks` |
| Governance | Matching Proposals | `/governance/matching` |
| Governance | DQ Issue Queue | `/governance/dq-issues` |
| Governance | Draft Staging | `/governance/drafts` |
| Operations | Bulk Onboarding | `/operations/bulk-onboarding` |
| Operations | Source Systems | `/operations/sources` |
| Operations | Interface Monitor | `/operations/interfaces` |
| Analytics | DQ Overview | `/analytics/dq-overview` |
| Analytics | Anomaly Overview | `/analytics/anomalies` |
| Analytics | Profile Inspector | `/analytics/profiling` |
| Admin | Entity Model Config | `/admin/entity-model` |
| Admin | Workflow Config | `/admin/workflows` |
| Admin | RBAC Console | `/admin/rbac` |
| Admin | Audit Log | `/admin/audit-log` |
| Admin | Tenant Settings | `/admin/settings` |

## Demo Walkthrough (Stakeholder Script)

1. **Dashboard** — Show overall platform health at a glance
2. **Entity Browse** (Spare Parts) — Filter by DQ Score < 85, click a red-badge record
3. **Record Detail** — Show source attribution, DQ Validation tab, Version History diff
4. **Matching Proposals** — Filter high-confidence proposals, open comparison
5. **Record Comparison** — Show side-by-side diff, click Accept Merge, view Survivorship Preview
6. **Task Inbox** — Show pending approval task, open detail, Approve
7. **Bulk Onboarding** — Walk through the 4-step wizard
8. **DQ Overview** — Show analytics charts and trend lines
9. **Anomaly Overview** — Expand a high-severity anomaly
10. **RBAC Console** — Show role permission matrix
