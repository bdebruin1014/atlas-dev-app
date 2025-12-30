# Document Management Implementation Guide

## Overview

The Document Management module integrates SharePoint via Microsoft Graph API to provide centralized document storage, with AtlasDev serving as the access gateway. The Service Principal owns all files, and users receive time-limited edit links (8 hours by default).

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         AtlasDev                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │ Document    │    │ Document    │    │ Document            │  │
│  │ Library     │────│ Service     │────│ Access Log          │  │
│  │ (UI)        │    │ (API)       │    │ (Audit Trail)       │  │
│  └─────────────┘    └──────┬──────┘    └─────────────────────┘  │
│                            │                                      │
└────────────────────────────┼──────────────────────────────────────┘
                             │ Microsoft Graph API
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                     SharePoint Online                             │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ AtlasDev Site / Document Library                             │ │
│  │  ├── Projects/{uuid}/                                        │ │
│  │  │   ├── Contracts/                                          │ │
│  │  │   ├── Financial/                                          │ │
│  │  │   └── ...                                                 │ │
│  │  ├── Opportunities/{uuid}/                                   │ │
│  │  ├── Investments/{uuid}/                                     │ │
│  │  ├── Entities/{uuid}/                                        │ │
│  │  ├── Contacts/{uuid}/                                        │ │
│  │  └── Templates/                                              │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## Environment Variables

Add to your `.env` file:

```env
# Microsoft Entra ID (Azure AD)
VITE_MS_TENANT_ID=your-tenant-id
VITE_MS_CLIENT_ID=your-app-client-id
VITE_MS_CLIENT_SECRET=your-client-secret

# SharePoint
VITE_SHAREPOINT_SITE_ID=your-site-id
VITE_SHAREPOINT_DRIVE_ID=your-document-library-drive-id
```

## Azure AD App Registration

1. **Create App Registration** in Azure Portal
2. **API Permissions** required:
   - `Sites.ReadWrite.All` (Application)
   - `Files.ReadWrite.All` (Application)
3. **Create Client Secret** and save to env
4. **Grant Admin Consent** for the permissions

## SharePoint Setup

1. Create a SharePoint site for AtlasDev
2. Create a Document Library (or use the default)
3. Get Site ID: `GET /sites/{hostname}:{server-relative-path}`
4. Get Drive ID: `GET /sites/{site-id}/drives`
5. Create initial folder structure via Graph API or manually

## Features Implemented

### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `DocumentLibrary` | `src/components/documents/DocumentLibrary.jsx` | Embeddable document browser |
| `DocumentUploadModal` | `src/components/documents/DocumentUploadModal.jsx` | Multi-file upload with metadata |
| `DocumentViewerModal` | `src/components/documents/DocumentViewerModal.jsx` | Document details, actions, activity |

### Service Functions

Located in `src/services/documentService.js`:

```javascript
// Authentication (internal)
getAccessToken()                   // Get/cache Microsoft Graph token

// Folder Management
ensureFolderExists(path)           // Create folder path if missing
createEntityFolder(type, id, name) // Create entity folder with subfolders

// File Operations
uploadFile({...})                  // Upload file to SharePoint + create record
downloadFile(documentId)           // Get download URL
deleteFile(documentId)             // Soft delete in Supabase, hard delete SharePoint
moveFile(documentId, newType, newId, newCategory)  // Move between entities

// Time-Limited Links
getEditLink(documentId, hours=8)   // Create anonymous edit link
getViewLink(documentId)            // Create anonymous view link

// Queries
getDocumentsForEntity(type, id, options)  // Entity's documents
getAllDocuments(filters)                   // All documents with filters
getDocument(documentId)                    // Single document
getRecentDocuments(limit)                  // Recent activity

// Templates
getTemplates(category)             // Get template library
createFromTemplate(templateId, type, id, name)  // Copy template to entity

// Updates
updateDocument(documentId, updates)  // Update metadata

// Activity
getDocumentActivity(documentId)    // Audit log for document

// Statistics
getDocumentStats(type, id)         // Count/size aggregations
```

### Pages

