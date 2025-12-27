-- ============================================================
-- ATLASDEV DATABASE SCHEMA (MVP)
-- Supabase/PostgreSQL Implementation
-- Red Cedar Homes SC
-- December 2025
-- ============================================================
-- MVP SCOPE:
-- ✅ Multi-entity accounting
-- ✅ Deal pipeline → Project conversion
-- ✅ Project management & construction tracking
-- ✅ Budget/Actuals/Variance
-- ✅ Vendor & contact management
-- ✅ Teams & user permissions (team-based project access)
-- ✅ Document management (SharePoint sync)
-- 
-- NOT IN MVP (Future):
-- ❌ Investor portal & distributions
-- ❌ Brokerage CRM
-- ❌ Capital raising
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUM TYPES
-- ============================================================

-- Entity types
CREATE TYPE entity_type AS ENUM (
    'llc', 
    'corp', 
    'partnership', 
    'trust', 
    '501c3'
);

-- Project types
CREATE TYPE project_type AS ENUM (
    'multifamily',
    'btr',
    'affordable',
    'townhomes',
    'single_family',
    'scattered_lots',
    'land_development'
);

-- Project status
CREATE TYPE project_status AS ENUM (
    'pipeline',
    'pre_dev',
    'entitlement',
    'construction',
    'lease_up',
    'stabilized',
    'disposition',
    'complete'
);

-- Deal status (for pipeline before conversion to project)
CREATE TYPE deal_status AS ENUM (
    'lead',
    'qualifying',
    'loi_sent',
    'loi_executed',
    'due_diligence',
    'under_contract',
    'closed_won',      -- Converts to Project
    'closed_lost',
    'on_hold'
);

-- Contact types
CREATE TYPE contact_type AS ENUM (
    'investor',
    'lender',
    'broker',
    'contractor',
    'vendor',
    'attorney',
    'title_company',
    'seller',
    'buyer',
    'municipal',
    'architect',
    'engineer',
    'property_manager'
);

-- Budget categories
CREATE TYPE budget_category AS ENUM (
    'land',
    'soft_costs',
    'hard_costs',
    'financing',
    'contingency',
    'reserves'
);

-- Draw status
CREATE TYPE draw_status AS ENUM (
    'draft',
    'submitted',
    'under_review',
    'approved',
    'funded',
    'rejected'
);

-- Task status
CREATE TYPE task_status AS ENUM (
    'todo',
    'in_progress',
    'waiting',
    'done',
    'cancelled'
);

-- Task priority
CREATE TYPE task_priority AS ENUM (
    'low',
    'medium',
    'high',
    'urgent'
);

-- Due diligence status
CREATE TYPE dd_status AS ENUM (
    'not_started',
    'in_progress',
    'complete',
    'waived',
    'failed'
);

-- Investor class
CREATE TYPE investor_class AS ENUM (
    'class_a',
    'class_b',
    'gp',
    'lp'
);

-- Loan type
CREATE TYPE loan_type AS ENUM (
    'construction',
    'bridge',
    'permanent',
    'mezzanine',
    'equity_line'
);

-- Contract type
CREATE TYPE contract_type AS ENUM (
    'gc',
    'subcontractor',
    'architect',
    'engineer',
    'consultant'
);

-- Inspection type
CREATE TYPE inspection_type AS ENUM (
    'foundation',
    'framing',
    'rough_in',
    'final',
    'certificate_of_occupancy',
    'lender',
    'third_party'
);

-- Approval status
CREATE TYPE approval_status AS ENUM (
    'pending',
    'approved',
    'rejected',
    'cancelled'
);

-- Approval type
CREATE TYPE approval_type AS ENUM (
    'draw_request',
    'budget_change',
    'change_order',
    'invoice',
    'contract',
    'expense'
);

-- Notification type
CREATE TYPE notification_type AS ENUM (
    'task_due',
    'task_overdue',
    'insurance_expiring',
    'dd_deadline',
    'budget_variance',
    'milestone_missed',
    'draw_funded',
    'approval_required',
    'approval_complete',
    'document_uploaded',
    'mention',
    'system'
);

-- Bill/Invoice status
CREATE TYPE bill_status AS ENUM (
    'draft',
    'pending_approval',
    'approved',
    'scheduled',
    'paid',
    'void'
);

-- Change order status
CREATE TYPE change_order_status AS ENUM (
    'draft',
    'submitted',
    'under_review',
    'approved',
    'rejected',
    'void'
);

-- Lien waiver type
CREATE TYPE lien_waiver_type AS ENUM (
    'conditional_progress',
    'unconditional_progress',
    'conditional_final',
    'unconditional_final'
);

-- Lien waiver status
CREATE TYPE lien_waiver_status AS ENUM (
    'requested',
    'received',
    'verified',
    'expired'
);

-- Issue status
CREATE TYPE issue_status AS ENUM (
    'open',
    'in_progress',
    'pending_info',
    'resolved',
    'closed',
    'wont_fix'
);

-- Issue priority
CREATE TYPE issue_priority AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

-- Issue category
CREATE TYPE issue_category AS ENUM (
    'construction_defect',
    'design_issue',
    'schedule_delay',
    'budget_overrun',
    'safety',
    'permit',
    'neighbor_complaint',
    'vendor_issue',
    'weather',
    'material_shortage',
    'coordination',
    'other'
);

-- RFI status
CREATE TYPE rfi_status AS ENUM (
    'draft',
    'submitted',
    'under_review',
    'answered',
    'closed'
);

-- Submittal status
CREATE TYPE submittal_status AS ENUM (
    'pending',
    'submitted',
    'under_review',
    'approved',
    'approved_as_noted',
    'revise_resubmit',
    'rejected'
);

-- Bid status
CREATE TYPE bid_status AS ENUM (
    'draft',
    'sent',
    'received',
    'under_review',
    'awarded',
    'rejected',
    'expired'
);

-- AI task status
CREATE TYPE ai_task_status AS ENUM (
    'queued',
    'processing',
    'completed',
    'failed',
    'cancelled'
);

-- AI task type
CREATE TYPE ai_task_type AS ENUM (
    'deal_analysis',
    'comp_research',
    'zoning_research',
    'market_analysis',
    'document_extraction',
    'proforma_generation',
    'product_recommendation',
    'risk_assessment',
    'cost_estimation',
    'schedule_optimization',
    'rent_comp_analysis',
    'asset_valuation',
    'lease_abstraction'
);

-- ============================================================
-- ASSET MANAGEMENT ENUMS
-- ============================================================

-- Asset type
CREATE TYPE asset_type AS ENUM (
    'multifamily',
    'single_family_rental',
    'btr_community',
    'office',
    'retail',
    'industrial',
    'mixed_use',
    'self_storage',
    'mobile_home_park',
    'land'
);

-- Asset status
CREATE TYPE asset_status AS ENUM (
    'acquisition',
    'transition',
    'stabilizing',
    'stabilized',
    'value_add',
    'repositioning',
    'disposition',
    'sold'
);

-- Lease status
CREATE TYPE lease_status AS ENUM (
    'draft',
    'pending_approval',
    'active',
    'month_to_month',
    'renewed',
    'notice_given',
    'expired',
    'terminated',
    'eviction'
);

-- Unit status
CREATE TYPE unit_status AS ENUM (
    'vacant_ready',
    'vacant_not_ready',
    'occupied',
    'notice',
    'eviction',
    'down',
    'model',
    'employee'
);

-- Work order status
CREATE TYPE work_order_status AS ENUM (
    'submitted',
    'assigned',
    'in_progress',
    'on_hold',
    'completed',
    'cancelled'
);

-- Work order priority
CREATE TYPE work_order_priority AS ENUM (
    'emergency',
    'urgent',
    'high',
    'normal',
    'low'
);

-- Tenant charge type
CREATE TYPE charge_type AS ENUM (
    'rent',
    'pet_rent',
    'parking',
    'storage',
    'utility_water',
    'utility_electric',
    'utility_gas',
    'utility_trash',
    'late_fee',
    'nsf_fee',
    'lease_violation',
    'damage',
    'cleaning',
    'other'
);

-- ============================================================
-- USER & TEAM MANAGEMENT (Core for MVP)
-- ============================================================

-- User roles
CREATE TYPE user_role AS ENUM (
    'admin',           -- Global access to everything
    'executive',       -- View all, limited edit
    'project_manager', -- Full access to assigned projects
    'team_member',     -- Limited access to assigned projects
    'accountant',      -- Finance tabs across assigned projects
    'viewer'           -- Read-only
);

-- Teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    entity_id UUID REFERENCES entities(id), -- Optional: team can be entity-specific
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    role user_role DEFAULT 'viewer',
    is_active BOOLEAN DEFAULT true,
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    job_title VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Members (users belong to teams)
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_team_lead BOOLEAN DEFAULT false,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(team_id, user_id)
);

-- Project Teams (teams assigned to projects)
CREATE TABLE project_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    access_level VARCHAR(50) DEFAULT 'full', -- 'full', 'read_only', 'finance_only'
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(project_id, team_id)
);

-- Direct user-project assignment (for PMs or special access)
CREATE TABLE project_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'team_member', -- 'project_manager', 'team_member', 'viewer'
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(project_id, user_id)
);

-- ============================================================
-- ACCESS CONTROL FUNCTIONS
-- ============================================================

-- Function to check if user can access a project
CREATE OR REPLACE FUNCTION user_can_access_project(p_user_id UUID, p_project_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_user_role user_role;
    v_has_access BOOLEAN := false;
BEGIN
    -- Get user's global role
    SELECT role INTO v_user_role FROM users WHERE id = p_user_id;
    
    -- Admins and executives can access all projects
    IF v_user_role IN ('admin', 'executive') THEN
        RETURN true;
    END IF;
    
    -- Check direct project assignment
    SELECT EXISTS(
        SELECT 1 FROM project_users 
        WHERE user_id = p_user_id AND project_id = p_project_id
    ) INTO v_has_access;
    
    IF v_has_access THEN
        RETURN true;
    END IF;
    
    -- Check team-based access
    SELECT EXISTS(
        SELECT 1 FROM project_teams pt
        JOIN team_members tm ON pt.team_id = tm.team_id
        WHERE tm.user_id = p_user_id AND pt.project_id = p_project_id
    ) INTO v_has_access;
    
    RETURN v_has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get all accessible projects for a user
CREATE OR REPLACE FUNCTION get_user_projects(p_user_id UUID)
RETURNS TABLE(project_id UUID) AS $$
DECLARE
    v_user_role user_role;
BEGIN
    SELECT role INTO v_user_role FROM users WHERE id = p_user_id;
    
    -- Admins and executives see all projects
    IF v_user_role IN ('admin', 'executive') THEN
        RETURN QUERY SELECT id FROM projects WHERE status != 'archived';
    ELSE
        -- Return projects from direct assignment or team membership
        RETURN QUERY
        SELECT DISTINCT p.id
        FROM projects p
        WHERE p.status != 'archived'
        AND (
            -- Direct assignment
            EXISTS (
                SELECT 1 FROM project_users pu 
                WHERE pu.project_id = p.id AND pu.user_id = p_user_id
            )
            OR
            -- Team membership
            EXISTS (
                SELECT 1 FROM project_teams pt
                JOIN team_members tm ON pt.team_id = tm.team_id
                WHERE pt.project_id = p.id AND tm.user_id = p_user_id
            )
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see projects they have access to
CREATE POLICY "Users see accessible projects" ON projects
    FOR SELECT
    USING (user_can_access_project(auth.uid(), id));

-- Policy: Only admins and project managers can update projects
CREATE POLICY "PM and admin can update projects" ON projects
    FOR UPDATE
    USING (
        (SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'executive')
        OR EXISTS (
            SELECT 1 FROM project_users 
            WHERE project_id = projects.id 
            AND user_id = auth.uid() 
            AND role = 'project_manager'
        )
    );

-- Policy: Only admins can delete projects
CREATE POLICY "Only admin can delete projects" ON projects
    FOR DELETE
    USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Policy: Admins and executives can insert projects
CREATE POLICY "Admin and exec can create projects" ON projects
    FOR INSERT
    WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'executive'));

-- ============================================================
-- CORE TABLES
-- ============================================================

-- Entities (Companies/LLCs)
CREATE TABLE entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    entity_type entity_type NOT NULL,
    ein VARCHAR(20),
    state_of_formation VARCHAR(2) DEFAULT 'SC',
    formation_date DATE,
    registered_agent VARCHAR(255),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(2),
    zip VARCHAR(10),
    qbo_company_id VARCHAR(50),
    sharepoint_site_id VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- DEALS (Pipeline before conversion to Project)
-- ============================================================

CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    
    -- Classification
    entity_id UUID REFERENCES entities(id),
    deal_type project_type, -- Same types as projects
    status deal_status DEFAULT 'lead',
    
    -- Property info
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(2) DEFAULT 'SC',
    zip VARCHAR(10),
    county VARCHAR(100),
    
    -- Land details
    acreage DECIMAL(10,4),
    lot_count INTEGER,
    unit_count INTEGER,
    
    -- Seller info
    seller_name VARCHAR(255),
    seller_contact_id UUID REFERENCES contacts(id),
    listing_broker_id UUID REFERENCES contacts(id),
    
    -- Financial terms
    asking_price DECIMAL(15,2),
    offer_price DECIMAL(15,2),
    contract_price DECIMAL(15,2),
    earnest_money DECIMAL(15,2),
    
    -- Key dates
    lead_date DATE,
    loi_sent_date DATE,
    loi_executed_date DATE,
    contract_date DATE,
    dd_start_date DATE,
    dd_end_date DATE,
    closing_date DATE,
    
    -- Due diligence
    dd_extension_date DATE,
    dd_deposit_hard BOOLEAN DEFAULT false,
    
    -- Feasibility
    estimated_development_cost DECIMAL(15,2),
    estimated_sale_value DECIMAL(15,2),
    estimated_profit DECIMAL(15,2),
    feasibility_score INTEGER, -- 1-10 or similar
    
    -- Conversion tracking
    converted_to_project_id UUID, -- Populated when deal closes
    converted_date DATE,
    
    -- Assignment
    lead_source VARCHAR(100),
    assigned_to_user_id UUID REFERENCES users(id),
    
    -- Notes
    notes TEXT,
    loss_reason TEXT, -- If closed_lost
    
    -- SharePoint
    sharepoint_folder_id VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deal-to-Project conversion function
CREATE OR REPLACE FUNCTION convert_deal_to_project(p_deal_id UUID)
RETURNS UUID AS $$
DECLARE
    v_deal RECORD;
    v_project_id UUID;
    v_project_code VARCHAR(20);
BEGIN
    -- Get deal data
    SELECT * INTO v_deal FROM deals WHERE id = p_deal_id;
    
    IF v_deal.status != 'closed_won' THEN
        RAISE EXCEPTION 'Deal must be in closed_won status to convert';
    END IF;
    
    IF v_deal.converted_to_project_id IS NOT NULL THEN
        RAISE EXCEPTION 'Deal already converted to project';
    END IF;
    
    -- Generate project code (format: RCH-2025-001)
    SELECT 'RCH-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
           LPAD((COALESCE(MAX(SUBSTRING(project_code FROM 10)::INTEGER), 0) + 1)::TEXT, 3, '0')
    INTO v_project_code
    FROM projects 
    WHERE project_code LIKE 'RCH-' || TO_CHAR(NOW(), 'YYYY') || '-%';
    
    -- Create project from deal
    INSERT INTO projects (
        project_code, name, entity_id, project_type, status,
        address, city, state, zip, county,
        total_acreage, total_lots, total_units,
        purchase_price, contract_date, closing_date,
        deal_id, sharepoint_folder_id
    ) VALUES (
        v_project_code, v_deal.name, v_deal.entity_id, v_deal.deal_type, 'pre_dev',
        v_deal.address, v_deal.city, v_deal.state, v_deal.zip, v_deal.county,
        v_deal.acreage, v_deal.lot_count, v_deal.unit_count,
        v_deal.contract_price, v_deal.contract_date, v_deal.closing_date,
        p_deal_id, v_deal.sharepoint_folder_id
    )
    RETURNING id INTO v_project_id;
    
    -- Update deal with conversion info
    UPDATE deals SET 
        converted_to_project_id = v_project_id,
        converted_date = NOW()
    WHERE id = p_deal_id;
    
    -- Copy deal contacts to project contacts
    INSERT INTO project_contacts (project_id, contact_id, role)
    SELECT v_project_id, seller_contact_id, 'Seller'
    FROM deals WHERE id = p_deal_id AND seller_contact_id IS NOT NULL;
    
    -- Create default budget template
    PERFORM create_budget_template(v_project_id);
    
    -- Create default due diligence checklist
    PERFORM create_dd_template(v_project_id);
    
    RETURN v_project_id;
END;
$$ LANGUAGE plpgsql;

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    entity_id UUID REFERENCES entities(id),
    project_type project_type NOT NULL,
    status project_status DEFAULT 'pipeline',
    description TEXT,
    
    -- Converted from Deal
    deal_id UUID, -- Reference to originating deal (if converted)
    
    -- Address
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(2) DEFAULT 'SC',
    zip VARCHAR(10),
    county VARCHAR(100),
    
    -- Key metrics
    total_budget DECIMAL(15,2) DEFAULT 0,
    total_spent DECIMAL(15,2) DEFAULT 0,
    percent_complete DECIMAL(5,2) DEFAULT 0,
    total_units INTEGER,
    total_lots INTEGER,
    total_sf DECIMAL(12,2),
    total_acreage DECIMAL(10,4),
    
    -- Key dates
    start_date DATE,
    target_completion DATE,
    actual_completion DATE,
    
    -- Acquisition dates
    loi_date DATE,
    contract_date DATE,
    dd_end_date DATE,
    closing_date DATE,
    actual_closing_date DATE,
    
    -- Financial summary
    purchase_price DECIMAL(15,2),
    total_equity_required DECIMAL(15,2),
    total_debt DECIMAL(15,2),
    
    -- Integration references
    sharepoint_folder_id VARCHAR(255),
    sharepoint_folder_url VARCHAR(500),
    qbo_class_id VARCHAR(50),
    
    -- Project manager
    project_manager_id UUID,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Properties (Multiple per project)
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Address
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(2) DEFAULT 'SC',
    zip VARCHAR(10),
    
    -- Parcel info
    tax_map_number VARCHAR(50),
    deed_book VARCHAR(20),
    deed_page VARCHAR(20),
    
    -- Physical characteristics
    acreage DECIMAL(10,4),
    lot_count INTEGER,
    unit_count INTEGER,
    square_footage DECIMAL(12,2),
    
    -- Jurisdiction
    municipality VARCHAR(100),
    county VARCHAR(100),
    zoning VARCHAR(50),
    zoning_description TEXT,
    
    -- Utilities
    water_provider VARCHAR(100),
    sewer_provider VARCHAR(100),
    electric_provider VARCHAR(100),
    gas_provider VARCHAR(100),
    
    -- Status
    is_primary BOOLEAN DEFAULT false,
    acquisition_status VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts (Global contact list)
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic info
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(255) GENERATED ALWAYS AS (
        COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')
    ) STORED,
    company VARCHAR(255),
    title VARCHAR(100),
    contact_type contact_type NOT NULL,
    
    -- Contact details
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile VARCHAR(20),
    fax VARCHAR(20),
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(2),
    zip VARCHAR(10),
    
    -- Integration references
    qbo_vendor_id VARCHAR(50),
    outlook_contact_id VARCHAR(255),
    
    -- Compliance (for vendors)
    insurance_expiry DATE,
    license_number VARCHAR(50),
    license_expiry DATE,
    w9_on_file BOOLEAN DEFAULT false,
    
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project Contacts (Junction table)
CREATE TABLE project_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    role VARCHAR(100),
    is_primary BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(project_id, contact_id, role)
);

-- ============================================================
-- FINANCIAL TABLES
-- ============================================================

-- Budget Items
CREATE TABLE budget_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    category budget_category NOT NULL,
    line_item VARCHAR(255) NOT NULL,
    description TEXT,
    
    budgeted_amount DECIMAL(15,2) DEFAULT 0,
    actual_amount DECIMAL(15,2) DEFAULT 0,
    committed_amount DECIMAL(15,2) DEFAULT 0,
    variance DECIMAL(15,2) GENERATED ALWAYS AS (budgeted_amount - actual_amount) STORED,
    
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loans
CREATE TABLE loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    lender_contact_id UUID REFERENCES contacts(id),
    
    loan_type loan_type NOT NULL,
    loan_name VARCHAR(255),
    
    -- Loan terms
    commitment_amount DECIMAL(15,2),
    funded_amount DECIMAL(15,2) DEFAULT 0,
    remaining_availability DECIMAL(15,2) GENERATED ALWAYS AS (commitment_amount - funded_amount) STORED,
    interest_rate DECIMAL(5,3),
    index_rate VARCHAR(20),
    spread DECIMAL(5,3),
    
    -- Dates
    commitment_date DATE,
    closing_date DATE,
    maturity_date DATE,
    
    -- Terms
    term_months INTEGER,
    extension_options TEXT,
    prepayment_terms TEXT,
    
    -- Fees
    origination_fee_percent DECIMAL(5,3),
    origination_fee_amount DECIMAL(15,2),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active',
    
    -- Integration
    loan_number VARCHAR(50),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Draws
CREATE TABLE draws (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    loan_id UUID REFERENCES loans(id) ON DELETE CASCADE,
    
    draw_number INTEGER NOT NULL,
    
    -- Amounts
    amount_requested DECIMAL(15,2) NOT NULL,
    amount_approved DECIMAL(15,2),
    amount_funded DECIMAL(15,2),
    retainage_held DECIMAL(15,2) DEFAULT 0,
    
    -- Status
    status draw_status DEFAULT 'draft',
    
    -- Dates
    request_date DATE,
    submitted_date DATE,
    approved_date DATE,
    funded_date DATE,
    
    -- Supporting docs
    pay_application_url VARCHAR(500),
    lien_waivers_url VARCHAR(500),
    inspection_report_url VARCHAR(500),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(loan_id, draw_number)
);

-- Investors
CREATE TABLE investors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id),
    entity_id UUID REFERENCES entities(id),
    
    investor_name VARCHAR(255) NOT NULL,
    investor_class investor_class DEFAULT 'lp',
    
    -- Capital
    commitment_amount DECIMAL(15,2) NOT NULL,
    funded_amount DECIMAL(15,2) DEFAULT 0,
    unfunded_commitment DECIMAL(15,2) GENERATED ALWAYS AS (commitment_amount - funded_amount) STORED,
    
    -- Ownership
    ownership_percent DECIMAL(8,5),
    
    -- Returns
    preferred_return DECIMAL(5,2),
    promote_split DECIMAL(5,2),
    
    -- Dates
    commitment_date DATE,
    initial_funding_date DATE,
    
    -- Banking
    distribution_instructions TEXT,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Distributions
CREATE TABLE distributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
    
    distribution_date DATE NOT NULL,
    distribution_type VARCHAR(50), -- 'return_of_capital', 'preferred', 'profit'
    
    gross_amount DECIMAL(15,2) NOT NULL,
    withholding DECIMAL(15,2) DEFAULT 0,
    net_amount DECIMAL(15,2) GENERATED ALWAYS AS (gross_amount - withholding) STORED,
    
    -- Payment tracking
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    payment_date DATE,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions (synced from QuickBooks)
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    budget_item_id UUID REFERENCES budget_items(id),
    contact_id UUID REFERENCES contacts(id),
    
    -- Transaction details
    transaction_date DATE NOT NULL,
    description VARCHAR(500),
    amount DECIMAL(15,2) NOT NULL,
    transaction_type VARCHAR(50), -- 'expense', 'income', 'transfer'
    
    -- Categorization
    category budget_category,
    
    -- QuickBooks sync
    qbo_transaction_id VARCHAR(50),
    qbo_sync_date TIMESTAMP WITH TIME ZONE,
    
    -- Document reference
    invoice_number VARCHAR(50),
    document_url VARCHAR(500),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CONSTRUCTION TABLES
-- ============================================================

-- Contracts
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id),
    
    contract_type contract_type NOT NULL,
    contract_name VARCHAR(255) NOT NULL,
    scope_of_work TEXT,
    
    -- Financial
    original_amount DECIMAL(15,2),
    approved_changes DECIMAL(15,2) DEFAULT 0,
    current_amount DECIMAL(15,2) GENERATED ALWAYS AS (original_amount + approved_changes) STORED,
    billed_to_date DECIMAL(15,2) DEFAULT 0,
    paid_to_date DECIMAL(15,2) DEFAULT 0,
    retainage_held DECIMAL(15,2) DEFAULT 0,
    
    -- Dates
    execution_date DATE,
    start_date DATE,
    completion_date DATE,
    actual_completion DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active',
    
    -- Documents
    contract_url VARCHAR(500),
    insurance_cert_url VARCHAR(500),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Change Orders
CREATE TABLE change_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    co_number INTEGER NOT NULL,
    description TEXT NOT NULL,
    
    -- Financial
    amount DECIMAL(15,2) NOT NULL,
    days_added INTEGER DEFAULT 0,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    
    -- Dates
    request_date DATE,
    approved_date DATE,
    
    -- Documents
    document_url VARCHAR(500),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(contract_id, co_number)
);

-- Inspections
CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    inspection_type inspection_type NOT NULL,
    inspector_name VARCHAR(255),
    inspector_company VARCHAR(255),
    
    -- Scheduling
    scheduled_date DATE,
    actual_date DATE,
    
    -- Results
    result VARCHAR(50), -- 'passed', 'failed', 'conditional'
    notes TEXT,
    
    -- Documents
    report_url VARCHAR(500),
    certificate_url VARCHAR(500),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Milestones
CREATE TABLE milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Dates
    target_date DATE,
    actual_date DATE,
    
    -- Status
    is_complete BOOLEAN DEFAULT false,
    
    -- Dependencies
    depends_on_milestone_id UUID REFERENCES milestones(id),
    
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- TASK MANAGEMENT
-- ============================================================

-- Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Status
    status task_status DEFAULT 'todo',
    priority task_priority DEFAULT 'medium',
    
    -- Assignment
    assignee_id UUID REFERENCES contacts(id),
    assignee_name VARCHAR(255),
    
    -- Dates
    due_date DATE,
    completed_date DATE,
    
    -- Kanban
    kanban_order INTEGER DEFAULT 0,
    
    -- Relations
    milestone_id UUID REFERENCES milestones(id),
    related_tab VARCHAR(50), -- 'legal', 'loans', 'budget', etc.
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Due Diligence Items
CREATE TABLE due_diligence_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100), -- 'title', 'environmental', 'zoning', 'engineering', 'legal'
    
    -- Status
    status dd_status DEFAULT 'not_started',
    
    -- Assignment
    assignee_id UUID REFERENCES contacts(id),
    vendor_id UUID REFERENCES contacts(id),
    
    -- Dates
    due_date DATE,
    completed_date DATE,
    
    -- Cost
    estimated_cost DECIMAL(15,2),
    actual_cost DECIMAL(15,2),
    
    -- Documents
    document_url VARCHAR(500),
    
    notes TEXT,
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- DOCUMENTS & COMMUNICATIONS
-- ============================================================

-- Documents (metadata - actual files in SharePoint)
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    
    -- Categorization
    folder_path VARCHAR(500),
    document_type VARCHAR(100), -- 'contract', 'permit', 'report', 'financial', etc.
    
    -- SharePoint reference
    sharepoint_item_id VARCHAR(255),
    sharepoint_url VARCHAR(500),
    
    -- Metadata
    uploaded_by VARCHAR(255),
    description TEXT,
    tags TEXT[], -- Array of tags
    
    -- Versioning
    version INTEGER DEFAULT 1,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Communications (activity log)
CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id),
    
    -- Communication details
    communication_type VARCHAR(50) NOT NULL, -- 'email', 'call', 'meeting', 'note'
    subject VARCHAR(500),
    body TEXT,
    
    -- Direction
    direction VARCHAR(20), -- 'inbound', 'outbound', 'internal'
    
    -- Outlook integration
    outlook_message_id VARCHAR(255),
    outlook_conversation_id VARCHAR(255),
    
    -- Participants
    from_address VARCHAR(255),
    to_addresses TEXT[], -- Array of email addresses
    cc_addresses TEXT[],
    
    -- Dates
    communication_date TIMESTAMP WITH TIME ZONE,
    
    -- Attachments
    has_attachments BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- DISPOSITION TABLES
-- ============================================================

-- Sales (for individual lot/unit sales or project sale)
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    property_id UUID REFERENCES properties(id),
    
    sale_type VARCHAR(50), -- 'lot', 'unit', 'project', 'bulk'
    
    -- Buyer info
    buyer_name VARCHAR(255),
    buyer_contact_id UUID REFERENCES contacts(id),
    
    -- Financial
    list_price DECIMAL(15,2),
    sale_price DECIMAL(15,2),
    earnest_money DECIMAL(15,2),
    
    -- Dates
    contract_date DATE,
    closing_date DATE,
    actual_closing_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'under_contract', 'closed', 'cancelled'
    
    -- Commission
    broker_id UUID REFERENCES contacts(id),
    commission_percent DECIMAL(5,2),
    commission_amount DECIMAL(15,2),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- APPROVALS & WORKFLOW ENGINE
-- ============================================================

