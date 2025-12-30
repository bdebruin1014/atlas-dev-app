-- ============================================
-- AtlasDev Roles & Permissions Schema
-- Run in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. USER PROFILES (if not exists)
-- ============================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  title TEXT,
  department TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Invite tracking
  invited_at TIMESTAMPTZ,
  invited_by UUID REFERENCES auth.users(id),
  accepted_at TIMESTAMPTZ,
  
  -- Preferences (JSON)
  preferences JSONB DEFAULT '{}',
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- ============================================
-- 2. USER ROLES
-- ============================================

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Role
  role TEXT NOT NULL DEFAULT 'team_member' CHECK (role IN (
    'super_admin',
    'admin', 
    'manager',
    'accountant',
    'project_manager',
    'property_manager',
    'investor_relations',
    'team_member',
    'viewer',
    'external'
  )),
  
  -- Custom permissions (additions to role)
  custom_permissions TEXT[] DEFAULT '{}',
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users(id),
  
  UNIQUE(user_id)
);

-- ============================================
-- 3. PROJECT TEAM MEMBERS
-- ============================================

CREATE TABLE IF NOT EXISTS project_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Project-specific role
  project_role TEXT DEFAULT 'member' CHECK (project_role IN (
    'owner',
    'manager',
    'member',
    'viewer'
  )),
  
  -- Permissions specific to this project
  project_permissions TEXT[] DEFAULT '{}',
  
  -- Notifications
  notify_on_updates BOOLEAN DEFAULT true,
  notify_on_tasks BOOLEAN DEFAULT true,
  
  -- Audit
  added_at TIMESTAMPTZ DEFAULT NOW(),
  added_by UUID REFERENCES auth.users(id),
  
  UNIQUE(project_id, user_id)
);

-- ============================================
-- 4. ENTITY ACCESS (accounting entities)
-- ============================================

CREATE TABLE IF NOT EXISTS entity_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL, -- References accounting entities
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  
  -- Access level
  access_level TEXT DEFAULT 'view' CHECK (access_level IN (
    'full',
    'edit',
    'view',
    'none'
  )),
  
  -- Specific permissions
  can_view_transactions BOOLEAN DEFAULT true,
  can_create_transactions BOOLEAN DEFAULT false,
  can_approve_transactions BOOLEAN DEFAULT false,
  can_view_reports BOOLEAN DEFAULT true,
  can_manage_settings BOOLEAN DEFAULT false,
  
  -- Audit
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  granted_by UUID REFERENCES auth.users(id),
  
  UNIQUE(entity_id, user_id)
);

-- ============================================
-- 5. PERMISSION AUDIT LOG
-- ============================================

CREATE TABLE IF NOT EXISTS permission_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Who made the change
  actor_user_id UUID REFERENCES auth.users(id),
  
  -- Who was affected
  target_user_id UUID REFERENCES user_profiles(id),
  
  -- What changed
  action TEXT NOT NULL, -- 'role_changed', 'permission_added', 'permission_removed', 'access_granted', etc.
  old_value TEXT,
  new_value TEXT,
  
  -- Additional context
  details JSONB DEFAULT '{}',
  
  -- When
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- IP/User Agent for security
  ip_address INET,
  user_agent TEXT
);

-- ============================================
-- 6. ROLE DEFINITIONS (for UI reference)
-- ============================================

