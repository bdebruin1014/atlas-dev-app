-- ============================================
-- ACCOUNTING ENHANCEMENTS SCHEMA
-- Phase 7: Priority 1 Features
-- - Cash/Accrual accounting
-- - 1099 vendor tracking
-- - AR/AP enhancements
-- - Batch payments
-- ============================================

-- ============================================
-- ENTITY ACCOUNTING SETTINGS
-- ============================================

CREATE TABLE IF NOT EXISTS entity_accounting_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
  
  -- Accounting Method
  accounting_method TEXT DEFAULT 'accrual' CHECK (accounting_method IN ('cash', 'accrual')),
  
  -- Fiscal Year
  fiscal_year_start_month INTEGER DEFAULT 1 CHECK (fiscal_year_start_month BETWEEN 1 AND 12),
  
  -- Payment Terms
  default_payment_terms TEXT DEFAULT 'NET_30',
  
  -- Late Fee Settings
  late_fee_enabled BOOLEAN DEFAULT false,
  late_fee_percent DECIMAL(5, 2) DEFAULT 1.5,
  late_fee_grace_days INTEGER DEFAULT 15,
  auto_late_fees BOOLEAN DEFAULT false,
  
  -- 1099 Settings
  alert_1099_threshold BOOLEAN DEFAULT true,
  require_1099_tax_id BOOLEAN DEFAULT true,
  
  -- Notification Settings
  notify_bill_due BOOLEAN DEFAULT false,
  notify_invoice_overdue BOOLEAN DEFAULT false,
  notify_low_balance BOOLEAN DEFAULT false,
  low_balance_threshold DECIMAL(15, 2) DEFAULT 1000.00,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(entity_id)
);

CREATE INDEX idx_acct_settings_entity ON entity_accounting_settings(entity_id);

-- ============================================
-- ENHANCED VENDORS TABLE
-- ============================================

-- Add columns to existing vendors table or create if not exists
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id),
  
  -- Basic Info
  company_name TEXT,
  name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  
  -- Contact Reference
  contact_id UUID REFERENCES contacts(id),
  
  -- 1099 Info
  is_1099 BOOLEAN DEFAULT false,
  tax_id TEXT, -- SSN or EIN
  tax_id_type TEXT CHECK (tax_id_type IN ('ssn', 'ein')),
  w9_on_file BOOLEAN DEFAULT false,
  w9_received_date DATE,
  
  -- Payment Info
  payment_terms TEXT DEFAULT 'NET_30',
  default_expense_account_id UUID REFERENCES chart_of_accounts(id),
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vendors_entity ON vendors(entity_id);
CREATE INDEX idx_vendors_1099 ON vendors(entity_id, is_1099) WHERE is_1099 = true;

-- ============================================
-- VENDOR PAYMENTS (for 1099 tracking)
-- ============================================

CREATE TABLE IF NOT EXISTS vendor_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  entity_id UUID NOT NULL REFERENCES entities(id),
  
  amount DECIMAL(15, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method TEXT,
  check_number TEXT,
  
  -- Reference to source
  bill_id UUID REFERENCES bills(id),
  bill_payment_id UUID,
  
  memo TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vendor_payments_vendor ON vendor_payments(vendor_id);
CREATE INDEX idx_vendor_payments_date ON vendor_payments(payment_date);
CREATE INDEX idx_vendor_payments_1099 ON vendor_payments(entity_id, payment_date);

-- ============================================
-- CUSTOMERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id),
  
  -- Basic Info
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  
  -- Billing Address
  billing_address TEXT,
  billing_city TEXT,
  billing_state TEXT,
  billing_zip TEXT,
  
  -- Contact Reference
  contact_id UUID REFERENCES contacts(id),
  
  -- Payment Terms
  payment_terms TEXT DEFAULT 'NET_30',
  credit_limit DECIMAL(15, 2),
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_customers_entity ON customers(entity_id);

-- ============================================
-- INVOICES TABLE (Enhanced)
-- ============================================

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id),
  customer_id UUID REFERENCES customers(id),
  
  invoice_number TEXT NOT NULL,
  
  -- Dates
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  
  -- Amounts
  subtotal DECIMAL(15, 2) DEFAULT 0,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  total_amount DECIMAL(15, 2) DEFAULT 0,
  
  -- Late Fees
  late_fees_total DECIMAL(15, 2) DEFAULT 0,
  
  -- Balance
  amount_paid DECIMAL(15, 2) DEFAULT 0,
  balance_due DECIMAL(15, 2) DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'partial', 'paid', 'overdue', 'void')),
  
  -- Terms & Notes
  payment_terms TEXT,
  terms_text TEXT,
  notes TEXT,
  memo TEXT,
  
  -- Tracking
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  
  -- Reference
  project_id UUID REFERENCES projects(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(entity_id, invoice_number)
);

