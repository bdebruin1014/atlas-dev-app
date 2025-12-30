import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Shield, Edit, Copy, Users } from 'lucide-react';

const groups = [
  { id: 1, name: 'Full Access', description: 'Complete system access', users: 1, permissions: 'All modules', isSystem: true },
  { id: 2, name: 'Project Management', description: 'Manage projects and tasks', users: 1, permissions: 'Projects, Tasks, Documents', isSystem: false },
  { id: 3, name: 'Accounting', description: 'Financial access only', users: 1, permissions: 'Accounting, Reports', isSystem: false },
  { id: 4, name: 'Read Only', description: 'View-only access', users: 2, permissions: 'View all, No edit', isSystem: true },
];

const PermissionGroupsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Permission Groups</h1><p className="text-gray-500">Create permission groups to manage access rights</p></div>
      <Button><Plus className="w-4 h-4 mr-2" />Create Group</Button>
    </div>

    <div className="grid grid-cols-4 gap-4">
      {groups.map((group) => (
        <Card key={group.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Shield className="w-5 h-5 text-purple-600" /></div>
              {group.isSystem && <Badge variant="secondary">System</Badge>}
            </div>
            <h3 className="font-semibold">{group.name}</h3>
            <p className="text-sm text-gray-500 mb-3">{group.description}</p>
            <div className="flex items-center gap-1 text-sm text-gray-400"><Users className="w-4 h-4" /><span>{group.users} users</span></div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card>
      <CardHeader><CardTitle>All Permission Groups</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Group Name</TableHead><TableHead>Description</TableHead><TableHead>Permissions</TableHead><TableHead className="text-center">Users</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><Shield className="w-4 h-4 text-gray-400" />{group.name}{group.isSystem && <Badge variant="secondary" className="text-xs">System</Badge>}</div></TableCell>
                <TableCell className="text-gray-500">{group.description}</TableCell>
                <TableCell>{group.permissions}</TableCell>
                <TableCell className="text-center">{group.users}</TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Copy className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default PermissionGroupsPage;
