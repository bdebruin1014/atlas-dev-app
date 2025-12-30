import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Copy, Edit, Trash2, ListChecks, Milestone, BarChart3, Package, Search } from 'lucide-react';

// Task Templates Page
const TaskTemplatesPage = () => {
  const templates = [
    { id: 1, name: 'New Project Setup', tasks: 12, category: 'Project Initiation', lastUsed: '2024-10-15' },
    { id: 2, name: 'Due Diligence Checklist', tasks: 18, category: 'Acquisition', lastUsed: '2024-10-20' },
    { id: 3, name: 'Construction Kickoff', tasks: 8, category: 'Construction', lastUsed: '2024-09-28' },
    { id: 4, name: 'Closing Checklist', tasks: 15, category: 'Disposition', lastUsed: '2024-10-01' },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Task Templates</h1>
        <Button><Plus className="w-4 h-4 mr-2" />Create Template</Button>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-center">Tasks</TableHead>
              <TableHead>Last Used</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><ListChecks className="w-4 h-4 text-gray-400" />{t.name}</div></TableCell>
                <TableCell><Badge variant="outline">{t.category}</Badge></TableCell>
                <TableCell className="text-center">{t.tasks}</TableCell>
                <TableCell>{t.lastUsed}</TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="sm"><Copy className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

// Milestone Templates Page
const MilestoneTemplatesPage = () => {
  const templates = [
    { id: 1, name: 'Land Development', milestones: 8, duration: '18 months', projects: 3 },
    { id: 2, name: 'Spec Home Build', milestones: 12, duration: '12 months', projects: 5 },
    { id: 3, name: 'Fix & Flip', milestones: 6, duration: '6 months', projects: 8 },
    { id: 4, name: 'Multifamily Development', milestones: 15, duration: '24 months', projects: 2 },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Milestone Templates</h1>
        <Button><Plus className="w-4 h-4 mr-2" />Create Template</Button>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template Name</TableHead>
              <TableHead className="text-center">Milestones</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-center">Projects Using</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><Milestone className="w-4 h-4 text-gray-400" />{t.name}</div></TableCell>
                <TableCell className="text-center">{t.milestones}</TableCell>
                <TableCell>{t.duration}</TableCell>
                <TableCell className="text-center"><Badge variant="outline">{t.projects}</Badge></TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="sm"><Copy className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

// Operations Reports Page
const OperationsReportsPage = () => {
  const reports = [
    { id: 1, name: 'Project Status Summary', type: 'Dashboard', lastRun: '2024-11-01' },
    { id: 2, name: 'Task Completion Report', type: 'Performance', lastRun: '2024-10-28' },
    { id: 3, name: 'Budget vs Actual', type: 'Financial', lastRun: '2024-10-25' },
    { id: 4, name: 'Timeline Analysis', type: 'Schedule', lastRun: '2024-10-20' },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Operations Reports</h1>
        <Button><Plus className="w-4 h-4 mr-2" />Create Report</Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {reports.map((r) => (
          <Card key={r.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{r.name}</p>
                    <p className="text-sm text-gray-500">{r.type}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Run</Button>
              </div>
              <p className="text-xs text-gray-400 mt-3">Last run: {r.lastRun}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Product Library Page
const ProductLibraryPage = () => {
  const products = [
    { id: 1, name: 'Standard Cabinet Package', category: 'Cabinets', cost: 4500, supplier: 'ABC Cabinets' },
    { id: 2, name: 'Premium Cabinet Package', category: 'Cabinets', cost: 8500, supplier: 'ABC Cabinets' },
    { id: 3, name: 'Hardwood Flooring', category: 'Flooring', cost: 6.50, supplier: 'Floor Depot', unit: 'sqft' },
    { id: 4, name: 'LVP Flooring', category: 'Flooring', cost: 3.25, supplier: 'Floor Depot', unit: 'sqft' },
    { id: 5, name: 'HVAC System - 3 Ton', category: 'HVAC', cost: 8500, supplier: 'Climate Control' },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Product Library</h1>
        <Button><Plus className="w-4 h-4 mr-2" />Add Product</Button>
      </div>
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search products..." className="pl-9" />
        </div>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Supplier</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
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
};

export { TaskTemplatesPage, MilestoneTemplatesPage, OperationsReportsPage, ProductLibraryPage };
