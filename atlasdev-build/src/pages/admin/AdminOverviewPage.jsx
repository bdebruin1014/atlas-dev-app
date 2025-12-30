import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Shield, Sliders, ClipboardList, Receipt, GitBranch, FileText, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';

const adminModules = [
  { id: 'organization', title: 'Organization', description: 'Users, permissions, and roles', icon: Building2, path: '/admin/organization/users', stats: { label: 'Users', value: '5' }, color: 'bg-blue-500' },
  { id: 'security', title: 'Security', description: 'Account security and access control', icon: Shield, path: '/admin/security/account', stats: { label: '2FA', value: 'Enabled' }, color: 'bg-purple-500' },
  { id: 'preferences', title: 'Preferences', description: 'System and accounting preferences', icon: Sliders, path: '/admin/preferences/basic', stats: { label: 'Configured', value: 'Yes' }, color: 'bg-emerald-500' },
  { id: 'project-defaults', title: 'Project Defaults', description: 'Default project settings and charges', icon: ClipboardList, path: '/admin/project-defaults/general', stats: { label: 'Templates', value: '4' }, color: 'bg-yellow-500' },
  { id: 'fee-schedule', title: 'Fee Schedule', description: 'Default fees by project type', icon: Receipt, path: '/admin/fee-schedule/default', stats: { label: 'Schedules', value: '3' }, color: 'bg-orange-500' },
  { id: 'workflows', title: 'Workflows', description: 'Automations and task workflows', icon: GitBranch, path: '/admin/workflows/types', stats: { label: 'Active', value: '15' }, color: 'bg-cyan-500' },
  { id: 'documents', title: 'Documents', description: 'Templates and document packages', icon: FileText, path: '/admin/documents/custom', stats: { label: 'Templates', value: '24' }, color: 'bg-pink-500' },
  { id: 'reports', title: 'Reports', description: 'Report packages and K-1 reporting', icon: BarChart3, path: '/admin/reports/packages', stats: { label: 'Packages', value: '6' }, color: 'bg-indigo-500' },
];

const AdminOverviewPage = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
      <div><h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1><p className="text-gray-500">Configure your AtlasDev system settings</p></div>
      
      <div className="grid grid-cols-4 gap-4">
        <Card><CardContent className="pt-4"><div className="flex items-center gap-3"><CheckCircle className="w-8 h-8 text-emerald-500" /><div><p className="text-sm text-gray-500">System Status</p><p className="text-lg font-bold text-emerald-600">All Systems Go</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Active Users</p><p className="text-2xl font-bold">5</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Active Workflows</p><p className="text-2xl font-bold">15</p></CardContent></Card>
        <Card><CardContent className="pt-4"><p className="text-sm text-gray-500">Document Templates</p><p className="text-2xl font-bold">24</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {adminModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Card key={mod.id} className="cursor-pointer hover:shadow-lg transition-all hover:border-emerald-300 group" onClick={() => navigate(mod.path)}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${mod.color} rounded-xl flex items-center justify-center`}><Icon className="w-6 h-6 text-white" /></div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{mod.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{mod.description}</p>
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-400 uppercase">{mod.stats.label}</span>
                  <span className="font-semibold text-gray-700">{mod.stats.value}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOverviewPage;
