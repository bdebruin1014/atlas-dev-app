# AtlasDev Budget Module Installation

## Quick Install (2 Steps)

### Step 1: Upload this zip to your Codespace
Drag and drop this entire folder into `/workspaces/atlas-dev-app/`

### Step 2: Run this command in terminal
```bash
cp -r /workspaces/atlas-dev-app/atlasdev-budgets-package/src/features/budgets /workspaces/atlas-dev-app/src/features/ && cp /workspaces/atlas-dev-app/atlasdev-budgets-package/src/App.jsx /workspaces/atlas-dev-app/src/App.jsx && npm run dev
```

### Step 3: Open the app
Go to: http://localhost:5173/budgets

---

## What's Included

- **Deal Analyzer** - Pipeline deal proforma with ROI/profit analysis
- **Spec Home Budget** - Individual home construction budget with line items

## Files
```
src/
├── App.jsx (updated with /budgets route)
└── features/
    └── budgets/
        ├── index.js
        ├── utils/
        │   └── budgetCalculations.js
        └── components/
            ├── ui/
            │   └── BudgetComponents.jsx
            ├── BudgetModuleRouter.jsx
            ├── PipelineDealAnalyzer.jsx
            └── IndividualSpecHomeBudget.jsx
```
