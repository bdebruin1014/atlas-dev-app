import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Search, Receipt, DollarSign, Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const mockBills = [
  { id: 1, billNumber: 'INV-2024-0156', vendor: 'BuildRight Construction', entity: 'Watson House LLC', description: 'Progress payment - June', amount: 450000, dueDate: '2024-06-20', status: 'due', project: 'Watson House' },
  { id: 2, billNumber: 'INV-2024-0155', vendor: 'ABC Lumber Supply', entity: 'Watson House LLC', description: 'Framing materials', amount: 28500, dueDate: '2024-06-18', status: 'overdue', project: 'Watson House' },
  { id: 3, billNumber: 'INV-2024-0154', vendor: 'Elite HVAC Systems', entity: 'Watson House LLC', description: 'HVAC rough-in deposit', amount: 45000, dueDate: '2024-06-25', status: 'due', project: 'Watson House' },
  { id: 4, billNumber: 'INV-2024-0153', vendor: 'City Electric', entity: 'Watson House LLC', description: 'Electrical rough-in', amount: 32000, dueDate: '2024-06-15', status: 'paid', project: 'Watson House', paidDate: '2024-06-14' },
  { id: 5, billNumber: 'INV-2024-0152', vendor: 'Modern Design Studio', entity: 'Oslo Townhomes LLC', description: 'Design services', amount: 12500, dueDate: '2024-06-22', status: 'approved', project: 'Oslo Townhomes' },
  { id: 6, billNumber: 'INV-2024-0151', vendor: 'Greenville County', entity: 'Watson House LLC', description: 'Permit fees', amount: 8500, dueDate: '2024-06-10', status: 'paid', project: 'Watson House', paidDate: '2024-06-08' },
];

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const statusConfig = { due: { label: 'Due', color: 'bg-yellow-100 text-yellow-800', icon: Clock }, overdue: { label: 'Overdue', color: 'bg-red-100 text-red-800', icon: AlertCircle }, approved: { label: 'Approved', color: 'bg-blue-100 text-blue-800', icon: CheckCircle }, paid: { label: 'Paid', color: 'bg-green-100 text-green-800', icon: CheckCircle } };

const BillsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBills, setSelectedBills] = useState([]);

  const filteredBills = mockBills.filter(b => {
    const matchesSearch = b.vendor.toLowerCase().includes(searchTerm.toLowerCase()) || b.billNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalDue = mockBills.filter(b => b.status !== 'paid').reduce((a, b) => a + b.amount, 0);
  const overdue = mockBills.filter(b => b.status === 'overdue').reduce((a, b) => a + b.amount, 0);

  return (
    <>
      <Helmet><title>Bills | Accounting | AtlasDev</title></Helmet>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F7FAFC]">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-2xl font-bold text-gray-900">Bills</h1><p className="text-gray-500">Manage accounts payable</p></div>
            <div className="flex gap-2">
              {selectedBills.length > 0 && <Button variant="outline"><DollarSign className="w-4 h-4 mr-2" /> Pay Selected ({selectedBills.length})</Button>}
              <Button className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> New Bill</Button>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Bills</p><p className="text-2xl font-bold">{mockBills.length}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Due</p><p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalDue)}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Overdue</p><p className="text-2xl font-bold text-red-600">{formatCurrency(overdue)}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Paid This Month</p><p className="text-2xl font-bold text-green-600">{formatCurrency(mockBills.filter(b => b.status === 'paid').reduce((a, b) => a + b.amount, 0))}</p></CardContent></Card>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search bills..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="due">Due</SelectItem><SelectItem value="overdue">Overdue</SelectItem><SelectItem value="approved">Approved</SelectItem><SelectItem value="paid">Paid</SelectItem></SelectContent></Select>
          </div>

          <Card>
            <Table>
              <TableHeader><TableRow className="bg-gray-50"><TableHead className="w-10"><Checkbox /></TableHead><TableHead>Bill #</TableHead><TableHead>Vendor</TableHead><TableHead>Entity</TableHead><TableHead>Description</TableHead><TableHead>Project</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Due Date</TableHead><TableHead>Status</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredBills.map(bill => (
                  <TableRow key={bill.id} className="hover:bg-gray-50">
                    <TableCell><Checkbox checked={selectedBills.includes(bill.id)} disabled={bill.status === 'paid'} onCheckedChange={(checked) => { if (checked) setSelectedBills([...selectedBills, bill.id]); else setSelectedBills(selectedBills.filter(id => id !== bill.id)); }} /></TableCell>
                    <TableCell className="font-mono font-medium">{bill.billNumber}</TableCell>
                    <TableCell className="font-medium">{bill.vendor}</TableCell>
                    <TableCell className="text-gray-600">{bill.entity}</TableCell>
                    <TableCell className="text-gray-600">{bill.description}</TableCell>
                    <TableCell><Badge variant="outline">{bill.project}</Badge></TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(bill.amount)}</TableCell>
                    <TableCell className={cn(bill.status === 'overdue' && 'text-red-600 font-medium')}>{formatDate(bill.dueDate)}</TableCell>
                    <TableCell><Badge className={statusConfig[bill.status]?.color}>{statusConfig[bill.status]?.label}</Badge></TableCell>
                    <TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell>
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

export default BillsPage;
