# Accounting Priority 2 Features - Implementation Guide

## Phase 8: Bank Integration, Payroll, Expenses, Job Costing

---

## Overview

Phase 8 completes the accounting module with advanced features:

1. **Plaid Bank Integration** - Connect banks, sync transactions, auto-match
2. **Payroll Manual Entry** - Employee management, payroll runs, tax calculations
3. **Expense Management** - Expense tracking, receipts, approvals, mileage
4. **Job Costing Reports** - Project and construction job cost analysis

---

## Files Created

### Services
```
src/services/plaidService.js      # Bank integration (40+ functions)
src/services/payrollService.js    # Payroll management (30+ functions)
src/services/expenseService.js    # Expense tracking (35+ functions)
```

### Pages
```
src/pages/accounting/
├── BankFeedsPage.jsx            # Plaid connection & transaction matching
├── PayrollPage.jsx              # Payroll runs & employee management
├── ExpenseManagementPage.jsx    # Expense tracking & approvals
└── JobCostingReportPage.jsx     # Project/Job cost reports
```

### Database Schema
```
docs/accounting-priority2-schema.sql
```

---

## Database Tables

### Plaid Integration
| Table | Purpose |
|-------|---------|
| plaid_link_tokens | Temporary tokens for Plaid Link |
| plaid_connections | Institution connections |
| bank_accounts | Linked bank accounts |
| bank_transactions | Transaction feed |
| bank_matching_rules | Auto-matching rules |

### Payroll
| Table | Purpose |
|-------|---------|
| employees | Employee records |
| payrolls | Payroll run headers |
| payroll_items | Individual pay stubs |
| mileage_rates | IRS mileage rates |

### Expenses
| Table | Purpose |
|-------|---------|
| expense_categories | Expense types |
| expenses | Individual expenses |
| expense_receipts | Receipt attachments |
| expense_reports | Grouped expense reports |
| expense_report_items | Report line items |

---

## Key Features

### 1. Plaid Bank Integration

**Page**: `/accounting/:entityId/bank-feeds`

Features:
- Connect bank accounts via Plaid Link
- View connected institutions with status
- Sync transactions automatically
- Match transactions to bills/invoices
- Auto-matching rules engine
- Exclude irrelevant transactions
- Create expenses from transactions

```javascript
// Connect a bank
const linkToken = await createLinkToken(entityId, userId);
// User completes Plaid Link...
await exchangePublicToken(entityId, publicToken, metadata);

// Sync transactions
await syncBankTransactions(connectionId, startDate, endDate);

// Auto-match transactions
const result = await applyMatchingRules(entityId);
// Returns: { matched: 15, total: 50 }
```

### 2. Payroll Manual Entry

**Page**: `/accounting/:entityId/payroll`

Features:
- Employee database with pay rates
- Support for salary and hourly employees
- Multiple pay frequencies (weekly, bi-weekly, semi-monthly, monthly)
- Automatic tax calculations (Federal, State, SS, Medicare)
- Employer tax calculations (FUTA, SUTA)
- Payroll approval workflow
- Quarterly and YTD summaries
- W2 data generation

```javascript
// Create payroll run
const payroll = await createPayroll({
  entity_id: entityId,
  pay_period_start: '2024-01-01',
  pay_period_end: '2024-01-15',
  pay_date: '2024-01-20',
  pay_frequency: 'biweekly',
});

// Calculate employee pay
const calculated = await calculatePayrollItem(employeeId, payPeriod);
// Returns gross, deductions, net, employer taxes

// Approve and process
await approvePayroll(payrollId, approverId);
await processPayroll(payrollId);
```

### 3. Expense Management

**Page**: `/accounting/:entityId/expenses`

Features:
- Expense creation with categories
- Mileage tracking (IRS rate: $0.67/mile)
- Receipt upload and storage
- Project/Job assignment
- Approval workflow (Draft → Submitted → Approved → Reimbursed)
- Expense reports (grouped expenses)
- Category-based analytics
- Pending approval alerts

```javascript
// Create regular expense
await createExpense({
  entity_id: entityId,
  expense_date: '2024-01-15',
  description: 'Office Supplies',
  amount: 125.50,
  category_id: categoryId,
  payment_method: 'personal_card',
  is_reimbursable: true,
});

// Create mileage expense
await createMileageExpense(entityId, {
  expense_date: '2024-01-15',
  miles: 45.5,
  from_location: 'Office',
  to_location: 'Job Site',
});

// Approval workflow
await submitExpense(expenseId);
await approveExpense(expenseId, approverId);
await markExpenseReimbursed(expenseId, paymentDetails);
```

