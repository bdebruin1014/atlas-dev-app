import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, Users } from 'lucide-react';

const accounts = [
  { id: 1, investor: 'Bryan V.', entity: 'Olive Brynn LLC', type: 'GP', contributions: 500000, distributions: 125000, balance: 375000, ownership: 25 },
  { id: 2, investor: 'John Smith', entity: 'Smith Family Trust', type: 'LP', contributions: 400000, distributions: 50000, balance: 350000, ownership: 20 },
  { id: 3, investor: 'Sarah Johnson', entity: 'SJ Investments LLC', type: 'LP', contributions: 300000, distributions: 25000, balance: 275000, ownership: 15 },
  { id: 4, investor: 'Michael Chen', entity: 'Chen Capital Partners', type: 'LP', contributions: 500000, distributions: 75000, balance: 425000, ownership: 25 },
];

const CapitalAccountsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Capital Accounts</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Add Capital</Button>
    </div>
    <div className="grid grid-cols-4 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Contributions</p><p className="text-2xl font-bold">${(accounts.reduce((s, a) => s + a.contributions, 0) / 1000000).toFixed(2)}M</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Distributions</p><p className="text-2xl font-bold text-emerald-600">${(accounts.reduce((s, a) => s + a.distributions, 0) / 1000).toFixed(0)}K</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Current Balance</p><p className="text-2xl font-bold">${(accounts.reduce((s, a) => s + a.balance, 0) / 1000000).toFixed(2)}M</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Investors</p><p className="text-2xl font-bold">{accounts.length}</p></CardContent></Card>
    </div>
    <Card>
      <Table>
        <TableHeader><TableRow><TableHead>Investor</TableHead><TableHead>Entity</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Contributions</TableHead><TableHead className="text-right">Distributions</TableHead><TableHead className="text-right">Balance</TableHead><TableHead className="text-right">Ownership</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>
          {accounts.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="font-medium"><div className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" />{a.investor}</div></TableCell>
              <TableCell>{a.entity}</TableCell>
              <TableCell><Badge variant="outline">{a.type}</Badge></TableCell>
              <TableCell className="text-right">${a.contributions.toLocaleString()}</TableCell>
              <TableCell className="text-right text-emerald-600">${a.distributions.toLocaleString()}</TableCell>
              <TableCell className="text-right font-medium">${a.balance.toLocaleString()}</TableCell>
              <TableCell className="text-right">{a.ownership}%</TableCell>
              <TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

export default CapitalAccountsPage;
