-- =============================================================================
-- ATLASDEV MULTI-ENTITY ACCOUNTING MODULE
-- Family Office Style Asset & Ownership Tracking
-- =============================================================================

-- =============================================================================
-- SECTION 1: OWNERSHIP HIERARCHY & STRUCTURE
-- =============================================================================

-- Ultimate beneficial owners (individuals, trusts, etc.)
CREATE TABLE IF NOT EXISTS beneficial_owners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_type TEXT NOT NULL CHECK (owner_type IN ('individual', 'trust', 'estate', 'foundation', 'external_entity')),
    -- For individuals
    first_name TEXT,
    last_name TEXT,
    -- For trusts/entities
    entity_name TEXT,
    -- Common fields
    display_name TEXT NOT NULL,
    tax_id_last4 TEXT,
    tax_classification TEXT, -- individual, trust, s_corp, c_corp, partnership, disregarded
    date_of_birth DATE,
    -- Contact
    email TEXT,
    phone TEXT,
    address_line1 TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    -- Status
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ownership interests - who owns what percentage of which entity
CREATE TABLE IF NOT EXISTS ownership_interests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- The entity being owned
    owned_entity_id UUID REFERENCES entities(id),
    -- The owner (can be another entity, beneficial owner, or investor)
    owner_type TEXT NOT NULL CHECK (owner_type IN ('entity', 'beneficial_owner', 'investor', 'external')),
    owner_entity_id UUID REFERENCES entities(id),
    owner_beneficial_id UUID REFERENCES beneficial_owners(id),
    owner_investor_id UUID REFERENCES investors(id),
    owner_external_name TEXT, -- For external entities we don't track
    -- Ownership details
    ownership_class TEXT DEFAULT 'common', -- common, preferred_a, preferred_b, etc.
    ownership_percent DECIMAL(10,6) NOT NULL,
    voting_percent DECIMAL(10,6),
    -- Dates
    effective_date DATE NOT NULL,
    termination_date DATE,
    -- Capital account tracking
    initial_contribution DECIMAL(15,2) DEFAULT 0,
    current_capital_balance DECIMAL(15,2) DEFAULT 0,
    -- Flags
    is_managing_member BOOLEAN DEFAULT false,
    is_gp BOOLEAN DEFAULT false,
    receives_k1 BOOLEAN DEFAULT true,
    -- Status
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    -- Ensure only one owner type is set
    CONSTRAINT chk_owner_type CHECK (
        (owner_type = 'entity' AND owner_entity_id IS NOT NULL) OR
        (owner_type = 'beneficial_owner' AND owner_beneficial_id IS NOT NULL) OR
        (owner_type = 'investor' AND owner_investor_id IS NOT NULL) OR
        (owner_type = 'external' AND owner_external_name IS NOT NULL)
    )
);

-- Ownership hierarchy view (materialized for performance)
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_ownership_chain AS
WITH RECURSIVE ownership_chain AS (
    -- Base case: direct ownership by beneficial owners
    SELECT 
        oi.owned_entity_id as entity_id,
        e.name as entity_name,
        oi.owner_beneficial_id as ultimate_owner_id,
        bo.display_name as ultimate_owner_name,
        'beneficial_owner' as ultimate_owner_type,
        oi.ownership_percent as direct_percent,
        oi.ownership_percent as effective_percent,
        1 as depth,
        ARRAY[e.id] as path
    FROM ownership_interests oi
    JOIN entities e ON e.id = oi.owned_entity_id
    JOIN beneficial_owners bo ON bo.id = oi.owner_beneficial_id
    WHERE oi.owner_type = 'beneficial_owner'
    AND oi.is_active = true
    
    UNION ALL
    
    -- Recursive case: ownership through other entities
    SELECT 
        oi.owned_entity_id,
        e.name,
        oc.ultimate_owner_id,
        oc.ultimate_owner_name,
        oc.ultimate_owner_type,
        oi.ownership_percent,
        (oi.ownership_percent * oc.effective_percent / 100)::DECIMAL(10,6),
        oc.depth + 1,
        oc.path || e.id
    FROM ownership_interests oi
    JOIN entities e ON e.id = oi.owned_entity_id
    JOIN ownership_chain oc ON oc.entity_id = oi.owner_entity_id
    WHERE oi.owner_type = 'entity'
    AND oi.is_active = true
    AND NOT (e.id = ANY(oc.path)) -- Prevent cycles
    AND oc.depth < 10 -- Safety limit
)
SELECT * FROM ownership_chain;

