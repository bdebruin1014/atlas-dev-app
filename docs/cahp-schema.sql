-- ============================================
-- AtlasDev CAHP Safe Harbor Tax Abatement Schema
-- South Carolina Property Tax Exemption Compliance
-- S.C. Code § 12-37-220(B)(11)(e) / IRS Rev. Proc. 96-32
-- Run in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CAHP PROPERTIES
-- ============================================

CREATE TABLE IF NOT EXISTS cahp_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Property Identification
  property_name TEXT NOT NULL,
  property_address TEXT NOT NULL,
  city TEXT DEFAULT 'Greenville',
  state TEXT DEFAULT 'SC',
  zip TEXT,
  county TEXT NOT NULL,
  parcel_number TEXT,
  
  -- Unit Information
  total_units INTEGER NOT NULL DEFAULT 1,
  
  -- CAHP Structure
  llc_entity TEXT NOT NULL, -- e.g., "Arlington 16, LLC"
  cahp_ownership_percentage DECIMAL(5,4) DEFAULT 0.01, -- Typically 1%
  managing_member TEXT DEFAULT 'CAHP SC, LLC',
  
  -- Tax Information
  annual_assessed_value DECIMAL(15,2),
  standard_tax_rate DECIMAL(6,4) DEFAULT 0.06, -- 6% default
  estimated_tax_savings DECIMAL(15,2),
  
  -- Exemption Status
  dor_exemption_status TEXT DEFAULT 'pending' CHECK (dor_exemption_status IN (
    'pending', 'approved', 'active', 'expired', 'revoked'
  )),
  exemption_effective_date DATE,
  last_certification_date DATE,
  next_certification_due DATE,
  
  -- Compliance Status (calculated)
  current_compliance_status TEXT DEFAULT 'compliant' CHECK (current_compliance_status IN (
    'compliant', 'at_risk', 'non_compliant'
  )),
  last_compliance_check TIMESTAMPTZ,
  
  -- Document References
  operating_agreement_doc_id UUID,
  articles_of_org_doc_id UUID,
  irs_determination_doc_id UUID,
  
  -- Fees
  initial_setup_fee DECIMAL(10,2) DEFAULT 3500.00,
  annual_fee_percentage DECIMAL(5,4) DEFAULT 0.20, -- 20% of savings
  
  -- Notes
  notes TEXT,
  
  -- Audit
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. CAHP TENANTS
-- ============================================

CREATE TABLE IF NOT EXISTS cahp_tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES cahp_properties(id) ON DELETE CASCADE,
  
  -- Unit Information
  unit_number TEXT NOT NULL,
  unit_type TEXT, -- 1BR, 2BR, 3BR, etc.
  unit_square_feet INTEGER,
  
  -- Tenant Information
  tenant_name TEXT NOT NULL,
  tenant_email TEXT,
  tenant_phone TEXT,
  
  -- Lease Information
  move_in_date DATE NOT NULL,
  lease_start_date DATE,
  lease_expiration DATE,
  lease_status TEXT DEFAULT 'active' CHECK (lease_status IN (
    'active', 'month_to_month', 'notice_given', 'expired', 'terminated'
  )),
  
  -- Household Information
  household_size INTEGER NOT NULL DEFAULT 1,
  household_members JSONB DEFAULT '[]', -- Array of {name, age, relationship, income}
  
  -- Income Information
  gross_annual_income DECIMAL(12,2) NOT NULL,
  income_sources JSONB DEFAULT '[]', -- Array of {source, amount, verified}
  ami_percentage DECIMAL(6,2), -- Calculated AMI %
  income_category TEXT NOT NULL CHECK (income_category IN (
    'very_low', 'low', 'over_income', 'market_rate'
  )),
  
  -- Certification Tracking
  initial_certification_date DATE,
  last_certification_date DATE,
  next_recertification_due DATE,
  recertification_status TEXT DEFAULT 'current' CHECK (recertification_status IN (
    'current', 'due_soon', 'overdue', 'in_progress'
  )),
  recertification_notes TEXT,
  
  -- Rent Information
  monthly_rent DECIMAL(10,2) NOT NULL,
  utility_allowance DECIMAL(10,2) DEFAULT 0,
  gross_rent DECIMAL(10,2) GENERATED ALWAYS AS (monthly_rent + utility_allowance) STORED,
  max_allowable_rent DECIMAL(10,2), -- Based on income category
  rent_compliant BOOLEAN DEFAULT true,
  
  -- Over-Income Tracking
  over_income_date DATE, -- Date when tenant exceeded 140% threshold
  cure_action_required BOOLEAN DEFAULT false,
  cure_notes TEXT,
  
  -- Document References
  lease_doc_id UUID,
  certification_doc_id UUID,
  income_docs_ids UUID[] DEFAULT '{}',
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  move_out_date DATE,
  move_out_reason TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(property_id, unit_number)
);

