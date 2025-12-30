import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Landmark, Eye, RefreshCw } from 'lucide-react';

const accounts = [
  { id: 1, name: 'Operating Account', bank: 'Chase Bank', accountNumber: '****4521', balance: 485000, type: 'Checking', lastSync: '2024-11-01' },
  { id: 2, name: 'Reserves Account', bank: 'Chase Bank', accountNumber: '****4522', balance: 250000, type: 'Savings', lastSync: '2024-11-01' },
  { id: 3, name: 'Construction Escrow', bank: 'First National', accountNumber: '****7891', balance: 515000, type: 'Escrow', lastSync: '2024-10-31' },
];

const BankAccountsPage = () => {
  const { entityId } = useParams();
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Bank Accounts</h1>
        <div className="flex gap-2"><Button variant="outline"><RefreshCw className="w-4 h-4 mr-2" />Sync All</Button><Button><Plus className="w-4 h-4 mr-2" />Add Account</Button></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Balance</p><p className="text-2xl font-bold">${accounts.reduce((s, a) => s + a.balance, 0).toLocaleString()}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Accounts</p><p className="text-2xl font-bold">{accounts.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Last Synced</p><p className="text-2xl font-bold">Today</p></CardContent></Card>
      </div>
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>Account Name</TableHead><TableHead>Bank</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Balance</TableHead><TableHead>Last Sync</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {accounts.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><Landmark className="w-4 h-4 text-gray-400" />{a.name}</div></TableCell>
                <TableCell><div><p>{a.bank}</p><p className="text-xs text-gray-500">{a.accountNumber}</p></div></TableCell>
                <TableCell><Badge variant="outline">{a.type}</Badge></TableCell>
                <TableCell className="text-right font-medium">${a.balance.toLocaleString()}</TableCell>
                <TableCell>{a.lastSync}</TableCell>
                <TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default BankAccountsPage;