-- =============================================================================
-- SECTION 2: CHART OF ACCOUNTS & GENERAL LEDGER
-- =============================================================================

-- Standard chart of accounts template
CREATE TABLE IF NOT EXISTS account_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_code TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_type TEXT NOT NULL CHECK (account_type IN (
        'asset', 'liability', 'equity', 'revenue', 'expense', 'contra_asset', 'contra_liability', 'contra_equity'
    )),
    account_subtype TEXT, -- cash, receivable, fixed_asset, payable, loan, capital, retained_earnings, etc.
    normal_balance TEXT NOT NULL CHECK (normal_balance IN ('debit', 'credit')),
    is_header BOOLEAN DEFAULT false, -- For grouping
    parent_code TEXT,
    display_order INTEGER,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Entity-specific chart of accounts
CREATE TABLE IF NOT EXISTS entity_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES entities(id),
    account_code TEXT NOT NULL,
    account_name TEXT NOT NULL,
    account_type TEXT NOT NULL CHECK (account_type IN (
        'asset', 'liability', 'equity', 'revenue', 'expense', 'contra_asset', 'contra_liability', 'contra_equity'
    )),
    account_subtype TEXT,
    normal_balance TEXT NOT NULL CHECK (normal_balance IN ('debit', 'credit')),
    parent_account_id UUID REFERENCES entity_accounts(id),
    -- Linking to related records
    related_entity_id UUID REFERENCES entities(id), -- For intercompany accounts
    related_project_id UUID REFERENCES projects(id), -- For project-specific accounts
    related_asset_id UUID REFERENCES assets(id), -- For asset-specific accounts
    related_investor_id UUID REFERENCES investors(id), -- For investor capital accounts
    -- Balances (denormalized for performance)
    current_balance DECIMAL(15,2) DEFAULT 0,
    ytd_activity DECIMAL(15,2) DEFAULT 0,
    -- Settings
    is_bank_account BOOLEAN DEFAULT false,
    bank_account_last4 TEXT,
    is_header BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(entity_id, account_code)
);

-- Journal entries (header)
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES entities(id),
    entry_number TEXT,
    entry_date DATE NOT NULL,
    entry_type TEXT NOT NULL CHECK (entry_type IN (
        'standard', 'adjusting', 'closing', 'reversing', 'intercompany', 
        'capital_contribution', 'distribution', 'allocation', 'depreciation',
        'project_cost', 'asset_income', 'asset_expense'
    )),
    reference_type TEXT, -- invoice, bill, transfer, draw, etc.
    reference_id UUID,
    reference_number TEXT,
    memo TEXT,
    total_debits DECIMAL(15,2) NOT NULL DEFAULT 0,
    total_credits DECIMAL(15,2) NOT NULL DEFAULT 0,
    -- Related records
    project_id UUID REFERENCES projects(id),
    asset_id UUID REFERENCES assets(id),
    related_entity_id UUID REFERENCES entities(id), -- For intercompany
    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'posted', 'void')),
    posted_at TIMESTAMPTZ,
    posted_by_id UUID,
    voided_at TIMESTAMPTZ,
    voided_by_id UUID,
    void_reason TEXT,
    -- Audit
    created_by_id UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Journal entry lines (detail)
