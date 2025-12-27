import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Search, DollarSign, Clock, Check, AlertCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockCapitalCalls = [
  { id: 1, callNumber: 'CC-2024-003', date: '2024-06-01', entity: 'VanRock Holdings LLC', project: 'Oslo Townhomes', description: 'Land acquisition funding', totalAmount: 500000, dueDate: '2024-06-15', status: 'funded', fundedDate: '2024-06-12' },
  { id: 2, callNumber: 'CC-2024-002', date: '2024-04-15', entity: 'Watson House LLC', project: 'Watson House', description: 'Construction draw equity', totalAmount: 750000, dueDate: '2024-04-30', status: 'funded', fundedDate: '2024-04-28' },
  { id: 3, callNumber: 'CC-2024-004', date: '2024-06-20', entity: 'VanRock Holdings LLC', project: 'General Operations', description: 'Working capital', totalAmount: 200000, dueDate: '2024-07-05', status: 'pending' },
  { id: 4, callNumber: 'CC-2024-001', date: '2024-02-01', entity: 'Watson House LLC', project: 'Watson House', description: 'Initial equity funding', totalAmount: 1500000, dueDate: '2024-02-15', status: 'funded', fundedDate: '2024-02-14' },
];

const mockCallDetails = [
  { investor: 'Olive Brynn LLC', ownership: 50, amount: 250000, status: 'received' },
  { investor: 'Smith Family Trust', ownership: 30, amount: 150000, status: 'received' },
  { investor: 'Johnson Investments', ownership: 20, amount: 100000, status: 'pending' },
];

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-';

const statusConfig = { funded: { label: 'Funded', color: 'bg-green-100 text-green-800' }, pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' }, partial: { label: 'Partial', color: 'bg-blue-100 text-blue-800' }, overdue: { label: 'Overdue', color: 'bg-red-100 text-red-800' } };

const CapitalCallsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCalls = mockCapitalCalls.filter(c => {
    const matchesSearch = c.callNumber.toLowerCase().includes(searchTerm.toLowerCase()) || c.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCalled = mockCapitalCalls.reduce((a, c) => a + c.totalAmount, 0);
  const totalFunded = mockCapitalCalls.filter(c => c.status === 'funded').reduce((a, c) => a + c.totalAmount, 0);
  const totalPending = mockCapitalCalls.filter(c => c.status === 'pending').reduce((a, c) => a + c.totalAmount, 0);

  return (
    <>
      <Helmet><title>Capital Calls | Investors | AtlasDev</title></Helmet>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F7FAFC]">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-2xl font-bold text-gray-900">Capital Calls</h1><p className="text-gray-500">Manage investor capital calls</p></div>
            <Button className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> New Capital Call</Button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Calls</p><p className="text-2xl font-bold">{mockCapitalCalls.length}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Called</p><p className="text-2xl font-bold">{formatCurrency(totalCalled)}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Funded</p><p className="text-2xl font-bold text-green-600">{formatCurrency(totalFunded)}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Pending</p><p className="text-2xl font-bold text-yellow-600">{formatCurrency(totalPending)}</p></CardContent></Card>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search capital calls..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="funded">Funded</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="partial">Partial</SelectItem></SelectContent></Select>
          </div>

          <Card>
            <Table>
              <TableHeader><TableRow className="bg-gray-50"><TableHead>Call #</TableHead><TableHead>Date</TableHead><TableHead>Entity</TableHead><TableHead>Project</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Due Date</TableHead><TableHead>Status</TableHead><TableHead className="w-20"></TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredCalls.map(call => (
                  <TableRow key={call.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono font-medium">{call.callNumber}</TableCell>
                    <TableCell>{formatDate(call.date)}</TableCell>
                    <TableCell className="font-medium">{call.entity}</TableCell>
                    <TableCell><Badge variant="outline">{call.project}</Badge></TableCell>
                    <TableCell className="text-gray-600">{call.description}</TableCell>
                    <TableCell className="text-right font-mono font-medium">{formatCurrency(call.totalAmount)}</TableCell>
                    <TableCell>{formatDate(call.dueDate)}</TableCell>
                    <TableCell><Badge className={statusConfig[call.status]?.color}>{statusConfig[call.status]?.label}</Badge></TableCell>
                    <TableCell>{call.status === 'pending' && <Button size="sm" variant="outline"><Send className="w-3 h-3 mr-1" /> Remind</Button>}</TableCell>
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

export default CapitalCallsPage;
