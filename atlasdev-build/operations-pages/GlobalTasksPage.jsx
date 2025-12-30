import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';

const mockTasks = [
  { id: 1, title: 'Review Watson House draw request', project: 'Watson House', assignee: 'Bryan V.', dueDate: '2024-11-05', priority: 'high', status: 'in_progress' },
  { id: 2, title: 'Submit Oslo permit application', project: 'Oslo Townhomes', assignee: 'Sarah M.', dueDate: '2024-11-08', priority: 'medium', status: 'not_started' },
  { id: 3, title: 'Schedule site inspection', project: 'Watson House', assignee: 'Bryan V.', dueDate: '2024-11-10', priority: 'low', status: 'not_started' },
  { id: 4, title: 'Finalize investor documents', project: 'Riverside Commons', assignee: 'John D.', dueDate: '2024-11-12', priority: 'high', status: 'in_progress' },
  { id: 5, title: 'Review construction budget', project: 'Oslo Townhomes', assignee: 'Bryan V.', dueDate: '2024-11-15', priority: 'medium', status: 'completed' },
];

const GlobalTasksPage = () => {
  const [filter, setFilter] = useState('all');
  const filteredTasks = filter === 'all' ? mockTasks : mockTasks.filter(t => t.status === filter);
  const priorityColors = { high: 'bg-red-100 text-red-700', medium: 'bg-yellow-100 text-yellow-700', low: 'bg-green-100 text-green-700' };
  const statusColors = { completed: 'bg-green-500', in_progress: 'bg-blue-500', not_started: 'bg-gray-400' };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <Button><Plus className="w-4 h-4 mr-2" />Add Task</Button>
      </div>
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Tasks</p><p className="text-2xl font-bold">{mockTasks.length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">In Progress</p><p className="text-2xl font-bold text-blue-600">{mockTasks.filter(t => t.status === 'in_progress').length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Completed</p><p className="text-2xl font-bold text-green-600">{mockTasks.filter(t => t.status === 'completed').length}</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">High Priority</p><p className="text-2xl font-bold text-red-600">{mockTasks.filter(t => t.priority === 'high').length}</p></CardContent></Card>
      </div>
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search tasks..." className="pl-9" /></div>
        <Select value={filter} onValueChange={setFilter}><SelectTrigger className="w-40"><SelectValue placeholder="Filter" /></SelectTrigger><SelectContent><SelectItem value="all">All Tasks</SelectItem><SelectItem value="not_started">Not Started</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select>
      </div>
      <Card>
        <Table>
          <TableHeader><TableRow><TableHead>Task</TableHead><TableHead>Project</TableHead><TableHead>Assignee</TableHead><TableHead>Due Date</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{task.project}</TableCell>
                <TableCell>{task.assignee}</TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell><Badge className={priorityColors[task.priority]}>{task.priority}</Badge></TableCell>
                <TableCell><Badge className={statusColors[task.status]}>{task.status.replace('_', ' ')}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default GlobalTasksPage;