CREATE TABLE IF NOT EXISTS journal_entry_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    journal_entry_id UUID NOT NULL REFERENCES journal_entries(id) ON DELETE CASCADE,
    line_number INTEGER NOT NULL,
    account_id UUID NOT NULL REFERENCES entity_accounts(id),
    description TEXT,
    debit_amount DECIMAL(15,2) DEFAULT 0,
    credit_amount DECIMAL(15,2) DEFAULT 0,
    -- Additional dimensions
    project_id UUID REFERENCES projects(id),
    asset_id UUID REFERENCES assets(id),
    budget_category_id UUID REFERENCES project_budget_categories(id),
    vendor_id UUID REFERENCES contacts(id),
    -- For intercompany
    intercompany_entity_id UUID REFERENCES entities(id),
    intercompany_line_id UUID REFERENCES journal_entry_lines(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT chk_debit_or_credit CHECK (
        (debit_amount > 0 AND credit_amount = 0) OR
        (credit_amount > 0 AND debit_amount = 0) OR
        (debit_amount = 0 AND credit_amount = 0)
    )
);

-- =============================================================================
-- SECTION 3: CAPITAL ACCOUNTS & TRANSACTIONS
-- =============================================================================

-- Capital accounts for each owner in each entity
CREATE TABLE IF NOT EXISTS capital_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES entities(id),
    ownership_interest_id UUID NOT NULL REFERENCES ownership_interests(id),
    -- Owner info (denormalized for convenience)
    owner_display_name TEXT NOT NULL,
    -- Balances
    beginning_balance DECIMAL(15,2) DEFAULT 0,
    contributions DECIMAL(15,2) DEFAULT 0,
    distributions DECIMAL(15,2) DEFAULT 0,
    allocated_income DECIMAL(15,2) DEFAULT 0,
    allocated_expense DECIMAL(15,2) DEFAULT 0,
    allocated_gains DECIMAL(15,2) DEFAULT 0,
    allocated_losses DECIMAL(15,2) DEFAULT 0,
    other_adjustments DECIMAL(15,2) DEFAULT 0,
    ending_balance DECIMAL(15,2) DEFAULT 0,
    -- Period
    period_year INTEGER NOT NULL,
    period_month INTEGER, -- NULL for annual
    -- Tax basis tracking
    tax_basis_beginning DECIMAL(15,2) DEFAULT 0,
    tax_basis_ending DECIMAL(15,2) DEFAULT 0,
    at_risk_amount DECIMAL(15,2) DEFAULT 0,
    -- Status
    is_current BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(entity_id, ownership_interest_id, period_year, period_month)
);

-- Capital transactions
CREATE TABLE IF NOT EXISTS capital_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES entities(id),
    capital_account_id UUID NOT NULL REFERENCES capital_accounts(id),
    ownership_interest_id UUID NOT NULL REFERENCES ownership_interests(id),
    transaction_date DATE NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN (
        'initial_contribution', 'additional_contribution', 'return_of_capital',
        'operating_distribution', 'liquidating_distribution', 'guaranteed_payment',
        'income_allocation', 'expense_allocation', 'gain_allocation', 'loss_allocation',
        'section_754_adjustment', 'special_allocation', 'redemption', 'transfer'
    )),
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    -- Source
    source_type TEXT, -- project, asset, entity_operations, investment
    source_project_id UUID REFERENCES projects(id),
    source_asset_id UUID REFERENCES assets(id),
    -- Linked journal entry
    journal_entry_id UUID REFERENCES journal_entries(id),
    -- For transfers
    transfer_to_interest_id UUID REFERENCES ownership_interests(id),
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'posted', 'void')),
    created_by_id UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- SECTION 4: INVESTMENT TRACKING (Passive Investments)
-- =============================================================================

