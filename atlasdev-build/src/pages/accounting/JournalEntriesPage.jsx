import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, BookOpen } from 'lucide-react';

const entries = [
  { id: 1, number: 'JE-2024-001', date: '2024-10-31', description: 'Monthly Depreciation', debits: 2500, credits: 2500, status: 'posted' },
  { id: 2, number: 'JE-2024-002', date: '2024-10-31', description: 'Accrued Interest', debits: 4200, credits: 4200, status: 'posted' },
  { id: 3, number: 'JE-2024-003', date: '2024-11-01', description: 'Capital Contribution Allocation', debits: 100000, credits: 100000, status: 'draft' },
];

const JournalEntriesPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Journal Entries</h1>
      <Button><Plus className="w-4 h-4 mr-2" />New Entry</Button>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Entries</p><p className="text-2xl font-bold">{entries.length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Posted</p><p className="text-2xl font-bold text-emerald-600">{entries.filter(e => e.status === 'posted').length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Draft</p><p className="text-2xl font-bold text-gray-500">{entries.filter(e => e.status === 'draft').length}</p></CardContent></Card>
    </div>
    <Card>
      <Table>
        <TableHeader><TableRow><TableHead>Entry #</TableHead><TableHead>Date</TableHead><TableHead>Description</TableHead><TableHead className="text-right">Debits</TableHead><TableHead className="text-right">Credits</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>
          {entries.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="font-medium"><div className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-gray-400" />{e.number}</div></TableCell>
              <TableCell>{e.date}</TableCell>
              <TableCell>{e.description}</TableCell>
              <TableCell className="text-right">${e.debits.toLocaleString()}</TableCell>
              <TableCell className="text-right">${e.credits.toLocaleString()}</TableCell>
              <TableCell><Badge className={e.status === 'posted' ? 'bg-green-500' : 'bg-gray-400'}>{e.status}</Badge></TableCell>
              <TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

export default JournalEntriesPage;
