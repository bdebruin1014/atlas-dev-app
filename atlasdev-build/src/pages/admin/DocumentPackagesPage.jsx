import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Package, Edit, Copy, Play } from 'lucide-react';

const packages = [
  { id: 1, name: 'Acquisition Package', documents: 8, category: 'Acquisition', uses: 24 },
  { id: 2, name: 'Due Diligence Package', documents: 12, category: 'Due Diligence', uses: 18 },
  { id: 3, name: 'Construction Start Package', documents: 6, category: 'Construction', uses: 15 },
  { id: 4, name: 'Draw Request Package', documents: 4, category: 'Construction', uses: 45 },
  { id: 5, name: 'Closing Package - Buyer', documents: 15, category: 'Closing', uses: 22 },
  { id: 6, name: 'Closing Package - Seller', documents: 12, category: 'Closing', uses: 22 },
  { id: 7, name: 'Investor Onboarding', documents: 5, category: 'Investors', uses: 12 },
  { id: 8, name: 'K-1 Distribution Package', documents: 3, category: 'Tax', uses: 8 },
];

const DocumentPackagesPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Document Packages</h1><p className="text-gray-500">Group documents for easy generation together</p></div>
      <Button><Plus className="w-4 h-4 mr-2" />Create Package</Button>
    </div>

    <div className="grid grid-cols-4 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Packages</p><p className="text-2xl font-bold">{packages.length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Documents</p><p className="text-2xl font-bold">{packages.reduce((s, p) => s + p.documents, 0)}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Uses</p><p className="text-2xl font-bold">{packages.reduce((s, p) => s + p.uses, 0)}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Categories</p><p className="text-2xl font-bold">6</p></CardContent></Card>
    </div>

    <Card>
      <CardContent className="pt-4">
        <Table>
          <TableHeader><TableRow><TableHead>Package Name</TableHead><TableHead>Category</TableHead><TableHead className="text-center">Documents</TableHead><TableHead className="text-center">Uses</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {packages.map((pkg) => (
              <TableRow key={pkg.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><Package className="w-4 h-4 text-gray-400" />{pkg.name}</div></TableCell>
                <TableCell><Badge variant="outline">{pkg.category}</Badge></TableCell>
                <TableCell className="text-center">{pkg.documents}</TableCell>
                <TableCell className="text-center">{pkg.uses}</TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="sm"><Play className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Copy className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default DocumentPackagesPage;
