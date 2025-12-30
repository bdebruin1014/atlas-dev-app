# Accounting Priority 1 Features - Implementation Guide

## Phase 7: Accounting Enhancements

---

## Overview

Phase 7 implements critical accounting features that enhance AtlasDev's multi-entity accounting capabilities:

1. **Cash/Accrual Accounting Engine** - Dual-method financial reporting
2. **1099 Vendor Tracking** - IRS compliance for contractor payments
3. **AR Enhancements** - Statements, late fees, aging reports
4. **AP Enhancements** - Early payment discounts, batch payments
5. **Entity Accounting Settings** - Per-entity configuration

---

## Files Created

### Services
```
src/services/accountingEnhancedService.js
```
Comprehensive service with 40+ functions for:
- Entity accounting settings
- Cash vs Accrual reporting
- 1099 vendor management
- AR/AP operations
- Batch payments
- Dashboard metrics

### Pages
```
src/pages/accounting/
├── Vendors1099Page.jsx        # 1099 vendor tracking & reporting
├── BatchPaymentsPage.jsx      # Batch payment processing
├── ARAgingReportPage.jsx      # Enhanced AR aging report
└── EntityAccountingSettingsPage.jsx  # Cash/Accrual + settings
```

### Database Schema
```
docs/accounting-enhancements-schema.sql
```

---

## Database Tables

| Table | Purpose |
|-------|---------|
| entity_accounting_settings | Cash/Accrual method, late fees, notifications |
| vendors | Enhanced with 1099 fields, W9 tracking |
| vendor_payments | 1099 payment tracking |
| customers | Customer database for AR |
| invoices | Enhanced invoices with late fees |
| invoice_line_items | Invoice details |
| invoice_payments | Payment tracking |
| invoice_late_fees | Late fee records |
| bills | Enhanced bills with discounts |
| bill_line_items | Bill details |
| bill_payments | Payment tracking |
| payment_batches | Batch payment headers |
| payment_batch_items | Individual payments in batch |

---

## Key Features

### 1. Cash vs Accrual Accounting

**Settings Page**: `/accounting/:entityId/settings`

Each entity can select their accounting method:
- **Cash Basis**: Revenue when received, expenses when paid
- **Accrual Basis**: Revenue when earned, expenses when incurred

Financial reports automatically adjust based on the selected method.

```javascript
// Example: Getting income statement based on entity's method
const statement = await getIncomeStatement(entityId, startDate, endDate);
// Automatically uses entity's configured method
```

### 2. 1099 Vendor Tracking

**Page**: `/accounting/:entityId/vendors-1099`

Features:
- Track all 1099-eligible vendors
- Monitor YTD payments approaching $600 threshold
- Flag vendors missing Tax ID (W9)
- Generate 1099 report for year-end
- Export to CSV for tax filing

```javascript
// Generate 1099 report
const report = await generate1099Report(entityId, 2024);
// Returns qualifying vendors (≥$600 paid)
```

### 3. AR Enhancements

**Page**: `/accounting/:entityId/ar-aging`

Features:
- Enhanced aging buckets (Current, 1-30, 31-60, 61-90, 90+)
- Visual aging distribution chart
- Customer-expandable detail view
- Auto late fee processing
- Statement generation per customer
- Email statements directly

```javascript
// Get aging report
const aging = await getARAgingReport(entityId);
// Returns: { summary, details grouped by customer }

// Generate customer statement
const statement = await generateStatement(customerId, entityId, asOfDate);

// Process automatic late fees
await processAutoLateFees(entityId);
```

### 4. AP Enhancements

**Page**: `/accounting/:entityId/batch-payments`

Features:
- Batch multiple bills for payment
- Early payment discount tracking
- Discount opportunity alerts
- Check number assignment
- Payment scheduling

```javascript
// Find early payment opportunities
const discounts = await getEarlyPaymentOpportunities(entityId);
// Returns bills with available discounts

// Create payment batch
const batch = await createPaymentBatch(entityId, billIds, paymentDate, bankAccountId);

// Process batch (assign check numbers, mark bills paid)
await processPaymentBatch(batchId, startingCheckNumber);
```

