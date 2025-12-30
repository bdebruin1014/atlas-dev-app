import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, Receipt } from 'lucide-react';

const bills = [
  { id: 1, vendor: 'ABC Lumber Co', invoiceNum: 'INV-4521', date: '2024-10-15', dueDate: '2024-11-15', amount: 45000, status: 'paid' },
  { id: 2, vendor: 'Metro Electric Supply', invoiceNum: 'ME-2024-892', date: '2024-10-20', dueDate: '2024-11-20', amount: 28500, status: 'pending' },
  { id: 3, vendor: 'Denver Plumbing', invoiceNum: 'DP-1124', date: '2024-10-25', dueDate: '2024-11-25', amount: 16500, status: 'pending' },
  { id: 4, vendor: 'City of Denver', invoiceNum: 'PERMIT-2024', date: '2024-10-28', dueDate: '2024-10-28', amount: 8500, status: 'paid' },
];

const BillsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Bills</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Add Bill</Button>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Outstanding</p><p className="text-2xl font-bold text-red-600">${bills.filter(b => b.status === 'pending').reduce((s, b) => s + b.amount, 0).toLocaleString()}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Paid (MTD)</p><p className="text-2xl font-bold text-emerald-600">${bills.filter(b => b.status === 'paid').reduce((s, b) => s + b.amount, 0).toLocaleString()}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Bills Count</p><p className="text-2xl font-bold">{bills.length}</p></CardContent></Card>
    </div>
    <Card>
      <Table>
        <TableHeader><TableRow><TableHead>Vendor</TableHead><TableHead>Invoice #</TableHead><TableHead>Date</TableHead><TableHead>Due Date</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>
          {bills.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="font-medium"><div className="flex items-center gap-2"><Receipt className="w-4 h-4 text-gray-400" />{b.vendor}</div></TableCell>
              <TableCell>{b.invoiceNum}</TableCell>
              <TableCell>{b.date}</TableCell>
              <TableCell>{b.dueDate}</TableCell>
              <TableCell className="text-right font-medium">${b.amount.toLocaleString()}</TableCell>
              <TableCell><Badge className={b.status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}>{b.status}</Badge></TableCell>
              <TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

export default BillsPage;
