import React from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, List, Landmark, RefreshCw, Layers, BarChart3, 
  FileText, CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';

const bankAccountSections = [
  { id: 'register', label: 'Register', icon: List },
  { id: 'banking', label: 'Banking', icon: Landmark },
  { id: 'reconciliation', label: 'Reconciliation', icon: RefreshCw },
  { id: 'aggregate-payments', label: 'Aggregate Payments', icon: Layers },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'invoices', label: 'Invoices', icon: FileText },
];

const mockBankAccounts = {
  1: { name: 'Operating Account', bank: 'First National Bank', accountNumber: '****4567', balance: 1250000 },
  2: { name: 'Payroll Account', bank: 'First National Bank', accountNumber: '****7890', balance: 85000 },
  3: { name: 'Escrow Account', bank: 'Secure Title Co', accountNumber: '****2345', balance: 450000 },
};

const BankAccountSidebar = () => {
  const { entityId, accountId, section } = useParams();
  const navigate = useNavigate();
  
  const account = mockBankAccounts[accountId] || mockBankAccounts[1];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      minimumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0">
      {/* Back Navigation */}
      <div className="px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <button 
          onClick={() => navigate(`/accounting/entity/${entityId}`)}
          className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-wide"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Entity
        </button>
      </div>

      {/* Account Info */}
      <div className="px-4 py-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate">{account.name}</p>
            <p className="text-xs text-gray-500">{account.bank}</p>
          </div>
        </div>
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 uppercase">Current Balance</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(account.balance)}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {bankAccountSections.map((item) => {
          const Icon = item.icon;
          const isActive = section === item.id;
          
          return (
            <NavLink
              key={item.id}
              to={`/accounting/entity/${entityId}/bank/${accountId}/${item.id}`}
              className={cn(
                "flex items-center gap-3 px-4 py-3 text-sm transition-colors",
                isActive 
                  ? "bg-emerald-50 text-emerald-700 border-r-2 border-emerald-600 font-medium" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 flex-shrink-0">
        <p className="text-xs text-gray-400">{account.accountNumber}</p>
      </div>
    </div>
  );
};

export default BankAccountSidebar;
