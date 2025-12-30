import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, DollarSign } from 'lucide-react';

const distributions = [
  { id: 1, date: '2024-09-30', investor: 'Bryan V.', entity: 'Olive Brynn LLC', amount: 50000, type: 'Quarterly', status: 'paid' },
  { id: 2, date: '2024-09-30', investor: 'John Smith', entity: 'Smith Family Trust', amount: 25000, type: 'Quarterly', status: 'paid' },
  { id: 3, date: '2024-09-30', investor: 'Sarah Johnson', entity: 'SJ Investments LLC', amount: 12500, type: 'Quarterly', status: 'paid' },
  { id: 4, date: '2024-12-31', investor: 'All Investors', entity: 'Multiple', amount: 150000, type: 'Year-End', status: 'scheduled' },
];

const DistributionsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Distributions</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Create Distribution</Button>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">YTD Distributed</p><p className="text-2xl font-bold text-emerald-600">${distributions.filter(d => d.status === 'paid').reduce((s, d) => s + d.amount, 0).toLocaleString()}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Scheduled</p><p className="text-2xl font-bold text-blue-600">${distributions.filter(d => d.status === 'scheduled').reduce((s, d) => s + d.amount, 0).toLocaleString()}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Distributions</p><p className="text-2xl font-bold">{distributions.length}</p></CardContent></Card>
    </div>
    <Card>
      <Table>
        <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Investor</TableHead><TableHead>Entity</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>
          {distributions.map((d) => (
            <TableRow key={d.id}>
              <TableCell>{d.date}</TableCell>
              <TableCell className="font-medium">{d.investor}</TableCell>
              <TableCell>{d.entity}</TableCell>
              <TableCell><Badge variant="outline">{d.type}</Badge></TableCell>
              <TableCell className="text-right font-medium text-emerald-600">${d.amount.toLocaleString()}</TableCell>
              <TableCell><Badge className={d.status === 'paid' ? 'bg-green-500' : 'bg-blue-500'}>{d.status}</Badge></TableCell>
              <TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

export default DistributionsPage;