| Page | Route | Purpose |
|------|-------|---------|
| DocumentLibraryPage | `/operations/documents` | Central document browser |

## Folder Structure

SharePoint folder hierarchy:

```
AtlasDev/
├── Projects/
│   └── {project-uuid}/
│       ├── Contracts/
│       ├── Legal/
│       ├── Financial/
│       ├── Correspondence/
│       ├── Photos/
│       ├── Reports/
│       └── Miscellaneous/
├── Opportunities/
│   └── {opportunity-uuid}/
│       └── ... (same categories)
├── Investments/
│   └── {deal-uuid}/
├── Entities/
│   └── {entity-uuid}/
├── Contacts/
│   └── {contact-uuid}/
└── Templates/
    ├── Contracts/
    ├── Legal/
    ├── Financial/
    └── Reports/
```

## Usage Examples

### Embed Document Library in Entity Page

```jsx
import { DocumentLibrary } from '@/components/documents';

function ProjectDocumentsTab({ project }) {
  return (
    <DocumentLibrary
      entityType="project"
      entityId={project.id}
      entityName={project.name}
      showHeader={true}
      showCategories={true}
      showUpload={true}
    />
  );
}
```

### Upload with Pre-selected Category

```jsx
<DocumentUploadModal
  isOpen={showUpload}
  onClose={() => setShowUpload(false)}
  entityType="project"
  entityId={projectId}
  entityName={projectName}
  defaultCategory="Contracts"
  onSuccess={handleUploadSuccess}
/>
```

### Get Edit Link Programmatically

```javascript
import { getEditLink } from '@/services/documentService';

const handleEditDocument = async (docId) => {
  const { url, expiresAt } = await getEditLink(docId, 8); // 8 hours
  if (url) {
    window.open(url, '_blank');
    console.log(`Link expires at: ${expiresAt}`);
  }
};
```

## Database Tables

| Table | Purpose |
|-------|---------|
| `documents` | Main document records with SharePoint references |
| `document_templates_library` | Template definitions |
| `document_access_links` | Time-limited sharing links |
| `document_access_log` | Audit trail for all actions |
| `document_versions` | Version history (future) |
| `document_shares` | External sharing (future) |

## Edit Link Flow

1. User clicks "Edit" on document
2. AtlasDev calls Microsoft Graph API to create anonymous edit link
3. Link has 8-hour expiration
4. Link stored in `document_access_links`
5. Activity logged in `document_access_log`
6. User redirected to SharePoint Online editor
7. Changes auto-save to SharePoint

## Security Considerations

1. **Service Principal** - All Graph API calls use app-only auth, not user tokens
2. **Time-Limited Links** - Edit links expire after 8 hours by default
3. **Audit Trail** - All actions logged with user, timestamp, details
4. **Soft Delete** - Documents are soft-deleted in Supabase before SharePoint removal
5. **RLS Policies** - Row-level security on all tables (expand for team-based access)

## Navigation

Document Library added to Operations dropdown:
- Operations → Tools → Document Library

## File Structure

```
src/
├── components/
│   └── documents/
│       ├── index.js
│       ├── DocumentLibrary.jsx
│       ├── DocumentUploadModal.jsx
│       └── DocumentViewerModal.jsx
├── pages/
│   └── operations/
│       └── DocumentLibraryPage.jsx
├── services/
│   └── documentService.js
docs/
└── document-schema.sql
```

## Troubleshooting

### "Failed to get access token"
- Check tenant ID, client ID, client secret
- Verify app registration has correct permissions
- Ensure admin consent was granted

### "Failed to upload file"
- Check SharePoint site/drive IDs
- Verify folder path exists (service creates if missing)
- Check file size (max depends on SharePoint config)

### "Edit link not working"
- Anonymous sharing must be enabled in SharePoint admin
- Check link hasn't expired
- Verify document still exists

## Future Enhancements

1. **Version Control** - Track document versions from SharePoint
2. **External Sharing** - Share documents with external contacts
3. **OCR/Search** - Full-text search via SharePoint search API
4. **Folder Sync** - Background sync for folder structure validation
5. **Bulk Operations** - Multi-select upload/download/move