-- ============================================
-- 3. CAHP TENANT CERTIFICATIONS (History)
-- ============================================

CREATE TABLE IF NOT EXISTS cahp_tenant_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES cahp_tenants(id) ON DELETE CASCADE,
  
  -- Certification Information
  certification_type TEXT NOT NULL CHECK (certification_type IN (
    'initial', 'annual_recert', 'interim', 'move_out'
  )),
  certification_date DATE NOT NULL,
  effective_date DATE,
  
  -- Income at Certification
  household_size INTEGER NOT NULL,
  gross_annual_income DECIMAL(12,2) NOT NULL,
  income_sources JSONB,
  ami_percentage DECIMAL(6,2),
  income_category TEXT NOT NULL,
  
  -- AMI Limits Used
  ami_year INTEGER,
  ami_limits_used JSONB, -- Store the limits used at time of cert
  
  -- Documentation
  documents_collected JSONB DEFAULT '[]', -- List of docs collected
  verification_methods JSONB DEFAULT '[]', -- How income was verified
  
  -- Certification Result
  is_qualified BOOLEAN NOT NULL,
  qualification_notes TEXT,
  
  -- Signatures
  tenant_signature_date DATE,
  certifier_name TEXT,
  certifier_signature_date DATE,
  
  -- Audit
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. CAHP COMPLIANCE SNAPSHOTS
-- ============================================

CREATE TABLE IF NOT EXISTS cahp_compliance_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES cahp_properties(id) ON DELETE CASCADE,
  
  -- Snapshot Date
  snapshot_date DATE NOT NULL,
  snapshot_type TEXT DEFAULT 'automatic' CHECK (snapshot_type IN (
    'automatic', 'manual', 'certification', 'quarterly'
  )),
  
  -- Unit Counts
  total_units INTEGER NOT NULL,
  total_occupied_units INTEGER NOT NULL,
  vacant_units INTEGER NOT NULL,
  
  -- Income Category Breakdown
  very_low_income_units INTEGER DEFAULT 0, -- ≤50% AMI
  low_income_units INTEGER DEFAULT 0,       -- 51-80% AMI
  over_income_units INTEGER DEFAULT 0,      -- Previously qualified, now >80%
  market_rate_units INTEGER DEFAULT 0,      -- Never qualified or >25%
  
  -- Compliance Percentages
  pct_very_low_income DECIMAL(5,2), -- Must be ≥20%
  pct_low_income DECIMAL(5,2),      -- Must be ≥75% (includes very low)
  pct_market_rate DECIMAL(5,2),     -- Must be ≤25%
  
  -- Compliance Status
  meets_very_low_threshold BOOLEAN,
  meets_low_income_threshold BOOLEAN,
  compliance_status TEXT NOT NULL CHECK (compliance_status IN (
    'compliant', 'at_risk', 'non_compliant'
  )),
  
  -- Notes
  notes TEXT,
  
  -- Audit
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. CAHP CERTIFICATIONS (Annual DOR)
-- ============================================