-- Investments in external entities (where we're just an LP)
CREATE TABLE IF NOT EXISTS investment_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investor_entity_id UUID NOT NULL REFERENCES entities(id), -- Our entity making the investment
    investment_name TEXT NOT NULL,
    investment_type TEXT NOT NULL CHECK (investment_type IN (
        'lp_interest', 'llc_membership', 'stock', 'bond', 'real_estate_fund',
        'private_equity', 'hedge_fund', 'reit', 'direct_real_estate', 'other'
    )),
    -- External investment details
    fund_name TEXT,
    sponsor_name TEXT,
    investment_vehicle TEXT, -- Fund I, Fund II, etc.
    -- Our position
    commitment_amount DECIMAL(15,2),
    called_amount DECIMAL(15,2) DEFAULT 0,
    unfunded_commitment DECIMAL(15,2) GENERATED ALWAYS AS (commitment_amount - called_amount) STORED,
    distributions_received DECIMAL(15,2) DEFAULT 0,
    current_nav DECIMAL(15,2) DEFAULT 0,
    last_nav_date DATE,
    ownership_percent DECIMAL(10,6),
    -- Performance
    irr DECIMAL(8,4),
    equity_multiple DECIMAL(8,4),
    dpi DECIMAL(8,4), -- Distributions to Paid-In
    tvpi DECIMAL(8,4), -- Total Value to Paid-In
    -- Accounting
    cost_basis DECIMAL(15,2) DEFAULT 0,
    unrealized_gain_loss DECIMAL(15,2) DEFAULT 0,
    gl_account_id UUID REFERENCES entity_accounts(id),
    -- Dates
    investment_date DATE,
    maturity_date DATE,
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('committed', 'active', 'harvesting', 'liquidated', 'written_off')),
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Investment transactions
CREATE TABLE IF NOT EXISTS investment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investment_position_id UUID NOT NULL REFERENCES investment_positions(id),
    transaction_date DATE NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN (
        'capital_call', 'distribution', 'nav_update', 'fee', 'expense',
        'return_of_capital', 'dividend', 'interest', 'sale', 'write_off'
    )),
    amount DECIMAL(15,2) NOT NULL,
    description TEXT,
    -- For capital calls
    call_number INTEGER,
    call_due_date DATE,
    -- For distributions
    distribution_type TEXT, -- operating, refinance, sale, return_of_capital
    -- Linked journal entry
    journal_entry_id UUID REFERENCES journal_entries(id),
    -- Documents
    document_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- K-1 records received from investments
CREATE TABLE IF NOT EXISTS k1_received (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    investor_entity_id UUID NOT NULL REFERENCES entities(id), -- Our entity receiving K-1
    investment_position_id UUID REFERENCES investment_positions(id), -- If tracked
    -- K-1 source
    partnership_name TEXT NOT NULL,
    partnership_ein TEXT,
    tax_year INTEGER NOT NULL,
    -- Schedule K-1 amounts
    ordinary_income DECIMAL(15,2) DEFAULT 0,
    net_rental_income DECIMAL(15,2) DEFAULT 0,
    other_net_rental_income DECIMAL(15,2) DEFAULT 0,
    guaranteed_payments DECIMAL(15,2) DEFAULT 0,
    interest_income DECIMAL(15,2) DEFAULT 0,
    dividend_income DECIMAL(15,2) DEFAULT 0,
    royalties DECIMAL(15,2) DEFAULT 0,
    net_short_term_capital_gain DECIMAL(15,2) DEFAULT 0,
    net_long_term_capital_gain DECIMAL(15,2) DEFAULT 0,
    unrecaptured_1250_gain DECIMAL(15,2) DEFAULT 0,
    net_1231_gain DECIMAL(15,2) DEFAULT 0,
    other_income DECIMAL(15,2) DEFAULT 0,
    -- Deductions
    section_179_deduction DECIMAL(15,2) DEFAULT 0,
    other_deductions DECIMAL(15,2) DEFAULT 0,
    -- Self-employment
    self_employment_earnings DECIMAL(15,2) DEFAULT 0,
    -- Credits
    low_income_housing_credit DECIMAL(15,2) DEFAULT 0,
    other_credits DECIMAL(15,2) DEFAULT 0,
    -- Other
    foreign_taxes_paid DECIMAL(15,2) DEFAULT 0,
    alternative_minimum_tax_items DECIMAL(15,2) DEFAULT 0,
    tax_exempt_income DECIMAL(15,2) DEFAULT 0,
    nondeductible_expenses DECIMAL(15,2) DEFAULT 0,
    distributions DECIMAL(15,2) DEFAULT 0,
    -- Capital account
    beginning_capital DECIMAL(15,2) DEFAULT 0,
    capital_contributed DECIMAL(15,2) DEFAULT 0,
    current_year_increase_decrease DECIMAL(15,2) DEFAULT 0,
    withdrawals_distributions DECIMAL(15,2) DEFAULT 0,
    ending_capital DECIMAL(15,2) DEFAULT 0,
    -- Tracking
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'reviewed', 'final', 'amended')),
    received_date DATE,
    document_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================================================