CREATE TABLE IF NOT EXISTS role_definitions (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  description TEXT,
  permissions TEXT[] NOT NULL DEFAULT '{}',
  is_system BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default role definitions
INSERT INTO role_definitions (id, label, description, permissions, sort_order) VALUES
  ('super_admin', 'Super Admin', 'Full system access, can manage all settings and users', ARRAY['*'], 1),
  ('admin', 'Administrator', 'Administrative access, can manage users and most settings', ARRAY[
    'users:view', 'users:create', 'users:edit', 'users:manage_roles',
    'projects:*', 'pipeline:*', 'accounting:*', 'entities:view', 'entities:create', 'entities:edit',
    'investors:*', 'investments:*', 'properties:*', 'documents:*', 'contacts:*', 'tasks:*',
    'reports:*', 'admin:settings', 'admin:templates', 'admin:audit_log'
  ], 2),
  ('manager', 'Manager', 'Can manage projects, deals, and team members', ARRAY[
    'users:view', 'projects:*', 'pipeline:view', 'pipeline:create', 'pipeline:edit',
    'accounting:view', 'accounting:reports', 'entities:view', 'investors:view',
    'investments:*', 'properties:view', 'inspections:conduct', 'documents:view', 'documents:upload',
    'documents:send_esign', 'contacts:*', 'tasks:*', 'reports:view', 'reports:export'
  ], 3),
  ('accountant', 'Accountant', 'Full access to accounting, limited access to other modules', ARRAY[
    'accounting:*', 'entities:view', 'entities:create', 'entities:edit',
    'investors:view', 'investors:distributions', 'documents:view', 'documents:upload',
    'contacts:view', 'reports:*'
  ], 4),
  ('project_manager', 'Project Manager', 'Can manage assigned projects and related data', ARRAY[
    'projects:view', 'projects:edit', 'projects:manage_team', 'pipeline:view',
    'accounting:view', 'documents:view', 'documents:upload', 'documents:send_esign',
    'contacts:view', 'contacts:create', 'contacts:edit', 'tasks:*', 'reports:view'
  ], 5),
  ('property_manager', 'Property Manager', 'Can manage properties, inspections, and tenants', ARRAY[
    'properties:*', 'inspections:conduct', 'documents:view', 'documents:upload',
    'contacts:view', 'contacts:create', 'contacts:edit', 'tasks:view', 'tasks:create', 'tasks:edit',
    'reports:view'
  ], 6),
  ('investor_relations', 'Investor Relations', 'Can manage investor communications and reports', ARRAY[
    'investors:*', 'investments:*', 'documents:view', 'documents:upload', 'documents:send_esign',
    'contacts:view', 'contacts:create', 'contacts:edit', 'reports:view', 'reports:export'
  ], 7),
  ('team_member', 'Team Member', 'Standard access to assigned projects and tasks', ARRAY[
    'projects:view', 'pipeline:view', 'documents:view', 'documents:upload',
    'contacts:view', 'tasks:view', 'tasks:create', 'tasks:edit', 'reports:view'
  ], 8),
  ('viewer', 'Viewer', 'Read-only access to permitted areas', ARRAY[
    'projects:view', 'pipeline:view', 'accounting:view', 'entities:view',
    'investors:view', 'investments:view', 'properties:view', 'documents:view',
    'contacts:view', 'tasks:view', 'reports:view'
  ], 9),
  ('external', 'External User', 'Limited access for external partners/contractors', ARRAY[
    'projects:view', 'documents:view', 'tasks:view'
  ], 10)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 7. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_active ON user_profiles(is_active);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

CREATE INDEX IF NOT EXISTS idx_project_team_project ON project_team_members(project_id);
CREATE INDEX IF NOT EXISTS idx_project_team_user ON project_team_members(user_id);

CREATE INDEX IF NOT EXISTS idx_entity_access_entity ON entity_access(entity_id);
CREATE INDEX IF NOT EXISTS idx_entity_access_user ON entity_access(user_id);

CREATE INDEX IF NOT EXISTS idx_permission_audit_actor ON permission_audit_log(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_permission_audit_target ON permission_audit_log(target_user_id);
CREATE INDEX IF NOT EXISTS idx_permission_audit_action ON permission_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_permission_audit_created ON permission_audit_log(created_at DESC);

-- ============================================
-- 8. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE permission_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_definitions ENABLE ROW LEVEL SECURITY;

-- User Profiles: View all, edit own or if admin
CREATE POLICY "View all profiles" ON user_profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Edit own profile" ON user_profiles
  FOR UPDATE TO authenticated USING (id = auth.uid());

CREATE POLICY "Admin manage profiles" ON user_profiles
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

-- User Roles: Admin only for modifications
CREATE POLICY "View roles" ON user_roles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Manage roles" ON user_roles
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

-- Project Team: View if on team or admin
CREATE POLICY "View project team" ON project_team_members
  FOR SELECT TO authenticated USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM project_team_members ptm 
      WHERE ptm.project_id = project_team_members.project_id 
      AND ptm.user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'manager')
    )
  );