CREATE TABLE IF NOT EXISTS cahp_certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES cahp_properties(id) ON DELETE CASCADE,
  
  -- Certification Period
  certification_year INTEGER NOT NULL,
  certification_period_start DATE,
  certification_period_end DATE,
  
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'in_progress', 'ready', 'submitted', 'approved', 'rejected'
  )),
  
  -- Submission Information
  submission_date DATE,
  due_date DATE, -- October 1 of certification year
  dor_confirmation_number TEXT,
  
  -- Certified Information
  ownership_percentage_certified DECIMAL(5,4),
  total_units_certified INTEGER,
  
  -- Compliance Snapshot at Certification
  compliance_snapshot JSONB,
  
  -- Documentation
  compliance_documentation_attached BOOLEAN DEFAULT false,
  rent_roll_attached BOOLEAN DEFAULT false,
  income_certifications_attached BOOLEAN DEFAULT false,
  
  -- Document Reference
  certification_doc_id UUID,
  rent_roll_doc_id UUID,
  
  -- Response
  dor_response_date DATE,
  dor_response_notes TEXT,
  
  -- Status Notes
  status_notes TEXT,
  
  -- Audit
  created_by UUID REFERENCES auth.users(id),
  submitted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(property_id, certification_year)
);

-- ============================================
-- 6. CAHP AMI LIMITS (Updated Annually)
-- ============================================

CREATE TABLE IF NOT EXISTS cahp_ami_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Geographic Area
  area_name TEXT NOT NULL, -- e.g., "Greenville-Anderson-Mauldin, SC MSA"
  area_code TEXT,
  state TEXT DEFAULT 'SC',
  
  -- Effective Year
  effective_year INTEGER NOT NULL,
  
  -- Median Income
  median_income DECIMAL(12,2) NOT NULL,
  
  -- Income Limits by Household Size (JSONB for flexibility)
  -- Structure: { "1": { "very_low": 29050, "low": 46450 }, "2": {...}, ... }
  limits_by_household_size JSONB NOT NULL,
  
  -- Source
  source_url TEXT,
  published_date DATE,
  
  -- Status
  is_current BOOLEAN DEFAULT false,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert 2024 Greenville MSA limits (including 60% AMI)
INSERT INTO cahp_ami_limits (
  area_name, area_code, effective_year, median_income, limits_by_household_size, is_current
) VALUES (
  'Greenville-Anderson-Mauldin, SC MSA',
  'GVLMSA',
  2024,
  82900,
  '{
    "1": { "very_low": 29050, "low_60": 34860, "low": 46450 },
    "2": { "very_low": 33200, "low_60": 39840, "low": 53100 },
    "3": { "very_low": 37350, "low_60": 44820, "low": 59750 },
    "4": { "very_low": 41500, "low_60": 49800, "low": 66350 },
    "5": { "very_low": 44850, "low_60": 53820, "low": 71700 },
    "6": { "very_low": 48150, "low_60": 57780, "low": 77000 },
    "7": { "very_low": 51450, "low_60": 61740, "low": 82300 },
    "8": { "very_low": 54750, "low_60": 65700, "low": 87650 }
  }'::JSONB,
  true
) ON CONFLICT DO NOTHING;

-- ============================================
-- 7. CAHP ALERTS
-- ============================================

