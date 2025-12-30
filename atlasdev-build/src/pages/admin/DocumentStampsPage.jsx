import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Stamp, Edit } from 'lucide-react';

const stamps = [
  { id: 1, name: 'DRAFT', color: 'Red', position: 'Diagonal', preset: true },
  { id: 2, name: 'CONFIDENTIAL', color: 'Red', position: 'Top Center', preset: true },
  { id: 3, name: 'APPROVED', color: 'Green', position: 'Bottom Right', preset: true },
  { id: 4, name: 'COPY', color: 'Blue', position: 'Diagonal', preset: true },
  { id: 5, name: 'VOID', color: 'Red', position: 'Diagonal', preset: true },
  { id: 6, name: 'RECEIVED', color: 'Blue', position: 'Top Right', preset: true },
];

const DocumentStampsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Document Stamps</h1><p className="text-gray-500">Configure stamps to add to documents</p></div>
      <Button><Plus className="w-4 h-4 mr-2" />Create Stamp</Button>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Custom Stamps</p><p className="text-2xl font-bold">0</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Preset Stamps</p><p className="text-2xl font-bold">{stamps.length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Available</p><p className="text-2xl font-bold">{stamps.length}</p></CardContent></Card>
    </div>

    <Card>
      <CardHeader><CardTitle>Available Stamps</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Stamp Text</TableHead><TableHead>Color</TableHead><TableHead>Position</TableHead><TableHead>Type</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {stamps.map((stamp) => (
              <TableRow key={stamp.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><Stamp className="w-4 h-4 text-gray-400" />{stamp.name}</div></TableCell>
                <TableCell><Badge className={stamp.color === 'Red' ? 'bg-red-500' : stamp.color === 'Green' ? 'bg-green-500' : 'bg-blue-500'}>{stamp.color}</Badge></TableCell>
                <TableCell>{stamp.position}</TableCell>
                <TableCell>{stamp.preset ? <Badge variant="secondary">Preset</Badge> : <Badge variant="outline">Custom</Badge>}</TableCell>
                <TableCell>{!stamp.preset && <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default DocumentStampsPage;
