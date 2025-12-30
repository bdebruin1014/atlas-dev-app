import React, { useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronDown, ChevronRight, Building2,
  LayoutDashboard, FileText, DollarSign, Users, HardHat, 
  Landmark, TrendingUp, FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// Module definitions - Unit Inventory REMOVED from Disposition
const sidebarModules = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    sections: [
      { id: 'basic-info', label: 'Basic Info' },
      { id: 'property-details', label: 'Property Details' },
      { id: 'project-settings', label: 'Project Settings' },
    ]
  },
  {
    id: 'acquisition',
    label: 'Acquisition',
    icon: Landmark,
    sections: [
      { id: 'purchase-contract', label: 'Purchase Contract' },
      { id: 'due-diligence', label: 'Due Diligence' },
      { id: 'title-survey', label: 'Title & Survey' },
      { id: 'closing', label: 'Closing' },
    ]
  },
  {
    id: 'construction',
    label: 'Construction',
    icon: HardHat,
    sections: [
      { id: 'budget', label: 'Budget' },
      { id: 'timeline', label: 'Timeline' },
      { id: 'purchase-orders', label: 'Purchase Orders' },
      { id: 'draws', label: 'Draws' },
      { id: 'change-orders', label: 'Change Orders' },
      { id: 'daily-logs', label: 'Daily Logs' },
      { id: 'inspections', label: 'Inspections' },
      { id: 'warranty', label: 'Warranty' },
    ]
  },
  {
    id: 'disposition',
    label: 'Disposition',
    icon: TrendingUp,
    sections: [
      { id: 'pricing', label: 'Pricing' },
      { id: 'listings', label: 'Listings' },
      { id: 'offers', label: 'Offers' },
      { id: 'sales-contracts', label: 'Sales Contracts' },
      { id: 'closings', label: 'Closings' },
    ]
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: DollarSign,
    sections: [
      { id: 'pro-forma', label: 'Pro Forma' },
      { id: 'loans', label: 'Loans' },
      { id: 'equity', label: 'Equity' },
      { id: 'expenses', label: 'Expenses' },
      { id: 'invoices', label: 'Invoices' },
    ]
  },
  {
    id: 'investors',
    label: 'Investors',
    icon: Users,
    sections: [
      { id: 'investor-list', label: 'Investor List' },
      { id: 'capital-accounts', label: 'Capital Accounts' },
      { id: 'distributions', label: 'Distributions' },
      { id: 'k1-documents', label: 'K-1 Documents' },
    ]
  },
  {
    id: 'documents',
    label: 'Documents & Comms',
    icon: FolderOpen,
    sections: [
      { id: 'documents', label: 'Documents' },
      { id: 'photos', label: 'Photos' },
      { id: 'emails', label: 'Emails' },
      { id: 'notes', label: 'Notes' },
    ]
  },
];

const mockProjects = {
  1: { id: 1, name: 'Watson House', code: 'PRJ-001', entity: 'Watson House LLC', status: 'construction', type: 'Multifamily' },
  2: { id: 2, name: 'Oslo Townhomes', code: 'PRJ-002', entity: 'Oslo Townhomes LLC', status: 'pre_development', type: 'Townhomes' },
  3: { id: 3, name: 'Riverside Commons', code: 'PRJ-003', entity: 'Riverside LLC', status: 'acquisition', type: 'Mixed Use' },
};

const ProjectSidebar = () => {
  const { projectId, module, section } = useParams();
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState(['overview', 'construction']);
  
  const project = mockProjects[projectId] || mockProjects[1];
  const currentModule = module || 'overview';
  const currentSection = section || 'basic-info';

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const statusColors = {
    acquisition: 'bg-blue-500 text-white',
    pre_development: 'bg-purple-500 text-white',
    construction: 'bg-yellow-500 text-black',
    stabilized: 'bg-green-500 text-white',
    disposition: 'bg-orange-500 text-white',
  };

  return (
    <div className="w-64 bg-[#1a202c] border-r border-gray-700 flex flex-col h-full flex-shrink-0">
      <div className="px-4 py-3 border-b border-gray-700 flex-shrink-0">
        <button 
          onClick={() => navigate('/projects')}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wide"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Projects
        </button>
      </div>

      <div className="px-4 py-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">{project.name}</p>
            <p className="text-xs text-gray-400">{project.code} • {project.entity}</p>
          </div>
        </div>
        <div className="mt-3">
          <Badge className={statusColors[project.status] || 'bg-gray-500 text-white'}>
            {project.status.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {sidebarModules.map((mod) => {
          const Icon = mod.icon;
          const isExpanded = expandedModules.includes(mod.id);
          const isActiveModule = currentModule === mod.id;
          
          return (
            <div key={mod.id} className="mb-1">
              <button
                onClick={() => toggleModule(mod.id)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors",
                  isActiveModule 
                    ? "bg-gray-700 text-white font-medium" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{mod.label}</span>
                </div>
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {isExpanded && (
                <div className="ml-4 pl-4 border-l border-gray-600">
                  {mod.sections.map((sec) => {
                    const isActiveSection = isActiveModule && currentSection === sec.id;
                    return (
                      <NavLink
                        key={sec.id}
                        to={`/project/${projectId}/${mod.id}/${sec.id}`}
                        className={cn(
                          "block px-3 py-2 text-sm transition-colors",
                          isActiveSection
                            ? "bg-gray-700 text-white font-medium border-l-2 border-emerald-500 -ml-[1px]"
                            : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                        )}
                      >
                        {sec.label}
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-gray-700 flex-shrink-0">
        <p className="text-xs text-gray-500">{project.type}</p>
      </div>
    </div>
  );
};

export default ProjectSidebar;