-- SECTION 5: PROJECT & ASSET ACCOUNTING
-- =============================================================================

-- Project transactions (costs, revenues)
CREATE TABLE IF NOT EXISTS project_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id),
    entity_id UUID NOT NULL REFERENCES entities(id),
    transaction_date DATE NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN (
        'cost', 'revenue', 'draw', 'equity_contribution', 'loan_advance',
        'interest_expense', 'fee', 'reimbursement', 'transfer'
    )),
    budget_category_id UUID REFERENCES project_budget_categories(id),
    vendor_id UUID REFERENCES contacts(id),
    description TEXT NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    -- Invoice/payment details
    invoice_number TEXT,
    invoice_date DATE,
    due_date DATE,
    paid_date DATE,
    payment_method TEXT,
    check_number TEXT,
    -- Approval workflow
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'paid', 'void')),
    approved_by_id UUID,
    approved_at TIMESTAMPTZ,
    -- Journal entry link
    journal_entry_id UUID REFERENCES journal_entries(id),
    -- Documents
    document_urls TEXT[],
    notes TEXT,
    created_by_id UUID,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Asset income statements (monthly)
CREATE TABLE IF NOT EXISTS asset_income_statements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES assets(id),
    entity_id UUID NOT NULL REFERENCES entities(id),
    period_year INTEGER NOT NULL,
    period_month INTEGER NOT NULL,
    -- Revenue
    gross_potential_rent DECIMAL(15,2) DEFAULT 0,
    vacancy_loss DECIMAL(15,2) DEFAULT 0,
    concessions DECIMAL(15,2) DEFAULT 0,
    bad_debt DECIMAL(15,2) DEFAULT 0,
    net_rental_income DECIMAL(15,2) DEFAULT 0,
    utility_reimbursement DECIMAL(15,2) DEFAULT 0,
    parking_income DECIMAL(15,2) DEFAULT 0,
    laundry_income DECIMAL(15,2) DEFAULT 0,
    pet_fees DECIMAL(15,2) DEFAULT 0,
    late_fees DECIMAL(15,2) DEFAULT 0,
    other_income DECIMAL(15,2) DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    -- Expenses
    payroll DECIMAL(15,2) DEFAULT 0,
    repairs_maintenance DECIMAL(15,2) DEFAULT 0,
    contract_services DECIMAL(15,2) DEFAULT 0,
    utilities DECIMAL(15,2) DEFAULT 0,
    insurance DECIMAL(15,2) DEFAULT 0,
    property_taxes DECIMAL(15,2) DEFAULT 0,
    management_fee DECIMAL(15,2) DEFAULT 0,
    marketing DECIMAL(15,2) DEFAULT 0,
    administrative DECIMAL(15,2) DEFAULT 0,
    professional_fees DECIMAL(15,2) DEFAULT 0,
    other_expenses DECIMAL(15,2) DEFAULT 0,
    total_expenses DECIMAL(15,2) DEFAULT 0,
    -- NOI
    net_operating_income DECIMAL(15,2) DEFAULT 0,
    -- Below the line
    capital_expenditures DECIMAL(15,2) DEFAULT 0,
    debt_service DECIMAL(15,2) DEFAULT 0,
    cash_flow DECIMAL(15,2) DEFAULT 0,
    -- Import tracking
    source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'import', 'api')),
    imported_at TIMESTAMPTZ,
    imported_file TEXT,
    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'reviewed', 'final')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(asset_id, period_year, period_month)
);

-- =============================================================================
-- SECTION 6: CONSOLIDATED REPORTING
-- =============================================================================

