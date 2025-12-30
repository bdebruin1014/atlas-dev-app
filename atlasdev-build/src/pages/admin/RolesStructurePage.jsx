import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, UserCog, Edit, Building2 } from 'lucide-react';

const projectRoles = [
  { id: 1, name: 'Project Owner', description: 'Primary owner/sponsor of the project', isDefault: true },
  { id: 2, name: 'Project Manager', description: 'Manages day-to-day project operations', isDefault: true },
  { id: 3, name: 'General Contractor', description: 'Main construction contractor', isDefault: true },
  { id: 4, name: 'Investor Contact', description: 'Primary investor relationship', isDefault: false },
  { id: 5, name: 'Lender Contact', description: 'Bank/lender relationship manager', isDefault: false },
  { id: 6, name: 'Escrow Officer', description: 'Title company escrow contact', isDefault: true },
  { id: 7, name: 'Real Estate Agent', description: 'Listing or buying agent', isDefault: false },
  { id: 8, name: 'Attorney', description: 'Legal counsel', isDefault: false },
];

const RolesStructurePage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Roles & Structure</h1><p className="text-gray-500">Configure default project roles and office type</p></div>
      <Button><Plus className="w-4 h-4 mr-2" />Add Role</Button>
    </div>

    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Office Type</CardTitle><CardDescription>Configure your organization structure</CardDescription></CardHeader>
        <CardContent>
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
            <Building2 className="w-8 h-8 text-emerald-600" />
            <div><p className="font-semibold">Real Estate Development</p><p className="text-sm text-gray-600">Development and investment company</p></div>
          </div>
          <Button variant="outline" className="mt-4">Change Office Type</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Role Statistics</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500">Total Roles</p><p className="text-xl font-bold">{projectRoles.length}</p></div>
            <div className="p-3 bg-gray-50 rounded-lg"><p className="text-sm text-gray-500">Default Roles</p><p className="text-xl font-bold">{projectRoles.filter(r => r.isDefault).length}</p></div>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader><CardTitle>Project Roles</CardTitle><CardDescription>Define the roles that can be assigned to contacts on projects</CardDescription></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Role Name</TableHead><TableHead>Description</TableHead><TableHead>Default</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {projectRoles.map((role) => (
              <TableRow key={role.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><UserCog className="w-4 h-4 text-gray-400" />{role.name}</div></TableCell>
                <TableCell className="text-gray-500">{role.description}</TableCell>
                <TableCell>{role.isDefault ? <Badge className="bg-emerald-500">Yes</Badge> : <Badge variant="outline">No</Badge>}</TableCell>
                <TableCell><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default RolesStructurePage;