-- Approval workflows (templates)
CREATE TABLE approval_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    approval_type approval_type NOT NULL,
    description TEXT,
    
    -- Conditions for triggering
    threshold_amount DECIMAL(15,2), -- e.g., requires approval if over $10,000
    threshold_percent DECIMAL(5,2), -- e.g., budget change > 5%
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Approval workflow steps
CREATE TABLE approval_workflow_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES approval_workflows(id) ON DELETE CASCADE,
    step_order INTEGER NOT NULL,
    
    -- Who can approve at this step
    approver_role user_role, -- Role-based (e.g., any 'executive')
    approver_user_id UUID REFERENCES users(id), -- Or specific user
    
    -- Options
    can_skip BOOLEAN DEFAULT false,
    auto_approve_after_days INTEGER, -- Auto-approve if no response
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Approval requests (instances)
CREATE TABLE approval_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES approval_workflows(id),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- What needs approval
    approval_type approval_type NOT NULL,
    reference_id UUID NOT NULL, -- ID of draw, change order, invoice, etc.
    reference_table VARCHAR(50) NOT NULL, -- 'draws', 'change_orders', 'bills', etc.
    
    -- Request details
    requested_by_id UUID REFERENCES users(id),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    amount DECIMAL(15,2),
    description TEXT,
    
    -- Current state
    current_step INTEGER DEFAULT 1,
    status approval_status DEFAULT 'pending',
    
    -- Completion
    completed_at TIMESTAMP WITH TIME ZONE,
    final_approver_id UUID REFERENCES users(id),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Approval actions (each step's decision)
CREATE TABLE approval_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES approval_requests(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    
    -- Who acted
    approver_id UUID REFERENCES users(id),
    action approval_status NOT NULL, -- 'approved', 'rejected'
    
    -- Details
    comments TEXT,
    acted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS & ALERTS
-- ============================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    notification_type notification_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    
    -- Related objects
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    reference_id UUID, -- ID of related object
    reference_table VARCHAR(50), -- Table name
    link_url VARCHAR(500), -- Direct link to the item
    
    -- State
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Delivery
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notification preferences per user
CREATE TABLE notification_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    notification_type notification_type NOT NULL,
    
    -- Channels
    in_app BOOLEAN DEFAULT true,
    email BOOLEAN DEFAULT true,
    
    -- Frequency for non-urgent
    digest_frequency VARCHAR(20) DEFAULT 'immediate', -- 'immediate', 'daily', 'weekly'
    
    UNIQUE(user_id, notification_type)
);

-- Alert rules (configurable thresholds)
CREATE TABLE alert_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- What to check
    check_type VARCHAR(50) NOT NULL, -- 'insurance_expiry', 'budget_variance', 'task_overdue', etc.
    
    -- Thresholds
    days_before INTEGER, -- For date-based alerts (e.g., 30 days before insurance expires)
    threshold_percent DECIMAL(5,2), -- For variance alerts (e.g., 10% over budget)
    threshold_amount DECIMAL(15,2),
    
    -- Who to notify
    notify_roles user_role[], -- Array of roles
    notify_project_manager BOOLEAN DEFAULT true,
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- AUDIT TRAIL / ACTIVITY LOG
-- ============================================================

CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Who
    user_id UUID REFERENCES users(id),
    user_name VARCHAR(255), -- Denormalized for history
    user_role user_role,
    
    -- What
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'approve', 'reject', 'login', etc.
    entity_type VARCHAR(50) NOT NULL, -- 'project', 'budget_item', 'draw', etc.
    entity_id UUID,
    entity_name VARCHAR(255), -- Denormalized
    
    -- Context
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    project_code VARCHAR(20),
    
    -- Changes
    old_values JSONB, -- Previous values for updates
    new_values JSONB, -- New values
    changed_fields TEXT[], -- List of fields that changed
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity feed (user-friendly version of audit log)
CREATE TABLE activity_feed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Context
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    user_name VARCHAR(255),
    
    -- Activity
    activity_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Related
    reference_id UUID,
    reference_type VARCHAR(50),
    
    -- Display
    icon VARCHAR(50), -- Icon name for UI
    color VARCHAR(20), -- Color for UI
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- BILLS / ACCOUNTS PAYABLE
-- ============================================================

CREATE TABLE bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES contacts(id),
    contract_id UUID REFERENCES contracts(id),
    
    -- Bill details
    bill_number VARCHAR(50),
    description TEXT,
    
    -- Amounts
    amount DECIMAL(15,2) NOT NULL,
    retainage_held DECIMAL(15,2) DEFAULT 0,
    retainage_percent DECIMAL(5,2) DEFAULT 0,
    net_amount DECIMAL(15,2) GENERATED ALWAYS AS (amount - retainage_held) STORED,
    
    -- Categorization
    budget_item_id UUID REFERENCES budget_items(id),
    cost_code VARCHAR(20),
    
    -- Dates
    bill_date DATE NOT NULL,
    due_date DATE,
    received_date DATE,
    
    -- Status & approval
    status bill_status DEFAULT 'draft',
    approved_by_id UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    
    -- Payment
    paid_date DATE,
    paid_amount DECIMAL(15,2),
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    
    -- QuickBooks sync
    qbo_bill_id VARCHAR(50),
    qbo_synced_at TIMESTAMP WITH TIME ZONE,
    
    -- Documents
    invoice_document_id UUID REFERENCES documents(id),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bill line items (for multi-line bills)
CREATE TABLE bill_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bill_id UUID REFERENCES bills(id) ON DELETE CASCADE,
    
    description VARCHAR(500),
    quantity DECIMAL(10,2) DEFAULT 1,
    unit_price DECIMAL(15,2),
    amount DECIMAL(15,2) NOT NULL,
    
    budget_item_id UUID REFERENCES budget_items(id),
    cost_code VARCHAR(20),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CHANGE ORDERS
-- ============================================================

-- Change Orders (enhanced from basic version)
DROP TABLE IF EXISTS change_orders CASCADE;
CREATE TABLE change_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    
    -- Identification
    co_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Financials
    original_amount DECIMAL(15,2) NOT NULL,
    approved_amount DECIMAL(15,2),
    
    -- Schedule impact
    days_added INTEGER DEFAULT 0,
    
    -- Classification
    reason VARCHAR(100), -- 'owner_request', 'unforeseen_condition', 'design_change', 'value_engineering'
    
    -- Status & approval
    status change_order_status DEFAULT 'draft',
    submitted_date DATE,
    submitted_by_id UUID REFERENCES users(id),
    approved_date DATE,
    approved_by_id UUID REFERENCES users(id),
    
    -- Supporting docs
    document_id UUID REFERENCES documents(id),
    
    -- Budget impact
    budget_item_id UUID REFERENCES budget_items(id), -- Which budget line affected
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(contract_id, co_number)
);

-- ============================================================
-- LIEN WAIVER TRACKING
-- ============================================================

CREATE TABLE lien_waivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Related to
    vendor_id UUID REFERENCES contacts(id),
    contract_id UUID REFERENCES contracts(id),
    draw_id UUID REFERENCES draws(id),
    bill_id UUID REFERENCES bills(id),
    
    -- Waiver details
    waiver_type lien_waiver_type NOT NULL,
    
    -- Amounts
    through_date DATE NOT NULL, -- Work through this date
    amount DECIMAL(15,2) NOT NULL,
    
    -- Status
    status lien_waiver_status DEFAULT 'requested',
    
    -- Dates
    requested_date DATE,
    received_date DATE,
    verified_date DATE,
    verified_by_id UUID REFERENCES users(id),
    
    -- Document
    document_id UUID REFERENCES documents(id),
    
    -- Exceptions/issues
    has_exceptions BOOLEAN DEFAULT false,
    exception_notes TEXT,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- INSURANCE CERTIFICATE TRACKING
-- ============================================================

CREATE TABLE insurance_certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Who
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL, -- Can be project-specific or general
    
    -- Policy details
    policy_number VARCHAR(100),
    insurance_company VARCHAR(255),
    
    -- Coverage type
    coverage_type VARCHAR(100) NOT NULL, -- 'general_liability', 'workers_comp', 'auto', 'umbrella', 'professional'
    
    -- Amounts
    coverage_amount DECIMAL(15,2),
    deductible DECIMAL(15,2),
    
    -- Dates
    effective_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    
    -- Certificate holder
    certificate_holder VARCHAR(255), -- Should list your entity
    additional_insured BOOLEAN DEFAULT false,
    
    -- Verification
    verified BOOLEAN DEFAULT false,
    verified_date DATE,
    verified_by_id UUID REFERENCES users(id),
    
    -- Document
    document_id UUID REFERENCES documents(id),
    
    -- Status
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'expiring', 'expired', 'renewed'
    
    -- Alerts
    alert_sent_30_days BOOLEAN DEFAULT false,
    alert_sent_14_days BOOLEAN DEFAULT false,
    alert_sent_7_days BOOLEAN DEFAULT false,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- REPORTING
-- ============================================================

-- Saved reports (templates and saved configurations)
CREATE TABLE report_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    name VARCHAR(100) NOT NULL,
    description TEXT,
    report_type VARCHAR(50) NOT NULL, -- 'project_status', 'budget_variance', 'draw_summary', 'entity_pl', 'custom'
    
    -- Configuration
    config JSONB NOT NULL, -- Stores columns, filters, grouping, etc.
    
    -- Ownership
    created_by_id UUID REFERENCES users(id),
    is_system BOOLEAN DEFAULT false, -- System templates vs user-created
    is_public BOOLEAN DEFAULT false, -- Shared with all users
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scheduled reports
CREATE TABLE scheduled_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES report_templates(id) ON DELETE CASCADE,
    
    -- Schedule
    frequency VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
    day_of_week INTEGER, -- For weekly (0=Sunday)
    day_of_month INTEGER, -- For monthly
    time_of_day TIME DEFAULT '08:00:00',
    
    -- Filters
    project_ids UUID[], -- Specific projects or null for all accessible
    entity_ids UUID[],
    
    -- Recipients
    recipient_user_ids UUID[],
    recipient_emails TEXT[],
    
    -- Delivery
    delivery_method VARCHAR(20) DEFAULT 'email', -- 'email', 'in_app', 'both'
    format VARCHAR(10) DEFAULT 'pdf', -- 'pdf', 'excel', 'csv'
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    last_run_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report runs (history)
CREATE TABLE report_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES report_templates(id),
    scheduled_report_id UUID REFERENCES scheduled_reports(id),
    
    -- Run details
    run_type VARCHAR(20), -- 'manual', 'scheduled'
    run_by_id UUID REFERENCES users(id),
    run_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Parameters used
    parameters JSONB,
    
    -- Output
    output_format VARCHAR(10),
    output_url VARCHAR(500), -- S3/storage link
    row_count INTEGER,
    
    -- Status
    status VARCHAR(20) DEFAULT 'running', -- 'running', 'completed', 'failed'
    error_message TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- SETTINGS & CONFIGURATION
-- ============================================================

-- System settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    setting_type VARCHAR(50), -- 'string', 'number', 'boolean', 'json'
    
    description TEXT,
    is_editable BOOLEAN DEFAULT true,
    
    updated_by_id UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entity settings (per-entity configurations)
CREATE TABLE entity_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    
    setting_key VARCHAR(100) NOT NULL,
    setting_value JSONB NOT NULL,
    
    UNIQUE(entity_id, setting_key)
);

-- Project templates (for creating new projects with preset structure)
CREATE TABLE project_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    name VARCHAR(100) NOT NULL,
    description TEXT,
    project_type project_type,
    
    -- Template content
    budget_template JSONB, -- Default budget categories/line items
    dd_checklist_template JSONB, -- Default due diligence items
    milestone_template JSONB, -- Default milestones
    document_folders_template JSONB, -- Default folder structure
    
    is_active BOOLEAN DEFAULT true,
    created_by_id UUID REFERENCES users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integration settings
CREATE TABLE integration_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    integration_name VARCHAR(50) NOT NULL UNIQUE, -- 'quickbooks', 'sharepoint', 'outlook', 'plaid'
    
    -- Connection status
    is_enabled BOOLEAN DEFAULT false,
    is_connected BOOLEAN DEFAULT false,
    connected_at TIMESTAMP WITH TIME ZONE,
    connected_by_id UUID REFERENCES users(id),
    
    -- Credentials (encrypted)
    credentials JSONB, -- Encrypted OAuth tokens, API keys, etc.
    
    -- Configuration
    config JSONB, -- Integration-specific settings
    
    -- Sync status
    last_sync_at TIMESTAMP WITH TIME ZONE,
    last_sync_status VARCHAR(20),
    last_sync_error TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- GLOBAL SEARCH
-- ============================================================

-- Search index (materialized view for fast full-text search)
CREATE MATERIALIZED VIEW search_index AS
SELECT 
    'project' as entity_type,
    p.id as entity_id,
    p.project_code as code,
    p.name as title,
    p.address || ' ' || p.city || ' ' || p.state as subtitle,
    p.description as content,
    p.id as project_id,
    e.name as entity_name,
    to_tsvector('english', 
        COALESCE(p.project_code, '') || ' ' || 
        COALESCE(p.name, '') || ' ' || 
        COALESCE(p.address, '') || ' ' ||
        COALESCE(p.city, '') || ' ' ||
        COALESCE(p.description, '')
    ) as search_vector
FROM projects p
LEFT JOIN entities e ON p.entity_id = e.id

UNION ALL

SELECT 
    'deal' as entity_type,
    d.id as entity_id,
    d.deal_code as code,
    d.name as title,
    d.address || ' ' || d.city as subtitle,
    d.notes as content,
    NULL as project_id,
    e.name as entity_name,
    to_tsvector('english',
        COALESCE(d.deal_code, '') || ' ' ||
        COALESCE(d.name, '') || ' ' ||
        COALESCE(d.address, '') || ' ' ||
        COALESCE(d.city, '')
    ) as search_vector
FROM deals d
LEFT JOIN entities e ON d.entity_id = e.id

UNION ALL

SELECT 
    'contact' as entity_type,
    c.id as entity_id,
    NULL as code,
    c.full_name as title,
    c.company as subtitle,
    c.email || ' ' || c.phone as content,
    NULL as project_id,
    NULL as entity_name,
    to_tsvector('english',
        COALESCE(c.full_name, '') || ' ' ||
        COALESCE(c.company, '') || ' ' ||
        COALESCE(c.email, '')
    ) as search_vector
FROM contacts c

UNION ALL

SELECT 
    'document' as entity_type,
    d.id as entity_id,
    NULL as code,
    d.file_name as title,
    d.folder_path as subtitle,
    d.description as content,
    d.project_id,
    NULL as entity_name,
    to_tsvector('english',
        COALESCE(d.file_name, '') || ' ' ||
        COALESCE(d.description, '') || ' ' ||
        COALESCE(d.folder_path, '')
    ) as search_vector
FROM documents d;

-- Index for fast full-text search
CREATE INDEX idx_search_vector ON search_index USING GIN(search_vector);

-- Function to refresh search index
CREATE OR REPLACE FUNCTION refresh_search_index()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY search_index;
END;
$$ LANGUAGE plpgsql;

-- Global search function
CREATE OR REPLACE FUNCTION global_search(
    p_query TEXT,
    p_user_id UUID,
    p_entity_types TEXT[] DEFAULT NULL,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    entity_type TEXT,
    entity_id UUID,
    code TEXT,
    title TEXT,
    subtitle TEXT,
    project_id UUID,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        si.entity_type,
        si.entity_id,
        si.code,
        si.title,
        si.subtitle,
        si.project_id,
        ts_rank(si.search_vector, plainto_tsquery('english', p_query)) as rank
    FROM search_index si
    WHERE si.search_vector @@ plainto_tsquery('english', p_query)
    AND (p_entity_types IS NULL OR si.entity_type = ANY(p_entity_types))
    AND (
        si.project_id IS NULL 
        OR si.project_id IN (SELECT project_id FROM get_user_projects(p_user_id))
    )
    ORDER BY rank DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ISSUE TRACKING
-- ============================================================

CREATE TABLE issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Identification
    issue_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Classification
    category issue_category NOT NULL,
    priority issue_priority DEFAULT 'medium',
    status issue_status DEFAULT 'open',
    
    -- Assignment
    reported_by_id UUID REFERENCES users(id),
    assigned_to_id UUID REFERENCES users(id),
    
    -- Related items
    related_tab VARCHAR(50), -- Which project tab this relates to
    related_entity_type VARCHAR(50), -- 'contract', 'vendor', 'milestone', etc.
    related_entity_id UUID,
    
    -- Location (for construction issues)
    location_description VARCHAR(255), -- e.g., "Building A, Unit 203, Kitchen"
    lot_number VARCHAR(20),
    
    -- Dates
    reported_date DATE DEFAULT CURRENT_DATE,
    due_date DATE,
    resolved_date DATE,
    closed_date DATE,
    
    -- Resolution
    resolution_notes TEXT,
    root_cause TEXT,
    preventive_action TEXT,
    
    -- Cost impact
    estimated_cost DECIMAL(15,2),
    actual_cost DECIMAL(15,2),
    
    -- Schedule impact
    days_delayed INTEGER DEFAULT 0,
    
    -- Documents
    photo_document_ids UUID[], -- Array of document IDs
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(project_id, issue_number)
);

-- Issue comments/updates
CREATE TABLE issue_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
    
    user_id UUID REFERENCES users(id),
    comment TEXT NOT NULL,
    
    -- Status change (if this comment changed status)
    old_status issue_status,
    new_status issue_status,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- INSPECTIONS (Enhanced)
-- ============================================================

DROP TABLE IF EXISTS inspections CASCADE;
CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Identification
    inspection_number INTEGER,
    inspection_type inspection_type NOT NULL,
    name VARCHAR(255), -- Custom name if needed
    
    -- Scheduling
    scheduled_date DATE,
    scheduled_time TIME,
    actual_date DATE,
    
    -- Inspector
    inspector_name VARCHAR(255),
    inspector_company VARCHAR(255),
    inspector_contact_id UUID REFERENCES contacts(id),
    inspector_phone VARCHAR(20),
    
    -- Location
    location_description VARCHAR(255),
    lot_ids UUID[], -- Array of lot/property IDs if specific lots
    
    -- Results
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'passed', 'failed', 'conditional', 'cancelled'
    result_notes TEXT,
    
    -- Failed inspection details
    deficiencies TEXT[],
    reinspection_required BOOLEAN DEFAULT false,
    reinspection_date DATE,
    reinspection_id UUID, -- Link to reinspection record
    
    -- Documents
    report_document_id UUID REFERENCES documents(id),
    photo_document_ids UUID[],
    
    -- Fees
    inspection_fee DECIMAL(10,2),
    reinspection_fee DECIMAL(10,2),
    
    -- Related
    milestone_id UUID REFERENCES milestones(id),
    draw_id UUID REFERENCES draws(id), -- If inspection tied to draw
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- PROFORMA & FINANCIAL MODELING
-- ============================================================

CREATE TABLE proformas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Identification
    version_number INTEGER DEFAULT 1,
    name VARCHAR(100), -- e.g., "Initial Underwriting", "Revised Q2"
    is_active BOOLEAN DEFAULT true, -- Current working proforma
    
    -- Project assumptions
    total_units INTEGER,
    total_sf DECIMAL(12,2),
    land_acres DECIMAL(10,4),
    
    -- Timeline
    construction_months INTEGER,
    lease_up_months INTEGER,
    stabilization_date DATE,
    hold_period_years INTEGER,
    
    -- Revenue assumptions (for rental)
    avg_rent_per_unit DECIMAL(10,2),
    avg_rent_per_sf DECIMAL(6,2),
    vacancy_rate DECIMAL(5,2),
    annual_rent_growth DECIMAL(5,2),
    other_income_per_unit DECIMAL(10,2),
    
    -- Revenue assumptions (for sale)
    avg_sale_price_per_unit DECIMAL(12,2),
    avg_sale_price_per_sf DECIMAL(8,2),
    absorption_units_per_month INTEGER,
    
    -- Operating expenses (for rental)
    operating_expense_per_unit DECIMAL(10,2),
    operating_expense_ratio DECIMAL(5,2),
    property_tax_rate DECIMAL(5,4),
    insurance_per_unit DECIMAL(10,2),
    management_fee_percent DECIMAL(5,2),
    replacement_reserves_per_unit DECIMAL(10,2),
    
    -- Financing assumptions
    construction_loan_ltc DECIMAL(5,2),
    construction_loan_rate DECIMAL(5,2),
    perm_loan_ltv DECIMAL(5,2),
    perm_loan_rate DECIMAL(5,2),
    perm_loan_term_years INTEGER,
    perm_loan_amort_years INTEGER,
    
    -- Exit assumptions
    exit_cap_rate DECIMAL(5,2),
    sale_costs_percent DECIMAL(5,2),
    
    -- Calculated outputs (stored for quick access)
    total_development_cost DECIMAL(15,2),
    total_revenue DECIMAL(15,2),
    net_operating_income DECIMAL(15,2),
    debt_service_coverage DECIMAL(6,2),
    yield_on_cost DECIMAL(5,2),
    cash_on_cash_return DECIMAL(5,2),
    irr_levered DECIMAL(5,2),
    irr_unlevered DECIMAL(5,2),
    equity_multiple DECIMAL(5,2),
    profit_margin DECIMAL(5,2),
    
    -- Sources
    sources_json JSONB, -- Detailed sources breakdown
    -- Uses
    uses_json JSONB, -- Detailed uses breakdown
    -- Cash flows
    cash_flows_json JSONB, -- Year-by-year cash flows
    
    notes TEXT,
    
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proforma line items (detailed breakdown)
CREATE TABLE proforma_line_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proforma_id UUID REFERENCES proformas(id) ON DELETE CASCADE,
    
    section VARCHAR(50), -- 'sources', 'uses', 'revenue', 'expenses'
    category VARCHAR(100),
    line_item VARCHAR(255),
    
    amount DECIMAL(15,2),
    per_unit DECIMAL(10,2),
    per_sf DECIMAL(8,2),
    percent_of_total DECIMAL(5,2),
    
    sort_order INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- RETAINAGE TRACKING
-- ============================================================

CREATE TABLE retainage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Related records
    vendor_id UUID REFERENCES contacts(id),
    contract_id UUID REFERENCES contracts(id),
    bill_id UUID REFERENCES bills(id),
    draw_id UUID REFERENCES draws(id),
    
    -- Amounts
    original_amount DECIMAL(15,2) NOT NULL,
    amount_released DECIMAL(15,2) DEFAULT 0,
    amount_remaining DECIMAL(15,2) GENERATED ALWAYS AS (original_amount - amount_released) STORED,
    
    -- Dates
    held_date DATE NOT NULL,
    scheduled_release_date DATE,
    actual_release_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'held', -- 'held', 'partial_release', 'released'
    
    -- Release conditions
    release_conditions TEXT,
    conditions_met BOOLEAN DEFAULT false,
    
    -- Release tracking
    released_by_id UUID REFERENCES users(id),
    release_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- WARRANTY TRACKING
-- ============================================================

CREATE TABLE warranties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- What's covered
    warranty_type VARCHAR(100), -- 'structural', 'mechanical', 'roofing', 'appliances', 'general'
    description TEXT,
    
    -- Coverage
    contractor_id UUID REFERENCES contacts(id),
    contract_id UUID REFERENCES contracts(id),
    
    -- Property/Unit specific (if applicable)
    property_id UUID REFERENCES properties(id),
    unit_number VARCHAR(20),
    
    -- Dates
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Terms
    coverage_terms TEXT,
    exclusions TEXT,
    
    -- Documents
    warranty_document_id UUID REFERENCES documents(id),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'expiring', 'expired', 'claimed'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Warranty claims
