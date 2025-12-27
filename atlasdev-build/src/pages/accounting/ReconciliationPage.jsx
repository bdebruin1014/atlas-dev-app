import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { RefreshCw, CheckCircle, Clock, AlertTriangle, Calendar, Play, History, FileText, DollarSign, ArrowDown, ArrowUp, Check, X, Eye, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);
const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const mockReconciliations = [
  { id: 1, statementDate: '2024-05-31', statementBalance: 1250000.00, bookBalance: 1250000.00, variance: 0, status: 'completed', completedBy: 'John Smith', completedDate: '2024-06-05', clearedDebits: 45, clearedCredits: 12, adjustments: 2 },
  { id: 2, statementDate: '2024-04-30', statementBalance: 980000.00, bookBalance: 980000.00, variance: 0, status: 'completed', completedBy: 'Sarah Johnson', completedDate: '2024-05-03', clearedDebits: 38, clearedCredits: 8, adjustments: 1 },
  { id: 3, statementDate: '2024-03-31', statementBalance: 1150000.00, bookBalance: 1150000.00, variance: 0, status: 'completed', completedBy: 'John Smith', completedDate: '2024-04-04', clearedDebits: 52, clearedCredits: 15, adjustments: 3 },
];

const mockCurrentRecon = {
  statementDate: '2024-06-30', statementBalance: 800000.00, bookBalance: 823500.00,
  clearedDebits: { count: 28, total: 1850000.00 }, clearedCredits: { count: 8, total: 875000.00 },
  unclearedDebits: { count: 5, total: 77000.00 }, unclearedCredits: { count: 2, total: 100000.00 },
  adjustments: [{ id: 1, date: '2024-06-20', description: 'Bank service charge', amount: -125.00, type: 'debit' }, { id: 2, date: '2024-06-18', description: 'Interest earned', amount: 325.00, type: 'credit' }],
};

const mockUnclearedDebits = [
  { id: 1, date: '2024-06-10', ref: 'ACH-78946', payee: 'Elite HVAC Systems', amount: 45000.00, daysOld: 20 },
  { id: 2, date: '2024-06-05', ref: 'ACH-78945', payee: 'City Electric', amount: 32000.00, daysOld: 25 },
];

const mockUnclearedCredits = [{ id: 1, date: '2024-06-19', ref: 'DEP-2024-045', source: 'Investor contributions', amount: 85000.00, daysOld: 11 }];

const auditMetrics = { lastReconciled: '2024-05-31', daysSinceRecon: 30, unclearedCount: 7, outstandingAmount: 177000.00, researchItems: 2, exceptionsCount: 1 };

