import React, { useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronDown, ChevronRight, Target,
  FileText, Users, CheckSquare, Building2, Calculator,
  Search, FolderOpen, Mail, Phone, Handshake, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// RESTRUCTURED OPPORTUNITY MODULES:
// Removed: Financials, Pipeline Tracker, Legal Review, Title & Survey
// Added: Offer (track offer to seller)
// Communications: in-person and remote meetings
// Email: linked to project
// Documents: store opportunity docs
const opportunityModules = [
  {
    id: 'overview',
    label: 'OVERVIEW',
    defaultExpanded: true,
    sections: [
      { id: 'basic-info', label: 'Basic Info', icon: FileText },
      { id: 'property-profile', label: 'Property Profile', icon: Building2 },
      { id: 'seller-info', label: 'Seller Info', icon: User },
      { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    ],
  },
  {
    id: 'analysis',
    label: 'ANALYSIS',
    defaultExpanded: true,
    sections: [
      { id: 'deal-analysis', label: 'Deal Analysis', icon: Calculator },
    ],
  },
  {
    id: 'offer',
    label: 'OFFER',
    defaultExpanded: false,
    sections: [
      { id: 'offer-tracking', label: 'Offer Tracking', icon: Handshake },
    ],
  },
  {
    id: 'due-diligence',
    label: 'DUE DILIGENCE',
    defaultExpanded: false,
    sections: [
      { id: 'checklist', label: 'DD Checklist', icon: Search },
      { id: 'inspections', label: 'Inspections', icon: CheckSquare },
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

const mockOpportunityData = {
  1: { name: 'Highland Park Mixed-Use', status: 'qualified', stage: 'Due Diligence' },
  2: { name: 'Riverside Industrial', status: 'new', stage: 'Initial Review' },
  3: { name: 'Downtown Office Building', status: 'offer_submitted', stage: 'Negotiation' },
};

const statusColors = {
  new: 'bg-blue-500',
  qualified: 'bg-emerald-500',
  offer_submitted: 'bg-yellow-500',
  under_contract: 'bg-purple-500',
  closed_won: 'bg-green-500',
  closed_lost: 'bg-red-500',
};

const statusLabels = {
  new: 'New',
  qualified: 'Qualified',
  offer_submitted: 'Offer Submitted',
  under_contract: 'Under Contract',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
};

const OpportunitySidebar = () => {
  const { opportunityId, section, subsection } = useParams();
  const navigate = useNavigate();
  
  const [expandedModules, setExpandedModules] = useState(() => {
    const defaults = opportunityModules.filter(m => m.defaultExpanded).map(m => m.id);
    if (section && !defaults.includes(section)) {
      defaults.push(section);
    }
    return defaults;
  });
  
  const opportunity = mockOpportunityData[opportunityId] || mockOpportunityData[1];

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) ? prev.filter(id => id !== moduleId) : [...prev, moduleId]
    );
  };

  return (
    <div className="w-64 bg-[#1a202c] text-white flex flex-col h-full flex-shrink-0">
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
            <p className="text-xs text-gray-400 uppercase tracking-wide">Opportunity</p>
            <p className="font-semibold truncate">{opportunity.name}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Badge className={cn('text-xs', statusColors[opportunity.status], 'text-white')}>
            {statusLabels[opportunity.status]}
          </Badge>
          <span className="text-xs text-gray-400">{opportunity.stage}</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {opportunityModules.map((module) => {
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
                        to={`/pipeline/opportunity/${opportunityId}/${module.id}/${item.id}`}
                        className={cn(
                          "flex items-center gap-3 px-6 py-2 text-sm transition-colors",
                          isActive 
                            ? "bg-gray-700/50 text-white border-l-2 border-blue-500 pl-[22px]" 
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

export default OpportunitySidebar;
