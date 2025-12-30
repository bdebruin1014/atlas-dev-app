# Roles & Permissions Module Guide

## Overview

The Roles & Permissions module provides Role-Based Access Control (RBAC) for AtlasDev. It controls what users can see and do throughout the application.

## Roles

### Built-in Roles

| Role | Description | Access Level |
|------|-------------|--------------|
| **Super Admin** | Full system access, can manage all settings and users | Everything |
| **Admin** | Administrative access, can manage users and most settings | Most features, except delete users |
| **Manager** | Can manage projects, deals, and team members | Projects, Pipeline, Teams |
| **Accountant** | Full access to accounting, limited access to other modules | Accounting, Entities, Reports |
| **Project Manager** | Can manage assigned projects and related data | Projects, Tasks, Documents |
| **Property Manager** | Can manage properties, inspections, and tenants | Properties, Inspections, Maintenance |
| **Investor Relations** | Can manage investor communications and reports | Investors, Deals, Distributions |
| **Team Member** | Standard access to assigned projects and tasks | View most, edit assigned |
| **Viewer** | Read-only access to permitted areas | View only |
| **External** | Limited access for external partners/contractors | Minimal view access |

## Permissions

### Permission Categories

**User Management**
- `users:view` - View user list
- `users:create` - Create new users
- `users:edit` - Edit user profiles
- `users:delete` - Delete users
- `users:manage_roles` - Change user roles

**Projects**
- `projects:view` - View projects
- `projects:create` - Create projects
- `projects:edit` - Edit projects
- `projects:delete` - Delete projects
- `projects:manage_team` - Manage project team members

**Accounting**
- `accounting:view` - View transactions/reports
- `accounting:create` - Create transactions
- `accounting:edit` - Edit transactions
- `accounting:delete` - Delete transactions
- `accounting:approve` - Approve transactions
- `accounting:reports` - Generate financial reports

**Property Management**
- `properties:view` - View properties
- `properties:create` - Create properties
- `properties:edit` - Edit properties
- `properties:delete` - Delete properties
- `inspections:conduct` - Conduct inspections

**Documents**
- `documents:view` - View documents
- `documents:upload` - Upload documents
- `documents:delete` - Delete documents
- `documents:send_esign` - Send for e-signature

**Administration**
- `admin:settings` - System settings
- `admin:templates` - Manage templates
- `admin:audit_log` - View audit log

## Implementation

### Service Layer

Location: `src/services/permissionService.js`

**Core Functions:**
```javascript
// Load user's permissions
await loadUserPermissions(userId)

// Check single permission
hasPermission(PERMISSIONS.PROJECTS_VIEW)

// Check any of multiple permissions
hasAnyPermission([PERMISSIONS.PROJECTS_EDIT, PERMISSIONS.PROJECTS_CREATE])

// Check all permissions required
hasAllPermissions([PERMISSIONS.ACCOUNTING_VIEW, PERMISSIONS.ACCOUNTING_EDIT])

// Role checks
isAdmin()
isSuperAdmin()
getCurrentRole()
```

**Role Management:**
```javascript
// Get user's role
const { data } = await getUserRole(userId)

// Set user's role with custom permissions
await setUserRole(userId, ROLES.PROJECT_MANAGER, ['custom:permission'])

// Get all users with roles
const { data: users } = await getAllUsersWithRoles()
```

### React Context

Location: `src/contexts/PermissionContext.jsx`

**Using the Hook:**
```jsx
import { usePermissions } from '@/contexts/PermissionContext';

function MyComponent() {
  const { 
    hasPermission, 
    isAdmin, 
    role, 
    canAccessModule 
  } = usePermissions();

  if (!hasPermission(PERMISSIONS.PROJECTS_EDIT)) {
    return <AccessDenied />;
  }

  return <EditForm />;
}
```

### Gate Components

**PermissionGate** - Show/hide based on permission:
```jsx
import { PermissionGate } from '@/contexts/PermissionContext';

<PermissionGate permission={PERMISSIONS.USERS_CREATE}>
  <Button>Create User</Button>
</PermissionGate>
```

**RoleGate** - Show/hide based on role:
```jsx
import { RoleGate } from '@/contexts/PermissionContext';

<RoleGate roles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
  <AdminOnlyFeature />
</RoleGate>
```

**AdminGate** - Admin-only content:
```jsx
import { AdminGate } from '@/contexts/PermissionContext';

<AdminGate fallback={<p>Admin access required</p>}>
  <SystemSettings />
</AdminGate>
```

**ModuleGate** - Module access:
```jsx
import { ModuleGate } from '@/contexts/PermissionContext';

<ModuleGate module="accounting">
  <AccountingDashboard />
</ModuleGate>
```

