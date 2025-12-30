import React from 'react';
import { NavLink, useParams, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, BookOpen, CreditCard, Receipt, FileText,
  ArrowLeftRight, DollarSign, BarChart3, Settings, Wallet, PiggyBank,
  GitBranch, CheckSquare, AlertCircle, Clock, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AccountingSidebar = ({ entity }) => {
  const { entityId } = useParams();
  const location = useLocation();

  // Mock pending tasks for this entity
  const pendingTasks = [
    { id: 1, title: 'Reconcile December bank statement', dueDate: '2024-12-31', priority: 'high' },
    { id: 2, title: 'Review Q4 journal entries', dueDate: '2025-01-05', priority: 'medium' },
    { id: 3, title: 'Process vendor invoices', dueDate: '2025-01-02', priority: 'medium' },
  ];

  const menuSections = [
    {
      title: 'Overview',
      items: [
        { label: 'Dashboard', path: `/accounting/${entityId}`, icon: LayoutDashboard, exact: true },
        { label: 'Entity Details', path: `/accounting/${entityId}/details`, icon: Building2 },
        { label: 'Ownership Structure', path: `/accounting/${entityId}/ownership`, icon: GitBranch },
      ]
    },
    {
      title: 'Accounts',
      items: [
        { label: 'Chart of Accounts', path: `/accounting/${entityId}/chart-of-accounts`, icon: BookOpen },
        { label: 'Bank Accounts', path: `/accounting/${entityId}/banking`, icon: CreditCard },
        { label: 'Credit Cards', path: `/accounting/${entityId}/credit-cards`, icon: Wallet },
      ]
    },
    {
      title: 'Transactions',
      items: [
        { label: 'All Transactions', path: `/accounting/${entityId}/transactions`, icon: Receipt },
        { label: 'Journal Entries', path: `/accounting/${entityId}/journal-entries`, icon: FileText },
        { label: 'Reconciliation', path: `/accounting/${entityId}/reconciliation`, icon: CheckSquare },
      ]
    },
    {
      title: 'Payables & Receivables',
      items: [
        { label: 'Invoices', path: `/accounting/${entityId}/invoices`, icon: FileText },
        { label: 'Bills', path: `/accounting/${entityId}/bills`, icon: Receipt },
        { label: 'Payments', path: `/accounting/${entityId}/payments`, icon: DollarSign },
      ]
    },
    {
      title: 'Intercompany',
      items: [
        { label: 'Intercompany Txns', path: `/accounting/${entityId}/intercompany`, icon: ArrowLeftRight },
        { label: 'Due To/From', path: `/accounting/${entityId}/due-to-from`, icon: PiggyBank },
      ]
    },
    {
      title: 'Reports',
      items: [
        { label: 'Financial Statements', path: `/accounting/${entityId}/reports`, icon: BarChart3 },
        { label: 'Trial Balance', path: `/accounting/${entityId}/trial-balance`, icon: FileText },
        { label: 'Cash Flow', path: `/accounting/${entityId}/cash-flow`, icon: DollarSign },
      ]
    },
    {
      title: 'Settings',
      items: [
        { label: 'Entity Settings', path: `/accounting/${entityId}/settings`, icon: Settings },
      ]
    },
  ];

  const formatCurrency = (val) => {
    if (!val) return '$0';
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
    return `$${val.toLocaleString()}`;
  };

  const getTypeConfig = (type) => ({
    holding: { bg: 'bg-purple-500', label: 'Holding' },
    project: { bg: 'bg-blue-500', label: 'Project SPV' },
    operating: { bg: 'bg-green-500', label: 'Operating' },
    investment: { bg: 'bg-amber-500', label: 'Investment' },
  }[type] || { bg: 'bg-gray-500', label: type });

  const typeConfig = getTypeConfig(entity?.type);

  const getPriorityColor = (priority) => ({
    high: 'text-red-500',
    medium: 'text-amber-500',
    low: 'text-blue-500',
  }[priority] || 'text-gray-500');

  return (
    <aside className="w-56 bg-[#1a1a1a] border-r border-gray-800 flex flex-col flex-shrink-0 h-full">
      {/* Entity Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-2">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", typeConfig.bg)}>
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-white text-sm truncate">{entity?.name || 'Loading...'}</h2>
            <span className="text-xs text-gray-400">{typeConfig.label}</span>
          </div>
        </div>
        {entity && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-gray-800 rounded p-2">
              <p className="text-xs text-gray-400">Cash</p>
              <p className="text-sm font-semibold text-white">{formatCurrency(entity.cashBalance)}</p>
            </div>
            <div className="bg-gray-800 rounded p-2">
              <p className="text-xs text-gray-400">YTD P&L</p>
              <p className={cn("text-sm font-semibold", 
                (entity.ytdRevenue - entity.ytdExpenses) >= 0 ? 'text-green-400' : 'text-red-400'
              )}>
                {formatCurrency(entity.ytdRevenue - entity.ytdExpenses)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Entity Tasks Section */}
      <div className="p-3 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-500 uppercase">Entity Tasks</span>
          <button className="p-1 hover:bg-gray-700 rounded">
            <Plus className="w-3 h-3 text-gray-400" />
          </button>
        </div>
        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          {pendingTasks.slice(0, 3).map(task => (
            <div 
              key={task.id} 
              className="flex items-start gap-2 p-1.5 rounded hover:bg-gray-800 cursor-pointer group"
            >
              <div className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0", 
                task.priority === 'high' ? 'bg-red-500' : 
                task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
              )} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-300 truncate group-hover:text-white">{task.title}</p>
                <p className="text-[10px] text-gray-500">{task.dueDate}</p>
              </div>
            </div>
          ))}
        </div>
        <NavLink 
          to={`/accounting/${entityId}/tasks`}
          className="block mt-2 text-xs text-emerald-500 hover:text-emerald-400 text-center"
        >
          View All Tasks →
        </NavLink>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        {menuSections.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="px-3 py-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              {section.title}
            </p>
            {section.items.map((item) => {
              const IconComponent = item.icon;
              const isActive = item.exact 
                ? location.pathname === item.path
                : location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors",
                    isActive 
                      ? "bg-emerald-600 text-white" 
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default AccountingSidebar;
