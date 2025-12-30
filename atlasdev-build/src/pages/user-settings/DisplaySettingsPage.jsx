import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Palette, Monitor, Layout, Type } from 'lucide-react';

const DisplaySettingsPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Display Settings</h1><p className="text-gray-500">Customize how AtlasDev looks for you</p></div>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5" />Theme</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border-2 border-emerald-500 rounded-lg text-center cursor-pointer">
            <div className="w-full h-12 bg-white rounded mb-2 border"></div>
            <p className="font-medium">Light</p>
          </div>
          <div className="p-4 border rounded-lg text-center cursor-pointer hover:border-gray-400">
            <div className="w-full h-12 bg-gray-800 rounded mb-2"></div>
            <p className="font-medium">Dark</p>
          </div>
          <div className="p-4 border rounded-lg text-center cursor-pointer hover:border-gray-400">
            <div className="w-full h-12 bg-gradient-to-r from-white to-gray-800 rounded mb-2"></div>
            <p className="font-medium">System</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Layout className="w-5 h-5" />Tab Identifier</CardTitle><CardDescription>Configure how project tabs are identified</CardDescription></CardHeader>
      <CardContent>
        <div>
          <Label>Tab Display</Label>
          <Select defaultValue="address">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="address">Property Address</SelectItem>
              <SelectItem value="name">Project Name</SelectItem>
              <SelectItem value="number">Project Number</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Type className="w-5 h-5" />Text Size</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Compact Mode</p><p className="text-sm text-gray-500">Use smaller text and tighter spacing</p></div>
          <Switch defaultChecked />
        </div>
      </CardContent>
    </Card>

    <div className="flex justify-end"><Button>Save Settings</Button></div>
  </div>
);

export default DisplaySettingsPage;