CREATE TABLE warranty_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warranty_id UUID REFERENCES warranties(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Claim details
    claim_number INTEGER,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Location
    location_description VARCHAR(255),
    unit_number VARCHAR(20),
    
    -- Dates
    reported_date DATE DEFAULT CURRENT_DATE,
    scheduled_repair_date DATE,
    completed_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'scheduled', 'in_progress', 'completed', 'denied'
    
    -- Resolution
    resolution_notes TEXT,
    repair_cost DECIMAL(10,2),
    covered_by_warranty BOOLEAN,
    
    -- Related
    issue_id UUID REFERENCES issues(id), -- Link to issue if created from issue
    
    -- Documents
    photo_document_ids UUID[],
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CONSTRUCTION PROGRESS PHOTOS
-- ============================================================

CREATE TABLE progress_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Photo details
    document_id UUID REFERENCES documents(id),
    
    -- When/Where
    photo_date DATE NOT NULL,
    photo_time TIME,
    location_description VARCHAR(255),
    lot_number VARCHAR(20),
    
    -- What
    category VARCHAR(100), -- 'site_work', 'foundation', 'framing', 'exterior', 'interior', 'aerial', etc.
    description TEXT,
    
    -- Tagging
    tags TEXT[],
    
    -- Related items
    milestone_id UUID REFERENCES milestones(id),
    draw_id UUID REFERENCES draws(id),
    inspection_id UUID REFERENCES inspections(id),
    
    -- Metadata
    taken_by_id UUID REFERENCES users(id),
    gps_latitude DECIMAL(10,8),
    gps_longitude DECIMAL(11,8),
    
    -- Display
    is_featured BOOLEAN DEFAULT false, -- Show on project dashboard
    sort_order INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- VENDOR PREQUALIFICATION
-- ============================================================

CREATE TABLE vendor_prequalification (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'conditional', 'rejected', 'expired'
    approved_date DATE,
    expiration_date DATE,
    
    -- Financial
    annual_revenue DECIMAL(15,2),
    bonding_capacity DECIMAL(15,2),
    bank_reference_verified BOOLEAN DEFAULT false,
    
    -- Safety
    emr_rate DECIMAL(4,2), -- Experience Modification Rate
    osha_citations INTEGER DEFAULT 0,
    safety_program_verified BOOLEAN DEFAULT false,
    
    -- Qualifications
    years_in_business INTEGER,
    similar_projects_completed INTEGER,
    largest_project_value DECIMAL(15,2),
    
    -- Documents required
    w9_received BOOLEAN DEFAULT false,
    insurance_verified BOOLEAN DEFAULT false,
    license_verified BOOLEAN DEFAULT false,
    references_verified BOOLEAN DEFAULT false,
    financial_statement_received BOOLEAN DEFAULT false,
    
    -- Notes
    notes TEXT,
    rejection_reason TEXT,
    
    -- Approval
    reviewed_by_id UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Preferred vendors (approved for specific work types)
CREATE TABLE preferred_vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    
    trade_category VARCHAR(100) NOT NULL, -- 'plumbing', 'electrical', 'framing', etc.
    
    -- Rating
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    performance_notes TEXT,
    
    -- Pricing
    typical_unit_price DECIMAL(10,2),
    pricing_notes TEXT,
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(vendor_id, trade_category)
);

-- ============================================================
-- BID MANAGEMENT
-- ============================================================

-- Bid packages (what we're soliciting bids for)
CREATE TABLE bid_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Identification
    package_number VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Scope
    trade_category VARCHAR(100),
    scope_document_id UUID REFERENCES documents(id),
    drawings_document_ids UUID[],
    
    -- Budget
    budget_estimate DECIMAL(15,2),
    budget_item_id UUID REFERENCES budget_items(id),
    
    -- Timeline
    issue_date DATE,
    questions_due_date DATE,
    bid_due_date DATE,
    award_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'issued', 'closed', 'awarded', 'cancelled'
    
    -- Awarded
    awarded_vendor_id UUID REFERENCES contacts(id),
    awarded_amount DECIMAL(15,2),
    contract_id UUID REFERENCES contracts(id),
    
    notes TEXT,
    
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bid invitations (who we invited to bid)
CREATE TABLE bid_invitations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_package_id UUID REFERENCES bid_packages(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES contacts(id),
    
    -- Invitation
    invited_date DATE,
    invited_by_id UUID REFERENCES users(id),
    
    -- Response
    responded BOOLEAN DEFAULT false,
    will_bid BOOLEAN,
    decline_reason TEXT,
    
    -- Communication
    reminder_sent BOOLEAN DEFAULT false,
    reminder_sent_date DATE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bids received
CREATE TABLE bids (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bid_package_id UUID REFERENCES bid_packages(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES contacts(id),
    
    -- Bid details
    bid_amount DECIMAL(15,2) NOT NULL,
    alternate_amounts JSONB, -- For alternate/add-on pricing
    
    -- Timeline
    received_date DATE,
    valid_until DATE,
    
    -- Evaluation
    status bid_status DEFAULT 'received',
    
    -- Scoring (if using weighted evaluation)
    price_score DECIMAL(5,2),
    qualification_score DECIMAL(5,2),
    schedule_score DECIMAL(5,2),
    total_score DECIMAL(5,2),
    
    -- Analysis
    variance_from_budget DECIMAL(15,2),
    variance_percent DECIMAL(5,2),
    
    -- Notes
    exclusions TEXT,
    clarifications TEXT,
    evaluation_notes TEXT,
    
    -- Documents
    bid_document_id UUID REFERENCES documents(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- MEETING NOTES / MINUTES
-- ============================================================

CREATE TABLE meetings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Meeting details
    meeting_type VARCHAR(100), -- 'oac', 'weekly_coordination', 'subcontractor', 'investor', 'design', 'safety'
    title VARCHAR(255) NOT NULL,
    
    -- When/Where
    meeting_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),
    virtual_link VARCHAR(500),
    
    -- Attendees
    attendee_user_ids UUID[],
    attendee_contact_ids UUID[],
    attendees_text TEXT, -- Freeform for external attendees
    
    -- Content
    agenda TEXT,
    minutes TEXT,
    decisions TEXT,
    
    -- Documents
    agenda_document_id UUID REFERENCES documents(id),
    minutes_document_id UUID REFERENCES documents(id),
    attachment_document_ids UUID[],
    
    -- Recurrence
    is_recurring BOOLEAN DEFAULT false,
    recurrence_rule VARCHAR(100),
    
    -- Status
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled'
    
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meeting action items
CREATE TABLE meeting_action_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
    
    -- Action item
    description TEXT NOT NULL,
    
    -- Assignment
    assigned_to_id UUID REFERENCES users(id),
    assigned_to_contact_id UUID REFERENCES contacts(id),
    assigned_to_name VARCHAR(255), -- If not in system
    
    -- Dates
    due_date DATE,
    completed_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'open', -- 'open', 'in_progress', 'completed', 'cancelled'
    
    -- Link to task (if converted to formal task)
    task_id UUID REFERENCES tasks(id),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- RFIs (Request for Information)
-- ============================================================

CREATE TABLE rfis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Identification
    rfi_number INTEGER NOT NULL,
    subject VARCHAR(255) NOT NULL,
    
    -- Question
    question TEXT NOT NULL,
    
    -- Context
    spec_section VARCHAR(50),
    drawing_reference VARCHAR(100),
    location_description VARCHAR(255),
    
    -- From/To
    submitted_by_id UUID REFERENCES users(id),
    submitted_by_contact_id UUID REFERENCES contacts(id),
    assigned_to_id UUID REFERENCES users(id),
    assigned_to_contact_id UUID REFERENCES contacts(id), -- e.g., Architect
    
    -- Dates
    submitted_date DATE DEFAULT CURRENT_DATE,
    response_due_date DATE,
    response_date DATE,
    
    -- Response
    response TEXT,
    responded_by_id UUID REFERENCES users(id),
    responded_by_contact_id UUID REFERENCES contacts(id),
    
    -- Status
    status rfi_status DEFAULT 'draft',
    
    -- Impact
    cost_impact DECIMAL(15,2),
    schedule_impact_days INTEGER,
    
    -- Documents
    attachment_document_ids UUID[],
    
    -- Related
    contract_id UUID REFERENCES contracts(id),
    change_order_id UUID REFERENCES change_orders(id), -- If RFI resulted in CO
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(project_id, rfi_number)
);

-- ============================================================
-- SUBMITTALS
-- ============================================================

CREATE TABLE submittals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Identification
    submittal_number VARCHAR(50) NOT NULL,
    revision INTEGER DEFAULT 0,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Categorization
    spec_section VARCHAR(50),
    category VARCHAR(100), -- 'product_data', 'shop_drawings', 'samples', 'mock_ups'
    
    -- From
    submitted_by_contact_id UUID REFERENCES contacts(id), -- Subcontractor
    contract_id UUID REFERENCES contracts(id),
    
    -- Review chain
    reviewer_contact_id UUID REFERENCES contacts(id), -- Architect/Engineer
    
    -- Dates
    submitted_date DATE,
    required_date DATE,
    review_due_date DATE,
    reviewed_date DATE,
    
    -- Status
    status submittal_status DEFAULT 'pending',
    
    -- Review
    reviewed_by_id UUID REFERENCES users(id),
    reviewed_by_contact_id UUID REFERENCES contacts(id),
    review_comments TEXT,
    
    -- Resubmittal
    resubmittal_required BOOLEAN DEFAULT false,
    original_submittal_id UUID REFERENCES submittals(id),
    
    -- Documents
    submittal_document_id UUID REFERENCES documents(id),
    response_document_id UUID REFERENCES documents(id),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(project_id, submittal_number, revision)
);

-- ============================================================
-- PRODUCT LIBRARY (House Plans & Products)
-- ============================================================

-- House plans / product types
CREATE TABLE product_library (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identification
    product_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Classification
    product_type VARCHAR(50), -- 'house_plan', 'townhome', 'apartment', 'commercial'
    category VARCHAR(100), -- 'for_sale', 'btr', 'affordable', 'market_rate'
    series VARCHAR(100), -- Product series/line
    style VARCHAR(100), -- 'craftsman', 'modern', 'traditional', 'farmhouse', 'coastal'
    
    -- Specifications
    bedrooms INTEGER,
    bathrooms DECIMAL(3,1),
    half_baths INTEGER,
    stories INTEGER DEFAULT 1,
    garage_spaces INTEGER DEFAULT 0,
    garage_type VARCHAR(50), -- 'attached', 'detached', 'carport', 'none'
    
    -- Size
    total_sf INTEGER,
    heated_sf INTEGER,
    garage_sf INTEGER,
    porch_sf INTEGER,
    patio_sf INTEGER,
    bonus_room_sf INTEGER,
    
    -- Dimensions
    width_feet DECIMAL(8,2),
    depth_feet DECIMAL(8,2),
    height_feet DECIMAL(8,2),
    
    -- Lot requirements
    min_lot_width DECIMAL(8,2),
    min_lot_depth DECIMAL(8,2),
    min_lot_sf INTEGER,
    setback_front DECIMAL(6,2),
    setback_rear DECIMAL(6,2),
    setback_side DECIMAL(6,2),
    
    -- Costs (baseline estimates)
    base_construction_cost DECIMAL(12,2),
    cost_per_sf DECIMAL(8,2),
    typical_lot_cost DECIMAL(12,2),
    total_development_cost DECIMAL(12,2),
    
    -- Revenue (baseline estimates)
    target_sale_price DECIMAL(12,2),
    target_rent_monthly DECIMAL(10,2),
    
    -- Performance metrics
    target_margin_percent DECIMAL(5,2),
    target_yield_percent DECIMAL(5,2),
    
    -- Features
    features JSONB, -- Array of features/amenities
    standard_features TEXT, -- Description of what's included standard
    
    -- Primary images (quick access)
    primary_photo_url VARCHAR(500),
    primary_rendering_url VARCHAR(500),
    primary_floorplan_url VARCHAR(500),
    
    -- AI Analysis
    ai_market_fit_score DECIMAL(5,2),
    ai_analysis_json JSONB, -- Store AI analysis results
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_archived BOOLEAN DEFAULT false,
    
    -- Metadata
    architect VARCHAR(255),
    plan_source VARCHAR(255), -- Where plan came from
    year_designed INTEGER,
    
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product images (photos, renderings, marketing images)
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES product_library(id) ON DELETE CASCADE,
    
    -- Image type
    image_type VARCHAR(50) NOT NULL, -- 'photo', 'rendering', 'marketing', 'lifestyle', 'aerial'
    
    -- Details
    title VARCHAR(255),
    description TEXT,
    
    -- File info
    file_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    file_name VARCHAR(255),
    file_size INTEGER,
    width_px INTEGER,
    height_px INTEGER,
    
    -- Context
    elevation VARCHAR(100), -- Which elevation this shows (if applicable)
    view_angle VARCHAR(100), -- 'front', 'rear', 'left', 'right', 'aerial', 'interior'
    room VARCHAR(100), -- If interior shot: 'kitchen', 'living', 'master', etc.
    
    -- Display
    is_primary BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    
    -- Usage rights
    usage_rights TEXT,
    photographer VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product floor plans
CREATE TABLE product_floor_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES product_library(id) ON DELETE CASCADE,
    
    -- Plan identification
    name VARCHAR(255) NOT NULL, -- 'Main Floor', 'Second Floor', 'Basement', 'Full Plan'
    floor_number INTEGER, -- 1, 2, 3, 0 for basement
    
    -- File info
    file_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    file_name VARCHAR(255),
    file_type VARCHAR(20), -- 'pdf', 'dwg', 'png', 'jpg'
    
    -- Details
    description TEXT,
    square_footage INTEGER, -- SF for this floor
    
    -- Dimensions shown
    shows_dimensions BOOLEAN DEFAULT true,
    shows_furniture BOOLEAN DEFAULT false,
    
    -- Version control
    version VARCHAR(20),
    revision_date DATE,
    
    -- Display
    is_primary BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product elevations (exterior designs)
CREATE TABLE product_elevations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES product_library(id) ON DELETE CASCADE,
    
    -- Elevation identification
    elevation_code VARCHAR(20) NOT NULL, -- 'A', 'B', 'C', 'D' or 'Craftsman', 'Modern', etc.
    name VARCHAR(255) NOT NULL, -- 'Craftsman', 'Traditional', 'Modern Farmhouse'
    description TEXT,
    
    -- Pricing
    base_price_adder DECIMAL(10,2) DEFAULT 0, -- Additional cost vs base
    is_standard BOOLEAN DEFAULT false, -- Is this the default/base elevation
    
    -- Style details
    style VARCHAR(100), -- 'craftsman', 'traditional', 'modern', etc.
    exterior_materials JSONB, -- Array of materials: siding, brick, stone, etc.
    roof_style VARCHAR(100), -- 'gable', 'hip', 'shed', 'flat'
    roof_material VARCHAR(100), -- 'shingle', 'metal', 'tile'
    
    -- Images
    rendering_url VARCHAR(500),
    photo_url VARCHAR(500), -- If built example exists
    line_drawing_url VARCHAR(500),
    
    -- Color schemes available
    color_schemes JSONB, -- Array of available color combinations
    
    -- Display
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(product_id, elevation_code)
);

-- Product upgrade packages
CREATE TABLE product_upgrade_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES product_library(id) ON DELETE CASCADE,
    
    -- Package identification
    package_code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL, -- 'Designer Kitchen', 'Spa Bath', 'Smart Home', 'Energy Plus'
    description TEXT,
    
    -- Category
    category VARCHAR(100), -- 'kitchen', 'bath', 'flooring', 'exterior', 'smart_home', 'energy', 'structural'
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2), -- Our cost
    margin_percent DECIMAL(5,2),
    
    -- What's included (detailed)
    inclusions JSONB, -- Array of {item, description, value}
    
    -- Imagery
    image_url VARCHAR(500),
    gallery_urls TEXT[], -- Array of image URLs
    
    -- Availability
    is_standard BOOLEAN DEFAULT false, -- Included in base price
    is_popular BOOLEAN DEFAULT false, -- Highlight as popular choice
    is_active BOOLEAN DEFAULT true,
    
    -- Restrictions
    required_with_package_ids UUID[], -- Must select these packages too
    incompatible_with_package_ids UUID[], -- Cannot select with these
    elevation_specific BOOLEAN DEFAULT false, -- Only available with certain elevations
    available_elevation_ids UUID[], -- If elevation_specific, which ones
    
    -- Display
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(product_id, package_code)
);

-- Individual upgrade options (line items within packages or standalone)
CREATE TABLE product_upgrade_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES product_library(id) ON DELETE CASCADE,
    package_id UUID REFERENCES product_upgrade_packages(id) ON DELETE SET NULL,
    
    -- Option identification
    option_code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Category
    category VARCHAR(100), -- 'appliances', 'cabinets', 'countertops', 'flooring', 'fixtures', 'electrical', 'plumbing'
    subcategory VARCHAR(100),
    room VARCHAR(100), -- 'kitchen', 'master_bath', 'all_baths', 'throughout', etc.
    
    -- Pricing
    price DECIMAL(10,2) NOT NULL,
    cost DECIMAL(10,2),
    price_type VARCHAR(20) DEFAULT 'fixed', -- 'fixed', 'per_sf', 'per_unit'
    
    -- Details
    specifications TEXT,
    brand VARCHAR(100),
    model VARCHAR(100),
    color_options JSONB, -- Available colors/finishes
    
    -- Imagery
    image_url VARCHAR(500),
    swatch_url VARCHAR(500), -- For materials/finishes
    
    -- Availability
    is_standard BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    lead_time_days INTEGER, -- If special order
    
    -- Display
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(product_id, option_code)
);

-- Product documents (specs, CAD files, etc.)
CREATE TABLE product_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES product_library(id) ON DELETE CASCADE,
    
    -- Document type
    document_type VARCHAR(50) NOT NULL, -- 'spec_sheet', 'cad_file', 'structural', 'mep', 'permit_set', 'marketing', 'price_sheet'
    
    -- Details
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- File info
    file_url VARCHAR(500) NOT NULL,
    file_name VARCHAR(255),
    file_type VARCHAR(20), -- 'pdf', 'dwg', 'doc', 'xls'
    file_size INTEGER,
    
    -- Version
    version VARCHAR(20),
    revision_date DATE,
    
    -- Access control
    is_public BOOLEAN DEFAULT false, -- Can be shared with buyers
    is_internal BOOLEAN DEFAULT true, -- Internal use only
    
    -- Display
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product cost breakdown
CREATE TABLE product_cost_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES product_library(id) ON DELETE CASCADE,
    
    category VARCHAR(100),
    line_item VARCHAR(255),
    
    base_cost DECIMAL(12,2),
    cost_per_sf DECIMAL(8,2),
    
    -- Detailed breakdown
    labor_cost DECIMAL(12,2),
    material_cost DECIMAL(12,2),
    
    -- Notes
    notes TEXT,
    vendor VARCHAR(255),
    
    sort_order INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product usage tracking (which projects used which products)
CREATE TABLE product_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES product_library(id),
    project_id UUID REFERENCES projects(id),
    property_id UUID REFERENCES properties(id),
    lot_development_id UUID REFERENCES lot_development(id),
    
    -- Configuration used
    elevation_id UUID REFERENCES product_elevations(id),
    selected_package_ids UUID[], -- Which upgrade packages selected
    selected_option_ids UUID[], -- Which individual options selected
    
    -- Customizations
    customizations JSONB, -- Any one-off changes
    customization_cost DECIMAL(12,2),
    
    -- Actual financials (for benchmarking)
    actual_base_cost DECIMAL(12,2),
    actual_upgrade_cost DECIMAL(12,2),
    actual_total_cost DECIMAL(12,2),
    actual_sale_price DECIMAL(12,2),
    actual_rent DECIMAL(10,2),
    
    -- Performance
    days_on_market INTEGER,
    buyer_satisfaction_score INTEGER,
    
    -- Dates
    construction_start DATE,
    construction_complete DATE,
    sale_date DATE,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- LOT DEVELOPMENT (For Scattered Lot / For Sale)
-- ============================================================

-- Enhanced properties table with lot development details
CREATE TABLE lot_development (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Lot identification
    lot_number VARCHAR(20) NOT NULL,
    block VARCHAR(20),
    phase VARCHAR(20),
    
    -- Dimensions
    lot_width DECIMAL(8,2),
    lot_depth DECIMAL(8,2),
    lot_sf INTEGER,
    lot_acres DECIMAL(10,4),
    
    -- Shape/Topography
    lot_shape VARCHAR(50), -- 'rectangular', 'pie', 'flag', 'irregular'
    topography VARCHAR(50), -- 'flat', 'sloped', 'steep'
    slope_direction VARCHAR(20), -- 'front_to_back', 'back_to_front', 'left_to_right', etc.
    
    -- Zoning
    zoning_code VARCHAR(50),
    zoning_description TEXT,
    max_building_coverage DECIMAL(5,2), -- Percentage
    max_impervious_coverage DECIMAL(5,2),
    max_height_feet DECIMAL(6,2),
    max_stories INTEGER,
    
    -- Setbacks
    setback_front DECIMAL(6,2),
    setback_rear DECIMAL(6,2),
    setback_side_left DECIMAL(6,2),
    setback_side_right DECIMAL(6,2),
    setback_corner DECIMAL(6,2),
    
    -- Buildable area (calculated or manual)
    buildable_width DECIMAL(8,2),
    buildable_depth DECIMAL(8,2),
    buildable_sf INTEGER,
    
    -- Utilities
    water_available BOOLEAN DEFAULT true,
    sewer_available BOOLEAN DEFAULT true,
    gas_available BOOLEAN DEFAULT true,
    electric_provider VARCHAR(100),
    water_tap_fee DECIMAL(10,2),
    sewer_tap_fee DECIMAL(10,2),
    impact_fees DECIMAL(10,2),
    
    -- HOA
    hoa_name VARCHAR(255),
    hoa_fee_monthly DECIMAL(10,2),
    hoa_transfer_fee DECIMAL(10,2),
    architectural_review_required BOOLEAN DEFAULT false,
    
    -- Product assignment
    assigned_product_id UUID REFERENCES product_library(id),
    elevation_selected VARCHAR(100),
    
    -- AI recommendation
    ai_recommended_product_id UUID REFERENCES product_library(id),
    ai_recommendation_score DECIMAL(5,2),
    ai_recommendation_notes TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'available', -- 'available', 'reserved', 'under_contract', 'permit', 'construction', 'complete', 'sold'
    
    -- Dates
    acquired_date DATE,
    permit_date DATE,
    construction_start DATE,
    construction_complete DATE,
    closing_date DATE,
    
    -- Financials
    lot_cost DECIMAL(12,2),
    development_cost DECIMAL(12,2),
    construction_cost DECIMAL(12,2),
    total_cost DECIMAL(12,2),
    list_price DECIMAL(12,2),
    sale_price DECIMAL(12,2),
    
    -- Buyer
    buyer_name VARCHAR(255),
    buyer_contact_id UUID REFERENCES contacts(id),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- AI CAPABILITIES
-- ============================================================

-- AI Tasks queue
CREATE TABLE ai_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Task type and context
    task_type ai_task_type NOT NULL,
    
    -- Related entities
    deal_id UUID REFERENCES deals(id),
    project_id UUID REFERENCES projects(id),
    lot_development_id UUID REFERENCES lot_development(id),
    product_id UUID REFERENCES product_library(id),
    
    -- Request
    requested_by_id UUID REFERENCES users(id),
    request_parameters JSONB, -- Input parameters for the AI task
    prompt_used TEXT, -- Store the actual prompt for debugging
    
    -- Status
    status ai_task_status DEFAULT 'queued',
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Results
    result_json JSONB, -- Structured results
    result_summary TEXT, -- Human-readable summary
    confidence_score DECIMAL(5,2),
    
    -- Error handling
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- Usage tracking
    tokens_used INTEGER,
    model_used VARCHAR(100),
    cost_estimate DECIMAL(10,4),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI Analysis results (cached for quick access)
CREATE TABLE ai_analysis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- What was analyzed
    entity_type VARCHAR(50) NOT NULL, -- 'deal', 'project', 'lot', 'product'
    entity_id UUID NOT NULL,
    analysis_type VARCHAR(100) NOT NULL, -- 'feasibility', 'market_comp', 'risk', 'product_fit'
    
    -- Results
    analysis_json JSONB NOT NULL,
    summary TEXT,
    score DECIMAL(5,2),
    
    -- Recommendations
    recommendations JSONB, -- Array of recommendations
    
    -- Validity
    is_current BOOLEAN DEFAULT true,
    valid_until DATE,
    
    -- Source
    ai_task_id UUID REFERENCES ai_tasks(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(entity_type, entity_id, analysis_type)
);

-- AI Research library (cached research results)
CREATE TABLE ai_research (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Topic
    research_type VARCHAR(100), -- 'zoning', 'market', 'comps', 'demographics', 'permits'
    location_city VARCHAR(100),
    location_county VARCHAR(100),
    location_state VARCHAR(2),
    location_zip VARCHAR(10),
    
    -- Content
    research_json JSONB NOT NULL,
    summary TEXT,
    
    -- Sources
    sources JSONB, -- Array of source URLs/references
    
    -- Validity
    is_current BOOLEAN DEFAULT true,
    valid_until DATE,
    
    -- Usage
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP WITH TIME ZONE,
    
    ai_task_id UUID REFERENCES ai_tasks(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI conversation history (for chat-based interactions)
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    user_id UUID REFERENCES users(id),
    
    -- Context
    deal_id UUID REFERENCES deals(id),
    project_id UUID REFERENCES projects(id),
    
    -- Conversation
    title VARCHAR(255),
    messages JSONB NOT NULL, -- Array of {role, content, timestamp}
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- AI WORKFLOW AUTOMATIONS
-- ============================================================

CREATE TABLE ai_workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Trigger
    trigger_type VARCHAR(50), -- 'deal_created', 'deal_status_change', 'project_created', 'scheduled', 'manual'
    trigger_conditions JSONB, -- Conditions that must be met
    
    -- Tasks to run
    tasks JSONB NOT NULL, -- Array of {task_type, parameters}
    
    -- Settings
    is_active BOOLEAN DEFAULT true,
    run_automatically BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI workflow runs
CREATE TABLE ai_workflow_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES ai_workflows(id),
    
    -- Trigger context
    triggered_by VARCHAR(50), -- 'auto', 'manual', 'scheduled'
    triggered_by_user_id UUID REFERENCES users(id),
    trigger_entity_type VARCHAR(50),
    trigger_entity_id UUID,
    
    -- Status
    status VARCHAR(50) DEFAULT 'running', -- 'running', 'completed', 'partial', 'failed'
    
    -- Tasks
    task_results JSONB, -- Array of task results
    
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    error_message TEXT
);

-- ============================================================
-- AI-POWERED FUNCTIONS
-- ============================================================

-- Function to queue AI analysis for a deal
CREATE OR REPLACE FUNCTION queue_deal_analysis(p_deal_id UUID, p_user_id UUID)
RETURNS UUID AS $$
DECLARE
    v_task_id UUID;
BEGIN
    INSERT INTO ai_tasks (
        task_type, deal_id, requested_by_id, status,
        request_parameters
    ) VALUES (
        'deal_analysis',
        p_deal_id,
        p_user_id,
        'queued',
        jsonb_build_object(
            'analyses_requested', ARRAY['feasibility', 'market_comp', 'zoning_research', 'product_recommendation']
        )
    )
    RETURNING id INTO v_task_id;
    
    -- Notify that task is queued (would trigger edge function)
    PERFORM pg_notify('ai_task_queued', json_build_object('task_id', v_task_id)::text);
    
    RETURN v_task_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get AI product recommendation for a lot
CREATE OR REPLACE FUNCTION get_lot_product_recommendation(p_lot_id UUID, p_user_id UUID)
RETURNS UUID AS $$
DECLARE
    v_task_id UUID;
BEGIN
    INSERT INTO ai_tasks (
        task_type, lot_development_id, requested_by_id, status,
        request_parameters
    ) VALUES (
        'product_recommendation',
        p_lot_id,
        p_user_id,
        'queued',
        jsonb_build_object(
            'consider_zoning', true,
            'consider_market', true,
            'consider_costs', true,
            'top_n', 3
        )
    )
    RETURNING id INTO v_task_id;
    
    PERFORM pg_notify('ai_task_queued', json_build_object('task_id', v_task_id)::text);
    
    RETURN v_task_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-queue analysis when deal enters due diligence
CREATE OR REPLACE FUNCTION auto_analyze_deal()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'due_diligence' AND (OLD.status IS NULL OR OLD.status != 'due_diligence') THEN
        PERFORM queue_deal_analysis(NEW.id, NEW.assigned_to_user_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deal_auto_analysis
AFTER INSERT OR UPDATE OF status ON deals
FOR EACH ROW EXECUTE FUNCTION auto_analyze_deal();

-- ============================================================
-- ASSET MANAGEMENT MODULE
-- Portfolio Oversight & Financial Control
-- (PM handles operations, you handle finances and oversight)
-- ============================================================

-- Operating Assets (main table for asset management)
CREATE TABLE assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identification
    asset_code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    
    -- Classification
    asset_type asset_type NOT NULL,
    asset_class VARCHAR(20), -- 'A', 'B', 'C', 'D'
    
    -- Ownership
    entity_id UUID REFERENCES entities(id),
    ownership_percentage DECIMAL(5,2) DEFAULT 100,
    
    -- Origin tracking
    origin_type VARCHAR(50), -- 'acquisition', 'development', 'conversion'
    source_project_id UUID REFERENCES projects(id), -- If converted from project
    source_deal_id UUID REFERENCES deals(id), -- If acquired
    
    -- Status
    status asset_status DEFAULT 'acquisition',
    acquisition_date DATE,
    stabilization_date DATE,
    disposition_date DATE,
    
    -- Location
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(2),
    zip VARCHAR(10),
    county VARCHAR(100),
    market VARCHAR(100), -- MSA or submarket
    submarket VARCHAR(100),
    
    -- Physical
    year_built INTEGER,
    year_renovated INTEGER,
    total_units INTEGER,
    total_sf INTEGER,
    land_acres DECIMAL(10,4),
    stories INTEGER,
    buildings INTEGER,
    parking_spaces INTEGER,
    
    -- Unit mix summary (from PM reports)
    unit_mix_summary JSONB, -- {studio: 10, 1br: 50, 2br: 40, 3br: 20}
    avg_unit_sf INTEGER,
    
    -- Amenities
    amenities JSONB,
    
    -- Financial - Acquisition/Basis
    acquisition_price DECIMAL(15,2),
    acquisition_price_per_unit DECIMAL(12,2),
    acquisition_price_per_sf DECIMAL(10,2),
    acquisition_cap_rate DECIMAL(5,2),
    closing_costs DECIMAL(12,2),
    capex_budget DECIMAL(12,2),
    total_basis DECIMAL(15,2), -- acquisition + closing + capex
    
    -- Financial - Current (updated from imports/valuations)
    current_value DECIMAL(15,2),
    current_value_date DATE,
    
    -- Targets
    target_noi DECIMAL(12,2),
    target_cap_rate DECIMAL(5,2),
    target_value DECIMAL(15,2),
    
    -- Current metrics (from latest PM import)
    current_occupancy DECIMAL(5,2),
    current_avg_rent DECIMAL(10,2),
    current_noi_monthly DECIMAL(12,2),
    current_noi_annual DECIMAL(12,2),
    last_pm_report_date DATE,
    
    -- Property Management
    property_manager_contact_id UUID REFERENCES contacts(id),
    pm_company VARCHAR(255),
    pm_fee_percent DECIMAL(5,2),
    pm_contract_expiry DATE,
    
    -- Asset Management (internal)
    asset_manager_user_id UUID REFERENCES users(id),
    regional_manager_user_id UUID REFERENCES users(id),
    
    -- Notes
    investment_thesis TEXT,
    business_plan TEXT,
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- PM REPORT IMPORTS
-- Import income statements, rent rolls, and operational data from PM
-- ============================================================

-- PM Report imports (monthly operating statements from PM)
CREATE TABLE pm_report_imports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    
    -- Import identification
    report_period_year INTEGER NOT NULL,
    report_period_month INTEGER NOT NULL,
    report_date DATE NOT NULL,
    
    -- Source
    import_source VARCHAR(100), -- 'manual', 'excel', 'yardi', 'appfolio', 'buildium', 'rentmanager'
    source_file_name VARCHAR(255),
    source_document_id UUID REFERENCES documents(id),
    
    -- Import status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'imported', 'reviewed', 'approved'
    imported_at TIMESTAMP WITH TIME ZONE,
    imported_by_id UUID REFERENCES users(id),
    reviewed_by_id UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    
    -- Raw data (store original for reference)
    raw_data JSONB,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(asset_id, report_period_year, report_period_month)
);

-- Asset income statement (parsed from PM reports)
CREATE TABLE asset_income_statements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    pm_import_id UUID REFERENCES pm_report_imports(id),
    
    -- Period
    period_year INTEGER NOT NULL,
    period_month INTEGER NOT NULL,
    period_date DATE NOT NULL,
    
    -- REVENUE (from PM)
    gross_potential_rent DECIMAL(12,2),
    vacancy_loss DECIMAL(12,2),
    loss_to_lease DECIMAL(12,2),
    concessions DECIMAL(12,2),
    bad_debt DECIMAL(12,2),
    net_rental_income DECIMAL(12,2),
    
    -- Other income breakdown
    utility_reimbursement DECIMAL(12,2),
    parking_income DECIMAL(12,2),
    laundry_income DECIMAL(12,2),
    pet_fees DECIMAL(12,2),
    late_fees DECIMAL(12,2),
    application_fees DECIMAL(12,2),
    other_income DECIMAL(12,2),
    total_other_income DECIMAL(12,2),
    
    total_revenue DECIMAL(12,2),
    
    -- OPERATING EXPENSES (from PM)
    payroll DECIMAL(12,2),
    payroll_taxes_benefits DECIMAL(12,2),
    repairs_maintenance DECIMAL(12,2),
    make_ready_turns DECIMAL(12,2),
    landscaping DECIMAL(12,2),
    utilities_common DECIMAL(12,2),
    water_sewer DECIMAL(12,2),
    trash_removal DECIMAL(12,2),
    pest_control DECIMAL(12,2),
    security DECIMAL(12,2),
    marketing_advertising DECIMAL(12,2),
    professional_fees DECIMAL(12,2),
    general_administrative DECIMAL(12,2),
    management_fee DECIMAL(12,2),
    other_expenses DECIMAL(12,2),
    
    total_operating_expenses DECIMAL(12,2),
    
    -- NOI (calculated)
    net_operating_income DECIMAL(12,2),
    
    -- METRICS (from PM report)
    occupancy_physical DECIMAL(5,2),
    occupancy_economic DECIMAL(5,2),
    avg_rent_occupied DECIMAL(10,2),
    avg_market_rent DECIMAL(10,2),
    
    -- Leasing activity (from PM)
    new_leases INTEGER,
    renewals INTEGER,
    move_ins INTEGER,
    move_outs INTEGER,
    notices INTEGER,
    
    -- Work orders summary (from PM)
    work_orders_opened INTEGER,
    work_orders_completed INTEGER,
    work_orders_pending INTEGER,
    avg_completion_days DECIMAL(5,1),
    
    -- Data quality
    is_actual BOOLEAN DEFAULT true,
    data_source VARCHAR(50),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(asset_id, period_year, period_month)
);

-- Rent roll imports (snapshot from PM)
CREATE TABLE asset_rent_rolls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    pm_import_id UUID REFERENCES pm_report_imports(id),
    
    -- Snapshot date
    as_of_date DATE NOT NULL,
    
    -- Summary metrics
    total_units INTEGER,
    occupied_units INTEGER,
    vacant_units INTEGER,
    units_on_notice INTEGER,
    down_units INTEGER,
    
    physical_occupancy DECIMAL(5,2),
    economic_occupancy DECIMAL(5,2),
    
    gross_potential_rent DECIMAL(12,2),
    actual_rent_charged DECIMAL(12,2),
    loss_to_lease DECIMAL(12,2),
    avg_rent DECIMAL(10,2),
    avg_rent_per_sf DECIMAL(8,2),
    avg_market_rent DECIMAL(10,2),
    
    -- Expiration schedule summary
    expirations_30_days INTEGER,
    expirations_60_days INTEGER,
    expirations_90_days INTEGER,
    mtm_count INTEGER,
    
    -- Delinquency summary
    delinquent_amount DECIMAL(12,2),
    delinquent_units INTEGER,
    
    -- Unit detail (full rent roll data)
    unit_detail JSONB, -- Array of unit records from PM
    /* Example structure:
    [
        {
            "unit": "101",
            "type": "2BR/2BA",
            "sf": 1050,
            "status": "occupied",
            "tenant": "John Smith",
            "lease_start": "2024-01-15",
            "lease_end": "2025-01-14",
            "market_rent": 1500,
            "actual_rent": 1450,
            "other_charges": 50,
            "balance": 0
        }
    ]
    */
    
    -- Source
    source_document_id UUID REFERENCES documents(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(asset_id, as_of_date)
);

-- ============================================================
-- OWNER-MANAGED FINANCIALS
-- What YOU pay directly (not through PM)
-- ============================================================

-- Asset fixed expenses (owner-paid)
CREATE TABLE asset_fixed_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    
    -- Expense type
    expense_type VARCHAR(50) NOT NULL, -- 'property_tax', 'insurance', 'hoa', 'ground_lease', 'franchise_tax'
    description VARCHAR(255),
    
    -- Vendor/payee
    payee_name VARCHAR(255),
    payee_contact_id UUID REFERENCES contacts(id),
    account_number VARCHAR(100),
    
    -- Amount
    annual_amount DECIMAL(12,2),
    payment_amount DECIMAL(12,2),
    payment_frequency VARCHAR(20), -- 'monthly', 'quarterly', 'semi_annual', 'annual'
    
    -- Schedule
    due_day INTEGER, -- Day of month/quarter due
    next_due_date DATE,
    
    -- Auto-pay
    is_auto_pay BOOLEAN DEFAULT false,
    auto_pay_account VARCHAR(100),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Property tax detail
CREATE TABLE asset_property_taxes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    
    -- Tax year
    tax_year INTEGER NOT NULL,
    
    -- Parcel info
    parcel_id VARCHAR(100),
    legal_description TEXT,
    
    -- Assessment
    assessed_value_land DECIMAL(15,2),
    assessed_value_improvements DECIMAL(15,2),
    assessed_value_total DECIMAL(15,2),
    assessment_date DATE,
    
    -- Tax calculation
    millage_rate DECIMAL(8,5),
    tax_amount_annual DECIMAL(12,2),
    
    -- Exemptions
    exemptions JSONB, -- Array of exemption types and amounts
    exemption_amount DECIMAL(12,2),
    net_tax_amount DECIMAL(12,2),
    
    -- Payment
    installments INTEGER DEFAULT 1,
    payment_schedule JSONB, -- Array of {due_date, amount, paid, paid_date}
    total_paid DECIMAL(12,2),
    
    -- Appeal
    is_appealed BOOLEAN DEFAULT false,
    appeal_status VARCHAR(50),
    appeal_notes TEXT,
    
    -- Documents
    tax_bill_document_id UUID REFERENCES documents(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(asset_id, tax_year)
);

-- Insurance policies
CREATE TABLE asset_insurance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    
    -- Policy info
    policy_type VARCHAR(50) NOT NULL, -- 'property', 'liability', 'umbrella', 'flood', 'earthquake', 'rent_loss'
    policy_number VARCHAR(100),
    
    -- Carrier
    carrier_name VARCHAR(255),
    carrier_contact_id UUID REFERENCES contacts(id),
    agent_name VARCHAR(255),
    agent_contact_id UUID REFERENCES contacts(id),
    
    -- Coverage
    coverage_amount DECIMAL(15,2),
    deductible DECIMAL(12,2),
    coverage_details JSONB,
    
    -- Premium
    annual_premium DECIMAL(12,2),
    payment_frequency VARCHAR(20),
    
    -- Term
    effective_date DATE,
    expiration_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'expiring', 'expired', 'cancelled', 'renewed'
    renewal_status VARCHAR(50), -- 'pending', 'quoted', 'bound'
    
    -- Alerts
    alert_30_days_sent BOOLEAN DEFAULT false,
    alert_60_days_sent BOOLEAN DEFAULT false,
    
    -- Documents
    policy_document_id UUID REFERENCES documents(id),
    certificate_document_id UUID REFERENCES documents(id),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asset loans (debt management)
CREATE TABLE asset_loans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    
    -- Loan identification
    loan_name VARCHAR(255) NOT NULL,
    loan_number VARCHAR(100),
    
    -- Lender
    lender_name VARCHAR(255),
    lender_contact_id UUID REFERENCES contacts(id),
    servicer_name VARCHAR(255),
    servicer_contact_id UUID REFERENCES contacts(id),
    
    -- Type
    loan_type VARCHAR(50), -- 'agency_fannie', 'agency_freddie', 'cmbs', 'bank', 'bridge', 'mezz', 'seller'
    loan_position VARCHAR(20) DEFAULT 'senior', -- 'senior', 'mezz', 'preferred'
    
    -- Original terms
    original_amount DECIMAL(15,2),
    origination_date DATE,
    maturity_date DATE,
    
    -- Current balance
    current_balance DECIMAL(15,2),
    balance_as_of_date DATE,
    
    -- Interest
    interest_rate DECIMAL(6,4),
    rate_type VARCHAR(20), -- 'fixed', 'floating', 'hybrid'
    index_name VARCHAR(50), -- 'SOFR', 'Prime', 'Treasury'
    spread DECIMAL(5,4),
    floor_rate DECIMAL(6,4),
    cap_rate_loan DECIMAL(6,4),
    
    -- Payment
    payment_amount DECIMAL(12,2),
    payment_frequency VARCHAR(20) DEFAULT 'monthly',
    payment_day INTEGER, -- Day of month
    next_payment_date DATE,
    
    -- Amortization
    amortization_type VARCHAR(20), -- 'fully_amortizing', 'interest_only', 'partial_io'
    amortization_years INTEGER,
    io_end_date DATE,
    
    -- Prepayment
    prepayment_type VARCHAR(50), -- 'open', 'lockout', 'defeasance', 'yield_maintenance', 'step_down'
    prepayment_schedule JSONB,
    lockout_end_date DATE,
    
    -- Reserves (held by lender)
    tax_reserve DECIMAL(12,2),
    insurance_reserve DECIMAL(12,2),
    capex_reserve DECIMAL(12,2),
    other_reserves DECIMAL(12,2),
    reserve_balance_date DATE,
    
    -- Covenants
    dscr_requirement DECIMAL(4,2),
    ltv_requirement DECIMAL(5,2),
    current_dscr DECIMAL(4,2),
    current_ltv DECIMAL(5,2),
    covenant_compliance BOOLEAN DEFAULT true,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'paid_off', 'refinanced', 'default', 'modified'
    
    -- Documents
    loan_agreement_document_id UUID REFERENCES documents(id),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Debt service payments (track each payment)
CREATE TABLE asset_debt_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    loan_id UUID REFERENCES asset_loans(id) ON DELETE CASCADE,
    
    -- Payment period
    payment_date DATE NOT NULL,
    period_start DATE,
    period_end DATE,
    
    -- Amounts
    payment_amount DECIMAL(12,2),
    principal_amount DECIMAL(12,2),
    interest_amount DECIMAL(12,2),
    escrow_amount DECIMAL(12,2),
    other_amount DECIMAL(12,2),
    
    -- Balance after payment
    balance_after DECIMAL(15,2),
    
    -- Status
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'paid', 'late', 'missed'
    paid_date DATE,
    confirmation_number VARCHAR(100),
    
    -- Late fee if applicable
    late_fee DECIMAL(10,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Capital expenditures (owner-funded improvements)
CREATE TABLE asset_capex (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    
    -- Project identification
    project_name VARCHAR(255) NOT NULL,
    project_type VARCHAR(100), -- 'unit_renovation', 'roof', 'hvac', 'parking', 'amenity', 'exterior', 'systems'
    
    -- Budget
    budget_amount DECIMAL(12,2),
    approved_amount DECIMAL(12,2),
    spent_to_date DECIMAL(12,2),
    remaining DECIMAL(12,2),
    
    -- Timeline
    planned_start DATE,
    actual_start DATE,
    planned_completion DATE,
    actual_completion DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'planned', -- 'planned', 'approved', 'in_progress', 'complete', 'cancelled'
    
    -- Approval
    approved_by_id UUID REFERENCES users(id),
    approved_date DATE,
    
    -- Scope
    scope_description TEXT,
    units_affected INTEGER,
    
    -- Expected ROI
    expected_rent_increase DECIMAL(10,2),
    expected_noi_impact DECIMAL(12,2),
    expected_value_impact DECIMAL(15,2),
    payback_months INTEGER,
    
    -- Actual ROI (filled in post-completion)
    actual_rent_increase DECIMAL(10,2),
    actual_noi_impact DECIMAL(12,2),
    
    -- Funding source
    funding_source VARCHAR(100), -- 'reserves', 'operating_cash', 'loan_proceeds', 'capital_call'
    
    -- Contractor
    contractor_name VARCHAR(255),
    contractor_contact_id UUID REFERENCES contacts(id),
    
    -- Documents
    proposal_document_id UUID REFERENCES documents(id),
    contract_document_id UUID REFERENCES documents(id),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CapEx invoices/payments
CREATE TABLE asset_capex_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    capex_id UUID REFERENCES asset_capex(id) ON DELETE CASCADE,
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    
    -- Invoice
    invoice_number VARCHAR(100),
    invoice_date DATE,
    vendor_name VARCHAR(255),
    description TEXT,
    
    -- Amount
    amount DECIMAL(12,2),
    retainage DECIMAL(12,2),
    net_amount DECIMAL(12,2),
    
    -- Payment
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'paid'
    approved_by_id UUID REFERENCES users(id),
    approved_date DATE,
    paid_date DATE,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    
    -- Document
    invoice_document_id UUID REFERENCES documents(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- ASSET BALANCE SHEET & TRACKING
-- ============================================================

-- Asset balance sheet (point in time snapshot)
CREATE TABLE asset_balance_sheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    
    as_of_date DATE NOT NULL,
    
    -- ASSETS
    -- Current Assets
    cash_operating DECIMAL(15,2),
    cash_reserves DECIMAL(15,2),
    accounts_receivable DECIMAL(15,2),
    prepaid_expenses DECIMAL(15,2),
    other_current_assets DECIMAL(15,2),
    total_current_assets DECIMAL(15,2),
    
    -- Fixed Assets
    land DECIMAL(15,2),
    building_improvements DECIMAL(15,2),
    accumulated_depreciation DECIMAL(15,2),
    net_fixed_assets DECIMAL(15,2),
    
    -- Other Assets
    loan_reserves_held DECIMAL(15,2),
    other_assets DECIMAL(15,2),
    
    total_assets DECIMAL(15,2),
    
    -- LIABILITIES
    -- Current Liabilities
    accounts_payable DECIMAL(15,2),
    accrued_expenses DECIMAL(15,2),
    prepaid_rent DECIMAL(15,2),
    security_deposits DECIMAL(15,2),
    current_portion_debt DECIMAL(15,2),
    other_current_liabilities DECIMAL(15,2),
    total_current_liabilities DECIMAL(15,2),
    
    -- Long Term Liabilities
    mortgage_payable DECIMAL(15,2),
    other_long_term_debt DECIMAL(15,2),
    total_long_term_liabilities DECIMAL(15,2),
    
    total_liabilities DECIMAL(15,2),
    
    -- EQUITY
    contributed_capital DECIMAL(15,2),
    retained_earnings DECIMAL(15,2),
    current_year_earnings DECIMAL(15,2),
    distributions DECIMAL(15,2),
    total_equity DECIMAL(15,2),
    
    total_liabilities_equity DECIMAL(15,2),
    
    -- Source
    source VARCHAR(50), -- 'manual', 'quickbooks', 'calculated'
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(asset_id, as_of_date)
);

-- Asset cash flow tracking (distributions, capital calls)
CREATE TABLE asset_cash_flows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    
    -- Transaction
    transaction_date DATE NOT NULL,
    transaction_type VARCHAR(50), -- 'distribution', 'capital_call', 'refinance_proceeds', 'sale_proceeds'
    
    -- Amount
    amount DECIMAL(15,2),
    
    -- Description
    description TEXT,
    
    -- For distributions
    distribution_type VARCHAR(50), -- 'operating', 'refinance', 'sale'
    
    -- For capital calls
    call_reason VARCHAR(255),
    due_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'completed'
    completed_date DATE,
    
    -- Document
    document_id UUID REFERENCES documents(id),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Asset valuations
CREATE TABLE asset_valuations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    
    -- Valuation date
    valuation_date DATE NOT NULL,
    
    -- Type
    valuation_type VARCHAR(50), -- 'appraisal', 'broker_opinion', 'internal', 'purchase', 'refinance'
    purpose VARCHAR(100), -- 'annual_review', 'refinance', 'sale', 'reporting'
    
    -- Values
    value DECIMAL(15,2) NOT NULL,
    value_per_unit DECIMAL(12,2),
    value_per_sf DECIMAL(10,2),
    
    -- Methodology
    methodology VARCHAR(50), -- 'income', 'sales_comp', 'cost', 'dcf', 'blended'
    cap_rate_used DECIMAL(5,2),
    noi_used DECIMAL(12,2),
    
    -- Market data used
    market_cap_rate DECIMAL(5,2),
    market_rent_psf DECIMAL(8,2),
    comparable_sales JSONB,
    
    -- Source
    appraiser_name VARCHAR(255),
    appraiser_company VARCHAR(255),
    appraisal_document_id UUID REFERENCES documents(id),
    
    -- Loan implications
    implied_ltv DECIMAL(5,2),
    
    notes TEXT,
    
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- ASSET BUDGETS & FORECASTS
-- ============================================================

-- Asset annual budget
CREATE TABLE asset_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    asset_id UUID REFERENCES assets(id) ON DELETE CASCADE,
    
    budget_year INTEGER NOT NULL,
    budget_name VARCHAR(100),
    budget_type VARCHAR(50) DEFAULT 'annual', -- 'annual', 'reforecast'
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'submitted', 'approved'
    approved_by_id UUID REFERENCES users(id),
    approved_date DATE,
    
    -- Revenue
    gross_potential_rent DECIMAL(12,2),
    vacancy_loss DECIMAL(12,2),
    concessions DECIMAL(12,2),
    bad_debt DECIMAL(12,2),
    other_income DECIMAL(12,2),
    total_revenue DECIMAL(12,2),
    
    -- Operating expenses
    total_operating_expenses DECIMAL(12,2),
    expense_detail JSONB, -- Detailed expense breakdown
    
    -- NOI
    net_operating_income DECIMAL(12,2),
    
    -- Below the line (owner-paid)
    property_taxes DECIMAL(12,2),
    insurance DECIMAL(12,2),
    capex DECIMAL(12,2),
    debt_service DECIMAL(12,2),
    
    -- Cash flow
    cash_flow_before_debt DECIMAL(12,2),
    cash_flow_after_debt DECIMAL(12,2),
    
    -- Monthly breakdown
    monthly_budget JSONB, -- 12 months of detail
    
    -- Assumptions
    assumptions JSONB,
    
    notes TEXT,
    
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(asset_id, budget_year, budget_type)
);

-- ============================================================
-- ENTITY CASH FLOW & DASHBOARD TRACKING
-- ============================================================

-- Entity cash accounts (bank accounts per entity)
CREATE TABLE entity_cash_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50), -- 'operating', 'reserve', 'escrow', 'investment'
    bank_name VARCHAR(255),
    account_number_last4 VARCHAR(4),
    
    current_balance DECIMAL(15,2) DEFAULT 0,
    balance_as_of DATE,
    
    is_primary BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entity cash transactions (money in/out per entity)
CREATE TABLE entity_cash_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    cash_account_id UUID REFERENCES entity_cash_accounts(id),
    
    -- Transaction details
    transaction_date DATE NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, 
    -- Types: 'capital_contribution', 'distribution', 'loan_advance', 'loan_payment',
    -- 'project_funding', 'project_return', 'asset_income', 'asset_expense',
    -- 'intercompany_transfer', 'investment', 'other'
    
    -- Direction
    direction VARCHAR(10) NOT NULL, -- 'inflow', 'outflow'
    
    amount DECIMAL(15,2) NOT NULL,
    
    -- Description
    description TEXT,
    category VARCHAR(100),
    
    -- Related records
    related_project_id UUID REFERENCES projects(id),
    related_deal_id UUID REFERENCES deals(id),
    related_asset_id UUID REFERENCES assets(id),
    related_loan_id UUID, -- Can reference project loans or asset loans
    
    -- For intercompany
    counterparty_entity_id UUID REFERENCES entities(id),
    
    -- Status
    status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'void'
    
    -- Reference
    reference_number VARCHAR(100),
    
    -- Integration
    qbo_transaction_id VARCHAR(100),
    
    notes TEXT,
    
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entity financial summary (monthly rollup per entity)
CREATE TABLE entity_financial_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    
    -- Period
    period_year INTEGER NOT NULL,
    period_month INTEGER NOT NULL,
    
    -- Cash position
    beginning_cash DECIMAL(15,2),
    ending_cash DECIMAL(15,2),
    
    -- Inflows
    capital_contributions DECIMAL(15,2) DEFAULT 0,
    loan_advances DECIMAL(15,2) DEFAULT 0,
    project_returns DECIMAL(15,2) DEFAULT 0,
    asset_distributions DECIMAL(15,2) DEFAULT 0,
    other_inflows DECIMAL(15,2) DEFAULT 0,
    total_inflows DECIMAL(15,2) DEFAULT 0,
    
    -- Outflows
    distributions_paid DECIMAL(15,2) DEFAULT 0,
    loan_payments DECIMAL(15,2) DEFAULT 0,
    project_funding DECIMAL(15,2) DEFAULT 0,
    asset_contributions DECIMAL(15,2) DEFAULT 0,
    operating_expenses DECIMAL(15,2) DEFAULT 0,
    other_outflows DECIMAL(15,2) DEFAULT 0,
    total_outflows DECIMAL(15,2) DEFAULT 0,
    
    -- Net
    net_cash_flow DECIMAL(15,2),
    
    -- Portfolio metrics (aggregated)
    total_project_value DECIMAL(15,2), -- Sum of all project budgets
    total_asset_value DECIMAL(15,2), -- Sum of all asset values
    total_debt DECIMAL(15,2), -- Sum of all loans
    total_equity DECIMAL(15,2), -- Calculated
    
    -- Activity counts
    active_deals INTEGER DEFAULT 0,
    active_projects INTEGER DEFAULT 0,
    active_assets INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(entity_id, period_year, period_month)
);

