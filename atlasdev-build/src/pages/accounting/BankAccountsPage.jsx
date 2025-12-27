import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Plus, Search, CreditCard, Building, ChevronRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockBankAccounts = [
  { id: 1, entityId: 1, name: 'Operating Account', entity: 'VanRock Holdings LLC', bank: 'First National Bank', accountNumber: '****4567', type: 'Checking', balance: 1250000, lastReconciled: '2024-06-01', status: 'active' },
  { id: 2, entityId: 1, name: 'Reserve Account', entity: 'VanRock Holdings LLC', bank: 'First National Bank', accountNumber: '****7890', type: 'Savings', balance: 500000, lastReconciled: '2024-06-01', status: 'active' },
  { id: 3, entityId: 1, name: 'Payroll Account', entity: 'VanRock Holdings LLC', bank: 'First National Bank', accountNumber: '****2345', type: 'Checking', balance: 85000, lastReconciled: '2024-05-31', status: 'active' },
  { id: 4, entityId: 2, name: 'Operating Account', entity: 'Watson House LLC', bank: 'First National Bank', accountNumber: '****6789', type: 'Checking', balance: 450000, lastReconciled: '2024-06-10', status: 'active' },
  { id: 5, entityId: 2, name: 'Escrow Account', entity: 'Watson House LLC', bank: 'Secure Title Co', accountNumber: '****1234', type: 'Escrow', balance: 125000, lastReconciled: '2024-06-05', status: 'active' },
  { id: 6, entityId: 3, name: 'Operating Account', entity: 'Oslo Townhomes LLC', bank: 'First National Bank', accountNumber: '****5678', type: 'Checking', balance: 185000, lastReconciled: '2024-06-08', status: 'active' },
  { id: 7, entityId: 4, name: 'Main Account', entity: 'Olive Brynn LLC', bank: 'Private Bank', accountNumber: '****9012', type: 'Checking', balance: 2500000, lastReconciled: '2024-06-01', status: 'active' },
  { id: 8, entityId: 5, name: 'Operating Account', entity: 'VanRock Construction LLC', bank: 'First National Bank', accountNumber: '****3456', type: 'Checking', balance: 320000, lastReconciled: '2024-06-12', status: 'active' },
];

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const BankAccountsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');

  const entities = [...new Set(mockBankAccounts.map(a => a.entity))];
  const filteredAccounts = mockBankAccounts.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.bank.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEntity = entityFilter === 'all' || a.entity === entityFilter;
    return matchesSearch && matchesEntity;
  });

  const totalBalance = mockBankAccounts.reduce((a, b) => a + b.balance, 0);

  return (
    <>
      <Helmet><title>Bank Accounts | Accounting | AtlasDev</title></Helmet>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F7FAFC]">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-2xl font-bold text-gray-900">Bank Accounts</h1><p className="text-gray-500">Manage bank accounts across all entities</p></div>
            <Button className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Add Account</Button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Accounts</p><p className="text-2xl font-bold">{mockBankAccounts.length}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Balance</p><p className="text-2xl font-bold text-green-600">{formatCurrency(totalBalance)}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Entities</p><p className="text-2xl font-bold">{entities.length}</p></CardContent></Card>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search accounts..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <Select value={entityFilter} onValueChange={setEntityFilter}><SelectTrigger className="w-64"><SelectValue placeholder="All Entities" /></SelectTrigger><SelectContent><SelectItem value="all">All Entities</SelectItem>{entities.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}</SelectContent></Select>
          </div>

          <Card>
            <Table>
              <TableHeader><TableRow className="bg-gray-50"><TableHead>Account</TableHead><TableHead>Entity</TableHead><TableHead>Bank</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Balance</TableHead><TableHead>Last Reconciled</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredAccounts.map(account => (
                  <TableRow key={account.id} className="cursor-pointer hover:bg-gray-50" onClick={() => navigate(`/accounting/entity/${account.entityId}/bank/${account.id}/register`)}>
                    <TableCell><div className="flex items-center gap-3"><CreditCard className="w-5 h-5 text-gray-400" /><div><p className="font-medium">{account.name}</p><p className="text-xs text-gray-500">{account.accountNumber}</p></div></div></TableCell>
                    <TableCell><div className="flex items-center gap-2"><Building className="w-4 h-4 text-gray-400" />{account.entity}</div></TableCell>
                    <TableCell>{account.bank}</TableCell>
                    <TableCell><Badge variant="outline">{account.type}</Badge></TableCell>
                    <TableCell className="text-right font-semibold text-green-600">{formatCurrency(account.balance)}</TableCell>
                    <TableCell><div className="flex items-center gap-1 text-sm text-gray-500"><RefreshCw className="w-3 h-3" />{formatDate(account.lastReconciled)}</div></TableCell>
                    <TableCell><ChevronRight className="w-4 h-4 text-gray-400" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </>
  );
};

export default BankAccountsPage;
