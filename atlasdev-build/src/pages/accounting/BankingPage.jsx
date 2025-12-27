import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  RefreshCw, Shield, Send, Search as SearchIcon, Landmark, CheckCircle, Clock, 
  AlertTriangle, XCircle, Check, Eye, MoreHorizontal, Download, Plus, Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);
const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

// Automatic Clearing - pending bank transactions to match
const mockAutoClearing = [
  { id: 1, bankDate: '2024-06-18', bankRef: 'ACH-78945', bankAmount: 45000.00, matchedTo: 'Elite HVAC Systems', orderRef: 'ORD-2024-153', confidence: 98, status: 'matched' },
  { id: 2, bankDate: '2024-06-17', bankRef: 'CHK-1045', bankAmount: 28500.00, matchedTo: 'ABC Lumber Supply', orderRef: 'ORD-2024-155', confidence: 100, status: 'matched' },
  { id: 3, bankDate: '2024-06-16', bankRef: 'ACH-78946', bankAmount: 32150.00, matchedTo: null, orderRef: null, confidence: 0, status: 'unmatched' },
  { id: 4, bankDate: '2024-06-15', bankRef: 'WIRE-89012', bankAmount: 450000.00, matchedTo: 'BuildRight Construction', orderRef: 'ORD-2024-156', confidence: 95, status: 'pending_review' },
];

// Positive Pay - fraud prevention
const mockPositivePay = [
  { id: 1, checkNo: '1046', payee: 'ABC Lumber Supply', amount: 15000.00, issueDate: '2024-06-18', status: 'pending', sentToBank: true },
  { id: 2, checkNo: '1047', payee: 'Modern Plumbing Co', amount: 22000.00, issueDate: '2024-06-18', status: 'pending', sentToBank: true },
  { id: 3, checkNo: '1045', payee: 'ABC Lumber Supply', amount: 28500.00, issueDate: '2024-06-14', status: 'cleared', sentToBank: true },
  { id: 4, checkNo: '1044', payee: 'Greenville County', amount: 8500.00, issueDate: '2024-06-08', status: 'cleared', sentToBank: true },
  { id: 5, checkNo: '1048', payee: 'Elite HVAC Systems', amount: 35000.00, issueDate: '2024-06-19', status: 'exception', exceptionReason: 'Amount mismatch - Bank shows $35,500' },
];

// Wire Tracking
const mockWires = [
  { id: 1, wireRef: 'WR-2024-0090', direction: 'outgoing', payee: 'BuildRight Construction', amount: 500000.00, initiatedDate: '2024-06-19', status: 'pending', expectedDate: '2024-06-20' },
  { id: 2, wireRef: 'WR-2024-0089', direction: 'outgoing', payee: 'BuildRight Construction', amount: 450000.00, initiatedDate: '2024-06-15', status: 'completed', completedDate: '2024-06-16' },
  { id: 3, wireRef: 'WR-2024-0088', direction: 'incoming', payee: 'First National Bank', amount: 500000.00, initiatedDate: '2024-06-12', status: 'completed', completedDate: '2024-06-12' },
  { id: 4, wireRef: 'WR-2024-0087', direction: 'incoming', payee: 'VanRock Holdings LLC', amount: 250000.00, initiatedDate: '2024-06-03', status: 'completed', completedDate: '2024-06-03' },
];

// Research Items - reconciliation issues
const mockResearchItems = [
  { id: 1, itemDate: '2024-06-16', description: 'Unmatched bank debit', bankRef: 'ACH-78946', amount: 32150.00, status: 'open', assignedTo: 'John Smith', createdDate: '2024-06-17', notes: 'Unable to match to any pending payment' },
  { id: 2, itemDate: '2024-06-10', description: 'Duplicate payment investigation', bankRef: 'CHK-1042', amount: 38000.00, status: 'resolved', assignedTo: 'Sarah Johnson', createdDate: '2024-06-11', notes: 'Confirmed duplicate - voided check 1042', resolvedDate: '2024-06-12' },
  { id: 3, itemDate: '2024-06-08', description: 'Wire amount discrepancy', bankRef: 'WIRE-87654', amount: 125.50, status: 'open', assignedTo: 'John Smith', createdDate: '2024-06-09', notes: 'Bank fee not recorded' },
];

