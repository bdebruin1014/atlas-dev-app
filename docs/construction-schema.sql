-- ============================================
-- CONSTRUCTION MANAGEMENT MODULE SCHEMA
-- Phase 6: Jobs, Subcontractors, POs, Field Ops
-- ============================================

-- ============================================
-- JOBS
-- ============================================

CREATE TABLE IF NOT EXISTS construction_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_number TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Relationships
  project_id UUID REFERENCES projects(id),
  contractor_entity_id UUID NOT NULL REFERENCES entities(id),
  owner_entity_id UUID REFERENCES entities(id),
  project_manager_id UUID REFERENCES user_profiles(id),
  superintendent_id UUID REFERENCES user_profiles(id),
  
  -- Contract Details
  contract_amount DECIMAL(15, 2) DEFAULT 0,
  contract_date DATE,
  retainage_percent DECIMAL(5, 2) DEFAULT 10.00,
  
  -- Dates
  start_date DATE,
  completion_date DATE,
  actual_completion_date DATE,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'on_hold', 'completed', 'closed')),
  
  -- Address (may differ from project)
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_jobs_contractor ON construction_jobs(contractor_entity_id);
CREATE INDEX idx_jobs_project ON construction_jobs(project_id);
CREATE INDEX idx_jobs_status ON construction_jobs(status);

-- ============================================
-- COST CODES
-- ============================================

CREATE TABLE IF NOT EXISTS job_cost_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES construction_jobs(id) ON DELETE CASCADE,
  
  code TEXT NOT NULL, -- CSI format like "03-300"
  description TEXT NOT NULL,
  
  budget_amount DECIMAL(15, 2) DEFAULT 0,
  committed_amount DECIMAL(15, 2) DEFAULT 0,
  actual_amount DECIMAL(15, 2) DEFAULT 0,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(job_id, code)
);

CREATE INDEX idx_cost_codes_job ON job_cost_codes(job_id);

-- Function to update committed cost
CREATE OR REPLACE FUNCTION update_cost_code_committed(
  p_cost_code_id UUID,
  p_amount DECIMAL
) RETURNS VOID AS $$
BEGIN
  UPDATE job_cost_codes
  SET committed_amount = committed_amount + p_amount,
      updated_at = NOW()
  WHERE id = p_cost_code_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SUBCONTRACTORS
-- ============================================

CREATE TABLE IF NOT EXISTS subcontractors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID REFERENCES entities(id), -- Which contractor entity they work for
  
  company_name TEXT NOT NULL,
  trade TEXT NOT NULL,
  contact_id UUID REFERENCES contacts(id),
  
  -- Direct contact info if no contact record
  email TEXT,
  phone TEXT,
  address TEXT,
  
  -- Tax info
  tax_id TEXT,
  is_1099 BOOLEAN DEFAULT true,
  
  -- Status and preferences
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blacklisted')),
  is_preferred BOOLEAN DEFAULT false,
  
  -- Performance tracking
  average_rating DECIMAL(3, 2),
  total_jobs INTEGER DEFAULT 0,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subs_entity ON subcontractors(entity_id);
CREATE INDEX idx_subs_trade ON subcontractors(trade);

-- ============================================
-- INSURANCE CERTIFICATES (COIs)
-- ============================================

CREATE TABLE IF NOT EXISTS subcontractor_insurance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcontractor_id UUID NOT NULL REFERENCES subcontractors(id) ON DELETE CASCADE,
  
  insurance_type TEXT NOT NULL CHECK (insurance_type IN ('general_liability', 'workers_comp', 'auto', 'umbrella', 'professional')),
  carrier TEXT,
  policy_number TEXT,
  
  coverage_amount DECIMAL(15, 2),
  deductible DECIMAL(15, 2),
  
  effective_date DATE NOT NULL,
  expiration_date DATE NOT NULL,
  
  certificate_holder TEXT,
  additional_insured BOOLEAN DEFAULT false,
  
  document_url TEXT, -- Link to stored certificate
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sub_insurance_sub ON subcontractor_insurance(subcontractor_id);
CREATE INDEX idx_sub_insurance_expiry ON subcontractor_insurance(expiration_date);

-- ============================================
-- LIEN WAIVERS
-- ============================================

CREATE TABLE IF NOT EXISTS subcontractor_lien_waivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subcontractor_id UUID NOT NULL REFERENCES subcontractors(id),
  job_id UUID REFERENCES construction_jobs(id),
  
  waiver_type TEXT NOT NULL CHECK (waiver_type IN ('conditional_progress', 'unconditional_progress', 'conditional_final', 'unconditional_final')),
  
  through_date DATE,
  amount DECIMAL(15, 2),
  
  signed_date DATE,
  signed_by TEXT,
  
  document_url TEXT,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lien_waivers_sub ON subcontractor_lien_waivers(subcontractor_id);
