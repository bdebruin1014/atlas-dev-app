import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, FileStack, Edit, Copy, Trash2 } from 'lucide-react';

const templates = [
  { id: 1, name: 'Standard Lot Development', type: 'Lot Development', tasks: 18, milestones: 6, uses: 8 },
  { id: 2, name: 'Spec Home - Standard', type: 'Spec Building', tasks: 32, milestones: 12, uses: 15 },
  { id: 3, name: 'Spec Home - Custom', type: 'Spec Building', tasks: 45, milestones: 15, uses: 5 },
  { id: 4, name: 'Fix & Flip - Quick Turn', type: 'Fix & Flip', tasks: 15, milestones: 5, uses: 12 },
  { id: 5, name: 'Fix & Flip - Major Reno', type: 'Fix & Flip', tasks: 28, milestones: 8, uses: 6 },
  { id: 6, name: 'Build to Rent - Single', type: 'Build to Rent', tasks: 35, milestones: 10, uses: 2 },
  { id: 7, name: 'Build to Rent - Multi', type: 'Build to Rent', tasks: 50, milestones: 14, uses: 1 },
  { id: 8, name: 'Land Acquisition Only', type: 'Lot Development', tasks: 12, milestones: 4, uses: 4 },
];

const ProjectTemplatesPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Project Templates</h1><p className="text-gray-500">Create templates to speed up project creation</p></div>
      <Button><Plus className="w-4 h-4 mr-2" />Create Template</Button>
    </div>

    <div className="grid grid-cols-4 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Templates</p><p className="text-2xl font-bold">{templates.length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Uses</p><p className="text-2xl font-bold">{templates.reduce((s, t) => s + t.uses, 0)}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Avg Tasks</p><p className="text-2xl font-bold">{Math.round(templates.reduce((s, t) => s + t.tasks, 0) / templates.length)}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Avg Milestones</p><p className="text-2xl font-bold">{Math.round(templates.reduce((s, t) => s + t.milestones, 0) / templates.length)}</p></CardContent></Card>
    </div>

    <Card>
      <CardContent className="pt-4">
        <Table>
          <TableHeader><TableRow><TableHead>Template Name</TableHead><TableHead>Project Type</TableHead><TableHead className="text-center">Tasks</TableHead><TableHead className="text-center">Milestones</TableHead><TableHead className="text-center">Uses</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {templates.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><FileStack className="w-4 h-4 text-gray-400" />{t.name}</div></TableCell>
                <TableCell><Badge variant="outline">{t.type}</Badge></TableCell>
                <TableCell className="text-center">{t.tasks}</TableCell>
                <TableCell className="text-center">{t.milestones}</TableCell>
                <TableCell className="text-center">{t.uses}</TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Copy className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default ProjectTemplatesPage;
