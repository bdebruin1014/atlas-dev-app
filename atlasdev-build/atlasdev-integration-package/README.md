# AtlasDev Budget Integration Package

## What's Included

| Feature | Location |
|---------|----------|
| **Deal Analyzer** | Opportunity Detail → Pipeline → Deal Analyzer |
| **Spec Home Budget** | Project Detail → Construction → Budget |

---

## Installation (2 Simple Steps)

### Step 1: Upload This Folder
Drag and drop `atlasdev-integration-package` folder into `/workspaces/atlas-dev-app/`

### Step 2: Run This Command
```bash
cp -r /workspaces/atlas-dev-app/atlasdev-integration-package/src/features/budgets /workspaces/atlas-dev-app/src/features/ && cp /workspaces/atlas-dev-app/atlasdev-integration-package/src/pages/OpportunityDetailPage.jsx /workspaces/atlas-dev-app/src/pages/ && cp /workspaces/atlas-dev-app/atlasdev-integration-package/src/pages/ProjectDetailPage.jsx /workspaces/atlas-dev-app/src/pages/ && cp /workspaces/atlas-dev-app/atlasdev-integration-package/src/App.jsx /workspaces/atlas-dev-app/src/ && npm run dev
```

---

## How to Use

### Deal Analyzer (for Opportunities)
1. Go to **Opportunities** page
2. Click on any opportunity
3. In the left sidebar, expand **Pipeline**
4. Click **Deal Analyzer**

### Spec Home Budget (for Projects)
1. Go to **Projects** page  
2. Click on any project
3. In the left sidebar, expand **Construction**
4. Click **Budget**

---

## Files Updated

```
src/
├── App.jsx                          (adds /budgets route)
├── features/
│   └── budgets/
│       ├── index.js
│       ├── utils/
│       │   └── budgetCalculations.js
│       └── components/
│           ├── ui/
│           │   └── BudgetComponents.jsx
│           ├── BudgetModuleRouter.jsx
│           ├── PipelineDealAnalyzer.jsx
│           └── IndividualSpecHomeBudget.jsx
└── pages/
    ├── OpportunityDetailPage.jsx    (adds Deal Analyzer tab)
    └── ProjectDetailPage.jsx        (adds Budget tab)
```

---

## Future Budget Types

When you create more project types, you can add:
- **Horizontal Lot Development** - for subdivisions
- **Build to Rent** - for BTR communities
- **Build to Sell** - for BTS communities

These will be selectable when creating a new project.
