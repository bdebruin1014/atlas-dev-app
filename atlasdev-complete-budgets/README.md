# AtlasDev Complete Budget Integration

## What's Included

### Budget Templates (by Project Type)
| Budget Type | Use For | Key Features |
|-------------|---------|--------------|
| **Individual Spec Home** | Single home builds | Line-item construction costs, profit analysis |
| **Horizontal Lot Development** | Subdivisions | Infrastructure costs, lot sales projections |
| **Build to Rent (BTR)** | Rental communities | NOI, yield on cost, cap rate analysis |
| **Build to Sell (BTS)** | Multi-home spec | Community-wide costs, absorption tracking |

### Integration Points
| Feature | Location |
|---------|----------|
| **Deal Analyzer** | Opportunity → Pipeline → Deal Analyzer |
| **Project Budget** | Project → Construction → Budget |
| **Pro Forma** | Project → Finance → Pro Forma (synced from budget) |
| **Budget vs Actual** | Project → Finance → Budget vs Actual |
| **Budget Type Selection** | Project Creation Modal (Step 1) |

---

## Installation (2 Steps)

### Step 1: Upload This Folder
Drag `atlasdev-complete-budgets` folder into `/workspaces/atlas-dev-app/`

### Step 2: Run This Command
```bash
cd /workspaces/atlas-dev-app/atlasdev-complete-budgets && unzip -o atlasdev-complete-budgets.zip 2>/dev/null; mkdir -p /workspaces/atlas-dev-app/src/features && cp -r src/features/budgets /workspaces/atlas-dev-app/src/features/ && cp src/components/CreateProjectModal.jsx /workspaces/atlas-dev-app/src/components/ && cp src/pages/*.jsx /workspaces/atlas-dev-app/src/pages/ && cp src/App.jsx /workspaces/atlas-dev-app/src/ && cd /workspaces/atlas-dev-app && npm run dev
```

---

## How Budget Selection Works

When creating a new project:

1. **Select Project Type** (Spec Home, Lot Development, BTR, etc.)
2. **System recommends a budget template** based on type
3. **Override if needed** - you can pick any budget template
4. **Budget is linked** to project permanently

The project's `budgetType` field determines which budget component loads.

---

## Budget ↔ Pro Forma Sync

The Pro Forma pulls data directly from the Budget:
- Total project cost → from budget totals
- Sales projections → from budget analysis tab
- Sources & Uses → calculated from budget categories

**To update Pro Forma:** Edit values in the Budget tool.

---

## Files Included

```
src/
├── App.jsx                              (routes)
├── components/
│   └── CreateProjectModal.jsx           (project creation with budget selection)
├── features/
│   └── budgets/
│       ├── index.js
│       ├── utils/
│       │   └── budgetCalculations.js
│       └── components/
│           ├── ui/
│           │   └── BudgetComponents.jsx (shared UI)
│           ├── BudgetModuleRouter.jsx   (standalone /budgets page)
│           ├── IndividualSpecHomeBudget.jsx
│           ├── HorizontalLotDevelopmentBudget.jsx
│           ├── BuildToRentBudget.jsx
│           ├── BuildToSellBudget.jsx
│           └── PipelineDealAnalyzer.jsx
└── pages/
    ├── OpportunityDetailPage.jsx        (with Deal Analyzer tab)
    └── ProjectDetailPage.jsx            (with dynamic budget loading)
```

---

## Usage After Installation

### Access Standalone Budget Tools
URL: `/budgets`

### Create Project with Budget
1. Go to Projects page
2. Click "New Project"
3. Select project type
4. Choose budget template
5. Complete project details

### View Project Budget
1. Open any project
2. Navigate to Construction → Budget
3. Budget loads based on project type

### Analyze Pipeline Deal
1. Open any opportunity
2. Navigate to Pipeline → Deal Analyzer
