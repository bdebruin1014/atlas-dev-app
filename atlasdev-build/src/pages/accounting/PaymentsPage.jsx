import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, CreditCard } from 'lucide-react';

const payments = [
  { id: 1, date: '2024-10-28', vendor: 'ABC Lumber Co', method: 'Wire', amount: 45000, status: 'completed', reference: 'PAY-001' },
  { id: 2, date: '2024-10-25', vendor: 'City of Denver', method: 'Check', amount: 8500, status: 'completed', reference: 'PAY-002' },
  { id: 3, date: '2024-11-01', vendor: 'Metro Electric Supply', method: 'Wire', amount: 28500, status: 'pending', reference: 'PAY-003' },
];

const PaymentsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Make Payment</Button>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Completed (MTD)</p><p className="text-2xl font-bold text-emerald-600">${payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0).toLocaleString()}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold text-yellow-600">${payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0).toLocaleString()}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Payment Count</p><p className="text-2xl font-bold">{payments.length}</p></CardContent></Card>
    </div>
    <Card>
      <Table>
        <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Reference</TableHead><TableHead>Vendor</TableHead><TableHead>Method</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>
          {payments.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.date}</TableCell>
              <TableCell className="font-medium">{p.reference}</TableCell>
              <TableCell>{p.vendor}</TableCell>
              <TableCell><Badge variant="outline">{p.method}</Badge></TableCell>
              <TableCell className="text-right font-medium">${p.amount.toLocaleString()}</TableCell>
              <TableCell><Badge className={p.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}>{p.status}</Badge></TableCell>
              <TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

export default PaymentsPage;
