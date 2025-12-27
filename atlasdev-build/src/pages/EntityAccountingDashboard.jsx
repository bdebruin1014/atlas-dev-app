import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  ArrowLeft, Settings, Building2, Calendar, 
  FileText, CheckCircle2, AlertCircle, 
  ExternalLink
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useToast } from '@/components/ui/use-toast';
import CheckWriter from '@/components/accounting/CheckWriter';
import LoadingState from '@/components/LoadingState';
import ErrorBoundary from '@/components/ErrorBoundary';

// --- Mock Data ---

const ENTITY_DATA = {
  1: {
    id: 1,
    name: 'AtlasDev',
    type: 'Corporation',
    fiscalYearEnd: 'December 31',
    banks: [
      { id: 1, name: 'Chase Operating', last4: '8821', balance: 245000.50, lastRecon: '2025-10-31', status: 'reconciled' },
      { id: 2, name: 'Chase Payroll', last4: '9912', balance: 55000.00, lastRecon: '2025-10-31', status: 'reconciled' },
      { id: 3, name: 'Construction High-Yield', last4: '1102', balance: 945000.00, lastRecon: '2025-11-15', status: 'pending' },
    ],
    approvals: [
      { id: 101, type: 'Bill', vendor: 'BuildRight Construction', amount: 12500.00, date: '2025-11-25', desc: 'Materials for Project A' },
      { id: 102, type: 'Expense', vendor: 'Sarah Jenkins', amount: 450.25, date: '2025-11-26', desc: 'Travel Reimbursement' },
      { id: 103, type: 'Bill', vendor: 'City Planning', amount: 2500.00, date: '2025-11-24', desc: 'Permit Fees' },
    ],
    activity: [
      { id: 't1', date: '2025-11-27', type: 'Deposit', desc: 'Customer Payment - Unit 404', amount: 45000.00, category: 'Sales' },
      { id: 't2', date: '2025-11-26', type: 'Payment', desc: 'Legal Partners LLP', amount: -2500.00, category: 'Professional Fees' },
      { id: 't3', date: '2025-11-26', type: 'Bill Payment', desc: 'Metro Electric', amount: -1200.00, category: 'Accounts Payable' },
      { id: 't4', date: '2025-11-25', type: 'Transfer', desc: 'To Payroll Account', amount: -15000.00, category: 'Transfer' },
      { id: 't5', date: '2025-11-24', type: 'Card Charge', desc: 'Home Depot', amount: -432.55, category: 'Supplies' },
    ]
  },
  2: {
    id: 2,
    name: 'Sunset Development LLC',
    type: 'LLC',
    fiscalYearEnd: 'December 31',
    banks: [
      { id: 4, name: 'Wells Fargo Construction', last4: '1022', balance: 450000.00, lastRecon: '2025-11-15', status: 'reconciled' }
    ],
    approvals: [],
    activity: [
      { id: 't6', date: '2025-11-20', type: 'Payment', desc: 'Architectural Designs Inc', amount: -5000.00, category: 'Design Fees' },
      { id: 't7', date: '2025-11-18', type: 'Deposit', desc: 'Initial Funding', amount: 500000.00, category: 'Equity' },
    ]
  }
};

const DEFAULT_ENTITY = {
  name: 'Unknown Entity',
  type: 'N/A',
  fiscalYearEnd: 'N/A',
  banks: [],
  approvals: [],
  activity: []
};

const TABS = [
  { id: 'projects', label: 'Projects' },
  { id: 'banking', label: 'Banking' },
  { id: 'bills', label: 'Bills' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'journal', label: 'Journal Entries' },
  { id: 'vendors', label: 'Vendors' },
  { id: 'coa', label: 'Chart of Accounts' },
];

const formatCurrency = (val) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

