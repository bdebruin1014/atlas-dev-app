import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { User, Building2, Bell, Lock, CreditCard, Users, Database, Mail } from 'lucide-react';

const SettingsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
    
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><User className="w-5 h-5" />Profile</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>First Name</Label><Input defaultValue="Bryan" /></div>
              <div><Label>Last Name</Label><Input defaultValue="V." /></div>
              <div><Label>Email</Label><Input defaultValue="bryan@vanrock.com" type="email" /></div>
              <div><Label>Phone</Label><Input defaultValue="(303) 555-1234" /></div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" />Company</CardTitle>
            <CardDescription>Organization settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Company Name</Label><Input defaultValue="VanRock Holdings LLC" /></div>
              <div><Label>Tax ID</Label><Input defaultValue="XX-XXXXXXX" /></div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" />Notifications</CardTitle>
            <CardDescription>Configure how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="font-medium">Email Notifications</p><p className="text-sm text-gray-500">Receive updates via email</p></div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div><p className="font-medium">Task Reminders</p><p className="text-sm text-gray-500">Get reminded of upcoming tasks</p></div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div><p className="font-medium">Budget Alerts</p><p className="text-sm text-gray-500">Alert when budget exceeds threshold</p></div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="w-5 h-5" />Security</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full">Change Password</Button>
            <Button variant="outline" className="w-full">Enable 2FA</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Database className="w-5 h-5" />Integrations</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between"><span>QuickBooks</span><Badge variant="outline">Not Connected</Badge></div>
            <div className="flex items-center justify-between"><span>SharePoint</span><Badge className="bg-green-500">Connected</Badge></div>
            <div className="flex items-center justify-between"><span>Outlook</span><Badge className="bg-green-500">Connected</Badge></div>
            <Button variant="outline" className="w-full mt-2">Manage Integrations</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Team</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-3">Manage team access and permissions</p>
            <Button variant="outline" className="w-full">Manage Team</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default SettingsPage;
