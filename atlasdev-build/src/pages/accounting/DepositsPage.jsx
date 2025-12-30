import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye } from 'lucide-react';

const deposits = [
  { id: 1, date: '2024-10-28', description: 'Investor Capital - Smith Trust', amount: 100000, account: 'Operating Account', status: 'deposited' },
  { id: 2, date: '2024-10-15', description: 'Loan Proceeds - First National', amount: 500000, account: 'Construction Escrow', status: 'deposited' },
  { id: 3, date: '2024-10-10', description: 'Earnest Money Refund', amount: 25000, account: 'Operating Account', status: 'pending' },
];

const DepositsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Deposits</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Record Deposit</Button>
    </div>
    <Card>
      <Table>
        <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Account</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>
          {deposits.map((d) => (
            <TableRow key={d.id}>
              <TableCell>{d.date}</TableCell>
              <TableCell className="font-medium">{d.description}</TableCell>
              <TableCell>{d.account}</TableCell>
              <TableCell className="text-right text-emerald-600 font-medium">${d.amount.toLocaleString()}</TableCell>
              <TableCell><Badge className={d.status === 'deposited' ? 'bg-green-500' : 'bg-yellow-500'}>{d.status}</Badge></TableCell>
              <TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

export default DepositsPage;