CREATE TABLE IF NOT EXISTS cahp_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Reference
  property_id UUID REFERENCES cahp_properties(id) ON DELETE CASCADE,
  tenant_id UUID REFERENCES cahp_tenants(id) ON DELETE CASCADE,
  certification_id UUID REFERENCES cahp_certifications(id) ON DELETE CASCADE,
  
  -- Alert Information
  alert_type TEXT NOT NULL CHECK (alert_type IN (
    'critical', 'warning', 'info'
  )),
  alert_category TEXT NOT NULL CHECK (alert_category IN (
    'compliance', 'recertification', 'certification_due', 'over_income', 
    'lease_expiration', 'ami_update', 'tax_assessment'
  )),
  
  -- Content
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  -- Action Required
  action_required TEXT,
  action_due_date DATE,
  
  -- Status
  is_read BOOLEAN DEFAULT false,
  is_resolved BOOLEAN DEFAULT false,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. CAHP FEES & PAYMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS cahp_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES cahp_properties(id) ON DELETE CASCADE,
  
  -- Fee Information
  fee_type TEXT NOT NULL CHECK (fee_type IN (
    'initial_setup', 'annual_management', 'other'
  )),
  fee_year INTEGER,
  description TEXT,
  
  -- Amounts
  base_amount DECIMAL(12,2), -- Tax savings base
  fee_percentage DECIMAL(5,4), -- Percentage applied
  fee_amount DECIMAL(12,2) NOT NULL,
  
  -- Invoice
  invoice_date DATE,
  invoice_number TEXT,
  due_date DATE,
  
  -- Payment
  paid_date DATE,
  paid_amount DECIMAL(12,2),
  payment_method TEXT,
  payment_reference TEXT,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'invoiced', 'paid', 'overdue', 'waived'
  )),
  
  -- Notes
  notes TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_cahp_properties_status ON cahp_properties(dor_exemption_status);
CREATE INDEX IF NOT EXISTS idx_cahp_properties_compliance ON cahp_properties(current_compliance_status);
CREATE INDEX IF NOT EXISTS idx_cahp_properties_county ON cahp_properties(county);

CREATE INDEX IF NOT EXISTS idx_cahp_tenants_property ON cahp_tenants(property_id);
CREATE INDEX IF NOT EXISTS idx_cahp_tenants_category ON cahp_tenants(income_category);
CREATE INDEX IF NOT EXISTS idx_cahp_tenants_recert ON cahp_tenants(next_recertification_due);
CREATE INDEX IF NOT EXISTS idx_cahp_tenants_active ON cahp_tenants(is_active);
CREATE INDEX IF NOT EXISTS idx_cahp_tenants_unit ON cahp_tenants(property_id, unit_number);