CREATE INDEX idx_invoices_entity ON invoices(entity_id);
CREATE INDEX idx_invoices_customer ON invoices(customer_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

-- ============================================
-- INVOICE LINE ITEMS
-- ============================================

CREATE TABLE IF NOT EXISTS invoice_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  
  line_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  
  quantity DECIMAL(15, 4) DEFAULT 1,
  unit_price DECIMAL(15, 4) DEFAULT 0,
  amount DECIMAL(15, 2) DEFAULT 0,
  
  account_id UUID REFERENCES chart_of_accounts(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoice_items_invoice ON invoice_line_items(invoice_id);

-- ============================================
-- INVOICE PAYMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS invoice_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  
  amount DECIMAL(15, 2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  reference_number TEXT,
  
  -- Bank deposit reference
  deposit_id UUID,
  
  memo TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invoice_payments_invoice ON invoice_payments(invoice_id);

-- ============================================
-- INVOICE LATE FEES
-- ============================================

CREATE TABLE IF NOT EXISTS invoice_late_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  
  amount DECIMAL(15, 2) NOT NULL,
  description TEXT,
  applied_date DATE NOT NULL DEFAULT CURRENT_DATE,
  
  waived BOOLEAN DEFAULT false,
  waived_by UUID REFERENCES user_profiles(id),
  waived_at TIMESTAMPTZ,
  waived_reason TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_late_fees_invoice ON invoice_late_fees(invoice_id);

-- ============================================
-- BILLS TABLE (Enhanced)
-- ============================================

CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id),
  vendor_id UUID REFERENCES vendors(id),
  
  bill_number TEXT NOT NULL,
  vendor_invoice_number TEXT,
  
  -- Dates
  bill_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  
  -- Early Payment Discount
  discount_date DATE,
  discount_amount DECIMAL(15, 2) DEFAULT 0,
  discount_percent DECIMAL(5, 2),
  
  -- Amounts
  subtotal DECIMAL(15, 2) DEFAULT 0,
  tax_amount DECIMAL(15, 2) DEFAULT 0,
  total_amount DECIMAL(15, 2) DEFAULT 0,
  
  -- Balance
  amount_paid DECIMAL(15, 2) DEFAULT 0,
  balance_due DECIMAL(15, 2) DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('draft', 'pending', 'approved', 'scheduled', 'partial', 'paid', 'void')),
  
  -- Scheduling
  scheduled_payment_date DATE,
  
  -- Approval
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMPTZ,
  
  -- Payment
  paid_date DATE,
  
  -- Terms
  payment_terms TEXT,
  memo TEXT,
  
  -- Reference
  purchase_order_id UUID REFERENCES purchase_orders(id),
  project_id UUID REFERENCES projects(id),
  job_id UUID REFERENCES construction_jobs(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(entity_id, bill_number)
);

CREATE INDEX idx_bills_entity ON bills(entity_id);
CREATE INDEX idx_bills_vendor ON bills(vendor_id);
CREATE INDEX idx_bills_status ON bills(status);
CREATE INDEX idx_bills_due_date ON bills(due_date);

-- ============================================
-- BILL LINE ITEMS
-- ============================================

CREATE TABLE IF NOT EXISTS bill_line_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  
  line_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  
  quantity DECIMAL(15, 4) DEFAULT 1,
  unit_price DECIMAL(15, 4) DEFAULT 0,
  amount DECIMAL(15, 2) DEFAULT 0,
  
  account_id UUID REFERENCES chart_of_accounts(id),
  cost_code_id UUID REFERENCES job_cost_codes(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bill_items_bill ON bill_line_items(bill_id);

-- ============================================
-- BILL PAYMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS bill_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
  
  amount DECIMAL(15, 2) NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  check_number TEXT,
  
  -- Batch reference
  batch_id UUID REFERENCES payment_batches(id),
  
  -- Bank account
  bank_account_id UUID,
  
  memo TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bill_payments_bill ON bill_payments(bill_id);

-- ============================================
-- PAYMENT BATCHES
-- ============================================

CREATE TABLE IF NOT EXISTS payment_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id),
  
  batch_date DATE NOT NULL,
  bank_account_id UUID,
  
  total_amount DECIMAL(15, 2) NOT NULL,
  bill_count INTEGER NOT NULL,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'cancelled')),
  
  processed_at TIMESTAMPTZ,
  processed_by UUID REFERENCES user_profiles(id),
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payment_batches_entity ON payment_batches(entity_id);
CREATE INDEX idx_payment_batches_status ON payment_batches(status);