-- Entity financial snapshots (for reporting)
CREATE TABLE IF NOT EXISTS entity_financial_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID NOT NULL REFERENCES entities(id),
    snapshot_date DATE NOT NULL,
    snapshot_type TEXT NOT NULL CHECK (snapshot_type IN ('monthly', 'quarterly', 'annual', 'adhoc')),
    -- Balance Sheet
    total_assets DECIMAL(15,2) DEFAULT 0,
    cash_and_equivalents DECIMAL(15,2) DEFAULT 0,
    accounts_receivable DECIMAL(15,2) DEFAULT 0,
    projects_in_development DECIMAL(15,2) DEFAULT 0,
    real_estate_held DECIMAL(15,2) DEFAULT 0,
    investments DECIMAL(15,2) DEFAULT 0,
    other_assets DECIMAL(15,2) DEFAULT 0,
    total_liabilities DECIMAL(15,2) DEFAULT 0,
    accounts_payable DECIMAL(15,2) DEFAULT 0,
    construction_loans DECIMAL(15,2) DEFAULT 0,
    permanent_loans DECIMAL(15,2) DEFAULT 0,
    other_liabilities DECIMAL(15,2) DEFAULT 0,
    total_equity DECIMAL(15,2) DEFAULT 0,
    -- Income Statement YTD
    ytd_revenue DECIMAL(15,2) DEFAULT 0,
    ytd_expenses DECIMAL(15,2) DEFAULT 0,
    ytd_noi DECIMAL(15,2) DEFAULT 0,
    ytd_net_income DECIMAL(15,2) DEFAULT 0,
    -- Ownership value
    nav_per_unit DECIMAL(15,4),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Consolidated net worth view
CREATE OR REPLACE VIEW v_consolidated_net_worth AS
SELECT 
    bo.id as beneficial_owner_id,
    bo.display_name,
    bo.owner_type,
    -- Direct entity ownership
    SUM(
        CASE WHEN oi.owner_type = 'beneficial_owner' 
        THEN (efs.total_equity * oi.ownership_percent / 100)
        ELSE 0 END
    ) as direct_entity_equity,
    -- Indirect ownership (through other entities)
    SUM(
        CASE WHEN oc.ultimate_owner_id = bo.id 
        THEN (efs.total_equity * oc.effective_percent / 100)
        ELSE 0 END
    ) as indirect_entity_equity,
    -- Investment positions
    COALESCE(inv.total_nav, 0) as investment_nav,
    -- Total
    COALESCE(SUM(
        CASE WHEN oi.owner_type = 'beneficial_owner' 
        THEN (efs.total_equity * oi.ownership_percent / 100)
        ELSE 0 END
    ), 0) + COALESCE(inv.total_nav, 0) as total_net_worth
FROM beneficial_owners bo
LEFT JOIN ownership_interests oi ON oi.owner_beneficial_id = bo.id AND oi.is_active = true
LEFT JOIN entities e ON e.id = oi.owned_entity_id
LEFT JOIN entity_financial_snapshots efs ON efs.entity_id = e.id 
    AND efs.snapshot_date = (SELECT MAX(snapshot_date) FROM entity_financial_snapshots WHERE entity_id = e.id)
LEFT JOIN mv_ownership_chain oc ON oc.ultimate_owner_id = bo.id
LEFT JOIN LATERAL (
    SELECT SUM(ip.current_nav) as total_nav
    FROM investment_positions ip
    JOIN ownership_interests oi2 ON oi2.owned_entity_id = ip.investor_entity_id
    WHERE oi2.owner_beneficial_id = bo.id AND ip.is_active = true
) inv ON true
WHERE bo.is_active = true
GROUP BY bo.id, bo.display_name, bo.owner_type, inv.total_nav;

