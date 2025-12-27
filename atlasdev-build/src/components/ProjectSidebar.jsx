import React, { useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronDown, ChevronRight, Building2,
  FileText, Users, CheckSquare, Search, Calculator,
  TrendingUp, Calendar, DollarSign, Receipt, ClipboardList, 
  Home, Shield, PieChart, BarChart3, Wallet, FolderOpen, 
  Mail, MessageSquare, Landmark, Scale, Package, ClipboardCheck,
  Handshake, FileSignature, Key, Phone, Video
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// RESTRUCTURED PROJECT MODULES:
// - Warranty moved to Construction
// - Disposition: Sales (offers), Sales Contract (signed), Closing (docs/timeline/tasks)
// - Contracts renamed to Purchase Orders
// - Inspections: templated checklist by project type/jurisdiction
// - Actuals: expenses against budget
// - Expenses: record/pay project expenses
// - Revenue: track sales/revenue
// - Communications: calls, meetings, notes, follow-ups
// - Email: Outlook/Gmail integration
const projectModules = [
  {
    id: 'overview',
    label: 'OVERVIEW',
    defaultExpanded: true,
    sections: [
      { id: 'basic-info', label: 'Basic Info', icon: FileText },
      { id: 'property-profile', label: 'Property Profile', icon: Building2 },
      { id: 'contacts', label: 'Contacts', icon: Users },
      { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    ],
  },
  {
    id: 'acquisition',
    label: 'ACQUISITION',
    defaultExpanded: false,
    sections: [
      { id: 'deal-analysis', label: 'Deal Analysis', icon: Calculator },
      { id: 'pipeline-tracker', label: 'Pipeline Tracker', icon: TrendingUp },
      { id: 'due-diligence', label: 'Due Diligence', icon: Search },
      { id: 'legal', label: 'Legal', icon: Scale },
    ],
  },
  {
    id: 'construction',
    label: 'CONSTRUCTION',
    defaultExpanded: true,
    sections: [
      { id: 'plans-permits', label: 'Plans & Permits', icon: ClipboardList },
      { id: 'schedule', label: 'Schedule', icon: Calendar },
      { id: 'budget', label: 'Budget', icon: DollarSign },
      { id: 'draws', label: 'Draws', icon: Receipt },
      { id: 'purchase-orders', label: 'Purchase Orders', icon: Package },
      { id: 'inspections', label: 'Inspections', icon: ClipboardCheck },
      { id: 'warranty', label: 'Warranty', icon: Shield },
    ],
  },
  {
    id: 'disposition',
    label: 'DISPOSITION',
    defaultExpanded: false,
    sections: [
      { id: 'sales', label: 'Sales & Offers', icon: Handshake },
      { id: 'sales-contracts', label: 'Sales Contracts', icon: FileSignature },
      { id: 'closing', label: 'Closing', icon: Key },
    ],
  },
  {
    id: 'finance',
    label: 'FINANCE',
    defaultExpanded: false,
    sections: [
      { id: 'loans', label: 'Loans', icon: Landmark },
      { id: 'proforma', label: 'Pro Forma', icon: PieChart },
      { id: 'actuals', label: 'Actuals vs Budget', icon: BarChart3 },
      { id: 'expenses', label: 'Expenses', icon: Receipt },
      { id: 'revenue', label: 'Revenue', icon: Wallet },
    ],
  },
  {
    id: 'investors',
    label: 'INVESTORS',
    defaultExpanded: false,
    sections: [
      { id: 'investors-list', label: 'Investors', icon: Users },
      { id: 'investments', label: 'Investments', icon: DollarSign },
      { id: 'distributions', label: 'Distributions', icon: Wallet },
    ],
  },
  {
    id: 'documents',
    label: 'DOCUMENTS & COMMS',
    defaultExpanded: false,
    sections: [
      { id: 'all-documents', label: 'Documents', icon: FolderOpen },
      { id: 'communications', label: 'Communications', icon: Phone },
      { id: 'email', label: 'Email', icon: Mail },
    ],
  },
];

const mockProjectData = {
  1: { name: 'Watson House', code: 'PRJ-001', status: 'construction' },
  2: { name: 'Oslo Townhomes', code: 'PRJ-002', status: 'pre_development' },
  3: { name: 'Cedar Mill Apartments', code: 'PRJ-003', status: 'acquisition' },
  4: { name: 'Pine Valley Lots', code: 'PRJ-004', status: 'construction' },
};

const statusColors = {
  acquisition: 'bg-blue-500',
  pre_development: 'bg-purple-500',
  construction: 'bg-yellow-500',
  stabilized: 'bg-green-500',
};

const statusLabels = {
  acquisition: 'Acquisition',
  pre_development: 'Pre-Development',
  construction: 'Construction',
  stabilized: 'Stabilized',
};

const ProjectSidebar = () => {
  const { projectId, section, subsection } = useParams();
  const navigate = useNavigate();
  
  const [expandedModules, setExpandedModules] = useState(() => {
    const defaults = projectModules.filter(m => m.defaultExpanded).map(m => m.id);
    if (section && !defaults.includes(section)) {
      defaults.push(section);
    }
    return defaults;
  });
  
  const project = mockProjectData[projectId] || mockProjectData[1];

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  return (
    <div className="w-64 bg-[#1a202c] text-white flex flex-col h-full flex-shrink-0">
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
            <p className="text-xs text-gray-400 uppercase tracking-wide">Project</p>
            <p className="font-semibold truncate">{project.name}</p>
          </div>
        </div>
        <div className="mt-3">
          <Badge className={cn('text-xs', statusColors[project.status], 'text-white')}>
            {statusLabels[project.status]}
          </Badge>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {projectModules.map((module) => {
          const isExpanded = expandedModules.includes(module.id);
          const isActiveModule = section === module.id;
          
          return (
            <div key={module.id} className="mb-1">
              <button
                onClick={() => toggleModule(module.id)}
                className={cn(
                  "w-full px-4 py-2 flex items-center justify-between text-xs font-semibold tracking-wide transition-colors",
                  isActiveModule ? "text-white" : "text-gray-400 hover:text-gray-200"
                )}
              >
                <span>{module.label}</span>
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {isExpanded && (
                <div className="space-y-0.5 pb-2">
                  {module.sections.map((item) => {
                    const Icon = item.icon;
                    const isActive = section === module.id && subsection === item.id;
                    
                    return (
                      <NavLink
                        key={item.id}
                        to={`/project/${projectId}/${module.id}/${item.id}`}
                        className={cn(
                          "flex items-center gap-3 px-6 py-2 text-sm transition-colors",
                          isActive 
                            ? "bg-gray-700/50 text-white border-l-2 border-emerald-500 pl-[22px]" 
                            : "text-gray-400 hover:bg-gray-800/50 hover:text-white border-l-2 border-transparent pl-[22px]"
                        )}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
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
        <p className="text-xs text-gray-500">AtlasDev v1.0</p>
      </div>
    </div>
  );
};

export default ProjectSidebar;