// Deposits
const mockDeposits = [
  { id: 1, depositDate: '2024-06-19', depositRef: 'DEP-2024-045', items: 3, amount: 85000.00, status: 'pending', source: 'Investor contributions' },
  { id: 2, depositDate: '2024-06-15', depositRef: 'DEP-2024-044', items: 5, amount: 125000.00, status: 'processed', source: 'Weekly collections' },
  { id: 3, depositDate: '2024-06-10', depositRef: 'DEP-2024-043', items: 2, amount: 250000.00, status: 'processed', source: 'Capital call' },
];

const BankingPage = () => {
  const { entityId, accountId } = useParams();
  const [activeTab, setActiveTab] = useState('auto-clearing');
  const [selectedClearing, setSelectedClearing] = useState([]);

  return (
    <>
      <Helmet><title>Banking | AtlasDev</title></Helmet>
      <div className="flex flex-col h-full bg-white">
        <div className="border-b px-6 py-4 bg-gray-50">
          <h1 className="text-xl font-bold">Banking</h1>
          <p className="text-sm text-gray-500">Automatic clearing, positive pay, wire tracking, and research items</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b px-6">
            <TabsList className="h-12">
              <TabsTrigger value="auto-clearing" className="gap-2"><RefreshCw className="w-4 h-4" /> Automatic Clearing</TabsTrigger>
              <TabsTrigger value="positive-pay" className="gap-2"><Shield className="w-4 h-4" /> Positive Pay</TabsTrigger>
              <TabsTrigger value="wire-tracking" className="gap-2"><Send className="w-4 h-4" /> Wire Tracking</TabsTrigger>
              <TabsTrigger value="research" className="gap-2"><SearchIcon className="w-4 h-4" /> Research Items</TabsTrigger>
              <TabsTrigger value="deposits" className="gap-2"><Landmark className="w-4 h-4" /> Deposits</TabsTrigger>
            </TabsList>
          </div>

          {/* Automatic Clearing */}
          <TabsContent value="auto-clearing" className="flex-1 overflow-auto p-6 m-0">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Matched</p><p className="text-2xl font-bold text-green-600">{mockAutoClearing.filter(i => i.status === 'matched').length}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Pending Review</p><p className="text-2xl font-bold text-yellow-600">{mockAutoClearing.filter(i => i.status === 'pending_review').length}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Unmatched</p><p className="text-2xl font-bold text-red-600">{mockAutoClearing.filter(i => i.status === 'unmatched').length}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Value</p><p className="text-2xl font-bold">{formatCurrency(mockAutoClearing.reduce((a, i) => a + i.bankAmount, 0))}</p></CardContent></Card>
            </div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">Bank transactions awaiting matching</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><RefreshCw className="w-4 h-4 mr-2" /> Refresh from Bank</Button>
                <Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]" disabled={selectedClearing.length === 0}><Check className="w-4 h-4 mr-2" /> Approve Selected ({selectedClearing.length})</Button>
              </div>
            </div>
            <Card>
              <Table>
                <TableHeader><TableRow className="bg-gray-50"><TableHead className="w-10"><Checkbox /></TableHead><TableHead>Bank Date</TableHead><TableHead>Bank Ref</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Matched To</TableHead><TableHead>Order Ref</TableHead><TableHead>Confidence</TableHead><TableHead>Status</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
                <TableBody>
                  {mockAutoClearing.map(item => (
                    <TableRow key={item.id}>
                      <TableCell><Checkbox checked={selectedClearing.includes(item.id)} onCheckedChange={(c) => c ? setSelectedClearing([...selectedClearing, item.id]) : setSelectedClearing(selectedClearing.filter(i => i !== item.id))} /></TableCell>
                      <TableCell>{formatDate(item.bankDate)}</TableCell>
                      <TableCell className="font-mono">{item.bankRef}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(item.bankAmount)}</TableCell>
                      <TableCell>{item.matchedTo || <span className="text-red-500">No match found</span>}</TableCell>
                      <TableCell className="font-mono text-gray-500">{item.orderRef || '-'}</TableCell>
                      <TableCell>{item.confidence > 0 ? <Badge className={item.confidence >= 95 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{item.confidence}%</Badge> : '-'}</TableCell>
                      <TableCell><Badge className={item.status === 'matched' ? 'bg-green-100 text-green-800' : item.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>{item.status.replace('_', ' ')}</Badge></TableCell>
                      <TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Positive Pay */}
          <TabsContent value="positive-pay" className="flex-1 overflow-auto p-6 m-0">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Pending</p><p className="text-2xl font-bold text-yellow-600">{mockPositivePay.filter(i => i.status === 'pending').length}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Cleared</p><p className="text-2xl font-bold text-green-600">{mockPositivePay.filter(i => i.status === 'cleared').length}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Exceptions</p><p className="text-2xl font-bold text-red-600">{mockPositivePay.filter(i => i.status === 'exception').length}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Issued</p><p className="text-2xl font-bold">{formatCurrency(mockPositivePay.reduce((a, i) => a + i.amount, 0))}</p></CardContent></Card>
            </div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">Check issues sent to bank for fraud prevention</p>
              <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export Positive Pay File</Button>
            </div>
            <Card>
              <Table>
                <TableHeader><TableRow className="bg-gray-50"><TableHead>Check #</TableHead><TableHead>Payee</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Issue Date</TableHead><TableHead>Sent to Bank</TableHead><TableHead>Status</TableHead><TableHead>Exception Reason</TableHead></TableRow></TableHeader>
                <TableBody>
                  {mockPositivePay.map(item => (
                    <TableRow key={item.id} className={item.status === 'exception' ? 'bg-red-50' : ''}>
                      <TableCell className="font-mono">{item.checkNo}</TableCell>
                      <TableCell className="font-medium">{item.payee}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(item.amount)}</TableCell>
                      <TableCell>{formatDate(item.issueDate)}</TableCell>
                      <TableCell>{item.sentToBank ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Clock className="w-4 h-4 text-gray-400" />}</TableCell>
                      <TableCell><Badge className={item.status === 'cleared' ? 'bg-green-100 text-green-800' : item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}>{item.status}</Badge></TableCell>
                      <TableCell className="text-red-600 text-sm">{item.exceptionReason || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Wire Tracking */}
          <TabsContent value="wire-tracking" className="flex-1 overflow-auto p-6 m-0">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Pending</p><p className="text-2xl font-bold text-yellow-600">{mockWires.filter(w => w.status === 'pending').length}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Completed</p><p className="text-2xl font-bold text-green-600">{mockWires.filter(w => w.status === 'completed').length}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Outgoing Total</p><p className="text-2xl font-bold text-red-600">{formatCurrency(mockWires.filter(w => w.direction === 'outgoing').reduce((a, w) => a + w.amount, 0))}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Incoming Total</p><p className="text-2xl font-bold text-green-600">{formatCurrency(mockWires.filter(w => w.direction === 'incoming').reduce((a, w) => a + w.amount, 0))}</p></CardContent></Card>
            </div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">Track incoming and outgoing wire transfers</p>
              <Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Initiate Wire</Button>
            </div>
            <Card>
              <Table>
                <TableHeader><TableRow className="bg-gray-50"><TableHead>Wire Ref</TableHead><TableHead>Direction</TableHead><TableHead>Payee / Source</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Initiated</TableHead><TableHead>Expected/Completed</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {mockWires.map(wire => (
                    <TableRow key={wire.id}>
                      <TableCell className="font-mono">{wire.wireRef}</TableCell>
                      <TableCell><Badge variant="outline" className={wire.direction === 'incoming' ? 'border-green-500 text-green-700' : 'border-red-500 text-red-700'}>{wire.direction}</Badge></TableCell>
                      <TableCell className="font-medium">{wire.payee}</TableCell>
                      <TableCell className={cn("text-right font-mono", wire.direction === 'incoming' ? 'text-green-600' : 'text-red-600')}>{wire.direction === 'incoming' ? '+' : '-'}{formatCurrency(wire.amount)}</TableCell>
                      <TableCell>{formatDate(wire.initiatedDate)}</TableCell>
                      <TableCell>{wire.completedDate ? formatDate(wire.completedDate) : <span className="text-gray-500">{formatDate(wire.expectedDate)}</span>}</TableCell>
                      <TableCell><Badge className={wire.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{wire.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Research Items */}
          <TabsContent value="research" className="flex-1 overflow-auto p-6 m-0">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Open Items</p><p className="text-2xl font-bold text-yellow-600">{mockResearchItems.filter(i => i.status === 'open').length}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Resolved</p><p className="text-2xl font-bold text-green-600">{mockResearchItems.filter(i => i.status === 'resolved').length}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Amount</p><p className="text-2xl font-bold">{formatCurrency(mockResearchItems.filter(i => i.status === 'open').reduce((a, i) => a + i.amount, 0))}</p></CardContent></Card>
            </div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">Items requiring investigation for reconciliation</p>
              <Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Add Research Item</Button>
            </div>
            <Card>
              <Table>
                <TableHeader><TableRow className="bg-gray-50"><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead>Bank Ref</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Assigned To</TableHead><TableHead>Created</TableHead><TableHead>Notes</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {mockResearchItems.map(item => (
                    <TableRow key={item.id} className={item.status === 'open' ? 'bg-yellow-50' : ''}>
                      <TableCell>{formatDate(item.itemDate)}</TableCell>
                      <TableCell className="font-medium">{item.description}</TableCell>
                      <TableCell className="font-mono">{item.bankRef}</TableCell>
                      <TableCell className="text-right font-mono">{formatCurrency(item.amount)}</TableCell>
                      <TableCell>{item.assignedTo}</TableCell>
                      <TableCell>{formatDate(item.createdDate)}</TableCell>
                      <TableCell className="text-sm text-gray-600 max-w-xs truncate">{item.notes}</TableCell>
                      <TableCell><Badge className={item.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{item.status}</Badge></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          {/* Deposits */}
          <TabsContent value="deposits" className="flex-1 overflow-auto p-6 m-0">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Pending Deposits</p><p className="text-2xl font-bold text-yellow-600">{mockDeposits.filter(d => d.status === 'pending').length}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Processed</p><p className="text-2xl font-bold text-green-600">{mockDeposits.filter(d => d.status === 'processed').length}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total This Month</p><p className="text-2xl font-bold">{formatCurrency(mockDeposits.reduce((a, d) => a + d.amount, 0))}</p></CardContent></Card>
            </div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-gray-500">Pending and processed deposits</p>
              <Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> New Deposit</Button>
            </div>
            <Card>
              <Table>
                <TableHeader><TableRow className="bg-gray-50"><TableHead>Deposit Date</TableHead><TableHead>Deposit Ref</TableHead><TableHead>Items</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Source</TableHead><TableHead>Status</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
                <TableBody>
                  {mockDeposits.map(deposit => (
                    <TableRow key={deposit.id}>
                      <TableCell>{formatDate(deposit.depositDate)}</TableCell>
                      <TableCell className="font-mono">{deposit.depositRef}</TableCell>
                      <TableCell>{deposit.items} items</TableCell>
                      <TableCell className="text-right font-mono text-green-600">+{formatCurrency(deposit.amount)}</TableCell>
                      <TableCell>{deposit.source}</TableCell>
                      <TableCell><Badge className={deposit.status === 'processed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{deposit.status}</Badge></TableCell>
                      <TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default BankingPage;
