-- ============================================
-- AtlasDev Property Management - Inspections Schema
-- Run in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. PROPERTIES TABLE (if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT,
  zip TEXT,
  property_type TEXT, -- 'single_family', 'multi_family', 'commercial', etc.
  units_count INTEGER DEFAULT 1,
  year_built INTEGER,
  square_feet INTEGER,
  lot_size NUMERIC,
  
  -- Ownership
  owner_entity_id UUID,
  
  -- Status
  status TEXT DEFAULT 'active',
  
  -- Audit
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. UNITS TABLE (for multi-family)
-- ============================================

CREATE TABLE IF NOT EXISTS units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  unit_number TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms NUMERIC,
  square_feet INTEGER,
  
  -- Current tenant
  tenant_id UUID,
  tenant_name TEXT,
  lease_start DATE,
  lease_end DATE,
  rent_amount NUMERIC,
  
  -- Status
  status TEXT DEFAULT 'vacant', -- 'occupied', 'vacant', 'maintenance'
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(property_id, unit_number)
);

-- ============================================
-- 3. INSPECTION TEMPLATES
-- ============================================

CREATE TABLE IF NOT EXISTS inspection_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  template_data JSONB NOT NULL DEFAULT '{}',
  property_type TEXT, -- Optional: specific to property type
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. INSPECTIONS
-- ============================================

CREATE TABLE IF NOT EXISTS inspections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Property/Unit
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES units(id) ON DELETE SET NULL,
  
  -- Type and Template
  inspection_type TEXT NOT NULL, -- 'move_in', 'move_out', 'routine', 'annual', 'drive_by', 'maintenance', 'safety', 'pre_lease'
  template_id UUID REFERENCES inspection_templates(id),
  
  -- Status
  status TEXT DEFAULT 'scheduled' CHECK (status IN (
    'scheduled', 'in_progress', 'completed', 'cancelled', 'requires_followup'
  )),
  
  -- Scheduling
  scheduled_date TIMESTAMPTZ NOT NULL,
  completed_date TIMESTAMPTZ,
  
  -- People
  inspector_id UUID REFERENCES auth.users(id),
  inspector_name TEXT,
  tenant_id UUID,
  tenant_name TEXT,
  
  -- Results
  overall_score NUMERIC(3,2), -- 1.00 to 5.00
  items_inspected INTEGER DEFAULT 0,
  items_requiring_repair INTEGER DEFAULT 0,
  
  -- Notes and Summary
  notes TEXT,
  summary_notes TEXT,
  
  -- Signatures (base64 or URLs)
  tenant_signature TEXT,
  inspector_signature TEXT,
  
  -- Audit
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. INSPECTION ITEMS
-- ============================================

CREATE TABLE IF NOT EXISTS inspection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id UUID NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
  
  -- Item details
  section_name TEXT NOT NULL, -- 'Kitchen', 'Living Room', 'Exterior', etc.
  item_name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  
  -- Inspection results
  condition TEXT CHECK (condition IN ('excellent', 'good', 'fair', 'poor', 'damaged', 'na')),
  notes TEXT,
  requires_repair BOOLEAN DEFAULT false,
  
  -- Photos
  photo_urls TEXT[] DEFAULT '{}',
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_entity_id);

CREATE INDEX IF NOT EXISTS idx_units_property ON units(property_id);
CREATE INDEX IF NOT EXISTS idx_units_status ON units(status);
CREATE INDEX IF NOT EXISTS idx_units_tenant ON units(tenant_id);

CREATE INDEX IF NOT EXISTS idx_inspection_templates_active ON inspection_templates(is_active);

