-- ============================================
-- AtlasDev Document Management Schema
-- SharePoint Integration with Microsoft Graph API
-- Run in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. MAIN DOCUMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Entity linking
  entity_type TEXT NOT NULL, -- 'project', 'opportunity', 'investor', 'entity', 'contact', 'general'
  entity_id UUID, -- Null for general documents
  entity_name TEXT, -- Denormalized for display
  
  -- Document metadata
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Miscellaneous',
  file_type TEXT, -- MIME type
  file_size INTEGER, -- bytes
  tags TEXT[] DEFAULT '{}',
  
  -- SharePoint integration
  sharepoint_item_id TEXT NOT NULL,
  sharepoint_drive_id TEXT NOT NULL,
  sharepoint_path TEXT NOT NULL,
  sharepoint_web_url TEXT,
  
  -- Template tracking
  template_id UUID REFERENCES document_templates_library(id),
  
  -- Soft delete
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  deleted_by UUID REFERENCES auth.users(id),
  
  -- Audit
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. DOCUMENT TEMPLATES LIBRARY
-- ============================================

CREATE TABLE IF NOT EXISTS document_templates_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Miscellaneous',
  file_type TEXT,
  file_size INTEGER,
  
  -- SharePoint info
  sharepoint_item_id TEXT NOT NULL,
  sharepoint_drive_id TEXT NOT NULL,
  sharepoint_path TEXT NOT NULL,
  sharepoint_web_url TEXT,
  
  -- Template settings
  available_for TEXT[] DEFAULT '{}', -- Entity types this template is for
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  
  -- Audit
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. DOCUMENT ACCESS LINKS
-- Time-limited edit/view links
-- ============================================

CREATE TABLE IF NOT EXISTS document_access_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  link_type TEXT NOT NULL CHECK (link_type IN ('view', 'edit')),
  link_url TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. DOCUMENT ACCESS LOG (Audit Trail)
-- ============================================

CREATE TABLE IF NOT EXISTS document_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL, -- 'file_uploaded', 'file_downloaded', 'edit_link_created', etc.
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  entity_type TEXT,
  entity_id UUID,
  user_id UUID REFERENCES auth.users(id),
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. DOCUMENT VERSIONS (Future)
-- ============================================

CREATE TABLE IF NOT EXISTS document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  sharepoint_version_id TEXT,
  file_size INTEGER,
  modified_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(document_id, version_number)
);

-- ============================================
-- 6. DOCUMENT SHARES (Future)
-- For sharing documents with external parties
-- ============================================

CREATE TABLE IF NOT EXISTS document_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  share_type TEXT NOT NULL CHECK (share_type IN ('link', 'email', 'contact')),
  recipient_email TEXT,
  recipient_contact_id UUID,
  permission TEXT DEFAULT 'view' CHECK (permission IN ('view', 'edit')),
  link_url TEXT,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  accessed_at TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_deleted ON documents(is_deleted);
CREATE INDEX IF NOT EXISTS idx_documents_sharepoint ON documents(sharepoint_item_id);
CREATE INDEX IF NOT EXISTS idx_documents_created ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON documents USING GIN(tags);

CREATE INDEX IF NOT EXISTS idx_templates_category ON document_templates_library(category);
CREATE INDEX IF NOT EXISTS idx_templates_active ON document_templates_library(is_active);
CREATE INDEX IF NOT EXISTS idx_templates_available ON document_templates_library USING GIN(available_for);

CREATE INDEX IF NOT EXISTS idx_access_links_document ON document_access_links(document_id);
CREATE INDEX IF NOT EXISTS idx_access_links_expires ON document_access_links(expires_at);

CREATE INDEX IF NOT EXISTS idx_access_log_document ON document_access_log(document_id);
CREATE INDEX IF NOT EXISTS idx_access_log_user ON document_access_log(user_id);
CREATE INDEX IF NOT EXISTS idx_access_log_created ON document_access_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_document_versions_document ON document_versions(document_id);

CREATE INDEX IF NOT EXISTS idx_document_shares_document ON document_shares(document_id);
CREATE INDEX IF NOT EXISTS idx_document_shares_active ON document_shares(is_active);

