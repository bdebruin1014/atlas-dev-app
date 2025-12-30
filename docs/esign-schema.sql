-- ============================================
-- AtlasDev E-Signature Module Schema
-- Run in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. DOCUMENT TEMPLATES
-- ============================================

CREATE TABLE IF NOT EXISTS document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  docuseal_template_id INTEGER NOT NULL,
  template_type TEXT, -- 'contract', 'agreement', 'subscription', 'disclosure', etc.
  available_for TEXT[] DEFAULT '{}', -- ['project', 'opportunity', 'investor', 'general']
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. SIGNING REQUESTS
-- ============================================

CREATE TABLE IF NOT EXISTS document_signing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Entity linking
  entity_type TEXT NOT NULL, -- 'project', 'opportunity', 'investor', 'investment_deal', 'asset', 'general'
  entity_id UUID, -- Null for general documents
  entity_name TEXT, -- Denormalized for display
  
  -- Template info
  template_id UUID REFERENCES document_templates(id),
  docuseal_template_id INTEGER,
  docuseal_submission_id INTEGER,
  
  -- Document details
  document_name TEXT NOT NULL,
  document_type TEXT, -- Optional categorization
  notes TEXT,
  
  -- Status tracking
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft', 'sent', 'viewed', 'partially_signed', 'signed', 
    'completed', 'declined', 'expired', 'cancelled'
  )),
  
  -- Timestamps
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  
  -- Prefilled data
  prefill_data JSONB DEFAULT '{}',
  
  -- Storage info (after completion)
  storage_path TEXT,
  storage_url TEXT,
  docuseal_document_url TEXT,
  linked_document_id UUID, -- Reference to stored document record
  
  -- Audit
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. DOCUMENT SIGNERS
-- ============================================

CREATE TABLE IF NOT EXISTS document_signers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signing_request_id UUID NOT NULL REFERENCES document_signing_requests(id) ON DELETE CASCADE,
  
  -- Signer info
  role TEXT NOT NULL, -- 'Buyer', 'Seller', 'Investor', etc.
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  
  -- Contact linking
  contact_id UUID REFERENCES contacts(id),
  contact_auto_matched BOOLEAN DEFAULT false,
  
  -- DocuSeal tracking
  docuseal_submitter_id INTEGER,
  embed_src TEXT, -- For embedded signing
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'sent', 'opened', 'signed', 'declined'
  )),
  signed_at TIMESTAMPTZ,
  signing_order INTEGER DEFAULT 1,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. DOCUMENT-CONTACT JUNCTION
-- ============================================

CREATE TABLE IF NOT EXISTS document_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type TEXT NOT NULL, -- 'project', 'opportunity', etc.
  document_id UUID NOT NULL, -- The signing_request_id
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  role TEXT, -- Role in the document
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(document_type, document_id, contact_id)
);

-- ============================================
-- 5. DOCUMENT STORAGE TABLES
-- ============================================

-- Project documents
CREATE TABLE IF NOT EXISTS project_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  file_size INTEGER,
  category TEXT DEFAULT 'general',
  signing_request_id UUID REFERENCES document_signing_requests(id),
  contact_id UUID REFERENCES contacts(id),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunity documents
CREATE TABLE IF NOT EXISTS opportunity_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  file_size INTEGER,
  category TEXT DEFAULT 'general',
  signing_request_id UUID REFERENCES document_signing_requests(id),
  contact_id UUID REFERENCES contacts(id),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Investor documents
CREATE TABLE IF NOT EXISTS investor_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id UUID,
  investment_deal_id UUID,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  file_size INTEGER,
  category TEXT DEFAULT 'general',
  signing_request_id UUID REFERENCES document_signing_requests(id),
  contact_id UUID REFERENCES contacts(id),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset documents
CREATE TABLE IF NOT EXISTS asset_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  file_size INTEGER,
  category TEXT DEFAULT 'general',
  signing_request_id UUID REFERENCES document_signing_requests(id),
  contact_id UUID REFERENCES contacts(id),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- General documents (not linked to specific entity)
CREATE TABLE IF NOT EXISTS general_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_url TEXT,
  file_type TEXT,
  file_size INTEGER,
  category TEXT DEFAULT 'general',
  signing_request_id UUID REFERENCES document_signing_requests(id),
  contact_id UUID REFERENCES contacts(id),
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_document_templates_active ON document_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_document_templates_available ON document_templates USING GIN(available_for);

