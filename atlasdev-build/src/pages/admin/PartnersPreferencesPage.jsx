import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, MessageSquare, Users } from 'lucide-react';

const PartnersPreferencesPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Partner Notifications</h1><p className="text-gray-500">Configure notifications sent to external partners</p></div>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5" />Investor Notifications</CardTitle><CardDescription>Configure notifications sent to investors</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Capital call notifications</p><p className="text-sm text-gray-500">Notify when capital calls are issued</p></div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Distribution notifications</p><p className="text-sm text-gray-500">Notify when distributions are scheduled</p></div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Quarterly reports</p><p className="text-sm text-gray-500">Send quarterly performance reports</p></div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">K-1 availability</p><p className="text-sm text-gray-500">Notify when K-1 documents are ready</p></div>
          <Switch defaultChecked />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Contractor Notifications</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Draw request approved</p></div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Payment processed</p></div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Change order approved</p></div>
          <Switch defaultChecked />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5" />Lender Notifications</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Draw request submitted</p></div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Monthly progress reports</p></div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Inspection completed</p></div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  </div>
);

export default PartnersPreferencesPage;
