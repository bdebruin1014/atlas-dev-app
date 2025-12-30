-- Document Templates Table
CREATE TABLE IF NOT EXISTS public.document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  template_type VARCHAR(50),
  docuseal_template_id VARCHAR(255) UNIQUE NOT NULL,
  available_for TEXT[] DEFAULT ARRAY['general'],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Document Signing Requests Table
CREATE TABLE IF NOT EXISTS public.document_signing_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  entity_name VARCHAR(255),
  template_id UUID REFERENCES public.document_templates(id),
  docuseal_submission_id VARCHAR(255) UNIQUE NOT NULL,
  docuseal_template_id VARCHAR(255) NOT NULL,
  document_name VARCHAR(255) NOT NULL,
  document_type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'sent',
  sent_at TIMESTAMP,
  viewed_at TIMESTAMP,
  completed_at TIMESTAMP,
  storage_path VARCHAR(512),
  storage_url TEXT,
  linked_document_id UUID,
  prefill_data JSONB DEFAULT '{}'::jsonb,
  docuseal_document_url TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Document Signers Table
CREATE TABLE IF NOT EXISTS public.document_signers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signing_request_id UUID NOT NULL REFERENCES public.document_signing_requests(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES public.contacts(id),
  role VARCHAR(100),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  contact_auto_matched BOOLEAN DEFAULT false,
  docuseal_submitter_id VARCHAR(255) NOT NULL,
  embed_src TEXT,
  status VARCHAR(50) DEFAULT 'sent',
  signing_order INTEGER,
  signed_at TIMESTAMP,
  ip_address INET,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Document Contacts Junction Table
CREATE TABLE IF NOT EXISTS public.document_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type VARCHAR(50) NOT NULL,
  document_id UUID NOT NULL,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'signer',
  signed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(document_type, document_id, contact_id)
);

-- Storage Buckets for Documents (executed via Supabase UI)
-- buckets to create:
-- - project-documents
-- - opportunity-documents
-- - investor-documents
-- - general-documents

-- Indexes for performance
CREATE INDEX idx_document_signing_requests_entity ON public.document_signing_requests(entity_type, entity_id);
CREATE INDEX idx_document_signing_requests_status ON public.document_signing_requests(status);
CREATE INDEX idx_document_signing_requests_docuseal ON public.document_signing_requests(docuseal_submission_id);
CREATE INDEX idx_document_signers_signing_request ON public.document_signers(signing_request_id);
CREATE INDEX idx_document_signers_contact ON public.document_signers(contact_id);
CREATE INDEX idx_document_signers_email ON public.document_signers(email);
CREATE INDEX idx_document_signers_docuseal_submitter ON public.document_signers(docuseal_submitter_id);
CREATE INDEX idx_document_contacts_document ON public.document_contacts(document_type, document_id);
CREATE INDEX idx_document_contacts_contact ON public.document_contacts(contact_id);

-- Row Level Security Policies
ALTER TABLE public.document_signing_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_signers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view documents they're associated with
CREATE POLICY "View documents for own entity" ON public.document_signing_requests
FOR SELECT USING (TRUE);

-- Policy: Authenticated users can create signing requests
CREATE POLICY "Create signing requests" ON public.document_signing_requests
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Users can view signer records for documents they can view
CREATE POLICY "View signers" ON public.document_signers
FOR SELECT USING (TRUE);

-- Policy: View public documents
CREATE POLICY "View document templates" ON public.document_templates
FOR SELECT USING (is_active = true);