CREATE INDEX idx_lien_waivers_job ON subcontractor_lien_waivers(job_id);

-- ============================================
-- PURCHASE ORDERS
-- ============================================

CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT NOT NULL UNIQUE,
  
  -- Relationships
  entity_id UUID NOT NULL REFERENCES entities(id),
  job_id UUID REFERENCES construction_jobs(id),
  vendor_id UUID REFERENCES contacts(id),
  cost_code_id UUID REFERENCES job_cost_codes(id),
  project_id UUID REFERENCES projects(id),
  
  -- Details
  description TEXT,
  total_amount DECIMAL(15, 2) DEFAULT 0,
  
  -- Dates
  issue_date DATE DEFAULT CURRENT_DATE,
  delivery_date DATE,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'partially_received', 'received', 'cancelled')),
  
  -- Approvals
  created_by UUID REFERENCES user_profiles(id),
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMPTZ,
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pos_entity ON purchase_orders(entity_id);
CREATE INDEX idx_pos_job ON purchase_orders(job_id);
CREATE INDEX idx_pos_vendor ON purchase_orders(vendor_id);
CREATE INDEX idx_pos_status ON purchase_orders(status);

-- ============================================
-- PURCHASE ORDER LINE ITEMS
-- ============================================

CREATE TABLE IF NOT EXISTS purchase_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  
  line_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  
  quantity DECIMAL(15, 4) DEFAULT 1,
  unit TEXT DEFAULT 'EA',
  unit_price DECIMAL(15, 4) DEFAULT 0,
  
  -- Extended = quantity * unit_price
  extended_amount DECIMAL(15, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  
  -- Receiving
  quantity_received DECIMAL(15, 4) DEFAULT 0,
  
  cost_code_id UUID REFERENCES job_cost_codes(id),
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_po_items_po ON purchase_order_items(purchase_order_id);

-- ============================================
-- DAILY LOGS
-- ============================================

CREATE TABLE IF NOT EXISTS daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES construction_jobs(id) ON DELETE CASCADE,
  
  log_date DATE NOT NULL,
  
  -- Weather
  weather_conditions TEXT,
  temperature_high INTEGER,
  temperature_low INTEGER,
  precipitation BOOLEAN DEFAULT false,
  
  -- Work summary
  work_summary TEXT,
  work_performed TEXT,
  
  -- Counts
  contractor_workers INTEGER DEFAULT 0,
  subcontractor_workers INTEGER DEFAULT 0,
  
  -- Visitors
  visitors TEXT,
  
  -- Delays/Issues
  delays TEXT,
  safety_incidents TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved')),
  
  created_by UUID REFERENCES user_profiles(id),
  approved_by UUID REFERENCES user_profiles(id),
  approved_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(job_id, log_date)
);

CREATE INDEX idx_daily_logs_job ON daily_logs(job_id);
CREATE INDEX idx_daily_logs_date ON daily_logs(log_date);

-- ============================================
-- DAILY LOG LABOR ENTRIES
-- ============================================

