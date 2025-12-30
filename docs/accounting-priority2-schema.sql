-- ============================================
-- ACCOUNTING PRIORITY 2 SCHEMA
-- Phase 8: Plaid, Payroll, Expenses
-- ============================================

-- ============================================
-- PLAID INTEGRATION TABLES
-- ============================================

-- Link tokens for Plaid Link
CREATE TABLE IF NOT EXISTS plaid_link_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id),
  user_id UUID NOT NULL REFERENCES user_profiles(id),
  token TEXT NOT NULL,
  expiration TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plaid connections (institutions)
CREATE TABLE IF NOT EXISTS plaid_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id),
  
  institution_id TEXT,
  institution_name TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'connected', 'error', 'disconnected', 'requires_reauth')),
  error_code TEXT,
  error_message TEXT,
  
  -- Metadata
  accounts JSONB,
  
  -- Timestamps
  last_sync TIMESTAMPTZ,
  last_refresh TIMESTAMPTZ,
  disconnected_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_plaid_connections_entity ON plaid_connections(entity_id);
CREATE INDEX idx_plaid_connections_status ON plaid_connections(status);

-- Bank accounts (linked to Plaid or manual)
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id),
  
  -- Plaid link (optional)
  plaid_connection_id UUID REFERENCES plaid_connections(id),
  plaid_account_id TEXT,
  
  -- Account info
  name TEXT NOT NULL,
  official_name TEXT,
  type TEXT, -- checking, savings, credit, etc.
  subtype TEXT,
  mask TEXT, -- Last 4 digits
  
  -- Balances
  current_balance DECIMAL(15, 2) DEFAULT 0,
  available_balance DECIMAL(15, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  balance_updated_at TIMESTAMPTZ,
  
  -- GL Account link
  gl_account_id UUID REFERENCES chart_of_accounts(id),
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'closed')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bank_accounts_entity ON bank_accounts(entity_id);
CREATE INDEX idx_bank_accounts_plaid ON bank_accounts(plaid_connection_id);

-- Bank transactions from feed
CREATE TABLE IF NOT EXISTS bank_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_account_id UUID NOT NULL REFERENCES bank_accounts(id),
  
  -- Plaid transaction ID
  plaid_transaction_id TEXT,
  
  -- Transaction details
  date DATE NOT NULL,
  name TEXT,
  merchant_name TEXT,
  description TEXT,
  amount DECIMAL(15, 2) NOT NULL,
  
  -- Categorization
  category TEXT[],
  category_id TEXT,
  
  -- Status
  status TEXT DEFAULT 'posted' CHECK (status IN ('pending', 'posted', 'cancelled')),
  
  -- Matching
  match_status TEXT DEFAULT 'unmatched' CHECK (match_status IN ('unmatched', 'matched', 'excluded', 'manually_added')),
  matched_bill_id UUID REFERENCES bills(id),
  matched_invoice_id UUID REFERENCES invoices(id),
  matched_account_id UUID REFERENCES chart_of_accounts(id),
  matched_vendor_id UUID REFERENCES vendors(id),
  matched_by_rule_id UUID,
  matched_at TIMESTAMPTZ,
  
  exclude_reason TEXT,
  memo TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(bank_account_id, plaid_transaction_id)
);

CREATE INDEX idx_bank_txn_account ON bank_transactions(bank_account_id);
CREATE INDEX idx_bank_txn_date ON bank_transactions(date);
CREATE INDEX idx_bank_txn_match ON bank_transactions(match_status);

-- Auto-matching rules
CREATE TABLE IF NOT EXISTS bank_matching_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id),
  
  name TEXT NOT NULL,
  priority INTEGER DEFAULT 100,
  
  -- Matching criteria
  description_contains TEXT,
  min_amount DECIMAL(15, 2),
  max_amount DECIMAL(15, 2),
  transaction_type TEXT CHECK (transaction_type IN ('debit', 'credit', 'any')),
  
  -- Action
  account_id UUID REFERENCES chart_of_accounts(id),
  vendor_id UUID REFERENCES vendors(id),
  
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_matching_rules_entity ON bank_matching_rules(entity_id);

-- ============================================
-- PAYROLL TABLES
-- ============================================

-- Employees
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id),
  
  -- Contact link
  contact_id UUID REFERENCES contacts(id),
  
  -- Basic info
  employee_id TEXT, -- Internal employee number
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  
  -- Address
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  
  -- Tax info
  ssn TEXT, -- Encrypted
  
  -- Employment
  hire_date DATE,
  termination_date DATE,
  termination_reason TEXT,
  department TEXT,
  job_title TEXT,
  
  -- Pay info
  pay_type TEXT DEFAULT 'salary' CHECK (pay_type IN ('salary', 'hourly', 'commission')),
  pay_frequency TEXT DEFAULT 'biweekly' CHECK (pay_frequency IN ('weekly', 'biweekly', 'semimonthly', 'monthly')),
  salary_amount DECIMAL(15, 2),
  hourly_rate DECIMAL(10, 4),
  
  -- Tax withholding
  federal_filing_status TEXT,
  federal_allowances INTEGER DEFAULT 0,
  state_filing_status TEXT,
  state_allowances INTEGER DEFAULT 0,
  additional_withholding DECIMAL(10, 2) DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'terminated', 'on_leave')),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_employees_entity ON employees(entity_id);
