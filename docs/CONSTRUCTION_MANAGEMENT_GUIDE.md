# Construction Management Module - Implementation Guide

## Phase 6: Contractor Operations (Red Cedar)

---

## Overview

The Construction Management module provides contractor-perspective management for construction jobs. This is designed for Red Cedar Construction (or any contractor entity) to manage:

- Jobs linked to development projects
- Subcontractor database with COI tracking
- Purchase orders and job costing
- Field operations (daily logs, inspections, permits, punch lists)
- Quality management (RFIs, submittals, warranty)
- Billing and pay applications

---

## Architecture

```
Construction Management Module (Contractor View)
├── Dashboard (/construction)
├── Jobs
│   ├── Jobs List (/construction/jobs)
│   └── Job Detail (/construction/jobs/:jobId)
│       ├── Overview Tab
│       ├── Costs Tab (cost codes, budget vs actual)
│       ├── Purchase Orders Tab
│       ├── Field Ops Tab (daily logs, inspections, permits, punch lists)
│       ├── Quality Tab (RFIs, submittals, warranty)
│       └── Billing Tab (pay applications, SOV)
├── Subcontractors (/construction/subcontractors)
│   ├── Sub Database
│   ├── Insurance (COI) Tracking
│   └── Lien Waivers
└── Procurement
    └── Purchase Orders
```

---

## Files Created

### Services
```
src/services/constructionService.js
```
Comprehensive service with 50+ functions for:
- Jobs CRUD
- Cost codes management
- Subcontractor CRUD
- Insurance certificates
- Lien waivers
- Purchase orders
- Daily logs
- Construction inspections
- Permits
- Punch lists
- RFIs
- Submittals
- Warranty tracking
- Pay applications
- Schedule of values
- Dashboard metrics

### Pages
```
src/pages/construction/
├── ConstructionDashboardPage.jsx
├── JobsListPage.jsx
├── JobDetailPage.jsx
├── SubcontractorsPage.jsx
└── index.js
```

### Database Schema
```
docs/construction-schema.sql
```

---

## Database Tables

| Table | Purpose |
|-------|---------|
| construction_jobs | Main job records linked to projects |
| job_cost_codes | CSI-based cost code tracking |
| subcontractors | Subcontractor database |
| subcontractor_insurance | COI tracking with expiration alerts |
| subcontractor_lien_waivers | Lien waiver collection |
| purchase_orders | PO management |
| purchase_order_items | PO line items |
| daily_logs | Field documentation |
| daily_log_labor | Labor entries per log |
| construction_inspections | Construction inspection scheduling |
| job_permits | Permit tracking |
| punch_lists | Punch list headers |
| punch_list_items | Individual punch items |
| rfis | Requests for information |
| submittals | Submittal tracking |
| warranty_items | Warranty tracking |
| warranty_claims | Warranty claims |
| pay_applications | Pay app to owner |
| schedule_of_values | SOV for billing |

---

## Key Features

### 1. Job Management
- Job creation linked to Projects module
- Contract amount and retainage tracking
- Project manager and superintendent assignment
- Status workflow (pending → active → completed → closed)

### 2. Cost Code System
- CSI MasterFormat-based codes
- Budget, committed, and actual tracking
- Automatic committed cost updates from POs
- Variance analysis

### 3. Subcontractor Database
- Trade categorization
- Preferred vendor flagging
- Performance tracking
- 1099 status tracking

### 4. Insurance (COI) Tracking
- Multiple insurance types per sub
- Expiration alerts (30-day warning)
- Additional insured tracking
- Document storage links

### 5. Purchase Orders
- Auto-numbering (PO-10001, etc.)
- Multi-line items
- Approval workflow
- PO to Bill matching ready
- Committed cost tracking

### 6. Field Operations
- **Daily Logs**: Weather, labor, work summary, incidents
- **Inspections**: Scheduling, result tracking, failure items
- **Permits**: Application to final, fee tracking
- **Punch Lists**: Multi-item lists with verification