-- Deal pipeline tracking (for dashboard snapshots)
CREATE TABLE deal_pipeline_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    snapshot_date DATE NOT NULL,
    entity_id UUID REFERENCES entities(id), -- NULL for all entities
    
    -- Pipeline counts by stage
    stage_prospect INTEGER DEFAULT 0,
    stage_outreach INTEGER DEFAULT 0,
    stage_loi INTEGER DEFAULT 0,
    stage_due_diligence INTEGER DEFAULT 0,
    stage_under_contract INTEGER DEFAULT 0,
    stage_closing INTEGER DEFAULT 0,
    
    -- Pipeline values by stage
    value_prospect DECIMAL(15,2) DEFAULT 0,
    value_outreach DECIMAL(15,2) DEFAULT 0,
    value_loi DECIMAL(15,2) DEFAULT 0,
    value_due_diligence DECIMAL(15,2) DEFAULT 0,
    value_under_contract DECIMAL(15,2) DEFAULT 0,
    value_closing DECIMAL(15,2) DEFAULT 0,
    
    -- Totals
    total_deals INTEGER DEFAULT 0,
    total_pipeline_value DECIMAL(15,2) DEFAULT 0,
    
    -- Conversion metrics (trailing 12 months)
    deals_won_count INTEGER DEFAULT 0,
    deals_won_value DECIMAL(15,2) DEFAULT 0,
    deals_lost_count INTEGER DEFAULT 0,
    win_rate DECIMAL(5,2),
    avg_days_to_close INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project status tracking (for dashboard snapshots)
CREATE TABLE project_status_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    snapshot_date DATE NOT NULL,
    entity_id UUID REFERENCES entities(id), -- NULL for all entities
    
    -- Counts by status
    status_predevelopment INTEGER DEFAULT 0,
    status_entitlement INTEGER DEFAULT 0,
    status_design INTEGER DEFAULT 0,
    status_permitting INTEGER DEFAULT 0,
    status_construction INTEGER DEFAULT 0,
    status_lease_up INTEGER DEFAULT 0,
    status_complete INTEGER DEFAULT 0,
    
    -- Budget totals by status
    budget_predevelopment DECIMAL(15,2) DEFAULT 0,
    budget_entitlement DECIMAL(15,2) DEFAULT 0,
    budget_design DECIMAL(15,2) DEFAULT 0,
    budget_permitting DECIMAL(15,2) DEFAULT 0,
    budget_construction DECIMAL(15,2) DEFAULT 0,
    budget_lease_up DECIMAL(15,2) DEFAULT 0,
    
    -- Totals
    total_projects INTEGER DEFAULT 0,
    total_budget DECIMAL(15,2) DEFAULT 0,
    total_spent DECIMAL(15,2) DEFAULT 0,
    total_remaining DECIMAL(15,2) DEFAULT 0,
    
    -- Units
    total_units INTEGER DEFAULT 0,
    units_under_construction INTEGER DEFAULT 0,
    units_delivered INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment tracking (capital deployed per entity)
CREATE TABLE entity_investments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    
    -- Investment target
    investment_type VARCHAR(50) NOT NULL, -- 'project', 'asset', 'deal'
    target_project_id UUID REFERENCES projects(id),
    target_asset_id UUID REFERENCES assets(id),
    target_deal_id UUID REFERENCES deals(id),
    
    -- Capital
    committed_amount DECIMAL(15,2),
    called_amount DECIMAL(15,2) DEFAULT 0,
    funded_amount DECIMAL(15,2) DEFAULT 0,
    unfunded_amount DECIMAL(15,2),
    
    -- Returns
    distributions_received DECIMAL(15,2) DEFAULT 0,
    current_value DECIMAL(15,2),
    
    -- Metrics
    irr DECIMAL(8,4),
    equity_multiple DECIMAL(6,3),
    roi DECIMAL(8,4),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'realized', 'written_off'
    
    -- Dates
    investment_date DATE,
    exit_date DATE,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dashboard alerts
CREATE TABLE dashboard_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Scope
    entity_id UUID REFERENCES entities(id),
    project_id UUID REFERENCES projects(id),
    asset_id UUID REFERENCES assets(id),
    deal_id UUID REFERENCES deals(id),
    
    -- Alert details
    alert_type VARCHAR(100) NOT NULL,
    -- Types: 'deal_stale', 'project_over_budget', 'project_behind_schedule',
    -- 'asset_low_occupancy', 'asset_missing_report', 'insurance_expiring',
    -- 'loan_maturing', 'tax_due', 'draw_pending', 'approval_needed',
    -- 'covenant_breach', 'cash_low'
    
    severity VARCHAR(20) DEFAULT 'warning', -- 'info', 'warning', 'critical'
    
    title VARCHAR(255) NOT NULL,
    message TEXT,
    
    -- Thresholds
    threshold_value DECIMAL(15,2),
    actual_value DECIMAL(15,2),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'acknowledged', 'resolved', 'dismissed'
    acknowledged_by_id UUID REFERENCES users(id),
    acknowledged_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Link
    link_url VARCHAR(500),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Dashboard user preferences
CREATE TABLE dashboard_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Default filters
    default_entity_id UUID REFERENCES entities(id),
    default_date_range VARCHAR(50) DEFAULT '12_months',
    
    -- Widget visibility
    visible_widgets JSONB DEFAULT '["pipeline", "projects", "assets", "cash_flow", "alerts"]',
    
    -- Widget order
    widget_order JSONB,
    
    -- Refresh settings
    auto_refresh BOOLEAN DEFAULT true,
    refresh_interval_minutes INTEGER DEFAULT 15,
    
    -- Alert preferences
    show_info_alerts BOOLEAN DEFAULT true,
    show_warning_alerts BOOLEAN DEFAULT true,
    show_critical_alerts BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

-- KPI targets (for variance tracking on dashboard)
CREATE TABLE kpi_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Scope
    entity_id UUID REFERENCES entities(id), -- NULL = company-wide
    target_year INTEGER NOT NULL,
    
    -- Deal targets
    target_deals_closed INTEGER,
    target_deal_volume DECIMAL(15,2),
    
    -- Project targets
    target_projects_started INTEGER,
    target_projects_completed INTEGER,
    target_units_delivered INTEGER,
    
    -- Asset targets
    target_avg_occupancy DECIMAL(5,2),
    target_noi_growth_percent DECIMAL(5,2),
    target_portfolio_noi DECIMAL(15,2),
    
    -- Financial targets
    target_distributions DECIMAL(15,2),
    target_irr DECIMAL(5,2),
    target_equity_multiple DECIMAL(4,2),
    
    -- Cash targets
    target_cash_balance DECIMAL(15,2),
    
    notes TEXT,
    
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(entity_id, target_year)
);

-- View: KPI actuals vs targets
CREATE OR REPLACE VIEW v_kpi_variance AS
SELECT 
    kt.entity_id,
    e.name as entity_name,
    kt.target_year,
    
    -- Deals
    kt.target_deals_closed,
    (SELECT COUNT(*) FROM deals d 
     WHERE (d.entity_id = kt.entity_id OR kt.entity_id IS NULL)
     AND d.status = 'closed_won' 
     AND EXTRACT(YEAR FROM d.closing_date) = kt.target_year) as actual_deals_closed,
    
    kt.target_deal_volume,
    (SELECT SUM(contract_price) FROM deals d 
     WHERE (d.entity_id = kt.entity_id OR kt.entity_id IS NULL)
     AND d.status = 'closed_won' 
     AND EXTRACT(YEAR FROM d.closing_date) = kt.target_year) as actual_deal_volume,
    
    -- Projects
    kt.target_projects_completed,
    (SELECT COUNT(*) FROM projects p 
     WHERE (p.entity_id = kt.entity_id OR kt.entity_id IS NULL)
     AND p.status = 'complete' 
     AND EXTRACT(YEAR FROM p.actual_end_date) = kt.target_year) as actual_projects_completed,
    
    kt.target_units_delivered,
    (SELECT SUM(total_units) FROM projects p 
     WHERE (p.entity_id = kt.entity_id OR kt.entity_id IS NULL)
     AND p.status = 'complete' 
     AND EXTRACT(YEAR FROM p.actual_end_date) = kt.target_year) as actual_units_delivered,
    
    -- Assets
    kt.target_avg_occupancy,
    (SELECT AVG(current_occupancy) FROM assets a 
     WHERE (a.entity_id = kt.entity_id OR kt.entity_id IS NULL)
     AND a.status IN ('stabilized', 'stabilizing')) as actual_avg_occupancy,
    
    kt.target_portfolio_noi,
    (SELECT SUM(current_noi_annual) FROM assets a 
     WHERE (a.entity_id = kt.entity_id OR kt.entity_id IS NULL)
     AND a.status != 'sold') as actual_portfolio_noi,
    
    -- Distributions
    kt.target_distributions,
    (SELECT SUM(amount) FROM entity_cash_transactions ct 
     WHERE (ct.entity_id = kt.entity_id OR kt.entity_id IS NULL)
     AND ct.transaction_type = 'distribution'
     AND EXTRACT(YEAR FROM ct.transaction_date) = kt.target_year
     AND ct.status = 'completed') as actual_distributions

FROM kpi_targets kt
LEFT JOIN entities e ON kt.entity_id = e.id

-- ============================================================
-- DASHBOARD VIEWS
-- ============================================================

-- View: Current deal pipeline summary
CREATE OR REPLACE VIEW v_deal_pipeline AS
SELECT 
    d.entity_id,
    e.name as entity_name,
    d.status,
    COUNT(*) as deal_count,
    SUM(COALESCE(d.contract_price, d.asking_price, 0)) as total_value,
    AVG(EXTRACT(DAY FROM NOW() - d.created_at)) as avg_age_days
FROM deals d
LEFT JOIN entities e ON d.entity_id = e.id
WHERE d.status NOT IN ('closed_won', 'closed_lost', 'dead')
GROUP BY d.entity_id, e.name, d.status;

-- View: Current project summary
CREATE OR REPLACE VIEW v_project_summary AS
SELECT 
    p.entity_id,
    e.name as entity_name,
    p.status,
    COUNT(*) as project_count,
    SUM(p.total_budget) as total_budget,
    SUM(p.total_spent) as total_spent,
    SUM(p.total_budget - COALESCE(p.total_spent, 0)) as total_remaining,
    SUM(p.total_units) as total_units
FROM projects p
LEFT JOIN entities e ON p.entity_id = e.id
WHERE p.status NOT IN ('complete', 'cancelled', 'on_hold')
GROUP BY p.entity_id, e.name, p.status;

-- View: Current asset summary
CREATE OR REPLACE VIEW v_asset_summary AS
SELECT 
    a.entity_id,
    e.name as entity_name,
    a.asset_type,
    a.status,
    COUNT(*) as asset_count,
    SUM(a.total_units) as total_units,
    SUM(a.current_value) as total_value,
    AVG(a.current_occupancy) as avg_occupancy,
    SUM(a.current_noi_annual) as total_noi
FROM assets a
LEFT JOIN entities e ON a.entity_id = e.id
WHERE a.status != 'sold'
GROUP BY a.entity_id, e.name, a.asset_type, a.status;

-- View: Entity portfolio overview
CREATE OR REPLACE VIEW v_entity_portfolio AS
SELECT 
    e.id as entity_id,
    e.name as entity_name,
    e.entity_type,
    
    -- Deals
    (SELECT COUNT(*) FROM deals d WHERE d.entity_id = e.id AND d.status NOT IN ('closed_won', 'closed_lost', 'dead')) as active_deals,
    (SELECT SUM(COALESCE(contract_price, asking_price, 0)) FROM deals d WHERE d.entity_id = e.id AND d.status NOT IN ('closed_won', 'closed_lost', 'dead')) as deal_pipeline_value,
    
    -- Projects
    (SELECT COUNT(*) FROM projects p WHERE p.entity_id = e.id AND p.status NOT IN ('complete', 'cancelled')) as active_projects,
    (SELECT SUM(total_budget) FROM projects p WHERE p.entity_id = e.id AND p.status NOT IN ('complete', 'cancelled')) as project_budget_total,
    (SELECT SUM(total_spent) FROM projects p WHERE p.entity_id = e.id AND p.status NOT IN ('complete', 'cancelled')) as project_spent_total,
    
    -- Assets
    (SELECT COUNT(*) FROM assets a WHERE a.entity_id = e.id AND a.status != 'sold') as active_assets,
    (SELECT SUM(total_units) FROM assets a WHERE a.entity_id = e.id AND a.status != 'sold') as total_units,
    (SELECT SUM(current_value) FROM assets a WHERE a.entity_id = e.id AND a.status != 'sold') as asset_value_total,
    (SELECT SUM(current_noi_annual) FROM assets a WHERE a.entity_id = e.id AND a.status != 'sold') as asset_noi_total,
    
    -- Debt
    (SELECT SUM(current_balance) FROM loans l JOIN projects p ON l.project_id = p.id WHERE p.entity_id = e.id AND l.status = 'active') as project_debt,
    (SELECT SUM(current_balance) FROM asset_loans al JOIN assets a ON al.asset_id = a.id WHERE a.entity_id = e.id AND al.status = 'active') as asset_debt
    
FROM entities e
WHERE e.is_active = true;

-- ============================================================
-- DASHBOARD FUNCTIONS
-- ============================================================

