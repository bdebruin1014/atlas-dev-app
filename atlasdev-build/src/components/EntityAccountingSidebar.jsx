import React, { useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, ChevronDown, ChevronRight, Building2,
  LayoutDashboard, CreditCard, BookOpen, Receipt, DollarSign,
  FileText, Users, BarChart3, RefreshCw, Landmark
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const sidebarModules = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    path: '',
  },
  {
    id: 'banking',
    label: 'Banking',
    icon: Landmark,
    sections: [
      { id: 'bank-accounts', label: 'Bank Accounts', path: '/bank-accounts' },
      { id: 'register', label: 'Register', path: '/register' },
      { id: 'reconciliation', label: 'Reconciliation', path: '/reconciliation' },
      { id: 'deposits', label: 'Deposits', path: '/deposits' },
      { id: 'wire-tracking', label: 'Wire Tracking', path: '/wire-tracking' },
    ]
  },
  {
    id: 'transactions',
    label: 'Transactions',
    icon: Receipt,
    sections: [
      { id: 'bills', label: 'Bills', path: '/bills' },
      { id: 'payments', label: 'Payments', path: '/payments' },
      { id: 'invoices', label: 'Invoices', path: '/invoices' },
      { id: 'journal-entries', label: 'Journal Entries', path: '/journal-entries' },
    ]
  },
  {
    id: 'capital',
    label: 'Capital & Investors',
    icon: Users,
    sections: [
      { id: 'capital-accounts', label: 'Capital Accounts', path: '/capital' },
      { id: 'distributions', label: 'Distributions', path: '/distributions' },
      { id: 'k1-documents', label: 'K-1 Documents', path: '/k1-documents' },
    ]
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    sections: [
      { id: 'financial-reports', label: 'Financial Reports', path: '/reports' },
      { id: 'trial-balance', label: 'Trial Balance', path: '/trial-balance' },
      { id: 'chart-of-accounts', label: 'Chart of Accounts', path: '/chart-of-accounts' },
    ]
  },
];

const mockEntities = {
  1: { id: 1, name: 'VanRock Holdings LLC', code: 'VRH', type: 'Holding Company', status: 'active', balance: 1250000 },
  2: { id: 2, name: 'Watson House LLC', code: 'WH', type: 'Project Entity', status: 'active', balance: 485000 },
  3: { id: 3, name: 'Oslo Townhomes LLC', code: 'OT', type: 'Project Entity', status: 'active', balance: 325000 },
};

const EntityAccountingSidebar = () => {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState(['banking', 'transactions']);
  
  const entity = mockEntities[entityId] || mockEntities[1];

  const toggleModule = (moduleId) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const basePath = `/accounting/entities/${entityId}`;

  return (
    <div className="w-64 bg-[#1a202c] border-r border-gray-700 flex flex-col h-full flex-shrink-0">
      <div className="px-4 py-3 border-b border-gray-700 flex-shrink-0">
        <button 
          onClick={() => navigate('/accounting/entities')}
          className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wide"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Entities
        </button>
      </div>

      <div className="px-4 py-4 border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">{entity.name}</p>
            <p className="text-xs text-gray-400">{entity.type}</p>
          </div>
        </div>
        <div className="mt-3">
          <Badge className="bg-emerald-600 text-white">{entity.status}</Badge>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {sidebarModules.map((mod) => {
          const Icon = mod.icon;
          const isExpanded = expandedModules.includes(mod.id);
          const hasSubsections = mod.sections && mod.sections.length > 0;
          
          if (!hasSubsections) {
            return (
              <NavLink
                key={mod.id}
                to={`${basePath}${mod.path}`}
                end
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                  isActive 
                    ? "bg-gray-700 text-white font-medium border-l-2 border-emerald-500" 
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{mod.label}</span>
              </NavLink>
            );
          }
          
          return (
            <div key={mod.id} className="mb-1">
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{mod.label}</span>
                </div>
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>

              {isExpanded && (
                <div className="ml-4 pl-4 border-l border-gray-600">
                  {mod.sections.map((sec) => (
                    <NavLink
                      key={sec.id}
                      to={`${basePath}${sec.path}`}
                      className={({ isActive }) => cn(
                        "block px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-gray-700 text-white font-medium border-l-2 border-emerald-500 -ml-[1px]"
                          : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                      )}
                    >
                      {sec.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-gray-700 flex-shrink-0">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <p className="text-gray-500">Balance</p>
            <p className="text-white font-medium">${entity.balance.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">This Month</p>
            <p className="text-emerald-400 font-medium">+$85,000</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityAccountingSidebar;
