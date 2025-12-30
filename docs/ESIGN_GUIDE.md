# E-Signature Integration Guide

## Overview

The E-Sign module integrates DocuSeal (self-hosted) with AtlasDev for seamless document signing. Documents can be sent from multiple locations throughout the app and are automatically stored in the appropriate Supabase bucket upon completion.

## Environment Variables

Add to your `.env` file:

```env
VITE_DOCUSEAL_URL=https://sign.yourdomain.com
VITE_DOCUSEAL_API_KEY=your_api_key_here
```

## Features Implemented

### 1. Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ESignButton` | `src/components/esign/ESignButton.jsx` | Reusable button that opens signing modal |
| `ESignModal` | `src/components/esign/ESignModal.jsx` | 3-step wizard for sending documents |
| `DocumentViewModal` | `src/components/esign/DocumentViewModal.jsx` | View document status and signer progress |

### 2. Service Functions

Located in `src/services/esignService.js`:

```javascript
// Template management
getTemplatesForModule(module)      // Get templates for specific module
getAllTemplates()                  // Get all active templates
getDocuSealTemplates()             // Fetch templates from DocuSeal

// Contact matching
searchContacts(searchTerm)         // Search contacts for signer selection

// Send for signature
sendForSignature({
  entityType,                      // 'project', 'opportunity', 'investor', etc.
  entityId,                        // UUID of the entity
  entityName,                      // Display name
  templateId,                      // AtlasDev template ID
  docusealTemplateId,              // DocuSeal template ID
  documentName,                    // Name for this document
  signers,                         // Array of signer objects
  prefillData,                     // Data to prefill in template
  sendEmail,                       // Send email notifications
  notes                            // Internal notes
})

// Document processing
processCompletedDocument(id)       // Download and store signed PDF
syncDocumentStatus(id)             // Sync status from DocuSeal

// Queries
getDocumentsForEntity(type, id)    // Get documents for specific entity
getAllDocuments(filters)           // Get all documents with filters
getDocumentsForContact(contactId)  // Get documents for a contact
getSigningRequest(id)              // Get single request with signers

// Actions
downloadSignedDocument(id)         // Get download URL
resendToSigner(signerId)           // Resend email to signer
cancelSigningRequest(id)           // Cancel pending request
getSigningStats(type, id)          // Get statistics
```

### 3. Pages

| Page | Route | Purpose |
|------|-------|---------|
| ESignPage | `/operations/esign` | Central e-signature management |

### 4. Integration Points

E-Sign button added to:
- **Pipeline (Opportunity Detail)** - Send LOIs, purchase agreements
- **Projects (Project Detail)** - Send contracts, change orders
- **Investments (Deal Documents)** - Send subscription agreements
- **Investors (Investor Profile)** - Send accreditation docs, K-1s

## Usage Examples

### Basic Usage

```jsx
import { ESignButton } from '@/components/esign';

<ESignButton
  entityType="project"
  entityId={project.id}
  entityName={project.name}
/>
```

### With Prefilled Data

```jsx
<ESignButton
  entityType="opportunity"
  entityId={opportunity.id}
  entityName={opportunity.name}
  prefillData={{
    property_address: opportunity.address,
    purchase_price: opportunity.askingPrice,
    buyer_name: 'VanRock Holdings LLC'
  }}
/>
```

### With Default Signers

```jsx
<ESignButton
  entityType="investor"
  entityId={investor.id}
  entityName={investor.name}
  defaultSigners={[{
    role: 'Investor',
    name: investor.name,
    email: investor.email,
    phone: investor.phone,
    contact_id: investor.id
  }]}
/>
```

## Database Setup

Run the SQL in `docs/esign-schema.sql` to create:

1. **document_templates** - Template definitions synced with DocuSeal
2. **document_signing_requests** - Tracking for sent documents
3. **document_signers** - Individual signer tracking
4. **document_contacts** - Junction table for contact linking
5. **Storage tables** - Per-entity document storage
6. **Storage buckets** - Supabase storage configuration

## DocuSeal Setup

1. Install DocuSeal (Docker or hosted)
2. Configure API key in DocuSeal settings
3. Create templates in DocuSeal
4. Add template records to `document_templates` table with `docuseal_template_id`

## Webhook Integration (Optional)

DocuSeal can send webhooks on document events. Set up a Supabase Edge Function or external endpoint to receive:

```javascript
// Example webhook handler
export async function handleDocuSealWebhook(event) {
  const { event_type, data } = event;
  
  if (event_type === 'submission.completed') {
    await processCompletedDocument(data.submission_id);
  }
}
```

## Navigation

E-Signatures added to Operations dropdown:
- Operations → Tools → E-Signatures

## File Structure

```
src/
├── components/
│   └── esign/
│       ├── index.js
│       ├── ESignButton.jsx
│       ├── ESignModal.jsx
│       └── DocumentViewModal.jsx
├── pages/
│   └── operations/
│       └── ESignPage.jsx
├── services/
│   └── esignService.js
docs/
└── esign-schema.sql
```

## Status Flow

```
draft → sent → viewed → partially_signed → signed/completed
                    ↓
                declined / expired / cancelled
```

## Contact Auto-Matching

When adding signers, the system automatically:
1. Searches existing contacts by email
2. Links signer to contact if found
3. Flags as `contact_auto_matched: true`
4. Creates `document_contacts` junction record

## Storage Flow

1. Document sent via DocuSeal
2. DocuSeal handles signing process
3. On completion, signed PDF downloaded
4. PDF uploaded to appropriate Supabase bucket
5. Document record created in entity-specific table
6. URL stored in signing request for quick access