CREATE INDEX IF NOT EXISTS idx_cahp_cert_history_tenant ON cahp_tenant_certifications(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cahp_cert_history_date ON cahp_tenant_certifications(certification_date);

CREATE INDEX IF NOT EXISTS idx_cahp_snapshots_property ON cahp_compliance_snapshots(property_id);
CREATE INDEX IF NOT EXISTS idx_cahp_snapshots_date ON cahp_compliance_snapshots(snapshot_date);

CREATE INDEX IF NOT EXISTS idx_cahp_certs_property ON cahp_certifications(property_id);
CREATE INDEX IF NOT EXISTS idx_cahp_certs_year ON cahp_certifications(certification_year);
CREATE INDEX IF NOT EXISTS idx_cahp_certs_status ON cahp_certifications(status);

CREATE INDEX IF NOT EXISTS idx_cahp_alerts_property ON cahp_alerts(property_id);
CREATE INDEX IF NOT EXISTS idx_cahp_alerts_unread ON cahp_alerts(is_read, is_resolved);
CREATE INDEX IF NOT EXISTS idx_cahp_alerts_type ON cahp_alerts(alert_type);

CREATE INDEX IF NOT EXISTS idx_cahp_fees_property ON cahp_fees(property_id);
CREATE INDEX IF NOT EXISTS idx_cahp_fees_status ON cahp_fees(status);

-- ============================================
-- 10. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE cahp_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE cahp_tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE cahp_tenant_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cahp_compliance_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE cahp_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cahp_ami_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE cahp_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cahp_fees ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "CAHP properties access" ON cahp_properties
  FOR ALL TO authenticated USING (true);

CREATE POLICY "CAHP tenants access" ON cahp_tenants
  FOR ALL TO authenticated USING (true);

CREATE POLICY "CAHP tenant certifications access" ON cahp_tenant_certifications
  FOR ALL TO authenticated USING (true);

CREATE POLICY "CAHP snapshots access" ON cahp_compliance_snapshots
  FOR ALL TO authenticated USING (true);

CREATE POLICY "CAHP certifications access" ON cahp_certifications
  FOR ALL TO authenticated USING (true);

CREATE POLICY "CAHP AMI limits read" ON cahp_ami_limits
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "CAHP alerts access" ON cahp_alerts
  FOR ALL TO authenticated USING (true);

CREATE POLICY "CAHP fees access" ON cahp_fees
  FOR ALL TO authenticated USING (true);

-- ============================================
-- 11. TRIGGERS
-- ============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_cahp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cahp_properties_timestamp
  BEFORE UPDATE ON cahp_properties
  FOR EACH ROW EXECUTE FUNCTION update_cahp_updated_at();

CREATE TRIGGER update_cahp_tenants_timestamp
  BEFORE UPDATE ON cahp_tenants
  FOR EACH ROW EXECUTE FUNCTION update_cahp_updated_at();

CREATE TRIGGER update_cahp_certifications_timestamp
  BEFORE UPDATE ON cahp_certifications
  FOR EACH ROW EXECUTE FUNCTION update_cahp_updated_at();

CREATE TRIGGER update_cahp_fees_timestamp
  BEFORE UPDATE ON cahp_fees
  FOR EACH ROW EXECUTE FUNCTION update_cahp_updated_at();

-- ============================================
-- 12. HELPER FUNCTIONS
-- ============================================

-- Calculate AMI percentage
CREATE OR REPLACE FUNCTION calculate_ami_percentage(
  p_income DECIMAL,
  p_household_size INTEGER,
  p_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)
) RETURNS DECIMAL AS $$
DECLARE
  v_median_income DECIMAL;
BEGIN
  SELECT median_income INTO v_median_income
  FROM cahp_ami_limits
  WHERE effective_year = p_year AND is_current = true
  LIMIT 1;

  IF v_median_income IS NULL OR v_median_income = 0 THEN
    RETURN NULL;
  END IF;

  RETURN ROUND((p_income / v_median_income) * 100, 1);
END;
$$ LANGUAGE plpgsql;

-- Determine income category
CREATE OR REPLACE FUNCTION determine_income_category(
  p_income DECIMAL,
  p_household_size INTEGER,
  p_year INTEGER DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)
) RETURNS TEXT AS $$
DECLARE
  v_limits JSONB;
  v_size_key TEXT;
  v_very_low DECIMAL;
  v_low DECIMAL;
BEGIN
  SELECT limits_by_household_size INTO v_limits
  FROM cahp_ami_limits
  WHERE effective_year = p_year AND is_current = true
  LIMIT 1;

  IF v_limits IS NULL THEN
    RETURN 'market_rate';
  END IF;

  v_size_key := LEAST(p_household_size, 8)::TEXT;
  v_very_low := (v_limits->v_size_key->>'very_low')::DECIMAL;
  v_low := (v_limits->v_size_key->>'low')::DECIMAL;

  IF p_income <= v_very_low THEN
    RETURN 'very_low';
  ELSIF p_income <= v_low THEN
    RETURN 'low';
  ELSE
    RETURN 'market_rate';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Calculate property compliance
CREATE OR REPLACE FUNCTION get_property_compliance(p_property_id UUID)
RETURNS TABLE (
  total_units INTEGER,
  occupied_units BIGINT,
  very_low_count BIGINT,
  low_count BIGINT,
  over_income_count BIGINT,
  market_rate_count BIGINT,
  vacant_count INTEGER,
  pct_very_low DECIMAL,
  pct_low_income DECIMAL,
  compliance_status TEXT
) AS $$
DECLARE
  v_total_units INTEGER;
  v_occupied BIGINT;
  v_very_low BIGINT;
  v_low BIGINT;
  v_over_income BIGINT;
  v_market_rate BIGINT;
  v_pct_very_low DECIMAL;
  v_pct_low DECIMAL;
  v_status TEXT;
