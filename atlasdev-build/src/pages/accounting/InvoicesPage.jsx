import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, FileText, Send } from 'lucide-react';

const invoices = [
  { id: 1, number: 'INV-2024-001', customer: 'Smith Family Trust', date: '2024-10-01', dueDate: '2024-10-31', amount: 25000, status: 'paid' },
  { id: 2, number: 'INV-2024-002', customer: 'Chen Capital Partners', date: '2024-10-15', dueDate: '2024-11-15', amount: 18500, status: 'sent' },
  { id: 3, number: 'INV-2024-003', customer: 'Davis Holdings LLC', date: '2024-11-01', dueDate: '2024-12-01', amount: 12000, status: 'draft' },
];

const InvoicesPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Create Invoice</Button>
    </div>
    <div className="grid grid-cols-4 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Outstanding</p><p className="text-2xl font-bold">${invoices.filter(i => i.status !== 'paid').reduce((s, i) => s + i.amount, 0).toLocaleString()}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Paid</p><p className="text-2xl font-bold text-emerald-600">${invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0).toLocaleString()}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Sent</p><p className="text-2xl font-bold text-blue-600">{invoices.filter(i => i.status === 'sent').length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Draft</p><p className="text-2xl font-bold text-gray-500">{invoices.filter(i => i.status === 'draft').length}</p></CardContent></Card>
    </div>
    <Card>
      <Table>
        <TableHeader><TableRow><TableHead>Invoice #</TableHead><TableHead>Customer</TableHead><TableHead>Date</TableHead><TableHead>Due Date</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-medium"><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" />{inv.number}</div></TableCell>
              <TableCell>{inv.customer}</TableCell>
              <TableCell>{inv.date}</TableCell>
              <TableCell>{inv.dueDate}</TableCell>
              <TableCell className="text-right font-medium">${inv.amount.toLocaleString()}</TableCell>
              <TableCell><Badge className={inv.status === 'paid' ? 'bg-green-500' : inv.status === 'sent' ? 'bg-blue-500' : 'bg-gray-400'}>{inv.status}</Badge></TableCell>
              <TableCell><div className="flex gap-1">{inv.status === 'draft' && <Button variant="ghost" size="sm"><Send className="w-4 h-4" /></Button>}<Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></div></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

export default InvoicesPage;