### Protected Routes

Location: `src/components/PermissionProtectedRoute.jsx`

```jsx
import PermissionProtectedRoute from '@/components/PermissionProtectedRoute';

// Single permission
<Route 
  path="/admin/users" 
  element={
    <PermissionProtectedRoute permission={PERMISSIONS.USERS_VIEW}>
      <UsersPage />
    </PermissionProtectedRoute>
  } 
/>

// Multiple permissions (any)
<Route 
  path="/accounting" 
  element={
    <PermissionProtectedRoute 
      permissions={[PERMISSIONS.ACCOUNTING_VIEW, PERMISSIONS.ADMIN_SETTINGS]}
    >
      <AccountingPage />
    </PermissionProtectedRoute>
  } 
/>

// Module-based
<Route 
  path="/properties" 
  element={
    <PermissionProtectedRoute module="properties">
      <PropertiesPage />
    </PermissionProtectedRoute>
  } 
/>
```

## Pages

### User Management Page

Route: `/admin/users`
Location: `src/pages/admin/UsersManagementPage.jsx`

Features:
- User list with role badges
- Role filter and search
- Edit user roles
- Invite new users
- View role descriptions

### Role Edit Modal

Location: `src/components/admin/UserRoleModal.jsx`

Features:
- Visual role selector
- Role permissions summary
- Add custom permissions
- Permission groups expansion

### Invite User Modal

Location: `src/components/admin/InviteUserModal.jsx`

Features:
- Email input
- Role assignment
- Send invitation option

## Database Schema

Location: `docs/roles-permissions-schema.sql`

### Tables

| Table | Purpose |
|-------|---------|
| `user_profiles` | User information, status |
| `user_roles` | User role assignments |
| `project_team_members` | Project-specific access |
| `entity_access` | Accounting entity access |
| `permission_audit_log` | Change tracking |
| `role_definitions` | Role metadata |

### Key Features

1. **Custom Permissions** - Add permissions beyond role's default
2. **Project-Level Roles** - Different role per project (owner, manager, member, viewer)
3. **Entity Access Control** - Granular accounting access
4. **Audit Logging** - Track all permission changes

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/admin/users` | UsersManagementPage | User management |
| `/admin/roles` | (Placeholder) | Role definitions |

## Navigation

Admin sidebar updated with:
- **Organization** section
  - Users → `/admin/users`
  - Teams → `/admin/teams`
  - Roles & Permissions → `/admin/roles`
  - Companies → `/admin/companies`

## File Structure

```
src/
├── services/
│   └── permissionService.js       # Core RBAC logic
├── contexts/
│   └── PermissionContext.jsx      # React context & hooks
├── components/
│   ├── PermissionProtectedRoute.jsx
│   └── admin/
│       ├── index.js
│       ├── UserRoleModal.jsx
│       └── InviteUserModal.jsx
├── pages/
│   └── admin/
│       └── UsersManagementPage.jsx
docs/
└── roles-permissions-schema.sql
```

## Usage Examples

### Conditional Button Rendering
```jsx
const { hasPermission, PERMISSIONS } = usePermissions();

return (
  <div>
    <Button>View</Button>
    
    {hasPermission(PERMISSIONS.PROJECTS_EDIT) && (
      <Button>Edit</Button>
    )}
    
    {hasPermission(PERMISSIONS.PROJECTS_DELETE) && (
      <Button variant="destructive">Delete</Button>
    )}
  </div>
);
```

### API-Level Permission Check
```javascript
// In a service function
export async function deleteProject(projectId) {
  // Permission already loaded in context
  if (!hasPermission(PERMISSIONS.PROJECTS_DELETE)) {
    throw new Error('Permission denied');
  }
  
  // Proceed with delete
  return supabase.from('projects').delete().eq('id', projectId);
}
```

### Database-Level RLS
```sql
-- Only allow viewing if user has projects:view permission
CREATE POLICY "View projects" ON projects
  FOR SELECT TO authenticated
  USING (user_has_permission(auth.uid(), 'projects:view'));
```

## Best Practices

1. **Always check permissions** before showing sensitive actions
2. **Use PermissionGate** for UI elements
3. **Use PermissionProtectedRoute** for entire pages
4. **Log permission changes** with audit trail
5. **Default to least privilege** - start with Viewer role
6. **Custom permissions** for edge cases only

## Future Enhancements

1. **Permission Groups** - Create custom permission bundles
2. **Time-Based Access** - Temporary elevated permissions
3. **Two-Factor for Admin** - Extra security for admin actions
4. **Permission Inheritance** - Child entities inherit parent permissions
5. **Approval Workflows** - Require approval for sensitive changes
