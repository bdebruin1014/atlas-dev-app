# ACCOUNTING MODULE ENHANCEMENT: TRANSACTION ENTRY SYSTEM

## Problem Statement
The accounting module lacks direct "ADD" functionality in the sidebar. Users must navigate to Bills, Invoices, or Payments pages first, then find the add button within that page. This creates friction and reduces usability.

## Solution Overview
Add a "Quick Actions" section to the AccountingSidebar with prominent buttons for:
- "+ Add Bill"
- "+ Add Invoice"  
- "+ Add Payment"
- "+ New Journal Entry"

These will trigger modals that allow immediate data entry from anywhere in the accounting module.

## Quick Implementation Summary

### Step 1: Update AccountingSidebar.jsx
Add a new section in menuSections array called "QUICK ACTIONS" that appears at the top.

### Step 2: Create TransactionEntryContext.jsx
Create a context for managing transaction entry modals globally.

### Step 3: Enhance Database Schema
Create migration for transaction tables with GL posting integration:
- bills table with line items
- invoices table with line items
- payments table
- gl_postings table for GL integration

### Step 4: Create GLPosting Service
Create `src/services/glPostingService.js` with functions to post bills, invoices, and payments to GL.

### Step 5: Enhanced QuickActionsSection Component
Create `src/components/accounting/QuickActionsSection.jsx` with four quick action buttons.

### Step 6: Transaction Modal Components
Enhance existing modals with GL account mapping and transaction posting.

## Benefits

1. **Improved UX**: Direct access to transaction entry from anywhere
2. **Reduced Friction**: No need to navigate multiple pages  
3. **GL Integration**: Automatic posting to general ledger
4. **QuickBooks Parity**: Matches QB's transaction entry flow
5. **Data Accuracy**: GL postings ensure balanced entries

## Files to Create/Modify
- src/components/accounting/AccountingSidebar.jsx (modify)
- src/components/accounting/QuickActionsSection.jsx (new)
- src/contexts/TransactionEntryContext.jsx (new)
- src/services/glPostingService.js (new)
- src/components/accounting/BillEntryModal.jsx (enhance)
- src/components/accounting/JournalEntryForm.jsx (enhance)
- src/components/accounting/PaymentForm.jsx (enhance)
- supabase/migrations/20250101000001_create_transaction_tables.sql (new)

## Status
Documentation created to address missing ADD functionality in accounting sidebar.
Ready for implementation based on this specification.
