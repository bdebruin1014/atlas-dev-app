import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, GitBranch, Edit, Play, Pause } from 'lucide-react';

const workflows = [
  { id: 1, name: 'Acquisition Workflow', stages: 5, tasks: 18, triggers: 3, status: 'active' },
  { id: 2, name: 'Due Diligence Workflow', stages: 4, tasks: 24, triggers: 5, status: 'active' },
  { id: 3, name: 'Construction Workflow', stages: 8, tasks: 45, triggers: 8, status: 'active' },
  { id: 4, name: 'Disposition Workflow', stages: 4, tasks: 15, triggers: 4, status: 'active' },
  { id: 5, name: 'Investor Reporting Workflow', stages: 3, tasks: 8, triggers: 2, status: 'active' },
];

const CoreWorkflowsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Core Workflows</h1><p className="text-gray-500">Specify tasks and automations for each workflow stage</p></div>
      <Button><Plus className="w-4 h-4 mr-2" />Create Workflow</Button>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Workflows</p><p className="text-2xl font-bold">{workflows.length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Tasks</p><p className="text-2xl font-bold">{workflows.reduce((s, w) => s + w.tasks, 0)}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Active Triggers</p><p className="text-2xl font-bold">{workflows.reduce((s, w) => s + w.triggers, 0)}</p></CardContent></Card>
    </div>

    <Card>
      <CardContent className="pt-4">
        <Table>
          <TableHeader><TableRow><TableHead>Workflow</TableHead><TableHead className="text-center">Stages</TableHead><TableHead className="text-center">Tasks</TableHead><TableHead className="text-center">Triggers</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {workflows.map((wf) => (
              <TableRow key={wf.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><GitBranch className="w-4 h-4 text-gray-400" />{wf.name}</div></TableCell>
                <TableCell className="text-center">{wf.stages}</TableCell>
                <TableCell className="text-center">{wf.tasks}</TableCell>
                <TableCell className="text-center">{wf.triggers}</TableCell>
                <TableCell><Badge className={wf.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}>{wf.status}</Badge></TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default CoreWorkflowsPage;
