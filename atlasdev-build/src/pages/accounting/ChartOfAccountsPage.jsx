import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Plus, Search, ChevronRight, ChevronDown, BookOpen, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

const mockAccounts = [
  { id: 1, number: '1000', name: 'Assets', type: 'Asset', parent: null, balance: 18000000, children: [
    { id: 11, number: '1100', name: 'Current Assets', type: 'Asset', balance: 3500000, children: [
      { id: 111, number: '1110', name: 'Cash & Cash Equivalents', type: 'Asset', balance: 1250000 },
      { id: 112, number: '1120', name: 'Accounts Receivable', type: 'Asset', balance: 450000 },
      { id: 113, number: '1130', name: 'Prepaid Expenses', type: 'Asset', balance: 125000 },
    ]},
    { id: 12, number: '1200', name: 'Fixed Assets', type: 'Asset', balance: 14500000, children: [
      { id: 121, number: '1210', name: 'Land', type: 'Asset', balance: 4200000 },
      { id: 122, number: '1220', name: 'Buildings', type: 'Asset', balance: 9500000 },
      { id: 123, number: '1230', name: 'Equipment', type: 'Asset', balance: 800000 },
    ]},
  ]},
  { id: 2, number: '2000', name: 'Liabilities', type: 'Liability', parent: null, balance: 14000000, children: [
    { id: 21, number: '2100', name: 'Current Liabilities', type: 'Liability', balance: 850000, children: [
      { id: 211, number: '2110', name: 'Accounts Payable', type: 'Liability', balance: 650000 },
      { id: 212, number: '2120', name: 'Accrued Expenses', type: 'Liability', balance: 200000 },
    ]},
    { id: 22, number: '2200', name: 'Long-term Liabilities', type: 'Liability', balance: 13150000, children: [
      { id: 221, number: '2210', name: 'Construction Loan', type: 'Liability', balance: 10500000 },
      { id: 222, number: '2220', name: 'Notes Payable', type: 'Liability', balance: 2650000 },
    ]},
  ]},
  { id: 3, number: '3000', name: 'Equity', type: 'Equity', parent: null, balance: 4000000, children: [
    { id: 31, number: '3100', name: 'Member Capital', type: 'Equity', balance: 3500000 },
    { id: 32, number: '3200', name: 'Retained Earnings', type: 'Equity', balance: 500000 },
  ]},
  { id: 4, number: '4000', name: 'Revenue', type: 'Revenue', parent: null, balance: 0, children: [
    { id: 41, number: '4100', name: 'Sales Revenue', type: 'Revenue', balance: 0 },
    { id: 42, number: '4200', name: 'Interest Income', type: 'Revenue', balance: 0 },
  ]},
  { id: 5, number: '5000', name: 'Expenses', type: 'Expense', parent: null, balance: 0, children: [
    { id: 51, number: '5100', name: 'Construction Costs', type: 'Expense', balance: 0 },
    { id: 52, number: '5200', name: 'Operating Expenses', type: 'Expense', balance: 0 },
    { id: 53, number: '5300', name: 'Interest Expense', type: 'Expense', balance: 0 },
  ]},
];

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const typeColors = { Asset: 'bg-blue-100 text-blue-800', Liability: 'bg-red-100 text-red-800', Equity: 'bg-green-100 text-green-800', Revenue: 'bg-purple-100 text-purple-800', Expense: 'bg-orange-100 text-orange-800' };

const AccountRow = ({ account, level = 0, expanded, onToggle }) => {
  const hasChildren = account.children && account.children.length > 0;
  const isExpanded = expanded.includes(account.id);
  
  return (
    <>
      <TableRow className="hover:bg-gray-50">
        <TableCell style={{ paddingLeft: `${level * 24 + 16}px` }}>
          <div className="flex items-center gap-2">
            {hasChildren ? (
              <button onClick={() => onToggle(account.id)} className="p-1 hover:bg-gray-200 rounded">
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : <div className="w-6" />}
            <span className="font-mono text-sm text-gray-500">{account.number}</span>
          </div>
        </TableCell>
        <TableCell className={cn("font-medium", level === 0 && "font-semibold")}>{account.name}</TableCell>
        <TableCell><Badge className={typeColors[account.type]}>{account.type}</Badge></TableCell>
        <TableCell className="text-right font-mono">{formatCurrency(account.balance)}</TableCell>
        <TableCell><div className="flex items-center gap-1"><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button></div></TableCell>
      </TableRow>
      {hasChildren && isExpanded && account.children.map(child => (
        <AccountRow key={child.id} account={child} level={level + 1} expanded={expanded} onToggle={onToggle} />
      ))}
    </>
  );
};

const ChartOfAccountsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState([1, 2, 3, 4, 5, 11, 12, 21, 22]);

  const toggleExpand = (id) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <>
      <Helmet><title>Chart of Accounts | Accounting | AtlasDev</title></Helmet>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F7FAFC]">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-2xl font-bold text-gray-900">Chart of Accounts</h1><p className="text-gray-500">Manage your general ledger accounts</p></div>
            <Button className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Add Account</Button>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search accounts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <Button variant="outline" onClick={() => setExpanded([])}>Collapse All</Button>
            <Button variant="outline" onClick={() => setExpanded(mockAccounts.flatMap(a => [a.id, ...(a.children?.map(c => c.id) || [])]))}>Expand All</Button>
          </div>

          <Card>
            <Table>
              <TableHeader><TableRow className="bg-gray-50"><TableHead className="w-48">Account #</TableHead><TableHead>Account Name</TableHead><TableHead className="w-32">Type</TableHead><TableHead className="text-right w-40">Balance</TableHead><TableHead className="w-20"></TableHead></TableRow></TableHeader>
              <TableBody>
                {mockAccounts.map(account => (<AccountRow key={account.id} account={account} expanded={expanded} onToggle={toggleExpand} />))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ChartOfAccountsPage;
