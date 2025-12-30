import React, { useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronDown, ChevronRight, Target,
  LayoutDashboard, DollarSign, Search, Calculator, FolderOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const sidebarModules = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    sections: [
      { id: 'basic-info', label: 'Basic Info' },
      { id: 'property-details', label: 'Property Details' },
      { id: 'location', label: 'Location & Maps' },
    ]
  },
  {
    id: 'analysis',
    label: 'Analysis',
    icon: Calculator,
    sections: [
      { id: 'financial-analysis', label: 'Financial Analysis' },
      { id: 'comparable-sales', label: 'Comparable Sales' },
      { id: 'market-research', label: 'Market Research' },
    ]
  },
  {
    id: 'offers',
    label: 'Offer Tracking',
    icon: DollarSign,
    sections: [
      { id: 'offer-history', label: 'Offer History' },
      { id: 'current-offer', label: 'Current Offer' },
      { id: 'counter-offers', label: 'Counter Offers' },
    ]
  },
  {
    id: 'due-diligence',
    label: 'Due Diligence',
    icon: Search,
    sections: [
      { id: 'checklist', label: 'DD Checklist' },
      { id: 'inspections', label: 'Inspections' },
      { id: 'environmental', label: 'Environmental' },
      { id: 'zoning', label: 'Zoning & Permits' },
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

const mockOpportunities = {
  1: { id: 1, name: 'Riverside Commons', code: 'OPP-001', status: 'analysis', type: 'Multifamily', askingPrice: 2500000 },
  2: { id: 2, name: 'Maple Street Lots', code: 'OPP-002', status: 'due_diligence', type: 'Land', askingPrice: 850000 },
  3: { id: 3, name: 'Downtown Mixed Use', code: 'OPP-003', status: 'offer', type: 'Mixed Use', askingPrice: 4200000 },
};

const OpportunitySidebar = () => {
  const { opportunityId, module, section } = useParams();
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState(['overview', 'analysis']);
  
  const opportunity = mockOpportunities[opportunityId] || mockOpportunities[1];
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
    lead: 'bg-gray-500 text-white',
    analysis: 'bg-blue-500 text-white',
    offer: 'bg-purple-500 text-white',
    due_diligence: 'bg-yellow-500 text-black',
    under_contract: 'bg-green-500 text-white',
    closed: 'bg-emerald-600 text-white',
    dead: 'bg-red-500 text-white',
  };

  return (
    <div className="w-64 bg-[#1a202c] border-r border-gray-700 flex flex-col h-full flex-shrink-0">
      <div className="px-4 py-3 border-b border-gray-700 flex-shrink-0">
        <button 
          onClick={() => navigate('/pipeline')}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wide"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Pipeline
        </button>
      </div>

      <div className="px-4 py-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">{opportunity.name}</p>
            <p className="text-xs text-gray-400">{opportunity.code}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Badge className={statusColors[opportunity.status]}>
            {opportunity.status.replace('_', ' ')}
          </Badge>
          <Badge variant="outline" className="border-gray-600 text-gray-300">{opportunity.type}</Badge>
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
                        to={`/pipeline/${opportunityId}/${mod.id}/${sec.id}`}
                        className={cn(
                          "block px-3 py-2 text-sm transition-colors",
                          isActiveSection
                            ? "bg-gray-700 text-white font-medium border-l-2 border-blue-500 -ml-[1px]"
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
        <p className="text-xs text-gray-500">Asking: ${(opportunity.askingPrice / 1000000).toFixed(2)}M</p>
      </div>
    </div>
  );
};

export default OpportunitySidebar;
