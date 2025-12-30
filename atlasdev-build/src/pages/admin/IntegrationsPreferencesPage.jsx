import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Link2, Building2, FileSignature, Calculator, Database, CheckCircle } from 'lucide-react';

const integrations = [
  { id: 1, name: 'Lender Integration', description: 'Connect to lender portals for draw requests', icon: Building2, status: 'available', connected: false },
  { id: 2, name: 'Notary Services', description: 'Digital notarization services', icon: FileSignature, status: 'available', connected: false },
  { id: 3, name: 'Accounting Software', description: 'Sync with QuickBooks or Xero', icon: Calculator, status: 'available', connected: true },
  { id: 4, name: 'Asset Resource Center', description: 'Property data and analytics', icon: Database, status: 'available', connected: false },
];

const IntegrationsPreferencesPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Integrations</h1><p className="text-gray-500">Connect external services and configure integrations</p></div>

    <div className="grid grid-cols-2 gap-4">
      {integrations.map((int) => {
        const Icon = int.icon;
        return (
          <Card key={int.id}>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center"><Icon className="w-6 h-6 text-blue-600" /></div>
                {int.connected && <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Connected</Badge>}
              </div>
              <h3 className="font-semibold">{int.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{int.description}</p>
              <Button variant={int.connected ? "outline" : "default"} className="w-full">{int.connected ? 'Configure' : 'Connect'}</Button>
            </CardContent>
          </Card>
        );
      })}
    </div>

    <Card>
      <CardHeader><CardTitle>Integration Settings</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Auto-sync data</p><p className="text-sm text-gray-500">Automatically sync data every hour</p></div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Sync notifications</p><p className="text-sm text-gray-500">Notify on sync errors</p></div>
          <Switch defaultChecked />
        </div>
      </CardContent>
    </Card>
  </div>
);

export default IntegrationsPreferencesPage;
