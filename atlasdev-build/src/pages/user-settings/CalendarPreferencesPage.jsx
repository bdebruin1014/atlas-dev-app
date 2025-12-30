import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Globe } from 'lucide-react';

const CalendarPreferencesPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Calendar Preferences</h1><p className="text-gray-500">Configure your calendar display settings</p></div>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5" />Timezone</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Your Timezone</Label>
          <Select defaultValue="mst">
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="pst">Pacific Time (PT)</SelectItem>
              <SelectItem value="mst">Mountain Time (MT)</SelectItem>
              <SelectItem value="cst">Central Time (CT)</SelectItem>
              <SelectItem value="est">Eastern Time (ET)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Disable Timezone Prompts</p><p className="text-sm text-gray-500">Don't prompt when location differs from timezone</p></div>
          <Switch />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5" />Display Options</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Show Weekends</p><p className="text-sm text-gray-500">Display Saturday and Sunday on calendar</p></div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div><p className="font-medium">Start on Mondays</p><p className="text-sm text-gray-500">Begin week on Monday instead of Sunday</p></div>
          <Switch />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" />Visible Hours</CardTitle><CardDescription>Set the hours shown on your calendar view</CardDescription></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Earliest Hour</Label>
            <Select defaultValue="8">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[6,7,8,9,10].map(h => <SelectItem key={h} value={String(h)}>{h}:00 AM</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Latest Hour</Label>
            <Select defaultValue="18">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {[17,18,19,20,21,22].map(h => <SelectItem key={h} value={String(h)}>{h > 12 ? h-12 : h}:00 {h >= 12 ? 'PM' : 'AM'}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    <div className="flex justify-end"><Button>Save Preferences</Button></div>
  </div>
);

export default CalendarPreferencesPage;
