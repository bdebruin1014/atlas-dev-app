import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, User, Edit, Mail, MoreHorizontal } from 'lucide-react';

const users = [
  { id: 1, name: 'Bryan V.', email: 'bryan@vanrock.com', role: 'Owner', permissionGroup: 'Full Access', status: 'active', lastLogin: '2 hours ago' },
  { id: 2, name: 'Sarah Mitchell', email: 'sarah@vanrock.com', role: 'Project Manager', permissionGroup: 'Project Management', status: 'active', lastLogin: '1 day ago' },
  { id: 3, name: 'John Davis', email: 'john@vanrock.com', role: 'Accountant', permissionGroup: 'Accounting', status: 'active', lastLogin: '3 hours ago' },
  { id: 4, name: 'Emily Chen', email: 'emily@vanrock.com', role: 'Analyst', permissionGroup: 'Read Only', status: 'active', lastLogin: '5 days ago' },
  { id: 5, name: 'Mike Thompson', email: 'mike@vanrock.com', role: 'Contractor', permissionGroup: 'Limited Access', status: 'inactive', lastLogin: '30 days ago' },
];

const UsersPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Users</h1><p className="text-gray-500">View user information and invite users</p></div>
      <Button><Plus className="w-4 h-4 mr-2" />Invite User</Button>
    </div>

    <div className="grid grid-cols-4 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Users</p><p className="text-2xl font-bold">{users.length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Active</p><p className="text-2xl font-bold text-emerald-600">{users.filter(u => u.status === 'active').length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Inactive</p><p className="text-2xl font-bold text-gray-400">{users.filter(u => u.status === 'inactive').length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Pending Invites</p><p className="text-2xl font-bold text-yellow-600">0</p></CardContent></Card>
    </div>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Users</CardTitle>
        <div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search users..." className="pl-9" /></div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Permission Group</TableHead><TableHead>Last Login</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell><div className="flex items-center gap-3"><div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center"><User className="w-4 h-4 text-emerald-600" /></div><div><p className="font-medium">{user.name}</p><p className="text-xs text-gray-500">{user.email}</p></div></div></TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell><Badge variant="outline">{user.permissionGroup}</Badge></TableCell>
                <TableCell className="text-gray-500">{user.lastLogin}</TableCell>
                <TableCell><Badge className={user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}>{user.status}</Badge></TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><MoreHorizontal className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default UsersPage;
