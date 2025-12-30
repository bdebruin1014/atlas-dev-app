import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Globe, Trash2, AlertTriangle } from 'lucide-react';

const AccessControlPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Access Control</h1><p className="text-gray-500">Configure IP addresses that can access AtlasDev</p></div>
    </div>

    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertTriangle className="w-6 h-6 text-yellow-600" />
          <div><p className="font-medium text-yellow-800">No IP restrictions configured</p><p className="text-sm text-yellow-700">All IP addresses can currently access AtlasDev</p></div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-500 mb-4">Add IP addresses to restrict access to AtlasDev. Only users from these IP addresses will be able to log in.</p>
        <div className="flex gap-2">
          <Input placeholder="Enter IP address (e.g., 192.168.1.1)" className="max-w-md" />
          <Button><Plus className="w-4 h-4 mr-2" />Add IP Address</Button>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Allowed IP Addresses</CardTitle><CardDescription>Users can only access AtlasDev from these IP addresses</CardDescription></CardHeader>
      <CardContent>
        <div className="text-center py-8 text-gray-500">
          <Globe className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No IP restrictions configured</p>
          <p className="text-sm">Add IP addresses above to restrict access</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default AccessControlPage;
