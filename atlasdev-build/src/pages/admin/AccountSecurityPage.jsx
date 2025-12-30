import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Shield, Smartphone, Key, Clock, CheckCircle } from 'lucide-react';

const AccountSecurityPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Account Security</h1><p className="text-gray-500">Configure security settings for user accounts</p></div>

    <div className="grid grid-cols-3 gap-4">
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center"><Shield className="w-5 h-5 text-emerald-600" /></div><div><p className="text-sm text-gray-500">Security Score</p><p className="text-xl font-bold text-emerald-600">Excellent</p></div></div></CardContent></Card>
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"><Smartphone className="w-5 h-5 text-blue-600" /></div><div><p className="text-sm text-gray-500">2FA Enabled</p><p className="text-xl font-bold">Yes</p></div></div></CardContent></Card>
      <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Clock className="w-5 h-5 text-purple-600" /></div><div><p className="text-sm text-gray-500">Session Timeout</p><p className="text-xl font-bold">30 min</p></div></div></CardContent></Card>
    </div>

    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Two-Factor Authentication</CardTitle><CardDescription>Require 2FA for all users</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <div className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-emerald-600" /><div><p className="font-medium">2FA is enabled</p><p className="text-sm text-gray-500">All users must use two-factor authentication</p></div></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Allow SMS verification</p><p className="text-sm text-gray-500">Users can receive codes via SMS</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Allow authenticator apps</p><p className="text-sm text-gray-500">Google Authenticator, Authy, etc.</p></div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Password Policy</CardTitle><CardDescription>Configure password requirements</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Minimum length</p><p className="text-sm text-gray-500">Require at least 8 characters</p></div>
            <Badge variant="outline">8 characters</Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Require special characters</p><p className="text-sm text-gray-500">At least one special character</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Password expiration</p><p className="text-sm text-gray-500">Require change every 90 days</p></div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-2">
        <CardHeader><CardTitle>Session Settings</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div><p className="font-medium">Session timeout</p><p className="text-sm text-gray-500">Auto logout after inactivity</p></div>
              <Badge variant="outline">30 minutes</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div><p className="font-medium">Concurrent sessions</p><p className="text-sm text-gray-500">Allow multiple logins</p></div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div><p className="font-medium">Remember device</p><p className="text-sm text-gray-500">Skip 2FA on trusted devices</p></div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default AccountSecurityPage;
