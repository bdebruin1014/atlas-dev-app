import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Smartphone, Key, Lock, LogOut, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';

const securityEvents = [
  { id: 1, type: 'Login', time: '2 hours ago', ip: '192.168.1.100', location: 'Denver, CO', status: 'success' },
  { id: 2, type: 'Password Changed', time: '5 days ago', ip: '192.168.1.100', location: 'Denver, CO', status: 'success' },
  { id: 3, type: '2FA Enabled', time: '1 week ago', ip: '192.168.1.100', location: 'Denver, CO', status: 'success' },
  { id: 4, type: 'Login', time: '1 week ago', ip: '45.33.32.156', location: 'Unknown', status: 'failed' },
];

const SecurityPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Security</h1><p className="text-gray-500">Manage your account security settings</p></div>

    <div className="grid grid-cols-3 gap-4">
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><Shield className="w-8 h-8 text-emerald-500" /><div><p className="text-sm text-gray-500">Security Status</p><p className="text-xl font-bold text-emerald-600">Strong</p></div></div></CardContent></Card>
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><Smartphone className="w-8 h-8 text-blue-500" /><div><p className="text-sm text-gray-500">2FA Status</p><p className="text-xl font-bold">Enabled</p></div></div></CardContent></Card>
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><Key className="w-8 h-8 text-purple-500" /><div><p className="text-sm text-gray-500">Last Password Change</p><p className="text-xl font-bold">5 days ago</p></div></div></CardContent></Card>
    </div>

    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Current Password</Label><Input type="password" placeholder="Enter current password" /></div>
          <div><Label>New Password</Label><Input type="password" placeholder="Enter new password" /></div>
          <div><Label>Confirm New Password</Label><Input type="password" placeholder="Confirm new password" /></div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Two-Factor Authentication</CardTitle><CardDescription>Add an extra layer of security to your account</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2"><CheckCircle className="w-5 h-5 text-emerald-600" /><p className="font-medium">2FA is Enabled</p></div>
            <p className="text-sm text-gray-500">Your account is protected with two-factor authentication</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div><p className="font-medium">Authenticator App</p><p className="text-sm text-gray-500">Google Authenticator configured</p></div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div><p className="font-medium">SMS Verification</p><p className="text-sm text-gray-500">***-***-1234</p></div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recovery Codes</CardTitle><CardDescription>Use these codes if you lose access to your 2FA device</CardDescription></CardHeader>
        <CardContent>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
            <div className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-600" /><p className="text-sm">Keep these codes in a safe place</p></div>
          </div>
          <Button variant="outline">View Recovery Codes</Button>
          <Button variant="ghost" className="ml-2">Generate New Codes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Active Sessions</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <div><p className="font-medium">Current Session</p><p className="text-sm text-gray-500">Denver, CO • Chrome on Mac</p></div>
              <Badge className="bg-emerald-500">Active</Badge>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4"><LogOut className="w-4 h-4 mr-2" />Log Out Other Devices</Button>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader><CardTitle>Security Events This Month</CardTitle></CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Event</TableHead><TableHead>Time</TableHead><TableHead>IP Address</TableHead><TableHead>Location</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
          <TableBody>
            {securityEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.type}</TableCell>
                <TableCell className="text-gray-500">{event.time}</TableCell>
                <TableCell className="font-mono text-sm">{event.ip}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell><Badge className={event.status === 'success' ? 'bg-green-500' : 'bg-red-500'}>{event.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default SecurityPage;