CREATE INDEX idx_employees_status ON employees(status);

-- Payroll runs
CREATE TABLE IF NOT EXISTS payrolls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id),
  
  payroll_number TEXT NOT NULL,
  
  -- Pay period
  pay_period_start DATE NOT NULL,
  pay_period_end DATE NOT NULL,
  pay_date DATE NOT NULL,
  pay_frequency TEXT,
  
  -- Totals
  total_gross DECIMAL(15, 2) DEFAULT 0,
  total_deductions DECIMAL(15, 2) DEFAULT 0,
  total_net DECIMAL(15, 2) DEFAULT 0,
  total_employer_taxes DECIMAL(15, 2) DEFAULT 0,
  total_cost DECIMAL(15, 2) DEFAULT 0, -- Gross + employer taxes
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'paid', 'void')),
  
  -- Approval
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMPTZ,
  
  -- Processing
  processed_at TIMESTAMPTZ,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(entity_id, payroll_number)
);

CREATE INDEX idx_payrolls_entity ON payrolls(entity_id);
CREATE INDEX idx_payrolls_date ON payrolls(pay_date);
CREATE INDEX idx_payrolls_status ON payrolls(status);

-- Payroll line items (employee pay stubs)
CREATE TABLE IF NOT EXISTS payroll_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_id UUID NOT NULL REFERENCES payrolls(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(id),
  
  -- Hours (for hourly employees)
  regular_hours DECIMAL(10, 2) DEFAULT 0,
  overtime_hours DECIMAL(10, 2) DEFAULT 0,
  
  -- Earnings
  regular_pay DECIMAL(15, 2) DEFAULT 0,
  overtime_pay DECIMAL(15, 2) DEFAULT 0,
  bonus DECIMAL(15, 2) DEFAULT 0,
  commission DECIMAL(15, 2) DEFAULT 0,
  other_earnings DECIMAL(15, 2) DEFAULT 0,
  gross_pay DECIMAL(15, 2) DEFAULT 0,
  
  -- Employee taxes
  federal_withholding DECIMAL(15, 2) DEFAULT 0,
  state_withholding DECIMAL(15, 2) DEFAULT 0,
  local_withholding DECIMAL(15, 2) DEFAULT 0,
  social_security DECIMAL(15, 2) DEFAULT 0,
  medicare DECIMAL(15, 2) DEFAULT 0,
  
  -- Other deductions
  retirement_401k DECIMAL(15, 2) DEFAULT 0,
  health_insurance DECIMAL(15, 2) DEFAULT 0,
  other_deductions DECIMAL(15, 2) DEFAULT 0,
  
  total_deductions DECIMAL(15, 2) DEFAULT 0,
  net_pay DECIMAL(15, 2) DEFAULT 0,
  
  -- Employer taxes
  employer_social_security DECIMAL(15, 2) DEFAULT 0,
  employer_medicare DECIMAL(15, 2) DEFAULT 0,
  futa DECIMAL(15, 2) DEFAULT 0,
  suta DECIMAL(15, 2) DEFAULT 0,
  employer_taxes DECIMAL(15, 2) DEFAULT 0,
  
  -- Payment
  payment_method TEXT DEFAULT 'check',
  check_number TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_payroll_items_payroll ON payroll_items(payroll_id);
CREATE INDEX idx_payroll_items_employee ON payroll_items(employee_id);

-- Mileage rates
CREATE TABLE IF NOT EXISTS mileage_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id),
  
  rate_per_mile DECIMAL(10, 4) NOT NULL,
  effective_date DATE NOT NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mileage_rates_entity ON mileage_rates(entity_id, effective_date);

-- ============================================
-- EXPENSE MANAGEMENT TABLES
-- ============================================

-- Expense categories
CREATE TABLE IF NOT EXISTS expense_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id),
  
  name TEXT NOT NULL,
  description TEXT,
  expense_type TEXT DEFAULT 'other' CHECK (expense_type IN (
    'mileage', 'meals', 'travel', 'supplies', 'equipment', 
    'professional', 'utilities', 'marketing', 'insurance', 'other'
  )),
  
  -- GL Account mapping
  account_id UUID REFERENCES chart_of_accounts(id),
  
  -- Settings
  requires_receipt BOOLEAN DEFAULT true,
  max_amount DECIMAL(15, 2),
  
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_expense_categories_entity ON expense_categories(entity_id);

