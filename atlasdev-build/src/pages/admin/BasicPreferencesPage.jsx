import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hash, Mail, Calendar, MessageSquare } from 'lucide-react';

const BasicPreferencesPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Basic Preferences</h1><p className="text-gray-500">Configure basic system settings</p></div>

    <div className="grid grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Hash className="w-5 h-5" />Project Numbering</CardTitle><CardDescription>Configure how project numbers are generated</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Prefix</Label><Input defaultValue="PRJ-" /></div>
          <div><Label>Starting Number</Label><Input defaultValue="1001" type="number" /></div>
          <div><Label>Format</Label><Select defaultValue="prefix-number"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="prefix-number">PREFIX-NUMBER</SelectItem><SelectItem value="year-number">YEAR-NUMBER</SelectItem><SelectItem value="prefix-year-number">PREFIX-YEAR-NUMBER</SelectItem></SelectContent></Select></div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Include year in number</p></div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5" />Email Templates</CardTitle><CardDescription>Configure email notification templates</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-between">Project Created Notification<span className="text-xs text-gray-400">Edit</span></Button>
          <Button variant="outline" className="w-full justify-between">Task Assignment<span className="text-xs text-gray-400">Edit</span></Button>
          <Button variant="outline" className="w-full justify-between">Draw Request Submitted<span className="text-xs text-gray-400">Edit</span></Button>
          <Button variant="outline" className="w-full justify-between">Investor Distribution<span className="text-xs text-gray-400">Edit</span></Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" />Calendar Settings</CardTitle><CardDescription>Configure calendar defaults</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Default View</Label><Select defaultValue="month"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="day">Day</SelectItem><SelectItem value="week">Week</SelectItem><SelectItem value="month">Month</SelectItem></SelectContent></Select></div>
          <div><Label>Week Starts On</Label><Select defaultValue="sunday"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="sunday">Sunday</SelectItem><SelectItem value="monday">Monday</SelectItem></SelectContent></Select></div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Show weekends</p></div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5" />Startup Messages</CardTitle><CardDescription>Configure messages shown at login</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Show welcome message</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Show system announcements</p></div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div><p className="font-medium">Show pending tasks summary</p></div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
);

export default BasicPreferencesPage;