-- ============================================
-- PAYMENT BATCH ITEMS
-- ============================================

CREATE TABLE IF NOT EXISTS payment_batch_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id UUID NOT NULL REFERENCES payment_batches(id) ON DELETE CASCADE,
  
  bill_id UUID NOT NULL REFERENCES bills(id),
  vendor_id UUID REFERENCES vendors(id),
  
  amount DECIMAL(15, 2) NOT NULL,
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'failed')),
  
  check_number TEXT,
  payment_id UUID REFERENCES bill_payments(id),
  
  error_message TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_batch_items_batch ON payment_batch_items(batch_id);

-- ============================================
-- CASH VS ACCRUAL REPORTING FUNCTIONS
-- ============================================

-- Income Statement - Cash Basis
CREATE OR REPLACE FUNCTION get_income_statement_cash(
  p_entity_id UUID,
  p_start_date DATE,
  p_end_date DATE
) RETURNS TABLE (
  category TEXT,
  account_name TEXT,
  account_id UUID,
  amount DECIMAL
) AS $$
BEGIN
  -- Revenue: Sum of actual payments received
  RETURN QUERY
  SELECT 
    'Revenue'::TEXT as category,
    coa.name as account_name,
    coa.id as account_id,
    COALESCE(SUM(ip.amount), 0) as amount
  FROM chart_of_accounts coa
  LEFT JOIN invoice_line_items ili ON ili.account_id = coa.id
  LEFT JOIN invoices i ON i.id = ili.invoice_id
  LEFT JOIN invoice_payments ip ON ip.invoice_id = i.id
    AND ip.payment_date BETWEEN p_start_date AND p_end_date
  WHERE coa.entity_id = p_entity_id
    AND coa.account_type = 'revenue'
  GROUP BY coa.id, coa.name
  HAVING COALESCE(SUM(ip.amount), 0) > 0
  
  UNION ALL
  
  -- Expenses: Sum of actual payments made
  SELECT 
    'Expense'::TEXT as category,
    coa.name as account_name,
    coa.id as account_id,
    COALESCE(SUM(bp.amount), 0) as amount
  FROM chart_of_accounts coa
  LEFT JOIN bill_line_items bli ON bli.account_id = coa.id
  LEFT JOIN bills b ON b.id = bli.bill_id
  LEFT JOIN bill_payments bp ON bp.bill_id = b.id
    AND bp.payment_date BETWEEN p_start_date AND p_end_date
  WHERE coa.entity_id = p_entity_id
    AND coa.account_type = 'expense'
  GROUP BY coa.id, coa.name
  HAVING COALESCE(SUM(bp.amount), 0) > 0;
END;
$$ LANGUAGE plpgsql;

-- Income Statement - Accrual Basis
CREATE OR REPLACE FUNCTION get_income_statement_accrual(
  p_entity_id UUID,
  p_start_date DATE,
  p_end_date DATE
) RETURNS TABLE (
  category TEXT,
  account_name TEXT,
  account_id UUID,
  amount DECIMAL
) AS $$
BEGIN
  -- Revenue: Sum of invoiced amounts (when earned)
  RETURN QUERY
  SELECT 
    'Revenue'::TEXT as category,
    coa.name as account_name,
    coa.id as account_id,
    COALESCE(SUM(ili.amount), 0) as amount
  FROM chart_of_accounts coa
  LEFT JOIN invoice_line_items ili ON ili.account_id = coa.id
  LEFT JOIN invoices i ON i.id = ili.invoice_id
    AND i.invoice_date BETWEEN p_start_date AND p_end_date
    AND i.status != 'void'
  WHERE coa.entity_id = p_entity_id
    AND coa.account_type = 'revenue'
  GROUP BY coa.id, coa.name
  HAVING COALESCE(SUM(ili.amount), 0) > 0
  
  UNION ALL
  
  -- Expenses: Sum of billed amounts (when incurred)
  SELECT 
    'Expense'::TEXT as category,
    coa.name as account_name,
    coa.id as account_id,
    COALESCE(SUM(bli.amount), 0) as amount
  FROM chart_of_accounts coa
  LEFT JOIN bill_line_items bli ON bli.account_id = coa.id
  LEFT JOIN bills b ON b.id = bli.bill_id
    AND b.bill_date BETWEEN p_start_date AND p_end_date
    AND b.status != 'void'
  WHERE coa.entity_id = p_entity_id
    AND coa.account_type = 'expense'
  GROUP BY coa.id, coa.name
  HAVING COALESCE(SUM(bli.amount), 0) > 0;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update invoice balance after payment