### 7. Quality Management
- **RFIs**: Numbered per job, routing, answers
- **Submittals**: Revision tracking, review workflow
- **Warranty**: Item tracking, claim management

### 8. Billing
- **Pay Applications**: Period-based billing
- **Schedule of Values**: Line-by-line progress
- **Retainage**: Automatic calculation

---

## Routes Added

```javascript
// Construction Management Module
/construction                    → Dashboard
/construction/jobs               → Jobs list
/construction/jobs/new           → Create job
/construction/jobs/:jobId        → Job detail (all tabs)
/construction/jobs/:jobId/*      → Job sub-routes
/construction/subcontractors     → Sub database
/construction/subcontractors/:id → Sub detail
```

---

## Navigation

Added to TopNavigation under "Construction" dropdown:
- Dashboard
- Jobs
- Subcontractors
- Purchase Orders
- Daily Logs
- Inspections
- RFIs
- Submittals

---

## Integration Points

### With Projects Module
- Jobs link to projects via `project_id`
- Owner budget ↔ Job cost codes
- Pay applications → Owner approval

### With Accounting Module
- Purchase orders → Bills matching
- Job cost reports by cost code
- 1099 tracking for subcontractors
- Expense tagging to jobs

### With Contacts
- Subcontractors link to contacts
- Vendor payments via accounting

---

## Deployment Steps

1. **Run Database Schema**
   ```sql
   -- In Supabase SQL Editor
   -- Run docs/construction-schema.sql
   ```

2. **Create Cost Code Template (Optional)**
   ```sql
   SELECT create_default_cost_codes('your-job-uuid');
   ```

3. **No Environment Variables Required**
   - Uses existing Supabase connection

4. **Test Navigation**
   - Click "Construction" in top nav
   - Create a test job
   - Add cost codes
   - Create PO

---

## Status Constants

```javascript
// Job Status
pending → active → on_hold → completed → closed

// PO Status
draft → pending_approval → approved → partially_received → received

// Inspection Result
passed | failed | partial | cancelled

// RFI Status
draft → submitted → in_review → answered → closed

// Submittal Status
pending → submitted → approved | approved_as_noted | revise_resubmit | rejected

// Punch Item Status
open → in_progress → completed → verified
```

---

## Future Enhancements

### Phase 6.1 (Post-MVP)
- [ ] Job creation form/modal
- [ ] PO creation workflow
- [ ] Daily log form with labor entries
- [ ] Photo uploads for punch items
- [ ] Gantt chart scheduling
- [ ] Mobile-friendly field forms

### Phase 6.2 (Integration)
- [ ] PO → Bill matching in Accounting
- [ ] Draw request workflow to owner
- [ ] Subcontractor portal (limited access)
- [ ] Automated COI expiration emails

---

## Component Reference

### ConstructionDashboardPage
Main dashboard showing:
- Active/pending job counts
- Open RFIs and pending inspections
- Expiring insurance alerts
- Quick action buttons
- Active jobs list

### JobsListPage
Searchable, filterable list of all jobs with:
- Status badges
- Contract values
- Project links
- PM assignments

### JobDetailPage
Comprehensive job view with tabs:
- **Overview**: Job details, cost summary, recent activity
- **Costs**: Cost codes table with variance
- **POs**: Purchase order list
- **Field**: Daily logs, inspections, permits, punch lists
- **Quality**: RFIs, submittals, warranty
- **Billing**: Pay applications

### SubcontractorsPage
Grid view of subcontractors with:
- Trade filtering
- Insurance status badges
- Expiring COI alerts
- Add subcontractor modal

---

## Best Practices

1. **Always link jobs to projects** - Enables owner/contractor flow
2. **Set up cost codes early** - Use template function
3. **Track committed costs** - Approve POs to update budgets
4. **Document daily** - Daily logs are crucial for disputes
5. **Collect lien waivers** - Required for pay applications

---

## Module Complete ✓

Phase 6 Construction Management is now ready for integration.
