import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, DollarSign, Edit } from 'lucide-react';

const charges = [
  { id: 1, name: 'Title Insurance', type: 'Closing Cost', paidBy: 'Buyer', amount: 'Based on sale price', category: 'Title' },
  { id: 2, name: 'Escrow Fee', type: 'Closing Cost', paidBy: 'Split', amount: '$500', category: 'Escrow' },
  { id: 3, name: 'Recording Fees', type: 'Closing Cost', paidBy: 'Buyer', amount: 'Actual', category: 'Government' },
  { id: 4, name: 'Survey', type: 'Closing Cost', paidBy: 'Seller', amount: '$400-600', category: 'Services' },
  { id: 5, name: 'Home Warranty', type: 'Prepaid', paidBy: 'Seller', amount: '$450', category: 'Insurance' },
];

const ProjectDefaultsChargesPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Project Defaults - Charges</h1><p className="text-gray-500">Configure default charges and fees</p></div>
      <Button><Plus className="w-4 h-4 mr-2" />Add Charge</Button>
    </div>

    <Card>
      <CardHeader><CardTitle>Paid By Others</CardTitle><CardDescription>Configure default charges paid by other parties</CardDescription></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Charge Name</TableHead><TableHead>Type</TableHead><TableHead>Paid By</TableHead><TableHead>Default Amount</TableHead><TableHead>Category</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {charges.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell><Badge variant="outline">{c.type}</Badge></TableCell>
                <TableCell>{c.paidBy}</TableCell>
                <TableCell>{c.amount}</TableCell>
                <TableCell className="text-gray-500">{c.category}</TableCell>
                <TableCell><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Prepaid Items</CardTitle><CardDescription>Configure default prepaid items</CardDescription></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <p className="font-medium">Property Taxes</p>
            <p className="text-sm text-gray-500">Months prepaid: 3</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="font-medium">Homeowner's Insurance</p>
            <p className="text-sm text-gray-500">Months prepaid: 12</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="font-medium">Mortgage Insurance</p>
            <p className="text-sm text-gray-500">If applicable</p>
          </div>
          <div className="p-4 border rounded-lg">
            <p className="font-medium">Interest</p>
            <p className="text-sm text-gray-500">Per diem to first payment</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ProjectDefaultsChargesPage;
