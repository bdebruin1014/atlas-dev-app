import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const wires = [
  { id: 1, date: '2024-11-01', type: 'outgoing', recipient: 'Metro Electric Supply', amount: 95000, status: 'completed', reference: 'WR-2024-001' },
  { id: 2, date: '2024-10-28', type: 'incoming', sender: 'Smith Family Trust', amount: 100000, status: 'completed', reference: 'WR-2024-002' },
  { id: 3, date: '2024-10-25', type: 'outgoing', recipient: 'ABC Lumber Co', amount: 145000, status: 'completed', reference: 'WR-2024-003' },
  { id: 4, date: '2024-11-05', type: 'outgoing', recipient: 'Denver Plumbing', amount: 88000, status: 'pending', reference: 'WR-2024-004' },
];

const WireTrackingPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Wire Tracking</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Initiate Wire</Button>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Outgoing (MTD)</p><p className="text-2xl font-bold text-red-600">${wires.filter(w => w.type === 'outgoing').reduce((s, w) => s + w.amount, 0).toLocaleString()}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Incoming (MTD)</p><p className="text-2xl font-bold text-emerald-600">${wires.filter(w => w.type === 'incoming').reduce((s, w) => s + w.amount, 0).toLocaleString()}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold text-yellow-600">${wires.filter(w => w.status === 'pending').reduce((s, w) => s + w.amount, 0).toLocaleString()}</p></CardContent></Card>
    </div>
    <Card>
      <Table>
        <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Reference</TableHead><TableHead>Type</TableHead><TableHead>Recipient/Sender</TableHead><TableHead className="text-right">Amount</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>
          {wires.map((w) => (
            <TableRow key={w.id}>
              <TableCell>{w.date}</TableCell>
              <TableCell className="font-medium">{w.reference}</TableCell>
              <TableCell><div className="flex items-center gap-1">{w.type === 'outgoing' ? <ArrowUpRight className="w-4 h-4 text-red-500" /> : <ArrowDownLeft className="w-4 h-4 text-emerald-500" />}{w.type}</div></TableCell>
              <TableCell>{w.recipient || w.sender}</TableCell>
              <TableCell className={`text-right font-medium ${w.type === 'outgoing' ? 'text-red-600' : 'text-emerald-600'}`}>${w.amount.toLocaleString()}</TableCell>
              <TableCell><Badge className={w.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}>{w.status}</Badge></TableCell>
              <TableCell><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

export default WireTrackingPage;
