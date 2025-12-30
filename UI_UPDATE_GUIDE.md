# AtlasDev UI Update Guide

## Summary of Changes

This update includes:
1. **List View Pattern for Projects & Pipeline** - Main pages show list view, clicking an item opens detail view with LEFT sidebar
2. **Project/Opportunity Sidebars** - Dark sidebars with collapsible modules (like your screenshot)
3. **Scroll Fixes** - Applied fixes from ATLASDEV_UI_FIXES.md
4. **All Phase 2 Components** - Accounting, vendors, capital management

---

## New Files Added

### Pages
- `ProjectsListPage.jsx` - List view of all projects with filters
- `PipelineListPage.jsx` - List view of all opportunities with filters  
- `OpportunityDetailPage.jsx` - Detail view for opportunities

### Components
- `ProjectSidebar.jsx` - Dark sidebar with project modules (Overview, Pipeline Analysis, Acquisition, Construction, etc.)
- `OpportunitySidebar.jsx` - Dark sidebar with opportunity modules

### Layouts
- `ProjectLayout.jsx` - Layout with ProjectSidebar + content
- `OpportunityLayout.jsx` - Layout with OpportunitySidebar + content
- `SimpleLayout.jsx` - Simple scrollable layout

### Styles
- `index.css` - Updated with scroll fixes and new utilities

---

## Required Route Updates

Update your `App.jsx` to use these routes:

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import SimpleLayout from '@/components/layouts/SimpleLayout';
import ProjectLayout from '@/components/layouts/ProjectLayout';
import OpportunityLayout from '@/components/layouts/OpportunityLayout';

// Pages
import ProjectsListPage from '@/pages/ProjectsListPage';
import ProjectDetailPage from '@/pages/ProjectDetailPage';
import PipelineListPage from '@/pages/PipelineListPage';
import OpportunityDetailPage from '@/pages/OpportunityDetailPage';

// In your Routes:
<Routes>
  {/* Projects - List View then Detail with Sidebar */}
  <Route path="/projects" element={<SimpleLayout />}>
    <Route index element={<ProjectsListPage />} />
  </Route>
  
  <Route path="/project/:projectId" element={<ProjectLayout />}>
    <Route index element={<Navigate to="overview/basic-info" replace />} />
    <Route path=":section/:subsection" element={<ProjectDetailPage />} />
  </Route>
  
  {/* Pipeline - List View then Detail with Sidebar */}
  <Route path="/pipeline" element={<SimpleLayout />}>
    <Route index element={<PipelineListPage />} />
  </Route>
  
  <Route path="/pipeline/opportunity/:opportunityId" element={<OpportunityLayout />}>
    <Route index element={<Navigate to="overview/basic-info" replace />} />
    <Route path=":section/:subsection" element={<OpportunityDetailPage />} />
  </Route>
  
  {/* ... other routes */}
</Routes>
```

---

## UI Pattern Explained

### Before (Old Pattern)
```
/projects → Card grid view
/project/1 → Full page detail with tabs
```

### After (New Pattern - Like Your Screenshot)
```
/projects → List/Table view with filters
                ↓ Click a project
/project/1/overview/basic-info → LEFT SIDEBAR + Detail Content
```

The LEFT SIDEBAR contains collapsible sections:
- **OVERVIEW** (Basic Info, Property Profile, Seller Info, Tasks)
- **PIPELINE ANALYSIS** (Deal Analysis, Pipeline Tracker)
- **ACQUISITION** (Due Diligence, Legal, Loans)
- **CONSTRUCTION** (Plans & Permits, Schedule, Budget, Draws, etc.)
- **DISPOSITION** (Marketing, Sales, Warranty)
- **FINANCE** (Proforma, Actuals, Expenses, Revenue)
- **INVESTORS** (Investors, Investments, Distributions)
- **DOCUMENTS** (Documents, Communications, Email)

---

## Scroll Fix Summary

The key changes from ATLASDEV_UI_FIXES.md:

1. **index.css**: Changed `overflow: hidden` to `height: 100%` on html/body/#root
2. **Layouts**: Use `flex-1 flex overflow-hidden` pattern
3. **Content areas**: Use `flex-1 overflow-y-auto`
4. **Remove** `h-screen overflow-hidden` from page containers

---

## Quick Copy-Paste Installation

1. Extract the zip to your project root (overwrites existing files)
2. Update your `App.jsx` routes as shown above
3. Run `npm run dev`

---

## Testing Checklist

After installation, verify:
- [ ] `/projects` shows list view with table
- [ ] Clicking a project goes to `/project/1/overview/basic-info`
- [ ] Left sidebar appears with collapsible sections
- [ ] Sidebar scrolls independently
- [ ] Content area scrolls independently
- [ ] `/pipeline` shows list view
- [ ] Clicking an opportunity shows sidebar

---

## Accounting Module Notes

Based on your previous conversations, the accounting module supports:

### Three-Level Architecture
1. **Project Level** - Budget tracking, AP/AR coded to project
2. **Entity Level** - Full GL, bank accounts, capital accounts
3. **Consolidated** - Family office view with ownership tracing

### Ownership Chain Tracking
```
Bryan De Bruin (Individual)
  └── Olive Brynn LLC (Personal Holding) - 100%
        ├── VanRock Holdings LLC - 50%
        │     ├── Oak Ridge Development LLC (SPE) - 100%
        │     ├── Highland Park LLC (SPE) - 100%
        │     └── VanRock Apartments LLC - 100%
        └── Passive Investments (K-1 only)
```

### Entity Types
- Individual - Ultimate beneficial owner
- Trust - Net worth tracking
- Holding Company - Full GL + capital accounts
- Operating Entity - Full GL + operating
- Project Entity (SPE) - Full GL + project costs
- Passive Investment - K-1 tracking only

---

## Questions?

The key architectural decision is:
- **Active entities** (you do bookkeeping) → Full GL accounting
- **Passive investments** (K-1 only) → Track capital account + K-1 data

Let me know if you need any adjustments!