### 4. Job Costing Reports

**Page**: `/accounting/:entityId/job-costing`

Features:
- Project cost tracking (budget vs actual)
- Construction job cost analysis
- Cost code breakdown with variances
- Visual progress bars
- Expandable job details
- Date range filtering
- Export capabilities

```javascript
// View provides:
// - Project summary: budget, spent, remaining, % used
// - Job summary: budget, committed, actual, variance
// - Cost code breakdown per job
// - Visual variance indicators
```

---

## Routes Added

```javascript
// Phase 8 Routes
/accounting/:entityId/bank-feeds    → Plaid Bank Integration
/accounting/:entityId/payroll       → Payroll Management
/accounting/:entityId/expenses      → Expense Management
/accounting/:entityId/job-costing   → Job Costing Reports
```

---

## Sidebar Navigation Updated

**Accounts Section**
- Bank Feeds (new)

**Payables (AP) Section**
- Expenses (new)

**Payroll Section** (new)
- Payroll

**Reports Section**
- Job Costing (new)

---

## Constants

### Plaid Status
```javascript
const PLAID_STATUS = {
  PENDING: 'pending',
  CONNECTED: 'connected',
  ERROR: 'error',
  DISCONNECTED: 'disconnected',
  REQUIRES_REAUTH: 'requires_reauth',
};
```

### Payroll Status
```javascript
const PAYROLL_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  PAID: 'paid',
  VOID: 'void',
};
```

### Expense Status
```javascript
const EXPENSE_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  REIMBURSED: 'reimbursed',
  VOID: 'void',
};
```

---

## Deployment Steps

1. **Run Database Schema**
   ```sql
   -- In Supabase SQL Editor
   -- Run docs/accounting-priority2-schema.sql
   ```

2. **Plaid Configuration** (Production)
   - Sign up for Plaid account
   - Get API keys (client_id, secret)
   - Configure webhook endpoints
   - Set environment (sandbox/development/production)

3. **Storage Bucket** (for receipts)
   ```sql
   -- Create storage bucket for expense receipts
   INSERT INTO storage.buckets (id, name) 
   VALUES ('expense-receipts', 'expense-receipts');
   ```

---

## Integration Points

### With Construction Module
- Expenses link to jobs via `job_id`
- Cost codes track committed vs actual
- Job costing reports pull from construction jobs

### With Projects Module
- Expenses link to projects via `project_id`
- Project costing view in reports

### With AP Module
- Bank transactions match to bills
- Expense approvals can create AP entries

### With AR Module
- Bank transactions match to invoice payments

---

## Tax Calculation Notes

### Employee Withholdings (2024)
- Federal: 22% (simplified flat rate)
- State: 5% (varies by state)
- Social Security: 6.2%
- Medicare: 1.45%

### Employer Taxes (2024)
- Social Security: 6.2%
- Medicare: 1.45%
- FUTA: 0.6% (first $7,000)
- SUTA: 2.7% (varies by state)

### Mileage Rate
- 2024 IRS Standard Rate: $0.67/mile

---

## Best Practices

1. **Bank Feeds**
   - Review unmatched transactions weekly
   - Set up auto-match rules for recurring vendors
   - Reconcile accounts monthly

2. **Payroll**
   - Run payroll 2-3 days before pay date
   - Review tax calculations quarterly
   - Keep employee W4 info updated

3. **Expenses**
   - Upload receipts immediately
   - Assign to projects/jobs when applicable
   - Review pending approvals daily

4. **Job Costing**
   - Monitor cost codes approaching budget
   - Review variances weekly on active jobs
   - Use for change order justification

---

## Component Summary

| Component | Purpose |
|-----------|---------|
| BankFeedsPage | Plaid connections & transaction matching |
| PayrollPage | Employee management & payroll runs |
| ExpenseManagementPage | Expense tracking & approvals |
| JobCostingReportPage | Project/job cost analysis |

---

## Phase 8 Complete ✓

All Accounting Priority 2 features implemented.

---

## All Phases Summary

| Phase | Module | Status |
|-------|--------|--------|
| 1 | E-Signatures (DocuSeal) | ✅ Complete |
| 2 | Document Management | ✅ Complete |
| 3 | PM Inspections | ✅ Complete |
| 4 | Roles & Permissions | ✅ Complete |
| 5 | CAHP Safe Harbor | ✅ Complete |
| 6 | Construction Management | ✅ Complete |
| 7 | Accounting Priority 1 | ✅ Complete |
| 8 | Accounting Priority 2 | ✅ Complete |

**AtlasDev is now feature-complete for all planned phases!**
