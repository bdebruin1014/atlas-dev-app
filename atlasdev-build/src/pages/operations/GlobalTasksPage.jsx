import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Search, CheckSquare, Clock, Calendar, User, Filter, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

const mockTasks = [
  { id: 1, title: 'Review draw request #5', project: 'Watson House', assignee: 'Bryan', due: '2024-06-20', priority: 'high', status: 'pending', category: 'Financial' },
  { id: 2, title: 'Complete monthly reconciliation', project: 'All Entities', assignee: 'John', due: '2024-06-30', priority: 'medium', status: 'in_progress', category: 'Accounting' },
  { id: 3, title: 'Investor distribution Q2', project: 'VanRock Holdings', assignee: 'Bryan', due: '2024-07-01', priority: 'high', status: 'pending', category: 'Financial' },
  { id: 4, title: 'Insurance renewal review', project: 'Watson House', assignee: 'Sarah', due: '2024-07-15', priority: 'low', status: 'pending', category: 'Admin' },
  { id: 5, title: 'Site inspection - foundation', project: 'Oslo Townhomes', assignee: 'Mike', due: '2024-06-22', priority: 'medium', status: 'completed', category: 'Construction' },
  { id: 6, title: 'Update project budget', project: 'Pine Valley Lots', assignee: 'Bryan', due: '2024-06-18', priority: 'medium', status: 'completed', category: 'Financial' },
];

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const GlobalTasksPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredTasks = mockTasks.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const pendingCount = mockTasks.filter(t => t.status === 'pending').length;
  const inProgressCount = mockTasks.filter(t => t.status === 'in_progress').length;
  const completedCount = mockTasks.filter(t => t.status === 'completed').length;

  return (
    <>
      <Helmet><title>Tasks | AtlasDev</title></Helmet>
      <div className="flex flex-col h-[calc(100vh-56px)] bg-[#F7FAFC]">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div><h1 className="text-2xl font-bold text-gray-900">Tasks</h1><p className="text-gray-500">Manage tasks across all projects</p></div>
            <Button className="bg-[#2F855A] hover:bg-[#276749]"><Plus className="w-4 h-4 mr-2" /> New Task</Button>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Total Tasks</p><p className="text-2xl font-bold">{mockTasks.length}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Pending</p><p className="text-2xl font-bold text-yellow-600">{pendingCount}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">In Progress</p><p className="text-2xl font-bold text-blue-600">{inProgressCount}</p></CardContent></Card>
            <Card><CardContent className="pt-4"><p className="text-xs text-gray-500 uppercase">Completed</p><p className="text-2xl font-bold text-green-600">{completedCount}</p></CardContent></Card>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-40"><SelectValue placeholder="All Status" /></SelectTrigger><SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="completed">Completed</SelectItem></SelectContent></Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}><SelectTrigger className="w-40"><SelectValue placeholder="All Priority" /></SelectTrigger><SelectContent><SelectItem value="all">All Priority</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="low">Low</SelectItem></SelectContent></Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredTasks.map(task => (
                  <div key={task.id} className={cn("flex items-center gap-4 p-4 hover:bg-gray-50", task.status === 'completed' && "opacity-60")}>
                    <Checkbox checked={task.status === 'completed'} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2"><p className={cn("font-medium", task.status === 'completed' && "line-through")}>{task.title}</p><Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'secondary' : 'outline'} className="text-xs">{task.priority}</Badge></div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500"><span className="flex items-center gap-1"><CheckSquare className="w-3 h-3" />{task.project}</span><span className="flex items-center gap-1"><User className="w-3 h-3" />{task.assignee}</span><span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(task.due)}</span></div>
                    </div>
                    <Badge variant="outline">{task.category}</Badge>
                    <Badge className={task.status === 'completed' ? 'bg-green-100 text-green-800' : task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}>{task.status.replace('_', ' ')}</Badge>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default GlobalTasksPage;