-- ============================================
-- 8. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_access_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_shares ENABLE ROW LEVEL SECURITY;

-- Documents: All authenticated users (expand for team-based later)
CREATE POLICY "Manage documents" ON documents
  FOR ALL TO authenticated
  USING (true);

-- Templates: All can read, admin can manage
CREATE POLICY "Read templates" ON document_templates_library
  FOR SELECT TO authenticated
  USING (is_active = true);

CREATE POLICY "Manage templates" ON document_templates_library
  FOR ALL TO authenticated
  USING (true);

-- Access links: User can see their own
CREATE POLICY "Manage access links" ON document_access_links
  FOR ALL TO authenticated
  USING (true);

-- Access log: All authenticated can insert, read own
CREATE POLICY "Insert access log" ON document_access_log
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY "Read access log" ON document_access_log
  FOR SELECT TO authenticated
  USING (true);

-- Versions: Follow document permissions
CREATE POLICY "Manage versions" ON document_versions
  FOR ALL TO authenticated
  USING (true);

-- Shares: Follow document permissions
CREATE POLICY "Manage shares" ON document_shares
  FOR ALL TO authenticated
  USING (true);

-- ============================================
-- 9. TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_documents_updated_at();

CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON document_templates_library
  FOR EACH ROW EXECUTE FUNCTION update_documents_updated_at();

-- ============================================
-- 10. HELPER FUNCTIONS
-- ============================================

-- Function to get document count by entity
CREATE OR REPLACE FUNCTION get_document_count(p_entity_type TEXT, p_entity_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER 
  FROM documents 
  WHERE entity_type = p_entity_type 
    AND entity_id = p_entity_id 
    AND is_deleted = false;
$$ LANGUAGE sql STABLE;

-- Function to get total storage used by entity
CREATE OR REPLACE FUNCTION get_storage_used(p_entity_type TEXT, p_entity_id UUID)
RETURNS BIGINT AS $$
  SELECT COALESCE(SUM(file_size), 0)::BIGINT 
  FROM documents 
  WHERE entity_type = p_entity_type 
    AND entity_id = p_entity_id 
    AND is_deleted = false;
$$ LANGUAGE sql STABLE;

-- ============================================
-- 11. SAMPLE TEMPLATES
-- ============================================

-- Note: These need real SharePoint item IDs
-- Placeholder entries for development
INSERT INTO document_templates_library (
  name, description, category, file_type, 
  sharepoint_item_id, sharepoint_drive_id, sharepoint_path, sharepoint_web_url,
  available_for, is_active
) VALUES 
  (
    'Purchase Agreement Template', 
    'Standard real estate purchase contract', 
    'Contracts', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'placeholder-1', 'placeholder-drive', 'AtlasDev/Templates/Contracts/Purchase_Agreement.docx', 
    NULL,
    ARRAY['project', 'opportunity'], 
    true
  ),
  (
    'NDA Template', 
    'Non-disclosure agreement for business discussions', 
    'Legal', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'placeholder-2', 'placeholder-drive', 'AtlasDev/Templates/Legal/NDA.docx', 
    NULL,
    ARRAY['project', 'opportunity', 'investor', 'general'], 
    true
  ),
  (
    'Investor Update Template', 
    'Quarterly investor update report', 
    'Reports', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'placeholder-3', 'placeholder-drive', 'AtlasDev/Templates/Reports/Investor_Update.docx', 
    NULL,
    ARRAY['investor', 'investment_deal'], 
    true
  ),
  (
    'Project Budget Template', 
    'Development budget spreadsheet', 
    'Financial', 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'placeholder-4', 'placeholder-drive', 'AtlasDev/Templates/Financial/Project_Budget.xlsx', 
    NULL,
    ARRAY['project'], 
    true
  ),
  (
    'Vendor Contract Template', 
    'Standard vendor/contractor agreement', 
    'Contracts', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'placeholder-5', 'placeholder-drive', 'AtlasDev/Templates/Contracts/Vendor_Contract.docx', 
    NULL,
    ARRAY['project', 'general'], 
    true
  )
ON CONFLICT DO NOTHING;

-- ============================================
-- DONE
-- ============================================
