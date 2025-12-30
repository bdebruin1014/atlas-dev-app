import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Zap, Edit, Play, Pause } from 'lucide-react';

const smartActions = [
  { id: 1, name: 'Auto-assign PM on project creation', trigger: 'Project Created', actions: 2, runs: 45, status: 'active' },
  { id: 2, name: 'Notify lender on draw submission', trigger: 'Draw Submitted', actions: 1, runs: 128, status: 'active' },
  { id: 3, name: 'Create investor report monthly', trigger: 'Schedule (Monthly)', actions: 3, runs: 12, status: 'active' },
  { id: 4, name: 'Alert on budget overage', trigger: 'Budget > 90%', actions: 2, runs: 8, status: 'active' },
  { id: 5, name: 'Auto-close completed milestones', trigger: 'All Tasks Complete', actions: 1, runs: 67, status: 'active' },
];

const SmartActionsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Smart Actions</h1><p className="text-gray-500">Configure automations triggered by conditions</p></div>
      <Button><Plus className="w-4 h-4 mr-2" />Create Action</Button>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><Zap className="w-8 h-8 text-yellow-500" /><div><p className="text-sm text-gray-500">Action Groups</p><p className="text-2xl font-bold">{smartActions.length}</p></div></div></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Runs (MTD)</p><p className="text-2xl font-bold">{smartActions.reduce((s, a) => s + a.runs, 0)}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Active</p><p className="text-2xl font-bold text-emerald-600">{smartActions.filter(a => a.status === 'active').length}</p></CardContent></Card>
    </div>

    <Card>
      <CardContent className="pt-4">
        <Table>
          <TableHeader><TableRow><TableHead>Action Name</TableHead><TableHead>Trigger</TableHead><TableHead className="text-center">Actions</TableHead><TableHead className="text-center">Runs</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {smartActions.map((action) => (
              <TableRow key={action.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><Zap className="w-4 h-4 text-yellow-500" />{action.name}</div></TableCell>
                <TableCell><Badge variant="outline">{action.trigger}</Badge></TableCell>
                <TableCell className="text-center">{action.actions}</TableCell>
                <TableCell className="text-center">{action.runs}</TableCell>
                <TableCell><Badge className={action.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}>{action.status}</Badge></TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="sm">{action.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</Button><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default SmartActionsPage;
