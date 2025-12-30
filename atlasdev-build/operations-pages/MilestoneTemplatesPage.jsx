import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Copy, Edit, Milestone } from 'lucide-react';

const templates = [
  { id: 1, name: 'Land Development', milestones: 8, duration: '18 months', projects: 3 },
  { id: 2, name: 'Spec Home Build', milestones: 12, duration: '12 months', projects: 5 },
  { id: 3, name: 'Fix & Flip', milestones: 6, duration: '6 months', projects: 8 },
  { id: 4, name: 'Multifamily Development', milestones: 15, duration: '24 months', projects: 2 },
];

const MilestoneTemplatesPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Milestone Templates</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Create Template</Button>
    </div>
    <Card>
      <Table>
        <TableHeader><TableRow><TableHead>Template Name</TableHead><TableHead className="text-center">Milestones</TableHead><TableHead>Duration</TableHead><TableHead className="text-center">Projects</TableHead><TableHead></TableHead></TableRow></TableHeader>
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

export default MilestoneTemplatesPage;