-- Expenses
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id),
  
  expense_number TEXT NOT NULL,
  
  -- Who submitted
  submitter_id UUID REFERENCES user_profiles(id),
  
  -- Details
  expense_date DATE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  
  -- Categorization
  category_id UUID REFERENCES expense_categories(id),
  
  -- Payment
  payment_method TEXT DEFAULT 'personal_card' CHECK (payment_method IN (
    'company_card', 'personal_card', 'cash', 'check', 'ach'
  )),
  is_reimbursable BOOLEAN DEFAULT true,
  
  -- Project/Job assignment
  project_id UUID REFERENCES projects(id),
  job_id UUID REFERENCES construction_jobs(id),
  cost_code_id UUID REFERENCES job_cost_codes(id),
  vendor_id UUID REFERENCES vendors(id),
  
  -- Mileage specific
  mileage_miles DECIMAL(10, 2),
  mileage_rate DECIMAL(10, 4),
  mileage_from TEXT,
  mileage_to TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'submitted', 'approved', 'rejected', 'reimbursed', 'void'
  )),
  
  -- Workflow
  submitted_at TIMESTAMPTZ,
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMPTZ,
  approval_notes TEXT,
  rejection_reason TEXT,
  
  -- Reimbursement
  reimbursed_at TIMESTAMPTZ,
  reimbursement_method TEXT,
  reimbursement_reference TEXT,
  
  -- Report grouping
  expense_report_id UUID,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(entity_id, expense_number)
);

CREATE INDEX idx_expenses_entity ON expenses(entity_id);
CREATE INDEX idx_expenses_submitter ON expenses(submitter_id);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_project ON expenses(project_id);
CREATE INDEX idx_expenses_job ON expenses(job_id);

-- Expense receipts
CREATE TABLE IF NOT EXISTS expense_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id UUID NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
  
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_expense_receipts_expense ON expense_receipts(expense_id);

-- Expense reports (grouped expenses)
CREATE TABLE IF NOT EXISTS expense_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES entities(id),
  
  report_number TEXT NOT NULL,
  title TEXT,
  
  submitter_id UUID REFERENCES user_profiles(id),
  
  total_amount DECIMAL(15, 2) DEFAULT 0,
  expense_count INTEGER DEFAULT 0,
  
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'reimbursed')),
  
  submitted_at TIMESTAMPTZ,
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(entity_id, report_number)
);

CREATE INDEX idx_expense_reports_entity ON expense_reports(entity_id);

-- Expense report items (linking expenses to reports)
CREATE TABLE IF NOT EXISTS expense_report_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES expense_reports(id) ON DELETE CASCADE,
  expense_id UUID NOT NULL REFERENCES expenses(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(report_id, expense_id)
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE plaid_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE payrolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;

-- Basic policies
CREATE POLICY "Users can view plaid connections" ON plaid_connections FOR SELECT USING (true);
CREATE POLICY "Users can manage plaid connections" ON plaid_connections FOR ALL USING (true);

CREATE POLICY "Users can view bank accounts" ON bank_accounts FOR SELECT USING (true);
CREATE POLICY "Users can manage bank accounts" ON bank_accounts FOR ALL USING (true);

CREATE POLICY "Users can view bank transactions" ON bank_transactions FOR SELECT USING (true);
CREATE POLICY "Users can manage bank transactions" ON bank_transactions FOR ALL USING (true);

CREATE POLICY "Users can view employees" ON employees FOR SELECT USING (true);
CREATE POLICY "Users can manage employees" ON employees FOR ALL USING (true);

CREATE POLICY "Users can view payrolls" ON payrolls FOR SELECT USING (true);
CREATE POLICY "Users can manage payrolls" ON payrolls FOR ALL USING (true);

CREATE POLICY "Users can view expenses" ON expenses FOR SELECT USING (true);
CREATE POLICY "Users can manage expenses" ON expenses FOR ALL USING (true);

CREATE POLICY "Users can view expense categories" ON expense_categories FOR SELECT USING (true);
CREATE POLICY "Users can manage expense categories" ON expense_categories FOR ALL USING (true);

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert default expense categories function
CREATE OR REPLACE FUNCTION create_default_expense_categories(p_entity_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO expense_categories (entity_id, name, expense_type, requires_receipt) VALUES
    (p_entity_id, 'Mileage', 'mileage', false),
    (p_entity_id, 'Meals & Entertainment', 'meals', true),
    (p_entity_id, 'Travel - Airfare', 'travel', true),
    (p_entity_id, 'Travel - Lodging', 'travel', true),
    (p_entity_id, 'Travel - Ground Transportation', 'travel', true),
    (p_entity_id, 'Office Supplies', 'supplies', true),
    (p_entity_id, 'Equipment', 'equipment', true),
    (p_entity_id, 'Professional Services', 'professional', true),
    (p_entity_id, 'Software & Subscriptions', 'other', true),
    (p_entity_id, 'Marketing & Advertising', 'marketing', true),
    (p_entity_id, 'Insurance', 'insurance', true),
    (p_entity_id, 'Utilities', 'utilities', true),
    (p_entity_id, 'Other', 'other', true)
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;
