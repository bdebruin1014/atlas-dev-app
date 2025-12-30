import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, AlertTriangle } from 'lucide-react';

const ContactsPreferencesPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Contacts Preferences</h1><p className="text-gray-500">Configure contact management settings</p></div>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Search className="w-5 h-5" />Duplicate Check</CardTitle><CardDescription>Configure how the system checks for duplicate contacts</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div><p className="font-medium">Enable duplicate checking</p><p className="text-sm text-gray-500">Warn when creating contacts with similar information</p></div>
          <Switch defaultChecked />
        </div>
        <div className="p-4 border rounded-lg space-y-4">
          <p className="font-medium">Check duplicates by:</p>
          <div className="flex items-center justify-between">
            <span>Email address</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>Phone number</span>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <span>Company name</span>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <span>Full name</span>
            <Switch />
          </div>
        </div>
        <div>
          <p className="font-medium mb-2">When duplicate found:</p>
          <Select defaultValue="warn">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="warn">Show warning, allow creation</SelectItem>
              <SelectItem value="block">Block creation</SelectItem>
              <SelectItem value="suggest">Suggest existing contact</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle>Contact Defaults</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Auto-create contacts from emails</p><p className="text-sm text-gray-500">Create contacts from email addresses in correspondence</p></div>
          <Switch />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Require company for business contacts</p></div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Auto-format phone numbers</p></div>
          <Switch defaultChecked />
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ContactsPreferencesPage;
