import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Search, DollarSign, Check, Clock, Eye, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockPayments = [
  { id: 1, paymentNumber: 'PMT-2024-0089', date: '2024-06-14', vendor: 'City Electric', entity: 'Watson House LLC', method: 'ACH', amount: 32000, bills: ['INV-2024-0153'], status: 'completed' },
  { id: 2, paymentNumber: 'PMT-2024-0088', date: '2024-06-08', vendor: 'Greenville County', entity: 'Watson House LLC', method: 'Check', amount: 8500, bills: ['INV-2024-0151'], status: 'completed' },
  { id: 3, paymentNumber: 'PMT-2024-0087', date: '2024-06-05', vendor: 'BuildRight Construction', entity: 'Watson House LLC', method: 'Wire', amount: 380000, bills: ['INV-2024-0148'], status: 'completed' },
  { id: 4, paymentNumber: 'PMT-2024-0090', date: '2024-06-18', vendor: 'ABC Lumber Supply', entity: 'Watson House LLC', method: 'ACH', amount: 28500, bills: ['INV-2024-0155'], status: 'scheduled' },
];

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const PaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <Helmet><title>Payments | Accounting | AtlasDev</title></Helmet>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F7FAFC]">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-2xl font-bold text-gray-900">Payments</h1><p className="text-gray-500">Track all outgoing payments</p></div>
            <Button className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> New Payment</Button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Payments</p><p className="text-2xl font-bold">{mockPayments.length}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Completed</p><p className="text-2xl font-bold text-green-600">{formatCurrency(mockPayments.filter(p => p.status === 'completed').reduce((a, p) => a + p.amount, 0))}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Scheduled</p><p className="text-2xl font-bold text-blue-600">{formatCurrency(mockPayments.filter(p => p.status === 'scheduled').reduce((a, p) => a + p.amount, 0))}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">This Month</p><p className="text-2xl font-bold">{formatCurrency(mockPayments.reduce((a, p) => a + p.amount, 0))}</p></CardContent></Card>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search payments..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
          </div>

          <Card>
            <Table>
              <TableHeader><TableRow className="bg-gray-50"><TableHead>Payment #</TableHead><TableHead>Date</TableHead><TableHead>Vendor</TableHead><TableHead>Entity</TableHead><TableHead>Method</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Bills</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {mockPayments.map(payment => (
                  <TableRow key={payment.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono font-medium">{payment.paymentNumber}</TableCell>
                    <TableCell>{formatDate(payment.date)}</TableCell>
                    <TableCell className="font-medium">{payment.vendor}</TableCell>
                    <TableCell className="text-gray-600">{payment.entity}</TableCell>
                    <TableCell><Badge variant="outline">{payment.method}</Badge></TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(payment.amount)}</TableCell>
                    <TableCell className="text-gray-600">{payment.bills.join(', ')}</TableCell>
                    <TableCell><Badge className={payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>{payment.status}</Badge></TableCell>
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

export default PaymentsPage;