const formatDate = (dateStr) => 
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const EntityAccountingDashboard = () => {
  const { entityId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('banking');
  const [showCheckWriter, setShowCheckWriter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     setIsLoading(true);
     const timer = setTimeout(() => setIsLoading(false), 500);
     return () => clearTimeout(timer);
  }, [entityId]);

  const entity = ENTITY_DATA[entityId] || { ...DEFAULT_ENTITY, name: `Entity #${entityId}` };

  const handleTabClick = (tabId) => {
    const navRoutes = {
      bills: `/finance/entities/${entityId}/bills`,
      invoices: `/finance/entities/${entityId}/invoices`,
      journal: `/finance/entities/${entityId}/journal-entries`,
      vendors: `/finance/entities/${entityId}/vendors`,
      coa: `/finance/entities/${entityId}/chart-of-accounts`,
      projects: `/accounting/${entityId}/projects`
    };

    if (navRoutes[tabId]) {
      navigate(navRoutes[tabId]);
    } else {
      setActiveTab(tabId);
    }
  };

  if (isLoading) {
     return <LoadingState type="skeleton" />;
  }

  return (
    <ErrorBoundary>
      <Helmet>
        <title>{entity.name} - Accounting | AtlasDev</title>
      </Helmet>

      <div className="flex flex-col h-full w-full bg-[#F7FAFC] overflow-hidden">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200 px-6 py-5 shrink-0">
          <div className="max-w-[1600px] mx-auto">
             {/* Back & Title */}
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                   <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => navigate('/accounting')}
                      className="text-gray-500 hover:text-gray-900 -ml-2"
                   >
                      <ArrowLeft className="w-4 h-4 mr-1" /> Back
                   </Button>
                   <div className="h-6 w-px bg-gray-200"></div>
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700">
                         <Building2 className="w-6 h-6" />
                      </div>
                      <div>
                         <h1 className="text-xl font-bold text-gray-900 leading-none">{entity.name}</h1>
                         <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs text-gray-500 font-medium">{entity.type}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className="text-xs text-gray-500 flex items-center">
                               <Calendar className="w-3 h-3 mr-1" /> FYE: {entity.fiscalYearEnd}
                            </span>
                         </div>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <Button variant="outline" size="sm" onClick={() => setShowCheckWriter(true)}>
                      <FileText className="w-4 h-4 mr-2" /> Write Check
                   </Button>
                   <Button variant="outline" size="sm" onClick={() => navigate('/accounting')}>
                      <Settings className="w-4 h-4 mr-2" /> Entity Settings
                   </Button>
                </div>
             </div>

             {/* Tabs */}
             <div className="flex items-center gap-1 overflow-x-auto no-scrollbar -mb-5 pb-1">
                {TABS.map(tab => (
                   <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={cn(
                         "px-4 py-2 text-sm font-medium border-b-2 transition-all whitespace-nowrap flex items-center",
                         activeTab === tab.id 
                            ? "border-[#2F855A] text-[#2F855A]" 
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                         (tab.id !== 'banking') && "text-emerald-600"
                      )}
                   >
                      {tab.label}
                      {tab.id !== 'banking' && <ExternalLink className="w-3 h-3 ml-1.5 opacity-50" />}
                   </button>
                ))}
             </div>
          </div>
        </div>

        {/* Main Content Scrollable */}
        <div className="flex-1 overflow-y-auto p-6">
           <div className="max-w-[1600px] mx-auto space-y-6">
              
              {/* BANKING TAB (Default View) */}
              {activeTab === 'banking' && (
                 <div className="space-y-6 animate-in fade-in duration-300">
                    
                    {/* Bank Accounts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {entity.banks.map(bank => (
                          <div key={bank.id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                             <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                                   <Building2 className="w-5 h-5" />
                                </div>
                                <Badge variant={bank.status === 'reconciled' ? 'outline' : 'secondary'} className={
                                   bank.status === 'reconciled' ? "text-green-600 border-green-200 bg-green-50" : "text-amber-600 bg-amber-50"
                                }>
                                   {bank.status === 'reconciled' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                                   {bank.status}
                                </Badge>
                             </div>
                             <h3 className="font-semibold text-gray-900">{bank.name}</h3>
                             <p className="text-sm text-gray-500 mb-4">•••• {bank.last4}</p>
                             <div className="flex items-end justify-between">
                                <div>
                                   <p className="text-xs text-gray-400 uppercase font-medium">Available Balance</p>
                                   <p className="text-2xl font-bold text-gray-900 tracking-tight">{formatCurrency(bank.balance)}</p>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                       <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                          <h3 className="font-bold text-gray-900">Recent Banking Activity</h3>
                          <Button variant="ghost" size="sm" className="text-emerald-600">View All</Button>
                       </div>
                       <div className="divide-y divide-gray-100">
                          {entity.activity.map(tx => (
                             <div key={tx.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                                      {formatDate(tx.date).split(' ')[0]}
                                   </div>
                                   <div>
                                      <p className="font-medium text-gray-900">{tx.desc}</p>
                                      <p className="text-sm text-gray-500">{tx.category}</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className={cn(
                                      "font-mono font-medium",
                                      tx.amount > 0 ? "text-emerald-600" : "text-gray-900"
                                   )}>
                                      {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                                   </p>
                                   <p className="text-xs text-gray-400">{tx.type}</p>
                                </div>
                             </div>
                          ))}
                          {entity.activity.length === 0 && (
                             <div className="px-6 py-8 text-center text-gray-500">No recent activity</div>
                          )}
                       </div>
                    </div>
                 </div>
              )}
           </div>
        </div>
        
        {/* Check Writer Modal */}
        <CheckWriter 
          isOpen={showCheckWriter} 
          onClose={() => setShowCheckWriter(false)}
          entityName={entity.name}
        />
      </div>
    </ErrorBoundary>
  );
};

export default EntityAccountingDashboard;