BEGIN
  -- Get total units
  SELECT cp.total_units INTO v_total_units
  FROM cahp_properties cp
  WHERE cp.id = p_property_id;

  -- Count by category
  SELECT 
    COUNT(*) FILTER (WHERE is_active),
    COUNT(*) FILTER (WHERE income_category = 'very_low' AND is_active),
    COUNT(*) FILTER (WHERE income_category = 'low' AND is_active),
    COUNT(*) FILTER (WHERE income_category = 'over_income' AND is_active),
    COUNT(*) FILTER (WHERE income_category = 'market_rate' AND is_active)
  INTO v_occupied, v_very_low, v_low, v_over_income, v_market_rate
  FROM cahp_tenants
  WHERE property_id = p_property_id;

  -- Calculate percentages
  IF v_occupied > 0 THEN
    v_pct_very_low := ROUND((v_very_low::DECIMAL / v_occupied) * 100, 1);
    v_pct_low := ROUND(((v_very_low + v_low)::DECIMAL / v_occupied) * 100, 1);
  ELSE
    v_pct_very_low := 0;
    v_pct_low := 0;
  END IF;

  -- Determine status
  IF v_pct_low < 75 OR v_pct_very_low < 20 THEN
    v_status := 'non_compliant';
  ELSIF v_pct_low < 80 OR v_pct_very_low < 25 THEN
    v_status := 'at_risk';
  ELSE
    v_status := 'compliant';
  END IF;

  RETURN QUERY SELECT 
    v_total_units,
    v_occupied,
    v_very_low,
    v_low,
    v_over_income,
    v_market_rate,
    v_total_units - v_occupied::INTEGER,
    v_pct_very_low,
    v_pct_low,
    v_status;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 13. VIEWS
-- ============================================

-- Property summary view
CREATE OR REPLACE VIEW cahp_property_summary AS
SELECT 
  p.id,
  p.property_name,
  p.property_address,
  p.county,
  p.total_units,
  p.llc_entity,
  p.dor_exemption_status,
  p.current_compliance_status,
  p.estimated_tax_savings,
  p.next_certification_due,
  COUNT(t.id) FILTER (WHERE t.is_active) as occupied_units,
  COUNT(t.id) FILTER (WHERE t.income_category = 'very_low' AND t.is_active) as very_low_units,
  COUNT(t.id) FILTER (WHERE t.income_category = 'low' AND t.is_active) as low_income_units,
  COUNT(t.id) FILTER (WHERE t.income_category = 'over_income' AND t.is_active) as over_income_units,
  COUNT(t.id) FILTER (WHERE t.income_category = 'market_rate' AND t.is_active) as market_rate_units
FROM cahp_properties p
LEFT JOIN cahp_tenants t ON p.id = t.property_id
GROUP BY p.id;

-- Recertifications due view
CREATE OR REPLACE VIEW cahp_recertifications_due AS
SELECT 
  t.id as tenant_id,
  t.tenant_name,
  t.unit_number,
  t.next_recertification_due,
  t.income_category,
  t.gross_annual_income,
  p.id as property_id,
  p.property_name,
  p.property_address,
  CASE 
    WHEN t.next_recertification_due < CURRENT_DATE THEN 'overdue'
    WHEN t.next_recertification_due <= CURRENT_DATE + INTERVAL '30 days' THEN 'due_soon'
    ELSE 'upcoming'
  END as urgency
FROM cahp_tenants t
JOIN cahp_properties p ON t.property_id = p.id
WHERE t.is_active = true
  AND t.next_recertification_due <= CURRENT_DATE + INTERVAL '90 days'
ORDER BY t.next_recertification_due;

-- ============================================
-- DONE
-- ============================================
