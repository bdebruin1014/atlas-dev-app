import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, Building2 } from 'lucide-react';

const investments = [
  { id: 1, project: 'Watson House', investor: 'John Smith', entity: 'Smith Family Trust', amount: 400000, ownership: 20, status: 'active', returnRate: '18%' },
  { id: 2, project: 'Watson House', investor: 'Sarah Johnson', entity: 'SJ Investments LLC', amount: 300000, ownership: 15, status: 'active', returnRate: '18%' },
  { id: 3, project: 'Oslo Townhomes', investor: 'Michael Chen', entity: 'Chen Capital Partners', amount: 500000, ownership: 25, status: 'active', returnRate: '22%' },
  { id: 4, project: 'Oslo Townhomes', investor: 'John Smith', entity: 'Smith Family Trust', amount: 450000, ownership: 22.5, status: 'active', returnRate: '22%' },
  { id: 5, project: 'Riverside Commons', investor: 'Emily Davis', entity: 'Davis Holdings LLC', amount: 400000, ownership: 20, status: 'pending', returnRate: 'TBD' },
];

const InvestmentsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Investments</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Record Investment</Button>
    </div>
    <div className="grid grid-cols-4 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Investments</p><p className="text-2xl font-bold">${(investments.reduce((s, i) => s + i.amount, 0) / 1000000).toFixed(2)}M</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Active Projects</p><p className="text-2xl font-bold">3</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Avg Return</p><p className="text-2xl font-bold text-emerald-600">20%</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold text-yellow-600">${(investments.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0) / 1000).toFixed(0)}K</p></CardContent></Card>
    </div>
    <Card>
      <Table>
        <TableHeader><TableRow><TableHead>Project</TableHead><TableHead>Investor</TableHead><TableHead className="text-right">Amount</TableHead><TableHead className="text-right">Ownership</TableHead><TableHead className="text-center">Return</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>
          {investments.map((inv) => (
            <TableRow key={inv.id}>
              <TableCell className="font-medium"><div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-400" />{inv.project}</div></TableCell>
              <TableCell><div><p>{inv.investor}</p><p className="text-xs text-gray-500">{inv.entity}</p></div></TableCell>
              <TableCell className="text-right">${inv.amount.toLocaleString()}</TableCell>
              <TableCell className="text-right">{inv.ownership}%</TableCell>
              <TableCell className="text-center text-emerald-600 font-medium">{inv.returnRate}</TableCell>
              <TableCell><Badge className={inv.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}>{inv.status}</Badge></TableCell>
              <TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

export default InvestmentsPage;
