import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Search, BookOpen, Eye, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const mockJournalEntries = [
  { id: 1, entryNumber: 'JE-2024-0045', date: '2024-06-15', entity: 'Watson House LLC', description: 'Record construction draw #4', debitTotal: 450000, creditTotal: 450000, status: 'posted', createdBy: 'John Smith' },
  { id: 2, entryNumber: 'JE-2024-0044', date: '2024-06-12', entity: 'VanRock Holdings LLC', description: 'Inter-company loan to Watson House', debitTotal: 500000, creditTotal: 500000, status: 'posted', createdBy: 'John Smith' },
  { id: 3, entryNumber: 'JE-2024-0043', date: '2024-06-10', entity: 'Watson House LLC', description: 'Capitalize interest expense', debitTotal: 85000, creditTotal: 85000, status: 'posted', createdBy: 'Sarah Johnson' },
  { id: 4, entryNumber: 'JE-2024-0046', date: '2024-06-18', entity: 'Oslo Townhomes LLC', description: 'Record development costs', debitTotal: 125000, creditTotal: 125000, status: 'draft', createdBy: 'John Smith' },
  { id: 5, entryNumber: 'JE-2024-0042', date: '2024-06-08', entity: 'VanRock Holdings LLC', description: 'Q2 distribution accrual', debitTotal: 150000, creditTotal: 150000, status: 'posted', createdBy: 'John Smith' },
];

const formatCurrency = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const JournalEntriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <>
      <Helmet><title>Journal Entries | Accounting | AtlasDev</title></Helmet>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F7FAFC]">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-2xl font-bold text-gray-900">Journal Entries</h1><p className="text-gray-500">Manual journal entries and adjustments</p></div>
            <Button className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> New Entry</Button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Entries</p><p className="text-2xl font-bold">{mockJournalEntries.length}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Posted</p><p className="text-2xl font-bold text-green-600">{mockJournalEntries.filter(j => j.status === 'posted').length}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Draft</p><p className="text-2xl font-bold text-yellow-600">{mockJournalEntries.filter(j => j.status === 'draft').length}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">This Month Total</p><p className="text-2xl font-bold">{formatCurrency(mockJournalEntries.reduce((a, j) => a + j.debitTotal, 0))}</p></CardContent></Card>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search entries..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
          </div>

          <Card>
            <Table>
              <TableHeader><TableRow className="bg-gray-50"><TableHead>Entry #</TableHead><TableHead>Date</TableHead><TableHead>Entity</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Debit</TableHead><TableHead className="text-right">Credit</TableHead><TableHead>Created By</TableHead><TableHead>Status</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
              <TableBody>
                {mockJournalEntries.map(entry => (
                  <TableRow key={entry.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono font-medium">{entry.entryNumber}</TableCell>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell className="font-medium">{entry.entity}</TableCell>
                    <TableCell className="text-gray-600">{entry.description}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(entry.debitTotal)}</TableCell>
                    <TableCell className="text-right font-mono">{formatCurrency(entry.creditTotal)}</TableCell>
                    <TableCell className="text-gray-600">{entry.createdBy}</TableCell>
                    <TableCell><Badge className={entry.status === 'posted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>{entry.status}</Badge></TableCell>
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

export default JournalEntriesPage;
