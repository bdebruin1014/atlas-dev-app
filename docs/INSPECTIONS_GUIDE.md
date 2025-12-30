# Property Management - Inspections Module Guide

## Overview

The Inspections module provides comprehensive property inspection capabilities for rental property management. Inspectors can schedule, conduct, and document property inspections with photos, condition ratings, and repair flags.

## Features

### Inspection Types
- **Move-In Inspection** - Document property condition when tenant moves in
- **Move-Out Inspection** - Document condition at tenant departure
- **Routine Inspection** - Periodic property check
- **Annual Inspection** - Yearly comprehensive review
- **Drive-By Inspection** - Quick exterior check
- **Maintenance Inspection** - Pre/post maintenance work
- **Safety Inspection** - Safety systems check
- **Pre-Lease Inspection** - Before listing property

### Inspection Flow
1. **Schedule** - Select property, type, date/time, inspector
2. **Start** - Begin inspection, status changes to "in_progress"
3. **Conduct** - Rate each item, add notes, take photos, flag repairs
4. **Complete** - Review summary, finalize inspection
5. **Follow-up** - Items flagged for repair generate follow-up status

### Condition Ratings
| Rating | Score | Color | Description |
|--------|-------|-------|-------------|
| Excellent | 5 | Green | Perfect condition |
| Good | 4 | Emerald | Minor wear only |
| Fair | 3 | Yellow | Moderate wear/issues |
| Poor | 2 | Orange | Significant issues |
| Damaged | 1 | Red | Requires immediate repair |
| N/A | — | Gray | Not applicable |

## Components

### CreateInspectionModal
Location: `src/components/inspections/CreateInspectionModal.jsx`

Props:
```jsx
<CreateInspectionModal
  isOpen={boolean}
  onClose={() => {}}
  onSuccess={(inspection) => {}}
  defaultPropertyId={uuid}
  defaultUnitId={uuid}
  properties={[{id, name, address, units}]}
/>
```

### PMInspectionsPage
Location: `src/pages/property-management/PMInspectionsPage.jsx`
Route: `/property-management/inspections`

Features:
- Stats cards (total, scheduled, completed, requires follow-up)
- Overdue inspections alert
- Upcoming inspections preview
- Filterable/searchable inspection list
- Start/continue/view actions

### InspectionConductPage
Location: `src/pages/property-management/InspectionConductPage.jsx`
Route: `/property-management/inspections/:inspectionId/conduct`

Features:
- Progress bar with item count
- Expandable sections by room/area
- Condition rating buttons for each item
- Notes field per item
- Photo capture (camera or upload)
- Repair flag toggle
- Complete inspection modal

## Service Functions

Located in `src/services/inspectionService.js`:

```javascript
// CRUD
createInspection(options)        // Create new inspection
getInspection(id)                // Get inspection with items
updateInspection(id, updates)    // Update inspection metadata
deleteInspection(id)             // Delete inspection

// Items
updateInspectionItem(id, updates)  // Update single item
bulkUpdateItems(items)             // Update multiple items
addInspectionItem(inspId, section, name)  // Add custom item
removeInspectionItem(id)           // Remove item

// Photos
uploadInspectionPhoto(inspId, itemId, file)  // Upload photo
removeInspectionPhoto(itemId, photoUrl)      // Remove photo

// Queries
getInspectionsForProperty(propId, options)  // Property inspections
getInspectionsForUnit(unitId)               // Unit inspections
getAllInspections(filters)                   // All inspections
getUpcomingInspections(days)                 // Upcoming in N days
getOverdueInspections()                      // Past due inspections

// Complete
completeInspection(id, summary)  // Finalize inspection

// Templates
getInspectionTemplates()         // Get available templates
createInspectionTemplate(...)    // Create custom template

// Stats
getInspectionStats(propId)       // Statistics
generateInspectionReport(id)     // Generate report data
```

## Database Tables

| Table | Purpose |
|-------|---------|
| `properties` | Rental properties |
| `units` | Units within multi-family properties |
| `inspection_templates` | Custom inspection templates |
| `inspections` | Inspection records |
| `inspection_items` | Individual items within inspections |

## Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/property-management/inspections` | PMInspectionsPage | List/dashboard |
| `/property-management/inspections/:id/conduct` | InspectionConductPage | Conduct inspection |
| `/property-management/inspections/:id` | InspectionConductPage | View inspection |

## Navigation

Property Mgmt dropdown includes:
- **Dashboard** - `/property-management`
- **Operations**
  - Inspections - `/property-management/inspections`
  - Maintenance - `/property-management/maintenance` (placeholder)
- **Leasing**
  - Properties - `/property-management/properties` (placeholder)
  - Tenants - `/property-management/tenants` (placeholder)

## Default Inspection Template

The system includes a comprehensive default template with sections:
- Exterior (10 items)
- Living Room (8 items)
- Kitchen (13 items)
- Master Bedroom (8 items)
- Bedroom 2 (8 items)
- Bedroom 3 (8 items)
- Master Bathroom (10 items)
- Bathroom 2 (8 items)
- Laundry (6 items)
- Garage (6 items)
- Systems (7 items)

## Mobile-Friendly Design

The InspectionConductPage is designed for field use:
- Large touch targets for condition buttons
- Camera integration for photos
- Auto-save on every change
- Progress tracking
- Collapsible sections

## File Structure

```
src/
├── components/
│   └── inspections/
│       ├── index.js
│       └── CreateInspectionModal.jsx
├── pages/
│   └── property-management/
│       ├── PMInspectionsPage.jsx
│       └── InspectionConductPage.jsx
├── services/
│   └── inspectionService.js
docs/
└── inspection-schema.sql
```

## Usage Example

```jsx
// Schedule an inspection
import { createInspection } from '@/services/inspectionService';

const { data, error } = await createInspection({
  propertyId: '123...',
  unitId: '456...',
  inspectionType: 'move_out',
  scheduledDate: '2025-01-15T10:00:00',
  inspectorName: 'John Smith',
  tenantName: 'Jane Doe',
});

// Update item during inspection
import { updateInspectionItem } from '@/services/inspectionService';

await updateInspectionItem(itemId, {
  condition: 'fair',
  notes: 'Minor scratches on floor',
  requires_repair: true,
});

// Complete inspection
import { completeInspection } from '@/services/inspectionService';

await completeInspection(inspectionId, {
  notes: 'Overall property in good condition. Minor repairs needed.',
});
```

## Future Enhancements

1. **PDF Report Generation** - Export inspection as PDF with photos
2. **Tenant Portal** - Allow tenants to view/acknowledge inspections
3. **Signature Capture** - Digital signatures for tenant/inspector
4. **Maintenance Integration** - Auto-create work orders from flagged items
5. **Comparison View** - Compare move-in vs move-out inspections
6. **Scheduling Automation** - Auto-schedule annual/routine inspections
