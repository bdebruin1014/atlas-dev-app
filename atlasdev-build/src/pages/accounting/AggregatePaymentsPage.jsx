import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Clock, CheckCircle, DollarSign, Calendar, Download, Eye, Filter, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);
const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// Pending Payments
const mockPendingPayments = [
  { id: 1, paymentRef: 'AGG-2024-0045', payee: 'BuildRight Construction', itemCount: 3, totalAmount: 525000.00, createdDate: '2024-06-18', scheduledDate: '2024-06-20', status: 'ready', entity: 'Watson House LLC' },
  { id: 2, paymentRef: 'AGG-2024-0046', payee: 'ABC Lumber Supply', itemCount: 5, totalAmount: 45000.00, createdDate: '2024-06-18', scheduledDate: '2024-06-21', status: 'pending_approval', entity: 'Watson House LLC' },
  { id: 3, paymentRef: 'AGG-2024-0047', payee: 'Elite HVAC Systems', itemCount: 2, totalAmount: 68000.00, createdDate: '2024-06-19', scheduledDate: '2024-06-22', status: 'pending_approval', entity: 'Oslo Townhomes LLC' },
  { id: 4, paymentRef: 'AGG-2024-0048', payee: 'City Electric', itemCount: 4, totalAmount: 89000.00, createdDate: '2024-06-19', scheduledDate: '2024-06-23', status: 'ready', entity: 'Watson House LLC' },
];

// Disbursed Payments
const mockDisbursedPayments = [
  { id: 1, paymentRef: 'AGG-2024-0040', payee: 'BuildRight Construction', itemCount: 4, totalAmount: 450000.00, disbursedDate: '2024-06-15', method: 'Wire', confirmationNo: 'WR-2024-0089', entity: 'Watson House LLC' },
  { id: 2, paymentRef: 'AGG-2024-0039', payee: 'Modern Plumbing Co', itemCount: 2, totalAmount: 55000.00, disbursedDate: '2024-06-14', method: 'ACH', confirmationNo: 'ACH-78944', entity: 'Watson House LLC' },
  { id: 3, paymentRef: 'AGG-2024-0038', payee: 'ABC Lumber Supply', itemCount: 3, totalAmount: 28500.00, disbursedDate: '2024-06-14', method: 'Check', confirmationNo: 'CHK-1045', entity: 'Watson House LLC' },
  { id: 4, paymentRef: 'AGG-2024-0037', payee: 'Greenville County', itemCount: 1, totalAmount: 8500.00, disbursedDate: '2024-06-08', method: 'Check', confirmationNo: 'CHK-1044', entity: 'Watson House LLC' },
  { id: 5, paymentRef: 'AGG-2024-0036', payee: 'State Farm Insurance', itemCount: 1, totalAmount: 15000.00, disbursedDate: '2024-06-01', method: 'ACH', confirmationNo: 'ACH-78940', entity: 'Watson House LLC' },
  { id: 6, paymentRef: 'AGG-2024-0035', payee: 'Modern Design Studio', itemCount: 2, totalAmount: 12500.00, disbursedDate: '2024-05-28', method: 'ACH', confirmationNo: 'ACH-78935', entity: 'Oslo Townhomes LLC' },
];

const AggregatePaymentsPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const totalPending = mockPendingPayments.reduce((a, p) => a + p.totalAmount, 0);
  const totalDisbursed = mockDisbursedPayments.reduce((a, p) => a + p.totalAmount, 0);
  const readyToDisburse = mockPendingPayments.filter(p => p.status === 'ready').reduce((a, p) => a + p.totalAmount, 0);

  return (
    <>
      <Helmet><title>Aggregate Payments | AtlasDev</title></Helmet>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F7FAFC]">
        <div className="bg-white border-b px-6 py-4">
          <h1 className="text-xl font-bold">Aggregate Payments</h1>
          <p className="text-sm text-gray-500">Manage grouped payments and disbursements</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Pending Payments</p><p className="text-2xl font-bold text-yellow-600">{mockPendingPayments.length}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Pending</p><p className="text-2xl font-bold">{formatCurrency(totalPending)}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Ready to Disburse</p><p className="text-2xl font-bold text-green-600">{formatCurrency(readyToDisburse)}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Disbursed This Month</p><p className="text-2xl font-bold text-blue-600">{formatCurrency(totalDisbursed)}</p></CardContent></Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList><TabsTrigger value="pending" className="gap-2"><Clock className="w-4 h-4" /> Pending Payments</TabsTrigger><TabsTrigger value="disbursed" className="gap-2"><CheckCircle className="w-4 h-4" /> Disbursed Payments</TabsTrigger></TabsList>
              <div className="flex gap-2">
                {activeTab === 'pending' && selectedPayments.length > 0 && <Button className="bg-[#2F855A] hover:bg-[#276749]"><DollarSign className="w-4 h-4 mr-2" /> Disburse Selected ({selectedPayments.length})</Button>}
                <Button variant="outline"><Download className="w-4 h-4 mr-2" /> Export</Button>
              </div>
            </div>

            <TabsContent value="pending" className="m-0">
              <Card>
                <Table>
                  <TableHeader><TableRow className="bg-gray-50"><TableHead className="w-10"><Checkbox checked={selectedPayments.length === mockPendingPayments.filter(p => p.status === 'ready').length} onCheckedChange={(c) => c ? setSelectedPayments(mockPendingPayments.filter(p => p.status === 'ready').map(p => p.id)) : setSelectedPayments([])} /></TableHead><TableHead>Payment Ref</TableHead><TableHead>Payee</TableHead><TableHead>Entity</TableHead><TableHead>Items</TableHead><TableHead className="text-right">Total Amount</TableHead><TableHead>Created</TableHead><TableHead>Scheduled</TableHead><TableHead>Status</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {mockPendingPayments.map(payment => (
                      <TableRow key={payment.id}>
                        <TableCell><Checkbox checked={selectedPayments.includes(payment.id)} disabled={payment.status !== 'ready'} onCheckedChange={(c) => c ? setSelectedPayments([...selectedPayments, payment.id]) : setSelectedPayments(selectedPayments.filter(id => id !== payment.id))} /></TableCell>
                        <TableCell className="font-mono font-medium">{payment.paymentRef}</TableCell>
                        <TableCell className="font-medium">{payment.payee}</TableCell>
                        <TableCell className="text-gray-600">{payment.entity}</TableCell>
                        <TableCell><Badge variant="outline">{payment.itemCount} items</Badge></TableCell>
                        <TableCell className="text-right font-mono font-semibold">{formatCurrency(payment.totalAmount)}</TableCell>
                        <TableCell>{formatDate(payment.createdDate)}</TableCell>
                        <TableCell>{formatDate(payment.scheduledDate)}</TableCell>
                        <TableCell><Badge className={payment.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{payment.status.replace('_', ' ')}</Badge></TableCell>
                        <TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>

            <TabsContent value="disbursed" className="m-0">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2"><span className="text-sm text-gray-500">Date Range:</span><Input type="date" className="w-40" value={dateRange.from} onChange={(e) => setDateRange({...dateRange, from: e.target.value})} /><span>to</span><Input type="date" className="w-40" value={dateRange.to} onChange={(e) => setDateRange({...dateRange, to: e.target.value})} /></div>
                <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" /> Apply</Button>
              </div>
              <Card>
                <Table>
                  <TableHeader><TableRow className="bg-gray-50"><TableHead>Payment Ref</TableHead><TableHead>Payee</TableHead><TableHead>Entity</TableHead><TableHead>Items</TableHead><TableHead className="text-right">Total Amount</TableHead><TableHead>Disbursed Date</TableHead><TableHead>Method</TableHead><TableHead>Confirmation #</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {mockDisbursedPayments.map(payment => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-mono font-medium">{payment.paymentRef}</TableCell>
                        <TableCell className="font-medium">{payment.payee}</TableCell>
                        <TableCell className="text-gray-600">{payment.entity}</TableCell>
                        <TableCell><Badge variant="outline">{payment.itemCount} items</Badge></TableCell>
                        <TableCell className="text-right font-mono font-semibold">{formatCurrency(payment.totalAmount)}</TableCell>
                        <TableCell>{formatDate(payment.disbursedDate)}</TableCell>
                        <TableCell><Badge variant="secondary">{payment.method}</Badge></TableCell>
                        <TableCell className="font-mono text-sm text-gray-600">{payment.confirmationNo}</TableCell>
                        <TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AggregatePaymentsPage;