-- Function: Generate dashboard alerts
CREATE OR REPLACE FUNCTION generate_dashboard_alerts()
RETURNS void AS $$
BEGIN
    -- Clear old resolved/expired alerts
    DELETE FROM dashboard_alerts 
    WHERE status IN ('resolved', 'dismissed') 
    OR (expires_at IS NOT NULL AND expires_at < NOW());
    
    -- Stale deals (no activity in 30 days)
    INSERT INTO dashboard_alerts (entity_id, deal_id, alert_type, severity, title, message, link_url)
    SELECT 
        d.entity_id,
        d.id,
        'deal_stale',
        'warning',
        'Stale Deal: ' || d.name,
        'No activity in ' || EXTRACT(DAY FROM NOW() - d.updated_at)::int || ' days',
        '/deals/' || d.id
    FROM deals d
    WHERE d.status NOT IN ('closed_won', 'closed_lost', 'dead')
    AND d.updated_at < NOW() - INTERVAL '30 days'
    AND NOT EXISTS (
        SELECT 1 FROM dashboard_alerts da 
        WHERE da.deal_id = d.id AND da.alert_type = 'deal_stale' AND da.status = 'active'
    );
    
    -- Projects over budget (>10%)
    INSERT INTO dashboard_alerts (entity_id, project_id, alert_type, severity, title, message, threshold_value, actual_value, link_url)
    SELECT 
        p.entity_id,
        p.id,
        'project_over_budget',
        CASE WHEN (p.total_spent / NULLIF(p.total_budget, 0)) > 1.2 THEN 'critical' ELSE 'warning' END,
        'Over Budget: ' || p.name,
        'Spent $' || TO_CHAR(p.total_spent, 'FM999,999,999') || ' of $' || TO_CHAR(p.total_budget, 'FM999,999,999') || ' budget',
        p.total_budget,
        p.total_spent,
        '/projects/' || p.id
    FROM projects p
    WHERE p.status NOT IN ('complete', 'cancelled')
    AND p.total_spent > p.total_budget * 1.1
    AND NOT EXISTS (
        SELECT 1 FROM dashboard_alerts da 
        WHERE da.project_id = p.id AND da.alert_type = 'project_over_budget' AND da.status = 'active'
    );
    
    -- Asset low occupancy (<90%)
    INSERT INTO dashboard_alerts (entity_id, asset_id, alert_type, severity, title, message, threshold_value, actual_value, link_url)
    SELECT 
        a.entity_id,
        a.id,
        'asset_low_occupancy',
        CASE WHEN a.current_occupancy < 80 THEN 'critical' ELSE 'warning' END,
        'Low Occupancy: ' || a.name,
        'Current occupancy is ' || ROUND(a.current_occupancy, 1) || '%',
        90,
        a.current_occupancy,
        '/assets/' || a.id
    FROM assets a
    WHERE a.status IN ('stabilized', 'stabilizing')
    AND a.current_occupancy < 90
    AND NOT EXISTS (
        SELECT 1 FROM dashboard_alerts da 
        WHERE da.asset_id = a.id AND da.alert_type = 'asset_low_occupancy' AND da.status = 'active'
    );
    
    -- Insurance expiring within 60 days
    INSERT INTO dashboard_alerts (entity_id, asset_id, alert_type, severity, title, message, link_url, expires_at)
    SELECT 
        a.entity_id,
        ai.asset_id,
        'insurance_expiring',
        CASE WHEN ai.expiration_date < NOW() + INTERVAL '30 days' THEN 'critical' ELSE 'warning' END,
        'Insurance Expiring: ' || a.name || ' - ' || ai.policy_type,
        'Expires on ' || TO_CHAR(ai.expiration_date, 'Mon DD, YYYY'),
        '/assets/' || ai.asset_id || '/insurance',
        ai.expiration_date
    FROM asset_insurance ai
    JOIN assets a ON ai.asset_id = a.id
    WHERE ai.status = 'active'
    AND ai.expiration_date BETWEEN NOW() AND NOW() + INTERVAL '60 days'
    AND NOT EXISTS (
        SELECT 1 FROM dashboard_alerts da 
        WHERE da.asset_id = ai.asset_id AND da.alert_type = 'insurance_expiring' AND da.status = 'active'
    );
    
    -- Loans maturing within 12 months
    INSERT INTO dashboard_alerts (entity_id, asset_id, alert_type, severity, title, message, link_url, expires_at)
    SELECT 
        a.entity_id,
        al.asset_id,
        'loan_maturing',
        CASE WHEN al.maturity_date < NOW() + INTERVAL '6 months' THEN 'critical' ELSE 'warning' END,
        'Loan Maturing: ' || a.name || ' - ' || al.loan_name,
        'Matures on ' || TO_CHAR(al.maturity_date, 'Mon DD, YYYY') || ' - Balance: $' || TO_CHAR(al.current_balance, 'FM999,999,999'),
        '/assets/' || al.asset_id || '/loans',
        al.maturity_date
    FROM asset_loans al
    JOIN assets a ON al.asset_id = a.id
    WHERE al.status = 'active'
    AND al.maturity_date BETWEEN NOW() AND NOW() + INTERVAL '12 months'
    AND NOT EXISTS (
        SELECT 1 FROM dashboard_alerts da 
        WHERE da.asset_id = al.asset_id AND da.alert_type = 'loan_maturing' AND da.status = 'active'
    );
    
    -- Missing PM reports (>45 days)
    INSERT INTO dashboard_alerts (entity_id, asset_id, alert_type, severity, title, message, link_url)
    SELECT 
        a.entity_id,
        a.id,
        'asset_missing_report',
        'warning',
        'Missing PM Report: ' || a.name,
        'Last report received ' || COALESCE(
            EXTRACT(DAY FROM NOW() - a.last_pm_report_date)::int || ' days ago',
            'never'
        ),
        '/assets/' || a.id || '/imports'
    FROM assets a
    WHERE a.status IN ('stabilized', 'stabilizing', 'value_add')
    AND (a.last_pm_report_date IS NULL OR a.last_pm_report_date < NOW() - INTERVAL '45 days')
    AND NOT EXISTS (
        SELECT 1 FROM dashboard_alerts da 
        WHERE da.asset_id = a.id AND da.alert_type = 'asset_missing_report' AND da.status = 'active'
    );
    
END;
$$ LANGUAGE plpgsql;

-- Function: Calculate entity cash flow for period
CREATE OR REPLACE FUNCTION calculate_entity_cash_flow(
    p_entity_id UUID,
    p_year INTEGER,
    p_month INTEGER
)
RETURNS void AS $$
DECLARE
    v_start_date DATE;
    v_end_date DATE;
BEGIN
    v_start_date := MAKE_DATE(p_year, p_month, 1);
    v_end_date := (v_start_date + INTERVAL '1 month')::date;
    
    -- Calculate and upsert summary
    INSERT INTO entity_financial_summaries (
        entity_id, period_year, period_month,
        capital_contributions, loan_advances, project_returns, asset_distributions, other_inflows,
        distributions_paid, loan_payments, project_funding, asset_contributions, operating_expenses, other_outflows,
        total_inflows, total_outflows, net_cash_flow,
        active_deals, active_projects, active_assets
    )
    SELECT 
        p_entity_id,
        p_year,
        p_month,
        COALESCE(SUM(CASE WHEN transaction_type = 'capital_contribution' AND direction = 'inflow' THEN amount END), 0),
        COALESCE(SUM(CASE WHEN transaction_type = 'loan_advance' AND direction = 'inflow' THEN amount END), 0),
        COALESCE(SUM(CASE WHEN transaction_type = 'project_return' AND direction = 'inflow' THEN amount END), 0),
        COALESCE(SUM(CASE WHEN transaction_type = 'asset_income' AND direction = 'inflow' THEN amount END), 0),
        COALESCE(SUM(CASE WHEN transaction_type NOT IN ('capital_contribution', 'loan_advance', 'project_return', 'asset_income') AND direction = 'inflow' THEN amount END), 0),
        COALESCE(SUM(CASE WHEN transaction_type = 'distribution' AND direction = 'outflow' THEN amount END), 0),
        COALESCE(SUM(CASE WHEN transaction_type = 'loan_payment' AND direction = 'outflow' THEN amount END), 0),
        COALESCE(SUM(CASE WHEN transaction_type = 'project_funding' AND direction = 'outflow' THEN amount END), 0),
        COALESCE(SUM(CASE WHEN transaction_type = 'asset_expense' AND direction = 'outflow' THEN amount END), 0),
        COALESCE(SUM(CASE WHEN transaction_type NOT IN ('distribution', 'loan_payment', 'project_funding', 'asset_expense') AND direction = 'outflow' THEN amount END), 0),
        COALESCE(SUM(CASE WHEN transaction_type NOT IN ('distribution', 'loan_payment', 'project_funding', 'asset_expense') AND direction = 'outflow' THEN amount END), 0),
        COALESCE(SUM(CASE WHEN direction = 'inflow' THEN amount ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN direction = 'outflow' THEN amount ELSE 0 END), 0),
        COALESCE(SUM(CASE WHEN direction = 'inflow' THEN amount ELSE -amount END), 0),
        (SELECT COUNT(*) FROM deals d WHERE d.entity_id = p_entity_id AND d.status NOT IN ('closed_won', 'closed_lost', 'dead')),
        (SELECT COUNT(*) FROM projects p WHERE p.entity_id = p_entity_id AND p.status NOT IN ('complete', 'cancelled')),
        (SELECT COUNT(*) FROM assets a WHERE a.entity_id = p_entity_id AND a.status != 'sold')
    FROM entity_cash_transactions
    WHERE entity_id = p_entity_id
    AND transaction_date >= v_start_date
    AND transaction_date < v_end_date
    AND status = 'completed'
    ON CONFLICT (entity_id, period_year, period_month) 
    DO UPDATE SET
        capital_contributions = EXCLUDED.capital_contributions,
        loan_advances = EXCLUDED.loan_advances,
        project_returns = EXCLUDED.project_returns,
        asset_distributions = EXCLUDED.asset_distributions,
        other_inflows = EXCLUDED.other_inflows,
        distributions_paid = EXCLUDED.distributions_paid,
        loan_payments = EXCLUDED.loan_payments,
        project_funding = EXCLUDED.project_funding,
        asset_contributions = EXCLUDED.asset_contributions,
        operating_expenses = EXCLUDED.operating_expenses,
        other_outflows = EXCLUDED.other_outflows,
        total_inflows = EXCLUDED.total_inflows,
        total_outflows = EXCLUDED.total_outflows,
        net_cash_flow = EXCLUDED.net_cash_flow,
        active_deals = EXCLUDED.active_deals,
        active_projects = EXCLUDED.active_projects,
        active_assets = EXCLUDED.active_assets,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function: Take pipeline snapshot
CREATE OR REPLACE FUNCTION take_pipeline_snapshot(p_entity_id UUID DEFAULT NULL)
RETURNS void AS $$
BEGIN
    INSERT INTO deal_pipeline_snapshots (
        snapshot_date, entity_id,
        stage_prospect, stage_outreach, stage_loi, stage_due_diligence, stage_under_contract, stage_closing,
        value_prospect, value_outreach, value_loi, value_due_diligence, value_under_contract, value_closing,
        total_deals, total_pipeline_value,
        deals_won_count, deals_won_value, deals_lost_count, win_rate, avg_days_to_close
    )
    SELECT 
        CURRENT_DATE,
        p_entity_id,
        COUNT(*) FILTER (WHERE status = 'prospect'),
        COUNT(*) FILTER (WHERE status = 'outreach'),
        COUNT(*) FILTER (WHERE status = 'loi'),
        COUNT(*) FILTER (WHERE status = 'due_diligence'),
        COUNT(*) FILTER (WHERE status = 'under_contract'),
        COUNT(*) FILTER (WHERE status = 'closing'),
        COALESCE(SUM(COALESCE(contract_price, asking_price, 0)) FILTER (WHERE status = 'prospect'), 0),
        COALESCE(SUM(COALESCE(contract_price, asking_price, 0)) FILTER (WHERE status = 'outreach'), 0),
        COALESCE(SUM(COALESCE(contract_price, asking_price, 0)) FILTER (WHERE status = 'loi'), 0),
        COALESCE(SUM(COALESCE(contract_price, asking_price, 0)) FILTER (WHERE status = 'due_diligence'), 0),
        COALESCE(SUM(COALESCE(contract_price, asking_price, 0)) FILTER (WHERE status = 'under_contract'), 0),
        COALESCE(SUM(COALESCE(contract_price, asking_price, 0)) FILTER (WHERE status = 'closing'), 0),
        COUNT(*) FILTER (WHERE status NOT IN ('closed_won', 'closed_lost', 'dead')),
        COALESCE(SUM(COALESCE(contract_price, asking_price, 0)) FILTER (WHERE status NOT IN ('closed_won', 'closed_lost', 'dead')), 0),
        COUNT(*) FILTER (WHERE status = 'closed_won' AND updated_at > NOW() - INTERVAL '12 months'),
        COALESCE(SUM(contract_price) FILTER (WHERE status = 'closed_won' AND updated_at > NOW() - INTERVAL '12 months'), 0),
        COUNT(*) FILTER (WHERE status IN ('closed_lost', 'dead') AND updated_at > NOW() - INTERVAL '12 months'),
        CASE 
            WHEN COUNT(*) FILTER (WHERE status IN ('closed_won', 'closed_lost', 'dead') AND updated_at > NOW() - INTERVAL '12 months') > 0
            THEN ROUND(
                COUNT(*) FILTER (WHERE status = 'closed_won' AND updated_at > NOW() - INTERVAL '12 months')::numeric /
                COUNT(*) FILTER (WHERE status IN ('closed_won', 'closed_lost', 'dead') AND updated_at > NOW() - INTERVAL '12 months') * 100,
                1
            )
            ELSE 0
        END,
        AVG(EXTRACT(DAY FROM updated_at - created_at)) FILTER (WHERE status = 'closed_won' AND updated_at > NOW() - INTERVAL '12 months')
    FROM deals
    WHERE (p_entity_id IS NULL OR entity_id = p_entity_id);
END;
$$ LANGUAGE plpgsql;

-- Function: Take project status snapshot
CREATE OR REPLACE FUNCTION take_project_snapshot(p_entity_id UUID DEFAULT NULL)
RETURNS void AS $$
BEGIN
    INSERT INTO project_status_snapshots (
        snapshot_date, entity_id,
        status_predevelopment, status_entitlement, status_design, status_permitting, 
        status_construction, status_lease_up, status_complete,
        budget_predevelopment, budget_entitlement, budget_design, budget_permitting,
        budget_construction, budget_lease_up,
        total_projects, total_budget, total_spent, total_remaining,
        total_units, units_under_construction, units_delivered
    )
    SELECT 
        CURRENT_DATE,
        p_entity_id,
        COUNT(*) FILTER (WHERE status = 'predevelopment'),
        COUNT(*) FILTER (WHERE status = 'entitlement'),
        COUNT(*) FILTER (WHERE status = 'design'),
        COUNT(*) FILTER (WHERE status = 'permitting'),
        COUNT(*) FILTER (WHERE status = 'construction'),
        COUNT(*) FILTER (WHERE status = 'lease_up'),
        COUNT(*) FILTER (WHERE status = 'complete'),
        COALESCE(SUM(total_budget) FILTER (WHERE status = 'predevelopment'), 0),
        COALESCE(SUM(total_budget) FILTER (WHERE status = 'entitlement'), 0),
        COALESCE(SUM(total_budget) FILTER (WHERE status = 'design'), 0),
        COALESCE(SUM(total_budget) FILTER (WHERE status = 'permitting'), 0),
        COALESCE(SUM(total_budget) FILTER (WHERE status = 'construction'), 0),
        COALESCE(SUM(total_budget) FILTER (WHERE status = 'lease_up'), 0),
        COUNT(*) FILTER (WHERE status NOT IN ('complete', 'cancelled')),
        COALESCE(SUM(total_budget) FILTER (WHERE status NOT IN ('complete', 'cancelled')), 0),
        COALESCE(SUM(total_spent) FILTER (WHERE status NOT IN ('complete', 'cancelled')), 0),
        COALESCE(SUM(total_budget - COALESCE(total_spent, 0)) FILTER (WHERE status NOT IN ('complete', 'cancelled')), 0),
        COALESCE(SUM(total_units), 0),
        COALESCE(SUM(total_units) FILTER (WHERE status = 'construction'), 0),
        COALESCE(SUM(total_units) FILTER (WHERE status IN ('complete', 'lease_up')), 0)
    FROM projects
    WHERE (p_entity_id IS NULL OR entity_id = p_entity_id);
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION convert_project_to_asset(
    p_project_id UUID,
    p_asset_type asset_type,
    p_user_id UUID
)
RETURNS UUID AS $$
DECLARE
    v_project RECORD;
    v_asset_id UUID;
    v_asset_code VARCHAR(20);
BEGIN
    -- Get project data
    SELECT * INTO v_project FROM projects WHERE id = p_project_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Project not found';
    END IF;
    
    -- Generate asset code
    SELECT 'AST-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
           LPAD((COUNT(*)::int + 1)::text, 3, '0')
    INTO v_asset_code
    FROM assets
    WHERE asset_code LIKE 'AST-' || TO_CHAR(NOW(), 'YYYY') || '%';
    
    -- Create asset
    INSERT INTO assets (
        asset_code,
        name,
        asset_type,
        entity_id,
        origin_type,
        source_project_id,
        status,
        acquisition_date,
        address,
        city,
        state,
        zip,
        county,
        year_built,
        total_units,
        total_sf,
        land_acres,
        total_basis,
        investment_thesis,
        notes
    ) VALUES (
        v_asset_code,
        v_project.name,
        p_asset_type,
        v_project.entity_id,
        'development',
        p_project_id,
        'stabilizing',
        CURRENT_DATE,
        v_project.address,
        v_project.city,
        v_project.state,
        v_project.zip,
        v_project.county,
        EXTRACT(YEAR FROM CURRENT_DATE),
        v_project.total_units,
        v_project.total_sf,
        v_project.total_acreage,
        v_project.total_budget,
        v_project.description,
        'Converted from project ' || v_project.project_code
    )
    RETURNING id INTO v_asset_id;
    
    -- Update project status
    UPDATE projects SET status = 'complete' WHERE id = p_project_id;
    
    -- Log activity
    INSERT INTO activity_feed (
        project_id, user_id, user_name,
        activity_type, title, description,
        reference_id, reference_type, icon, color
    ) VALUES (
        p_project_id,
        p_user_id,
        (SELECT full_name FROM users WHERE id = p_user_id),
        'project_converted',
        'Project converted to asset',
        'Project ' || v_project.project_code || ' converted to asset ' || v_asset_code,
        v_asset_id,
        'assets',
        'building',
        'green'
    );
    
    RETURN v_asset_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create asset from acquisition deal
CREATE OR REPLACE FUNCTION convert_deal_to_asset(
    p_deal_id UUID,
    p_asset_type asset_type,
    p_user_id UUID
)
RETURNS UUID AS $$
DECLARE
    v_deal RECORD;
    v_asset_id UUID;
    v_asset_code VARCHAR(20);
BEGIN
    -- Get deal data
    SELECT * INTO v_deal FROM deals WHERE id = p_deal_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Deal not found';
    END IF;
    
    -- Generate asset code
    SELECT 'AST-' || TO_CHAR(NOW(), 'YYYY') || '-' || 
           LPAD((COUNT(*)::int + 1)::text, 3, '0')
    INTO v_asset_code
    FROM assets
    WHERE asset_code LIKE 'AST-' || TO_CHAR(NOW(), 'YYYY') || '%';
    
    -- Create asset
    INSERT INTO assets (
        asset_code,
        name,
        asset_type,
        entity_id,
        origin_type,
        source_deal_id,
        status,
        acquisition_date,
        address,
        city,
        state,
        zip,
        county,
        total_units,
        land_acres,
        acquisition_price,
        total_basis,
        notes
    ) VALUES (
        v_asset_code,
        v_deal.name,
        p_asset_type,
        v_deal.entity_id,
        'acquisition',
        p_deal_id,
        'acquisition',
        v_deal.closing_date,
        v_deal.address,
        v_deal.city,
        v_deal.state,
        v_deal.zip,
        v_deal.county,
        v_deal.unit_count,
        v_deal.acreage,
        v_deal.contract_price,
        v_deal.contract_price,
        'Acquired from deal ' || v_deal.deal_code
    )
    RETURNING id INTO v_asset_id;
    
    -- Update deal status
    UPDATE deals SET status = 'closed_won' WHERE id = p_deal_id;
    
    RETURN v_asset_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- VIEWS
-- ============================================================

-- Project summary view with calculated fields
CREATE OR REPLACE VIEW project_summary AS
SELECT 
    p.id,
    p.project_code,
    p.name,
    p.project_type,
    p.status,
    e.name as entity_name,
    p.total_budget,
    COALESCE(SUM(t.amount), 0) as calculated_spent,
    p.total_budget - COALESCE(SUM(t.amount), 0) as remaining_budget,
    CASE 
        WHEN p.total_budget > 0 THEN ROUND((COALESCE(SUM(t.amount), 0) / p.total_budget * 100)::numeric, 2)
        ELSE 0 
    END as percent_spent,
    p.start_date,
    p.target_completion,
    COUNT(DISTINCT pr.id) as property_count,
    p.total_units,
    p.total_lots
FROM projects p
LEFT JOIN entities e ON p.entity_id = e.id
LEFT JOIN transactions t ON p.id = t.project_id AND t.transaction_type = 'expense'
LEFT JOIN properties pr ON p.id = pr.project_id
GROUP BY p.id, e.name;

-- Budget variance view
CREATE OR REPLACE VIEW budget_variance AS
SELECT 
    bi.id,
    bi.project_id,
    p.project_code,
    p.name as project_name,
    bi.category,
    bi.line_item,
    bi.budgeted_amount,
    bi.actual_amount,
    bi.variance,
    CASE 
        WHEN bi.budgeted_amount > 0 THEN ROUND((bi.actual_amount / bi.budgeted_amount * 100)::numeric, 2)
        ELSE 0 
    END as percent_used,
    CASE 
        WHEN bi.variance >= 0 THEN 'under_budget'
        ELSE 'over_budget'
    END as variance_status
FROM budget_items bi
JOIN projects p ON bi.project_id = p.id
ORDER BY p.project_code, bi.category, bi.sort_order;

-- Loan availability view
CREATE OR REPLACE VIEW loan_availability AS
SELECT 
    l.id,
    l.project_id,
    p.project_code,
    p.name as project_name,
    l.loan_type,
    l.loan_name,
    l.commitment_amount,
    l.funded_amount,
    l.remaining_availability,
    ROUND((l.funded_amount / NULLIF(l.commitment_amount, 0) * 100)::numeric, 2) as percent_drawn,
    l.interest_rate,
    l.maturity_date,
    c.full_name as lender_name,
    c.company as lender_company
FROM loans l
JOIN projects p ON l.project_id = p.id
LEFT JOIN contacts c ON l.lender_contact_id = c.id;

-- Investor capital view
CREATE OR REPLACE VIEW investor_capital AS
SELECT 
    i.id,
    i.project_id,
    p.project_code,
    p.name as project_name,
    i.investor_name,
    i.investor_class,
    i.commitment_amount,
    i.funded_amount,
    i.unfunded_commitment,
    i.ownership_percent,
    i.preferred_return,
    COALESCE(SUM(d.net_amount), 0) as total_distributions,
    c.email as investor_email,
    c.phone as investor_phone
FROM investors i
JOIN projects p ON i.project_id = p.id
LEFT JOIN contacts c ON i.contact_id = c.id
LEFT JOIN distributions d ON i.id = d.investor_id
GROUP BY i.id, p.project_code, p.name, c.email, c.phone;

-- Task board view
CREATE OR REPLACE VIEW task_board AS
SELECT 
    t.id,
    t.project_id,
    p.project_code,
    p.name as project_name,
    t.title,
    t.description,
    t.status,
    t.priority,
    t.assignee_name,
    t.due_date,
    t.kanban_order,
    CASE 
        WHEN t.due_date < CURRENT_DATE AND t.status != 'done' THEN true
        ELSE false
    END as is_overdue
FROM tasks t
JOIN projects p ON t.project_id = p.id
ORDER BY t.status, t.kanban_order;

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        AND table_name NOT LIKE 'pg_%'
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%s_updated_at ON %s;
            CREATE TRIGGER update_%s_updated_at
            BEFORE UPDATE ON %s
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
        ', t, t, t, t);
    END LOOP;
END;
$$ language 'plpgsql';

-- Function to update project totals from transactions
CREATE OR REPLACE FUNCTION update_project_totals()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE projects 
    SET 
        total_spent = (
            SELECT COALESCE(SUM(amount), 0) 
            FROM transactions 
            WHERE project_id = COALESCE(NEW.project_id, OLD.project_id) 
            AND transaction_type = 'expense'
        ),
        percent_complete = (
            SELECT CASE 
                WHEN total_budget > 0 THEN 
                    ROUND((COALESCE(SUM(t.amount), 0) / total_budget * 100)::numeric, 2)
                ELSE 0 
            END
            FROM transactions t
            WHERE t.project_id = COALESCE(NEW.project_id, OLD.project_id)
            AND t.transaction_type = 'expense'
        )
    WHERE id = COALESCE(NEW.project_id, OLD.project_id);
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_project_totals_trigger
AFTER INSERT OR UPDATE OR DELETE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_project_totals();

-- Function to update budget actuals from transactions
CREATE OR REPLACE FUNCTION update_budget_actuals()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.budget_item_id IS NOT NULL THEN
        UPDATE budget_items 
        SET actual_amount = (
            SELECT COALESCE(SUM(amount), 0) 
            FROM transactions 
            WHERE budget_item_id = NEW.budget_item_id
        )
        WHERE id = NEW.budget_item_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_budget_actuals_trigger
AFTER INSERT OR UPDATE ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_budget_actuals();

-- Function to update loan funded amount from draws
CREATE OR REPLACE FUNCTION update_loan_funded()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE loans 
    SET funded_amount = (
        SELECT COALESCE(SUM(amount_funded), 0) 
        FROM draws 
        WHERE loan_id = COALESCE(NEW.loan_id, OLD.loan_id)
        AND status = 'funded'
    )
    WHERE id = COALESCE(NEW.loan_id, OLD.loan_id);
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_loan_funded_trigger
AFTER INSERT OR UPDATE OR DELETE ON draws
FOR EACH ROW
EXECUTE FUNCTION update_loan_funded();

-- Function to update investor funded amount from capital calls
CREATE OR REPLACE FUNCTION update_investor_funded()
RETURNS TRIGGER AS $$
BEGIN
    -- This would be triggered by capital call payments
    -- Implementation depends on how capital calls are tracked
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================================
-- AUDIT LOG TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION audit_log_trigger()
RETURNS TRIGGER AS $$
DECLARE
    v_old_values JSONB;
    v_new_values JSONB;
    v_changed_fields TEXT[];
    v_action TEXT;
    v_user_id UUID;
    v_project_id UUID;
BEGIN
    -- Get current user (from Supabase auth)
    v_user_id := auth.uid();
    
    -- Determine action
    IF TG_OP = 'INSERT' THEN
        v_action := 'create';
        v_new_values := to_jsonb(NEW);
        v_old_values := NULL;
    ELSIF TG_OP = 'UPDATE' THEN
        v_action := 'update';
        v_old_values := to_jsonb(OLD);
        v_new_values := to_jsonb(NEW);
        -- Get changed fields
        SELECT ARRAY_AGG(key) INTO v_changed_fields
        FROM jsonb_each(v_new_values) n
        FULL OUTER JOIN jsonb_each(v_old_values) o USING (key)
        WHERE n.value IS DISTINCT FROM o.value
        AND key NOT IN ('updated_at', 'created_at');
    ELSIF TG_OP = 'DELETE' THEN
        v_action := 'delete';
        v_old_values := to_jsonb(OLD);
        v_new_values := NULL;
    END IF;
    
    -- Try to get project_id from the record
    IF TG_OP = 'DELETE' THEN
        v_project_id := OLD.project_id;
    ELSE
        v_project_id := NEW.project_id;
    END IF;
    
    -- Insert audit record
    INSERT INTO audit_log (
        user_id,
        action,
        entity_type,
        entity_id,
        project_id,
        old_values,
        new_values,
        changed_fields
    ) VALUES (
        v_user_id,
        v_action,
        TG_TABLE_NAME,
        CASE WHEN TG_OP = 'DELETE' THEN OLD.id ELSE NEW.id END,
        v_project_id,
        v_old_values,
        v_new_values,
        v_changed_fields
    );
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit trigger to key tables
DO $$
DECLARE
    t TEXT;
    tables_to_audit TEXT[] := ARRAY[
        'projects', 'deals', 'budget_items', 'transactions', 'draws', 
        'contracts', 'change_orders', 'bills', 'loans', 'milestones'
    ];
BEGIN
    FOREACH t IN ARRAY tables_to_audit LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS audit_trigger_%s ON %s;
            CREATE TRIGGER audit_trigger_%s
            AFTER INSERT OR UPDATE OR DELETE ON %s
            FOR EACH ROW
            EXECUTE FUNCTION audit_log_trigger();
        ', t, t, t, t);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- NOTIFICATION FUNCTIONS
-- ============================================================

-- Create a notification
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type notification_type,
    p_title VARCHAR(255),
    p_message TEXT,
    p_project_id UUID DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL,
    p_reference_table VARCHAR(50) DEFAULT NULL,
    p_link_url VARCHAR(500) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
    v_prefs RECORD;
BEGIN
    -- Check user preferences
    SELECT * INTO v_prefs 
    FROM notification_preferences 
    WHERE user_id = p_user_id AND notification_type = p_type;
    
    -- Default to enabled if no preferences set
    IF NOT FOUND THEN
        v_prefs.in_app := true;
        v_prefs.email := true;
    END IF;
    
    -- Create in-app notification if enabled
    IF v_prefs.in_app THEN
        INSERT INTO notifications (
            user_id, notification_type, title, message,
            project_id, reference_id, reference_table, link_url
        ) VALUES (
            p_user_id, p_type, p_title, p_message,
            p_project_id, p_reference_id, p_reference_table, p_link_url
        )
        RETURNING id INTO v_notification_id;
    END IF;
    
    -- Note: Email sending would be handled by a separate service/edge function
    -- This just records that email should be sent
    IF v_prefs.email THEN
        UPDATE notifications SET email_sent = false WHERE id = v_notification_id;
    END IF;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Notify project team
CREATE OR REPLACE FUNCTION notify_project_team(
    p_project_id UUID,
    p_type notification_type,
    p_title VARCHAR(255),
    p_message TEXT,
    p_exclude_user_id UUID DEFAULT NULL,
    p_reference_id UUID DEFAULT NULL,
    p_reference_table VARCHAR(50) DEFAULT NULL
)
RETURNS void AS $$
DECLARE
    v_user_id UUID;
