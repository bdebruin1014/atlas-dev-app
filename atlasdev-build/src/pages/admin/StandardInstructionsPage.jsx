import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, FileSignature, Edit, Copy } from 'lucide-react';

const clauses = [
  { id: 1, name: 'Standard Closing Instructions', type: 'Clause', category: 'Closing', uses: 45 },
  { id: 2, name: 'Wire Instructions', type: 'Clause', category: 'Payments', uses: 38 },
  { id: 3, name: 'Title Requirements', type: 'Clause Group', category: 'Title', uses: 32 },
  { id: 4, name: 'Proration Language', type: 'Clause', category: 'Prorations', uses: 28 },
  { id: 5, name: 'Earnest Money Terms', type: 'Clause', category: 'Deposits', uses: 24 },
];

const StandardInstructionsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Standard Instructions</h1><p className="text-gray-500">Specify clauses and clause groups for standard instructions</p></div>
      <Button><Plus className="w-4 h-4 mr-2" />Add Clause</Button>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Clauses</p><p className="text-2xl font-bold">{clauses.filter(c => c.type === 'Clause').length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Clause Groups</p><p className="text-2xl font-bold">{clauses.filter(c => c.type === 'Clause Group').length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Uses</p><p className="text-2xl font-bold">{clauses.reduce((s, c) => s + c.uses, 0)}</p></CardContent></Card>
    </div>

    <Card>
      <CardContent className="pt-4">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Type</TableHead><TableHead>Category</TableHead><TableHead className="text-center">Uses</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {clauses.map((clause) => (
              <TableRow key={clause.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><FileSignature className="w-4 h-4 text-gray-400" />{clause.name}</div></TableCell>
                <TableCell><Badge variant={clause.type === 'Clause' ? 'outline' : 'secondary'}>{clause.type}</Badge></TableCell>
                <TableCell>{clause.category}</TableCell>
                <TableCell className="text-center">{clause.uses}</TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Copy className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default StandardInstructionsPage;