CREATE INDEX IF NOT EXISTS idx_signing_requests_entity ON document_signing_requests(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_signing_requests_status ON document_signing_requests(status);
CREATE INDEX IF NOT EXISTS idx_signing_requests_docuseal ON document_signing_requests(docuseal_submission_id);

CREATE INDEX IF NOT EXISTS idx_document_signers_request ON document_signers(signing_request_id);
CREATE INDEX IF NOT EXISTS idx_document_signers_contact ON document_signers(contact_id);
CREATE INDEX IF NOT EXISTS idx_document_signers_email ON document_signers(email);

CREATE INDEX IF NOT EXISTS idx_document_contacts_contact ON document_contacts(contact_id);
CREATE INDEX IF NOT EXISTS idx_document_contacts_document ON document_contacts(document_type, document_id);

CREATE INDEX IF NOT EXISTS idx_project_documents_project ON project_documents(project_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_documents_opportunity ON opportunity_documents(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_investor_documents_investor ON investor_documents(investor_id);
CREATE INDEX IF NOT EXISTS idx_investor_documents_deal ON investor_documents(investment_deal_id);
CREATE INDEX IF NOT EXISTS idx_asset_documents_asset ON asset_documents(asset_id);

-- ============================================
-- 7. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_signing_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_signers ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE investor_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE general_documents ENABLE ROW LEVEL SECURITY;

-- Templates: All authenticated users can read active templates
CREATE POLICY "Read active templates" ON document_templates
  FOR SELECT TO authenticated
  USING (is_active = true);

-- Signing requests: Users can manage their own
CREATE POLICY "Manage own signing requests" ON document_signing_requests
  FOR ALL TO authenticated
  USING (created_by = auth.uid() OR auth.uid() IS NOT NULL);

-- Signers: Visible with parent request
CREATE POLICY "Read signers with request" ON document_signers
  FOR SELECT TO authenticated
  USING (signing_request_id IN (
    SELECT id FROM document_signing_requests WHERE created_by = auth.uid() OR auth.uid() IS NOT NULL
  ));

CREATE POLICY "Manage signers" ON document_signers
  FOR ALL TO authenticated
  USING (true);

-- Document contacts: All authenticated
CREATE POLICY "Manage document contacts" ON document_contacts
  FOR ALL TO authenticated
  USING (true);

-- Document tables: All authenticated (expand for proper team-based RLS later)
CREATE POLICY "Manage project documents" ON project_documents
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Manage opportunity documents" ON opportunity_documents
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Manage investor documents" ON investor_documents
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Manage asset documents" ON asset_documents
  FOR ALL TO authenticated USING (true);

CREATE POLICY "Manage general documents" ON general_documents
  FOR ALL TO authenticated USING (true);

-- ============================================
-- 8. STORAGE BUCKETS
-- ============================================

-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('project-documents', 'project-documents', false),
  ('opportunity-documents', 'opportunity-documents', false),
  ('investor-documents', 'investor-documents', false),
  ('asset-documents', 'asset-documents', false),
  ('general-documents', 'general-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated users can upload project docs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'project-documents');

CREATE POLICY "Authenticated users can read project docs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'project-documents');

CREATE POLICY "Authenticated users can upload opportunity docs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'opportunity-documents');

CREATE POLICY "Authenticated users can read opportunity docs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'opportunity-documents');

CREATE POLICY "Authenticated users can upload investor docs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'investor-documents');

CREATE POLICY "Authenticated users can read investor docs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'investor-documents');

CREATE POLICY "Authenticated users can upload asset docs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'asset-documents');

CREATE POLICY "Authenticated users can read asset docs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'asset-documents');

CREATE POLICY "Authenticated users can upload general docs"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'general-documents');

CREATE POLICY "Authenticated users can read general docs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'general-documents');

-- ============================================
-- 9. SAMPLE DATA (Optional)
-- ============================================

-- Insert sample templates
INSERT INTO document_templates (name, description, docuseal_template_id, template_type, available_for, is_active)
VALUES 
  ('Purchase Agreement', 'Standard real estate purchase contract', 1, 'contract', ARRAY['project', 'opportunity'], true),
  ('Non-Disclosure Agreement', 'Mutual NDA for business discussions', 2, 'agreement', ARRAY['project', 'opportunity', 'investor', 'general'], true),
  ('Subscription Agreement', 'Investment subscription documents', 3, 'subscription', ARRAY['investor'], true),
  ('Operating Agreement Amendment', 'LLC operating agreement amendment', 4, 'legal', ARRAY['project', 'investor'], true),
  ('Vendor Contract', 'Standard vendor/contractor agreement', 5, 'contract', ARRAY['project', 'general'], true)
ON CONFLICT DO NOTHING;

-- ============================================
-- 10. UPDATED_AT TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_document_templates_updated_at
  BEFORE UPDATE ON document_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_signing_requests_updated_at
  BEFORE UPDATE ON document_signing_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_signers_updated_at
  BEFORE UPDATE ON document_signers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_documents_updated_at
  BEFORE UPDATE ON project_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_opportunity_documents_updated_at
  BEFORE UPDATE ON opportunity_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_investor_documents_updated_at
  BEFORE UPDATE ON investor_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_asset_documents_updated_at
  BEFORE UPDATE ON asset_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_general_documents_updated_at
  BEFORE UPDATE ON general_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DONE
-- ============================================