CREATE INDEX IF NOT EXISTS idx_inspections_property ON inspections(property_id);
CREATE INDEX IF NOT EXISTS idx_inspections_unit ON inspections(unit_id);
CREATE INDEX IF NOT EXISTS idx_inspections_status ON inspections(status);
CREATE INDEX IF NOT EXISTS idx_inspections_type ON inspections(inspection_type);
CREATE INDEX IF NOT EXISTS idx_inspections_scheduled ON inspections(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_inspections_inspector ON inspections(inspector_id);

CREATE INDEX IF NOT EXISTS idx_inspection_items_inspection ON inspection_items(inspection_id);
CREATE INDEX IF NOT EXISTS idx_inspection_items_section ON inspection_items(section_name);
CREATE INDEX IF NOT EXISTS idx_inspection_items_repair ON inspection_items(requires_repair) WHERE requires_repair = true;

-- ============================================
-- 7. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_items ENABLE ROW LEVEL SECURITY;

-- Properties: All authenticated
CREATE POLICY "Manage properties" ON properties
  FOR ALL TO authenticated USING (true);

-- Units: All authenticated
CREATE POLICY "Manage units" ON units
  FOR ALL TO authenticated USING (true);

-- Templates: Read all active, manage own
CREATE POLICY "Read active templates" ON inspection_templates
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "Manage templates" ON inspection_templates
  FOR ALL TO authenticated USING (true);

-- Inspections: All authenticated
CREATE POLICY "Manage inspections" ON inspections
  FOR ALL TO authenticated USING (true);

-- Items: All authenticated
CREATE POLICY "Manage inspection items" ON inspection_items
  FOR ALL TO authenticated USING (true);

-- ============================================
-- 8. STORAGE BUCKET
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('inspection-photos', 'inspection-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Upload inspection photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'inspection-photos');

CREATE POLICY "Read inspection photos"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'inspection-photos');

CREATE POLICY "Delete inspection photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'inspection-photos');

-- ============================================
-- 9. TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_inspection_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_inspection_updated_at();

CREATE TRIGGER update_units_updated_at
  BEFORE UPDATE ON units
  FOR EACH ROW EXECUTE FUNCTION update_inspection_updated_at();

CREATE TRIGGER update_inspection_templates_updated_at
  BEFORE UPDATE ON inspection_templates
  FOR EACH ROW EXECUTE FUNCTION update_inspection_updated_at();

CREATE TRIGGER update_inspections_updated_at
  BEFORE UPDATE ON inspections
  FOR EACH ROW EXECUTE FUNCTION update_inspection_updated_at();

CREATE TRIGGER update_inspection_items_updated_at
  BEFORE UPDATE ON inspection_items
  FOR EACH ROW EXECUTE FUNCTION update_inspection_updated_at();

-- ============================================
-- 10. SAMPLE DATA
-- ============================================

-- Sample properties
INSERT INTO properties (id, name, address, city, state, zip, property_type, units_count)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '123 Main Street', '123 Main St', 'Greenville', 'SC', '29601', 'single_family', 1),
  ('22222222-2222-2222-2222-222222222222', 'Oak Grove Apartments', '456 Oak Ave', 'Greenville', 'SC', '29601', 'multi_family', 8),
  ('33333333-3333-3333-3333-333333333333', 'Sunset Villas', '789 Sunset Blvd', 'Greenville', 'SC', '29601', 'multi_family', 4)
ON CONFLICT DO NOTHING;

-- Sample units for multi-family
INSERT INTO units (property_id, unit_number, bedrooms, bathrooms, status)
VALUES 
  ('22222222-2222-2222-2222-222222222222', '101', 2, 1, 'occupied'),
  ('22222222-2222-2222-2222-222222222222', '102', 2, 1, 'occupied'),
  ('22222222-2222-2222-2222-222222222222', '103', 1, 1, 'vacant'),
  ('22222222-2222-2222-2222-222222222222', '201', 2, 1, 'occupied'),
  ('22222222-2222-2222-2222-222222222222', '202', 2, 1, 'maintenance'),
  ('33333333-3333-3333-3333-333333333333', 'A', 3, 2, 'occupied'),
  ('33333333-3333-3333-3333-333333333333', 'B', 3, 2, 'occupied'),
  ('33333333-3333-3333-3333-333333333333', 'C', 3, 2, 'vacant'),
  ('33333333-3333-3333-3333-333333333333', 'D', 3, 2, 'occupied')
ON CONFLICT DO NOTHING;

-- Sample inspection template
INSERT INTO inspection_templates (name, description, template_data, is_active)
VALUES (
  'Standard Rental Inspection',
  'Complete inspection template for residential rental properties',
  '{
    "sections": [
      {
        "name": "Exterior",
        "items": ["Roof/Gutters", "Siding/Paint", "Windows", "Front Door", "Back Door", "Driveway", "Landscaping"]
      },
      {
        "name": "Living Room",
        "items": ["Walls/Ceiling", "Flooring", "Windows", "Light Fixtures", "Outlets", "Smoke Detector"]
      },
      {
        "name": "Kitchen",
        "items": ["Walls/Ceiling", "Flooring", "Countertops", "Cabinets", "Sink/Faucet", "Refrigerator", "Stove/Oven", "Dishwasher"]
      },
      {
        "name": "Master Bedroom",
        "items": ["Walls/Ceiling", "Flooring", "Windows", "Closet", "Light Fixtures", "Outlets"]
      },
      {
        "name": "Master Bathroom",
        "items": ["Walls/Ceiling", "Flooring", "Toilet", "Sink/Vanity", "Shower/Tub", "Exhaust Fan"]
      },
      {
        "name": "Systems",
        "items": ["HVAC System", "Water Heater", "Electrical Panel", "Smoke Detectors", "CO Detectors"]
      }
    ]
  }',
  true
)
ON CONFLICT DO NOTHING;

-- ============================================
-- 11. HELPER VIEWS
-- ============================================

-- View for inspection summary
CREATE OR REPLACE VIEW inspection_summary AS
SELECT 
  i.id,
  i.property_id,
  p.name as property_name,
  p.address as property_address,
  i.unit_id,
  u.unit_number,
  i.inspection_type,
  i.status,
  i.scheduled_date,
  i.completed_date,
  i.inspector_name,
  i.overall_score,
  i.items_inspected,
  i.items_requiring_repair,
  i.created_at
FROM inspections i
LEFT JOIN properties p ON i.property_id = p.id
LEFT JOIN units u ON i.unit_id = u.id;

-- ============================================
-- DONE
-- ============================================
