import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, CheckCircle, AlertTriangle, XCircle, LogIn, LogOut, Settings, Edit } from 'lucide-react';

const logs = [
  { id: 1, action: 'User login', user: 'bryan@vanrock.com', ip: '192.168.1.100', time: '2 hours ago', status: 'success' },
  { id: 2, action: 'Password changed', user: 'sarah@vanrock.com', ip: '192.168.1.105', time: '1 day ago', status: 'success' },
  { id: 3, action: '2FA enabled', user: 'john@vanrock.com', ip: '192.168.1.110', time: '2 days ago', status: 'success' },
  { id: 4, action: 'Failed login attempt', user: 'unknown@email.com', ip: '45.33.32.156', time: '3 days ago', status: 'failed' },
  { id: 5, action: 'Permission changed', user: 'bryan@vanrock.com', ip: '192.168.1.100', time: '5 days ago', status: 'success' },
  { id: 6, action: 'User invited', user: 'bryan@vanrock.com', ip: '192.168.1.100', time: '1 week ago', status: 'success' },
];

const ActivityLogPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div className="flex justify-between items-center">
      <div><h1 className="text-2xl font-bold text-gray-900">Activity Log</h1><p className="text-gray-500">View security activity log for your organization</p></div>
      <Button variant="outline"><Download className="w-4 h-4 mr-2" />Export Log</Button>
    </div>

    <div className="grid grid-cols-4 gap-4">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Total Events</p><p className="text-2xl font-bold">{logs.length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Successful</p><p className="text-2xl font-bold text-emerald-600">{logs.filter(l => l.status === 'success').length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Failed</p><p className="text-2xl font-bold text-red-600">{logs.filter(l => l.status === 'failed').length}</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Warnings</p><p className="text-2xl font-bold text-yellow-600">0</p></CardContent></Card>
    </div>

    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <div className="relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input placeholder="Search logs..." className="pl-9" /></div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Action</TableHead><TableHead>User</TableHead><TableHead>IP Address</TableHead><TableHead>Time</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium"><div className="flex items-center gap-2">{log.status === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-red-500" />}{log.action}</div></TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                <TableCell className="text-gray-500">{log.time}</TableCell>
                <TableCell><Badge className={log.status === 'success' ? 'bg-green-500' : 'bg-red-500'}>{log.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default ActivityLogPage;
