import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Clock, Mail } from 'lucide-react';

const ConnectPage = () => (
  <div className="p-6 space-y-6 overflow-y-auto h-full bg-[#F7FAFC]">
    <div><h1 className="text-2xl font-bold text-gray-900">Connect</h1><p className="text-gray-500">Configure your communication preferences</p></div>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5" />Out of Office</CardTitle>
        <CardDescription>Set up automatic responses when you're away</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Out of Office Responder</p>
            <p className="text-sm text-gray-500">Automatically reply to new messages</p>
          </div>
          <Switch />
        </div>

        <div className="p-4 border rounded-lg space-y-4">
          <div>
            <Label>Auto-Reply Message</Label>
            <Textarea 
              placeholder="Enter your out of office message..."
              className="mt-2"
              defaultValue="Thank you for your message. I am currently out of the office and will respond when I return. For urgent matters, please contact our office at (303) 555-1234."
            />
          </div>
          <p className="text-sm text-gray-500">
            <Clock className="w-4 h-4 inline mr-1" />
            This message will be sent once every 4 days per conversation thread
          </p>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MessageSquare className="w-5 h-5" />Communication Preferences</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Email notifications for new messages</p>
            <p className="text-sm text-gray-500">Receive email when someone sends you a message</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Desktop notifications</p>
            <p className="text-sm text-gray-500">Show browser notifications for new messages</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium">Sound alerts</p>
            <p className="text-sm text-gray-500">Play a sound when new messages arrive</p>
          </div>
          <Switch />
        </div>
      </CardContent>
    </Card>
  </div>
);

export default ConnectPage;