CREATE OR REPLACE FUNCTION update_invoice_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE invoices
  SET 
    amount_paid = (SELECT COALESCE(SUM(amount), 0) FROM invoice_payments WHERE invoice_id = NEW.invoice_id),
    balance_due = total_amount + late_fees_total - (SELECT COALESCE(SUM(amount), 0) FROM invoice_payments WHERE invoice_id = NEW.invoice_id),
    status = CASE 
      WHEN total_amount + late_fees_total - (SELECT COALESCE(SUM(amount), 0) FROM invoice_payments WHERE invoice_id = NEW.invoice_id) <= 0 THEN 'paid'
      WHEN (SELECT COALESCE(SUM(amount), 0) FROM invoice_payments WHERE invoice_id = NEW.invoice_id) > 0 THEN 'partial'
      ELSE status
    END,
    paid_at = CASE 
      WHEN total_amount + late_fees_total - (SELECT COALESCE(SUM(amount), 0) FROM invoice_payments WHERE invoice_id = NEW.invoice_id) <= 0 THEN NOW()
      ELSE paid_at
    END,
    updated_at = NOW()
  WHERE id = NEW.invoice_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_invoice_balance
  AFTER INSERT OR UPDATE OR DELETE ON invoice_payments
  FOR EACH ROW EXECUTE FUNCTION update_invoice_balance();

-- Update bill balance after payment
CREATE OR REPLACE FUNCTION update_bill_balance()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE bills
  SET 
    amount_paid = (SELECT COALESCE(SUM(amount), 0) FROM bill_payments WHERE bill_id = NEW.bill_id),
    balance_due = total_amount - (SELECT COALESCE(SUM(amount), 0) FROM bill_payments WHERE bill_id = NEW.bill_id),
    status = CASE 
      WHEN total_amount - (SELECT COALESCE(SUM(amount), 0) FROM bill_payments WHERE bill_id = NEW.bill_id) <= 0 THEN 'paid'
      WHEN (SELECT COALESCE(SUM(amount), 0) FROM bill_payments WHERE bill_id = NEW.bill_id) > 0 THEN 'partial'
      ELSE status
    END,
    paid_date = CASE 
      WHEN total_amount - (SELECT COALESCE(SUM(amount), 0) FROM bill_payments WHERE bill_id = NEW.bill_id) <= 0 THEN CURRENT_DATE
      ELSE paid_date
    END,
    updated_at = NOW()
  WHERE id = NEW.bill_id;
  
  -- Track payment for 1099
  IF NEW.amount > 0 THEN
    INSERT INTO vendor_payments (vendor_id, entity_id, amount, payment_date, payment_method, check_number, bill_id, bill_payment_id)
    SELECT b.vendor_id, b.entity_id, NEW.amount, NEW.payment_date, NEW.payment_method, NEW.check_number, NEW.bill_id, NEW.id
    FROM bills b
    WHERE b.id = NEW.bill_id AND b.vendor_id IS NOT NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_bill_balance
  AFTER INSERT OR UPDATE ON bill_payments
  FOR EACH ROW EXECUTE FUNCTION update_bill_balance();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE entity_accounting_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_batches ENABLE ROW LEVEL SECURITY;

-- Basic policies (adjust based on permission system)
CREATE POLICY "Users can view accounting settings" ON entity_accounting_settings FOR SELECT USING (true);
CREATE POLICY "Users can manage accounting settings" ON entity_accounting_settings FOR ALL USING (true);

CREATE POLICY "Users can view vendors" ON vendors FOR SELECT USING (true);
CREATE POLICY "Users can manage vendors" ON vendors FOR ALL USING (true);

CREATE POLICY "Users can view customers" ON customers FOR SELECT USING (true);
CREATE POLICY "Users can manage customers" ON customers FOR ALL USING (true);

CREATE POLICY "Users can view invoices" ON invoices FOR SELECT USING (true);
CREATE POLICY "Users can manage invoices" ON invoices FOR ALL USING (true);

CREATE POLICY "Users can view bills" ON bills FOR SELECT USING (true);
CREATE POLICY "Users can manage bills" ON bills FOR ALL USING (true);
