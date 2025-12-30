import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, DollarSign, Edit, Copy } from 'lucide-react';

const fees = [
  { id: 1, name: 'Development Fee', calculation: '5% of total project cost', type: 'Percentage', applicableTo: 'All Projects', status: 'active' },
  { id: 2, name: 'Construction Management', calculation: '3% of construction budget', type: 'Percentage', applicableTo: 'Spec Building', status: 'active' },
  { id: 3, name: 'Acquisition Fee', calculation: '1% of purchase price', type: 'Percentage', applicableTo: 'All Projects', status: 'active' },
  { id: 4, name: 'Asset Management', calculation: '$500/month', type: 'Flat Fee', applicableTo: 'Build to Rent', status: 'active' },
  { id: 5, name: 'Disposition Fee', calculation: '1% of sale price', type: 'Percentage', applicableTo: 'All Projects', status: 'active' },
];

const FeeScheduleDefaultPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Default Fee Schedule</h1><p className="text-gray-500">Configure default fees for all project types</p></div>
      <Button><Plus className="w-4 h-4 mr-2" />Add Fee</Button>
    </div>

    <div className="grid grid-cols-4 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Fees</p><p className="text-2xl font-bold">{fees.length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Percentage Based</p><p className="text-2xl font-bold">{fees.filter(f => f.type === 'Percentage').length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Flat Fees</p><p className="text-2xl font-bold">{fees.filter(f => f.type === 'Flat Fee').length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Active</p><p className="text-2xl font-bold text-emerald-600">{fees.filter(f => f.status === 'active').length}</p></CardContent></Card>
    </div>

    <Card>
      <CardHeader><CardTitle>Fee Schedule</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Fee Name</TableHead><TableHead>Calculation</TableHead><TableHead>Type</TableHead><TableHead>Applicable To</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {fees.map((fee) => (
              <TableRow key={fee.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><DollarSign className="w-4 h-4 text-gray-400" />{fee.name}</div></TableCell>
                <TableCell>{fee.calculation}</TableCell>
                <TableCell><Badge variant="outline">{fee.type}</Badge></TableCell>
                <TableCell className="text-gray-500">{fee.applicableTo}</TableCell>
                <TableCell><Badge className={fee.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}>{fee.status}</Badge></TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Copy className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default FeeScheduleDefaultPage;