CREATE TABLE IF NOT EXISTS daily_log_labor (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_log_id UUID NOT NULL REFERENCES daily_logs(id) ON DELETE CASCADE,
  
  subcontractor_id UUID REFERENCES subcontractors(id),
  trade TEXT,
  workers INTEGER DEFAULT 0,
  hours DECIMAL(5, 2) DEFAULT 0,
  work_description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONSTRUCTION INSPECTIONS
-- ============================================

CREATE TABLE IF NOT EXISTS construction_inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES construction_jobs(id) ON DELETE CASCADE,
  
  inspection_type TEXT NOT NULL,
  description TEXT,
  
  -- Scheduling
  scheduled_date DATE,
  scheduled_time TIME,
  inspector_name TEXT,
  inspector_phone TEXT,
  
  -- Results
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
  result TEXT CHECK (result IN ('passed', 'failed', 'partial', 'cancelled')),
  result_notes TEXT,
  failure_items JSONB,
  
  completed_at TIMESTAMPTZ,
  
  -- Location
  area TEXT,
  
  requested_by UUID REFERENCES user_profiles(id),
  
  permit_id UUID REFERENCES job_permits(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_const_insp_job ON construction_inspections(job_id);
CREATE INDEX idx_const_insp_status ON construction_inspections(status);

-- ============================================
-- PERMITS
-- ============================================

CREATE TABLE IF NOT EXISTS job_permits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES construction_jobs(id) ON DELETE CASCADE,
  
  permit_type TEXT NOT NULL,
  permit_number TEXT,
  
  jurisdiction TEXT,
  
  -- Dates
  application_date DATE,
  issued_date DATE,
  expiration_date DATE,
  
  -- Status
  status TEXT DEFAULT 'not_applied' CHECK (status IN ('not_applied', 'applied', 'in_review', 'approved', 'issued', 'expired', 'closed')),
  
  -- Fees
  fee_amount DECIMAL(10, 2),
  fee_paid BOOLEAN DEFAULT false,
  
  document_url TEXT,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_permits_job ON job_permits(job_id);

-- ============================================
-- PUNCH LISTS
-- ============================================

CREATE TABLE IF NOT EXISTS punch_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES construction_jobs(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  
  area TEXT,
  
  created_by UUID REFERENCES user_profiles(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS punch_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  punch_list_id UUID NOT NULL REFERENCES punch_lists(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES construction_jobs(id),
  
  item_number INTEGER,
  description TEXT NOT NULL,
  location TEXT,
  
  assigned_to UUID REFERENCES subcontractors(id),
  
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'verified')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  
  due_date DATE,
  completed_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  verified_by UUID REFERENCES user_profiles(id),
  
  photos JSONB,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_punch_items_list ON punch_list_items(punch_list_id);
CREATE INDEX idx_punch_items_job ON punch_list_items(job_id);
CREATE INDEX idx_punch_items_status ON punch_list_items(status);

-- ============================================
-- RFIs (Requests for Information)
-- ============================================

CREATE TABLE IF NOT EXISTS rfis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES construction_jobs(id) ON DELETE CASCADE,
  
  rfi_number TEXT NOT NULL,
  subject TEXT NOT NULL,
  question TEXT NOT NULL,
  
  -- Routing
  submitted_by UUID REFERENCES user_profiles(id),
  assigned_to UUID REFERENCES user_profiles(id),
  
  -- Response
  answer TEXT,
  answered_by UUID REFERENCES user_profiles(id),
  answered_at TIMESTAMPTZ,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'in_review', 'answered', 'closed')),
  
  -- Impact assessment
  cost_impact DECIMAL(15, 2),
  schedule_impact INTEGER, -- days
  
  -- References
  spec_section TEXT,
  drawing_reference TEXT,
  
  due_date DATE,
  
  attachments JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(job_id, rfi_number)
);

CREATE INDEX idx_rfis_job ON rfis(job_id);
CREATE INDEX idx_rfis_status ON rfis(status);

-- ============================================
-- SUBMITTALS
-- ============================================

CREATE TABLE IF NOT EXISTS submittals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES construction_jobs(id) ON DELETE CASCADE,
  
  submittal_number TEXT NOT NULL,
  description TEXT NOT NULL,
  
  spec_section TEXT,
  
  -- Submission
  submitted_by UUID REFERENCES user_profiles(id),
  submitted_at TIMESTAMPTZ,
  
  -- Review
  reviewed_by UUID REFERENCES user_profiles(id),
  reviewed_at TIMESTAMPTZ,
  review_comments TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'approved', 'approved_as_noted', 'revise_resubmit', 'rejected')),
  
  -- Revision tracking
  revision_number INTEGER DEFAULT 0,
  previous_submittal_id UUID REFERENCES submittals(id),
  
  due_date DATE,
  
  attachments JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(job_id, submittal_number)
);

CREATE INDEX idx_submittals_job ON submittals(job_id);
CREATE INDEX idx_submittals_status ON submittals(status);

-- ============================================
-- WARRANTY
-- ============================================

CREATE TABLE IF NOT EXISTS warranty_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES construction_jobs(id) ON DELETE CASCADE,
  
  item_name TEXT NOT NULL,
  description TEXT,
  
  subcontractor_id UUID REFERENCES subcontractors(id),
  manufacturer TEXT,
  
  warranty_period_months INTEGER,
  start_date DATE,
  expiration_date DATE,
  
  coverage_details TEXT,
  
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'claim_open', 'claim_in_progress', 'claim_resolved', 'expired')),
  
  document_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS warranty_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warranty_item_id UUID NOT NULL REFERENCES warranty_items(id) ON DELETE CASCADE,
  
  claim_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'denied')),
  
  resolution TEXT,
  resolved_at TIMESTAMPTZ,
  
  cost DECIMAL(10, 2),
  
  created_by UUID REFERENCES user_profiles(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_warranty_job ON warranty_items(job_id);
CREATE INDEX idx_warranty_expiry ON warranty_items(expiration_date);

-- ============================================
-- PAY APPLICATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS pay_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES construction_jobs(id) ON DELETE CASCADE,
  
  application_number INTEGER NOT NULL,
  
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Amounts
  original_contract DECIMAL(15, 2),
  change_orders DECIMAL(15, 2) DEFAULT 0,
  contract_sum DECIMAL(15, 2),
  
  total_completed_prior DECIMAL(15, 2) DEFAULT 0,
  work_completed_this_period DECIMAL(15, 2) DEFAULT 0,
  materials_stored DECIMAL(15, 2) DEFAULT 0,
  total_completed DECIMAL(15, 2),
  
  retainage_percent DECIMAL(5, 2),
  retainage_amount DECIMAL(15, 2),
  
  amount_this_period DECIMAL(15, 2),
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'paid', 'rejected')),
  
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  paid_amount DECIMAL(15, 2),
  
  created_by UUID REFERENCES user_profiles(id),
  approved_by UUID REFERENCES user_profiles(id),
  
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(job_id, application_number)
);