BEGIN
    -- Get all users with access to this project
    FOR v_user_id IN 
        SELECT DISTINCT u.id 
        FROM users u
        WHERE u.id IN (
            -- Direct project assignment
            SELECT user_id FROM project_users WHERE project_id = p_project_id
            UNION
            -- Team membership
            SELECT tm.user_id FROM team_members tm
            JOIN project_teams pt ON tm.team_id = pt.team_id
            WHERE pt.project_id = p_project_id
            UNION
            -- Admins and executives see all
            SELECT id FROM users WHERE role IN ('admin', 'executive')
        )
        AND (p_exclude_user_id IS NULL OR u.id != p_exclude_user_id)
    LOOP
        PERFORM create_notification(
            v_user_id, p_type, p_title, p_message,
            p_project_id, p_reference_id, p_reference_table
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ALERT CHECKING FUNCTIONS
-- ============================================================

-- Check for insurance expiring
CREATE OR REPLACE FUNCTION check_insurance_alerts()
RETURNS void AS $$
DECLARE
    v_cert RECORD;
    v_days_until INTEGER;
BEGIN
    FOR v_cert IN 
        SELECT ic.*, c.full_name as vendor_name
        FROM insurance_certificates ic
        JOIN contacts c ON ic.contact_id = c.id
        WHERE ic.status = 'active'
        AND ic.expiration_date <= CURRENT_DATE + INTERVAL '30 days'
    LOOP
        v_days_until := v_cert.expiration_date - CURRENT_DATE;
        
        -- 30 day alert
        IF v_days_until <= 30 AND v_days_until > 14 AND NOT v_cert.alert_sent_30_days THEN
            PERFORM notify_project_team(
                v_cert.project_id,
                'insurance_expiring',
                'Insurance Expiring in ' || v_days_until || ' days',
                v_cert.vendor_name || '''s ' || v_cert.coverage_type || ' insurance expires on ' || v_cert.expiration_date,
                NULL,
                v_cert.id,
                'insurance_certificates'
            );
            UPDATE insurance_certificates SET alert_sent_30_days = true WHERE id = v_cert.id;
        END IF;
        
        -- 14 day alert
        IF v_days_until <= 14 AND v_days_until > 7 AND NOT v_cert.alert_sent_14_days THEN
            PERFORM notify_project_team(
                v_cert.project_id,
                'insurance_expiring',
                'URGENT: Insurance Expiring in ' || v_days_until || ' days',
                v_cert.vendor_name || '''s ' || v_cert.coverage_type || ' insurance expires on ' || v_cert.expiration_date,
                NULL,
                v_cert.id,
                'insurance_certificates'
            );
            UPDATE insurance_certificates SET alert_sent_14_days = true WHERE id = v_cert.id;
        END IF;
        
        -- 7 day alert
        IF v_days_until <= 7 AND NOT v_cert.alert_sent_7_days THEN
            PERFORM notify_project_team(
                v_cert.project_id,
                'insurance_expiring',
                'CRITICAL: Insurance Expiring in ' || v_days_until || ' days',
                v_cert.vendor_name || '''s ' || v_cert.coverage_type || ' insurance expires on ' || v_cert.expiration_date || '. Obtain updated certificate immediately.',
                NULL,
                v_cert.id,
                'insurance_certificates'
            );
            UPDATE insurance_certificates SET alert_sent_7_days = true WHERE id = v_cert.id;
        END IF;
        
        -- Mark as expired
        IF v_days_until < 0 THEN
            UPDATE insurance_certificates SET status = 'expired' WHERE id = v_cert.id;
        ELSIF v_days_until <= 30 THEN
            UPDATE insurance_certificates SET status = 'expiring' WHERE id = v_cert.id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check for budget variance alerts
CREATE OR REPLACE FUNCTION check_budget_variance_alerts()
RETURNS void AS $$
DECLARE
    v_item RECORD;
    v_variance_percent DECIMAL;
BEGIN
    FOR v_item IN 
        SELECT 
            bi.*,
            p.project_code,
            p.name as project_name
        FROM budget_items bi
        JOIN projects p ON bi.project_id = p.id
        WHERE bi.budgeted_amount > 0
        AND bi.actual_amount > bi.budgeted_amount * 1.1 -- Over 10%
    LOOP
        v_variance_percent := ROUND(((v_item.actual_amount - v_item.budgeted_amount) / v_item.budgeted_amount * 100)::numeric, 1);
        
        PERFORM notify_project_team(
            v_item.project_id,
            'budget_variance',
            'Budget Alert: ' || v_item.line_item || ' over budget',
            v_item.project_code || ' - ' || v_item.line_item || ' is ' || v_variance_percent || '% over budget. Budgeted: $' || v_item.budgeted_amount || ', Actual: $' || v_item.actual_amount,
            NULL,
            v_item.id,
            'budget_items'
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check for overdue tasks
CREATE OR REPLACE FUNCTION check_overdue_task_alerts()
RETURNS void AS $$
DECLARE
    v_task RECORD;
BEGIN
    FOR v_task IN 
        SELECT 
            t.*,
            p.project_code,
            u.id as assignee_user_id
        FROM tasks t
        JOIN projects p ON t.project_id = p.id
        LEFT JOIN users u ON t.assignee_id = u.id
        WHERE t.status NOT IN ('done', 'cancelled')
        AND t.due_date < CURRENT_DATE
    LOOP
        -- Notify assignee
        IF v_task.assignee_user_id IS NOT NULL THEN
            PERFORM create_notification(
                v_task.assignee_user_id,
                'task_overdue',
                'Task Overdue: ' || v_task.title,
                'Task "' || v_task.title || '" on project ' || v_task.project_code || ' is overdue (due: ' || v_task.due_date || ')',
                v_task.project_id,
                v_task.id,
                'tasks'
            );
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ACTIVITY FEED TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
DECLARE
    v_title TEXT;
    v_description TEXT;
    v_icon TEXT;
    v_color TEXT;
    v_user_name TEXT;
BEGIN
    -- Get user name
    SELECT full_name INTO v_user_name FROM users WHERE id = auth.uid();
    v_user_name := COALESCE(v_user_name, 'System');
    
    -- Determine activity details based on table and operation
    CASE TG_TABLE_NAME
        WHEN 'projects' THEN
            IF TG_OP = 'INSERT' THEN
                v_title := 'Project created';
                v_description := 'Created project ' || NEW.name;
                v_icon := 'folder-plus';
                v_color := 'green';
            ELSIF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
                v_title := 'Status changed';
                v_description := 'Changed status from ' || OLD.status || ' to ' || NEW.status;
                v_icon := 'refresh';
                v_color := 'blue';
            END IF;
        WHEN 'draws' THEN
            IF TG_OP = 'UPDATE' AND NEW.status = 'funded' AND OLD.status != 'funded' THEN
                v_title := 'Draw funded';
                v_description := 'Draw #' || NEW.draw_number || ' funded: $' || NEW.amount_funded;
                v_icon := 'dollar-sign';
                v_color := 'green';
            ELSIF TG_OP = 'INSERT' THEN
                v_title := 'Draw requested';
                v_description := 'Draw #' || NEW.draw_number || ' requested: $' || NEW.amount_requested;
                v_icon := 'file-text';
                v_color := 'blue';
            END IF;
        WHEN 'milestones' THEN
            IF TG_OP = 'UPDATE' AND NEW.is_complete AND NOT OLD.is_complete THEN
                v_title := 'Milestone reached';
                v_description := 'Completed: ' || NEW.name;
                v_icon := 'flag';
                v_color := 'green';
            END IF;
        WHEN 'tasks' THEN
            IF TG_OP = 'UPDATE' AND NEW.status = 'done' AND OLD.status != 'done' THEN
                v_title := 'Task completed';
                v_description := 'Completed: ' || NEW.title;
                v_icon := 'check-circle';
                v_color := 'green';
            END IF;
        ELSE
            RETURN NEW;
    END CASE;
    
    -- Insert activity if we have something to log
    IF v_title IS NOT NULL THEN
        INSERT INTO activity_feed (
            project_id, user_id, user_name,
            activity_type, title, description,
            reference_id, reference_type,
            icon, color
        ) VALUES (
            COALESCE(NEW.project_id, OLD.project_id),
            auth.uid(),
            v_user_name,
            TG_TABLE_NAME || '_' || lower(TG_OP),
            v_title,
            v_description,
            COALESCE(NEW.id, OLD.id),
            TG_TABLE_NAME,
            v_icon,
            v_color
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply activity feed trigger to key tables
CREATE TRIGGER activity_feed_projects AFTER INSERT OR UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER activity_feed_draws AFTER INSERT OR UPDATE ON draws
    FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER activity_feed_milestones AFTER UPDATE ON milestones
    FOR EACH ROW EXECUTE FUNCTION log_activity();
CREATE TRIGGER activity_feed_tasks AFTER UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION log_activity();

-- ============================================================
-- INDEXES
-- ============================================================

-- Deals indexes
CREATE INDEX idx_deals_status ON deals(status);
CREATE INDEX idx_deals_entity ON deals(entity_id);
CREATE INDEX idx_deals_assigned ON deals(assigned_to_user_id);
CREATE INDEX idx_deals_converted ON deals(converted_to_project_id);

-- Teams indexes
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_project_teams_project ON project_teams(project_id);
CREATE INDEX idx_project_teams_team ON project_teams(team_id);
CREATE INDEX idx_project_users_project ON project_users(project_id);
CREATE INDEX idx_project_users_user ON project_users(user_id);

-- Projects indexes
CREATE INDEX idx_projects_entity ON projects(entity_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_type ON projects(project_type);
CREATE INDEX idx_projects_code ON projects(project_code);

-- Properties indexes
CREATE INDEX idx_properties_project ON properties(project_id);
CREATE INDEX idx_properties_tax_map ON properties(tax_map_number);

-- Contacts indexes
CREATE INDEX idx_contacts_type ON contacts(contact_type);
CREATE INDEX idx_contacts_company ON contacts(company);
CREATE INDEX idx_contacts_email ON contacts(email);

-- Budget indexes
CREATE INDEX idx_budget_project ON budget_items(project_id);
CREATE INDEX idx_budget_category ON budget_items(category);

-- Transactions indexes
CREATE INDEX idx_transactions_project ON transactions(project_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_budget_item ON transactions(budget_item_id);

-- Tasks indexes
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_assignee ON tasks(assignee_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Communications indexes
CREATE INDEX idx_communications_project ON communications(project_id);
CREATE INDEX idx_communications_contact ON communications(contact_id);
CREATE INDEX idx_communications_date ON communications(communication_date);
CREATE INDEX idx_communications_outlook_id ON communications(outlook_message_id);

-- Approvals indexes
CREATE INDEX idx_approval_requests_project ON approval_requests(project_id);
CREATE INDEX idx_approval_requests_status ON approval_requests(status);
CREATE INDEX idx_approval_requests_type ON approval_requests(approval_type);
CREATE INDEX idx_approval_actions_request ON approval_actions(request_id);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_project ON notifications(project_id);
CREATE INDEX idx_notifications_type ON notifications(notification_type);

-- Audit log indexes
CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_project ON audit_log(project_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at);

-- Activity feed indexes
CREATE INDEX idx_activity_feed_project ON activity_feed(project_id);
CREATE INDEX idx_activity_feed_created ON activity_feed(created_at);

-- Bills indexes
CREATE INDEX idx_bills_project ON bills(project_id);
CREATE INDEX idx_bills_vendor ON bills(vendor_id);
CREATE INDEX idx_bills_status ON bills(status);
CREATE INDEX idx_bills_due_date ON bills(due_date);

-- Change orders indexes
CREATE INDEX idx_change_orders_project ON change_orders(project_id);
CREATE INDEX idx_change_orders_contract ON change_orders(contract_id);
CREATE INDEX idx_change_orders_status ON change_orders(status);

-- Lien waivers indexes
CREATE INDEX idx_lien_waivers_project ON lien_waivers(project_id);
CREATE INDEX idx_lien_waivers_vendor ON lien_waivers(vendor_id);
CREATE INDEX idx_lien_waivers_draw ON lien_waivers(draw_id);
CREATE INDEX idx_lien_waivers_status ON lien_waivers(status);

-- Insurance certificates indexes
CREATE INDEX idx_insurance_certs_contact ON insurance_certificates(contact_id);
CREATE INDEX idx_insurance_certs_project ON insurance_certificates(project_id);
CREATE INDEX idx_insurance_certs_expiry ON insurance_certificates(expiration_date);
CREATE INDEX idx_insurance_certs_status ON insurance_certificates(status);

-- Issues indexes
CREATE INDEX idx_issues_project ON issues(project_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_assigned ON issues(assigned_to_id);
CREATE INDEX idx_issues_category ON issues(category);
CREATE INDEX idx_issue_comments_issue ON issue_comments(issue_id);

-- Inspections indexes
CREATE INDEX idx_inspections_project ON inspections(project_id);
CREATE INDEX idx_inspections_date ON inspections(scheduled_date);
CREATE INDEX idx_inspections_status ON inspections(status);

-- Proforma indexes
CREATE INDEX idx_proformas_project ON proformas(project_id);
CREATE INDEX idx_proformas_active ON proformas(project_id, is_active);
CREATE INDEX idx_proforma_items_proforma ON proforma_line_items(proforma_id);

-- Retainage indexes
CREATE INDEX idx_retainage_project ON retainage(project_id);
CREATE INDEX idx_retainage_vendor ON retainage(vendor_id);
CREATE INDEX idx_retainage_status ON retainage(status);

-- Warranty indexes
CREATE INDEX idx_warranties_project ON warranties(project_id);
CREATE INDEX idx_warranties_end ON warranties(end_date);
CREATE INDEX idx_warranty_claims_warranty ON warranty_claims(warranty_id);
CREATE INDEX idx_warranty_claims_project ON warranty_claims(project_id);

-- Progress photos indexes
CREATE INDEX idx_progress_photos_project ON progress_photos(project_id);
CREATE INDEX idx_progress_photos_date ON progress_photos(photo_date);

-- Vendor prequalification indexes
CREATE INDEX idx_vendor_prequal_vendor ON vendor_prequalification(vendor_id);
CREATE INDEX idx_vendor_prequal_status ON vendor_prequalification(status);
CREATE INDEX idx_preferred_vendors_vendor ON preferred_vendors(vendor_id);
CREATE INDEX idx_preferred_vendors_trade ON preferred_vendors(trade_category);

-- Bid indexes
CREATE INDEX idx_bid_packages_project ON bid_packages(project_id);
CREATE INDEX idx_bid_packages_status ON bid_packages(status);
CREATE INDEX idx_bids_package ON bids(bid_package_id);
CREATE INDEX idx_bids_vendor ON bids(vendor_id);

-- Meeting indexes
CREATE INDEX idx_meetings_project ON meetings(project_id);
CREATE INDEX idx_meetings_date ON meetings(meeting_date);
CREATE INDEX idx_meeting_actions_meeting ON meeting_action_items(meeting_id);

-- RFI indexes
CREATE INDEX idx_rfis_project ON rfis(project_id);
CREATE INDEX idx_rfis_status ON rfis(status);

-- Submittal indexes
CREATE INDEX idx_submittals_project ON submittals(project_id);
CREATE INDEX idx_submittals_status ON submittals(status);

-- Product library indexes
CREATE INDEX idx_product_library_type ON product_library(product_type);
CREATE INDEX idx_product_library_category ON product_library(category);
CREATE INDEX idx_product_library_active ON product_library(is_active);
CREATE INDEX idx_product_library_series ON product_library(series);
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_type ON product_images(image_type);
CREATE INDEX idx_product_floor_plans_product ON product_floor_plans(product_id);
CREATE INDEX idx_product_elevations_product ON product_elevations(product_id);
CREATE INDEX idx_product_upgrade_packages_product ON product_upgrade_packages(product_id);
CREATE INDEX idx_product_upgrade_packages_category ON product_upgrade_packages(category);
CREATE INDEX idx_product_upgrade_options_product ON product_upgrade_options(product_id);
CREATE INDEX idx_product_upgrade_options_package ON product_upgrade_options(package_id);
CREATE INDEX idx_product_documents_product ON product_documents(product_id);
CREATE INDEX idx_product_usage_product ON product_usage(product_id);
CREATE INDEX idx_product_usage_project ON product_usage(project_id);

-- Lot development indexes
CREATE INDEX idx_lot_dev_project ON lot_development(project_id);
CREATE INDEX idx_lot_dev_property ON lot_development(property_id);
CREATE INDEX idx_lot_dev_status ON lot_development(status);
CREATE INDEX idx_lot_dev_product ON lot_development(assigned_product_id);

-- AI indexes
CREATE INDEX idx_ai_tasks_type ON ai_tasks(task_type);
CREATE INDEX idx_ai_tasks_status ON ai_tasks(status);
CREATE INDEX idx_ai_tasks_deal ON ai_tasks(deal_id);
CREATE INDEX idx_ai_tasks_project ON ai_tasks(project_id);
CREATE INDEX idx_ai_analysis_entity ON ai_analysis(entity_type, entity_id);
CREATE INDEX idx_ai_research_location ON ai_research(location_city, location_state);
CREATE INDEX idx_ai_conversations_user ON ai_conversations(user_id);

-- Asset Management indexes
CREATE INDEX idx_assets_entity ON assets(entity_id);
CREATE INDEX idx_assets_status ON assets(status);
CREATE INDEX idx_assets_type ON assets(asset_type);
CREATE INDEX idx_assets_source_project ON assets(source_project_id);
CREATE INDEX idx_assets_source_deal ON assets(source_deal_id);

CREATE INDEX idx_pm_report_imports_asset ON pm_report_imports(asset_id);
CREATE INDEX idx_pm_report_imports_period ON pm_report_imports(report_period_year, report_period_month);

CREATE INDEX idx_asset_income_statements_asset ON asset_income_statements(asset_id);
CREATE INDEX idx_asset_income_statements_period ON asset_income_statements(period_year, period_month);

CREATE INDEX idx_asset_rent_rolls_asset ON asset_rent_rolls(asset_id);
CREATE INDEX idx_asset_rent_rolls_date ON asset_rent_rolls(as_of_date);

CREATE INDEX idx_asset_fixed_expenses_asset ON asset_fixed_expenses(asset_id);
CREATE INDEX idx_asset_property_taxes_asset ON asset_property_taxes(asset_id);
CREATE INDEX idx_asset_insurance_asset ON asset_insurance(asset_id);
CREATE INDEX idx_asset_insurance_expiry ON asset_insurance(expiration_date);

CREATE INDEX idx_asset_loans_asset ON asset_loans(asset_id);
CREATE INDEX idx_asset_loans_maturity ON asset_loans(maturity_date);
CREATE INDEX idx_asset_debt_payments_loan ON asset_debt_payments(loan_id);
CREATE INDEX idx_asset_debt_payments_date ON asset_debt_payments(payment_date);

CREATE INDEX idx_asset_capex_asset ON asset_capex(asset_id);
CREATE INDEX idx_asset_capex_status ON asset_capex(status);
CREATE INDEX idx_asset_capex_payments_capex ON asset_capex_payments(capex_id);

CREATE INDEX idx_asset_balance_sheets_asset ON asset_balance_sheets(asset_id);
CREATE INDEX idx_asset_cash_flows_asset ON asset_cash_flows(asset_id);
CREATE INDEX idx_asset_valuations_asset ON asset_valuations(asset_id);
CREATE INDEX idx_asset_budgets_asset ON asset_budgets(asset_id);

-- ============================================================
-- EXECUTIVE DASHBOARD & ENTITY TRACKING
-- ============================================================

-- Entity financial summary (monthly snapshots per entity)
CREATE TABLE entity_financials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    
    -- Period
    period_year INTEGER NOT NULL,
    period_month INTEGER NOT NULL,
    period_date DATE NOT NULL,
    
    -- Cash position
    cash_on_hand DECIMAL(15,2),
    operating_account_balance DECIMAL(15,2),
    reserve_account_balance DECIMAL(15,2),
    
    -- Receivables
    accounts_receivable DECIMAL(15,2),
    loans_receivable DECIMAL(15,2), -- Intercompany or investor loans
    
    -- Payables
    accounts_payable DECIMAL(15,2),
    accrued_expenses DECIMAL(15,2),
    
    -- Debt summary
    total_debt DECIMAL(15,2),
    current_portion_debt DECIMAL(15,2),
    
    -- Income summary (from all sources)
    development_income DECIMAL(12,2), -- From project sales
    rental_income DECIMAL(12,2), -- From assets
    fee_income DECIMAL(12,2), -- Management/development fees
    interest_income DECIMAL(12,2),
    other_income DECIMAL(12,2),
    total_income DECIMAL(12,2),
    
    -- Expense summary
    payroll_expense DECIMAL(12,2),
    overhead_expense DECIMAL(12,2),
    interest_expense DECIMAL(12,2),
    other_expense DECIMAL(12,2),
    total_expense DECIMAL(12,2),
    
    -- Net
    net_income DECIMAL(12,2),
    
    -- Cash flow
    cash_from_operations DECIMAL(12,2),
    cash_from_investing DECIMAL(12,2),
    cash_from_financing DECIMAL(12,2),
    net_cash_flow DECIMAL(12,2),
    
    -- Key metrics
    current_ratio DECIMAL(5,2),
    debt_to_equity DECIMAL(5,2),
    
    -- Source
    source VARCHAR(50), -- 'manual', 'quickbooks', 'calculated'
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(entity_id, period_year, period_month)
);

-- Entity cash transactions (track money in/out per entity)
CREATE TABLE entity_cash_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    
    -- Transaction details
    transaction_date DATE NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, 
    -- Types: 'capital_contribution', 'distribution', 'intercompany_transfer', 
    -- 'loan_proceeds', 'loan_payment', 'project_funding', 'project_proceeds',
    -- 'asset_acquisition', 'asset_sale', 'operating_expense', 'fee_income'
    
    -- Amount (positive = in, negative = out)
    amount DECIMAL(15,2) NOT NULL,
    
    -- Related records
    project_id UUID REFERENCES projects(id),
    deal_id UUID REFERENCES deals(id),
    asset_id UUID REFERENCES assets(id),
    related_entity_id UUID REFERENCES entities(id), -- For intercompany
    
    -- Description
    description TEXT,
    reference_number VARCHAR(100),
    
    -- Categorization
    category VARCHAR(100), -- 'operations', 'investing', 'financing'
    subcategory VARCHAR(100),
    
    -- Status
    status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'completed', 'cancelled'
    
    -- Documents
    document_id UUID REFERENCES documents(id),
    
    notes TEXT,
    
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deal pipeline summary (for dashboard tracking)
CREATE TABLE deal_pipeline_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Snapshot date
    snapshot_date DATE NOT NULL,
    
    -- By status counts
    prospects_count INTEGER DEFAULT 0,
    prospects_value DECIMAL(15,2) DEFAULT 0,
    
    loi_count INTEGER DEFAULT 0,
    loi_value DECIMAL(15,2) DEFAULT 0,
    
    under_contract_count INTEGER DEFAULT 0,
    under_contract_value DECIMAL(15,2) DEFAULT 0,
    
    due_diligence_count INTEGER DEFAULT 0,
    due_diligence_value DECIMAL(15,2) DEFAULT 0,
    
    closing_count INTEGER DEFAULT 0,
    closing_value DECIMAL(15,2) DEFAULT 0,
    
    -- Totals
    total_active_deals INTEGER DEFAULT 0,
    total_pipeline_value DECIMAL(15,2) DEFAULT 0,
    
    -- Conversion metrics (trailing 12 months)
    deals_won_t12 INTEGER DEFAULT 0,
    deals_won_value_t12 DECIMAL(15,2) DEFAULT 0,
    deals_lost_t12 INTEGER DEFAULT 0,
    win_rate_t12 DECIMAL(5,2),
    
    -- By entity breakdown
    by_entity JSONB, -- Array of {entity_id, entity_name, count, value}
    
    -- By deal type breakdown
    by_deal_type JSONB, -- Array of {type, count, value}
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(snapshot_date)
);

-- Project status summary (for dashboard tracking)
CREATE TABLE project_status_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Snapshot date
    snapshot_date DATE NOT NULL,
    
    -- By status counts
    predevelopment_count INTEGER DEFAULT 0,
    predevelopment_budget DECIMAL(15,2) DEFAULT 0,
    
    entitlement_count INTEGER DEFAULT 0,
    entitlement_budget DECIMAL(15,2) DEFAULT 0,
    
    design_count INTEGER DEFAULT 0,
    design_budget DECIMAL(15,2) DEFAULT 0,
    
    permitting_count INTEGER DEFAULT 0,
    permitting_budget DECIMAL(15,2) DEFAULT 0,
    
    construction_count INTEGER DEFAULT 0,
    construction_budget DECIMAL(15,2) DEFAULT 0,
    construction_spent DECIMAL(15,2) DEFAULT 0,
    
    lease_up_count INTEGER DEFAULT 0,
    
    complete_count INTEGER DEFAULT 0,
    
    -- Totals
    total_active_projects INTEGER DEFAULT 0,
    total_budget DECIMAL(15,2) DEFAULT 0,
    total_spent DECIMAL(15,2) DEFAULT 0,
    total_remaining DECIMAL(15,2) DEFAULT 0,
    
    -- Units summary
    total_units_in_development INTEGER DEFAULT 0,
    total_sf_in_development INTEGER DEFAULT 0,
    
    -- By entity breakdown
    by_entity JSONB,
    
    -- By project type breakdown
    by_project_type JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(snapshot_date)
);

-- Dashboard KPI definitions (configurable metrics)
CREATE TABLE dashboard_kpis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- KPI identification
    kpi_code VARCHAR(50) NOT NULL UNIQUE,
    kpi_name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Categorization
    category VARCHAR(100), -- 'deals', 'projects', 'assets', 'financial', 'operations'
    
    -- Calculation
    calculation_type VARCHAR(50), -- 'count', 'sum', 'average', 'ratio', 'custom'
    source_table VARCHAR(100),
    source_field VARCHAR(100),
    filter_conditions JSONB,
    
    -- Display
    display_format VARCHAR(50), -- 'number', 'currency', 'percent', 'days'
    decimal_places INTEGER DEFAULT 0,
    
    -- Thresholds for color coding
    warning_threshold DECIMAL(15,2),
    warning_direction VARCHAR(10), -- 'above', 'below'
    critical_threshold DECIMAL(15,2),
    critical_direction VARCHAR(10),
    
    -- Target
    target_value DECIMAL(15,2),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Dashboard widgets (user-configurable dashboard layout)
CREATE TABLE dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Widget identification
    widget_code VARCHAR(50) NOT NULL,
    widget_name VARCHAR(255) NOT NULL,
    
    -- Widget type
    widget_type VARCHAR(50), -- 'kpi_card', 'chart', 'table', 'list', 'map'
    
    -- Configuration
    config JSONB, -- Widget-specific configuration
    
    -- Data source
    data_source VARCHAR(100), -- Table or view name
    query_template TEXT, -- SQL template with parameters
    
    -- Display
    default_width INTEGER DEFAULT 4, -- Grid columns (1-12)
    default_height INTEGER DEFAULT 2, -- Grid rows
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_system BOOLEAN DEFAULT true, -- System vs user-created
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User dashboard layouts (personalized dashboards)
CREATE TABLE user_dashboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    
    -- Dashboard identification
    dashboard_name VARCHAR(255) NOT NULL,
    dashboard_type VARCHAR(50) DEFAULT 'custom', -- 'default', 'executive', 'operations', 'custom'
    
    -- Layout
    layout JSONB, -- Array of {widget_id, x, y, width, height}
    
    -- Filters
    default_entity_id UUID REFERENCES entities(id),
    default_date_range VARCHAR(50), -- 'mtd', 'qtd', 'ytd', 'ttm', 'custom'
    
    -- Status
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- DASHBOARD VIEWS (Pre-calculated for performance)
-- ============================================================

-- View: Current deal pipeline by entity
CREATE OR REPLACE VIEW v_deal_pipeline_by_entity AS
SELECT 
    e.id as entity_id,
    e.name as entity_name,
    COUNT(d.id) as total_deals,
    COUNT(d.id) FILTER (WHERE d.status = 'prospect') as prospects,
    COUNT(d.id) FILTER (WHERE d.status = 'loi') as loi,
    COUNT(d.id) FILTER (WHERE d.status = 'under_contract') as under_contract,
    COUNT(d.id) FILTER (WHERE d.status = 'due_diligence') as due_diligence,
    COUNT(d.id) FILTER (WHERE d.status = 'closing') as closing,
    COALESCE(SUM(d.contract_price) FILTER (WHERE d.status NOT IN ('closed_won', 'closed_lost', 'dead')), 0) as pipeline_value,
    COALESCE(SUM(d.contract_price) FILTER (WHERE d.status = 'under_contract'), 0) as under_contract_value
FROM entities e
LEFT JOIN deals d ON e.id = d.entity_id AND d.status NOT IN ('closed_won', 'closed_lost', 'dead')
GROUP BY e.id, e.name
ORDER BY e.name;

-- View: Current project status by entity
CREATE OR REPLACE VIEW v_project_status_by_entity AS
SELECT 
    e.id as entity_id,
    e.name as entity_name,
    COUNT(p.id) as total_projects,
    COUNT(p.id) FILTER (WHERE p.status = 'predevelopment') as predevelopment,
    COUNT(p.id) FILTER (WHERE p.status = 'entitlement') as entitlement,
    COUNT(p.id) FILTER (WHERE p.status = 'design') as design,
    COUNT(p.id) FILTER (WHERE p.status = 'permitting') as permitting,
    COUNT(p.id) FILTER (WHERE p.status = 'construction') as construction,
    COUNT(p.id) FILTER (WHERE p.status = 'lease_up') as lease_up,
    COALESCE(SUM(p.total_budget), 0) as total_budget,
    COALESCE(SUM(p.total_spent), 0) as total_spent,
    COALESCE(SUM(p.total_budget) - SUM(p.total_spent), 0) as remaining_budget,
    COALESCE(SUM(p.total_units), 0) as total_units
FROM entities e
LEFT JOIN projects p ON e.id = p.entity_id AND p.status NOT IN ('complete', 'cancelled', 'on_hold')
GROUP BY e.id, e.name
ORDER BY e.name;

-- View: Asset portfolio by entity
CREATE OR REPLACE VIEW v_asset_portfolio_by_entity AS
SELECT 
    e.id as entity_id,
    e.name as entity_name,
    COUNT(a.id) as total_assets,
    COALESCE(SUM(a.total_units), 0) as total_units,
    COALESCE(SUM(a.current_value), 0) as total_value,
    COALESCE(SUM(a.current_noi_annual), 0) as total_noi,
    COALESCE(AVG(a.current_occupancy), 0) as avg_occupancy,
    COUNT(a.id) FILTER (WHERE a.status = 'stabilized') as stabilized_count,
    COUNT(a.id) FILTER (WHERE a.status = 'stabilizing') as stabilizing_count,
    COUNT(a.id) FILTER (WHERE a.status = 'value_add') as value_add_count
FROM entities e
LEFT JOIN assets a ON e.id = a.entity_id AND a.status NOT IN ('sold', 'disposition')
GROUP BY e.id, e.name
ORDER BY e.name;

-- View: Entity cash position summary
CREATE OR REPLACE VIEW v_entity_cash_summary AS
SELECT 
    e.id as entity_id,
    e.name as entity_name,
    e.entity_type,
    
    -- From latest financials
    ef.cash_on_hand,
    ef.period_year,
    ef.period_month,
    
    -- Active deals value
    COALESCE(deals.pipeline_value, 0) as deal_pipeline_value,
    
    -- Project commitments
    COALESCE(projects.remaining_budget, 0) as project_commitments,
    
    -- Asset value
    COALESCE(assets.total_value, 0) as asset_value,
    COALESCE(assets.total_noi, 0) as asset_noi,
    
    -- Calculated available
    COALESCE(ef.cash_on_hand, 0) - COALESCE(projects.remaining_budget, 0) as available_cash
    
FROM entities e
LEFT JOIN LATERAL (
    SELECT * FROM entity_financials 
    WHERE entity_id = e.id 
    ORDER BY period_year DESC, period_month DESC 
    LIMIT 1
) ef ON true
LEFT JOIN v_deal_pipeline_by_entity deals ON e.id = deals.entity_id
LEFT JOIN v_project_status_by_entity projects ON e.id = projects.entity_id
LEFT JOIN v_asset_portfolio_by_entity assets ON e.id = assets.entity_id
ORDER BY e.name;

-- View: Complete entity overview
CREATE OR REPLACE VIEW v_entity_overview AS
SELECT 
    e.id,
    e.name,
    e.entity_type,
    e.tax_id,
    e.state_of_formation,
    e.is_active,
    
    -- Deals
    COALESCE(d.total_deals, 0) as active_deals,
    COALESCE(d.pipeline_value, 0) as deal_pipeline_value,
    
    -- Projects
    COALESCE(p.total_projects, 0) as active_projects,
    COALESCE(p.total_budget, 0) as project_total_budget,
    COALESCE(p.total_spent, 0) as project_total_spent,
    COALESCE(p.total_units, 0) as units_in_development,
    
    -- Assets
    COALESCE(a.total_assets, 0) as total_assets,
    COALESCE(a.total_units, 0) as units_owned,
    COALESCE(a.total_value, 0) as asset_value,
    COALESCE(a.total_noi, 0) as asset_noi,
    COALESCE(a.avg_occupancy, 0) as avg_occupancy,
    
    -- Cash
    COALESCE(c.cash_on_hand, 0) as cash_on_hand,
    
    -- Activity
    e.created_at,
    e.updated_at
    
FROM entities e
LEFT JOIN v_deal_pipeline_by_entity d ON e.id = d.entity_id
LEFT JOIN v_project_status_by_entity p ON e.id = p.entity_id
LEFT JOIN v_asset_portfolio_by_entity a ON e.id = a.entity_id
LEFT JOIN v_entity_cash_summary c ON e.id = c.entity_id
WHERE e.is_active = true
ORDER BY e.name;

-- ============================================================
-- DASHBOARD HELPER FUNCTIONS
-- ============================================================

-- Function to create daily pipeline snapshot
CREATE OR REPLACE FUNCTION create_pipeline_snapshot()
RETURNS void AS $$
DECLARE
    v_date DATE := CURRENT_DATE;
BEGIN
    INSERT INTO deal_pipeline_snapshots (
        snapshot_date,
        prospects_count, prospects_value,
        loi_count, loi_value,
        under_contract_count, under_contract_value,
        due_diligence_count, due_diligence_value,
        closing_count, closing_value,
        total_active_deals, total_pipeline_value,
        deals_won_t12, deals_won_value_t12,
        deals_lost_t12, win_rate_t12,
        by_entity, by_deal_type
    )
    SELECT 
        v_date,
        COUNT(*) FILTER (WHERE status = 'prospect'),
        COALESCE(SUM(contract_price) FILTER (WHERE status = 'prospect'), 0),
        COUNT(*) FILTER (WHERE status = 'loi'),
        COALESCE(SUM(contract_price) FILTER (WHERE status = 'loi'), 0),
        COUNT(*) FILTER (WHERE status = 'under_contract'),
        COALESCE(SUM(contract_price) FILTER (WHERE status = 'under_contract'), 0),
        COUNT(*) FILTER (WHERE status = 'due_diligence'),
        COALESCE(SUM(contract_price) FILTER (WHERE status = 'due_diligence'), 0),
        COUNT(*) FILTER (WHERE status = 'closing'),
        COALESCE(SUM(contract_price) FILTER (WHERE status = 'closing'), 0),
        COUNT(*) FILTER (WHERE status NOT IN ('closed_won', 'closed_lost', 'dead')),
        COALESCE(SUM(contract_price) FILTER (WHERE status NOT IN ('closed_won', 'closed_lost', 'dead')), 0),
        COUNT(*) FILTER (WHERE status = 'closed_won' AND updated_at > v_date - INTERVAL '12 months'),
        COALESCE(SUM(contract_price) FILTER (WHERE status = 'closed_won' AND updated_at > v_date - INTERVAL '12 months'), 0),
        COUNT(*) FILTER (WHERE status IN ('closed_lost', 'dead') AND updated_at > v_date - INTERVAL '12 months'),
        CASE 
            WHEN COUNT(*) FILTER (WHERE status IN ('closed_won', 'closed_lost', 'dead') AND updated_at > v_date - INTERVAL '12 months') > 0
            THEN ROUND(
                COUNT(*) FILTER (WHERE status = 'closed_won' AND updated_at > v_date - INTERVAL '12 months')::numeric / 
                COUNT(*) FILTER (WHERE status IN ('closed_won', 'closed_lost', 'dead') AND updated_at > v_date - INTERVAL '12 months') * 100, 1
            )
            ELSE 0
        END,
        (SELECT jsonb_agg(row_to_json(t)) FROM v_deal_pipeline_by_entity t),
        (SELECT jsonb_agg(jsonb_build_object('type', deal_type, 'count', cnt, 'value', val))
         FROM (SELECT deal_type, COUNT(*) as cnt, COALESCE(SUM(contract_price), 0) as val 
               FROM deals WHERE status NOT IN ('closed_won', 'closed_lost', 'dead')
               GROUP BY deal_type) sub)
    FROM deals
    ON CONFLICT (snapshot_date) DO UPDATE SET
        prospects_count = EXCLUDED.prospects_count,
        prospects_value = EXCLUDED.prospects_value,
        loi_count = EXCLUDED.loi_count,
        loi_value = EXCLUDED.loi_value,
        under_contract_count = EXCLUDED.under_contract_count,
        under_contract_value = EXCLUDED.under_contract_value,
        due_diligence_count = EXCLUDED.due_diligence_count,
        due_diligence_value = EXCLUDED.due_diligence_value,
        closing_count = EXCLUDED.closing_count,
        closing_value = EXCLUDED.closing_value,
        total_active_deals = EXCLUDED.total_active_deals,
        total_pipeline_value = EXCLUDED.total_pipeline_value,
        by_entity = EXCLUDED.by_entity,
        by_deal_type = EXCLUDED.by_deal_type;
END;
$$ LANGUAGE plpgsql;

-- Function to create daily project snapshot
CREATE OR REPLACE FUNCTION create_project_snapshot()
RETURNS void AS $$
DECLARE
    v_date DATE := CURRENT_DATE;
BEGIN
    INSERT INTO project_status_snapshots (
        snapshot_date,
        predevelopment_count, predevelopment_budget,
        entitlement_count, entitlement_budget,
        design_count, design_budget,
        permitting_count, permitting_budget,
        construction_count, construction_budget, construction_spent,
        lease_up_count, complete_count,
        total_active_projects, total_budget, total_spent, total_remaining,
        total_units_in_development, total_sf_in_development,
        by_entity, by_project_type
    )
    SELECT 
        v_date,
        COUNT(*) FILTER (WHERE status = 'predevelopment'),
        COALESCE(SUM(total_budget) FILTER (WHERE status = 'predevelopment'), 0),
        COUNT(*) FILTER (WHERE status = 'entitlement'),
        COALESCE(SUM(total_budget) FILTER (WHERE status = 'entitlement'), 0),
        COUNT(*) FILTER (WHERE status = 'design'),
        COALESCE(SUM(total_budget) FILTER (WHERE status = 'design'), 0),
        COUNT(*) FILTER (WHERE status = 'permitting'),
        COALESCE(SUM(total_budget) FILTER (WHERE status = 'permitting'), 0),
        COUNT(*) FILTER (WHERE status = 'construction'),
        COALESCE(SUM(total_budget) FILTER (WHERE status = 'construction'), 0),
        COALESCE(SUM(total_spent) FILTER (WHERE status = 'construction'), 0),
        COUNT(*) FILTER (WHERE status = 'lease_up'),
        COUNT(*) FILTER (WHERE status = 'complete'),
        COUNT(*) FILTER (WHERE status NOT IN ('complete', 'cancelled', 'on_hold')),
        COALESCE(SUM(total_budget) FILTER (WHERE status NOT IN ('complete', 'cancelled', 'on_hold')), 0),
        COALESCE(SUM(total_spent) FILTER (WHERE status NOT IN ('complete', 'cancelled', 'on_hold')), 0),
        COALESCE(SUM(total_budget - total_spent) FILTER (WHERE status NOT IN ('complete', 'cancelled', 'on_hold')), 0),
        COALESCE(SUM(total_units) FILTER (WHERE status NOT IN ('complete', 'cancelled', 'on_hold')), 0),
        COALESCE(SUM(total_sf) FILTER (WHERE status NOT IN ('complete', 'cancelled', 'on_hold')), 0),
        (SELECT jsonb_agg(row_to_json(t)) FROM v_project_status_by_entity t),
        (SELECT jsonb_agg(jsonb_build_object('type', project_type, 'count', cnt, 'budget', bud))
         FROM (SELECT project_type, COUNT(*) as cnt, COALESCE(SUM(total_budget), 0) as bud 
               FROM projects WHERE status NOT IN ('complete', 'cancelled', 'on_hold')
               GROUP BY project_type) sub)
    FROM projects
    ON CONFLICT (snapshot_date) DO UPDATE SET
        predevelopment_count = EXCLUDED.predevelopment_count,
        construction_count = EXCLUDED.construction_count,
        construction_budget = EXCLUDED.construction_budget,
        construction_spent = EXCLUDED.construction_spent,
        total_active_projects = EXCLUDED.total_active_projects,
        total_budget = EXCLUDED.total_budget,
        total_spent = EXCLUDED.total_spent,
        total_remaining = EXCLUDED.total_remaining,
        by_entity = EXCLUDED.by_entity,
        by_project_type = EXCLUDED.by_project_type;
END;
$$ LANGUAGE plpgsql;

-- Dashboard indexes
CREATE INDEX idx_entity_financials_entity ON entity_financials(entity_id);
CREATE INDEX idx_entity_financials_period ON entity_financials(period_year, period_month);
CREATE INDEX idx_entity_cash_transactions_entity ON entity_cash_transactions(entity_id);
CREATE INDEX idx_entity_cash_transactions_date ON entity_cash_transactions(transaction_date);
CREATE INDEX idx_entity_cash_transactions_type ON entity_cash_transactions(transaction_type);
CREATE INDEX idx_deal_pipeline_snapshots_date ON deal_pipeline_snapshots(snapshot_date);
CREATE INDEX idx_project_status_snapshots_date ON project_status_snapshots(snapshot_date);
CREATE INDEX idx_user_dashboards_user ON user_dashboards(user_id);

-- Dashboard & Entity Cash Flow indexes
CREATE INDEX idx_entity_cash_accounts_entity ON entity_cash_accounts(entity_id);
CREATE INDEX idx_entity_cash_transactions_entity ON entity_cash_transactions(entity_id);
CREATE INDEX idx_entity_cash_transactions_date ON entity_cash_transactions(transaction_date);
CREATE INDEX idx_entity_cash_transactions_type ON entity_cash_transactions(transaction_type);
CREATE INDEX idx_entity_cash_transactions_project ON entity_cash_transactions(related_project_id);
CREATE INDEX idx_entity_cash_transactions_asset ON entity_cash_transactions(related_asset_id);
CREATE INDEX idx_entity_financial_summaries_entity ON entity_financial_summaries(entity_id);
CREATE INDEX idx_entity_financial_summaries_period ON entity_financial_summaries(period_year, period_month);
CREATE INDEX idx_deal_pipeline_snapshots_date ON deal_pipeline_snapshots(snapshot_date);
CREATE INDEX idx_deal_pipeline_snapshots_entity ON deal_pipeline_snapshots(entity_id);
CREATE INDEX idx_project_status_snapshots_date ON project_status_snapshots(snapshot_date);
CREATE INDEX idx_project_status_snapshots_entity ON project_status_snapshots(entity_id);
CREATE INDEX idx_entity_investments_entity ON entity_investments(entity_id);
CREATE INDEX idx_entity_investments_project ON entity_investments(target_project_id);
CREATE INDEX idx_entity_investments_asset ON entity_investments(target_asset_id);
CREATE INDEX idx_dashboard_alerts_entity ON dashboard_alerts(entity_id);
CREATE INDEX idx_dashboard_alerts_status ON dashboard_alerts(status);
CREATE INDEX idx_dashboard_alerts_type ON dashboard_alerts(alert_type);
CREATE INDEX idx_dashboard_alerts_severity ON dashboard_alerts(severity);
CREATE INDEX idx_dashboard_preferences_user ON dashboard_preferences(user_id);
CREATE INDEX idx_kpi_targets_entity_year ON kpi_targets(entity_id, target_year);

-- Enhanced deal tracking indexes
CREATE INDEX idx_deal_stages_order ON deal_stages(stage_order);
CREATE INDEX idx_deal_stage_history_deal ON deal_stage_history(deal_id);
CREATE INDEX idx_deal_stage_history_date ON deal_stage_history(changed_at);
CREATE INDEX idx_deal_activities_deal ON deal_activities(deal_id);
CREATE INDEX idx_deal_activities_date ON deal_activities(activity_date);
CREATE INDEX idx_deal_activities_type ON deal_activities(activity_type);
CREATE INDEX idx_deal_probability_overrides_deal ON deal_probability_overrides(deal_id);
CREATE INDEX idx_deal_velocity_metrics_date ON deal_velocity_metrics(metric_date);

-- Project cash flow indexes
CREATE INDEX idx_project_draw_schedule_project ON project_draw_schedule(project_id);
CREATE INDEX idx_project_draw_schedule_date ON project_draw_schedule(scheduled_date);
CREATE INDEX idx_project_funding_sources_project ON project_funding_sources(project_id);
CREATE INDEX idx_project_cash_flow_forecast_project ON project_cash_flow_forecast(project_id);
CREATE INDEX idx_project_cost_forecast_project ON project_cost_forecast(project_id);

-- Entity P&L indexes
CREATE INDEX idx_entity_income_statements_entity ON entity_income_statements(entity_id);
CREATE INDEX idx_entity_income_statements_period ON entity_income_statements(period_year, period_month);
CREATE INDEX idx_entity_balance_sheets_entity ON entity_balance_sheets(entity_id);
CREATE INDEX idx_entity_balance_sheets_date ON entity_balance_sheets(as_of_date);
CREATE INDEX idx_entity_budgets_entity ON entity_budgets(entity_id);

-- Investor tracking indexes
CREATE INDEX idx_investors_type ON investors(investor_type);
CREATE INDEX idx_investors_active ON investors(is_active);
CREATE INDEX idx_investment_vehicles_status ON investment_vehicles(status);
CREATE INDEX idx_investment_vehicles_entity ON investment_vehicles(entity_id);
CREATE INDEX idx_investor_commitments_investor ON investor_commitments(investor_id);
CREATE INDEX idx_investor_commitments_vehicle ON investor_commitments(vehicle_id);
CREATE INDEX idx_capital_calls_vehicle ON capital_calls(vehicle_id);
CREATE INDEX idx_capital_calls_status ON capital_calls(status);
CREATE INDEX idx_capital_call_items_call ON capital_call_items(capital_call_id);
CREATE INDEX idx_capital_call_items_investor ON capital_call_items(investor_id);
CREATE INDEX idx_investor_distributions_vehicle ON investor_distributions(vehicle_id);
CREATE INDEX idx_distribution_items_distribution ON distribution_items(distribution_id);
CREATE INDEX idx_distribution_items_investor ON distribution_items(investor_id);
CREATE INDEX idx_investor_statements_investor ON investor_statements(investor_id);
CREATE INDEX idx_investor_statements_period ON investor_statements(period_year, period_quarter);
CREATE INDEX idx_investor_k1s_investor ON investor_k1s(investor_id);
CREATE INDEX idx_investor_k1s_year ON investor_k1s(tax_year);

-- Chart data indexes
CREATE INDEX idx_chart_data_snapshots_type ON chart_data_snapshots(chart_type);
CREATE INDEX idx_chart_data_snapshots_entity ON chart_data_snapshots(entity_id);
CREATE INDEX idx_chart_data_snapshots_current ON chart_data_snapshots(is_current) WHERE is_current = true;

-- ============================================================
-- ENHANCED DEAL TRACKING
-- Stages, probability, velocity, pipeline analytics
-- ============================================================

-- Deal stages configuration (customizable pipeline)
CREATE TABLE deal_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    stage_code VARCHAR(50) NOT NULL UNIQUE,
    stage_name VARCHAR(100) NOT NULL,
    stage_order INTEGER NOT NULL,
    
    -- Probability
    default_probability INTEGER DEFAULT 0, -- 0-100%
    
    -- Stage type
    stage_type VARCHAR(50) DEFAULT 'active', -- 'active', 'won', 'lost'
    
    -- Requirements to enter stage
    required_fields JSONB, -- Fields that must be filled
    required_documents JSONB, -- Document types needed
    
    -- SLA
    target_days_in_stage INTEGER,
    
    -- Color for UI
    color VARCHAR(20),
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default stages
INSERT INTO deal_stages (stage_code, stage_name, stage_order, default_probability, stage_type, target_days_in_stage, color) VALUES
('prospecting', 'Prospecting', 1, 10, 'active', 30, '#6B7280'),
('initial_contact', 'Initial Contact', 2, 15, 'active', 14, '#3B82F6'),
('analyzing', 'Analyzing', 3, 25, 'active', 21, '#8B5CF6'),
('loi_submitted', 'LOI Submitted', 4, 40, 'active', 14, '#F59E0B'),
('loi_accepted', 'LOI Accepted', 5, 60, 'active', 7, '#F97316'),
('due_diligence', 'Due Diligence', 6, 75, 'active', 45, '#EF4444'),
('under_contract', 'Under Contract', 7, 90, 'active', 30, '#EC4899'),
('closing', 'Closing', 8, 95, 'active', 14, '#14B8A6'),
('closed_won', 'Closed Won', 9, 100, 'won', NULL, '#10B981'),
('closed_lost', 'Closed Lost', 10, 0, 'lost', NULL, '#6B7280'),
('dead', 'Dead', 11, 0, 'lost', NULL, '#374151');

-- Deal stage history (track all stage changes)
CREATE TABLE deal_stage_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    
    -- Stage change
    from_stage VARCHAR(50),
    to_stage VARCHAR(50) NOT NULL,
    
    -- Timing
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    days_in_previous_stage INTEGER,
    
    -- Probability at change
    probability_at_change INTEGER,
    
    -- Who changed
    changed_by_id UUID REFERENCES users(id),
    
    -- Reason (especially for lost/dead)
    change_reason TEXT,
    
    notes TEXT
);

-- Deal activities (track all touchpoints)
CREATE TABLE deal_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    
    -- Activity type
    activity_type VARCHAR(50) NOT NULL,
    -- Types: 'call', 'email', 'meeting', 'site_visit', 'document_sent', 'document_received',
    -- 'offer_made', 'counter_received', 'negotiation', 'task_completed', 'note', 'status_change'
    
    -- Details
    subject VARCHAR(255),
    description TEXT,
    
    -- Timing
    activity_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    duration_minutes INTEGER,
    
    -- Participants
    contact_ids UUID[], -- Contacts involved
    user_id UUID REFERENCES users(id), -- Who logged it
    
    -- Follow-up
    follow_up_date DATE,
    follow_up_notes TEXT,
    
    -- Outcome
    outcome VARCHAR(100), -- 'positive', 'neutral', 'negative', 'no_answer'
    
    -- Related
    document_id UUID REFERENCES documents(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deal probability overrides (manual adjustment)
CREATE TABLE deal_probability_overrides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
    
    override_probability INTEGER NOT NULL, -- 0-100
    reason TEXT,
    
    set_by_id UUID REFERENCES users(id),
    set_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Valid until
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Deal velocity metrics (calculated)
CREATE TABLE deal_velocity_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Period
    metric_date DATE NOT NULL,
    entity_id UUID REFERENCES entities(id), -- NULL for all
    
    -- Pipeline metrics
    total_deals INTEGER,
    total_pipeline_value DECIMAL(15,2),
    weighted_pipeline_value DECIMAL(15,2),
    
    -- Velocity metrics
    avg_days_to_close INTEGER,
    avg_days_in_stage JSONB, -- {stage: days, ...}
    
    -- Conversion rates
    stage_conversion_rates JSONB, -- {from_stage: {to_stage: rate, ...}, ...}
    overall_win_rate DECIMAL(5,2),
    
    -- Activity metrics
    avg_activities_per_deal DECIMAL(5,1),
    deals_with_activity_7_days INTEGER,
    stale_deals INTEGER, -- No activity 30+ days
    
    -- Value metrics
    avg_deal_size DECIMAL(15,2),
    median_deal_size DECIMAL(15,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(metric_date, entity_id)
);

-- ============================================================
-- PROJECT CASH FLOW FORECASTING
-- Draw schedules, funding needs, cash flow projections
-- ============================================================

-- Project draw schedule (planned draws)
CREATE TABLE project_draw_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    loan_id UUID REFERENCES loans(id),
    
    -- Draw identification
    draw_number INTEGER NOT NULL,
    draw_name VARCHAR(100),
    
    -- Timing
    scheduled_date DATE NOT NULL,
    
    -- Amounts
    budgeted_amount DECIMAL(12,2) NOT NULL,
    hard_costs DECIMAL(12,2),
    soft_costs DECIMAL(12,2),
    
    -- What it covers
    budget_categories JSONB, -- Array of categories and amounts
    milestones_required JSONB, -- Milestones that must be complete
    
    -- Actual (filled when draw happens)
    actual_date DATE,
    actual_amount DECIMAL(12,2),
    actual_draw_id UUID REFERENCES draws(id),
    
    -- Status
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'pending', 'submitted', 'approved', 'funded', 'cancelled'
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(project_id, draw_number)
);

-- Project funding sources
CREATE TABLE project_funding_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Source identification
    source_name VARCHAR(255) NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- 'senior_debt', 'mezz_debt', 'preferred_equity', 'common_equity', 'grant', 'tax_credit'
    
    -- Amounts
    committed_amount DECIMAL(15,2) NOT NULL,
    funded_amount DECIMAL(15,2) DEFAULT 0,
    remaining_amount DECIMAL(15,2),
    
    -- Terms
    interest_rate DECIMAL(6,4),
    preferred_return DECIMAL(6,4),
    
    -- Funding schedule
    funding_schedule JSONB, -- Array of {date, amount, milestone}
    
    -- Priority
    funding_priority INTEGER, -- Order of funding (1 = first)
    
    -- Contact
    source_contact_id UUID REFERENCES contacts(id),
    
    -- Status
    status VARCHAR(50) DEFAULT 'committed', -- 'committed', 'partially_funded', 'fully_funded', 'cancelled'
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project cash flow forecast
CREATE TABLE project_cash_flow_forecast (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    
    -- Forecast identification
    forecast_name VARCHAR(100),
    forecast_date DATE NOT NULL, -- When forecast was created
    forecast_type VARCHAR(50) DEFAULT 'monthly', -- 'monthly', 'weekly'
    
    -- Status
    is_current BOOLEAN DEFAULT true, -- Only one current per project
    
    -- Period data (JSONB array of periods)
    periods JSONB NOT NULL,
    /* Structure:
    [
        {
            "period": "2025-01",
            "period_start": "2025-01-01",
            "period_end": "2025-01-31",
            "sources": {
                "senior_debt": 500000,
                "equity": 200000
            },
            "uses": {
                "land": 0,
                "hard_costs": 450000,
                "soft_costs": 100000,
                "interest": 25000,
                "fees": 10000
            },
            "total_sources": 700000,
            "total_uses": 585000,
            "net_cash_flow": 115000,
            "cumulative_cash": 115000
        }
    ]
    */
    
    -- Summary
    total_sources DECIMAL(15,2),
    total_uses DECIMAL(15,2),
    peak_equity_need DECIMAL(15,2),
    peak_equity_month DATE,
    
    -- Assumptions
    assumptions JSONB,
    
    notes TEXT,
    
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project cost forecast (detailed by category)
CREATE TABLE project_cost_forecast (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    forecast_id UUID REFERENCES project_cash_flow_forecast(id) ON DELETE CASCADE,
    
    -- Category
    budget_category_id UUID REFERENCES budget_items(id),
    category_name VARCHAR(100),
    
    -- Monthly forecast
    monthly_forecast JSONB, -- {period: amount, ...}
    
    -- Totals
    total_forecast DECIMAL(12,2),
    total_budget DECIMAL(12,2),
    variance DECIMAL(12,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- ENTITY-LEVEL P&L ROLLUP
-- Consolidated financials across all projects and assets
-- ============================================================

-- Entity P&L (consolidated income statement)
CREATE TABLE entity_income_statements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    
    -- Period
    period_year INTEGER NOT NULL,
    period_month INTEGER NOT NULL,
    period_type VARCHAR(20) DEFAULT 'monthly', -- 'monthly', 'quarterly', 'annual'
    
    -- REVENUE
    -- Asset revenue (from asset_income_statements)
    asset_rental_income DECIMAL(15,2) DEFAULT 0,
    asset_other_income DECIMAL(15,2) DEFAULT 0,
    total_asset_revenue DECIMAL(15,2) DEFAULT 0,
    
    -- Development revenue (lot sales, etc.)
    development_sales_revenue DECIMAL(15,2) DEFAULT 0,
    development_fee_income DECIMAL(15,2) DEFAULT 0,
    total_development_revenue DECIMAL(15,2) DEFAULT 0,
    
    -- Other revenue
    management_fee_income DECIMAL(15,2) DEFAULT 0, -- If managing for others
    interest_income DECIMAL(15,2) DEFAULT 0,
    other_income DECIMAL(15,2) DEFAULT 0,
    
    total_revenue DECIMAL(15,2) DEFAULT 0,
    
    -- EXPENSES
    -- Asset expenses (from asset_income_statements)
    asset_operating_expenses DECIMAL(15,2) DEFAULT 0,
    asset_property_taxes DECIMAL(15,2) DEFAULT 0,
    asset_insurance DECIMAL(15,2) DEFAULT 0,
    total_asset_expenses DECIMAL(15,2) DEFAULT 0,
    
    -- Development expenses
    development_costs DECIMAL(15,2) DEFAULT 0,
    
    -- Corporate expenses
    corporate_payroll DECIMAL(15,2) DEFAULT 0,
    corporate_office DECIMAL(15,2) DEFAULT 0,
    corporate_professional_fees DECIMAL(15,2) DEFAULT 0,
    corporate_marketing DECIMAL(15,2) DEFAULT 0,
    corporate_insurance DECIMAL(15,2) DEFAULT 0,
    corporate_other DECIMAL(15,2) DEFAULT 0,
    total_corporate_expenses DECIMAL(15,2) DEFAULT 0,
    
    total_expenses DECIMAL(15,2) DEFAULT 0,
    
    -- OPERATING INCOME
    operating_income DECIMAL(15,2) DEFAULT 0,
    
    -- NON-OPERATING
    interest_expense DECIMAL(15,2) DEFAULT 0,
    depreciation DECIMAL(15,2) DEFAULT 0,
    amortization DECIMAL(15,2) DEFAULT 0,
    gain_loss_on_sale DECIMAL(15,2) DEFAULT 0,
    other_non_operating DECIMAL(15,2) DEFAULT 0,
    
    -- NET INCOME
    income_before_tax DECIMAL(15,2) DEFAULT 0,
    income_tax_expense DECIMAL(15,2) DEFAULT 0,
    net_income DECIMAL(15,2) DEFAULT 0,
    
    -- Source tracking
    is_actual BOOLEAN DEFAULT true,
    source VARCHAR(50), -- 'calculated', 'manual', 'quickbooks'
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(entity_id, period_year, period_month, period_type, is_actual)
);

-- Entity balance sheet (consolidated)
CREATE TABLE entity_balance_sheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    
    as_of_date DATE NOT NULL,
    
    -- ASSETS
    -- Current assets
    cash_and_equivalents DECIMAL(15,2) DEFAULT 0,
    accounts_receivable DECIMAL(15,2) DEFAULT 0,
    notes_receivable_current DECIMAL(15,2) DEFAULT 0,
    prepaid_expenses DECIMAL(15,2) DEFAULT 0,
    other_current_assets DECIMAL(15,2) DEFAULT 0,
    total_current_assets DECIMAL(15,2) DEFAULT 0,
    
    -- Investments in projects
    projects_in_development DECIMAL(15,2) DEFAULT 0, -- Sum of project costs
    projects_land_held DECIMAL(15,2) DEFAULT 0,
    
    -- Real estate assets
    real_estate_held DECIMAL(15,2) DEFAULT 0, -- Operating assets at cost
    accumulated_depreciation DECIMAL(15,2) DEFAULT 0,
    real_estate_net DECIMAL(15,2) DEFAULT 0,
    
    -- Other assets
    notes_receivable_long_term DECIMAL(15,2) DEFAULT 0,
    investments_in_jvs DECIMAL(15,2) DEFAULT 0,
    intangible_assets DECIMAL(15,2) DEFAULT 0,
    other_assets DECIMAL(15,2) DEFAULT 0,
    
    total_assets DECIMAL(15,2) DEFAULT 0,
    
    -- LIABILITIES
    -- Current liabilities
    accounts_payable DECIMAL(15,2) DEFAULT 0,
    accrued_expenses DECIMAL(15,2) DEFAULT 0,
    construction_payables DECIMAL(15,2) DEFAULT 0,
    current_portion_debt DECIMAL(15,2) DEFAULT 0,
    other_current_liabilities DECIMAL(15,2) DEFAULT 0,
    total_current_liabilities DECIMAL(15,2) DEFAULT 0,
    
    -- Long-term liabilities
    construction_loans DECIMAL(15,2) DEFAULT 0,
    permanent_loans DECIMAL(15,2) DEFAULT 0,
    mezzanine_debt DECIMAL(15,2) DEFAULT 0,
    other_long_term_debt DECIMAL(15,2) DEFAULT 0,
    total_long_term_liabilities DECIMAL(15,2) DEFAULT 0,
    
    total_liabilities DECIMAL(15,2) DEFAULT 0,
    
    -- EQUITY
    members_capital DECIMAL(15,2) DEFAULT 0,
    retained_earnings DECIMAL(15,2) DEFAULT 0,
    current_year_earnings DECIMAL(15,2) DEFAULT 0,
    distributions DECIMAL(15,2) DEFAULT 0,
    total_equity DECIMAL(15,2) DEFAULT 0,
    
    total_liabilities_and_equity DECIMAL(15,2) DEFAULT 0,
    
    -- Source
    source VARCHAR(50),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(entity_id, as_of_date)
);

-- Entity budget (annual budget for corporate expenses)
CREATE TABLE entity_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
    
    budget_year INTEGER NOT NULL,
    budget_name VARCHAR(100),
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft',
    approved_by_id UUID REFERENCES users(id),
    approved_date DATE,
    
    -- Revenue targets
    target_asset_revenue DECIMAL(15,2),
    target_development_revenue DECIMAL(15,2),
    target_other_revenue DECIMAL(15,2),
    target_total_revenue DECIMAL(15,2),
    
    -- Expense budgets
    budget_corporate_payroll DECIMAL(15,2),
    budget_corporate_office DECIMAL(15,2),
    budget_corporate_professional DECIMAL(15,2),
    budget_corporate_marketing DECIMAL(15,2),
    budget_corporate_other DECIMAL(15,2),
    budget_total_corporate DECIMAL(15,2),
    
    -- Monthly breakdown
    monthly_budget JSONB,
    
    -- Targets
    target_net_income DECIMAL(15,2),
    target_distributions DECIMAL(15,2),
    
    notes TEXT,
    
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(entity_id, budget_year)
);

-- ============================================================
-- INVESTOR REPORTING
-- LP tracking, capital accounts, distributions, statements
-- ============================================================

-- Investors (LP/member registry)
CREATE TABLE investors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Investor identification
    investor_code VARCHAR(20) UNIQUE,
    
    -- Type
    investor_type VARCHAR(50) NOT NULL, -- 'individual', 'trust', 'ira', 'entity', 'fund'
    
    -- For individuals
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    
    -- For entities
    entity_name VARCHAR(255),
    entity_type VARCHAR(50), -- 'llc', 'corporation', 'partnership', 'trust'
    
    -- Display name
    display_name VARCHAR(255) NOT NULL,
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(20),
    
    -- Address
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(2),
    zip VARCHAR(10),
    country VARCHAR(100) DEFAULT 'USA',
    
    -- Tax info
    tax_id_type VARCHAR(20), -- 'ssn', 'ein'
    tax_id_last4 VARCHAR(4), -- Only store last 4
    tax_classification VARCHAR(50), -- For K-1 purposes
    
    -- Banking for distributions
    bank_name VARCHAR(255),
    account_type VARCHAR(20), -- 'checking', 'savings'
    account_last4 VARCHAR(4),
    routing_last4 VARCHAR(4),
    ach_enabled BOOLEAN DEFAULT false,
    
    -- Accreditation
    is_accredited BOOLEAN DEFAULT true,
    accreditation_date DATE,
    accreditation_expiry DATE,
    
    -- Portal access
    portal_email VARCHAR(255),
    portal_enabled BOOLEAN DEFAULT false,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    
    -- Contact reference
    contact_id UUID REFERENCES contacts(id),
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment vehicles (funds, syndications, JVs)
CREATE TABLE investment_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identification
    vehicle_code VARCHAR(20) UNIQUE,
    vehicle_name VARCHAR(255) NOT NULL,
    
    -- Type
    vehicle_type VARCHAR(50) NOT NULL, -- 'fund', 'syndication', 'joint_venture', 'direct'
    
    -- Legal entity
    entity_id UUID REFERENCES entities(id),
    
    -- Structure
    gp_entity_id UUID REFERENCES entities(id), -- General Partner
    gp_ownership_percent DECIMAL(5,2),
    lp_ownership_percent DECIMAL(5,2),
    
    -- Economics
    preferred_return DECIMAL(6,4), -- Annual preferred return rate
    promote_structure JSONB, -- Waterfall tiers
    /* Example:
    [
        {"tier": 1, "threshold_irr": 8, "lp_split": 100, "gp_split": 0},
        {"tier": 2, "threshold_irr": 12, "lp_split": 80, "gp_split": 20},
        {"tier": 3, "threshold_irr": 15, "lp_split": 70, "gp_split": 30},
        {"tier": 4, "threshold_irr": null, "lp_split": 60, "gp_split": 40}
    ]
    */
    
    -- Fees
    acquisition_fee_percent DECIMAL(5,2),
    asset_management_fee_percent DECIMAL(5,2),
    disposition_fee_percent DECIMAL(5,2),
    
    -- Fundraising
    target_raise DECIMAL(15,2),
    minimum_investment DECIMAL(15,2),
    total_commitments DECIMAL(15,2) DEFAULT 0,
    total_called DECIMAL(15,2) DEFAULT 0,
    total_funded DECIMAL(15,2) DEFAULT 0,
    
    -- Dates
    formation_date DATE,
    first_close_date DATE,
    final_close_date DATE,
    investment_period_end DATE,
    fund_term_end DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'forming', -- 'forming', 'fundraising', 'investing', 'harvesting', 'liquidating', 'closed'
    
    -- Investments
    target_project_ids UUID[], -- Projects this vehicle invests in
    target_asset_ids UUID[], -- Assets this vehicle owns
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investor commitments (LP investments in vehicles)
CREATE TABLE investor_commitments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
    vehicle_id UUID REFERENCES investment_vehicles(id) ON DELETE CASCADE,
    
    -- Commitment
    commitment_date DATE NOT NULL,
    commitment_amount DECIMAL(15,2) NOT NULL,
    ownership_percent DECIMAL(8,5), -- Calculated based on total commitments
    
    -- Capital account
    called_amount DECIMAL(15,2) DEFAULT 0,
    funded_amount DECIMAL(15,2) DEFAULT 0,
    unfunded_commitment DECIMAL(15,2),
    
    -- Returns
    distributions_received DECIMAL(15,2) DEFAULT 0,
    return_of_capital DECIMAL(15,2) DEFAULT 0,
    preferred_return_paid DECIMAL(15,2) DEFAULT 0,
    profit_distributions DECIMAL(15,2) DEFAULT 0,
    
    -- Current position
    capital_account_balance DECIMAL(15,2) DEFAULT 0,
    unrealized_value DECIMAL(15,2) DEFAULT 0, -- Share of current asset values
    
    -- Performance (calculated)
    total_value DECIMAL(15,2), -- Distributions + unrealized
    net_irr DECIMAL(8,4),
    equity_multiple DECIMAL(6,3),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'fully_returned', 'transferred', 'redeemed'
    
    -- Subscription docs
    subscription_document_id UUID REFERENCES documents(id),
    subscription_date DATE,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(investor_id, vehicle_id)
);

-- Capital calls
CREATE TABLE capital_calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    vehicle_id UUID REFERENCES investment_vehicles(id) ON DELETE CASCADE,
    
    -- Call identification
    call_number INTEGER NOT NULL,
    call_name VARCHAR(100),
    
    -- Timing
    call_date DATE NOT NULL,
    due_date DATE NOT NULL,
    
    -- Amount
    total_call_amount DECIMAL(15,2) NOT NULL,
    call_percent DECIMAL(5,2), -- Percent of unfunded commitment
    
    -- Purpose
    purpose TEXT,
    use_of_funds JSONB, -- Breakdown of how funds will be used
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'sent', 'partially_funded', 'fully_funded', 'cancelled'
    
    -- Totals (updated as funded)
    amount_received DECIMAL(15,2) DEFAULT 0,
    
    -- Document
    call_document_id UUID REFERENCES documents(id),
    
    notes TEXT,
    
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(vehicle_id, call_number)
);

-- Capital call line items (per investor)
CREATE TABLE capital_call_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    capital_call_id UUID REFERENCES capital_calls(id) ON DELETE CASCADE,
    commitment_id UUID REFERENCES investor_commitments(id) ON DELETE CASCADE,
    investor_id UUID REFERENCES investors(id),
    
    -- Call amount for this investor
    call_amount DECIMAL(15,2) NOT NULL,
    
    -- Payment
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'partial', 'received', 'overdue', 'waived'
    amount_received DECIMAL(15,2) DEFAULT 0,
    received_date DATE,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    
    -- Late fee if applicable
    is_late BOOLEAN DEFAULT false,
    late_fee DECIMAL(10,2) DEFAULT 0,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Distributions to investors
CREATE TABLE investor_distributions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    vehicle_id UUID REFERENCES investment_vehicles(id) ON DELETE CASCADE,
    
    -- Distribution identification
    distribution_number INTEGER NOT NULL,
    distribution_name VARCHAR(100),
    
    -- Timing
    distribution_date DATE NOT NULL,
    record_date DATE,
    payment_date DATE,
    
    -- Total amount
    total_distribution DECIMAL(15,2) NOT NULL,
    
    -- Breakdown
    return_of_capital DECIMAL(15,2) DEFAULT 0,
    preferred_return DECIMAL(15,2) DEFAULT 0,
    profit_share DECIMAL(15,2) DEFAULT 0,
    
    -- Type
    distribution_type VARCHAR(50), -- 'operating', 'refinance', 'sale', 'liquidation'
    
    -- Source
    source_description TEXT,
    source_project_id UUID REFERENCES projects(id),
    source_asset_id UUID REFERENCES assets(id),
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'approved', 'processing', 'paid', 'cancelled'
    approved_by_id UUID REFERENCES users(id),
    approved_date DATE,
    
    -- Document
    distribution_document_id UUID REFERENCES documents(id),
    
    notes TEXT,
    
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(vehicle_id, distribution_number)
);

-- Distribution line items (per investor)
CREATE TABLE distribution_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    distribution_id UUID REFERENCES investor_distributions(id) ON DELETE CASCADE,
    commitment_id UUID REFERENCES investor_commitments(id) ON DELETE CASCADE,
    investor_id UUID REFERENCES investors(id),
    
    -- Distribution amount for this investor
    gross_amount DECIMAL(15,2) NOT NULL,
    
    -- Breakdown
    return_of_capital DECIMAL(15,2) DEFAULT 0,
    preferred_return DECIMAL(15,2) DEFAULT 0,
    profit_share DECIMAL(15,2) DEFAULT 0,
    
    -- Withholding if applicable
    withholding DECIMAL(15,2) DEFAULT 0,
    net_amount DECIMAL(15,2),
    
    -- Payment
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'held'
    payment_method VARCHAR(50), -- 'ach', 'check', 'wire'
    payment_reference VARCHAR(100),
    paid_date DATE,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investor statements (periodic reports)
CREATE TABLE investor_statements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Scope
    investor_id UUID REFERENCES investors(id),
    commitment_id UUID REFERENCES investor_commitments(id),
    vehicle_id UUID REFERENCES investment_vehicles(id),
    
    -- Period
    statement_type VARCHAR(50) NOT NULL, -- 'quarterly', 'annual', 'k1', 'capital_account'
    period_year INTEGER NOT NULL,
    period_quarter INTEGER, -- For quarterly
    
    -- Statement date
    statement_date DATE NOT NULL,
    as_of_date DATE NOT NULL,
    
    -- Capital account summary
    beginning_balance DECIMAL(15,2),
    contributions DECIMAL(15,2),
    distributions DECIMAL(15,2),
    allocation_income DECIMAL(15,2),
    allocation_expense DECIMAL(15,2),
    ending_balance DECIMAL(15,2),
    
    -- Performance
    period_irr DECIMAL(8,4),
    inception_irr DECIMAL(8,4),
    equity_multiple DECIMAL(6,3),
    
    -- Ownership
    ownership_percent DECIMAL(8,5),
    
    -- Document
    statement_document_id UUID REFERENCES documents(id),
    
    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'review', 'final', 'sent'
    sent_date TIMESTAMP WITH TIME ZONE,
    
    notes TEXT,
    
    created_by_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- K-1 tracking
CREATE TABLE investor_k1s (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    investor_id UUID REFERENCES investors(id) ON DELETE CASCADE,
    commitment_id UUID REFERENCES investor_commitments(id),
    vehicle_id UUID REFERENCES investment_vehicles(id),
    entity_id UUID REFERENCES entities(id), -- Issuing entity
    
    -- Tax year
    tax_year INTEGER NOT NULL,
    
    -- K-1 data
    ordinary_income DECIMAL(15,2),
    rental_income DECIMAL(15,2),
    interest_income DECIMAL(15,2),
    dividend_income DECIMAL(15,2),
    capital_gains_short DECIMAL(15,2),
    capital_gains_long DECIMAL(15,2),
    section_1231_gains DECIMAL(15,2),
    other_income DECIMAL(15,2),
    
    -- Deductions
    section_179_deduction DECIMAL(15,2),
    other_deductions DECIMAL(15,2),
    
    -- Credits
    credits DECIMAL(15,2),
    
    -- Other items
    distributions DECIMAL(15,2),
    beginning_capital DECIMAL(15,2),
    ending_capital DECIMAL(15,2),
    
    -- Document
    k1_document_id UUID REFERENCES documents(id),
    
    -- Status
    status VARCHAR(50) DEFAULT 'preparing', -- 'preparing', 'review', 'final', 'sent', 'amended'
    prepared_date DATE,
    sent_date DATE,
    
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(investor_id, vehicle_id, tax_year)
);

-- ============================================================
-- ENHANCED VISUALIZATION SUPPORT
-- Pre-calculated data for charts
-- ============================================================

-- Chart data snapshots (for fast dashboard loading)
CREATE TABLE chart_data_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    chart_type VARCHAR(100) NOT NULL,
    -- Types: 'pipeline_funnel', 'pipeline_trend', 'project_gantt', 'project_budget',
    -- 'occupancy_trend', 'noi_waterfall', 'cash_flow_monthly', 'entity_comparison',
    -- 'debt_maturity', 'portfolio_composition', 'deal_velocity', 'investor_returns'
    
    -- Scope
    entity_id UUID REFERENCES entities(id), -- NULL for all
    
    -- Data
    chart_data JSONB NOT NULL,
    
    -- Period (if applicable)
    period_start DATE,
    period_end DATE,
    
    -- Freshness
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    
    is_current BOOLEAN DEFAULT true
);

-- Function to generate pipeline funnel data
CREATE OR REPLACE FUNCTION generate_pipeline_funnel_data(p_entity_id UUID DEFAULT NULL)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_agg(stage_data ORDER BY stage_order)
    INTO v_result
    FROM (
        SELECT 
            ds.stage_code,
            ds.stage_name,
            ds.stage_order,
            ds.color,
            ds.default_probability,
            COUNT(d.id) as deal_count,
            COALESCE(SUM(COALESCE(d.contract_price, d.asking_price, 0)), 0) as total_value,
            COALESCE(SUM(COALESCE(d.contract_price, d.asking_price, 0) * ds.default_probability / 100), 0) as weighted_value
        FROM deal_stages ds
        LEFT JOIN deals d ON d.status = ds.stage_code 
            AND (p_entity_id IS NULL OR d.entity_id = p_entity_id)
        WHERE ds.stage_type = 'active'
        GROUP BY ds.stage_code, ds.stage_name, ds.stage_order, ds.color, ds.default_probability
    ) stage_data;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate deal velocity metrics
CREATE OR REPLACE FUNCTION calculate_deal_velocity(p_entity_id UUID DEFAULT NULL, p_days INTEGER DEFAULT 90)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    WITH closed_deals AS (
        SELECT 
            d.id,
            d.entity_id,
            d.contract_price,
            d.created_at,
            d.closing_date,
            EXTRACT(DAY FROM d.closing_date - d.created_at) as days_to_close
        FROM deals d
        WHERE d.status = 'closed_won'
        AND d.closing_date >= CURRENT_DATE - (p_days || ' days')::interval
        AND (p_entity_id IS NULL OR d.entity_id = p_entity_id)
    ),
    lost_deals AS (
        SELECT COUNT(*) as count
        FROM deals d
        WHERE d.status IN ('closed_lost', 'dead')
        AND d.updated_at >= CURRENT_DATE - (p_days || ' days')::interval
        AND (p_entity_id IS NULL OR d.entity_id = p_entity_id)
    )
    SELECT jsonb_build_object(
        'period_days', p_days,
        'deals_won', (SELECT COUNT(*) FROM closed_deals),
        'deals_lost', (SELECT count FROM lost_deals),
        'win_rate', ROUND(
            (SELECT COUNT(*) FROM closed_deals)::numeric / 
            NULLIF((SELECT COUNT(*) FROM closed_deals) + (SELECT count FROM lost_deals), 0) * 100, 1
        ),
        'total_volume', (SELECT COALESCE(SUM(contract_price), 0) FROM closed_deals),
        'avg_deal_size', (SELECT ROUND(AVG(contract_price), 0) FROM closed_deals),
        'avg_days_to_close', (SELECT ROUND(AVG(days_to_close), 0) FROM closed_deals),
        'min_days_to_close', (SELECT MIN(days_to_close) FROM closed_deals),
        'max_days_to_close', (SELECT MAX(days_to_close) FROM closed_deals)
    ) INTO v_result;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY (Optional - Enable per table as needed)
-- ============================================================

-- Enable RLS on projects (example)
-- ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
-- CREATE POLICY "Users can view all projects" ON projects
--     FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA
-- ============================================================

-- Insert entities
INSERT INTO entities (name, entity_type, state_of_formation, is_active) VALUES
    ('VanRock Holdings LLC', 'llc', 'SC', true),
    ('Red Cedar Homes SC LLC', 'llc', 'SC', true),
    ('Carolina Affordable Housing Project Inc.', '501c3', 'SC', true),
    ('Oslo Development LLC', 'llc', 'SC', true),
    ('Watson House LLC', 'llc', 'SC', true),
    ('Wofford Village Grove LLC', 'llc', 'SC', true),
    ('NewShire Property Management LLC', 'llc', 'SC', true),
    ('De Bruin Law Firm PLLC', 'llc', 'SC', true);

-- Insert default teams
INSERT INTO teams (name, description) VALUES
    ('Executive Team', 'Leadership and executives with global access'),
    ('Development Team', 'Project managers and development staff'),
    ('Construction Team', 'Field operations and construction management'),
    ('Finance Team', 'Accounting and financial operations'),
    ('Admin Team', 'Administrative support');

-- Insert sample deals
INSERT INTO deals (deal_code, name, deal_type, status, city, state, acreage, lot_count, asking_price) VALUES
    ('DEAL-2025-001', 'Pickens Phase 1', 'scattered_lots', 'due_diligence', 'Pickens', 'SC', 288, 300, 8000000),
    ('DEAL-2025-002', 'Henderson Lot 5', 'single_family', 'under_contract', 'Greenville', 'SC', 0.5, 1, 125000),
    ('DEAL-2025-003', 'Liberty Square', 'multifamily', 'qualifying', 'Spartanburg', 'SC', 5.2, NULL, 2500000);

-- ============================================================
-- DEFAULT SYSTEM SETTINGS
-- ============================================================

INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
    ('project_code_format', '"RCH-{YYYY}-{NNN}"', 'string', 'Format for auto-generated project codes'),
    ('default_retainage_percent', '10', 'number', 'Default retainage percentage for contracts'),
    ('budget_variance_alert_threshold', '10', 'number', 'Percentage over budget to trigger alert'),
    ('insurance_alert_days', '[30, 14, 7]', 'json', 'Days before expiry to send insurance alerts'),
    ('dd_alert_days', '[14, 7, 3]', 'json', 'Days before DD deadline to send alerts'),
    ('default_pagination_size', '25', 'number', 'Default rows per page in tables'),
    ('require_lien_waiver_for_draw', 'true', 'boolean', 'Require lien waivers before processing draws'),
    ('auto_create_budget_template', 'true', 'boolean', 'Auto-create budget template for new projects'),
    ('fiscal_year_start_month', '1', 'number', 'Month fiscal year starts (1=January)');

-- ============================================================
-- DEFAULT ALERT RULES
-- ============================================================

INSERT INTO alert_rules (name, description, check_type, days_before, threshold_percent, notify_project_manager) VALUES
    ('Insurance Expiring 30 Days', 'Alert when vendor insurance expires in 30 days', 'insurance_expiry', 30, NULL, true),
    ('Insurance Expiring 14 Days', 'Urgent alert when insurance expires in 14 days', 'insurance_expiry', 14, NULL, true),
    ('Insurance Expiring 7 Days', 'Critical alert when insurance expires in 7 days', 'insurance_expiry', 7, NULL, true),
    ('DD Deadline 14 Days', 'Alert when due diligence deadline is in 14 days', 'dd_deadline', 14, NULL, true),
    ('DD Deadline 7 Days', 'Urgent alert when DD deadline is in 7 days', 'dd_deadline', 7, NULL, true),
    ('Budget 10% Over', 'Alert when budget line is 10% over', 'budget_variance', NULL, 10, true),
    ('Budget 20% Over', 'Critical alert when budget line is 20% over', 'budget_variance', NULL, 20, true),
    ('Task Overdue', 'Alert when task is past due date', 'task_overdue', 0, NULL, true),
    ('Milestone Missed', 'Alert when milestone target date passed', 'milestone_missed', 0, NULL, true);

-- ============================================================
-- DEFAULT APPROVAL WORKFLOWS
-- ============================================================

INSERT INTO approval_workflows (name, approval_type, description, threshold_amount) VALUES
    ('Draw Request Approval', 'draw_request', 'All draw requests require approval', 0),
    ('Large Invoice Approval', 'invoice', 'Invoices over $10,000 require approval', 10000),
    ('Budget Change Approval', 'budget_change', 'Budget changes over 5% require approval', NULL),
    ('Change Order Approval', 'change_order', 'All change orders require approval', 0);

-- ============================================================
-- DEFAULT PROJECT TEMPLATE
-- ============================================================

INSERT INTO project_templates (name, description, project_type, budget_template, dd_checklist_template, milestone_template, document_folders_template) VALUES
(
    'Standard Development',
    'Default template for development projects',
    NULL,
    '[
        {"category": "land", "items": ["Land Purchase Price", "Closing Costs", "Title Insurance", "Survey", "Environmental"]},
        {"category": "soft_costs", "items": ["Architecture & Engineering", "Permits & Fees", "Legal", "Accounting", "Insurance", "Marketing", "Property Taxes", "Utilities During Construction"]},
        {"category": "hard_costs", "items": ["Site Work", "Vertical Construction", "FF&E", "Landscaping"]},
        {"category": "financing", "items": ["Loan Origination", "Interest Reserve", "Lender Legal"]},
        {"category": "contingency", "items": ["Hard Cost Contingency", "Soft Cost Contingency"]}
    ]'::jsonb,
    '[
        {"name": "Title Search & Commitment", "category": "title"},
        {"name": "Survey (ALTA/NSPS)", "category": "engineering"},
        {"name": "Phase I Environmental", "category": "environmental"},
        {"name": "Geotechnical Report", "category": "engineering"},
        {"name": "Zoning Verification Letter", "category": "zoning"},
        {"name": "Utility Availability Letters", "category": "engineering"},
        {"name": "Traffic Study", "category": "engineering"},
        {"name": "Appraisal", "category": "legal"},
        {"name": "Property Tax Verification", "category": "legal"},
        {"name": "HOA/Covenants Review", "category": "legal"}
    ]'::jsonb,
    '[
        {"name": "Land Closing", "days_from_start": 0},
        {"name": "Permit Issued", "days_from_start": 60},
        {"name": "Construction Start", "days_from_start": 75},
        {"name": "Foundation Complete", "days_from_start": 105},
        {"name": "Framing Complete", "days_from_start": 150},
        {"name": "Rough-In Complete", "days_from_start": 180},
        {"name": "Drywall Complete", "days_from_start": 210},
        {"name": "Final Inspection", "days_from_start": 270},
        {"name": "Certificate of Occupancy", "days_from_start": 285},
        {"name": "Stabilization", "days_from_start": 365}
    ]'::jsonb,
    '[
        {"name": "Acquisition", "subfolders": ["LOI", "Contract", "Due Diligence", "Title", "Survey"]},
        {"name": "Financing", "subfolders": ["Loan Docs", "Draw Packages", "Correspondence"]},
        {"name": "Construction", "subfolders": ["Plans", "Permits", "Pay Apps", "Change Orders", "Inspections", "Photos"]},
        {"name": "Legal", "subfolders": ["Entity Docs", "Contracts", "Insurance"]},
        {"name": "Marketing", "subfolders": ["Photos", "Brochures", "Listings"]}
    ]'::jsonb
);

-- ============================================================
-- DEFAULT NOTIFICATION PREFERENCES (applied to new users)
-- ============================================================

-- Function to create default notification preferences for new user
CREATE OR REPLACE FUNCTION create_default_notification_prefs()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notification_preferences (user_id, notification_type, in_app, email)
    SELECT 
        NEW.id,
        t.notification_type,
        true,
        CASE 
            WHEN t.notification_type IN ('task_overdue', 'approval_required', 'budget_variance', 'insurance_expiring') THEN true
            ELSE false
        END
    FROM (
        SELECT unnest(enum_range(NULL::notification_type)) as notification_type
    ) t;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_user_notification_prefs
AFTER INSERT ON users
FOR EACH ROW EXECUTE FUNCTION create_default_notification_prefs();

-- Insert sample project
INSERT INTO projects (
    project_code, name, entity_id, project_type, status, 
    city, state, total_budget, total_units
) 
SELECT 
    'WH-001', 'Watson House', id, 'multifamily', 'construction',
    'Spartanburg', 'SC', 4200000, 24
FROM entities WHERE name = 'Watson House LLC';

INSERT INTO projects (
    project_code, name, entity_id, project_type, status, 
    city, state, total_budget, total_lots
) 
SELECT 
    'OSLO-001', 'Oslo Project', id, 'btr', 'construction',
    'Spartanburg', 'SC', 8500000, 48
FROM entities WHERE name = 'Oslo Development LLC';

INSERT INTO projects (
    project_code, name, entity_id, project_type, status, 
    city, state, total_budget, total_units
) 
SELECT 
    'WVG-001', 'Wofford Village Grove', id, 'affordable', 'stabilized',
    'Spartanburg', 'SC', 3800000, 36
FROM entities WHERE name = 'Wofford Village Grove LLC';

-- Insert budget categories template
CREATE OR REPLACE FUNCTION create_budget_template(p_project_id UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO budget_items (project_id, category, line_item, sort_order) VALUES
        -- Land
        (p_project_id, 'land', 'Land Purchase Price', 1),
        (p_project_id, 'land', 'Closing Costs', 2),
        (p_project_id, 'land', 'Title Insurance', 3),
        (p_project_id, 'land', 'Survey', 4),
        (p_project_id, 'land', 'Environmental', 5),
        -- Soft Costs
        (p_project_id, 'soft_costs', 'Architecture & Engineering', 10),
        (p_project_id, 'soft_costs', 'Permits & Fees', 11),
        (p_project_id, 'soft_costs', 'Legal', 12),
        (p_project_id, 'soft_costs', 'Accounting', 13),
        (p_project_id, 'soft_costs', 'Insurance', 14),
        (p_project_id, 'soft_costs', 'Marketing', 15),
        (p_project_id, 'soft_costs', 'Property Taxes', 16),
        (p_project_id, 'soft_costs', 'Utilities During Construction', 17),
        -- Hard Costs
        (p_project_id, 'hard_costs', 'Site Work', 20),
        (p_project_id, 'hard_costs', 'Vertical Construction', 21),
        (p_project_id, 'hard_costs', 'FF&E', 22),
        (p_project_id, 'hard_costs', 'Landscaping', 23),
        -- Financing
        (p_project_id, 'financing', 'Loan Origination', 30),
        (p_project_id, 'financing', 'Interest Reserve', 31),
        (p_project_id, 'financing', 'Lender Legal', 32),
        -- Contingency
        (p_project_id, 'contingency', 'Hard Cost Contingency', 40),
        (p_project_id, 'contingency', 'Soft Cost Contingency', 41);
END;
$$ language 'plpgsql';

-- Create budget templates for existing projects
DO $$
DECLARE
    proj RECORD;
BEGIN
    FOR proj IN SELECT id FROM projects LOOP
        PERFORM create_budget_template(proj.id);
    END LOOP;
END;
$$ language 'plpgsql';

-- Insert due diligence template
CREATE OR REPLACE FUNCTION create_dd_template(p_project_id UUID)
RETURNS void AS $$
BEGIN
    INSERT INTO due_diligence_items (project_id, item_name, category, sort_order) VALUES
        (p_project_id, 'Title Search & Commitment', 'title', 1),
        (p_project_id, 'Survey (ALTA/NSPS)', 'engineering', 2),
        (p_project_id, 'Phase I Environmental', 'environmental', 3),
        (p_project_id, 'Geotechnical Report', 'engineering', 4),
        (p_project_id, 'Zoning Verification Letter', 'zoning', 5),
        (p_project_id, 'Utility Availability Letters', 'engineering', 6),
        (p_project_id, 'Traffic Study', 'engineering', 7),
        (p_project_id, 'Appraisal', 'legal', 8),
        (p_project_id, 'Property Tax Verification', 'legal', 9),
        (p_project_id, 'HOA/Covenants Review', 'legal', 10);
END;
$$ language 'plpgsql';

-- ============================================================
-- GRANT PERMISSIONS (for Supabase)
-- ============================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant select on all tables to authenticated users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant all operations to authenticated users (adjust as needed)
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- ============================================================
-- END OF SCHEMA
-- ============================================================
