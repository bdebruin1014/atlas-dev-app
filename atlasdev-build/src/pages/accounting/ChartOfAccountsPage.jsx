import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit } from 'lucide-react';

const accounts = [
  { id: 1, number: '1000', name: 'Cash - Operating', type: 'Asset', subtype: 'Current Asset', balance: 485000 },
  { id: 2, number: '1010', name: 'Cash - Reserves', type: 'Asset', subtype: 'Current Asset', balance: 250000 },
  { id: 3, number: '1100', name: 'Accounts Receivable', type: 'Asset', subtype: 'Current Asset', balance: 45000 },
  { id: 4, number: '1500', name: 'Construction in Progress', type: 'Asset', subtype: 'Fixed Asset', balance: 1850000 },
  { id: 5, number: '2000', name: 'Accounts Payable', type: 'Liability', subtype: 'Current Liability', balance: 85000 },
  { id: 6, number: '2500', name: 'Notes Payable', type: 'Liability', subtype: 'Long-term Liability', balance: 1500000 },
  { id: 7, number: '3000', name: 'Members Equity', type: 'Equity', subtype: 'Equity', balance: 1200000 },
  { id: 8, number: '4000', name: 'Revenue', type: 'Revenue', subtype: 'Operating Revenue', balance: 450000 },
  { id: 9, number: '5000', name: 'Cost of Goods Sold', type: 'Expense', subtype: 'Direct Cost', balance: 285000 },
];

const ChartOfAccountsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Chart of Accounts</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Add Account</Button>
    </div>
    <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search accounts..." className="pl-9" /></div>
    <Card>
      <Table>
        <TableHeader><TableRow><TableHead>Number</TableHead><TableHead>Account Name</TableHead><TableHead>Type</TableHead><TableHead>Subtype</TableHead><TableHead className="text-right">Balance</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>
          {accounts.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-mono">{a.number}</TableCell>
              <TableCell className="font-medium">{a.name}</TableCell>
              <TableCell><Badge variant="outline" className={
                a.type === 'Asset' ? 'border-blue-500 text-blue-700' :
                a.type === 'Liability' ? 'border-red-500 text-red-700' :
                a.type === 'Equity' ? 'border-purple-500 text-purple-700' :
                a.type === 'Revenue' ? 'border-emerald-500 text-emerald-700' : 'border-yellow-500 text-yellow-700'
              }>{a.type}</Badge></TableCell>
              <TableCell className="text-gray-500">{a.subtype}</TableCell>
              <TableCell className="text-right font-medium">${a.balance.toLocaleString()}</TableCell>
              <TableCell><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

export default ChartOfAccountsPage;