CREATE INDEX idx_pay_apps_job ON pay_applications(job_id);

-- ============================================
-- SCHEDULE OF VALUES
-- ============================================

CREATE TABLE IF NOT EXISTS schedule_of_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES construction_jobs(id) ON DELETE CASCADE,
  
  line_number INTEGER NOT NULL,
  description TEXT NOT NULL,
  
  scheduled_value DECIMAL(15, 2) NOT NULL,
  
  -- Progress tracking
  work_completed_prior DECIMAL(15, 2) DEFAULT 0,
  work_completed_this_period DECIMAL(15, 2) DEFAULT 0,
  materials_stored DECIMAL(15, 2) DEFAULT 0,
  
  total_completed DECIMAL(15, 2) DEFAULT 0,
  percent_complete DECIMAL(5, 2) DEFAULT 0,
  balance_to_finish DECIMAL(15, 2),
  
  cost_code_id UUID REFERENCES job_cost_codes(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(job_id, line_number)
);

CREATE INDEX idx_sov_job ON schedule_of_values(job_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE construction_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_cost_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcontractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfis ENABLE ROW LEVEL SECURITY;
ALTER TABLE submittals ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust based on your permission system)
CREATE POLICY "Users can view jobs they have access to" ON construction_jobs
  FOR SELECT USING (true);

CREATE POLICY "Users can manage jobs they have access to" ON construction_jobs
  FOR ALL USING (true);

-- Similar policies for other tables...

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_construction_jobs_updated_at
  BEFORE UPDATE ON construction_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cost_codes_updated_at
  BEFORE UPDATE ON job_cost_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subcontractors_updated_at
  BEFORE UPDATE ON subcontractors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_purchase_orders_updated_at
  BEFORE UPDATE ON purchase_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_logs_updated_at
  BEFORE UPDATE ON daily_logs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rfis_updated_at
  BEFORE UPDATE ON rfis
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submittals_updated_at
  BEFORE UPDATE ON submittals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE COST CODE TEMPLATE
-- ============================================

-- Insert default CSI cost codes for new jobs
CREATE OR REPLACE FUNCTION create_default_cost_codes(p_job_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO job_cost_codes (job_id, code, description) VALUES
    (p_job_id, '01-100', 'General Requirements'),
    (p_job_id, '01-200', 'Project Management'),
    (p_job_id, '02-100', 'Site Preparation'),
    (p_job_id, '03-100', 'Concrete Footings'),
    (p_job_id, '03-200', 'Concrete Foundation'),
    (p_job_id, '03-300', 'Concrete Flatwork'),
    (p_job_id, '06-100', 'Rough Carpentry'),
    (p_job_id, '06-200', 'Finish Carpentry'),
    (p_job_id, '07-100', 'Roofing'),
    (p_job_id, '07-200', 'Insulation'),
    (p_job_id, '07-300', 'Siding & Trim'),
    (p_job_id, '08-100', 'Windows'),
    (p_job_id, '08-200', 'Doors'),
    (p_job_id, '09-100', 'Drywall'),
    (p_job_id, '09-200', 'Painting'),
    (p_job_id, '09-300', 'Flooring'),
    (p_job_id, '09-400', 'Tile'),
    (p_job_id, '10-100', 'Specialties'),
    (p_job_id, '11-100', 'Appliances'),
    (p_job_id, '12-100', 'Cabinets'),
    (p_job_id, '12-200', 'Countertops'),
    (p_job_id, '22-100', 'Plumbing Rough'),
    (p_job_id, '22-200', 'Plumbing Finish'),
    (p_job_id, '23-100', 'HVAC Rough'),
    (p_job_id, '23-200', 'HVAC Finish'),
    (p_job_id, '26-100', 'Electrical Rough'),
    (p_job_id, '26-200', 'Electrical Finish'),
    (p_job_id, '31-100', 'Earthwork'),
    (p_job_id, '32-100', 'Landscaping'),
    (p_job_id, '32-200', 'Hardscape'),
    (p_job_id, '33-100', 'Utilities');
END;
$$ LANGUAGE plpgsql;
