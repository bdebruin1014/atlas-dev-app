import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, FolderOpen, Edit, Copy } from 'lucide-react';

const transactionTypes = [
  { id: 1, name: 'Lot Development', code: 'LOT', isStandard: true, projects: 2 },
  { id: 2, name: 'Spec Building', code: 'SPEC', isStandard: true, projects: 3 },
  { id: 3, name: 'Fix & Flip', code: 'FLIP', isStandard: true, projects: 1 },
  { id: 4, name: 'Build to Rent', code: 'BTR', isStandard: true, projects: 0 },
];

const WorkflowTypesPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Transaction Types</h1><p className="text-gray-500">Configure available project types and their workflows</p></div>
      <Button><Plus className="w-4 h-4 mr-2" />Add Type</Button>
    </div>

    <div className="grid grid-cols-4 gap-4">
      {transactionTypes.map((type) => (
        <Card key={type.id} className="cursor-pointer hover:shadow-md">
          <CardContent className="pt-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-3"><FolderOpen className="w-5 h-5 text-emerald-600" /></div>
            <h3 className="font-semibold">{type.name}</h3>
            <p className="text-sm text-gray-500 mb-2">Code: {type.code}</p>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{type.projects} projects</Badge>
              {type.isStandard && <Badge variant="secondary">Standard</Badge>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card>
      <CardHeader><CardTitle>All Transaction Types</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Type Name</TableHead><TableHead>Code</TableHead><TableHead className="text-center">Projects</TableHead><TableHead>Standard</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {transactionTypes.map((type) => (
              <TableRow key={type.id}>
                <TableCell className="font-medium">{type.name}</TableCell>
                <TableCell><Badge variant="outline">{type.code}</Badge></TableCell>
                <TableCell className="text-center">{type.projects}</TableCell>
                <TableCell>{type.isStandard ? <Badge className="bg-blue-500">Standard</Badge> : <Badge variant="outline">Custom</Badge>}</TableCell>
                <TableCell><div className="flex gap-1"><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button><Button variant="ghost" size="sm"><Copy className="w-4 h-4" /></Button></div></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default WorkflowTypesPage;