### 5. Entity Accounting Settings

**Page**: `/accounting/:entityId/settings`

Configurable per entity:
- Accounting method (Cash/Accrual)
- Fiscal year start month
- Default payment terms
- Late fee percentage and grace period
- Auto late fee processing
- 1099 threshold alerts
- Notification preferences

---

## Routes Added

```javascript
// Accounting Enhancements
/accounting/:entityId/vendors-1099      → 1099 Vendor Tracking
/accounting/:entityId/batch-payments    → Batch Payment Processing
/accounting/:entityId/ar-aging          → AR Aging Report
/accounting/:entityId/settings          → Accounting Settings (enhanced)
```

---

## Sidebar Updates

Updated AccountingSidebar with new sections:

**Receivables (AR)**
- Invoices
- AR Aging Report

**Payables (AP)**
- Bills
- Batch Payments
- 1099 Vendors

**Settings**
- Accounting Settings

---

## Constants

### Payment Terms
```javascript
const PAYMENT_TERMS = {
  NET_10: { days: 10, label: 'Net 10' },
  NET_30: { days: 30, label: 'Net 30' },
  NET_60: { days: 60, label: 'Net 60' },
  '2_10_NET_30': { days: 30, discount: 2, discountDays: 10, label: '2/10 Net 30' },
  // ... more terms
};
```

### Invoice Status
```javascript
const INVOICE_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  VIEWED: 'viewed',
  PARTIAL: 'partial',
  PAID: 'paid',
  OVERDUE: 'overdue',
  VOID: 'void',
};
```

### Bill Status
```javascript
const BILL_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  SCHEDULED: 'scheduled',
  PARTIAL: 'partial',
  PAID: 'paid',
  VOID: 'void',
};
```

---

## Deployment Steps

1. **Run Database Schema**
   ```sql
   -- In Supabase SQL Editor
   -- Run docs/accounting-enhancements-schema.sql
   ```

2. **No Environment Variables Required**
   - Uses existing Supabase connection

3. **Test Navigation**
   - Go to Accounting → Select Entity
   - Click "Accounting Settings" in sidebar
   - Configure Cash/Accrual method
   - Test 1099 Vendors, Batch Payments, AR Aging

---

## Integration Points

### With Construction Module
- Bills can link to jobs/cost codes
- PO → Bill conversion tracks vendor payments
- 1099 payments from subcontractors

### With Projects Module
- Invoices can link to projects
- Project-based AR tracking

### With Contacts
- Vendors link to contacts
- Customers link to contacts

---

## Triggers

The schema includes automatic triggers:

1. **Invoice Balance Update**
   - Automatically updates balance when payments recorded
   - Sets status to 'paid' when fully paid

2. **Bill Balance Update**
   - Automatically updates balance when payments recorded
   - Creates vendor_payments record for 1099 tracking

---

## Future Enhancements (Phase 8)

### Priority 2 Features
- [ ] Plaid bank integration
- [ ] Payroll manual entry
- [ ] Project/Job costing reports
- [ ] Expense management
- [ ] Receipt capture
- [ ] Bank feed reconciliation

---

## Best Practices

1. **Set accounting method early** - Changing later affects historical reports
2. **Track W9s for 1099 vendors** - Avoid year-end scramble
3. **Review early payment opportunities** - Save on discounts
4. **Use batch payments** - Efficient check runs
5. **Configure late fees carefully** - Check state regulations

---

## Component Summary

| Component | Purpose |
|-----------|---------|
| EntityAccountingSettingsPage | Configure entity accounting preferences |
| Vendors1099Page | Track 1099 vendors and generate reports |
| BatchPaymentsPage | Process multiple bill payments at once |
| ARAgingReportPage | Detailed AR aging by customer |

---

## Phase 7 Complete ✓

Accounting Priority 1 features are now ready for integration.
