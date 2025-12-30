import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Building2, FolderKanban, Users, Calendar, Settings, DollarSign, 
  Cog, ChevronDown, ClipboardList, CheckSquare, FileText, Layers, Users2, 
  Landmark, Briefcase, BarChart3, Target, TrendingUp, Clock, Building,
  UserCircle, FileSignature, FolderOpen, ClipboardCheck, Wrench, Key, Home as HomeIcon, Shield,
  HardHat, Package, FileCheck, AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TopNavigation = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Projects', path: '/projects', icon: Building2 },
    { label: 'Pipeline', path: '/opportunities', icon: FolderKanban },
    { label: 'Contacts', path: '/contacts', icon: Users },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    
    // Single link to Accounting - goes to entity list
    { label: 'Accounting', path: '/accounting', icon: DollarSign },

    // Construction Management Dropdown
    { 
      label: 'Construction', 
      icon: HardHat,
      dropdown: [
        { label: 'Dashboard', path: '/construction', icon: HardHat, description: 'Construction overview' },
        { label: 'Job Management', path: '', isHeader: true },
        { label: 'Jobs', path: '/construction/jobs', icon: Building2, description: 'Active construction jobs' },
        { label: 'Subcontractors', path: '/construction/subcontractors', icon: Users, description: 'Sub database & COIs' },
        { label: 'Procurement', path: '', isHeader: true },
        { label: 'Purchase Orders', path: '/construction/purchase-orders', icon: Package, description: 'POs & commitments' },
        { label: 'Field Operations', path: '', isHeader: true },
        { label: 'Daily Logs', path: '/construction/daily-logs', icon: FileText, description: 'Field documentation' },
        { label: 'Inspections', path: '/construction/inspections', icon: ClipboardCheck, description: 'Schedule & track' },
        { label: 'Quality', path: '', isHeader: true },
        { label: 'RFIs', path: '/construction/rfis', icon: AlertTriangle, description: 'Requests for info' },
        { label: 'Submittals', path: '/construction/submittals', icon: FileCheck, description: 'Shop drawings & samples' },
      ]
    },

    // Investor Management Dropdown with sections
    { 
      label: 'Investor Mgmt', 
      icon: Landmark,
      dropdown: [
        { label: 'Modules', path: '', isHeader: true },
        { label: 'Investment Management', path: '/investments', icon: Landmark, description: 'Syndication deals & investors' },
        { label: 'Asset Management', path: '/assets', icon: Building, description: 'Real estate assets & operations' },
        { label: 'Family Office', path: '/family-office', icon: Briefcase, description: 'Net worth & holdings' },
        { label: 'Investor Contacts', path: '', isHeader: true },
        { label: 'Investor Directory', path: '/investors/directory', icon: UserCircle, description: 'All investor contacts & accreditation' },
      ]
    },

    // Property Management Dropdown
    { 
      label: 'Property Mgmt', 
      icon: Key,
      dropdown: [
        { label: 'Dashboard', path: '/property-management', icon: HomeIcon, description: 'Property overview' },
        { label: 'Operations', path: '', isHeader: true },
        { label: 'Inspections', path: '/property-management/inspections', icon: ClipboardCheck, description: 'Schedule & conduct inspections' },
        { label: 'Maintenance', path: '/property-management/maintenance', icon: Wrench, description: 'Work orders & repairs' },
        { label: 'Leasing', path: '', isHeader: true },
        { label: 'Properties', path: '/property-management/properties', icon: Building2, description: 'Rental properties' },
        { label: 'Tenants', path: '/property-management/tenants', icon: Users, description: 'Tenant directory' },
        { label: 'Compliance', path: '', isHeader: true },
        { label: 'CAHP Safe Harbor', path: '/cahp', icon: Shield, description: 'Tax abatement compliance' },
      ]
    },

    // Operations Dropdown
    { 
      label: 'Operations', 
      icon: Cog,
      dropdown: [
        { label: 'Dashboard', path: '/operations', icon: ClipboardList },
        { label: 'EOS', path: '/eos', icon: Target },
        { label: 'Tasks', path: '/operations/tasks', icon: CheckSquare },
        { label: 'Teams', path: '/operations/teams', icon: Users2 },
        { label: 'Tools', path: '', isHeader: true },
        { label: 'E-Signatures', path: '/operations/esign', icon: FileSignature, description: 'Send & track documents' },
        { label: 'Document Library', path: '/operations/documents', icon: FolderOpen, description: 'Templates & files' },
        { label: 'Reports', path: '', isHeader: true },
        { label: 'Preset Reports', path: '/reports/preset', icon: BarChart3 },
        { label: 'Custom Reports', path: '/reports/custom', icon: FileText },
        { label: 'Subscribed', path: '/reports/subscribed', icon: Clock },
        { label: 'Report Packages', path: '/reports/packages', icon: Layers },
        { label: 'Trends', path: '/reports/trends', icon: TrendingUp },
      ]
    },

    { label: 'Admin', path: '/admin', icon: Settings },
  ];

  return (
    <header className="h-10 bg-[#1a1a1a] border-b border-gray-800 flex items-center px-4 flex-shrink-0 relative z-50">
      <div className="flex items-center gap-2 mr-6 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-6 h-6 bg-[#047857] rounded flex items-center justify-center">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-bold text-sm">AtlasDev</span>
      </div>
      
      <nav className="flex items-center gap-0.5">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          if (item.dropdown) {
            return (
              <div key={item.label} className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded transition-colors",
                    openDropdown === item.label ? "text-white bg-gray-700" : "text-gray-400 hover:text-white"
                  )}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  {item.label}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {openDropdown === item.label && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setOpenDropdown(null)} />
                    <div className="absolute top-full left-0 mt-1 bg-[#2a2a2a] border border-gray-700 rounded-md shadow-lg py-1 min-w-[260px] z-50 max-h-[70vh] overflow-y-auto">
                      {item.dropdown.map((subItem, idx) => {
                        if (subItem.isHeader) {
                          return (
                            <div key={idx} className="px-3 py-1.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider border-t border-gray-700 mt-1 first:border-0 first:mt-0">
                              {subItem.label}
                            </div>
                          );
                        }
                        const SubIcon = subItem.icon;
                        return (
                          <button
                            key={subItem.path}
                            onClick={() => { navigate(subItem.path); setOpenDropdown(null); }}
                            className="w-full flex items-start gap-3 px-3 py-2 text-left hover:bg-gray-700"
                          >
                            {SubIcon && (
                              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <SubIcon className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-gray-200">{subItem.label}</p>
                              {subItem.description && (
                                <p className="text-xs text-gray-500 mt-0.5">{subItem.description}</p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          }
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded transition-colors",
                isActive ? "text-white bg-[#047857]" : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <IconComponent className="w-3.5 h-3.5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        <button onClick={() => navigate('/settings')} className="text-gray-400 hover:text-white p-1.5">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default TopNavigation;
