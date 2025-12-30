import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, UsersRound, Edit, User } from 'lucide-react';

const groups = [
  { id: 1, name: 'Project Managers', members: ['Bryan V.', 'Sarah M.'], tasksAssigned: 45 },
  { id: 2, name: 'Accounting Team', members: ['John D.', 'Emily C.'], tasksAssigned: 32 },
  { id: 3, name: 'Construction Oversight', members: ['Bryan V.', 'Mike T.'], tasksAssigned: 28 },
];

const AssignmentGroupsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Assignment Groups</h1><p className="text-gray-500">Create groups for task assignment</p></div>
      <Button><Plus className="w-4 h-4 mr-2" />Create Group</Button>
    </div>

    <div className="grid grid-cols-3 gap-4">
      {groups.map((group) => (
        <Card key={group.id} className="cursor-pointer hover:shadow-md">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><UsersRound className="w-5 h-5 text-blue-600" /></div>
              <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
            </div>
            <h3 className="font-semibold">{group.name}</h3>
            <div className="flex flex-wrap gap-1 mt-2 mb-3">
              {group.members.map((m) => <Badge key={m} variant="secondary" className="text-xs">{m}</Badge>)}
            </div>
            <p className="text-sm text-gray-500">{group.tasksAssigned} tasks assigned</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card>
      <CardHeader><CardTitle>All Assignment Groups</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Group Name</TableHead><TableHead>Members</TableHead><TableHead className="text-center">Tasks Assigned</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><UsersRound className="w-4 h-4 text-gray-400" />{group.name}</div></TableCell>
                <TableCell><div className="flex gap-1">{group.members.map((m) => <Badge key={m} variant="outline" className="text-xs">{m}</Badge>)}</div></TableCell>
                <TableCell className="text-center">{group.tasksAssigned}</TableCell>
                <TableCell><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default AssignmentGroupsPage;
