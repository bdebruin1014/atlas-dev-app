# Phase 5: CAHP Safe Harbor Module - Implementation Guide

## Overview
This module adds comprehensive CAHP (Carolina Affordable Housing Project) Safe Harbor tax abatement compliance tracking to AtlasDev.

## Files to Add

### New Directories
```
src/pages/cahp/
src/components/cahp/
```

### New Files
```
src/services/cahpService.js          (1,287 lines - Core service)
src/pages/cahp/CAHPDashboardPage.jsx
src/pages/cahp/CAHPPropertiesPage.jsx
src/pages/cahp/CAHPPropertyDetailPage.jsx
src/pages/cahp/CAHPAddPropertyPage.jsx
src/pages/cahp/CAHPComplianceCalculatorPage.jsx
src/pages/cahp/index.js
src/components/cahp/AddTenantModal.jsx
src/components/cahp/RecertifyTenantModal.jsx
src/components/cahp/index.js
docs/cahp-schema.sql
docs/CAHP_GUIDE.md
```

## Code Changes Required

### 1. App.jsx - Add Imports (around line 113)

Add after other page imports:
```jsx
// CAHP Module
const CAHPDashboardPage = lazy(() => import('@/pages/cahp/CAHPDashboardPage'));
const CAHPPropertiesPage = lazy(() => import('@/pages/cahp/CAHPPropertiesPage'));
const CAHPPropertyDetailPage = lazy(() => import('@/pages/cahp/CAHPPropertyDetailPage'));
const CAHPAddPropertyPage = lazy(() => import('@/pages/cahp/CAHPAddPropertyPage'));
const CAHPComplianceCalculatorPage = lazy(() => import('@/pages/cahp/CAHPComplianceCalculatorPage'));
```

### 2. App.jsx - Add Routes (in Routes section)

Add before the catch-all route:
```jsx
{/* CAHP Safe Harbor Module */}
<Route path="/cahp" element={<ProtectedRoute><AppLayout><CAHPDashboardPage /></AppLayout></ProtectedRoute>} />
<Route path="/cahp/properties" element={<ProtectedRoute><AppLayout><CAHPPropertiesPage /></AppLayout></ProtectedRoute>} />
<Route path="/cahp/properties/new" element={<ProtectedRoute><AppLayout><CAHPAddPropertyPage /></AppLayout></ProtectedRoute>} />
<Route path="/cahp/properties/:propertyId" element={<ProtectedRoute><AppLayout><CAHPPropertyDetailPage /></AppLayout></ProtectedRoute>} />
<Route path="/cahp/calculator" element={<ProtectedRoute><AppLayout><CAHPComplianceCalculatorPage /></AppLayout></ProtectedRoute>} />
```

### 3. TopNavigation.jsx - Add Shield Icon Import

Update the lucide-react import:
```jsx
import { 
  Home, Building2, FolderKanban, Users, Calendar, Settings, DollarSign, 
  Cog, ChevronDown, ClipboardList, CheckSquare, FileText, Layers, Users2, 
  Landmark, Briefcase, BarChart3, Target, TrendingUp, Clock, Building,
  UserCircle, FileSignature, FolderOpen, ClipboardCheck, Wrench, Key, Home as HomeIcon, Shield
} from 'lucide-react';
```

### 4. TopNavigation.jsx - Add CAHP Menu Item

Add to Property Mgmt dropdown (after Tenants item):
```jsx
{ label: 'Compliance', path: '', isHeader: true },
{ label: 'CAHP Safe Harbor', path: '/cahp', icon: Shield, description: 'Tax abatement compliance' },
```

### 5. services/index.js - Add Export

Add to exports:
```javascript
export { default as cahpService } from './cahpService';
```

## Database Setup

Run in Supabase SQL Editor:
```sql
-- Execute docs/cahp-schema.sql
```

This creates:
- `cahp_properties` - Property records
- `cahp_tenants` - Tenant income tracking
- `cahp_tenant_certifications` - Certification history
- `cahp_compliance_snapshots` - Point-in-time compliance
- `cahp_certifications` - Annual DOR certifications
- `cahp_ami_limits` - HUD income limits (2024 pre-populated)
- `cahp_alerts` - System alerts
- `cahp_fees` - Fee tracking

## Routes Summary

| Route | Description |
|-------|-------------|
| `/cahp` | Dashboard with portfolio compliance overview |
| `/cahp/calculator` | Rent roll compliance calculator |
| `/cahp/properties` | Property list |
| `/cahp/properties/new` | Add new property |
| `/cahp/properties/:id` | Property detail with tenant management |

## Safe Harbor Thresholds

**Overall:** 75% at ≤80% AMI, max 25% market rate

**Deep Affordability (choose one):**
- Option A: 20% at ≤50% AMI
- Option B: 40% at ≤60% AMI

## Fee Structure

- Onboarding: $3,500 one-time
- Annual: 20% of tax savings (lump sum at approval, then monthly)

## Compliance Calculator Features

- CSV upload for rent roll analysis
- Manual unit entry
- Real-time AMI % calculation
- Threshold compliance checking
- Unit-by-unit breakdown
- Recommendations for achieving compliance
