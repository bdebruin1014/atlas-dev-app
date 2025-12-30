import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Copy, Edit, ListChecks } from 'lucide-react';

const templates = [
  { id: 1, name: 'New Project Setup', tasks: 12, category: 'Project Initiation', lastUsed: '2024-10-15' },
  { id: 2, name: 'Due Diligence Checklist', tasks: 18, category: 'Acquisition', lastUsed: '2024-10-20' },
  { id: 3, name: 'Construction Kickoff', tasks: 8, category: 'Construction', lastUsed: '2024-09-28' },
  { id: 4, name: 'Closing Checklist', tasks: 15, category: 'Disposition', lastUsed: '2024-10-01' },
];

const TaskTemplatesPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Task Templates</h1>
      <Button><Plus className="w-4 h-4 mr-2" />Create Template</Button>
    </div>
    <Card>
      <Table>
        <TableHeader><TableRow><TableHead>Template Name</TableHead><TableHead>Category</TableHead><TableHead className="text-center">Tasks</TableHead><TableHead>Last Used</TableHead><TableHead></TableHead></TableRow></TableHeader>
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

export default TaskTemplatesPage;