-- Entity portfolio view (what does an entity own)
CREATE OR REPLACE VIEW v_entity_portfolio AS
SELECT 
    e.id as entity_id,
    e.name as entity_name,
    -- Owned entities
    (
        SELECT json_agg(json_build_object(
            'entity_id', oi.owned_entity_id,
            'entity_name', e2.name,
            'ownership_percent', oi.ownership_percent,
            'capital_balance', oi.current_capital_balance
        ))
        FROM ownership_interests oi
        JOIN entities e2 ON e2.id = oi.owned_entity_id
        WHERE oi.owner_entity_id = e.id AND oi.is_active = true
    ) as owned_entities,
    -- Active projects
    (
        SELECT json_agg(json_build_object(
            'project_id', p.id,
            'name', p.name,
            'status', p.status,
            'total_budget', p.total_budget,
            'total_spent', p.total_spent
        ))
        FROM projects p
        WHERE p.entity_id = e.id AND p.status NOT IN ('complete', 'cancelled')
    ) as active_projects,
    -- Operating assets
    (
        SELECT json_agg(json_build_object(
            'asset_id', a.id,
            'name', a.name,
            'status', a.status,
            'current_value', a.current_value,
            'current_noi', a.current_noi_annual
        ))
        FROM assets a
        WHERE a.entity_id = e.id AND a.status != 'sold'
    ) as operating_assets,
    -- Passive investments
    (
        SELECT json_agg(json_build_object(
            'investment_id', ip.id,
            'name', ip.investment_name,
            'type', ip.investment_type,
            'current_nav', ip.current_nav,
            'irr', ip.irr
        ))
        FROM investment_positions ip
        WHERE ip.investor_entity_id = e.id AND ip.is_active = true
    ) as passive_investments,
    -- Owners of this entity
    (
        SELECT json_agg(json_build_object(
            'owner_type', oi.owner_type,
            'owner_name', COALESCE(e2.name, bo.display_name, inv.display_name, oi.owner_external_name),
            'ownership_percent', oi.ownership_percent,
            'is_managing_member', oi.is_managing_member
        ))
        FROM ownership_interests oi
        LEFT JOIN entities e2 ON e2.id = oi.owner_entity_id
        LEFT JOIN beneficial_owners bo ON bo.id = oi.owner_beneficial_id
        LEFT JOIN investors inv ON inv.id = oi.owner_investor_id
        WHERE oi.owned_entity_id = e.id AND oi.is_active = true
    ) as owners
FROM entities e
WHERE e.is_active = true;

-- =============================================================================
-- SECTION 7: HELPER FUNCTIONS
-- =============================================================================

-- Function to calculate effective ownership for a beneficial owner in any entity
CREATE OR REPLACE FUNCTION calculate_effective_ownership(
    p_beneficial_owner_id UUID,
    p_entity_id UUID
) RETURNS DECIMAL(10,6) AS $$
DECLARE
    v_effective_percent DECIMAL(10,6) := 0;
BEGIN
    SELECT COALESCE(SUM(effective_percent), 0)
    INTO v_effective_percent
    FROM mv_ownership_chain
    WHERE ultimate_owner_id = p_beneficial_owner_id
    AND entity_id = p_entity_id;
    
    RETURN v_effective_percent;
END;
$$ LANGUAGE plpgsql;

-- Function to post a journal entry
CREATE OR REPLACE FUNCTION post_journal_entry(p_journal_entry_id UUID) RETURNS BOOLEAN AS $$
DECLARE
    v_entry journal_entries%ROWTYPE;
    v_line journal_entry_lines%ROWTYPE;
    v_total_debits DECIMAL(15,2) := 0;
    v_total_credits DECIMAL(15,2) := 0;