CREATE POLICY "Manage project team" ON project_team_members
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM project_team_members ptm 
      WHERE ptm.project_id = project_team_members.project_id 
      AND ptm.user_id = auth.uid()
      AND ptm.project_role IN ('owner', 'manager')
    ) OR
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'manager')
    )
  );

-- Entity Access: Admin only
CREATE POLICY "View entity access" ON entity_access
  FOR SELECT TO authenticated USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin', 'accountant')
    )
  );

CREATE POLICY "Manage entity access" ON entity_access
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

-- Audit Log: Admin view only
CREATE POLICY "View audit log" ON permission_audit_log
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Insert audit log" ON permission_audit_log
  FOR INSERT TO authenticated WITH CHECK (true);

-- Role Definitions: Read-only for all
CREATE POLICY "Read role definitions" ON role_definitions
  FOR SELECT TO authenticated USING (true);

-- ============================================
-- 9. TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_timestamp
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_user_profiles_updated_at();

CREATE TRIGGER update_user_roles_timestamp
  BEFORE UPDATE ON user_roles
  FOR EACH ROW EXECUTE FUNCTION update_user_profiles_updated_at();

-- Auto-create user profile on auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, user_profiles.full_name);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: This trigger should be created on auth.users but requires elevated permissions
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 10. HELPER FUNCTIONS
-- ============================================

-- Check if user has permission
CREATE OR REPLACE FUNCTION user_has_permission(
  p_user_id UUID,
  p_permission TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_role TEXT;
  v_custom_permissions TEXT[];
  v_role_permissions TEXT[];
BEGIN
  -- Get user's role and custom permissions
  SELECT role, custom_permissions 
  INTO v_role, v_custom_permissions
  FROM user_roles 
  WHERE user_id = p_user_id;

  -- Default to team_member if no role
  IF v_role IS NULL THEN
    v_role := 'team_member';
  END IF;

  -- Get role's permissions
  SELECT permissions INTO v_role_permissions
  FROM role_definitions
  WHERE id = v_role;

  -- Check for wildcard
  IF '*' = ANY(v_role_permissions) THEN
    RETURN true;
  END IF;

  -- Check specific permission
  RETURN p_permission = ANY(v_role_permissions) 
      OR p_permission = ANY(v_custom_permissions);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user has any of the permissions
CREATE OR REPLACE FUNCTION user_has_any_permission(
  p_user_id UUID,
  p_permissions TEXT[]
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM unnest(p_permissions) AS perm
    WHERE user_has_permission(p_user_id, perm)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's effective permissions
CREATE OR REPLACE FUNCTION get_user_permissions(p_user_id UUID)
RETURNS TEXT[] AS $$
DECLARE
  v_role TEXT;
  v_custom_permissions TEXT[];
  v_role_permissions TEXT[];
BEGIN
  SELECT role, custom_permissions 
  INTO v_role, v_custom_permissions
  FROM user_roles 
  WHERE user_id = p_user_id;

  IF v_role IS NULL THEN
    v_role := 'team_member';
  END IF;

  SELECT permissions INTO v_role_permissions
  FROM role_definitions
  WHERE id = v_role;

  -- Combine and deduplicate
  RETURN ARRAY(
    SELECT DISTINCT unnest(v_role_permissions || COALESCE(v_custom_permissions, '{}'))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- DONE
-- ============================================
