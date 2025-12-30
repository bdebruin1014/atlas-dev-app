import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Download, FileText, Send } from 'lucide-react';

const documents = [
  { id: 1, year: 2023, investor: 'Bryan V.', entity: 'Olive Brynn LLC', status: 'sent', sentDate: '2024-03-01' },
  { id: 2, year: 2023, investor: 'John Smith', entity: 'Smith Family Trust', status: 'sent', sentDate: '2024-03-01' },
  { id: 3, year: 2023, investor: 'Sarah Johnson', entity: 'SJ Investments LLC', status: 'sent', sentDate: '2024-03-01' },
  { id: 4, year: 2024, investor: 'All Investors', entity: 'Multiple', status: 'pending', sentDate: null },
];

const K1DocumentsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">K-1 Documents</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Generate K-1s</Button>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total K-1s</p><p className="text-2xl font-bold">{documents.length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Sent</p><p className="text-2xl font-bold text-emerald-600">{documents.filter(d => d.status === 'sent').length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold text-yellow-600">{documents.filter(d => d.status === 'pending').length}</p></CardContent></Card>
    </div>
    <Card>
      <Table>
        <TableHeader><TableRow><TableHead>Year</TableHead><TableHead>Investor</TableHead><TableHead>Entity</TableHead><TableHead>Sent Date</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>
          {documents.map((d) => (
            <TableRow key={d.id}>
              <TableCell className="font-medium"><div className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" />{d.year}</div></TableCell>
              <TableCell>{d.investor}</TableCell>
              <TableCell>{d.entity}</TableCell>
              <TableCell>{d.sentDate || '-'}</TableCell>
              <TableCell><Badge className={d.status === 'sent' ? 'bg-green-500' : 'bg-yellow-500'}>{d.status}</Badge></TableCell>
              <TableCell><div className="flex gap-1">{d.status === 'sent' && <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>}{d.status === 'pending' && <Button variant="ghost" size="sm"><Send className="w-4 h-4" /></Button>}</div></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

export default K1DocumentsPage;