BEGIN
    -- Get entry
    SELECT * INTO v_entry FROM journal_entries WHERE id = p_journal_entry_id;
    
    IF v_entry.status != 'draft' THEN
        RAISE EXCEPTION 'Journal entry is not in draft status';
    END IF;
    
    -- Validate debits = credits
    SELECT COALESCE(SUM(debit_amount), 0), COALESCE(SUM(credit_amount), 0)
    INTO v_total_debits, v_total_credits
    FROM journal_entry_lines
    WHERE journal_entry_id = p_journal_entry_id;
    
    IF v_total_debits != v_total_credits THEN
        RAISE EXCEPTION 'Debits (%) do not equal credits (%)', v_total_debits, v_total_credits;
    END IF;
    
    -- Update account balances
    FOR v_line IN SELECT * FROM journal_entry_lines WHERE journal_entry_id = p_journal_entry_id LOOP
        UPDATE entity_accounts
        SET current_balance = current_balance + 
            CASE 
                WHEN normal_balance = 'debit' THEN v_line.debit_amount - v_line.credit_amount
                ELSE v_line.credit_amount - v_line.debit_amount
            END,
            ytd_activity = ytd_activity + v_line.debit_amount + v_line.credit_amount,
            updated_at = now()
        WHERE id = v_line.account_id;
    END LOOP;
    
    -- Mark as posted
    UPDATE journal_entries
    SET status = 'posted',
        total_debits = v_total_debits,
        total_credits = v_total_credits,
        posted_at = now(),
        updated_at = now()
    WHERE id = p_journal_entry_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to allocate entity income/loss to owners
CREATE OR REPLACE FUNCTION allocate_entity_income(
    p_entity_id UUID,
    p_period_year INTEGER,
    p_period_month INTEGER,
    p_income_amount DECIMAL(15,2),
    p_allocation_type TEXT DEFAULT 'income_allocation'
) RETURNS VOID AS $$
DECLARE
    v_interest ownership_interests%ROWTYPE;
    v_allocation_amount DECIMAL(15,2);
BEGIN
    FOR v_interest IN 
        SELECT * FROM ownership_interests 
        WHERE owned_entity_id = p_entity_id AND is_active = true
    LOOP
        v_allocation_amount := p_income_amount * v_interest.ownership_percent / 100;
        
        -- Create capital transaction
        INSERT INTO capital_transactions (
            entity_id, capital_account_id, ownership_interest_id,
            transaction_date, transaction_type, amount, description
        )
        SELECT 
            p_entity_id,
            ca.id,
            v_interest.id,
            (p_period_year || '-' || LPAD(p_period_month::TEXT, 2, '0') || '-01')::DATE,
            p_allocation_type,
            v_allocation_amount,
            p_allocation_type || ' for ' || p_period_year || '-' || p_period_month
        FROM capital_accounts ca
        WHERE ca.ownership_interest_id = v_interest.id
        AND ca.period_year = p_period_year
        AND (ca.period_month = p_period_month OR ca.period_month IS NULL);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Refresh ownership chain materialized view
CREATE OR REPLACE FUNCTION refresh_ownership_chain() RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW mv_ownership_chain;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- SECTION 8: INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_ownership_interests_owned ON ownership_interests(owned_entity_id);
CREATE INDEX IF NOT EXISTS idx_ownership_interests_owner_entity ON ownership_interests(owner_entity_id);
CREATE INDEX IF NOT EXISTS idx_ownership_interests_owner_beneficial ON ownership_interests(owner_beneficial_id);
CREATE INDEX IF NOT EXISTS idx_entity_accounts_entity ON entity_accounts(entity_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_entity ON journal_entries(entity_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON journal_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_journal_entry_lines_entry ON journal_entry_lines(journal_entry_id);
CREATE INDEX IF NOT EXISTS idx_journal_entry_lines_account ON journal_entry_lines(account_id);
CREATE INDEX IF NOT EXISTS idx_capital_accounts_entity ON capital_accounts(entity_id);
CREATE INDEX IF NOT EXISTS idx_capital_accounts_interest ON capital_accounts(ownership_interest_id);
CREATE INDEX IF NOT EXISTS idx_capital_transactions_account ON capital_transactions(capital_account_id);
CREATE INDEX IF NOT EXISTS idx_investment_positions_entity ON investment_positions(investor_entity_id);
CREATE INDEX IF NOT EXISTS idx_project_transactions_project ON project_transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_asset_income_statements_asset ON asset_income_statements(asset_id);
CREATE INDEX IF NOT EXISTS idx_k1_received_entity ON k1_received(investor_entity_id);
