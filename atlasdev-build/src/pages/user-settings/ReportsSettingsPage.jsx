import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { BarChart3, Calendar, FileText } from 'lucide-react';

const ReportsSettingsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Reports</h1><p className="text-gray-500">Configure your automated report delivery preferences</p></div>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" />Daily Reports</CardTitle><CardDescription>Reports delivered every day</CardDescription></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Critical Issues</p>
              <p className="text-sm text-gray-500">Delivered at 10:00 AM</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Include PDF</span>
                <Switch defaultChecked />
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" />Weekly Reports</CardTitle><CardDescription>Reports delivered every Monday</CardDescription></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Project Tasks</p>
              <p className="text-sm text-gray-500">All tasks across your projects</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Include PDF</span>
                <Switch />
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Upcoming Closings</p>
              <p className="text-sm text-gray-500">Projects scheduled to close this week</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Include PDF</span>
                <Switch defaultChecked />
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Upcoming Tasks</p>
              <p className="text-sm text-gray-500">Tasks due in the next 7 days</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Include PDF</span>
                <Switch />
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" />Monthly Reports</CardTitle><CardDescription>Reports delivered on the 1st of each month</CardDescription></CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Remaining Balances</p>
              <p className="text-sm text-gray-500">Outstanding balances across entities</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Include PDF</span>
                <Switch defaultChecked />
              </div>
              <Switch defaultChecked />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Portfolio Summary</p>
              <p className="text-sm text-gray-500">Overview of all active projects</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Include PDF</span>
                <Switch defaultChecked />
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ReportsSettingsPage;
