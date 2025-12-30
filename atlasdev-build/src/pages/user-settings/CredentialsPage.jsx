import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Key, Link2, CheckCircle, ExternalLink, Trash2 } from 'lucide-react';

const integrations = [
  { id: 1, name: 'QuickBooks Online', type: 'Accounting', status: 'active', lastSync: '2 hours ago' },
  { id: 2, name: 'Microsoft 365', type: 'Productivity', status: 'active', lastSync: '30 min ago' },
  { id: 3, name: 'Plaid', type: 'Banking', status: 'active', lastSync: '1 hour ago' },
];

const availableIntegrations = [
  { id: 4, name: 'DocuSign', description: 'Electronic signature service' },
  { id: 5, name: 'Google Workspace', description: 'Email and calendar integration' },
  { id: 6, name: 'Xero', description: 'Accounting software' },
];

const CredentialsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Credentials</h1><p className="text-gray-500">Manage your integration credentials and connected services</p></div>
      <Button><Plus className="w-4 h-4 mr-2" />Add New Integration</Button>
    </div>

    <div className="grid grid-cols-3 gap-4">
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><Key className="w-8 h-8 text-emerald-500" /><div><p className="text-sm text-gray-500">Active Integrations</p><p className="text-2xl font-bold">{integrations.length}</p></div></div></CardContent></Card>
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><Link2 className="w-8 h-8 text-blue-500" /><div><p className="text-sm text-gray-500">Available</p><p className="text-2xl font-bold">{availableIntegrations.length}</p></div></div></CardContent></Card>
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><CheckCircle className="w-8 h-8 text-emerald-500" /><div><p className="text-sm text-gray-500">Last Sync</p><p className="text-2xl font-bold">30 min</p></div></div></CardContent></Card>
    </div>

    <Card>
      <CardHeader><CardTitle>Connected Integrations</CardTitle><CardDescription>Services currently connected to your account</CardDescription></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Integration</TableHead><TableHead>Type</TableHead><TableHead>Last Sync</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {integrations.map((int) => (
              <TableRow key={int.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2"><Key className="w-4 h-4 text-gray-400" />{int.name}</div></TableCell>
                <TableCell><Badge variant="outline">{int.type}</Badge></TableCell>
                <TableCell className="text-gray-500">{int.lastSync}</TableCell>
                <TableCell><Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge></TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm"><ExternalLink className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Available Integrations</CardTitle><CardDescription>Connect additional services to enhance your workflow</CardDescription></CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {availableIntegrations.map((int) => (
            <div key={int.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <p className="font-medium">{int.name}</p>
              <p className="text-sm text-gray-500 mb-3">{int.description}</p>
              <Button variant="outline" size="sm" className="w-full"><Plus className="w-4 h-4 mr-1" />Connect</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default CredentialsPage;
