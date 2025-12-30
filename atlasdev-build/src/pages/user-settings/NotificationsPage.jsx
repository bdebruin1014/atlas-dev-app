import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, FileText, Calculator, Users, Calendar, MessageSquare, CheckSquare, Building2 } from 'lucide-react';

const notificationCategories = [
  {
    title: 'Subscribed Projects',
    icon: FileText,
    items: [
      { name: 'Budget Alert Generated', value: 'email-app' },
      { name: 'Financial Statement Generated', value: 'email-app' },
      { name: 'Critical Note Added', value: 'in-app' },
      { name: 'Document Added', value: 'none' },
    ]
  },
  {
    title: 'Accounting',
    icon: Calculator,
    items: [
      { name: 'Reconciliation Complete', value: 'email-app' },
      { name: 'Internal Disbursement', value: 'in-app' },
      { name: 'Bill Approval Required', value: 'email-app' },
    ]
  },
  {
    title: 'All Projects',
    icon: Building2,
    items: [
      { name: 'Role Change', value: 'in-app' },
      { name: 'Tagged in Document', value: 'in-app' },
      { name: 'Tagged in Note', value: 'in-app' },
    ]
  },
  {
    title: 'Calendar',
    icon: Calendar,
    items: [
      { name: 'Invited to Appointment', value: 'email-app' },
      { name: 'Rescheduled Appointment', value: 'email-app' },
      { name: 'Appointment Confirmed/Declined', value: 'email-app' },
    ]
  },
  {
    title: 'Tasks',
    icon: CheckSquare,
    items: [
      { name: 'Task Assignment', value: 'email-app' },
      { name: 'Task Ready to Complete', value: 'email-app' },
      { name: 'Milestone Activated', value: 'email-app' },
      { name: 'Bulk Task Assignment', value: 'in-app' },
    ]
  },
  {
    title: 'Investors',
    icon: Users,
    items: [
      { name: 'Investment Inquiry', value: 'email-app' },
      { name: 'Distribution Scheduled', value: 'email-app' },
      { name: 'K-1 Document Ready', value: 'email-app' },
    ]
  },
];

const NotificationsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Notifications</h1><p className="text-gray-500">Customize how you receive notifications</p></div>

    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Email & App</p><p className="text-2xl font-bold text-emerald-600">12</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">In-App Only</p><p className="text-2xl font-bold text-blue-600">8</p></CardContent></Card>
      <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Disabled</p><p className="text-2xl font-bold text-gray-400">2</p></CardContent></Card>
    </div>

    <div className="space-y-6">
      {notificationCategories.map((category) => {
        const Icon = category.icon;
        return (
          <Card key={category.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Icon className="w-5 h-5 text-gray-500" />{category.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium">{item.name}</span>
                    <Select defaultValue={item.value}>
                      <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email-app">Email & App</SelectItem>
                        <SelectItem value="in-app">In-App Only</SelectItem>
                        <SelectItem value="email">Email Only</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  </div>
);

export default NotificationsPage;