const ReconciliationPage = () => {
  const { entityId, accountId } = useParams();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showStartRecon, setShowStartRecon] = useState(false);
  const [reconData, setReconData] = useState({ statementDate: '', statementBalance: '' });

  const calculatedVariance = mockCurrentRecon.bookBalance - mockCurrentRecon.statementBalance + mockCurrentRecon.adjustments.reduce((a, adj) => a + adj.amount, 0);

  return (
    <>
      <Helmet><title>Reconciliation | AtlasDev</title></Helmet>
      <div className="flex flex-col h-full bg-white">
        <div className="border-b px-6 py-4 bg-gray-50"><h1 className="text-xl font-bold">Reconciliations</h1><p className="text-sm text-gray-500">Bank account reconciliation and audit readiness</p></div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b px-6"><TabsList className="h-12"><TabsTrigger value="dashboard" className="gap-2"><CheckCircle className="w-4 h-4" /> Audit Readiness</TabsTrigger><TabsTrigger value="current" className="gap-2"><Play className="w-4 h-4" /> Current Reconciliation</TabsTrigger><TabsTrigger value="history" className="gap-2"><History className="w-4 h-4" /> History</TabsTrigger></TabsList></div>

          <TabsContent value="dashboard" className="flex-1 overflow-auto p-6 m-0">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className={auditMetrics.daysSinceRecon > 30 ? 'border-red-200 bg-red-50' : ''}><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Last Reconciled</p><p className="text-2xl font-bold">{formatDate(auditMetrics.lastReconciled)}</p><p className={cn("text-sm mt-1", auditMetrics.daysSinceRecon > 30 ? 'text-red-600' : 'text-gray-500')}>{auditMetrics.daysSinceRecon} days ago</p></CardContent></Card>
              <Card className={auditMetrics.researchItems > 0 ? 'border-yellow-200 bg-yellow-50' : ''}><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Research Items</p><p className="text-2xl font-bold text-yellow-600">{auditMetrics.researchItems}</p><p className="text-sm text-gray-500">Open items</p></CardContent></Card>
              <Card className={auditMetrics.exceptionsCount > 0 ? 'border-red-200 bg-red-50' : ''}><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Exceptions</p><p className="text-2xl font-bold text-red-600">{auditMetrics.exceptionsCount}</p><p className="text-sm text-gray-500">Require attention</p></CardContent></Card>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <Card><CardHeader><CardTitle className="text-base">Uncleared Items Summary</CardTitle></CardHeader><CardContent><div className="space-y-4"><div className="flex justify-between items-center p-3 bg-red-50 rounded-lg"><div className="flex items-center gap-2"><ArrowDown className="w-4 h-4 text-red-600" /><span>Uncleared Debits</span></div><div className="text-right"><p className="font-bold">{mockCurrentRecon.unclearedDebits.count}</p><p className="text-sm text-gray-500">{formatCurrency(mockCurrentRecon.unclearedDebits.total)}</p></div></div><div className="flex justify-between items-center p-3 bg-green-50 rounded-lg"><div className="flex items-center gap-2"><ArrowUp className="w-4 h-4 text-green-600" /><span>Uncleared Credits</span></div><div className="text-right"><p className="font-bold">{mockCurrentRecon.unclearedCredits.count}</p><p className="text-sm text-gray-500">{formatCurrency(mockCurrentRecon.unclearedCredits.total)}</p></div></div><div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border-t"><span className="font-medium">Net Outstanding</span><span className="font-bold">{formatCurrency(auditMetrics.outstandingAmount)}</span></div></div></CardContent></Card>
              <Card><CardHeader><CardTitle className="text-base">Reconciliation Status</CardTitle></CardHeader><CardContent><div className="space-y-4"><div className="flex items-center justify-between"><span className="text-gray-600">Current Period</span><Badge variant="outline">June 2024</Badge></div><div className="flex items-center justify-between"><span className="text-gray-600">Status</span><Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge></div><div className="flex items-center justify-between"><span className="text-gray-600">Cleared Transactions</span><span className="font-medium">{mockCurrentRecon.clearedDebits.count + mockCurrentRecon.clearedCredits.count}</span></div><Progress value={75} className="h-2" /><p className="text-xs text-gray-500 text-center">75% Complete</p></div></CardContent></Card>
            </div>
            <div className="flex gap-4"><Button size="lg" className="bg-[#2F855A] hover:bg-[#276749]" onClick={() => setShowStartRecon(true)}><Play className="w-4 h-4 mr-2" /> Start New Reconciliation</Button><Button size="lg" variant="outline"><FileText className="w-4 h-4 mr-2" /> Generate Audit Report</Button></div>
          </TabsContent>

          <TabsContent value="current" className="flex-1 overflow-auto p-6 m-0">
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Statement Date</p><p className="text-xl font-bold">{formatDate(mockCurrentRecon.statementDate)}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Statement Balance</p><p className="text-xl font-bold">{formatCurrency(mockCurrentRecon.statementBalance)}</p></CardContent></Card>
              <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Book Balance</p><p className="text-xl font-bold">{formatCurrency(mockCurrentRecon.bookBalance)}</p></CardContent></Card>
              <Card className={Math.abs(calculatedVariance) > 0 ? 'border-red-200' : 'border-green-200'}><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Variance</p><p className={cn("text-xl font-bold", Math.abs(calculatedVariance) > 0 ? 'text-red-600' : 'text-green-600')}>{formatCurrency(calculatedVariance)}</p></CardContent></Card>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <Card><CardHeader><CardTitle className="text-base">Cleared Items</CardTitle></CardHeader><CardContent><div className="space-y-3"><div className="flex justify-between p-3 bg-gray-50 rounded"><span>Cleared Debits ({mockCurrentRecon.clearedDebits.count})</span><span className="font-mono text-red-600">-{formatCurrency(mockCurrentRecon.clearedDebits.total)}</span></div><div className="flex justify-between p-3 bg-gray-50 rounded"><span>Cleared Credits ({mockCurrentRecon.clearedCredits.count})</span><span className="font-mono text-green-600">+{formatCurrency(mockCurrentRecon.clearedCredits.total)}</span></div><div className="flex justify-between p-3 border-t pt-3 font-medium"><span>Net Cleared</span><span>{formatCurrency(mockCurrentRecon.clearedCredits.total - mockCurrentRecon.clearedDebits.total)}</span></div></div></CardContent></Card>
              <Card><CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-base">Adjustments</CardTitle><Button variant="ghost" size="sm"><Plus className="w-4 h-4 mr-1" /> Add</Button></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader><TableBody>{mockCurrentRecon.adjustments.map(adj => (<TableRow key={adj.id}><TableCell>{formatDate(adj.date)}</TableCell><TableCell>{adj.description}</TableCell><TableCell className={cn("text-right font-mono", adj.type === 'credit' ? 'text-green-600' : 'text-red-600')}>{adj.type === 'credit' ? '+' : ''}{formatCurrency(adj.amount)}</TableCell></TableRow>))}</TableBody></Table><div className="flex justify-between p-3 border-t mt-2 font-medium"><span>Total Adjustments</span><span>{formatCurrency(mockCurrentRecon.adjustments.reduce((a, adj) => a + adj.amount, 0))}</span></div></CardContent></Card>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><ArrowDown className="w-4 h-4 text-red-600" /> Uncleared Debits</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Ref</TableHead><TableHead>Payee</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Days</TableHead></TableRow></TableHeader><TableBody>{mockUnclearedDebits.map(item => (<TableRow key={item.id}><TableCell>{formatDate(item.date)}</TableCell><TableCell className="font-mono text-xs">{item.ref}</TableCell><TableCell>{item.payee}</TableCell><TableCell className="text-right font-mono text-red-600">{formatCurrency(item.amount)}</TableCell><TableCell><Badge variant="outline">{item.daysOld}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
              <Card><CardHeader><CardTitle className="text-base flex items-center gap-2"><ArrowUp className="w-4 h-4 text-green-600" /> Uncleared Credits</CardTitle></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Ref</TableHead><TableHead>Source</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Days</TableHead></TableRow></TableHeader><TableBody>{mockUnclearedCredits.map(item => (<TableRow key={item.id}><TableCell>{formatDate(item.date)}</TableCell><TableCell className="font-mono text-xs">{item.ref}</TableCell><TableCell>{item.source}</TableCell><TableCell className="text-right font-mono text-green-600">{formatCurrency(item.amount)}</TableCell><TableCell><Badge variant="outline">{item.daysOld}</Badge></TableCell></TableRow>))}</TableBody></Table></CardContent></Card>
            </div>
            <div className="flex gap-4"><Button size="lg" className="bg-[#2F855A] hover:bg-[#276749]" disabled={Math.abs(calculatedVariance) > 0.01}><Check className="w-4 h-4 mr-2" /> Complete Reconciliation</Button><Button size="lg" variant="outline"><Download className="w-4 h-4 mr-2" /> Export Reconciliation</Button></div>
          </TabsContent>

          <TabsContent value="history" className="flex-1 overflow-auto p-6 m-0">
            <div className="flex justify-between items-center mb-4"><p className="text-sm text-gray-500">Completed reconciliations</p><Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export All</Button></div>
            <Card><Table><TableHeader><TableRow className="bg-gray-50"><TableHead>Statement Date</TableHead><TableHead className="text-right">Statement Balance</TableHead><TableHead className="text-right">Book Balance</TableHead><TableHead className="text-right">Variance</TableHead><TableHead>Cleared Debits</TableHead><TableHead>Cleared Credits</TableHead><TableHead>Adjustments</TableHead><TableHead>Completed By</TableHead><TableHead>Completed Date</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader><TableBody>{mockReconciliations.map(recon => (<TableRow key={recon.id}><TableCell className="font-medium">{formatDate(recon.statementDate)}</TableCell><TableCell className="text-right font-mono">{formatCurrency(recon.statementBalance)}</TableCell><TableCell className="text-right font-mono">{formatCurrency(recon.bookBalance)}</TableCell><TableCell className="text-right"><Badge className={recon.variance === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>{formatCurrency(recon.variance)}</Badge></TableCell><TableCell>{recon.clearedDebits}</TableCell><TableCell>{recon.clearedCredits}</TableCell><TableCell>{recon.adjustments}</TableCell><TableCell>{recon.completedBy}</TableCell><TableCell>{formatDate(recon.completedDate)}</TableCell><TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell></TableRow>))}</TableBody></Table></Card>
          </TabsContent>
        </Tabs>

        <Dialog open={showStartRecon} onOpenChange={setShowStartRecon}><DialogContent><DialogHeader><DialogTitle>Start New Reconciliation</DialogTitle></DialogHeader><div className="space-y-4 py-4"><div><Label>Statement Date</Label><Input type="date" value={reconData.statementDate} onChange={(e) => setReconData({...reconData, statementDate: e.target.value})} /></div><div><Label>Statement Ending Balance</Label><Input type="number" placeholder="0.00" value={reconData.statementBalance} onChange={(e) => setReconData({...reconData, statementBalance: e.target.value})} /></div></div><DialogFooter><Button variant="outline" onClick={() => setShowStartRecon(false)}>Cancel</Button><Button className="bg-[#2F855A] hover:bg-[#276749]">Start Reconciliation</Button></DialogFooter></DialogContent></Dialog>
      </div>
    </>
  );
};

export default ReconciliationPage;
