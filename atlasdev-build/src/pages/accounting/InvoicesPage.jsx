import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Search, FileText, Send, Eye, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const mockInvoices = [
  { id: 1, invoiceNumber: 'INV-2024-001', date: '2024-06-01', customer: 'Smith Family Trust', entity: 'VanRock Holdings LLC', description: 'Management fee - June 2024', amount: 25000, dueDate: '2024-06-30', status: 'sent' },
  { id: 2, invoiceNumber: 'INV-2024-002', date: '2024-06-01', customer: 'Johnson Investments', entity: 'VanRock Holdings LLC', description: 'Management fee - June 2024', amount: 15000, dueDate: '2024-06-30', status: 'sent' },
  { id: 3, invoiceNumber: 'INV-2024-003', date: '2024-05-15', customer: 'ABC Development Corp', entity: 'VanRock Construction LLC', description: 'Construction services', amount: 85000, dueDate: '2024-06-15', status: 'paid', paidDate: '2024-06-10' },
];

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const InvoicesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const totalOutstanding = mockInvoices.filter(i => i.status !== 'paid').reduce((a, i) => a + i.amount, 0);

  return (
    <>
      <Helmet><title>Invoices | Accounting | AtlasDev</title></Helmet>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F7FAFC]">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-2xl font-bold text-gray-900">Invoices</h1><p className="text-gray-500">Manage accounts receivable</p></div>
            <Button className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> New Invoice</Button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Invoices</p><p className="text-2xl font-bold">{mockInvoices.length}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Outstanding</p><p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalOutstanding)}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Collected</p><p className="text-2xl font-bold text-green-600">{formatCurrency(mockInvoices.filter(i => i.status === 'paid').reduce((a, i) => a + i.amount, 0))}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Draft</p><p className="text-2xl font-bold text-gray-600">{mockInvoices.filter(i => i.status === 'draft').length}</p></CardContent></Card>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search invoices..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
          </div>

          <Card>
            <Table>
              <TableHeader><TableRow className="bg-gray-50"><TableHead>Invoice #</TableHead><TableHead>Date</TableHead><TableHead>Customer</TableHead><TableHead>Entity</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Due Date</TableHead><TableHead>Status</TableHead><TableHead className="w-20"></TableHead></TableRow></TableHeader>
              <TableBody>
                {mockInvoices.map(invoice => (
                  <TableRow key={invoice.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono font-medium">{invoice.invoiceNumber}</TableCell>
                    <TableCell>{formatDate(invoice.date)}</TableCell>
                    <TableCell className="font-medium">{invoice.customer}</TableCell>
                    <TableCell className="text-gray-600">{invoice.entity}</TableCell>
                    <TableCell className="text-gray-600">{invoice.description}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(invoice.amount)}</TableCell>
                    <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                    <TableCell><Badge className={invoice.status === 'paid' ? 'bg-green-100 text-green-800' : invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>{invoice.status}</Badge></TableCell>
                    <TableCell><div className="flex gap-1"><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>{invoice.status === 'draft' && <Button variant="ghost" size="sm"><Send className="w-4 h-4" /></Button>}</div></TableCell>
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

export default InvoicesPage;
