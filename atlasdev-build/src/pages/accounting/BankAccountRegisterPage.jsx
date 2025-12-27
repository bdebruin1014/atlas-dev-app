import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { 
  Search, Filter, Download, Plus, ChevronLeft, ChevronRight, 
  ArrowUpRight, ArrowDownRight, Check, X, MoreHorizontal, Calendar,
  RefreshCw, Eye, Edit, Trash2, Ban, CheckCircle, Clock, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const mockTransactions = [
  { id: 1, date: '2024-06-15', clearDate: '2024-06-16', checkNo: '', wireRef: 'WR-2024-0089', type: 'Wire', payee: 'BuildRight Construction', payeeLabel: 'GC', memo: 'Draw 4 payment', category: 'Construction Costs', debit: 450000, credit: 0, balance: 800000, status: 'cleared', reconciled: true, reconciledDate: '2024-06-20', voidStatus: null, orderNumber: 'ORD-2024-156' },
  { id: 2, date: '2024-06-14', clearDate: '2024-06-15', checkNo: '1045', wireRef: '', type: 'Check', payee: 'ABC Lumber Supply', payeeLabel: 'Vendor', memo: 'Framing materials', category: 'Materials', debit: 28500, credit: 0, balance: 1250000, status: 'cleared', reconciled: true, reconciledDate: '2024-06-20', voidStatus: null, orderNumber: 'ORD-2024-155' },
  { id: 3, date: '2024-06-12', clearDate: '2024-06-12', checkNo: '', wireRef: 'WR-2024-0088', type: 'Wire', payee: 'First National Bank', payeeLabel: 'Lender', memo: 'Draw 4 funding', category: 'Loan Proceeds', debit: 0, credit: 500000, balance: 1278500, status: 'cleared', reconciled: true, reconciledDate: '2024-06-20', voidStatus: null, orderNumber: 'ORD-2024-154' },
  { id: 4, date: '2024-06-10', clearDate: null, checkNo: '', wireRef: '', type: 'ACH', payee: 'Elite HVAC Systems', payeeLabel: 'Sub', memo: 'HVAC rough-in deposit', category: 'Subcontractors', debit: 45000, credit: 0, balance: 778500, status: 'pending', reconciled: false, reconciledDate: null, voidStatus: null, orderNumber: 'ORD-2024-153' },
  { id: 5, date: '2024-06-08', clearDate: '2024-06-09', checkNo: '1044', wireRef: '', type: 'Check', payee: 'Greenville County', payeeLabel: 'Gov', memo: 'Permit fees', category: 'Permits & Fees', debit: 8500, credit: 0, balance: 823500, status: 'cleared', reconciled: false, reconciledDate: null, voidStatus: null, orderNumber: 'ORD-2024-152' },
  { id: 6, date: '2024-06-05', clearDate: null, checkNo: '', wireRef: '', type: 'ACH', payee: 'City Electric', payeeLabel: 'Sub', memo: 'Electrical rough-in', category: 'Subcontractors', debit: 32000, credit: 0, balance: 832000, status: 'pending', reconciled: false, reconciledDate: null, voidStatus: null, orderNumber: 'ORD-2024-151' },
  { id: 7, date: '2024-06-03', clearDate: '2024-06-03', checkNo: '', wireRef: 'WR-2024-0087', type: 'Wire', payee: 'VanRock Holdings LLC', payeeLabel: 'Owner', memo: 'Capital contribution', category: 'Owner Contributions', debit: 0, credit: 250000, balance: 864000, status: 'cleared', reconciled: true, reconciledDate: '2024-06-20', voidStatus: null, orderNumber: 'ORD-2024-150' },
  { id: 8, date: '2024-06-01', clearDate: '2024-06-02', checkNo: '1043', wireRef: '', type: 'Check', payee: 'State Farm Insurance', payeeLabel: 'Vendor', memo: 'Builder risk policy', category: 'Insurance', debit: 15000, credit: 0, balance: 614000, status: 'cleared', reconciled: true, reconciledDate: '2024-06-20', voidStatus: null, orderNumber: 'ORD-2024-149' },
  { id: 9, date: '2024-05-28', clearDate: '2024-05-29', checkNo: '1042', wireRef: '', type: 'Check', payee: 'Modern Plumbing Co', payeeLabel: 'Sub', memo: 'Plumbing rough-in', category: 'Subcontractors', debit: 38000, credit: 0, balance: 629000, status: 'cleared', reconciled: true, reconciledDate: '2024-06-01', voidStatus: 'voided', voidDate: '2024-05-30', voidReason: 'Duplicate payment', orderNumber: 'ORD-2024-148' },
  { id: 10, date: '2024-05-25', clearDate: null, checkNo: '', wireRef: '', type: 'Bulk Deposit', payee: 'Multiple Sources', payeeLabel: 'Deposit', memo: 'Weekly deposit', category: 'Deposits', debit: 0, credit: 125000, balance: 667000, status: 'cleared', reconciled: true, reconciledDate: '2024-06-01', voidStatus: null, orderNumber: 'ORD-2024-147', bulkItems: 5 },
];

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '-';

const payeeLabels = ['All', 'GC', 'Vendor', 'Sub', 'Lender', 'Owner', 'Gov', 'Deposit'];
const transactionTypes = ['All', 'Check', 'Wire', 'ACH', 'Bulk Deposit'];

const BankAccountRegisterPage = () => {
  const { entityId, accountId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactionType, setTransactionType] = useState('debit');
  
  const [filters, setFilters] = useState({
    type: 'All', payeeLabel: 'All', debitCredit: 'All', status: 'All', reconciled: 'All', voided: 'All', dateFrom: '', dateTo: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  const applyFilters = (transactions) => {
    return transactions.filter(t => {
      if (searchTerm && !t.payee.toLowerCase().includes(searchTerm.toLowerCase()) && !t.memo.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (filters.type !== 'All' && t.type !== filters.type) return false;
      if (filters.payeeLabel !== 'All' && t.payeeLabel !== filters.payeeLabel) return false;
      if (filters.debitCredit === 'Debit' && t.debit === 0) return false;
      if (filters.debitCredit === 'Credit' && t.credit === 0) return false;
      if (filters.status === 'Cleared' && t.status !== 'cleared') return false;
      if (filters.status === 'Pending' && t.status !== 'pending') return false;
      if (filters.reconciled === 'Yes' && !t.reconciled) return false;
      if (filters.reconciled === 'No' && t.reconciled) return false;
      if (filters.voided === 'Yes' && !t.voidStatus) return false;
      if (filters.voided === 'No' && t.voidStatus) return false;
      if (filters.dateFrom && new Date(t.date) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(t.date) > new Date(filters.dateTo)) return false;
      return true;
    });
  };

  const filteredTransactions = applyFilters(mockTransactions);
  const totalDebits = filteredTransactions.reduce((a, t) => a + t.debit, 0);
  const totalCredits = filteredTransactions.reduce((a, t) => a + t.credit, 0);
  const clearedBalance = mockTransactions.filter(t => t.status === 'cleared' && !t.voidStatus).reduce((a, t) => a + t.credit - t.debit, 0);
  const pendingBalance = mockTransactions.filter(t => t.status === 'pending').reduce((a, t) => a + t.credit - t.debit, 0);

  const clearFilters = () => setFilters({ type: 'All', payeeLabel: 'All', debitCredit: 'All', status: 'All', reconciled: 'All', voided: 'All', dateFrom: '', dateTo: '' });

  return (
    <>
      <Helmet><title>Register | Bank Account | AtlasDev</title></Helmet>
      <div className="flex flex-col h-full bg-white">
        <div className="border-b px-4 py-3 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search payee, memo, order..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 w-64" /></div>
            <Button variant={showFilters ? "secondary" : "outline"} size="sm" onClick={() => setShowFilters(!showFilters)}><Filter className="w-4 h-4 mr-2" /> Filters {Object.values(filters).filter(v => v !== 'All' && v !== '').length > 0 && `(${Object.values(filters).filter(v => v !== 'All' && v !== '').length})`}</Button>
            {Object.values(filters).filter(v => v !== 'All' && v !== '').length > 0 && <Button variant="ghost" size="sm" onClick={clearFilters}>Clear All</Button>}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" /> Export</Button>
            <Popover><PopoverTrigger asChild><Button size="sm" className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> Add Transaction</Button></PopoverTrigger>
              <PopoverContent className="w-48 p-1">
                <Button variant="ghost" className="w-full justify-start" onClick={() => { setTransactionType('debit'); setShowAddTransaction(true); }}><ArrowDownRight className="w-4 h-4 mr-2 text-red-500" /> Debit (Payment)</Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { setTransactionType('credit'); setShowAddTransaction(true); }}><ArrowUpRight className="w-4 h-4 mr-2 text-green-500" /> Credit (Deposit)</Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => { setTransactionType('bulk'); setShowAddTransaction(true); }}><Plus className="w-4 h-4 mr-2 text-blue-500" /> Bulk Deposit</Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {showFilters && (
          <div className="border-b px-4 py-3 bg-gray-50 grid grid-cols-8 gap-3">
            <div><Label className="text-xs text-gray-500">Type</Label><Select value={filters.type} onValueChange={(v) => setFilters({...filters, type: v})}><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent>{transactionTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
            <div><Label className="text-xs text-gray-500">Payee Label</Label><Select value={filters.payeeLabel} onValueChange={(v) => setFilters({...filters, payeeLabel: v})}><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent>{payeeLabels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select></div>
            <div><Label className="text-xs text-gray-500">Debit/Credit</Label><Select value={filters.debitCredit} onValueChange={(v) => setFilters({...filters, debitCredit: v})}><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="All">All</SelectItem><SelectItem value="Debit">Debits Only</SelectItem><SelectItem value="Credit">Credits Only</SelectItem></SelectContent></Select></div>
            <div><Label className="text-xs text-gray-500">Cleared Status</Label><Select value={filters.status} onValueChange={(v) => setFilters({...filters, status: v})}><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="All">All</SelectItem><SelectItem value="Cleared">Cleared</SelectItem><SelectItem value="Pending">Pending</SelectItem></SelectContent></Select></div>
            <div><Label className="text-xs text-gray-500">Reconciled</Label><Select value={filters.reconciled} onValueChange={(v) => setFilters({...filters, reconciled: v})}><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="All">All</SelectItem><SelectItem value="Yes">Reconciled</SelectItem><SelectItem value="No">Unreconciled</SelectItem></SelectContent></Select></div>
            <div><Label className="text-xs text-gray-500">Void Status</Label><Select value={filters.voided} onValueChange={(v) => setFilters({...filters, voided: v})}><SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="All">All</SelectItem><SelectItem value="Yes">Voided</SelectItem><SelectItem value="No">Active</SelectItem></SelectContent></Select></div>
            <div><Label className="text-xs text-gray-500">Date From</Label><Input type="date" className="h-8" value={filters.dateFrom} onChange={(e) => setFilters({...filters, dateFrom: e.target.value})} /></div>
            <div><Label className="text-xs text-gray-500">Date To</Label><Input type="date" className="h-8" value={filters.dateTo} onChange={(e) => setFilters({...filters, dateTo: e.target.value})} /></div>
          </div>
        )}

        <div className="px-4 py-3 border-b grid grid-cols-6 gap-4 bg-white">
          <div className="text-center border-r"><p className="text-xs text-gray-500 uppercase">Transactions</p><p className="text-lg font-semibold">{filteredTransactions.length}</p></div>
          <div className="text-center border-r"><p className="text-xs text-gray-500 uppercase">Total Debits</p><p className="text-lg font-semibold text-red-600">{formatCurrency(totalDebits)}</p></div>
          <div className="text-center border-r"><p className="text-xs text-gray-500 uppercase">Total Credits</p><p className="text-lg font-semibold text-green-600">{formatCurrency(totalCredits)}</p></div>
          <div className="text-center border-r"><p className="text-xs text-gray-500 uppercase">Cleared Balance</p><p className="text-lg font-semibold">{formatCurrency(clearedBalance)}</p></div>
          <div className="text-center border-r"><p className="text-xs text-gray-500 uppercase">Pending</p><p className="text-lg font-semibold text-yellow-600">{formatCurrency(Math.abs(pendingBalance))}</p></div>
          <div className="text-center"><p className="text-xs text-gray-500 uppercase">Current Balance</p><p className="text-lg font-semibold text-blue-600">{formatCurrency(mockTransactions[0]?.balance || 0)}</p></div>
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-gray-50 z-10">
              <TableRow>
                <TableHead className="w-10"><Checkbox /></TableHead>
                <TableHead className="w-24">Date</TableHead>
                <TableHead className="w-24">Clear Date</TableHead>
                <TableHead className="w-20">Ref #</TableHead>
                <TableHead className="w-20">Type</TableHead>
                <TableHead>Payee</TableHead>
                <TableHead className="w-16">Label</TableHead>
                <TableHead>Memo</TableHead>
                <TableHead className="w-28">Order #</TableHead>
                <TableHead className="text-right w-28">Debit</TableHead>
                <TableHead className="text-right w-28">Credit</TableHead>
                <TableHead className="text-right w-32">Balance</TableHead>
                <TableHead className="w-20">Status</TableHead>
                <TableHead className="w-12">R</TableHead>
                <TableHead className="w-12">V</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map(tx => (
                <TableRow key={tx.id} className={cn("hover:bg-gray-50", tx.voidStatus && "bg-red-50 line-through opacity-60")}>
                  <TableCell><Checkbox checked={selectedRows.includes(tx.id)} onCheckedChange={(checked) => { if (checked) setSelectedRows([...selectedRows, tx.id]); else setSelectedRows(selectedRows.filter(id => id !== tx.id)); }} /></TableCell>
                  <TableCell className="font-mono text-sm">{formatDate(tx.date)}</TableCell>
                  <TableCell className="font-mono text-sm text-gray-500">{formatDate(tx.clearDate)}</TableCell>
                  <TableCell className="text-gray-500">{tx.checkNo || tx.wireRef || '-'}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{tx.type}</Badge></TableCell>
                  <TableCell className="font-medium">{tx.payee}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{tx.payeeLabel}</Badge></TableCell>
                  <TableCell className="text-gray-600 text-sm max-w-48 truncate">{tx.memo}</TableCell>
                  <TableCell className="font-mono text-xs text-gray-500">{tx.orderNumber}</TableCell>
                  <TableCell className="text-right font-mono text-red-600">{tx.debit > 0 ? formatCurrency(tx.debit) : ''}</TableCell>
                  <TableCell className="text-right font-mono text-green-600">{tx.credit > 0 ? formatCurrency(tx.credit) : ''}</TableCell>
                  <TableCell className="text-right font-mono font-medium">{formatCurrency(tx.balance)}</TableCell>
                  <TableCell><Badge className={tx.status === 'cleared' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{tx.status === 'cleared' ? <CheckCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}{tx.status}</Badge></TableCell>
                  <TableCell className="text-center">{tx.reconciled ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <span className="text-gray-300">-</span>}</TableCell>
                  <TableCell className="text-center">{tx.voidStatus ? <Ban className="w-4 h-4 text-red-500 mx-auto" /> : <span className="text-gray-300">-</span>}</TableCell>
                  <TableCell><Popover><PopoverTrigger asChild><Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button></PopoverTrigger><PopoverContent className="w-40 p-1"><Button variant="ghost" size="sm" className="w-full justify-start"><Eye className="w-4 h-4 mr-2" /> View</Button><Button variant="ghost" size="sm" className="w-full justify-start"><Edit className="w-4 h-4 mr-2" /> Edit Clear Date</Button><Button variant="ghost" size="sm" className="w-full justify-start text-red-600"><Ban className="w-4 h-4 mr-2" /> Void</Button></PopoverContent></Popover></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="border-t px-4 py-3 flex items-center justify-between bg-gray-50">
          <p className="text-sm text-gray-500">Showing {filteredTransactions.length} of {mockTransactions.length} transactions</p>
          <div className="flex items-center gap-2"><Button variant="outline" size="sm" disabled><ChevronLeft className="w-4 h-4" /></Button><span className="text-sm">Page 1 of 1</span><Button variant="outline" size="sm" disabled><ChevronRight className="w-4 h-4" /></Button></div>
        </div>

        <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{transactionType === 'debit' && 'Add Debit (Payment)'}{transactionType === 'credit' && 'Add Credit (Deposit)'}{transactionType === 'bulk' && 'Add Bulk Deposit'}</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4"><div><Label>Date</Label><Input type="date" /></div><div><Label>Amount</Label><Input type="number" placeholder="0.00" /></div></div>
              <div><Label>Payee</Label><Input placeholder="Enter payee name" /></div>
              <div className="grid grid-cols-2 gap-4"><div><Label>Type</Label><Select><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger><SelectContent><SelectItem value="Check">Check</SelectItem><SelectItem value="Wire">Wire</SelectItem><SelectItem value="ACH">ACH</SelectItem></SelectContent></Select></div><div><Label>Payee Label</Label><Select><SelectTrigger><SelectValue placeholder="Select label" /></SelectTrigger><SelectContent>{payeeLabels.filter(l => l !== 'All').map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}</SelectContent></Select></div></div>
              <div><Label>Check # / Wire Ref</Label><Input placeholder="Optional reference number" /></div>
              <div><Label>Memo</Label><Input placeholder="Transaction description" /></div>
              <div><Label>Category</Label><Select><SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger><SelectContent><SelectItem value="Construction Costs">Construction Costs</SelectItem><SelectItem value="Materials">Materials</SelectItem><SelectItem value="Subcontractors">Subcontractors</SelectItem><SelectItem value="Permits & Fees">Permits & Fees</SelectItem><SelectItem value="Insurance">Insurance</SelectItem><SelectItem value="Loan Proceeds">Loan Proceeds</SelectItem><SelectItem value="Owner Contributions">Owner Contributions</SelectItem></SelectContent></Select></div>
              {transactionType === 'bulk' && <div className="p-3 bg-gray-50 rounded-lg"><Label>Bulk Deposit Items</Label><p className="text-sm text-gray-500 mt-1">Add individual deposit items below</p><Button variant="outline" size="sm" className="mt-2"><Plus className="w-4 h-4 mr-1" /> Add Item</Button></div>}
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setShowAddTransaction(false)}>Cancel</Button><Button className="bg-[#2F855A] hover:bg-[#276749]">Save Transaction</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default BankAccountRegisterPage;
