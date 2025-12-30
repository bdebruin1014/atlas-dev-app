import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Package, Search } from 'lucide-react';

const products = [
  { id: 1, name: 'Standard Cabinet Package', category: 'Cabinets', cost: 4500, supplier: 'ABC Cabinets' },
  { id: 2, name: 'Premium Cabinet Package', category: 'Cabinets', cost: 8500, supplier: 'ABC Cabinets' },
  { id: 3, name: 'Hardwood Flooring', category: 'Flooring', cost: 6.50, supplier: 'Floor Depot', unit: 'sqft' },
  { id: 4, name: 'LVP Flooring', category: 'Flooring', cost: 3.25, supplier: 'Floor Depot', unit: 'sqft' },
  { id: 5, name: 'HVAC System - 3 Ton', category: 'HVAC', cost: 8500, supplier: 'Climate Control' },
];

const ProductLibraryPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Product Library</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Add Product</Button>
    </div>
    <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search products..." className="pl-9 max-w-md" /></div>
    <Card>
      <Table>
        <TableHeader><TableRow><TableHead>Product Name</TableHead><TableHead>Category</TableHead><TableHead>Supplier</TableHead><TableHead className="text-right">Cost</TableHead><TableHead></TableHead></TableRow></TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-medium"><div className="flex items-center gap-2"><Package className="w-4 h-4 text-gray-400" />{p.name}</div></TableCell>
              <TableCell><Badge variant="outline">{p.category}</Badge></TableCell>
              <TableCell>{p.supplier}</TableCell>
              <TableCell className="text-right">${p.cost.toLocaleString()}{p.unit ? `/${p.unit}` : ''}</TableCell>
              <TableCell><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  </div>
);

export default ProductLibraryPage;
